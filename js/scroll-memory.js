(() => {
  // Store the current page URL
  const currentPage = window.location.pathname;
  const scrollKey = `scroll-position-${currentPage}`;

  // Flag to prevent saving immediately after restoration
  let isRestoringScroll = false;

  // Restore scroll position on DOMContentLoaded (more reliable than page load)
  function restoreScrollPosition() {
    const savedScrollPosition = sessionStorage.getItem(scrollKey);
    if (savedScrollPosition !== null) {
      isRestoringScroll = true;
      const targetScroll = parseInt(savedScrollPosition, 10);

      // Use requestAnimationFrame for smooth restoration
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: targetScroll,
          left: 0,
          behavior: "auto", // Use auto to prevent smooth scroll animation
        });

        // Re-enable saving after a brief delay
        setTimeout(() => {
          isRestoringScroll = false;
        }, 100);
      });
    }
  }

  // Trigger restoration when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", restoreScrollPosition);
  } else {
    // DOM is already loaded
    restoreScrollPosition();
  }

  // Save scroll position as user scrolls (debounced)
  let scrollTimeout;
  window.addEventListener(
    "scroll",
    () => {
      // Don't save if we're in the middle of restoring
      if (isRestoringScroll) {
        return;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        sessionStorage.setItem(scrollKey, window.scrollY.toString());
      }, 150); // Debounce to avoid excessive writes
    },
    { passive: true },
  );

  // Handle back/forward cache restoration
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      // Page was restored from back/forward cache
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

  // Clear scroll position when unloading for navigation (not refresh)
  window.addEventListener("beforeunload", () => {
    // Check if this is a navigation vs refresh
    // For refresh, we want to keep the position (which we do via sessionStorage)
  });
})();
