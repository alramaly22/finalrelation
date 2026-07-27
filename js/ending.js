// =======================================
// Project Hope
// Final Chapter
// Ending
// =======================================

function initEnding() {

    if (document.querySelector(".ending")) return;

    const app = document.querySelector("#app");

    if (!app) return;

    app.insertAdjacentHTML("beforeend", `

<section class="ending">

    <div class="ending-overlay"></div>

    <div class="ending-content">

        <span class="ending-chapter">

            Intermission

        </span>

        <h2>

            فاكرة إن الحكاية خلصت؟

        </h2>

        <p class="ending-text">

            كل اللي شوفتيه لحد دلوقتي...
            <br><br>
            كان مجرد عالم...
            <br>
            عالم فيه الذكريات...
            <br>
            والضحك...
            <br>
            والزعل...
            <br>
            وكل حاجة عدت بينا.
            <br><br>
            لكن لسه في عالم تاني...
            <br>
            محدش دخله غيرك.
            <br><br>
            ولو وصلتي لحد هنا...
            <br>
            فأعتقد إنك جاهزة تشوفيه.

        </p>

        <button id="restart-story">

            ادخلي للعالم اللي بعده 🤍

        </button>

    </div>

</section>

`);

    animateEnding();

}

function animateEnding() {

    const tl = gsap.timeline({

        scrollTrigger: {

            trigger: ".ending",

            start: "top 65%"

        }

    });

    tl.from(".ending-chapter", {

        opacity: 0,
        y: 20,
        duration: 1

    })

    .from(".ending-content h2", {

        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out"

    }, "-=.5")

    .from(".ending-text", {

        opacity: 0,
        y: 30,
        duration: 1.2,
        ease: "power3.out"

    }, "-=.6")

    .from("#restart-story", {

        opacity: 0,
        y: 20,
        duration: .9

    }, "-=.5");

    const restart = document.querySelector("#restart-story");

    if (!restart) return;

    let pressed = false;

    restart.addEventListener("click", () => {

        // The button opens the next chapter (or the rejection scene) —
        // a single, deliberate press, not something to double-fire.
        if (pressed) return;
        pressed = true;

        handleFinalButton();

    });

}