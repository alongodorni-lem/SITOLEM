/* Racconti Digitali - portfolio filter by category */

(function () {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  if (!buttons.length || !cards.length) return;

  function applyFilter(cat) {
    cards.forEach((card) => {
      const cats = (card.dataset.categories || "").split(",").map((s) => s.trim());
      const show = cat === "all" || cats.includes(cat);
      card.classList.toggle("hidden", !show);
    });

    buttons.forEach((b) => {
      b.classList.toggle("active", (b.dataset.filter || "all") === cat);
    });
  }

  function filterFromHash() {
    const hash = (location.hash || "").replace(/^#/, "");
    if (hash && document.querySelector(`.filter-btn[data-filter="${hash}"]`)) {
      return hash;
    }
    return "all";
  }

  function setHash(cat) {
    if (cat === "all") {
      history.replaceState(null, "", location.pathname + location.search);
    } else {
      history.replaceState(null, "", "#" + cat);
    }
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.filter || "all";
      applyFilter(cat);
      setHash(cat);
    });
  });

  applyFilter(filterFromHash());
  window.addEventListener("hashchange", () => applyFilter(filterFromHash()));
})();

/* Collaborators logo wall — first 11 fixed, rest shuffled each load; 2×4 pages */
(function () {
  const root = document.querySelector("[data-collaborators-carousel]");
  if (!root) return;

  const track = root.querySelector("[data-collaborators-track]");
  const prevBtn = root.querySelector("[data-collaborators-prev]");
  const nextBtn = root.querySelector("[data-collaborators-next]");
  const dotsWrap = root.querySelector("[data-collaborators-dots]");
  const status = root.querySelector("[data-collaborators-status]");
  if (!track || !prevBtn || !nextBtn || !dotsWrap) return;

  const FIXED_COUNT = 11;

  function shuffleInPlace(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function collectItems() {
    const all = Array.from(track.querySelectorAll(".collaborators__item"));
    const fixed = all.filter((el) => el.hasAttribute("data-collaborator-fixed"));
    const rest = all.filter((el) => !el.hasAttribute("data-collaborator-fixed"));
    // Prefer marked fixed items; fallback to first 11 in DOM order
    const head = fixed.length === FIXED_COUNT ? fixed : all.slice(0, FIXED_COUNT);
    const tail = fixed.length === FIXED_COUNT ? rest : all.slice(FIXED_COUNT);
    shuffleInPlace(tail);
    return head.concat(tail);
  }

  const items = collectItems();
  if (!items.length) return;

  const mq = window.matchMedia("(max-width: 720px)");
  let index = 0;
  let pages = [];
  let dots = [];

  function pageSize() {
    return mq.matches ? 4 : 8;
  }

  function buildPages() {
    const size = pageSize();
    const totalPages = Math.ceil(items.length / size);
    index = Math.min(index, Math.max(0, totalPages - 1));

    track.innerHTML = "";
    pages = [];

    for (let p = 0; p < totalPages; p++) {
      const ul = document.createElement("ul");
      ul.className = "collaborators__page";
      ul.setAttribute("data-collaborators-page", "");
      ul.setAttribute(
        "aria-label",
        `Collaborazioni, pagina ${p + 1} di ${totalPages}`
      );
      const slice = items.slice(p * size, p * size + size);
      slice.forEach((item) => ul.appendChild(item));
      track.appendChild(ul);
      pages.push(ul);
    }

    dotsWrap.innerHTML = "";
    dots = pages.map((_, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "collaborators__dot";
      btn.setAttribute("role", "tab");
      btn.setAttribute(
        "aria-label",
        `Vai alla pagina ${i + 1} di ${pages.length}`
      );
      btn.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(btn);
      return btn;
    });

    goTo(index);
  }

  function goTo(next) {
    const total = pages.length;
    if (!total) return;
    index = ((next % total) + total) % total;

    pages.forEach((page, i) => {
      const active = i === index;
      page.toggleAttribute("hidden", !active);
      page.setAttribute("aria-hidden", active ? "false" : "true");
    });

    dots.forEach((dot, i) => {
      const selected = i === index;
      dot.setAttribute("aria-selected", selected ? "true" : "false");
      dot.tabIndex = selected ? 0 : -1;
    });

    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === total - 1;

    if (status) {
      status.textContent = `Pagina ${index + 1} di ${total}`;
    }
  }

  prevBtn.addEventListener("click", () => goTo(index - 1));
  nextBtn.addEventListener("click", () => goTo(index + 1));

  root.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(pages.length - 1);
    }
  });

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", buildPages);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(buildPages);
  }

  buildPages();
})();
