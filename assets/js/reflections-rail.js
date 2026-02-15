(function () {
  function setupRail(section) {
    const track = section.querySelector(".reflections-track");
    const prevBtn = section.querySelector(".rail-prev");
    const nextBtn = section.querySelector(".rail-next");
    if (!track || !prevBtn || !nextBtn) return;

    // scroll amount = one card width + gap
    function getStep() {
      const card = track.querySelector(".reflection-card");
      if (!card) return 320;
      const cardRect = card.getBoundingClientRect();
      // gap approx from computed style
      const gap = parseFloat(getComputedStyle(track).gap || "0");
      return cardRect.width + gap;
    }

    prevBtn.addEventListener("click", () => {
      track.scrollBy({ left: -getStep(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      track.scrollBy({ left: getStep(), behavior: "smooth" });
    });

    // keyboard support when track is focused
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        track.scrollBy({ left: -getStep(), behavior: "smooth" });
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        track.scrollBy({ left: getStep(), behavior: "smooth" });
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".reflections-rail").forEach(setupRail);
  });
})();

