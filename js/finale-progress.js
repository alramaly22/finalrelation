/**
 * progress.js
 * ------------------------------------------------------
 * Important design decision (revised from the original brief):
 * The heart, the progress line, and the background all move
 * forward with HOW FAR the visitor has walked through the
 * conversation — never with whether they answered yes or no.
 * A "no" is treated with exactly the same care as a "yes".
 * The chapter counter uses "Memory N" instead of "N / total".
 * ------------------------------------------------------
 */

const Progress = (() => {
  const fillEl = document.getElementById("progress-fill");
  const trackEl = document.querySelector(".progress-track");
  const heartEl = document.querySelector(".heart-svg");
  const chapterLabel = document.getElementById("chapter-label");
  const chapterDots = document.getElementById("chapter-dots");
  const particlesHost = document.getElementById("heart-particles");

  let total = 0;

  function buildDots(count) {
    chapterDots.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const d = document.createElement("span");
      d.className = "dot";
      chapterDots.appendChild(d);
    }
  }

  function init(totalQuestions) {
    total = totalQuestions;
    buildDots(total);
    update(0);
  }

  function update(index) {
    const ratio = total <= 1 ? 1 : index / (total - 1);
    const pct = Math.round(ratio * 100);

    fillEl.style.width = pct + "%";
    trackEl.setAttribute("aria-valuenow", String(pct));

    document.documentElement.style.setProperty("--bg-progress", ratio.toFixed(3));
    document.documentElement.style.setProperty("--heart-glow", (0.2 + ratio * 0.8).toFixed(3));

    chapterLabel.textContent = `الذكرى ${index + 1}`;

    [...chapterDots.children].forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.classList.toggle("is-done", i < index);
    });

    Animations.beatHeart(heartEl);
  }

  /** Called after every answer (yes or no alike) — same visual weight. */
  function pulse() {
    Animations.beatHeart(heartEl);
    for (let i = 0; i < 4; i++) {
      const s = document.createElement("span");
      s.className = "mini-particle";
      s.textContent = "✦";
      s.style.left = 45 + Math.random() * 10 + "%";
      s.style.color = "var(--accent-warm)";
      s.style.animationDelay = i * 0.05 + "s";
      particlesHost.appendChild(s);
      s.addEventListener("animationend", () => s.remove());
    }
  }

  return { init, update, pulse };
})();
