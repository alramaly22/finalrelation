// =======================================
// Project Hope
// Audio Manager
//
// Keeps every audio layer on the site from fighting for
// attention. Three kinds of sound exist on the site:
//
//   1. The ambient bed (#ambient-audio) — the one background
//      loop the visitor can toggle on/off. It's the "default"
//      sound and always yields to everything below.
//
//   2. Section soundtracks (Hall of Regret's piano, the Final
//      Room's wind, the chat theme, and any future one built
//      the same way) — tied to a specific part of the story.
//      Only one of these ever plays at a time; starting one
//      fades out whatever section soundtrack was previously
//      active, and silences the ambient bed while it's active.
//
//   3. Temporary ducking (voice notes, the video player) —
//      briefly lowers the ambient bed without touching whatever
//      section soundtrack is playing, then restores it.
//
// Every other file plugs into this instead of touching audio
// volumes directly, so the mixing rules only live in one place.
// =======================================

const AMBIENT_BASE_VOLUME = .4;
const AMBIENT_DUCK_VOLUME = .1;
const SECTION_FADE = 1.8;
const DUCK_FADE = 1;

// How many things currently want the ambient bed turned down
// (voice notes, the video player — anything short-lived).
let duckRequests = 0;

// The section soundtrack currently "owning" the scene, if any.
let activeSectionAudio = null;

function getAmbientAudio() {

    return document.querySelector("#ambient-audio");

}

// Recomputes and tweens the ambient bed to whatever volume its
// current situation calls for. Safe to call any time — it's a
// no-op whenever the ambient track isn't actually playing.
function refreshAmbientVolume() {

    const audio = getAmbientAudio();

    if (!audio || !ambientIsPlaying) return;

    let target = AMBIENT_BASE_VOLUME;

    if (activeSectionAudio) {

        // A chapter with its own soundtrack owns the scene —
        // the ambient bed stays fully out of the way.
        target = 0;

    } else if (duckRequests > 0) {

        target = AMBIENT_DUCK_VOLUME;

    }

    gsap.to(audio, {

        volume: target,
        duration: DUCK_FADE,
        ease: "power1.inOut",
        overwrite: "auto"

    });

}


// =======================================
// Temporary ducking — voice notes, video player
// Stacks safely: two overlapping duck requests still resolve
// to a single "restore" once both have called unduck.
// =======================================

function duckAmbient() {

    duckRequests++;
    refreshAmbientVolume();

}

function unduckAmbient() {

    duckRequests = Math.max(0, duckRequests - 1);
    refreshAmbientVolume();

}


// =======================================
// Section soundtracks — mutually exclusive
// =======================================

function fadeAudioIn(audio, targetVolume, duration = SECTION_FADE) {

    if (!audio) return;

    audio.play().catch(() => {});

    gsap.to(audio, {

        volume: targetVolume,
        duration,
        ease: "power1.inOut",
        overwrite: "auto"

    });

}

function fadeAudioOut(audio, duration = SECTION_FADE) {

    if (!audio || audio.paused) return;

    gsap.to(audio, {

        volume: 0,
        duration,
        ease: "power1.inOut",
        overwrite: "auto",

        onComplete: () => {

            audio.pause();
            audio.currentTime = 0;

        }

    });

}

// Starts a section's soundtrack. If a different section
// soundtrack is currently active, it's faded out first — the
// site never has two of these layered on top of each other.
function playSectionAudio(audio, targetVolume, duration = SECTION_FADE) {

    if (!audio) return;
    if (activeSectionAudio === audio) return;

    const previous = activeSectionAudio;

    activeSectionAudio = audio;

    if (previous && previous !== audio) {

        fadeAudioOut(previous, duration);

    }

    refreshAmbientVolume();

    audio.volume = 0;
    fadeAudioIn(audio, targetVolume, duration);

}

// Stops a section's soundtrack and lets the ambient bed come
// back up (only if it was the one currently active — calling
// this on an already-inactive track is a harmless no-op beyond
// making sure it's actually silent).
function stopSectionAudio(audio, duration = SECTION_FADE) {

    if (!audio) return;

    if (activeSectionAudio === audio) {

        activeSectionAudio = null;
        refreshAmbientVolume();

    }

    fadeAudioOut(audio, duration);

}
