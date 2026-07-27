// =======================================
// Project Hope
// Chapter 03
// Call
// =======================================

let callTimer;
let callAnswered = false;

function initCall() {

    if (document.querySelector(".call")) return;

    const app = document.querySelector("#app");

    app.insertAdjacentHTML("beforeend", `

<section class="call">

    <div class="phone-call">

        <div class="incoming">

            <span class="call-type">

                Incoming Call

            </span>

            <div class="call-avatar is-ringing">

                🦌

            </div>

            <h2>

                🦌

            </h2>

            <p>

                Instagram Call

            </p>

            <button class="accept-btn">

                قبول المكالمة ❤️

            </button>

        </div>

    </div>

</section>

`);

    animateCall();

}

function animateCall() {

    const phone = document.querySelector(".phone-call");

    const btn = document.querySelector(".accept-btn");
    btn.addEventListener("click", () => {

        if (callAnswered) return;

        callAnswered = true;

        gsap.killTweensOf(btn);

        startCall();

    });
    gsap.from(phone, {

        scrollTrigger: {

            trigger: ".call",

            start: "top center"

        },

        opacity: 0,

        y: 250,

        scale: .8,

        duration: 1.4,

        ease: "back.out(1.7)",

        onComplete() {

            pulseButton();

        }

    });

}

function pulseButton() {

    gsap.to(".accept-btn", {

        scale: 1.08,

        repeat: -1,

        yoyo: true,

        duration: .8,

        ease: "sine.inOut"

    });

}

function startCall() {

    const phoneCall = document.querySelector(".phone-call");

    if (!phoneCall) return;

    gsap.to(phoneCall, {

        opacity: 0,

        scale: .92,

        duration: .5,

        ease: "power2.in",

        onComplete() {

            phoneCall.innerHTML = `

                <div class="active-call">

                    <div class="call-avatar big pulse-live">

                        🦌

                    </div>

                    <span id="call-counter">00:00</span>

                    <p id="subtitle"></p>

                </div>

            `;

            gsap.fromTo(phoneCall, {

                opacity: 0,

                scale: .92

            }, {

                opacity: 1,

                scale: 1,

                duration: .6,

                ease: "power2.out"

            });

            startCounter();

            playCallConversation();

        }

    });

}

function startCounter() {

    const counter = document.querySelector("#call-counter");

    let sec = 0;

    callTimer = setInterval(() => {

        sec++;

        let m = String(Math.floor(sec / 60)).padStart(2, "0");

        let s = String(sec % 60).padStart(2, "0");

        counter.innerHTML = `${m}:${s}`;

    }, 1000);

}

const subtitles = [

    "أيوه؟",

    "عاملة إيه؟",

    "الحمد لله... صحيت علشان أطمن عليك.",

    "حليت... بس مش أحسن حاجة يعني.",

    "دي أول مرة أسمع صوتك.",

    "إنت دحيح... وهتنجح.",

    "يخربيت عينك بجد... شكلي هشيل 😂",

    "...",

    "شكلك نمتي يا غالية.",

    "خلاص... هسيبك تنامي براحتك.",

    "Goodbye.",

    "لما تصحي... هكلمك تاني."

];

function playCallConversation() {

    const box = document.querySelector("#subtitle");

    let delay = 1000;

    subtitles.forEach((text, index) => {

        setTimeout(() => {

            box.innerHTML = text;

            gsap.fromTo(box, {

                opacity: 0,

                y: 20

            }, {

                opacity: 1,

                y: 0,

                duration: .6

            });

        }, delay);

        delay += 3000;

        if (index === subtitles.length - 1) {

            setTimeout(endCall, delay);

        }
    });

}

function endCall() {

    clearInterval(callTimer);

    const subtitle = document.querySelector("#subtitle");

    subtitle.innerHTML = "انتهت المكالمة";

    gsap.to(".phone-call", {

        delay: 2,

        scale: .65,

        opacity: 0,

        duration: 1.3,

        ease: "power3.inOut",

        onComplete() {

            showQuote();

        }

    });

}

function showQuote() {

    const section = document.querySelector(".call");

    section.innerHTML = `

        <div class="call-ending">

            <h2>

                بعض المكالمات...

            </h2>

            <h1>

                بتغير عمر كامل.

            </h1>

        </div>

    `;

    gsap.from(".call-ending", {

        opacity: 0,

        y: 60,

        duration: 2

    });

}
