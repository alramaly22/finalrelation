// =======================================
// Project Hope
// Ending → Finale Transition
//
// Wired up by ending.js's #restart-story button. Branches on
// who is signed in:
//
//   - Malak: a slow cinematic transition (music quiets, stars
//     fade, black screen, three lines, one by one) — then the
//     Questionnaire opens as the story's true final chapter.
//
//   - Anyone else (Redag): a gentle in-world rejection scene.
//     No alerts, no navigation — just a beat that stays inside
//     the story's own language.
// =======================================

const CHAPTER_TRANSITION_LINES = [

    "في عالم تاني...",
    "مكانش حد دخله غيرك.",
    "اتفضلي."

];

function buildChapterTransitionMarkup() {

    if (document.querySelector(".chapter-transition")) return;

    const el = document.createElement("div");

    el.className = "chapter-transition";

    el.innerHTML = `

<div class="chapter-transition-stars" id="chapter-transition-stars"></div>

<div class="chapter-transition-lines" id="chapter-transition-lines">
    ${CHAPTER_TRANSITION_LINES.map((line) => `<p class="chapter-transition-line">${line}</p>`).join("")}
</div>

`;

    document.body.appendChild(el);

}

function buildTransitionStars(container, count = 90) {

    if (!container || container.childElementCount) return;

    for (let i = 0; i < count; i++) {

        const star = document.createElement("span");

        star.className = "descent-star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.opacity = (Math.random() * .6 + .3).toFixed(2);

        const size = Math.random() * 1.6 + 1;

        star.style.width = size + "px";
        star.style.height = size + "px";

        container.appendChild(star);

    }

}

// Brings every audio layer on the page down to silence — the
// finale has its own quiet, synthesized soundscape and should
// open into genuine quiet, not compete with anything looping.
function silenceAllAudio(duration = 2.2) {

    document.querySelectorAll("audio").forEach((audio) => {

        if (audio.paused) return;

        gsap.to(audio, {

            volume: 0,
            duration,
            ease: "power1.inOut",
            overwrite: "auto",

            onComplete: () => {

                audio.pause();

            }

        });

    });

}

function playChapterTransition(onArrive) {

    buildChapterTransitionMarkup();

    const el = document.querySelector(".chapter-transition");
    const stars = document.querySelector("#chapter-transition-stars");
    const lines = document.querySelectorAll(".chapter-transition-line");

    buildTransitionStars(stars);

    silenceAllAudio();

    el.classList.add("is-active");

    const tl = gsap.timeline({

        onComplete: () => {

            onArrive();

        }

    });

    tl.to(el, {

        opacity: 1,
        duration: 1.6,
        ease: "power1.in"

    })

    .fromTo(stars, {

        opacity: .8

    }, {

        opacity: 0,
        duration: 3.2,
        ease: "power1.out"

    }, .3);

    lines.forEach((line, i) => {

        tl.to(line, {

            opacity: 1,
            duration: 1.3,
            ease: "power2.out"

        }, `+=${i === 0 ? 1 : .4}`)

        .to(line, {

            opacity: 0,
            duration: 1,
            ease: "power1.inOut"

        }, "+=1.6");

    });

    tl.to(el, {

        opacity: 0,
        duration: 1.2,
        ease: "power1.out"

    }, "+=.2");

}


// =======================================
// Rejection scene
// =======================================

function buildRejectionMarkup() {

    if (document.querySelector(".rejection-scene")) return;

    const el = document.createElement("div");

    el.className = "rejection-scene";

    el.innerHTML = `

<div class="rejection-card">

    <span class="rejection-glyph">🕯️</span>

    <h3>مش كل باب بيتفتح دلوقتي</h3>

    <p>

        في حاجات لسه معملتش وقتها...
        <br>
        الحكاية اللي شوفتها لحد هنا كفاية لدلوقتي.
        <br><br>
        فيه باب تاني... بس مش انت اللي هتفتحه.

    </p>

    <button class="rejection-close" id="rejection-close">ارجع للحكاية 🤍</button>

</div>

`;

    document.body.appendChild(el);

    document.querySelector("#rejection-close").addEventListener("click", () => {

        closeRejectionScene();

    });

}

function showRejectionScene() {

    buildRejectionMarkup();

    const el = document.querySelector(".rejection-scene");

    el.classList.add("is-active");

    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power1.out" });

    const card = document.querySelector(".rejection-card");

    gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: .2, ease: "power3.out" });

}

function closeRejectionScene() {

    const el = document.querySelector(".rejection-scene");

    if (!el) return;

    gsap.to(el, {

        opacity: 0,
        duration: .8,
        ease: "power1.in",

        onComplete: () => {

            el.classList.remove("is-active");

        }

    });

}


// =======================================
// Entry point — wired up by ending.js
// =======================================

let finaleUnlocked = false;

function handleFinalButton() {

    if (currentUserIsMalak()) {

        playChapterTransition(() => {

            openFinaleChapter();

        });

    } else {

        showRejectionScene();

    }

}

function openFinaleChapter() {

    const chapter = document.querySelector("#finale-chapter");
    const transition = document.querySelector(".chapter-transition");

    if (!chapter) return;

    chapter.hidden = false;

    requestAnimationFrame(() => {

        chapter.classList.add("is-active");

    });

    document.body.classList.add("scroll-locked");

    if (transition) {

        transition.classList.remove("is-active");
        gsap.set(transition, { opacity: 0 });

    }

    if (!finaleUnlocked) {

        finaleUnlocked = true;

        if (window.FinaleApp && typeof window.FinaleApp.init === "function") {

            window.FinaleApp.init();

        }

    }

}
