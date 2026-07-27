/**
 * app.js
 * ------------------------------------------------------
 * Orchestrates the journey: current index, stored answers,
 * auto-advance timing, and the final submit payload.
 *
 * This file knows NOTHING about individual question types
 * (yesno/choice/text/textarea/...). It only reads two things
 * off `UI.QuestionTypes[q.type]`:
 *
 *   - autoAdvance: whether picking an answer should move on
 *     by itself after AUTO_ADVANCE_MS, or wait for an explicit
 *     submit (the "التالي" button for text/textarea).
 *   - feedback(value): optional {sound, reaction} pair played
 *     right when an autoAdvance answer is picked.
 *
 * That's what makes adding a new question type a change that
 * lives entirely in ui.js's registry — this file doesn't need
 * a new branch for it.
 * ------------------------------------------------------
 */

(function App() {
  const state = {
    index: 0,
    answers: {} // { q1: true, q2: "الخيانة", q3: "النص اللي كتبه", ... }
  };

  const AUTO_ADVANCE_MS = 850;

  // EmailJS — same account/template already used by Project Hope's
  // Message Box.
  const EMAILJS_SERVICE_ID = "service_i93uey8";
  const EMAILJS_TEMPLATE_ID = "template_3lps0jg";
  const EMAILJS_PUBLIC_KEY = "i60XgCvTdjdBJUqGB";

  // The ending's "تُجمع الذكريات..." beat originally ran for exactly
  // this long before revealing — kept as a floor so the reveal never
  // arrives sooner than that animation used to, even on a fast send.
  const MIN_COLLECTING_MS = 2200;
  const RETRY_DELAY_MS = 4000;
  const MAX_SEND_ATTEMPTS = 5;

  let sendAttempts = 0;

  function currentQuestion() {
    return questions[state.index];
  }

  function render() {
    UI.showQuestion(
      currentQuestion(),
      state.index,
      questions.length,
      state.answers[currentQuestion().id],
      handleAnswer
    );
    Progress.update(state.index);
  }

  // Called once per question, whenever the visitor commits an answer —
  // for yesno/choice that's the moment a button is clicked; for
  // text/textarea that's the moment "التالي" is clicked.
  function handleAnswer(value, controlEl) {
    const q = currentQuestion();
    state.answers[q.id] = value;

    const def = UI.QuestionTypes[q.type] || UI.QuestionTypes.yesno;

    if (def.autoAdvance) {
      UI.markSelected(controlEl.parentElement, controlEl);
      Progress.pulse();

      const fb = def.feedback && def.feedback(value);
      if (fb) {
        fb.sound();
        fb.reaction(controlEl.closest(".question"));
      }

      setTimeout(advance, AUTO_ADVANCE_MS);
    } else {
      // Free-text answers: the "التالي" click IS the deliberate step
      // forward, so we move on right away instead of waiting out a
      // timer meant for glanceable yes/no/choice taps.
      Sounds.click();
      Progress.pulse();
      advance();
    }
  }

  function advance() {
    if (state.index < questions.length - 1) {
      state.index += 1;
      render();
    } else {
      finish();
    }
  }

  function goPrev() {
    if (state.index === 0) return;
    Sounds.click();
    state.index -= 1;
    render();
  }

  function finish() {
    // No Submit button, no waiting on the visitor — the ending
    // sequence plays immediately while the answers send themselves
    // in the background, exactly like the Message Box does.
    UI.showEnding();
    sendAnswers();
  }

  // Turns one stored answer into a short, readable line — shape
  // depends only on the question's type, same spirit as the
  // QuestionTypes registry in ui.js but for plain-text output.
  function formatAnswer(q, value) {
    if (value === undefined || value === null || value === "") return "—";

    switch (q.type) {
      case "yesno":
        return value === true ? "نعم" : value === false ? "لا" : "—";
      case "choice":
      case "text":
      case "textarea":
        return String(value);
      default:
        return String(value);
    }
  }

  // Builds the clean, readable body the email template's
  // {{message}} field will contain: every question, in order,
  // with the answer actually given.
  function buildAnswersMessage() {
    const lines = ["Project Hope Questionnaire", ""];

    questions.forEach((q, i) => {
      const value = state.answers[q.id];

      lines.push(`Question ${i + 1}:`);
      lines.push(q.question);
      lines.push(`Answer: ${formatAnswer(q, value)}`);
      lines.push("");
    });

    return lines.join("\n").trim();
  }

  // Once the answers are away (or we've genuinely run out of tries),
  // the story's real final chapter takes over. It's deliberately not
  // gated on a perfect send: a mail hiccup should never be the reason
  // she doesn't get to hear the last thing.
  let epilogueOpened = false;

  function openEpilogue() {
    if (epilogueOpened) return;
    epilogueOpened = true;

    UI.revealEnding();

    if (window.Epilogue && typeof Epilogue.begin === "function") {
      Epilogue.begin();
    }
  }

  function sendAnswers() {
    if (sendAttempts >= MAX_SEND_ATTEMPTS) {
      UI.showSendIssue("الشبكة مش متعاونة... بس الحكاية لسه ليها آخر حاجة 🤍");
      setTimeout(openEpilogue, 2600);
      return;
    }

    sendAttempts += 1;

    if (!window.emailjs) {
      UI.showSendIssue("مش قادر أبعت الرسالة دلوقتي، بنحاول تاني...");
      setTimeout(sendAnswers, RETRY_DELAY_MS);
      return;
    }

    const startedAt = Date.now();

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {

      message: buildAnswersMessage(),
      time: new Date().toLocaleString(),
      user_agent: navigator.userAgent

    }).then(() => {

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_COLLECTING_MS - elapsed);

      setTimeout(openEpilogue, remaining);

    }).catch(() => {

      UI.showSendIssue("حصلت مشكلة والرسالة ما اتبعتش... بنحاول تاني 🤍");
      setTimeout(sendAnswers, RETRY_DELAY_MS);

    });
  }

  function initMute() {
    const btn = document.getElementById("mute-toggle");
    const setState = muted => {
      btn.setAttribute("aria-pressed", String(muted));
      btn.setAttribute("aria-label", muted ? "تشغيل الموسيقى الهادئة" : "كتم الموسيقى");
    };
    setState(Sounds.isMuted());
    btn.addEventListener("click", () => {
      const next = !Sounds.isMuted();
      Sounds.setMuted(next);
      setState(next);
    });
  }

  // This chapter is dormant on page load — Project Hope's ending
  // calls window.FinaleApp.init() the moment the visitor is actually
  // let in, so nothing here starts (no sound, no render) before that.
  let hasInitialized = false;

  function init() {

    if (hasInitialized) return;
    hasInitialized = true;

    // Ambient/decorative setup (particles, cursor, mute icon) is not
    // essential to the core flow — if any of it fails, log it but still
    // get the questions on screen rather than leaving the page stuck.
    try { Progress.init(questions.length); } catch (err) { console.error("Progress.init failed:", err); }
    try { Animations.start(); } catch (err) { console.error("Animations.start failed:", err); }
    try { Animations.initCursor(); } catch (err) { console.error("Animations.initCursor failed:", err); }
    try { initMute(); } catch (err) { console.error("initMute failed:", err); }
    try { if (window.emailjs) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); } catch (err) { console.error("emailjs.init failed:", err); }

    UI.btnPrev.addEventListener("click", goPrev);

    render();

    // Ambient pad only starts after a user gesture (autoplay policies) —
    // by the time this chapter opens the visitor has already clicked
    // through the whole story, so this counts as that gesture.
    try { if (!Sounds.isMuted()) Sounds.startAmbientPad(); } catch (err) { /* ignore */ }

  }

  window.FinaleApp = { init };

})();
