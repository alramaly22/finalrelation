// =======================================
// Project Hope
// Chapter Zero — Authentication Gate
//
// Runs before anything else in the story. Two accounts exist;
// both may enter Project Hope, but only Malak's account is
// allowed to reach the Questionnaire (the final chapter).
//
// Credentials are never kept in plain text — only their
// SHA-256 hashes (computed with the Web Crypto API) live here,
// and only the entered password is hashed and compared against
// them. The signed-in session is kept in sessionStorage only
// (cleared when the tab closes), never localStorage.
// =======================================

// email (lowercased, trimmed) + password, each SHA-256 hashed.
const AUTH_ACCOUNTS = [

    {
        emailHash: "6bbd8b12aca2d7a337211299b5ca11db4e5e0b4f032c480a4f591374d6784cdf",
        passwordHash: "01b55f67f48b5820b8b066069eb33cfa5a56fa858482787e616773f024a95d12",
        isMalak: false
    },

    {
        emailHash: "97947c53e5fb5ef505ff8ac06be58ba3e1a52bbaa76c2021c5b87be23144690e",
        passwordHash: "29270c26e555fb639521944a733998d3d985448f599fce1b1cf65dee2dd69031",
        isMalak: true
    }

];

const AUTH_SESSION_KEY = "ph_session";

async function sha256Hex(text) {

    const enc = new TextEncoder().encode(text);
    const digest = await crypto.subtle.digest("SHA-256", enc);

    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

}

function getSession() {

    try {

        const raw = sessionStorage.getItem(AUTH_SESSION_KEY);

        return raw ? JSON.parse(raw) : null;

    } catch (err) {

        return null;

    }

}

function setSession(account) {

    try {

        sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({

            isMalak: account.isMalak

        }));

    } catch (err) {}

}

function currentUserIsMalak() {

    const session = getSession();

    return !!(session && session.isMalak);

}

async function checkCredentials(email, password) {

    const emailHash = await sha256Hex(String(email).trim().toLowerCase());
    const passwordHash = await sha256Hex(String(password));

    return AUTH_ACCOUNTS.find((acc) =>

        acc.emailHash === emailHash && acc.passwordHash === passwordHash

    ) || null;

}


// =======================================
// Chapter Zero — cinematic sequence
// =======================================

function buildAuthGateMarkup() {

    if (document.querySelector(".auth-gate")) return;

    const gate = document.createElement("div");

    gate.className = "auth-gate";

    gate.innerHTML = `

<div class="auth-stars" id="auth-stars"></div>

<div class="auth-line" id="auth-line">Every story has someone it was written for...</div>

<div class="auth-card" id="auth-card">

    <div class="auth-card-glow"></div>

    <span class="auth-eyebrow">Chapter Zero</span>

    <h1 class="auth-title">قبل ما نبدأ...</h1>
    <p class="auth-subtitle">لازم أعرف مين اللي هيسمع الحكاية.</p>

    <form class="auth-form" id="auth-form" autocomplete="off">

        <label class="auth-field">
            <span>البريد الإلكتروني</span>
            <input type="email" id="auth-email" required autocomplete="username">
        </label>

        <label class="auth-field">
            <span>كلمة السر</span>
            <input type="password" id="auth-password" required autocomplete="current-password">
        </label>

        <button type="submit" class="auth-submit" id="auth-submit">
            <span class="auth-submit-label">ادخلي ❤️</span>
        </button>

        <p class="auth-error" id="auth-error" hidden>البريد أو كلمة السر مش مظبوطة... جرّبي تاني.</p>

    </form>

</div>

`;

    document.body.appendChild(gate);

}

function buildAuthStars(container, count = 70) {

    if (!container || container.childElementCount) return;

    for (let i = 0; i < count; i++) {

        const star = document.createElement("span");

        star.className = "auth-star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.opacity = (Math.random() * .6 + .25).toFixed(2);

        const size = Math.random() * 1.6 + 1;

        star.style.width = size + "px";
        star.style.height = size + "px";
        star.style.animationDelay = (Math.random() * 6) + "s";

        container.appendChild(star);

    }

}

// Starts the ambient bed softly right as the black screen opens.
// Browsers block unmuted autoplay without a gesture, so this tries
// immediately and, if blocked, quietly retries on the visitor's
// first tap/keystroke/pointer move — still well before the login
// card itself is ever reachable.
function startAuthAmbient() {

    const audio = document.querySelector("#ambient-audio");

    if (!audio) return;

    const base = typeof AMBIENT_BASE_VOLUME === "number" ? AMBIENT_BASE_VOLUME : .4;

    const tryPlay = () => {

        audio.volume = 0;

        audio.play().then(() => {

            ambientIsPlaying = true;

            gsap.to(audio, {

                volume: base,
                duration: 3,
                ease: "power1.out"

            });

            document.removeEventListener("pointerdown", tryPlay);
            document.removeEventListener("keydown", tryPlay);

        }).catch(() => {});

    };

    tryPlay();

    document.addEventListener("pointerdown", tryPlay, { once: true });
    document.addEventListener("keydown", tryPlay, { once: true });

}

// Plays the black-screen / quote / card reveal sequence, then
// resolves once the visitor has successfully signed in.
function runAuthGate() {

    return new Promise((resolve) => {

        buildAuthGateMarkup();

        const gate = document.querySelector(".auth-gate");
        const stars = document.querySelector("#auth-stars");
        const line = document.querySelector("#auth-line");
        const card = document.querySelector("#auth-card");
        const form = document.querySelector("#auth-form");
        const emailField = document.querySelector("#auth-email");
        const passwordField = document.querySelector("#auth-password");
        const submitBtn = document.querySelector("#auth-submit");
        const errorEl = document.querySelector("#auth-error");

        document.body.classList.add("scroll-locked");

        buildAuthStars(stars);
        startAuthAmbient();

        gsap.set(gate, { opacity: 1 });
        gsap.set(line, { opacity: 0 });
        gsap.set(card, { opacity: 0, y: 24, pointerEvents: "none" });

        const tl = gsap.timeline({ delay: .3 });

        tl.to(stars, {

            opacity: 1,
            duration: 2.4,
            ease: "power1.out"

        })

        .to(line, {

            opacity: 1,
            duration: 1.6,
            ease: "power1.out"

        }, "+=.4")

        .to(line, {

            opacity: 0,
            duration: 1.4,
            ease: "power1.inOut"

        }, "+=2.6")

        .to(card, {

            opacity: 1,
            y: 0,
            duration: 1.4,
            ease: "power3.out",
            pointerEvents: "auto",
            onComplete: () => emailField.focus()

        }, "-=.4");

        function showError(message) {

            errorEl.textContent = message || errorEl.textContent;
            errorEl.hidden = false;

            gsap.fromTo(card, { x: -6 }, {

                x: 0,
                duration: .5,
                ease: "elastic.out(1, .4)"

            });

        }

        form.addEventListener("submit", async (e) => {

            e.preventDefault();

            errorEl.hidden = true;
            submitBtn.disabled = true;
            submitBtn.classList.add("is-loading");

            const account = await checkCredentials(emailField.value, passwordField.value);

            submitBtn.disabled = false;
            submitBtn.classList.remove("is-loading");

            if (!account) {

                showError();
                passwordField.value = "";
                passwordField.focus();
                return;

            }

            setSession(account);

            gsap.timeline({

                onComplete: () => {

                    gate.remove();
                    document.body.classList.remove("scroll-locked");
                    resolve();

                }

            })

            .to(card, {

                opacity: 0,
                y: -16,
                duration: .8,
                ease: "power2.in"

            })

            .to(gate, {

                opacity: 0,
                duration: 1,
                ease: "power1.inOut"

            }, "-=.2");

        });

    });

}

// Entry point used by main.js. Skips straight past the cinematic
// sequence if a valid session already exists from earlier in the
// same tab (e.g. a reload mid-story).
function initAuthGate(onDone) {

    if (getSession()) {

        onDone();
        return;

    }

    runAuthGate().then(onDone);

}
