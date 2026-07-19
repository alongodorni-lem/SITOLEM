/* LEM s.r.l. - header + footer condivisi via JS
 * Un solo punto per aggiornare navigazione e footer di tutte le pagine.
 * Uso di data-attributes sul <body> per marcare la pagina attiva e la root.
 */

(function () {
  const links = [
    { href: "index.html", label: "Home" },
    { href: "chi-siamo.html", label: "Chi siamo" },
    { href: "servizi.html", label: "Servizi" },
    { href: "intelligenza-artificiale.html", label: "IA \u0026 GEO" },
    { href: "struttura.html", label: "La struttura" },
    { href: "portfolio.html", label: "Portfolio" },
    { href: "contatti.html", label: "Contatti" }
  ];

  const bodyRoot = document.body.dataset.root || "";

  function linkIsActive(l, activePage) {
    const hrefPart = l.href.split("/").pop();
    const [file, hash] = hrefPart.split("#");
    if (file !== activePage) return false;
    if (hash) return location.hash === "#" + hash;
    if (file === "portfolio.html") {
      return !location.hash || location.hash === "#all";
    }
    return true;
  }

  function buildHeader(activePage) {
    const linksHtml = links
      .map((l) => {
        const cls = linkIsActive(l, activePage) ? ' class="active"' : "";
        return `<li><a href="${bodyRoot}${l.href}"${cls}>${l.label}</a></li>`;
      })
      .join("");
    return `
      <header class="site-header">
        <nav class="nav" aria-label="Navigazione principale">
          <a href="${bodyRoot}index.html" class="nav__brand" aria-label="LEM s.r.l. - Home">
            <img src="${bodyRoot}assets/logos/lem-logo.png" alt="LEM s.r.l." width="120" height="40">
            <span class="nav__brand-text">
              <span class="nav__brand-name">LEM s.r.l.</span>
              <span class="nav__brand-tagline">Eventi e comunicazione</span>
            </span>
          </a>
          <button class="nav__toggle" aria-controls="primary-nav" aria-expanded="false" aria-label="Apri menu">&#9776;</button>
          <ul id="primary-nav" class="nav__links">${linksHtml}</ul>
        </nav>
      </header>`;
  }

  function buildFooter() {
    return `
      <footer class="site-footer" role="contentinfo">
        <div class="footer__inner">
          <div class="footer__brand-block">
            <img src="${bodyRoot}assets/logos/lem-logo.png" alt="LEM s.r.l.">
            <p>Società di eventi e comunicazione. Un unico referente per analisi, ideazione, produzione, comunicazione, digitale e logistica — Ornavasso (Verbania). 1500 mq showroom, uffici e magazzini.</p>
            <p style="margin-top: 12px; font-size: 12.5px; color: var(--text-muted);">
              Fornitore iscritto MePA e principali piattaforme della Pubblica Amministrazione.
            </p>
          </div>
          <div>
            <h4>Naviga</h4>
            <ul>
              <li><a href="${bodyRoot}chi-siamo.html">Chi siamo</a></li>
              <li><a href="${bodyRoot}servizi.html">Servizi</a></li>
              <li><a href="${bodyRoot}intelligenza-artificiale.html">IA e GEO</a></li>
              <li><a href="${bodyRoot}struttura.html">La struttura</a></li>
              <li><a href="${bodyRoot}portfolio.html">Portfolio</a></li>
              <li><a href="${bodyRoot}contatti.html">Contatti</a></li>
            </ul>
          </div>
          <div>
            <h4>Contatti</h4>
            <ul>
              <li><strong>LEM S.R.L.</strong></li>
              <li>Via Delle Mondacce 20</li>
              <li>28877 ORNAVASSO (Verbania)</li>
              <li>P.Iva 02380720033</li>
              <li>Tel <a href="tel:+390323497349">+39 0323 497349</a></li>
              <li>Mobile e WhatsApp <a href="https://wa.me/393480120346" target="_blank" rel="noopener">+39 3480120346</a></li>
              <li><a href="mailto:lemcomunicazione@gmail.com">lemcomunicazione@gmail.com</a></li>
            </ul>
          </div>
          <div>
            <h4>Web</h4>
            <ul>
              <li><a href="https://www.tuttoperglieventi.it" target="_blank" rel="noopener">tuttoperglieventi.it</a></li>
              <li><a href="https://www.grottadibabbonatale.it" target="_blank" rel="noopener">grottadibabbonatale.it</a></li>
              <li><a href="https://www.castellodellesorprese.it" target="_blank" rel="noopener">castellodellesorprese.it</a></li>
              <li><a href="https://www.villaggiodellezucche.it" target="_blank" rel="noopener">villaggiodellezucche.it</a></li>
              <li><a href="https://www.youtube.com/channel/UCghOREmOu6gVz7kRNKVC08A" target="_blank" rel="noopener">YouTube</a></li>
              <li><a href="https://www.instagram.com/grottababbonatale/" target="_blank" rel="noopener">Instagram</a></li>
            </ul>
          </div>
        </div>
        <div class="footer__meta">
          <span>&copy; ${new Date().getFullYear()} LEM s.r.l. &middot; P.IVA IT02380720033 - Tutti i diritti riservati &middot; <a href="${bodyRoot}privacy.html">Privacy e cookie</a></span>
          <span>Piemonte \u00b7 Lombardia \u00b7 Italia</span>
        </div>
      </footer>`;
  }

  const activePage = document.body.dataset.page || (location.pathname.split("/").pop() || "index.html");
  const headerSlot = document.getElementById("site-header");
  const footerSlot = document.getElementById("site-footer");
  if (headerSlot) headerSlot.innerHTML = buildHeader(activePage);
  if (footerSlot) footerSlot.innerHTML = buildFooter();

  const toggle = document.querySelector(".nav__toggle");
  const linksEl = document.querySelector(".nav__links");
  if (toggle && linksEl) {
    toggle.addEventListener("click", () => {
      const open = linksEl.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    linksEl.addEventListener("click", (e) => {
      if (e.target.tagName === "A") linksEl.classList.remove("open");
    });
  }

  // Cookie consent: carica defer, non bloccante
  if (!document.querySelector('script[data-lem-cookie]')) {
    const s = document.createElement("script");
    s.src = bodyRoot + "js/cookie-consent.js";
    s.defer = true;
    s.setAttribute("data-lem-cookie", "1");
    document.body.appendChild(s);
  }
})();
