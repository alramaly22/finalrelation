/**
 * animations.js
 * ------------------------------------------------------
 * Two concerns live here:
 *  1. The ambient canvas (slow stars/particles/occasional heart)
 *  2. Reusable GSAP transition + reaction helpers used by ui.js
 * ------------------------------------------------------
 */

const Animations = (() => {
  const canvas = document.getElementById("particle-canvas");
  const cctx = canvas.getContext("2d");
  let particles = [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
  }
  window.addEventListener("resize", resize);
  resize();

  function makeParticle() {
    const isHeart = Math.random() < 0.05;
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: isHeart ? 6 + Math.random() * 4 : Math.random() * 1.6 + 0.4,
      speed: 0.06 + Math.random() * 0.14,
      drift: (Math.random() - 0.5) * 0.06,
      opacity: Math.random() * 0.5 + 0.15,
      heart: isHeart,
      twinklePhase: Math.random() * Math.PI * 2
    };
  }

  function initParticles(count = 70) {
    particles = Array.from({ length: count }, makeParticle);
  }

  function drawHeart(x, y, size, alpha) {
    cctx.save();
    cctx.translate(x, y);
    cctx.scale(size / 20, size / 20);
    cctx.beginPath();
    cctx.moveTo(0, 6);
    cctx.bezierCurveTo(-10, -6, -18, 4, 0, 16);
    cctx.bezierCurveTo(18, 4, 10, -6, 0, 6);
    cctx.fillStyle = `rgba(232,179,107,${alpha})`;
    cctx.fill();
    cctx.restore();
  }

  let t = 0;
  let running = false;
  function tick() {
    if (!running) return;
    t += 0.016;
    cctx.clearRect(0, 0, canvas.width, canvas.height);
    cctx.save();
    cctx.scale(devicePixelRatio, devicePixelRatio);
    particles.forEach(p => {
      p.y -= p.speed;
      p.x += p.drift;
      if (p.y < -10) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
      const twinkle = 0.5 + 0.5 * Math.sin(t * 1.2 + p.twinklePhase);
      const alpha = p.opacity * (p.heart ? 0.5 : twinkle);
      if (p.heart) {
        drawHeart(p.x, p.y, p.r * 2, alpha * 0.6);
      } else {
        cctx.beginPath();
        cctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        cctx.fillStyle = `rgba(255,255,255,${alpha})`;
        cctx.fill();
      }
    });
    cctx.restore();
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  function start() {
    initParticles(reduceMotion ? 20 : 70);
    running = true;
    tick();
  }

  // The Epilogue takes the screen over completely, so there's no
  // reason to keep painting a canvas nobody can see any more.
  function stop() {
    running = false;
    cctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // ---------------- Custom cursor ----------------
  function initCursor() {
    const ring = document.querySelector(".cursor");
    const dot = document.querySelector(".cursor-dot");
    if (!ring || !dot) return;
    window.addEventListener("pointermove", e => {
      ring.style.left = e.clientX + "px";
      ring.style.top = e.clientY + "px";
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    });
    document.addEventListener("pointerover", e => {
      if (e.target.closest("button, .answer-btn")) ring.classList.add("cursor--hover");
    });
    document.addEventListener("pointerout", e => {
      if (e.target.closest("button, .answer-btn")) ring.classList.remove("cursor--hover");
    });
  }

  // ---------------- Question transitions ----------------
  // A pool of distinct enter/exit styles so no two chapters feel the same.
  const transitionStyles = [
    {
      exit: el => gsap.to(el, { opacity: 0, y: -24, filter: "blur(6px)", duration: 0.4, ease: "power2.in" }),
      enter: el => gsap.fromTo(el, { opacity: 0, y: 24, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out" })
    },
    {
      exit: el => gsap.to(el, { opacity: 0, scale: 0.92, duration: 0.35, ease: "power2.in" }),
      enter: el => gsap.fromTo(el, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" })
    },
    {
      exit: el => gsap.to(el, { opacity: 0, x: -40, duration: 0.4, ease: "power2.in" }),
      enter: el => gsap.fromTo(el, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" })
    },
    {
      exit: el => gsap.to(el, { opacity: 0, y: 16, duration: 0.3, ease: "power1.in" }),
      // handled specially: letter-by-letter reveal (see revealLetters)
      enter: el => revealLetters(el)
    },
    {
      exit: el => gsap.to(el, { opacity: 0, filter: "blur(14px)", duration: 0.45, ease: "power2.in" }),
      enter: el => gsap.fromTo(el, { opacity: 0, filter: "blur(14px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.9, ease: "power2.out" })
    }
  ];

  function revealLetters(container) {
    const textEl = container.querySelector(".question__text");
    if (!textEl) { gsap.fromTo(container, { opacity: 0 }, { opacity: 1, duration: 0.5 }); return; }
    const original = textEl.textContent;
    textEl.textContent = "";

    // Reveal by WORD, not by individual character. Arabic letters are
    // cursive/contextual — a letter's visual shape depends on the
    // letters next to it (initial/medial/final/isolated forms), and
    // wrapping each character in its own span (the old approach) forces
    // every letter into its isolated form, breaking the joins so words
    // render as disconnected or malformed glyphs. Keeping each word's
    // characters together in a single text run lets the browser's text
    // shaper join them normally, while the span-per-word still gives us
    // a distinct element to stagger-animate for the same cinematic
    // letter/word-reveal feel as before.
    const tokens = original.split(/(\s+)/); // keep whitespace runs as-is
    const frag = document.createDocumentFragment();
    const words = [];
    tokens.forEach(token => {
      if (token === "") return;
      if (/^\s+$/.test(token)) {
        frag.appendChild(document.createTextNode(token));
        return;
      }
      const span = document.createElement("span");
      span.className = "word";
      span.style.display = "inline-block";
      span.textContent = token;
      frag.appendChild(span);
      words.push(span);
    });
    textEl.appendChild(frag);

    gsap.fromTo(container, { opacity: 1 }, { opacity: 1, duration: 0.01 });
    gsap.fromTo(words,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.055, ease: "power1.out" }
    );
    gsap.fromTo(container.querySelectorAll(".answers, .question__eyebrow"),
      { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.25 });
  }

  let styleIndex = -1;
  function nextTransitionStyle(direction = "forward") {
    // avoid repeating the same style twice in a row
    let idx;
    do { idx = Math.floor(Math.random() * transitionStyles.length); }
    while (idx === styleIndex && transitionStyles.length > 1);
    styleIndex = idx;
    return transitionStyles[idx];
  }

  function transitionQuestion(stageEl, renderNewContent, direction) {
    const current = stageEl.firstElementChild;
    const style = nextTransitionStyle(direction);
    const doEnter = () => {
      const newEl = renderNewContent();
      style.enter(newEl);
    };
    if (current) {
      const exitAnim = style.exit(current);
      if (exitAnim && exitAnim.eventCallback) {
        exitAnim.eventCallback("onComplete", () => { current.remove(); doEnter(); });
      } else {
        setTimeout(() => { current.remove(); doEnter(); }, 380);
      }
    } else {
      doEnter();
    }
  }

  // ---------------- Reaction particles (answer feedback) ----------------
  // Both reactions are deliberately equal in polish/duration — neither is
  // a "reward" or "punishment", just a different texture of the same care.
  function reactionYes(container) {
    for (let i = 0; i < 10; i++) {
      const el = document.createElement("span");
      el.className = "mini-particle";
      el.textContent = "❤";
      el.style.left = 40 + Math.random() * 20 + "%";
      el.style.animationDelay = (Math.random() * 0.3) + "s";
      el.style.color = "var(--heart-edge)";
      container.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }
  }

  function reactionNo(container) {
    for (let i = 0; i < 10; i++) {
      const el = document.createElement("span");
      el.className = "mini-petal";
      el.textContent = "❀";
      el.style.left = 40 + Math.random() * 20 + "%";
      el.style.setProperty("--dx", (Math.random() * 80 - 40) + "px");
      el.style.animationDelay = (Math.random() * 0.3) + "s";
      el.style.color = "var(--accent-cool)";
      el.style.opacity = "0.7";
      container.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }
  }

  function beatHeart(heartEl) {
    heartEl.classList.remove("is-beating");
    // force reflow so the animation can retrigger
    void heartEl.offsetWidth;
    heartEl.classList.add("is-beating");
  }

  function gatherEffect(container) {
    container.innerHTML = "";
    const dots = [];
    for (let i = 0; i < 24; i++) {
      const d = document.createElement("div");
      d.className = "gather-dot";
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 60;
      d.style.left = "50%";
      d.style.top = "50%";
      container.appendChild(d);
      dots.push(d);
      gsap.fromTo(d,
        { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0 },
        { x: 0, y: 0, opacity: 1, duration: 1.4, delay: i * 0.02, ease: "power2.in" }
      );
    }
    return dots;
  }

  return {
    start, stop, initCursor, transitionQuestion, reactionYes, reactionNo,
    beatHeart, gatherEffect
  };
})();