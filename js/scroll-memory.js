(() => {
  const currentPage = window.location.pathname;
  const scrollKey = `scroll-position-${currentPage}`;
  let isRestoringScroll = false;
  function restoreScrollPosition() {
    const savedScrollPosition = sessionStorage.getItem(scrollKey);
    if (savedScrollPosition !== null) {
      isRestoringScroll = true;
      const targetScroll = parseInt(savedScrollPosition, 10);
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: targetScroll,
          left: 0,
          behavior: "auto",
        });
        setTimeout(() => {
          isRestoringScroll = false;
        }, 100);
      });
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restoreScrollPosition);
  } else {
    restoreScrollPosition();
  }
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      if (isRestoringScroll) {
        return;
      }
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        sessionStorage.setItem(scrollKey, window.scrollY.toString());
      }, 150);
    },
    { passive: true },
  );
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      const currentScrollKey = `scroll-position-${window.location.pathname}`;
      const savedPosition = sessionStorage.getItem(currentScrollKey);
      if (savedPosition !== null) {
        isRestoringScroll = true;
        window.scrollTo(0, parseInt(savedPosition, 10));
        setTimeout(() => {
          isRestoringScroll = false;
        }, 100);
      }
    }
  });
  window.addEventListener("beforeunload", () => {});
})();
