// =======================================
// Project Hope
// Ambient Media (optional hero video + background music)
//
// Both features stay completely invisible until a real file
// is dropped into assets/videos or assets/audio — nothing
// fake or placeholder is played.
//
// The hero video is part of the opening scene itself, so it
// loads right away. The sound toggle is deliberately held back
// and only initialized once the visitor starts the story (see
// opening.js) — nothing but the opening scene should appear
// before that button is pressed.
// =======================================

function initHeroVideo() {

    const video = document.querySelector("#hero-video");

    if (!video) return;

    // Only reveal the video once it has actually confirmed it can play
    video.addEventListener("canplaythrough", () => {

        video.classList.add("is-ready");

        video.play().catch(() => {});

    }, { once: true });

    video.addEventListener("error", () => {

        video.remove();

    }, { once: true });

    video.load();

}

// Module-level (not local to initSoundToggle) so other chapters —
// like the first-chat fade-out below — can check/update it too.
let ambientIsPlaying = false;

function initSoundToggle() {

    const toggle = document.querySelector("#sound-toggle");
    const audio = document.querySelector("#ambient-audio");

    if (!toggle || !audio) return;

    // Only reveal the toggle once the audio file has confirmed it exists
    audio.addEventListener("canplaythrough", () => {

        toggle.classList.add("is-ready");

    }, { once: true });

    audio.addEventListener("error", () => {

        toggle.remove();

    }, { once: true });

    // If the auth gate already started the ambient bed, reflect
    // that the moment the toggle becomes interactive instead of
    // showing a misleading "off" state.
    if (ambientIsPlaying) {

        toggle.textContent = "🔊";
        toggle.classList.add("is-playing");

    }

    toggle.addEventListener("click", () => {

        ambientIsPlaying = !ambientIsPlaying;

        if (ambientIsPlaying) {

            // Start silent and let the audio manager tween it up to
            // whatever's correct right now — full volume, or already
            // ducked/silenced if a section soundtrack or a voice
            // note/video happens to be active at this exact moment.
            audio.volume = 0;
            audio.play().catch(() => {});
            refreshAmbientVolume();
            toggle.textContent = "🔊";
            toggle.classList.add("is-playing");

        } else {

            gsap.killTweensOf(audio);
            audio.pause();
            toggle.textContent = "🔈";
            toggle.classList.remove("is-playing");

        }

    });

    // Only (re)issue load() if the auth gate hasn't already started
    // playback — calling load() on a currently-playing element would
    // reset it back to the start, which is exactly the kind of seam
    // this whole gate is meant to avoid.
    if (audio.paused) {

        audio.load();

    } else {

        toggle.classList.add("is-ready");

    }

}
