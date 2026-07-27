// =======================================
// Project Hope
// Starry Descent + Relationship Counter
// =======================================

// The one true date the whole site is built around.
// Change this single line if the date is ever wrong.
const RELATIONSHIP_START = new Date("2021-02-01T00:00:00");

function daysSinceStart() {

    const ms = Date.now() - RELATIONSHIP_START.getTime();

    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));

}

function buildDescentStars(container, count = 90) {

    if (container.childElementCount) return;

    for (let i = 0; i < count; i++) {

        const star = document.createElement("span");

        star.className = "descent-star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 60 + "%";
        star.style.opacity = (Math.random() * .6 + .3).toFixed(2);

        const size = Math.random() * 1.6 + 1;

        star.style.width = size + "px";
        star.style.height = size + "px";

        container.appendChild(star);

    }

}

// Runs the "camera descends from a starry sky" moment,
// then calls onArrive() once it settles.
function runDescent(onArrive) {

    const descent = document.querySelector(".descent");
    const starField = document.querySelector(".descent-stars");

    if (!descent || !starField) {
        onArrive();
        return;
    }

    buildDescentStars(starField);

    descent.classList.add("is-active");

    const tl = gsap.timeline({

        onComplete: () => {

            descent.classList.remove("is-active");
            gsap.set(descent, { opacity: 0 });
            onArrive();

        }

    });

    tl.to(descent, {

        opacity: 1,
        duration: 1.2,
        ease: "power1.in"

    })

    .fromTo(starField, {

        scale: 1.5,
        y: -60

    }, {

        scale: 1,
        y: 90,
        duration: 4.6,
        ease: "power2.inOut"

    }, .2)

    .to(descent, {

        opacity: 0,
        duration: 1.8,
        ease: "power1.out"

    }, "-=.6");

}

function initCounter() {

    if (document.querySelector("#counter")) return;

    const app = document.querySelector("#app");
    const descentTarget = document.querySelector("#first-chat");

    if (!app || !descentTarget) return;

    const days = daysSinceStart();

    descentTarget.insertAdjacentHTML("beforebegin", `

<section class="counter" id="counter">

    <div class="counter-glow"></div>

    <div class="counter-inner">

        <span class="counter-eyebrow">من أول يوم شفتك فيه</span>

        <div class="counter-number" id="counter-number">0</div>

        <div class="counter-label">يوم</div>

        <p class="counter-caption">
    اليوم ده...
    <br>
    مكانش مجرد أول رسالة.
    <br><br>
    بالنسبة ليا...
    كان بداية حياة كاملة.
</p>

    </div>

</section>

`);

    const el = document.querySelector("#counter-number");

    const counterObj = { val: 0 };

    gsap.to(counterObj, {

        val: days,
        duration: 5.5,
        ease: "power2.out",
        onUpdate: () => {

            el.textContent = Math.floor(counterObj.val).toLocaleString("en-US");

        },

        onComplete: () => {

            // Let the final number sit in silence for a moment
            // before the story continues.
            setTimeout(() => {

                runDescent(() => {

                    descentTarget.scrollIntoView({ behavior: "smooth" });

                });

            }, 2200);

        },

        scrollTrigger: {

            trigger: "#counter",
            start: "top 70%",
            once: true

        }

    });

}
