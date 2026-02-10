(() => {
  let currentLanguage =
    localStorage.getItem("selectedLanguage") || getDetectedLanguage();

  function getDetectedLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const lang = browserLang.split("-")[0];
    const supported = [
      "en",
      "de",
      "fr",
      "it",
      "es",
      "pt",
      "ja",
      "ru",
      "uk",
      "zh",
      "hi",
    ];
    return supported.includes(lang) ? lang : "en";
  }

  async function loadTranslations(lang) {
    try {
      const response = await fetch(`./lang/${lang}.json`);
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      return null;
    }
  }

  function applyTranslations(translations) {
    if (!translations) return;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = getNestedValue(translations, key);
      if (value === null || value === undefined) return;
      if (el.getAttribute("data-i18n-html") === "true") {
        el.innerHTML = value;
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      const value = getNestedValue(translations, key);
      if (value) el.placeholder = value;
    });

    // Mark page as ready for i18n - makes translatable content visible
    document.documentElement.classList.add("i18n-ready");
  }

  function translateModals(translations) {
    const modalMap = {
      "brand-identity-modal": "modals.brandIdentity",
      "digital-products-modal": "modals.digitalProducts",
      "business-strategy-modal": "modals.businessStrategy",
      "consulting-services-modal": "modals.consultingServices",
      "grid-strategy-modal": "modals.gridStrategy",
      "grid-design-modal": "modals.gridDesign",
      "grid-scaling-modal": "modals.gridScaling",
      "grid-consulting-modal": "modals.gridConsulting",
      "process-discovery-modal": "modals.processDiscovery",
      "process-strategy-modal": "modals.processStrategy",
      "process-execution-modal": "modals.processExecution",
      "process-optimization-modal": "modals.processOptimization",
      "terms-modal": "modals.terms",
      "imprint-modal": "modals.imprint",
      "privacy-modal": "modals.privacy",
    };

    Object.entries(modalMap).forEach(([id, path]) => {
      const modal = document.getElementById(id);
      if (!modal) return;
      const h1 = modal.querySelector(".modal-body h1");
      const title = getNestedValue(translations, `${path}.title`);
      if (h1 && title) h1.textContent = title;
    });
  }

  function getNestedValue(obj, path) {
    return path.split(".").reduce((o, p) => o?.[p], obj);
  }

  function applyLanguageTypography(lang) {
    document.documentElement.lang = lang;

    document.documentElement.style.wordBreak = "";
    document.documentElement.style.hyphens = "";
    document.documentElement.style.overflowWrap = "break-word";

    if (lang === "zh" || lang === "ja") {
      document.documentElement.style.wordBreak = "break-all";
      document.documentElement.style.hyphens = "none";
    } else if (lang === "hi") {
      document.documentElement.style.wordBreak = "normal";
      document.documentElement.style.hyphens = "none";
    } else {
      document.documentElement.style.wordBreak = "normal";
      document.documentElement.style.hyphens = "auto";
    }
  }

  async function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem("selectedLanguage", lang);
    applyLanguageTypography(lang);
    const translations = await loadTranslations(lang);
    applyTranslations(translations);
    updateLanguageButton();

    if (lang === "en") {
      window.location.reload();
    }
  }

  function updateLanguageButton() {
    document.querySelectorAll(".lang-option").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === currentLanguage);
    });
  }

  document.querySelectorAll(".lang-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.preventDefault();
      const lang = option.dataset.lang;
      switchLanguage(lang);
    });
  });

  (async () => {
    applyLanguageTypography(currentLanguage);
    updateLanguageButton();
    const translations = await loadTranslations(currentLanguage);
    applyTranslations(translations);
  })();
})();
