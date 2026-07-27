// =======================================
// Project Hope
// The Things I Never Said · Hall of Regret ·
// If I Could Go Back · Final Room · Message Box
//
// EDIT ME: bracketed guidance marks lines that only work if
// they're specific to what actually happened, not a template.
// =======================================

// ---- The Things I Never Said ----
// EDIT ME: keep these short. One breath each.
const neverSaidLines = [

    "أنا كنت فاكر إنك عارفة...",
    "عارفة إني بحبك.",
    "وعارفة إني مقدرك.",
    "وعارفة إن وجودك كان فارق معايا.",
    "فاكتفيت إني أحس...",
    "ونسيت إن في حاجات...",
    "لازم تتقال."

];

// ---- Hall of Regret ----
// EDIT ME: one thought at a time. Don't soften these.
const regretFragments = [

    "أنا غلطت.",

    "وأذيتك.",

    "وأذيت الحاجة الوحيدة...",
    
    "اللي كانت تستحق إني أحافظ عليها.",

    "مش هقدر أغير اللي فات.",

    "بس أقدر أفضل أحاول...",

    "وأثبتلك إن الإنسان ممكن يتعلم من غلطه.",

    "وأنا لسه هنا...",

    "وهفضل أحاول أصلح اللي كسرته.",

    "لحد آخر فرصة.",

    "وأنا آسف يا ملك."

];

// ---- My Perspective ----
// EDIT ME: placeholder only — a quiet reflection, not a case
// for reconciliation. It explains how you experienced things;
// it doesn't ask her to feel the same or respond a certain way.
// The last line especially should stay as an honest release,
// not a lead-in to a request.
const perspectiveLines = [

    "في حاجة اتعلمتها من كل اللي حصل بينا... وحبيت أقولها.",

    "الحب لوحده مش كفاية... لازم كل واحد فينا يعرف يقول للتاني هو حاسس بإيه، حتى لو الكلام صعب.",

    "ولو زعلان... قول. ولو مضايق... قول. ولو محتاج حاجة... قول. السكوت عمره ما كان بيحل حاجة.",

    "ومتستنيش اللي قدامك يفهم لوحده... مهما كان بيحبك، هو مش هيعرف اللي جواك غير لما تقوله.",

    "وأنا كمان غلطت لما كنت بسيب حاجات جوايا تكبر، بدل ما أجيلك وأحكيلك من أولها.",

    "وعايزك تعرفي حاجة... مهما حصل بينا، أنا عمري ما كرهتك. ولا حتى دقيقة.",

    "ولو في يوم زعلت منك... فصدقيني، أنا مسامحك من قلبي. لأن الحب بالنسبالي كان أكبر من أي خلاف.",

    "وأنا لحد النهارده... بحبك. يمكن بطريقة أهدى... وأنضج... لكن بحبك بجد.",

    "وأتمنى... سواء كملنا سوا أو لا... إننا نفضل دايمًا صادقين مع بعض. لأن الحقيقة، حتى لو بتوجع... أهون بكتير من السكوت.",

    "وده كل اللي كان نفسي توصليله... أكتر من أي حاجة تانية."

];

function initRegretChapters() {

    if (document.querySelector("#hall-of-regret")) return;

    const ending = document.querySelector(".ending");
    const app = document.querySelector("#app");

    if (!app) return;

    const target = ending || app;
    const position = ending ? "beforebegin" : "beforeend";

    target.insertAdjacentHTML(position, `

<!-- ===================================== -->
<!-- The Things I Never Said -->
<!-- Black. Silent. One line at a time. -->
<!-- ===================================== -->

<section class="room never-said-room" id="things-i-never-said">

    <div class="room-inner">

        <div class="never-said-text never-said-line" id="never-said-text"
             aria-live="polite" aria-atomic="true"></div>

    </div>

</section>


<!-- ===================================== -->
<!-- Hall of Regret -->
<!-- No photos. No effects. Just the truth. -->
<!-- ===================================== -->

<section class="room regret-room" id="hall-of-regret">

    <div class="regret-dim" id="regret-dim"></div>

    <div class="room-inner">

        <span class="room-eyebrow">في الأوضة دي</span>

<p class="room-line">
مش كل الذكريات كانت حلوة...
</p>      
<p class="room-line">
وفي لحظة...
أنا كنت السبب في وجعك.
</p>

<p class="room-line">
واللحظة دي...
مينفعش أعدي عليها كأنها محصلتش.
</p>
        <div class="regret-fragment" id="regret-fragment" aria-live="polite" aria-atomic="true"></div>

    </div>

    <!--
        Optional soft piano. Drop a file at
        assets/audio/piano-regret.mp3 and it fades in only while
        this room is on screen — otherwise it stays silent.
    -->
    <audio id="regret-room-audio" loop preload="none">
        <source src="assets/audio/piano63.mp3" type="audio/mpeg">
    </audio>

</section>


<!-- ===================================== -->
<!-- If I Could Go Back -->
<!-- Honest reflection. Not promises. -->
<!-- ===================================== -->

<section class="room goback-room" id="if-i-could-go-back">

    <div class="room-inner">

        <span class="room-eyebrow">لو رجع بيا الزمن</span>

        <p class="room-line">مش هوعدك بحاجة...</p>
        <p class="room-line">بس ده اللي كنت هغيره لو قدرت.</p>

        <div class="goback-list">

            <!-- EDIT ME: replace with the 2–4 real, specific things
                 you'd have done differently. Specific beats poetic. -->

          <p class="goback-item">
كنت هسمعك للنهاية...
قبل ما أرد.
</p>

<p class="goback-item">
كنت هفتكر إننا في نفس الفريق...
مش في نقاش لازم حد يكسبه.
</p>

<p class="goback-item">
كنت هقولك إني موجوع...
بدل ما أسيب الزعل يكبر بينا لحد ما بقينا مش عارفين نوصل لبعض.
</p>

<p class="goback-item">
كنت هفتكر كل يوم...
إن الناس اللي بنحبها...
مش بتفضل معانا لمجرد إننا بنحبهم.
لازم نحافظ عليهم.
</p>
<p class="goback-item">
كنت هجيلك كل مرة وأنا زعلان...
زي ما كنت بجيلك وأنا مبسوط.
ومكنتش هسيب بينا مساحة...
تكبر لحد ما بقت بحر.
</p>

        </div>

    </div>

</section>


<!-- ===================================== -->
<!-- Final Room -->
<!-- Almost empty. One chair. Soft daylight. No request. -->
<!-- ===================================== -->

<section class="room final-room" id="final-room">

    <div class="final-room-window" aria-hidden="true"></div>
    <div class="final-room-floor-glow" aria-hidden="true"></div>

    <div class="room-inner">

        <span class="room-eyebrow">آخر صفحة...</span>

        <!-- بدل الكرسي -->
        <div class="final-room-heart" aria-hidden="true">❤️</div>

        <p class="room-line">
            يمكن حاجات كتير اتغيرت...
        </p>

        <p class="room-line">
            ويمكن الطريق مبقاش زي الأول...
        </p>

        <p class="room-line">
            بس في حاجة واحدة...
            <br>
            عمرها ما اتغيرت.
        </p>

        <p class="room-line">
            مكانك...
            <br>
            لسه موجود جوا قلبي.
        </p>

        <p class="room-line">
            ومحدش عرف ياخده...
            <br>
            ولا هيعرف.
        </p>

        <p class="room-line is-muted">
            وأنا مش بقول الكلام ده عشان أضغط عليكي...
            <br>
            ولا عشان أطلب منك قرار دلوقتي.
        </p>

        <p class="room-line is-muted">
            أنا بس حبيت تعرفي...
            <br>
            إن مهما عدى وقت...
            <br>
            إنتي لسه أغلى حد عرفته.
        </p>

        <p class="room-line is-muted">
            ولو في يوم...
            <br>
            قررتي ترجعي...
            <br>
            هتلاقيني...
            <br>
            لسه مستنيكي.
        </p>

    </div>

    <audio id="final-room-audio" loop preload="none">
        <source src="assets/audio/final3153.mp3" type="audio/mpeg">
    </audio>

</section>

<!-- ===================================== -->
<!-- My Perspective -->
<!-- A quiet reflection, not a plea. Reuses the same -->
<!-- warm, dark "goback-room" treatment on purpose. -->
<!-- ===================================== -->

<section class="room goback-room reflection-room" id="my-perspective">

    <div class="room-inner">

        <span class="room-eyebrow">حاجة عايز أوضحها</span>

        <div class="goback-list" id="perspective-list"></div>

    </div>

</section>


<!-- ===================================== -->
<!-- Message Box -->
<!-- Nothing here requires a response. -->
<!-- ===================================== -->

<section class="message-box" id="leave-a-message">

    <div class="message-card">

        <h3>
            ولو لسه عندك كلام...
        </h3>

        <p>
            يمكن أنا اتكلمت كتير...
            <br>
            دلوقتي الدور عليكي.
            <br><br>
            اكتبي أي حاجة...
            حتى لو كانت كلمة واحدة.
        </p>

        <textarea
            id="message-input"
            placeholder="اكتبي اللي في قلبك..."
            aria-label="اكتبي رسالة">
        </textarea>

        <div class="message-actions">

            <button class="message-send" id="message-send">
                ابعتي رسالتك
            </button>

            <button class="message-skip" id="message-skip">
                يمكن في وقت تاني
            </button>

        </div>

        <p class="message-done" id="message-done">
            شكراً إنك وصلتي لآخر الحكاية. ❤️
        </p>

        <p class="message-error" id="message-error"></p>

    </div>

</section>

`);

    initNeverSaidSequence();
    initRegretSequence();
    buildPerspectiveRoom();
    animateStaticRooms();
    initMessageBox();
    initRoomAmbience();

}


// =======================================
// My Perspective
// Same reveal treatment as "If I Could Go Back" — this just
// fills in its content from the data array above, the same
// way the goback-room's own list could be data-driven.
// =======================================

function buildPerspectiveRoom() {

    const list = document.querySelector("#perspective-list");

    if (!list) return;

    perspectiveLines.forEach((line) => {

        list.insertAdjacentHTML("beforeend", `<p class="goback-item">${line}</p>`);

    });

}


// =======================================
// The Things I Never Said
// A single line at a time, on a black screen, in total
// silence. Fades in, holds, fades away, then the next.
// =======================================

function initNeverSaidSequence() {

    const room = document.querySelector("#things-i-never-said");
    const el = document.querySelector("#never-said-text");

    if (!room || !el) return;

    const player = createSequencePlayer({

        reset: () => {

            gsap.killTweensOf(el);
            gsap.set(el, { opacity: 0 });
            el.textContent = "";

        },

        run: (token) => runNeverSaidSequence(el, token)

    });

    initRoomSequence(room, player, { start: "top 55%" });

}

async function runNeverSaidSequence(el, token) {

    for (const line of neverSaidLines) {

        if (token.cancelled) return;

        el.textContent = line;

        await gsap.to(el, {
            opacity: 1,
            duration: 2.2,
            ease: "power1.inOut"
        });

        if (token.cancelled) return;

        await sequenceWait(2600);

        if (token.cancelled) return;

        await gsap.to(el, {
            opacity: 0,
            duration: 1.8,
            ease: "power1.inOut"
        });

        if (token.cancelled) return;

        await sequenceWait(900);

    }

    if (token.cancelled) return;

    // A long, deliberate breath of black before the next chapter
    await autoAdvance(token, "#hall-of-regret", 1800);

}


// =======================================
// Hall of Regret
// Thought by thought, not paragraph by paragraph. The room
// keeps dimming as the truth settles.
// =======================================

function initRegretSequence() {

    const room = document.querySelector("#hall-of-regret");
    const el = document.querySelector("#regret-fragment");
    const dim = document.querySelector("#regret-dim");
    const eyebrow = room?.querySelector(".room-eyebrow");
    const introLines = room?.querySelectorAll(".room-line");

    if (!room || !el) return;

    const player = createSequencePlayer({

        reset: () => {

            gsap.killTweensOf([el, dim, eyebrow, ...(introLines ?? [])].filter(Boolean));

            gsap.set(el, { opacity: 0 });
            gsap.set(dim, { opacity: 0 });
            el.textContent = "";

            if (eyebrow) gsap.set(eyebrow, { opacity: 0 });

            if (introLines?.length) {

                gsap.set(introLines, { opacity: 0, y: 20 });

            }

        },

        run: (token) => runRegretSequence(el, dim, eyebrow, introLines, token)

    });

    initRoomSequence(room, player, { start: "top 60%" });

}

async function runRegretSequence(el, dim, eyebrow, introLines, token) {

    if (eyebrow) {

        await gsap.to(eyebrow, { opacity: 1, duration: 1.8 });

        if (token.cancelled) return;

    }

    if (introLines?.length) {

        await gsap.to(introLines, {

            opacity: 1,
            y: 0,
            duration: 1.6,
            stagger: .9,
            ease: "power2.out"

        });

        if (token.cancelled) return;

        await sequenceWait(1400);

        if (token.cancelled) return;

    }

    const step = 1 / regretFragments.length;

    for (let i = 0; i < regretFragments.length; i++) {

        if (token.cancelled) return;

        el.textContent = regretFragments[i];

        gsap.to(dim, {
            opacity: Math.min(.4, step * (i + 1) * .4),
            duration: 2
        });

        await gsap.to(el, {
            opacity: 1,
            duration: 1.8,
            ease: "power1.inOut"
        });

        if (token.cancelled) return;

        // the room stays almost silent — long holds between thoughts
        await sequenceWait(i === regretFragments.length - 1 ? 3800 : 2600);

        if (token.cancelled) return;

        await gsap.to(el, {
            opacity: 0,
            duration: 1.4,
            ease: "power1.inOut"
        });

        if (token.cancelled) return;

        await sequenceWait(1000);

    }

    if (token.cancelled) return;

    // Nothing left on screen once the last thought fades — a
    // natural moment to move on to the next room.
    await autoAdvance(token, "#if-i-could-go-back", 2000);

}


// =======================================
// Room Ambience
// Stays completely silent until a real audio file exists —
// same pattern as the site's ambient background music.
// =======================================

function initRoomAmbience() {

    initSingleRoomAmbience("#hall-of-regret", "#regret-room-audio", .2);
    initSingleRoomAmbience("#final-room", "#final-room-audio", .16);

}

function initSingleRoomAmbience(roomSelector, audioSelector, targetVolume) {

    const room = document.querySelector(roomSelector);
    const audio = document.querySelector(audioSelector);

    if (!room || !audio) return;

    // Each room is a section soundtrack in the audio manager's
    // terms — starting one fades out any other room's track (or
    // the chat theme) automatically, and silences the ambient
    // bed for as long as this room is on screen.
    let ready = false;

    audio.addEventListener("canplaythrough", () => {

        ready = true;

    }, { once: true });

    audio.addEventListener("error", () => {

        audio.remove();

    }, { once: true });

    audio.volume = 0;
    audio.load();

    ScrollTrigger.create({

        trigger: room,
        start: "top 60%",
        end: "bottom 40%",

        onEnter: () => { if (ready) playSectionAudio(audio, targetVolume); },
        onEnterBack: () => { if (ready) playSectionAudio(audio, targetVolume); },
        onLeave: () => stopSectionAudio(audio),
        onLeaveBack: () => stopSectionAudio(audio)

    });

}


// =======================================
// If I Could Go Back / Final Room
// Still a calm fade + rise reveal, once, on scroll.
// =======================================

function animateStaticRooms() {

    document.querySelectorAll(".goback-room, .final-room").forEach((room) => {

        const eyebrow = room.querySelector(".room-eyebrow");
        const lines = room.querySelectorAll(".room-line, .goback-item, .final-room-chair");

        let activeTimeline = null;

        const player = createSequencePlayer({

            reset: () => {

                if (activeTimeline) activeTimeline.kill();

                if (eyebrow) gsap.set(eyebrow, { opacity: 0 });

                gsap.set(lines, { opacity: 0, y: 20 });

            },

            run: () => {

                const tl = gsap.timeline();

                activeTimeline = tl;

                if (eyebrow) {

                    tl.to(eyebrow, {
                        opacity: 1,
                        duration: 1.6
                    });

                }

                tl.to(lines, {

                    opacity: 1,
                    y: 0,
                    duration: 1.5,
                    stagger: .7,
                    ease: "power2.out"

                }, eyebrow ? "-=.6" : 0);

            }

        });

        // Hide immediately at setup — otherwise the room would
        // briefly flash fully visible before the first scroll
        // ever reaches it and triggers a proper reset.
        player.cancel();

        // No auto-advance here on purpose — every line in these
        // rooms stays visible together once revealed, so there's
        // still something on screen to read right after they
        // finish appearing. Moving on is left to the visitor.
        initRoomSequence(room, player, { start: "top 65%" });

    });

}


// =======================================
// Message Box
// Sent live via EmailJS — nothing is stored locally anymore.
// =======================================

const EMAILJS_SERVICE_ID = "service_i93uey8";
const EMAILJS_TEMPLATE_ID = "template_3lps0jg";
const EMAILJS_PUBLIC_KEY = "i60XgCvTdjdBJUqGB";

function initMessageBox() {

    const send = document.querySelector("#message-send");
    const skip = document.querySelector("#message-skip");
    const input = document.querySelector("#message-input");
    const done = document.querySelector("#message-done");
    const error = document.querySelector("#message-error");
    const actions = document.querySelector(".message-actions");

    if (!send || !skip) return;

    if (window.emailjs) {

        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

    }

    const sendLabel = send.textContent;

    const showDone = () => {

        actions.style.display = "none";
        input.setAttribute("disabled", "true");
        done.classList.add("is-visible");

    };

    const showError = (message) => {

        if (!error) return;

        error.textContent = message;
        error.classList.add("is-visible");

    };

    const clearError = () => {

        if (!error) return;

        error.textContent = "";
        error.classList.remove("is-visible");

    };

    const setSending = (isSending) => {

        send.disabled = isSending;
        skip.disabled = isSending;
        send.textContent = isSending ? "جاري الإرسال..." : sendLabel;

    };

    send.addEventListener("click", () => {

        const text = input.value.trim();

        clearError();

        if (!text) {

            showError("اكتبي حاجة الأول من فضلك 🤍");
            return;

        }

        if (!window.emailjs) {

            showError("مش قادر أبعت الرسالة دلوقتي، جربي تاني كمان شوية.");
            return;

        }

        setSending(true);

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {

            message: text,
            time: new Date().toLocaleString(),
            user_agent: navigator.userAgent

        }).then(() => {

            showDone();

        }).catch(() => {

            setSending(false);
            showError("حصلت مشكلة والرسالة ما اتبعتش... جربي تاني.");

        });

    });

    // Skipping still just moves on — nothing is written or sent.
    skip.addEventListener("click", () => showDone());

}