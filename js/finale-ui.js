/**
 * ui.js
 * ------------------------------------------------------
 * Builds the DOM for one question at a time, wires up
 * hover/click sounds, and drives the ending sequence.
 * Only one question ever lives in #stage.
 *
 * QUESTION TYPE FRAMEWORK
 * ------------------------------------------------------
 * `QuestionTypes` below is the single place that knows how
 * each question `type` looks and behaves. Every entry is a
 * small, self-contained contract:
 *
 *   {
 *     autoAdvance: boolean,
 *     render(q, onAnswer, existingAnswer) -> HTMLElement,
 *     feedback(value) -> { sound(), reaction(container) }  // optional,
 *                                                            // only used
 *                                                            // when
 *                                                            // autoAdvance
 *                                                            // is true
 *   }
 *
 * app.js never checks `q.type === "yesno"` or similar — it
 * only reads `QuestionTypes[q.type].autoAdvance` and, when
 * present, `.feedback(value)`. That means:
 *
 *   - Adding more questions of an existing type is a pure
 *     questions.js edit. Nothing here changes.
 *   - Adding a brand-new type (rating, date, number, slider...)
 *     means adding ONE new entry to `QuestionTypes` with its
 *     own render()/feedback(). The transition system, the
 *     advance/progress/ending flow in app.js, and every other
 *     question type are untouched.
 *
 * Unknown/unregistered types fall back to "yesno" so a typo
 * in questions.js never leaves the visitor stuck on a blank
 * stage — it just logs a console error.
 * ------------------------------------------------------
 */

const UI = (() => {
  const stage = document.getElementById("stage");
  const btnPrev = document.getElementById("btn-prev");
  const endingEl = document.getElementById("ending");
  const endingCollecting = document.getElementById("ending-collecting");
  const endingStatusText = document.getElementById("ending-status-text");
  const endingGather = document.getElementById("ending-gather");
  const endingReveal = document.getElementById("ending-reveal");

  // ---------------- Shared building block: pill-button choices ----------------
  // Used by both "yesno" and "choice" — any future type that is just
  // "pick one of N labeled options" can reuse this instead of duplicating
  // button-building logic.
  function renderChoiceButtons(options, onAnswer, existingAnswer) {
    const wrap = document.createElement("div");
    wrap.className = "answers";

    options.forEach(({ label, value }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "answer-btn";
      btn.textContent = label;
      btn.dataset.value = String(value);

      if (existingAnswer !== undefined && String(existingAnswer) === String(value)) {
        btn.classList.add("is-selected");
      }

      btn.addEventListener("mouseenter", () => Sounds.hover());
      btn.addEventListener("click", () => onAnswer(value, btn));

      wrap.appendChild(btn);
    });

    return wrap;
  }

  // ---------------- Shared building block: free-text answers ----------------
  // Covers both "text" (single line) and "textarea" (multi line). The
  // "التالي" button only becomes usable once there is a non-empty value,
  // and clicking it is the only thing that submits the answer — no
  // auto-advance while typing.
  function renderTextControl(q, onAnswer, existingAnswer, multiline) {
    const wrap = document.createElement("div");
    wrap.className = "answers answers--text";

    const field = document.createElement(multiline ? "textarea" : "input");
    if (!multiline) field.type = "text";
    field.className = "text-input" + (multiline ? " text-input--area" : "");
    field.placeholder = "اكتب إجابتك هنا...";
    field.setAttribute("aria-label", q.question);
    if (existingAnswer !== undefined) field.value = existingAnswer;

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "answer-btn next-btn";
    nextBtn.textContent = "التالي ›";

    const hasValue = () => field.value.trim().length > 0;
    const syncNextVisibility = () => {
      nextBtn.classList.toggle("next-btn--hidden", !hasValue());
    };
    syncNextVisibility();

    field.addEventListener("input", syncNextVisibility);

    const submit = () => {
      if (!hasValue()) return;
      onAnswer(field.value.trim(), nextBtn);
    };

    nextBtn.addEventListener("mouseenter", () => Sounds.hover());
    nextBtn.addEventListener("click", submit);

    if (!multiline) {
      // Single-line fields may also submit on Enter; textarea keeps
      // Enter as a normal newline since answers can be longer thoughts.
      field.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          submit();
        }
      });
    }

    wrap.append(field, nextBtn);
    return wrap;
  }

  // ---------------- Question type registry ----------------
  const QuestionTypes = {
    yesno: {
      autoAdvance: true,
      render(q, onAnswer, existingAnswer) {
        return renderChoiceButtons(
          [{ label: "نعم", value: true }, { label: "لا", value: false }],
          onAnswer,
          existingAnswer
        );
      },
      feedback(value) {
        return value
          ? { sound: () => Sounds.sparkleYes(), reaction: Animations.reactionYes }
          : { sound: () => Sounds.softNo(), reaction: Animations.reactionNo };
      }
    },

    choice: {
      autoAdvance: true,
      render(q, onAnswer, existingAnswer) {
        const options = (q.options || []).map(opt => ({ label: opt, value: opt }));
        return renderChoiceButtons(options, onAnswer, existingAnswer);
      },
      // A choice answer has no yes/no polarity — it always gets the same
      // warm "a choice was made" feedback, same selection animation and
      // auto-advance timing as yesno.
      feedback() {
        return { sound: () => Sounds.sparkleYes(), reaction: Animations.reactionYes };
      }
    },

    text: {
      autoAdvance: false,
      render(q, onAnswer, existingAnswer) {
        return renderTextControl(q, onAnswer, existingAnswer, false);
      }
    },

    textarea: {
      autoAdvance: false,
      render(q, onAnswer, existingAnswer) {
        return renderTextControl(q, onAnswer, existingAnswer, true);
      }
    }
  };

  function typeDef(q) {
    const def = QuestionTypes[q.type];
    if (!def) {
      console.error(`Unknown question type "${q.type}" for ${q.id} — falling back to yesno.`);
      return QuestionTypes.yesno;
    }
    return def;
  }

  /**
   * Renders question `q` (index `index` of `total`) into the stage using
   * a fresh transition each time, and calls onAnswer(value, controlEl)
   * once the visitor commits an answer (click for every type — instant
   * for yesno/choice buttons, via the "التالي" button for text/textarea).
   */
  function showQuestion(q, index, total, existingAnswer, onAnswer) {
    Animations.transitionQuestion(stage, () => {
      const card = document.createElement("div");
      card.className = "question";

      const eyebrow = document.createElement("p");
      eyebrow.className = "question__eyebrow";
      eyebrow.textContent = `الذكرى ${index + 1}`;

      const text = document.createElement("h2");
      text.className = "question__text";
      text.textContent = q.question;

      const answers = typeDef(q).render(q, onAnswer, existingAnswer);

      card.append(eyebrow, text, answers);
      stage.appendChild(card);
      return card;
    });

    btnPrev.disabled = index === 0;
  }

  // Marks exactly one control as selected, by element identity — works
  // the same for yesno and choice (any button-based type) without caring
  // what label or value it holds.
  function markSelected(container, selectedBtn) {
    [...container.querySelectorAll(".answer-btn")].forEach(btn => {
      btn.classList.toggle("is-selected", btn === selectedBtn);
    });
  }

  // Shows the ending shell and starts the "gathering" visual. The
  // answers are already being sent in the background by app.js —
  // this just plays the same cinematic beat it always has, and
  // stays here until app.js calls revealEnding() once that send
  // actually succeeds.
  function showEnding() {
    stage.parentElement.querySelector(".stage-nav").hidden = true;
    endingEl.hidden = false;
    gsap.fromTo(endingEl, { opacity: 0 }, { opacity: 1, duration: 0.8 });

    Animations.gatherEffect(endingGather);
  }

  // Swaps the "تُجمع الذكريات..." line for a friendly retry/error
  // message, without touching anything else on screen.
  function showSendIssue(message) {
    endingStatusText.textContent = message;
  }

  // The same collecting → reveal fade the ending always had —
  // now triggered by a successful send instead of a fixed timer.
  function revealEnding() {
    gsap.to(endingCollecting, {
      opacity: 0, duration: 0.6, onComplete: () => {
        endingCollecting.hidden = true;
        endingReveal.hidden = false;
        gsap.fromTo(endingReveal, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
      }
    });
  }

  return { showQuestion, markSelected, showEnding, showSendIssue, revealEnding, btnPrev, QuestionTypes };
})();
