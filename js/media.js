// =======================================
// Project Hope
// Videos & Voice Notes
// =======================================

// EDIT ME: point these at real files in assets/videos and assets/voice.
// Anything missing just falls back to a quiet placeholder card.
const videoData = [

    { src: "assets/videos/mohemawi.mp4", poster: "assets/images/gallery/01.jpg", title: "لحظات من أجمل أيامنا" },
    { src: "assets/videos/hero.mp4", poster: "assets/images/gallery/02.jpg",  title: "الرحلة اللي كانت نهايتها أجمل لحظة" }

];

const voiceData = [

    { src: "assets/audio/firstloverecord.mp3", label: "رسالة صوتية" },
    { src: "assets/audio/m.mp3", label: "رسالة صوتية" }

];

function initMediaChapter() {

    if (document.querySelector(".media-chapter")) return;

    const timeline = document.querySelector(".timeline");
    const app = document.querySelector("#app");
    const target = timeline || app;

    if (!target) return;

    target.insertAdjacentHTML("afterend", `

<section class="media-chapter" id="videos-voice">

    <div class="media-header">

        <span>Chapter</span>
        <h2>لحظات لسه عايشة</h2>

<p>
فيه أصوات... كل مرة بسمعها بحس إن الزمن وقف.
</p>
    </div>

    <div class="video-grid" id="video-grid"></div>

    <div class="voice-list" id="voice-list"></div>

</section>

<div class="video-player" id="video-player">

    <button class="video-player-close" id="video-player-close" aria-label="إغلاق">✕</button>
    <video id="video-player-el" controls playsinline></video>

</div>

`);

    buildVideoGrid();
    buildVoiceList();
    animateMediaChapter();

}

function buildVideoGrid() {

    const grid = document.querySelector("#video-grid");

    videoData.forEach((v, i) => {

        grid.insertAdjacentHTML("beforeend", `

<div class="video-card" data-index="${i}">

    <img src="${v.poster}" alt="${v.title}" loading="lazy"
         onerror="this.closest('.video-card').classList.add('is-placeholder')">

    <div class="video-card-overlay">

        <div class="video-play">▶</div>
        <div class="video-card-title">${v.title}</div>

    </div>

</div>

`);

    });

    grid.querySelectorAll(".video-card").forEach((card) => {

        card.addEventListener("click", () => openVideo(videoData[card.dataset.index].src));

    });

    const player = document.querySelector("#video-player");
    const playerEl = document.querySelector("#video-player-el");
    const close = document.querySelector("#video-player-close");

    const closeVideo = () => {

        playerEl.pause();
        player.classList.remove("is-open");

        unduckAmbient();

    };

    close.addEventListener("click", closeVideo);
    player.addEventListener("click", (e) => {

        if (e.target === player) closeVideo();

    });

}

function openVideo(src) {

    const player = document.querySelector("#video-player");
    const playerEl = document.querySelector("#video-player-el");

    playerEl.src = src;
    player.classList.add("is-open");

    playerEl.play().catch(() => {});

    duckAmbient();

}

function buildVoiceList() {

    const list = document.querySelector("#voice-list");

    voiceData.forEach((note, i) => {

        const bars = Array.from({ length: 28 }, () =>
            `<span style="height:${8 + Math.random() * 24}px"></span>`
        ).join("");

        list.insertAdjacentHTML("beforeend", `

<div class="voice-note" data-index="${i}">

    <button class="voice-play" aria-label="تشغيل">▶</button>

    <div class="voice-wave">${bars}</div>

    <span class="voice-time">0:00</span>

    <audio src="${note.src}" preload="none"></audio>

</div>

`);

    });

    list.querySelectorAll(".voice-note").forEach((note) => {

        const btn = note.querySelector(".voice-play");
        const audio = note.querySelector("audio");
        const time = note.querySelector(".voice-time");

        const formatTime = (s) => {

            if (!isFinite(s)) return "0:00";

            const m = Math.floor(s / 60);
            const sec = Math.floor(s % 60).toString().padStart(2, "0");

            return `${m}:${sec}`;

        };

        btn.addEventListener("click", () => {

            // Never more than one voice note playing at once — stop
            // whatever else is active before this one starts.
            document.querySelectorAll(".voice-note.is-playing").forEach((other) => {

                if (other !== note) {

                    other.querySelector("audio").pause();
                    other.classList.remove("is-playing");
                    other.querySelector(".voice-play").textContent = "▶";
                    unduckAmbient();

                }

            });

            if (audio.paused) {

                audio.play().catch(() => {});
                note.classList.add("is-playing");
                btn.textContent = "❚❚";
                duckAmbient();

            } else {

                audio.pause();
                note.classList.remove("is-playing");
                btn.textContent = "▶";
                unduckAmbient();

            }

        });

        audio.addEventListener("timeupdate", () => {

            time.textContent = formatTime(audio.currentTime);

        });

        audio.addEventListener("ended", () => {

            note.classList.remove("is-playing");
            btn.textContent = "▶";
            time.textContent = formatTime(audio.duration);
            unduckAmbient();

        });

        audio.addEventListener("error", () => {

            note.classList.add("is-unavailable");
            btn.disabled = true;

            if (note.classList.contains("is-playing")) {

                note.classList.remove("is-playing");
                unduckAmbient();

            }

        });

    });

}

function animateMediaChapter() {

    gsap.from(".media-header", {

        scrollTrigger: { trigger: ".media-chapter", start: "top 75%" },
        opacity: 0,
        y: 60,
        duration: 1.1

    });

    gsap.utils.toArray(".video-card, .voice-note").forEach((el, i) => {

        gsap.from(el, {

            scrollTrigger: { trigger: el, start: "top 88%" },
            opacity: 0,
            y: 40,
            duration: .9,
            delay: (i % 4) * .1,
            ease: "power3.out"

        });

    });

}
