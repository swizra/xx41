(() => {
  const body = document.body;
  const html = document.documentElement;
  let currentTheme = localStorage.getItem("theme") || "auto";
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const systemPrefersDark = () => mediaQuery.matches;
  function applyTheme(theme, animate = false) {
    if (animate) {
      html.classList.add("theme-transition");
      body.classList.add("theme-transition");
    }
    html.classList.remove("dark-mode", "light-mode");
    body.classList.remove("dark-mode", "light-mode");
    if (theme === "auto") {
      if (systemPrefersDark()) {
        html.classList.add("dark-mode");
        body.classList.add("dark-mode");
      } else {
        html.classList.add("light-mode");
        body.classList.add("light-mode");
      }
    } else if (theme === "dark") {
      html.classList.add("dark-mode");
      body.classList.add("dark-mode");
    } else {
      html.classList.add("light-mode");
      body.classList.add("light-mode");
    }
    if (animate) {
      setTimeout(() => {
        html.classList.remove("theme-transition");
        body.classList.remove("theme-transition");
      }, 600);
    }
  }
  function updateThemeButton() {
    document.querySelectorAll(".theme-option").forEach((btn) => {
      btn.classList.toggle(
        "active",
        btn.getAttribute("data-theme") === currentTheme,
      );
    });
  }
  applyTheme(currentTheme, false);
  function setupThemeButtons() {
    updateThemeButton();
    document.querySelectorAll(".theme-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        e.preventDefault();
        const theme = option.getAttribute("data-theme");
        currentTheme = theme;
        localStorage.setItem("theme", theme);
        applyTheme(theme, true);
        updateThemeButton();
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupThemeButtons);
  } else {
    setupThemeButtons();
  }
  const handleSystemThemeChange = () => {
    if (currentTheme === "auto") {
      applyTheme("auto", true);
      updateThemeButton();
    }
  };
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener("change", handleSystemThemeChange);
  } else if (mediaQuery.addListener) {
    mediaQuery.addListener(handleSystemThemeChange);
  }
})();
