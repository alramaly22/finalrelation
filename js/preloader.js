// =======================================
// Project Hope
// Preloader
// =======================================

function initPreloader(onDone) {

    const pre = document.querySelector(".preloader");

    if (!pre) {
        onDone();
        return;
    }

    pre.classList.add("is-loading");

    let hasFinished = false;
    let loadTimer = null;
    let fallbackTimer = null;

    const finish = () => {

        if (hasFinished) return;
        hasFinished = true;

        clearTimeout(loadTimer);
        clearTimeout(fallbackTimer);

        gsap.to(pre, {

            opacity: 0,
            duration: .9,
            ease: "power2.out",

            onComplete: () => {

                pre.style.display = "none";
                onDone();

            }

        });

    };

    // A short, deliberate hold — long enough to register as a
    // moment, never long enough to feel like a real wait.
    window.addEventListener("load", () => {

        loadTimer = setTimeout(finish, 1200);

    }, { once: true });

    // Fallback in case the load event already fired / is slow —
    // finish() is idempotent, so this can never double-fire onDone.
    fallbackTimer = setTimeout(finish, 3200);

}
