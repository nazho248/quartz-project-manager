import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Quartz 4",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "quartz.jzhao.xyz",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Schibsted Grotesk",
        body: "Source Sans Pro",
        code: "IBM Plex Mono",
      },
colors: {
  lightMode: {
    light: "#fdf6f0",    
    lightgray: "#f0ddd1",
    gray: "#c9ab94",     
    darkgray: "#5a4a3e", 
    dark: "#2a1f1a",     
    secondary: "#26A69A",
    tertiary: "#d4886c", 
    highlight: "rgba(38, 166, 154, 0.15)",
    textHighlight: "#ffd97388",
  },
  darkMode: {
    light: "#1c1814",           
    lightgray: "#352d26",       
    gray: "#6b5c50",            
    darkgray: "#d9c8b8",        
    dark: "#f5ebe1",            
    secondary: "#4db8ac",       
    tertiary: "#e89b7e",        
    highlight: "rgba(77, 184, 172, 0.15)",
    textHighlight: "#ffb86688",
  },

      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({
         markdownLinkResolution: "shortest",
         openLinksInNewTab : true
        
        }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      Plugin.SprintWidget(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
