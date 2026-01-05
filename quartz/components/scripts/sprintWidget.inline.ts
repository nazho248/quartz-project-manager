function setupSprintWidget() {
  const widgets = document.querySelectorAll(".sprint-widget")

  for (const widget of widgets) {
    const tabs = widget.querySelectorAll<HTMLButtonElement>(".sprint-tab")
    const panels = widget.querySelectorAll<HTMLElement>(".sprint-panel")
    const gotoLinks = widget.querySelectorAll<HTMLAnchorElement>(".sprint-goto")

    // Tab switching
    function switchTab(this: HTMLButtonElement) {
      const targetTab = this.dataset.tab
      if (!targetTab) return

      // Update tab active states
      tabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.tab === targetTab)
      })

      // Update panel visibility
      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === targetTab)
      })
    }

    tabs.forEach((tab) => {
      tab.addEventListener("click", switchTab)
      window.addCleanup(() => tab.removeEventListener("click", switchTab))
    })

    // Smooth scroll to section
    function scrollToSection(this: HTMLAnchorElement, e: Event) {
      e.preventDefault()
      const href = this.getAttribute("href")
      if (!href) return

      const targetId = href.substring(1) // Remove the #
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Update URL without triggering navigation
        history.pushState(null, "", href)

        // Highlight the target briefly
        targetElement.classList.add("sprint-highlight")
        setTimeout(() => {
          targetElement.classList.remove("sprint-highlight")
        }, 2000)
      }
    }

    gotoLinks.forEach((link) => {
      link.addEventListener("click", scrollToSection)
      window.addCleanup(() => link.removeEventListener("click", scrollToSection))
    })
  }
}

document.addEventListener("nav", setupSprintWidget)
