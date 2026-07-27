// =======================================
// Project Hope
// Opening Scene
// =======================================

// EDIT ME: these four lines are the whole opening. Keep them short.
const openingLines = [

"قبل ما تبدأ الحكاية...",
"انسَي كل اللي حصل بينا لدقايق.",
"واسمعيها...",
"كأنها أول مرة."

];

function typeLine(el, text, speed = 95) {

    return new Promise((resolve) => {

        el.textContent = "";

        let i = 0;

        const tick = () => {

            if (i <= text.length) {

                el.textContent = text.slice(0, i);
                i++;
                setTimeout(tick, speed);

            } else {

                resolve();

            }

        };

        tick();

    });

}

async function runOpeningLines(el) {

    for (const line of openingLines) {

        await typeLine(el, line);

        // hold on the finished line for a long, unhurried beat
        await sequenceWait(2400);

        await gsap.to(el, {
            opacity: 0,
            duration: 1.4,
            ease: "power1.inOut"
        });

        // a breath of black before the next line begins
        await sequenceWait(700);

        el.style.opacity = 1;

    }

}

let openingHasRun = false;

function initOpening() {

    if (openingHasRun) return;
    openingHasRun = true;

    const opening = document.querySelector(".opening");
    const intro = document.querySelector("#intro-text");
    const subtitle = document.querySelector(".opening-subtitle");
    const button = document.querySelector("#start-btn");
    const light = document.querySelector(".light");

    if (!opening || !intro || !button || !light) return;

    document.body.classList.add("scroll-locked");

    gsap.set([button, subtitle], {
        opacity: 0,
        y: 20
    });

    gsap.set(intro, { opacity: 1 });

    const tl = gsap.timeline({ delay: 2.4 });

    tl.to(light, {

        opacity: 1,
        scale: 32,
        duration: 3.2,
        ease: "power2.out"

    })

    .to(light, {

        opacity: 0,
        duration: 1.4

    })

    .call(async () => {

        await runOpeningLines(intro);

        gsap.to(subtitle, { opacity: 1, y: 0, duration: 1 });
        gsap.to(button, { opacity: 1, y: 0, duration: .8, delay: .3 });

    });

    gsap.to(button, {

        scale: 1.05,
        repeat: -1,
        yoyo: true,
        duration: 1.3,
        ease: "sine.inOut"

    });

    let storyStarted = false;

    button.addEventListener("click", () => {

        if (storyStarted) return;

        storyStarted = true;

        gsap.killTweensOf(button);

        initSoundToggle();

        const exit = gsap.timeline({

            onComplete: () => {

                opening.style.display = "none";

                initCounter();
                initChat();
                initGallery();
                initCall();
                initTimeline();
                initMediaChapter();
                initRegretChapters();
                initEnding();

                initAmbientParticles();
                cinematicParallax(".gallery-header, .media-header, .counter-glow");
                scheduleScrollRefresh();

                initChapterTransitionSound([
                    "#counter",
                    "#first-chat",
                    ".gallery",
                    ".call",
                    ".timeline",
                    ".media-chapter",
                    "#things-i-never-said",
                    "#hall-of-regret",
                    "#if-i-could-go-back",
                    "#final-room",
                    ".ending"
                ]);

                document.body.classList.remove("scroll-locked");

                ScrollTrigger.refresh();

                document.querySelector("#counter").scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

        exit.to(opening, {

            opacity: 0,
            duration: 1.6

        });

    });

}
