(function () {
  var hubs = document.querySelectorAll("[data-concept-hub-mini]");
  if (!hubs.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  hubs.forEach(function (hub) {
    function runSequence() {
      hub.classList.add("is-active");

      window.setTimeout(function () {
        hub.classList.add("is-pulsing");
      }, 350);

      window.setTimeout(function () {
        hub.classList.add("is-ready");
      }, 3200);
    }

    if (reduced) {
      hub.classList.add("is-active", "is-ready");
    } else {
      runSequence();
    }
  });
})();
