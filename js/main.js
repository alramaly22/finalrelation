// =======================================
// Project Hope
// Main
// =======================================

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {

    initAuthGate(() => {

        initHeroVideo();

        initPreloader(() => {

            initOpening();

        });

    });

});