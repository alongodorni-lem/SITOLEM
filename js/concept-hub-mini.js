(function () {
  var hubs = document.querySelectorAll("[data-concept-hub-mini]");
  if (!hubs.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  hubs.forEach(function (hub) {
    function startLoop() {
      hub.classList.add("is-active");
      window.setTimeout(function () {
        hub.classList.add("is-pulsing");
      }, 350);
    }

    if (reduced) {
      hub.classList.add("is-active");
    } else {
      startLoop();
    }
  });
})();
