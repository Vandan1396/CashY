/*
  CashV Privacy-Friendly Analytics
  Provider: GoatCounter
  IMPORTANT: replace YOUR_GOATCOUNTER_CODE below after creating your free site.
  This file never sends names, email, phone, budgets, expense amounts, notes,
  categories, or profile information.
*/
(function () {
  const CODE = "vandan";
  if (!CODE || CODE === "YOUR_GOATCOUNTER_CODE") return;

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://gc.zgo.at/count.js";
  script.setAttribute("data-goatcounter", `https://${CODE}.goatcounter.com/count`);
  document.head.appendChild(script);

  window.cashvAnalytics = {
    event(name) {
      try {
        if (window.goatcounter && typeof window.goatcounter.count === "function") {
          window.goatcounter.count({ path: name, title: name, event: true });
        } else {
          window.addEventListener("load", () => {
            if (window.goatcounter && typeof window.goatcounter.count === "function") {
              window.goatcounter.count({ path: name, title: name, event: true });
            }
          }, { once: true });
        }
      } catch (_) {}
    }
  };
})();
