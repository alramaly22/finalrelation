// =======================================
// Project Hope
// Cinematic Polish
// Ambient particles + shared blur/parallax reveal
// =======================================

function initAmbientParticles(count = 22) {

    if (document.querySelector(".ambient-particles")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = document.createElement("div");

    layer.className = "ambient-particles";

    for (let i = 0; i < count; i++) {

        const p = document.createElement("span");

        p.className = "ambient-particle";
        p.style.left = Math.random() * 100 + "%";
        p.style.setProperty("--drift", (Math.random() * 60 - 30) + "px");
        p.style.animationDuration = (14 + Math.random() * 12) + "s";
        p.style.animationDelay = (Math.random() * 16) + "s";

        layer.appendChild(p);

    }

    document.body.appendChild(layer);

}

// A shared cinematic reveal: blur + rise + fade, used to bring
// chapter titles and key beats into view as the story is scrolled.
function cinematicReveal(selector, opts = {}) {

    gsap.utils.toArray(selector).forEach((el, i) => {

        gsap.fromTo(el,

            {
                opacity: 0,
                y: opts.y ?? 50,
                filter: "blur(10px)"
            },

            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: opts.duration ?? 1.1,
                delay: (opts.stagger ?? 0) * i,
                ease: "power3.out",

                scrollTrigger: {

                    trigger: el,
                    start: opts.start ?? "top 82%"

                }

            }

        );

    });

}

// Gentle background parallax for chapter headers — depth without
// distracting from the words themselves.
function cinematicParallax(selector, amount = 60) {

    gsap.utils.toArray(selector).forEach((el) => {

        gsap.to(el, {

            y: amount,
            ease: "none",

            scrollTrigger: {

                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true

            }

        });

    });

}

// Late-loading images (photo/video posters, placeholders swapping
// in on error) can quietly shift section heights after the first
// ScrollTrigger.refresh(). Re-checking a couple of times catches
// any drift so a room's reveal trigger never ends up stuck at a
// scroll position the page no longer matches.
function scheduleScrollRefresh() {

    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });

    setTimeout(() => ScrollTrigger.refresh(), 1500);
    setTimeout(() => ScrollTrigger.refresh(), 4000);

}


// =======================================
// Room Sequence Controller
// Shared by every chapter that plays a timed, in-order text
// reveal (the opening's lines, The Things I Never Said, the
// Hall of Regret, the static room reveals, and anything built
// like them later). Enforces the same three rules everywhere
// instead of each chapter reimplementing its own version:
//
//   1. The sequence only plays while its section is on screen.
//   2. Scrolling away mid-sequence cancels it immediately and
//      resets the section back to its hidden starting state.
//   3. Scrolling back in always restarts from the beginning —
//      like walking into a room in a game.
// =======================================

// `run(token)` performs the sequence — an async function that
// must check `token.cancelled` after every await/pause and
// stop early if it's true. `reset()` synchronously puts the
// section back to its hidden starting state; it's called both
// before every run and on cancellation, so it must be safe to
// call at any point mid-sequence.
function createSequencePlayer({ run, reset }) {

    let token = null;

    function start() {

        // Cancel whatever was running before, then begin clean.
        if (token) token.cancelled = true;

        token = { cancelled: false };

        reset();
        run(token);

    }

    function cancel() {

        if (token) token.cancelled = true;

        reset();

    }

    return { start, cancel };

}

// Wires a sequence player to its section's scroll visibility.
function initRoomSequence(section, player, opts = {}) {

    if (!section) return;

    ScrollTrigger.create({

        trigger: section,
        start: opts.start ?? "top 60%",
        end: opts.end ?? "bottom 40%",

        onEnter: () => player.start(),
        onEnterBack: () => player.start(),
        onLeave: () => player.cancel(),
        onLeaveBack: () => player.cancel()

    });

}

// A small awaitable pause that respects cancellation — every
// sequence's "hold" beats use this instead of a bare
// setTimeout, so a cancelled sequence never keeps ticking.
function sequenceWait(ms) {

    return new Promise((resolve) => setTimeout(resolve, ms));

}

// After a sequence finishes naturally (never after a
// cancellation), pause briefly, then glide to the next
// section — the same smooth scroll used throughout the site.
async function autoAdvance(token, nextSelector, pause = 1800) {

    await sequenceWait(pause);

    if (token.cancelled) return;

    const next = document.querySelector(nextSelector);

    if (next) next.scrollIntoView({ behavior: "smooth" });

}
// A near-inaudible "whoosh" as each major chapter begins —
// silent everywhere until a real file exists at
// assets/audio/whoosh.mp3.
// =======================================

let whooshAudio = null;
let whooshReady = false;
let lastWhooshTime = 0;

function initChapterTransitionSound(selectors) {

    whooshAudio = new Audio("assets/audio/Dawn55.mp3");
    whooshAudio.volume = .18;

    whooshAudio.addEventListener("canplaythrough", () => {

        whooshReady = true;

    }, { once: true });

    whooshAudio.addEventListener("error", () => {

        whooshAudio = null;

    }, { once: true });

    whooshAudio.load();

    gsap.utils.toArray(selectors).forEach((section) => {

        ScrollTrigger.create({

            trigger: section,
            start: "top 75%",

            onEnter: playWhoosh,
            onEnterBack: playWhoosh

        });

    });

}

function playWhoosh() {

    if (!whooshReady || !whooshAudio) return;

    // A gentle cooldown so quick scrolling never stacks whooshes
    const now = Date.now();

    if (now - lastWhooshTime < 1200) return;

    lastWhooshTime = now;

    whooshAudio.currentTime = 0;
    whooshAudio.play().catch(() => {});

}
