(function () {
  var stage = document.querySelector("[data-concept-map]");
  if (!stage) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function revealMap() {
    stage.classList.add("is-revealed");
    var mobile = stage.querySelector(".concept-map-mobile");
    if (mobile) mobile.removeAttribute("hidden");
  }

  function runSequence() {
    stage.classList.add("is-active");

    window.setTimeout(function () {
      stage.classList.add("is-pulsing");
    }, 350);

    window.setTimeout(revealMap, 3200);
  }

  if (reduced) {
    revealMap();
  } else {
    runSequence();
  }
})();
