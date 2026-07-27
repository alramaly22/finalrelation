// =======================================
// Project Hope
// The Epilogue — the true final chapter
//
// Runs once, after the Questionnaire's answers have been
// sent. Nothing here is interactive: the chapter plays a
// voice recording, writes itself out in sync with it, and
// ends on black. There is no button anywhere in this file.
//
// Everything you'll ever need to change lives in the three
// EDIT ME blocks at the top. The logic below never needs to
// be touched to swap the recording or rewrite the message.
// =======================================


// =======================================
// EDIT ME 1/3 — the script
//
// One entry per sentence. `at` is when it should appear,
// written as it reads on a stopwatch: "0:06", "1:24",
// "01:24.5" all work, and a plain number means seconds.
//
// They only have to be in order and inside the recording's
// length — nothing else about them matters. Add as many as
// you like; the chapter grows to fit.
//
// (A sentence actually begins fading in a fraction of a
// second before its timestamp, so it's fully readable at the
// moment you say it rather than a beat behind. That's
// EPILOGUE.lineLead below — you can write the timestamps
// exactly as you hear them and ignore it.)
// =======================================

const EPILOGUE_SCRIPT = [

    { at: "0:00", text: "اممم..." },

    { at: "0:18", text: "حاسس إن ده أهم ريكورد هبعتهولك." },

    { at: "0:42", text: "وأهم رسالة في الموقع كله." },

    { at: "1:05", text: "يمكن الرسالة دي تفهمك قصدي أكتر." },

    { at: "1:35", text: "يا ملك..." },

    { at: "1:55", text: "أنا بحبك أوي." },

    { at: "2:20", text: "وناوي أتغير بجد." },

    { at: "2:50", text: "أنا عايز أصلح كل غلطة عملتها." },

    { at: "3:18", text: "حتى لو هياخد مني وقت." },

    { at: "3:50", text: "فيه سؤال واحد..." },

    { at: "4:12", text: "هو اللي لسه مش سايبني." },

    { at: "4:40", text: "أنا بس محتاج أفهم." },

    { at: "5:15", text: "أنا قبل ما أعرفك..." },

    { at: "5:40", text: "كنت فاكر إني حبيت." },

    { at: "6:05", text: "لكن لما حبيتك..." },

    { at: "6:35", text: "اكتشفت إن اللي قبله كله..." },

    { at: "7:00", text: "مكانش حب أصلاً." },

    { at: "7:35", text: "أول مرة ألاقي حد نفسي أكلمه طول اليوم." },

    { at: "8:05", text: "أول مرة أخاف حد يبعد." },

    { at: "8:35", text: "وأول مرة..." },

    { at: "8:50", text: "أحس إن حد..." },

    { at: "9:05", text: "بقى بيتي." },

    { at: "9:45", text: "الموقع ده اتعمل علشانك." },

    { at: "10:15", text: "ولو دي آخر رسالة..." },

    { at: "10:40", text: "يا ملك..." },

    { at: "10:52", text: "أنا بحبك." },

    { at: "10:58", text: "أكتر مما هتعرف الكلمات توصف." }

];


// =======================================
// EDIT ME 2/3 — the beats on black
//
// Each array is one beat: its lines arrive one after another,
// rest together, then leave together before the next beat.
// =======================================

const EPILOGUE_TRANSITION_BEATS = [

    ["في حاجة أخيرة..."],

    ["كنت عايزك تسمعيها مني..."],

    ["مفيش أسئلة تانية...", "ومفيش شرح تاني...", "أنا بس."]

];


// =======================================
// EDIT ME 3/3 — timing, audio, and the last frame
//
// Drop the recording at assets/audio/epilogue-voice.mp3 and
// it plays automatically. If the file isn't there yet, the
// chapter still runs exactly as it will on the night — it
// just keeps the timestamps on an internal clock instead, so
// you can rehearse the whole thing before recording anything.
//
// An ambient bed is optional: drop assets/audio/epilogue-ambient.mp3
// and it's used. Otherwise the Questionnaire's own quiet pad
// carries the chapter, ducking and returning the same way.
// =======================================

const EPILOGUE = {

    // ---- audio ----
    voice: "assets/audio/me.mp3",
    ambient: "assets/audio/me.mp3",

    ambientLevel: .16,          // ambient FILE volume, resting
    ambientDucked: .04,         // ambient FILE volume, under the voice
    padLevel: .022,             // synthesized pad, resting
    padDucked: .006,            // synthesized pad, under the voice

    // ---- the walk into the dark (ms unless the name says seconds) ----
    holdAfterSent: 4200,        // the heart holds before we dissolve
    fadeToVeil: 2.6,            // seconds — Questionnaire into black
    blackHold: 2000,            // pure black before the first line
    lineIn: 1.6,                // seconds — a black-screen line arriving
    lineHold: 2300,             // a finished line resting on screen
    lineOut: 1.4,               // seconds
    subLineStagger: 1500,       // between lines inside one beat
    betweenBeats: 800,          // black between beats
    blackBeforeReveal: 1800,    // black after the last line

    // ---- the chapter ----
    revealChapter: 3.2,         // seconds — stars and light arriving
    voiceLeadIn: 2600,          // atmosphere before the voice starts
    duckFade: 2.4,              // seconds — music stepping back
    returnFade: 5,              // seconds — music coming back

    // ---- the script's pacing ----
    scriptLineIn: 1.25,         // seconds — a spoken sentence arriving
    lineLead: .45,              // seconds a sentence starts early
    demoteFade: 1.4,            // seconds — a sentence stepping back
    pastOpacity: .3,            // how present an already-said line stays

    // ---- the last frame ----
    silenceAfterVoice: 3800,    // silence once the voice stops
    dimPastLines: 2.6,          // seconds — earlier sentences leaving
    holdLastLine: 4600,         // the final sentence holds alone
    fadeToBlack: 3.4,           // seconds
    blackBeforeEnd: 1800,       // black before the last frame
    endIn: 2.6,                 // seconds

    endMark: "Project Hope",
    endWord: "The End.",

    // ---- rehearsal fallback ----
    // Only used when the recording is missing or can't play:
    // how long the chapter pretends the last sentence lasts.
    clockTail: 7,

    // How far behind real time the recording is allowed to fall
    // before the chapter stops waiting for it and carries on.
    stallGrace: 30

};


// =======================================
// Nothing below here needs editing.
// =======================================

const epilogueReduceMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function epilogueWait(ms) {

    return new Promise((resolve) => setTimeout(resolve, ms));

}

// "1:24.5" / "0:06" / 84 → seconds
function epilogueParseTime(value) {

    if (typeof value === "number") return value;

    const parts = String(value).trim().split(":").map(Number);

    if (parts.some((n) => Number.isNaN(n))) return 0;

    return parts.reduce((total, part) => total * 60 + part, 0);

}

// Sorted cues, each pulled `lineLead` earlier so the sentence
// lands fully readable on the beat instead of a fade behind it,
// and each carrying the gap to the next one so the writer can
// pace its fade to the room it actually has.
function epilogueCues() {

    const cues = EPILOGUE_SCRIPT
        .map((cue) => ({
            time: Math.max(0, epilogueParseTime(cue.at) - EPILOGUE.lineLead),
            text: cue.text
        }))
        .sort((a, b) => a.time - b.time);

    cues.forEach((cue, i) => {

        const next = cues[i + 1];

        cue.gap = next ? next.time - cue.time : Infinity;

    });

    return cues;

}


// =======================================
// Markup
// Built here rather than in index.html for the same reason
// the auth gate and the rooms are — this chapter shouldn't
// exist in the document at all until it's earned.
// =======================================

function buildEpilogueMarkup() {

    if (document.querySelector(".epilogue")) return;

    const veil = document.createElement("div");

    veil.className = "epilogue-veil";
    veil.id = "epilogue-veil";

    veil.innerHTML = `

<div class="epilogue-veil__lines" id="epilogue-veil-lines"
     aria-live="polite" aria-atomic="false"></div>

<div class="epilogue-end" id="epilogue-end" hidden>
    <span class="epilogue-end__mark">${EPILOGUE.endMark}</span>
    <span class="epilogue-end__rule" id="epilogue-end-rule"></span>
    <span class="epilogue-end__word">${EPILOGUE.endWord}</span>
</div>

`;

    const chapter = document.createElement("section");

    chapter.className = "epilogue";
    chapter.id = "epilogue";

    chapter.innerHTML = `

<canvas class="epilogue-stars" id="epilogue-stars" aria-hidden="true"></canvas>

<div class="epilogue-glow" aria-hidden="true"></div>

<div class="epilogue-stage" id="epilogue-stage">

    <div class="epilogue-script" id="epilogue-script"
         aria-live="polite" aria-atomic="false"></div>

</div>

`;

    // The chapter goes in first so the veil always sits on top of it.
    document.body.append(chapter, veil);

}


// =======================================
// Star field
//
// Three depths in one pass: the further back a star is, the
// slower it drifts, the smaller and fainter it is, and the
// less the camera's own movement pushes it around. That
// difference is the whole parallax effect.
//
// Everything moves on real elapsed time rather than a fixed
// per-frame step, so the sky drifts at exactly the same speed
// on a 120Hz phone, a 60Hz laptop, and a machine dropping
// frames — the one thing that would betray it as an animation
// rather than a sky.
// =======================================

function createEpilogueStars(canvas) {

    const c = canvas.getContext("2d");

    let stars = [];
    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = null;
    let last = 0;
    let t = 0;
    let resizeTimer = null;

    function resize() {

        dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = canvas.clientWidth;
        height = canvas.clientHeight;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);

    }

    function build(count) {

        stars = Array.from({ length: count }, () => {

            const depth = Math.random();

            return {
                x: Math.random(),
                y: Math.random(),
                depth,
                radius: .35 + (1 - depth) * 1.15,
                drift: .0018 + (1 - depth) * .0055,   // screens per second
                sway: (Math.random() - .5) * .0007,
                alpha: .1 + (1 - depth) * .38,
                phase: Math.random() * Math.PI * 2,
                twinkle: .3 + Math.random() * .45
            };

        });

    }

    function draw(dt) {

        t += dt;

        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, width, height);

        // The camera: two very slow, unrelated waves, so the drift
        // never resolves into a loop the eye can catch.
        const camX = Math.sin(t * .07) * 16;
        const camY = Math.cos(t * .051) * 11;

        stars.forEach((star) => {

            star.y -= star.drift * dt;
            star.x += star.sway * dt;

            if (star.y < -.02) {
                star.y = 1.02;
                star.x = Math.random();
            }

            if (star.x < -.02) star.x = 1.02;
            if (star.x > 1.02) star.x = -.02;

            const push = 1 - star.depth;
            const x = star.x * width + camX * push;
            const y = star.y * height + camY * push;

            // A calm shimmer, never a blink.
            const shimmer = .72 + .28 * Math.sin(t * star.twinkle + star.phase);

            c.beginPath();
            c.arc(x, y, star.radius, 0, Math.PI * 2);
            c.fillStyle = `rgba(245, 242, 236, ${(star.alpha * shimmer).toFixed(3)})`;
            c.fill();

        });

    }

    function frame(now) {

        // Clamped so a backgrounded tab can't jump the sky forward
        // by however long the visitor was away.
        const dt = Math.min((now - last) / 1000, .05);

        last = now;

        draw(dt);

        raf = requestAnimationFrame(frame);

    }

    function onResize() {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            resize();

            // A static sky has to be redrawn by hand after a resize.
            if (epilogueReduceMotion) draw(0);

        }, 120);

    }

    function start() {

        resize();

        // Density by screen area, not a flat count — otherwise the
        // same number of stars that reads as a quiet sky on a laptop
        // reads as a crowded one on a phone, and costs more per pixel
        // to draw there.
        const area = Math.max(1, width * height);
        const count = Math.round(
            Math.max(45, Math.min(130, area / 9000))
        );

        build(epilogueReduceMotion ? Math.round(count * .35) : count);

        window.addEventListener("resize", onResize);

        if (epilogueReduceMotion) {

            draw(0);
            return;

        }

        if (raf === null) {

            last = performance.now();
            raf = requestAnimationFrame(frame);

        }

    }

    function destroy() {

        if (raf !== null) cancelAnimationFrame(raf);

        raf = null;

        clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);

        stars = [];

        c.setTransform(1, 0, 0, 1, 0, 0);
        c.clearRect(0, 0, canvas.width, canvas.height);

    }

    return { start, destroy };

}


// =======================================
// The chapter's music bed
//
// One switch with three positions — resting, ducked, silent —
// so the rest of the file never has to know whether the bed
// happens to be a real file or the Questionnaire's own
// synthesized pad. Both are driven through here.
// =======================================

const EpilogueAmbient = (() => {

    let fileEl = null;
    let fileReady = false;

    function isMuted() {

        return !!(window.Sounds && typeof Sounds.isMuted === "function" && Sounds.isMuted());

    }

    function attach(host) {

        fileEl = document.createElement("audio");

        fileEl.id = "epilogue-ambient-audio";
        fileEl.loop = true;
        fileEl.preload = "auto";
        fileEl.volume = 0;
        fileEl.src = EPILOGUE.ambient;

        fileEl.addEventListener("canplaythrough", () => {

            fileReady = true;

        }, { once: true });

        fileEl.addEventListener("error", () => {

            fileReady = false;

            if (fileEl) fileEl.remove();

            fileEl = null;

        }, { once: true });

        host.appendChild(fileEl);

        fileEl.load();

    }

    function setPad(level, seconds) {

        if (window.Sounds && typeof Sounds.setPadLevel === "function") {

            Sounds.setPadLevel(level, seconds);

        }

    }

    // position: "rest" | "duck" | "silent"
    function to(position, seconds) {

        const muted = isMuted();

        if (fileReady && fileEl) {

            // A real bed takes over completely — the pad steps aside
            // so the two can never layer on top of each other.
            setPad(0, Math.min(seconds, 2));

            const target = muted || position === "silent"
                ? 0
                : position === "duck" ? EPILOGUE.ambientDucked
                : EPILOGUE.ambientLevel;

            if (target > 0 && fileEl.paused) fileEl.play().catch(() => {});

            gsap.to(fileEl, {

                volume: target,
                duration: seconds,
                ease: "power1.inOut",
                overwrite: "auto",

                onComplete: () => {

                    if (target === 0 && fileEl) fileEl.pause();

                }

            });

            return;

        }

        if (muted) {

            setPad(0, seconds);
            return;

        }

        setPad(
            position === "rest" ? EPILOGUE.padLevel
            : position === "duck" ? EPILOGUE.padDucked
            : 0,
            seconds
        );

    }

    function destroy() {

        if (fileEl) {

            gsap.killTweensOf(fileEl);
            fileEl.pause();
            fileEl.removeAttribute("src");

            try { fileEl.load(); } catch (err) {}

            fileEl.remove();
            fileEl = null;

        }

        fileReady = false;

        // The pad's oscillators have been running since the
        // Questionnaire opened — this is where they finally stop.
        if (window.Sounds && typeof Sounds.stopPad === "function") {

            Sounds.stopPad(1.4);

        }

    }

    return { attach, to, destroy };

})();


// =======================================
// The voice
// =======================================

function attachEpilogueVoice(host) {

    const el = document.createElement("audio");

    el.id = "epilogue-voice-audio";
    el.preload = "auto";
    el.src = EPILOGUE.voice;

    let settled = false;
    let usable = false;

    const ready = new Promise((resolve) => {

        const settle = (ok) => {

            if (settled) return;

            settled = true;
            usable = ok;

            resolve(ok);

        };

        el.addEventListener("canplaythrough", () => settle(true), { once: true });
        el.addEventListener("error", () => settle(false), { once: true });

        // Don't hold the chapter hostage to a slow network — if the
        // file hasn't confirmed itself by the time the transition is
        // over, the rehearsal clock takes it from there.
        setTimeout(() => settle(false), 12000);

    });

    host.appendChild(el);

    el.load();

    function destroy() {

        try {

            el.pause();
            el.removeAttribute("src");
            el.load();

        } catch (err) {}

        el.remove();

    }

    return {
        el,
        ready,
        isUsable: () => usable,
        destroy
    };

}


// =======================================
// The clock
//
// One source of truth for "where are we in the recording",
// and the single place that knows the chapter can be running
// without audio at all. Three situations, one behaviour:
//
//   - the recording plays  → its own currentTime drives the
//     text, so the words can never drift out of sync with
//     the voice no matter how the file buffers
//   - no recording yet     → a wall clock stands in, and the
//     whole chapter rehearses at full length
//   - playback is refused  → the wall clock starts the text
//     immediately, and if a tap does let the audio through
//     later, the recording is seeked to where the text has
//     already reached so the two meet in the middle
// =======================================

function createEpilogueClock(voice, lastCueTime) {

    const startedAt = performance.now();

    let source = "clock";

    const wall = () => (performance.now() - startedAt) / 1000;

    function useAudio() {

        source = "audio";

    }

    function adoptAudioAt(seconds) {

        try {

            voice.el.currentTime = seconds;

        } catch (err) {}

        source = "audio";

    }

    function time() {

        return source === "audio" ? voice.el.currentTime : wall();

    }

    // How long the chapter should run before its closing silence.
    // The recording's real length wins as soon as the browser knows
    // it; otherwise the script's own last line decides.
    function limit() {

        const duration = voice.el.duration;

        if (source === "audio" && Number.isFinite(duration) && duration > 0) {

            return duration;

        }

        return lastCueTime + EPILOGUE.clockTail;

    }

    return { time, limit, useAudio, adoptAudioAt, wall };

}


// =======================================
// The script, written out in time with the voice
//
// The current sentence is always at the optical centre of
// the stage. Everything already spoken drifts upward, dims,
// and dissolves into the mask at the top edge — so the
// chapter reads like it's being written, and never like a
// paragraph that appeared.
// =======================================

function createEpilogueWriter(stage, script) {

    const lines = [];

    let resizeTimer = null;

    function recentre(line, duration) {

        if (!line) return;

        const anchor = line.offsetTop + line.offsetHeight / 2;
        const target = stage.clientHeight / 2 - anchor;

        gsap.to(script, {

            y: target,
            duration,
            ease: "power2.out",
            overwrite: "auto"

        });

    }

    // If the viewport changes mid-sentence — a phone's address bar
    // sliding away, a tablet being turned — the sentence being
    // spoken has to stay centred. Everything is measured, not
    // remembered, so this is just a re-measure.
    function onResize() {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            recentre(lines[lines.length - 1], .6);

        }, 160);

    }

    window.addEventListener("resize", onResize);

    function write(text, options = {}) {

        const instant = !!options.instant;

        // A sentence never takes longer to arrive than the room it
        // has before the next one — closely-spaced lines quicken
        // instead of piling their fades on top of each other.
        const room = Number.isFinite(options.gap) ? options.gap * .55 : Infinity;
        const fadeIn = Math.max(.45, Math.min(EPILOGUE.scriptLineIn, room));
        const demote = Math.max(.4, Math.min(EPILOGUE.demoteFade, room));

        // Demote whatever was current before this sentence.
        lines.forEach((el) => {

            el.classList.remove("is-current");
            el.classList.add("is-past");

            gsap.to(el, {

                opacity: EPILOGUE.pastOpacity,
                duration: instant ? 0 : demote,
                ease: "power1.inOut",
                overwrite: "auto"

            });

        });

        const line = document.createElement("p");

        line.className = "epilogue-line is-current";
        line.textContent = text;

        script.appendChild(line);
        lines.push(line);

        if (instant) {

            gsap.set(line, { opacity: 1, y: 0, filter: "blur(0px)" });
            recentre(line, 0);

            return line;

        }

        gsap.fromTo(line,

            {
                opacity: 0,
                y: 22,
                filter: epilogueReduceMotion ? "blur(0px)" : "blur(8px)"
            },

            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: fadeIn,
                ease: "power2.out"
            }

        );

        // The camera follows a touch slower than the words arrive —
        // the sentence settles into place rather than being carried
        // into it.
        recentre(line, epilogueReduceMotion ? 0 : Math.max(fadeIn, 1.1) * 1.25);

        return line;

    }

    // The last frame of the script: everything except the closing
    // sentence lets go, and that sentence is left alone at centre.
    function keepOnlyLast() {

        const last = lines[lines.length - 1];

        lines.forEach((el) => {

            if (el === last) return;

            gsap.to(el, {

                opacity: 0,
                filter: epilogueReduceMotion ? "blur(0px)" : "blur(6px)",
                duration: EPILOGUE.dimPastLines,
                ease: "power1.inOut",
                overwrite: "auto"

            });

        });

        if (!last) return;

        last.classList.remove("is-past");
        last.classList.add("is-current");

        gsap.to(last, {

            opacity: 1,
            duration: EPILOGUE.dimPastLines,
            ease: "power1.inOut",
            overwrite: "auto"

        });

        recentre(last, EPILOGUE.dimPastLines);

    }

    function destroy() {

        clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);

        gsap.killTweensOf(script);

        lines.forEach((el) => gsap.killTweensOf(el));

        lines.length = 0;

    }

    return { write, keepOnlyLast, destroy };

}


// =======================================
// The walk into the dark
// The Questionnaire dissolves, the music drops to almost
// nothing, and the beats play on pure black.
// =======================================

async function playEpilogueVeil(veil) {

    const host = document.querySelector("#epilogue-veil-lines");

    veil.classList.add("is-active");

    // The Questionnaire is faded out *underneath* an already-solid
    // veil, so the two chapters never overlap for even a frame.
    await gsap.to(veil, {

        opacity: 1,
        duration: EPILOGUE.fadeToVeil,
        ease: "power1.inOut"

    });

    const finale = document.querySelector("#finale-chapter");

    if (finale) {

        finale.classList.remove("is-active");
        finale.hidden = true;

    }

    // The Questionnaire's canvas has nothing left to draw.
    if (window.Animations && typeof Animations.stop === "function") {

        Animations.stop();

    }

    await epilogueWait(EPILOGUE.blackHold);

    for (const beat of EPILOGUE_TRANSITION_BEATS) {

        const block = document.createElement("div");

        block.className = "epilogue-veil-beat";

        const els = beat.map((text) => {

            const p = document.createElement("p");

            p.className = "epilogue-veil-line";
            p.textContent = text;

            block.appendChild(p);

            return p;

        });

        host.appendChild(block);

        // Inside a beat, lines arrive one after another and stay
        // together — then the whole beat leaves at once.
        for (let i = 0; i < els.length; i++) {

            gsap.to(els[i], {

                opacity: 1,
                duration: EPILOGUE.lineIn,
                ease: "power2.out"

            });

            if (i < els.length - 1) await epilogueWait(EPILOGUE.subLineStagger);

        }

        await epilogueWait(EPILOGUE.lineHold);

        await gsap.to(els, {

            opacity: 0,
            duration: EPILOGUE.lineOut,
            ease: "power1.inOut"

        });

        block.remove();

        await epilogueWait(EPILOGUE.betweenBeats);

    }

    await epilogueWait(EPILOGUE.blackBeforeReveal);

}


// =======================================
// The chapter
// =======================================

const Epilogue = (() => {

    let started = false;

    async function run() {

        buildEpilogueMarkup();

        const veil = document.querySelector("#epilogue-veil");
        const chapter = document.querySelector("#epilogue");
        const stage = document.querySelector("#epilogue-stage");
        const script = document.querySelector("#epilogue-script");
        const glow = chapter.querySelector(".epilogue-glow");
        const canvas = document.querySelector("#epilogue-stars");

        const stars = createEpilogueStars(canvas);
        const writer = createEpilogueWriter(stage, script);

        // Both audio elements live inside the chapter, so they spend
        // the whole transition loading and are ready by the time it
        // ends.
        EpilogueAmbient.attach(chapter);

        const voice = attachEpilogueVoice(chapter);

        // ---- 1. into the dark ----

        EpilogueAmbient.to("duck", 3);

        await playEpilogueVeil(veil);

        // ---- 2. the chapter arrives ----
        //
        // The bed starts rising with the stars rather than after
        // them, so it has the reveal and the lead-in to establish
        // itself before it steps back under the voice. Otherwise
        // it would swell and retreat in the same breath.

        chapter.classList.add("is-active");
        stars.start();

        EpilogueAmbient.to("rest", EPILOGUE.revealChapter + 1.5);

        gsap.to(chapter, {

            opacity: 1,
            duration: EPILOGUE.revealChapter,
            ease: "power1.inOut"

        });

        await gsap.to(veil, {

            opacity: 0,
            duration: EPILOGUE.revealChapter,
            ease: "power1.inOut"

        });

        veil.classList.remove("is-active");

        if (!epilogueReduceMotion) {

            // The camera. Two unrelated drifts rather than one, so
            // the movement never traces the same diagonal twice —
            // slow enough to read as breathing, not as motion.
            gsap.to(stage, {
                y: -18,
                duration: 23,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            gsap.to(stage, {
                x: 9,
                duration: 31,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            gsap.to(glow, {
                opacity: .58,
                scale: 1.05,
                duration: 17,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

        }

        await epilogueWait(EPILOGUE.voiceLeadIn);

        // ---- 3. the voice, and the writing ----

        await voice.ready;

        const cues = epilogueCues();
        const lastCueTime = cues.length ? cues[cues.length - 1].time : 0;
        const clock = createEpilogueClock(voice, lastCueTime);

        if (voice.isUsable()) {

            EpilogueAmbient.to("duck", EPILOGUE.duckFade);

            try {

                await voice.el.play();

                clock.useAudio();

            } catch (err) {

                // Playback was refused despite every click that led
                // here. The text starts anyway on the wall clock —
                // and if a tap does let the audio through, it's
                // seeked to wherever the text has already reached so
                // the voice picks up mid-sentence instead of
                // restarting underneath a screen of finished lines.
                const nudge = () => {

                    const at = clock.wall();

                    voice.el.play()
                        .then(() => clock.adoptAudioAt(at))
                        .catch(() => {});

                };

                document.addEventListener("pointerdown", nudge, { once: true });
                document.addEventListener("keydown", nudge, { once: true });

            }

        }

        // If there's no recording at all, the clock is already a wall
        // clock and the chapter rehearses at full length. Nothing
        // else in the sequence changes.

        const writing = runEpilogueScript(cues, clock, writer);

        await writing.ended;

        // ---- 4. the last frame ----

        writing.stop();

        EpilogueAmbient.to("rest", EPILOGUE.returnFade);

        await epilogueWait(EPILOGUE.silenceAfterVoice);

        writer.keepOnlyLast();

        await epilogueWait(EPILOGUE.holdLastLine);

        veil.classList.add("is-active");

        EpilogueAmbient.to("silent", EPILOGUE.fadeToBlack);

        await gsap.to(veil, {

            opacity: 1,
            duration: EPILOGUE.fadeToBlack,
            ease: "power1.inOut"

        });

        chapter.classList.remove("is-active");
        gsap.set(chapter, { opacity: 0 });

        // Nothing is visible any more, and nothing else is coming.
        // Everything the chapter was holding is let go here: the
        // sky, the camera, both audio elements, the pad's
        // oscillators, and every listener any of them installed.
        stars.destroy();
        writer.destroy();
        voice.destroy();
        EpilogueAmbient.destroy();

        gsap.killTweensOf([stage, glow, chapter]);

        await epilogueWait(EPILOGUE.blackBeforeEnd);

        const end = document.querySelector("#epilogue-end");
        const rule = document.querySelector("#epilogue-end-rule");
        const veilLines = document.querySelector("#epilogue-veil-lines");

        if (veilLines) veilLines.hidden = true;

        end.hidden = false;

        gsap.fromTo(end,

            { opacity: 0, y: 12 },

            {
                opacity: 1,
                y: 0,
                duration: EPILOGUE.endIn,
                ease: "power2.out"
            }

        );

        // The last movement in the whole site: a hairline drawing
        // itself open between the name and the words.
        if (rule && !epilogueReduceMotion) {

            gsap.fromTo(rule,
                { width: 0 },
                {
                    width: 54,
                    duration: EPILOGUE.endIn * 1.4,
                    delay: EPILOGUE.endIn * .45,
                    ease: "power2.inOut"
                }
            );

        }

        // And that's all. No button, nothing to press, nothing next.

    }

    // Walks the cues against whichever clock is running, and owns
    // the answer to "is the recording over" for the same reason —
    // one loop, one clock, so the text and the ending can never
    // disagree about where the chapter is.
    function runEpilogueScript(cues, clock, writer) {

        let next = 0;
        let stopped = false;
        let raf = null;
        let resolveEnded = null;

        const ended = new Promise((resolve) => {

            resolveEnded = resolve;

        });

        // The 'ended' event is the truth when it fires; the clock is
        // the safety net for a file that stalls, never loads, or is
        // shorter than its own timestamps.
        function onAudioEnded() {

            finish();

        }

        if (clock && cues) {

            const el = document.querySelector("#epilogue-voice-audio");

            if (el) el.addEventListener("ended", onAudioEnded, { once: true });

        }

        function finish() {

            if (stopped) return;

            stopped = true;

            if (raf !== null) cancelAnimationFrame(raf);

            raf = null;

            resolveEnded();

        }

        function frame() {

            if (stopped) return;

            const t = clock.time();

            while (next < cues.length && t >= cues[next].time) {

                // If the tab was in the background, several cues can
                // come due at once — those arrive already written
                // rather than animating on top of each other.
                const overdue = t - cues[next].time > 2;

                writer.write(cues[next].text, {
                    instant: overdue,
                    gap: cues[next].gap
                });

                next++;

            }

            if (t >= clock.limit()) {

                finish();
                return;

            }

            // Last-resort safety net. If the recording ever stalled
            // mid-playback its clock would stop advancing and the
            // chapter would wait on it forever — this is the one
            // moment in the whole site that must never be able to
            // hang, so real time gets the final say.
            if (clock.wall() >= clock.limit() + EPILOGUE.stallGrace) {

                finish();
                return;

            }

            raf = requestAnimationFrame(frame);

        }

        raf = requestAnimationFrame(frame);

        return {
            ended,
            stop: finish
        };

    }

    // Called by the Questionnaire once the answers are away.
    function begin() {

        if (started) return;

        started = true;

        setTimeout(() => {

            run().catch((err) => console.error("Epilogue failed:", err));

        }, EPILOGUE.holdAfterSent);

    }

    return { begin };

})();

window.Epilogue = Epilogue;
