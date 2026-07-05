export function initInsightTabs() {
  const tabsRoot = document.querySelector(".insight-tabs");

  if (!tabsRoot) return;

  const tabButtons = Array.from(tabsRoot.querySelectorAll(".tab-button"));
  const panels = Array.from(tabsRoot.querySelectorAll(".tab-panel"));
  const carousels = Array.from(tabsRoot.querySelectorAll("[data-carousel]"));

  const setCarouselSlide = (carousel, nextIndex) => {
    const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-carousel-dot]"));

    if (!slides.length) return;

    const activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.classList.toggle("active", isActive);
      slide.hidden = !isActive;
    });

    carousel.dataset.activeSlide = String(activeIndex);

    dots.forEach((dot, index) => {
      const isActive = index === activeIndex;
      dot.classList.toggle("active", isActive);
      dot.setAttribute("aria-selected", String(isActive));
    });
  };

  const activateTab = (button) => {
    const target = button.dataset.tab;

    tabButtons.forEach((tabButton) => {
      const isActive = tabButton === button;
      tabButton.classList.toggle("active", isActive);
      tabButton.setAttribute("aria-selected", String(isActive));
      tabButton.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.panel === target;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  };

  tabButtons.forEach((button, index) => {
    button.addEventListener("click", () => activateTab(button));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

      event.preventDefault();

      let nextIndex = index;

      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabButtons.length;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabButtons.length - 1;

      tabButtons[nextIndex].focus();
      activateTab(tabButtons[nextIndex]);
    });
  });

  carousels.forEach((carousel) => {
    const previousButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
    const dots = carousel.querySelector("[data-carousel-dots]");

    if (dots) {
      dots.innerHTML = "";

      slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = "carousel-dot";
        dot.type = "button";
        dot.dataset.carouselDot = "";
        dot.setAttribute("aria-label", `Show item ${index + 1}`);
        dot.addEventListener("click", () => setCarouselSlide(carousel, index));
        dots.append(dot);
      });
    }

    setCarouselSlide(carousel, 0);

    previousButton?.addEventListener("click", () => {
      const activeIndex = Number(carousel.dataset.activeSlide || 0);
      setCarouselSlide(carousel, activeIndex - 1);
    });

    nextButton?.addEventListener("click", () => {
      const activeIndex = Number(carousel.dataset.activeSlide || 0);
      setCarouselSlide(carousel, activeIndex + 1);
    });
  });
}
