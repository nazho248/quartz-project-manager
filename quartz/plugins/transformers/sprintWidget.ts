import { Root as HTMLRoot, Element, ElementContent } from "hast"
import { visit } from "unist-util-visit"
import { toString } from "hast-util-to-string"
import { toHtml } from "hast-util-to-html"
import { QuartzTransformerPlugin } from "../types"

export interface Options {
  actualTag: string
  backlogTag: string
  ganttChartTag: string
  maxDepth: 1 | 2 | 3 | 4 | 5 | 6
}

const defaultOptions: Options = {
  actualTag: "actual",
  backlogTag: "backlog",
  ganttChartTag: "ganttchart",
  maxDepth: 4,
}

export interface SprintSection {
  id: string
  title: string
  type: "actual" | "backlog"
  content: string
}

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"])

function getHeadingLevel(tagName: string): number {
  return parseInt(tagName.charAt(1), 10)
}

function isHeading(node: ElementContent): node is Element {
  return node.type === "element" && headingTags.has(node.tagName)
}

// Check if a heading contains a tag link (OFM converts #tag to <a href="/tags/tag">)
function findTagInHeading(heading: Element, tagName: string): boolean {
  let found = false
  visit(heading, "element", (node: Element) => {
    if (node.tagName === "a") {
      const href = (node.properties?.href as string) || ""
      // Check if it's a tag link: /tags/tagname or just contains the tag text
      if (
        href.toLowerCase().includes(`/tags/${tagName.toLowerCase()}`) ||
        toString(node).toLowerCase() === tagName.toLowerCase()
      ) {
        found = true
      }
    }
  })
  // Also check the raw text for cases where tags aren't converted to links
  const headingText = toString(heading).toLowerCase()
  if (headingText.includes(`#${tagName.toLowerCase()}`)) {
    found = true
  }
  return found
}

// Remove tag links from heading text for clean title
function cleanHeadingTitle(heading: Element, tagsToRemove: string[]): string {
  let text = toString(heading)

  // Remove #tag patterns
  for (const tag of tagsToRemove) {
    text = text.replace(new RegExp(`#?${tag}`, "gi"), "")
  }

  return text.trim()
}

export const SprintWidget: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }

  return {
    name: "SprintWidget",
    htmlPlugins() {
      return [
        () => {
          return async (tree: HTMLRoot, file) => {
            const sections: SprintSection[] = []
            let hasGanttChart = false

            // First pass: find all sprint sections and check for gantt chart tag
            visit(tree, "element", (node, index, parent) => {
              if (!isHeading(node) || index === undefined || !parent) return

              const headingLevel = getHeadingLevel(node.tagName)
              if (headingLevel > opts.maxDepth) return

              const headingId = (node.properties?.id as string) || ""

              // Check for gantt chart tag
              if (findTagInHeading(node, opts.ganttChartTag)) {
                hasGanttChart = true
              }

              // Determine section type by looking for tag links
              let sectionType: "actual" | "backlog" | null = null
              if (findTagInHeading(node, opts.actualTag)) {
                sectionType = "actual"
              } else if (findTagInHeading(node, opts.backlogTag)) {
                sectionType = "backlog"
              }

              if (!sectionType) return

              // Extract content from this heading until the next heading of same or higher level
              const parentChildren = parent.children as ElementContent[]
              const contentNodes: ElementContent[] = []

              for (let i = index + 1; i < parentChildren.length; i++) {
                const sibling = parentChildren[i]

                // Stop if we hit another heading of same or higher level
                if (isHeading(sibling) && getHeadingLevel(sibling.tagName) <= headingLevel) {
                  break
                }

                contentNodes.push(sibling)
              }

              // Serialize content to HTML
              const contentHtml = contentNodes
                .map((n) => toHtml(n))
                .join("")
                .trim()

              if (contentHtml) {
                // Clean the title (remove the tags from display)
                const cleanTitle = cleanHeadingTitle(node, [
                  opts.actualTag,
                  opts.backlogTag,
                  opts.ganttChartTag,
                ])

                sections.push({
                  id: headingId,
                  title: cleanTitle,
                  type: sectionType,
                  content: contentHtml,
                })
              }
            })

            // Store in file data
            if (sections.length > 0) {
              file.data.sprintSections = sections
            }
            file.data.hasGanttChart = hasGanttChart
          }
        },
      ]
    },
  }
}

declare module "vfile" {
  interface DataMap {
    sprintSections: SprintSection[]
    hasGanttChart: boolean
  }
}
