export function initScrollCover() {
  const cover = document.querySelector("[data-scroll-cover]");

  if (!cover) return;

  const setCoverProgress = (progress) => {
    const isMobile = window.innerWidth < 720;
    const startWidth = isMobile ? Math.min(window.innerWidth * 0.92, 480) : Math.min(window.innerWidth * 0.58, 760);
    const endWidth = Math.min(window.innerWidth * 0.96, isMobile ? 760 : 1320);
    const startHeight = isMobile ? Math.min(window.innerHeight * 0.66, 590) : Math.min(window.innerHeight * 0.66, 660);
    const endHeight = Math.min(window.innerHeight * 0.86, isMobile ? 680 : 820);
    const width = startWidth + (endWidth - startWidth) * progress;
    const height = startHeight + (endHeight - startHeight) * progress;
    const shift = (isMobile ? 28 : 92) * progress;
    const contentOffset = isMobile ? 0 : -Math.min(window.innerWidth * 0.18, 280) * progress;
    const actionOpacity = Math.min(Math.max((progress - 0.18) / 0.42, 0), 1);

    if (progress >= 1) {
      cover.classList.add("is-expanded");
    }

    cover.style.setProperty("--cover-progress", progress.toFixed(3));
    cover.style.setProperty("--cover-media-width", `${width}px`);
    cover.style.setProperty("--cover-media-height", `${height}px`);
    cover.style.setProperty("--cover-title-shift", `${shift}px`);
    cover.style.setProperty("--cover-content-offset", `${contentOffset}px`);
    cover.style.setProperty("--cover-actions-opacity", actionOpacity.toFixed(3));
  };

  setCoverProgress(1);
  window.addEventListener("resize", () => setCoverProgress(1));
}
