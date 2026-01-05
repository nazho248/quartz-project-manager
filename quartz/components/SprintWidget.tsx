import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import style from "./styles/sprintWidget.scss"
// @ts-ignore
import script from "./scripts/sprintWidget.inline"

interface Options {
  showOnIndex: boolean
  defaultTab: "actual" | "backlog"
}

const defaultOptions: Options = {
  showOnIndex: true,
  defaultTab: "actual",
}

export default ((userOpts?: Partial<Options>) => {
  const opts = { ...defaultOptions, ...userOpts }

  const SprintWidget: QuartzComponent = ({
    fileData,
    displayClass,
  }: QuartzComponentProps) => {
    const sections = fileData.sprintSections
    const hasGanttChart = fileData.hasGanttChart
    const slug = fileData.slug || ""
    const isIndex = slug === "index" || slug.endsWith("/index")
    const isFolderIndex = slug.includes("/") && slug.endsWith("/index")
    const showWidget = fileData.frontmatter?.sprintWidget

    // Check if we should render
    // Show on: index pages, folder index pages, pages with #ganttchart, or explicit sprintWidget: true
    const shouldRender =
      sections &&
      sections.length > 0 &&
      (showWidget || (opts.showOnIndex && isIndex) || isFolderIndex || hasGanttChart)

    if (!shouldRender) {
      return null
    }

    // Separate sections by type
    const actualSections = sections.filter((s) => s.type === "actual")
    const backlogSections = sections.filter((s) => s.type === "backlog")

    const hasActual = actualSections.length > 0
    const hasBacklog = backlogSections.length > 0

    // Determine initial tab
    const initialTab = hasActual ? "actual" : "backlog"

    return (
      <div
        class={classNames(displayClass, "sprint-widget")}
        data-default-tab={opts.defaultTab}
      >
        {/* Tab headers */}
        <div class="sprint-tabs">
          {hasActual && (
            <button
              type="button"
              class={`sprint-tab ${initialTab === "actual" ? "active" : ""}`}
              data-tab="actual"
            >
              Actual
              <span class="sprint-count">{actualSections.length}</span>
            </button>
          )}
          {hasBacklog && (
            <button
              type="button"
              class={`sprint-tab ${initialTab === "backlog" ? "active" : ""}`}
              data-tab="backlog"
            >
              Backlog
              <span class="sprint-count">{backlogSections.length}</span>
            </button>
          )}
        </div>

        {/* Tab content */}
        <div class="sprint-content">
          {/* Actual tab */}
          {hasActual && (
            <div
              class={`sprint-panel ${initialTab === "actual" ? "active" : ""}`}
              data-panel="actual"
            >
              {actualSections.map((section) => (
                <div class="sprint-section" key={section.id}>
                  <div class="sprint-section-header">
                    <h4 class="sprint-section-title">{section.title}</h4>
                    <a
                      href={`#${section.id}`}
                      class="sprint-goto"
                      title="Ir a la sección"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </a>
                  </div>
                  <div
                    class="sprint-section-content"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Backlog tab */}
          {hasBacklog && (
            <div
              class={`sprint-panel ${initialTab === "backlog" ? "active" : ""}`}
              data-panel="backlog"
            >
              {backlogSections.map((section) => (
                <div class="sprint-section" key={section.id}>
                  <div class="sprint-section-header">
                    <h4 class="sprint-section-title">{section.title}</h4>
                    <a
                      href={`#${section.id}`}
                      class="sprint-goto"
                      title="Ir a la sección"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M7 17L17 7" />
                        <path d="M7 7h10v10" />
                      </svg>
                    </a>
                  </div>
                  <div
                    class="sprint-section-content"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  SprintWidget.css = style
  SprintWidget.afterDOMLoaded = script

  return SprintWidget
}) satisfies QuartzComponentConstructor
