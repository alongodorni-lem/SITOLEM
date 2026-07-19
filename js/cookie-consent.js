/* LEM s.r.l. — banner consenso cookie / GDPR
 * Preferenze in localStorage; non bloccante; accessibile.
 * Analytics: al momento il sito non carica tracker; il consenso
 * prepara l'eventuale attivazione futura senza caricare script terzi oggi.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "lem_cookie_consent";
  var VERSION = 1;

  function getRoot() {
    return (document.body && document.body.dataset.root) || "";
  }

  function readConsent() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || data.v !== VERSION) return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(prefs) {
    var data = {
      v: VERSION,
      necessary: true,
      analytics: !!prefs.analytics,
      ts: new Date().toISOString()
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* private mode */ }
    document.documentElement.dataset.cookieAnalytics = data.analytics ? "1" : "0";
    window.dispatchEvent(new CustomEvent("lem:cookie-consent", { detail: data }));
    return data;
  }

  function privacyHref() {
    return getRoot() + "privacy.html";
  }

  function buildBanner() {
    var el = document.createElement("div");
    el.id = "lem-cookie-banner";
    el.className = "cookie-banner";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "false");
    el.setAttribute("aria-labelledby", "lem-cookie-title");
    el.setAttribute("aria-describedby", "lem-cookie-desc");
    el.innerHTML =
      '<div class="cookie-banner__panel">' +
        '<div class="cookie-banner__copy">' +
          '<p id="lem-cookie-title" class="cookie-banner__title">Cookie e privacy</p>' +
          '<p id="lem-cookie-desc" class="cookie-banner__text">' +
            'Utilizziamo cookie <strong>necessari</strong> al funzionamento del sito (preferenze di consenso e navigazione essenziale). ' +
            'I cookie di <strong>statistica/analytics</strong>, se attivati, ci aiutano a capire come viene usato il sito in forma aggregata. ' +
            'Puoi accettare tutti, limitarti ai necessari o gestire le preferenze. ' +
            '<a href="' + privacyHref() + '">Informativa privacy</a>.' +
          "</p>" +
        "</div>" +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="btn btn--primary cookie-banner__btn" data-cookie-action="accept">Accetta</button>' +
          '<button type="button" class="btn btn--secondary cookie-banner__btn" data-cookie-action="necessary">Solo necessari</button>' +
          '<button type="button" class="btn btn--ghost cookie-banner__btn" data-cookie-action="prefs" aria-expanded="false" aria-controls="lem-cookie-prefs">Preferenze</button>' +
        "</div>" +
        '<div id="lem-cookie-prefs" class="cookie-banner__prefs" hidden>' +
          '<label class="cookie-banner__pref">' +
            '<input type="checkbox" checked disabled data-cookie-necessary>' +
            '<span><strong>Necessari</strong> — sempre attivi (consenso, sicurezza, funzionamento base).</span>' +
          "</label>" +
          '<label class="cookie-banner__pref">' +
            '<input type="checkbox" data-cookie-analytics>' +
            '<span><strong>Analytics</strong> — misurazione aggregata dell\'utilizzo (solo se e quando attivi sul sito).</span>' +
          "</label>" +
          '<div class="cookie-banner__prefs-actions">' +
            '<button type="button" class="btn btn--primary cookie-banner__btn" data-cookie-action="save">Salva preferenze</button>' +
          "</div>" +
        "</div>" +
      "</div>";
    return el;
  }

  function hideBanner(banner) {
    if (!banner) return;
    banner.classList.add("cookie-banner--hide");
    window.setTimeout(function () {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 280);
  }

  function init() {
    var existing = readConsent();
    if (existing) {
      document.documentElement.dataset.cookieAnalytics = existing.analytics ? "1" : "0";
      return;
    }

    var banner = buildBanner();
    document.body.appendChild(banner);

    var prefs = banner.querySelector("#lem-cookie-prefs");
    var prefsBtn = banner.querySelector('[data-cookie-action="prefs"]');
    var analyticsCb = banner.querySelector("[data-cookie-analytics]");

    banner.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-cookie-action]");
      if (!btn) return;
      var action = btn.getAttribute("data-cookie-action");

      if (action === "accept") {
        writeConsent({ analytics: true });
        hideBanner(banner);
        return;
      }
      if (action === "necessary") {
        writeConsent({ analytics: false });
        hideBanner(banner);
        return;
      }
      if (action === "prefs") {
        var open = prefs.hasAttribute("hidden");
        if (open) {
          prefs.removeAttribute("hidden");
          prefsBtn.setAttribute("aria-expanded", "true");
        } else {
          prefs.setAttribute("hidden", "");
          prefsBtn.setAttribute("aria-expanded", "false");
        }
        return;
      }
      if (action === "save") {
        writeConsent({ analytics: !!(analyticsCb && analyticsCb.checked) });
        hideBanner(banner);
      }
    });

    // Focus first action for keyboard users
    var first = banner.querySelector("[data-cookie-action='accept']");
    if (first) {
      window.requestAnimationFrame(function () {
        try { first.focus({ preventScroll: true }); } catch (err) { first.focus(); }
      });
    }
  }

  // API pubblica minima (utile da privacy.html o console)
  window.LEMCookieConsent = {
    get: readConsent,
    openPreferences: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      var old = document.getElementById("lem-cookie-banner");
      if (old && old.parentNode) old.parentNode.removeChild(old);
      init();
      var prefsBtn = document.querySelector("#lem-cookie-banner [data-cookie-action='prefs']");
      if (prefsBtn) prefsBtn.click();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
