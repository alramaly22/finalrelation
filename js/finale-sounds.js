/**
 * sounds.js
 * ------------------------------------------------------
 * Every sound here is synthesized with the Web Audio API so
 * the experience has no hard dependency on external audio
 * files. Drop a file at assets/audio/ambient.mp3 and it will
 * be used for the background bed automatically; otherwise a
 * very soft generated pad plays instead.
 *
 * Everything is intentionally quiet — this is a whisper, not
 * a soundtrack.
 * ------------------------------------------------------
 */

const Sounds = (() => {
  let ctx = null;
  let muted = localStorage.getItem("journey_muted") === "true";
  let ambientEl = null;
  let ambientGain = null;
  let padStarted = false;
  let padOscillators = [];

  function ensureContext() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function tone({ freq = 440, duration = 0.2, type = "sine", gain = 0.05, glideTo = null }) {
    if (muted) return;
    const c = ensureContext();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, c.currentTime + duration);
    g.gain.setValueAtTime(0.0001, c.currentTime);
    g.gain.exponentialRampToValueAtTime(gain, c.currentTime + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + duration);
    osc.connect(g).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + duration + 0.05);
  }

  function click() {
    tone({ freq: 720, duration: 0.08, type: "sine", gain: 0.04 });
  }

  function hover() {
    tone({ freq: 900, duration: 0.05, type: "sine", gain: 0.015 });
  }

  function heartbeat() {
    tone({ freq: 90, duration: 0.18, type: "sine", gain: 0.06 });
    setTimeout(() => tone({ freq: 70, duration: 0.22, type: "sine", gain: 0.05 }), 140);
  }

  function sparkleYes() {
    tone({ freq: 1200, duration: 0.35, type: "triangle", gain: 0.035, glideTo: 1800 });
  }

  function softNo() {
    tone({ freq: 300, duration: 0.5, type: "sine", gain: 0.03, glideTo: 180 });
  }

  function startAmbientPad() {
    if (muted || padStarted) return;
    padStarted = true;
    const c = ensureContext();
    ambientGain = c.createGain();
    ambientGain.gain.value = 0.0001;
    ambientGain.connect(c.destination);
    [130.81, 164.81, 196.0].forEach((f, i) => {
      const osc = c.createOscillator();
      osc.type = "sine";
      osc.frequency.value = f;
      const g = c.createGain();
      g.gain.value = 0.25 / (i + 1);
      osc.connect(g).connect(ambientGain);
      osc.start();
      padOscillators.push(osc);
    });
    ambientGain.gain.exponentialRampToValueAtTime(0.025, c.currentTime + 2.5);
  }

  function stopAmbientPad() {
    if (!ambientGain) return;
    const c = ensureContext();
    ambientGain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.2);
  }

  // Smoothly moves the pad to an arbitrary level. The Epilogue uses
  // this to duck the music under the voice recording and bring it
  // back afterwards, instead of only being able to stop it outright.
  function setPadLevel(value, seconds = 2) {
    if (!ambientGain || !ctx) return;
    const c = ensureContext();
    const target = Math.max(0.0001, value);
    const now = c.currentTime;
    ambientGain.gain.cancelScheduledValues(now);
    ambientGain.gain.setValueAtTime(Math.max(0.0001, ambientGain.gain.value), now);
    ambientGain.gain.exponentialRampToValueAtTime(target, now + Math.max(0.05, seconds));
  }

  function padIsRunning() {
    return padStarted && !!ambientGain;
  }

  // True silence, not a gain of almost-zero. The pad's oscillators
  // have been running since the Questionnaire opened; the Epilogue
  // calls this on its final fade so the site ends with nothing
  // playing and no audio graph left alive.
  function stopPad(seconds = 1.4) {
    if (!ctx) return;

    const c = ctx;
    const fade = Math.max(0.05, seconds);

    if (ambientGain) {
      try {
        ambientGain.gain.cancelScheduledValues(c.currentTime);
        ambientGain.gain.setValueAtTime(
          Math.max(0.0001, ambientGain.gain.value), c.currentTime
        );
        ambientGain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + fade);
      } catch (err) { /* graph already torn down */ }
    }

    padOscillators.forEach(osc => {
      try { osc.stop(c.currentTime + fade + 0.1); } catch (err) {}
    });

    padOscillators = [];
    padStarted = false;
    ambientGain = null;

    setTimeout(() => {
      if (ctx && ctx.state !== "closed") {
        ctx.close().catch(() => {});
      }
      // Left null rather than closed-and-kept, so nothing can ever
      // try to resume a context that's already gone.
      ctx = null;
    }, (fade + 0.4) * 1000);
  }

  function tryLoadAmbientFile() {
    // Optional: if assets/audio/ambient.mp3 exists, prefer it over the
    // generated pad for a richer bed. Fails silently if absent.
    ambientEl = new Audio("assets/audio/ambients.mp3");
    ambientEl.loop = true;
    ambientEl.volume = 0;
    ambientEl.addEventListener("error", () => { ambientEl = null; }, { once: true });
  }

  function setMuted(next) {
    muted = next;
    localStorage.setItem("journey_muted", String(muted));
    if (muted) {
      if (ambientEl) {
        const fade = setInterval(() => {
          ambientEl.volume = Math.max(0, ambientEl.volume - 0.05);
          if (ambientEl.volume <= 0) { ambientEl.pause(); clearInterval(fade); }
        }, 60);
      }
      stopAmbientPad();
    } else {
      if (ambientEl) {
        ambientEl.play().catch(() => {});
        const fade = setInterval(() => {
          ambientEl.volume = Math.min(0.18, ambientEl.volume + 0.02);
          if (ambientEl.volume >= 0.18) clearInterval(fade);
        }, 60);
      } else {
        startAmbientPad();
      }
    }
  }

  function isMuted() { return muted; }

  tryLoadAmbientFile();

  return {
    click, hover, heartbeat, sparkleYes, softNo, setMuted, isMuted,
    startAmbientPad, setPadLevel, padIsRunning, stopPad
  };
})();
