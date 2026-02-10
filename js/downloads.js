(() => {
  function downloadElementAsTXT(element, filename) {
    const clone = element.cloneNode(true);
    clone
      .querySelectorAll(".modal-close,.modal-header,.download-btn")
      .forEach((el) => el.remove());
    const text = extractTextFromElement(clone);
    if (!text.trim()) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function extractTextFromElement(element) {
    let text = "";

    function walk(node) {
      if (node.nodeType === 3) {
        const t = node.textContent.trim();
        if (t) text += t + "\n";
        return;
      }

      if (node.nodeType !== 1) return;

      const tag = node.tagName.toLowerCase();

      if (tag === "h1" || tag === "h2" || tag === "h3") {
        const t = node.textContent.trim();
        text += "\n" + t + "\n" + "=".repeat(t.length) + "\n\n";
        return;
      }

      if (tag === "p") {
        text += node.textContent.trim() + "\n\n";
        return;
      }

      if (tag === "ul" || tag === "ol") {
        node.querySelectorAll("li").forEach((li) => {
          text += "• " + li.textContent.trim() + "\n";
        });
        text += "\n";
        return;
      }

      if (tag === "br") {
        text += "\n";
        return;
      }

      node.childNodes.forEach(walk);
    }

    element.childNodes.forEach(walk);
    return text;
  }

  window.downloadTerms = (format) => {
    let element = document.querySelector("#terms-modal .modal-body");
    if (!element) {
      element = document.querySelector("main.legal-page .legal-content");
    }
    if (element && format === "txt")
      downloadElementAsTXT(element, "Terms-and-Conditions.txt");
    return false;
  };

  window.downloadImprint = (format) => {
    let element = document.querySelector("#imprint-modal .modal-body");
    if (!element) {
      element = document.querySelector("main.legal-page .legal-content");
    }
    if (element && format === "txt")
      downloadElementAsTXT(element, "Imprint.txt");
    return false;
  };

  window.downloadPrivacy = (format) => {
    let element = document.querySelector("#privacy-modal .modal-body");
    if (!element) {
      element = document.querySelector("main.legal-page .legal-content");
    }
    if (element && format === "txt")
      downloadElementAsTXT(element, "Privacy-Policy.txt");
    return false;
  };
})();
