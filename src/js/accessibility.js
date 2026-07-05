export function initAccessibilityPanel() {
  const accessibilityPanel = document.getElementById("accessibility-panel");
  const accessibilityOpen = document.getElementById("accessibility-open");
  const accessibilityClose = document.getElementById("accessibility-close");
  const accessibilitySeen = localStorage.getItem("accessibility-seen") === "true";

  function setAccessibilityExpanded(isExpanded) {
    accessibilityPanel.classList.toggle("is-collapsed", !isExpanded);
    accessibilityOpen.setAttribute("aria-expanded", String(isExpanded));
    if (!isExpanded) {
      localStorage.setItem("accessibility-seen", "true");
    }
  }

  setAccessibilityExpanded(!accessibilitySeen);

  accessibilityOpen.addEventListener("click", () => {
    setAccessibilityExpanded(true);
  });

  document.querySelectorAll("[data-open-accessibility]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      setAccessibilityExpanded(true);
      accessibilityPanel.scrollIntoView({ block: "nearest" });
    });
  });

  accessibilityClose.addEventListener("click", () => {
    setAccessibilityExpanded(false);
    accessibilityOpen.focus();
  });

  const accessibilityButtons = document.querySelectorAll("[data-toggle-class]");

  accessibilityButtons.forEach((button) => {
    const className = button.getAttribute("data-toggle-class");
    const saved = localStorage.getItem(className) === "true";

    if (saved) {
      document.body.classList.add(className);
      button.setAttribute("aria-pressed", "true");
    }

    button.addEventListener("click", () => {
      const isActive = document.body.classList.toggle(className);
      button.setAttribute("aria-pressed", String(isActive));
      localStorage.setItem(className, String(isActive));
    });
  });
}
