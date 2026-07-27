// =======================================
// Project Hope
// Chapter 02
// Gallery
// =======================================

const galleryData = [

    {
        image: "assets/images/gallery/firstimage.jpg",
        title: "أول صورة بعتيهالي",
        text:"مكنتش أعرف إن الصورة دي هتبقى أول ذكرى من ذكريات كتير."
    },

    {
        image: "assets/images/gallery/first-date.jpg",
        title: "أول مرة شوفتك فيها ❤️",
        text:"أول مرة الكلام بقى وش لوش...وأول مرة حسيت إنك في الحقيقه أحسن من أي شات."
    },
    {
    image: "assets/images/gallery/firstlove.jpg",
    title: "أول مرة أقولك بحبك",
    text: "فاكر اليوم ده كويس... يمكن كانت أول مرة أقولها، لكن الحقيقة إني كنت حاسسها من زمان."
    },
    {
        image: "assets/images/gallery/firstgame.jpg",
        title: "أول لعبة",
        text: "مكناش بنلعب علشان نكسب... كنا بنلعب علشان نقعد مع بعض أطول وقت ممكن."
    },

   

];

function initGallery() {

    if (document.querySelector(".gallery")) return;

    const app = document.querySelector("#app");

    app.insertAdjacentHTML("beforeend", `

<section class="gallery">

    <div class="gallery-header">

        <span>Chapter 02</span>

        <h2>اللحظات اللي كانت تستحق إنها تتحفظ.
</h2>

        <p>
مش أجمل صور...
لكن أجمل أيام.
كل واحدة منهم لسه فاكرها كأنها إمبارح.
</p>

    </div>

    <div class="gallery-grid"></div>

</section>

`);

    const grid = document.querySelector(".gallery-grid");

    galleryData.forEach((photo, index) => {

        grid.innerHTML += `

<div class="photo-card">

    <div class="photo-media">

        <img src="${photo.image}" alt="${photo.title}" loading="lazy">

        <div class="photo-placeholder">

            <span class="placeholder-index">0${index + 1}</span>

            <span class="placeholder-icon">🤍</span>

            <span class="placeholder-label">الذكرى في انتظارها</span>

        </div>

    </div>

    <div class="photo-hint">

        <div class="hint-icon">❤️</div>

        <span>اضغط لرؤية القصة</span>

    </div>

    <div class="photo-overlay">

        <h3>${photo.title}</h3>

        <p>${photo.text}</p>

    </div>

</div>

`;

    });

    // أي صورة مش موجودة فعليًا بتتحول تلقائيًا لبلايسهولدر أنيق
    grid.querySelectorAll(".photo-card img").forEach(img => {

        img.addEventListener("error", () => {

            img.closest(".photo-card").classList.add("is-placeholder");

        }, { once: true });

    });

    animateGallery();

    autoHint();

    initLightbox();

}


// =======================================
// Fullscreen Lightbox
// =======================================

let lightboxIndex = 0;

function buildLightbox() {

    if (document.querySelector(".lightbox")) return;

    document.body.insertAdjacentHTML("beforeend", `

<div class="lightbox" id="lightbox" role="dialog" aria-modal="true" aria-label="عرض الذكرى">

    <div class="lightbox-backdrop"></div>

    <button class="lightbox-close" id="lightbox-close" aria-label="إغلاق">✕</button>

    <button class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="السابق">‹</button>
    <button class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="التالي">›</button>

    <div class="lightbox-stage">

        <img class="lightbox-image" id="lightbox-image" alt="">

        <div class="lightbox-caption">

            <span class="lightbox-index" id="lightbox-count"></span>
            <h3 id="lightbox-title"></h3>
            <p id="lightbox-text"></p>

        </div>

    </div>

</div>

`);

    document.querySelector("#lightbox-close").addEventListener("click", closeLightbox);
    document.querySelector(".lightbox-backdrop").addEventListener("click", closeLightbox);
    document.querySelector("#lightbox-prev").addEventListener("click", () => stepLightbox(-1));
    document.querySelector("#lightbox-next").addEventListener("click", () => stepLightbox(1));

    document.addEventListener("keydown", (e) => {

        const lb = document.querySelector("#lightbox");

        if (!lb || !lb.classList.contains("is-open")) return;

        if (e.key === "Escape") closeLightbox();
        if (e.key === "ArrowLeft") stepLightbox(1);   // RTL: left = next visually
        if (e.key === "ArrowRight") stepLightbox(-1);

    });

}

function renderLightbox(index) {

    const photo = galleryData[index];

    const img = document.querySelector("#lightbox-image");
    const title = document.querySelector("#lightbox-title");
    const text = document.querySelector("#lightbox-text");
    const count = document.querySelector("#lightbox-count");

    gsap.to(img, {

        opacity: 0,
        duration: .25,
        onComplete: () => {

            img.src = photo.image;
            title.textContent = photo.title;
            text.textContent = photo.text;
            count.textContent = `${index + 1} / ${galleryData.length}`;

            gsap.to(img, { opacity: 1, duration: .4 });

        }

    });

}

function openLightbox(index) {

    buildLightbox();

    lightboxIndex = index;

    const lb = document.querySelector("#lightbox");

    lb.classList.add("is-open");
    document.body.classList.add("scroll-locked");

    renderLightbox(lightboxIndex);

    gsap.fromTo(".lightbox-stage",
        { opacity: 0, scale: .92 },
        { opacity: 1, scale: 1, duration: .5, ease: "power3.out" }
    );

}

function closeLightbox() {

    const lb = document.querySelector("#lightbox");

    if (!lb) return;

    gsap.to(".lightbox-stage", {

        opacity: 0,
        scale: .96,
        duration: .3,

        onComplete: () => {

            lb.classList.remove("is-open");
            document.body.classList.remove("scroll-locked");

        }

    });

}

function stepLightbox(dir) {

    lightboxIndex = (lightboxIndex + dir + galleryData.length) % galleryData.length;

    renderLightbox(lightboxIndex);

}

function initLightbox() {

    document.querySelectorAll(".photo-card").forEach((card, index) => {

        card.addEventListener("click", () => openLightbox(index));

    });

}

function animateGallery() {

    gsap.from(".gallery-header", {

        scrollTrigger: {

            trigger: ".gallery",

            start: "top 75%"

        },

        opacity: 0,

        y: 80,

        duration: 1.2

    });

    gsap.utils.toArray(".photo-card").forEach((card, index) => {

        gsap.from(card, {

            scrollTrigger: {

                trigger: card,

                start: "top 85%"

            },

            opacity: 0,

            y: 120,

            scale: .9,

            duration: 1,

            delay: index * .15,

            ease: "power3.out"

        });

    });

}



// =======================================
// Auto Hint
// =======================================

function autoHint() {

    const cards = document.querySelectorAll(".photo-card");

    if (!cards.length) return;

    let current = 0;

    setInterval(() => {

        const hint = cards[current].querySelector(".photo-hint");

        gsap.fromTo(

            hint,

            {
                opacity: 0,
                scale: .65,
                y: 10
            },

            {

                opacity: 1,
                scale: 1,
                y: 0,

                duration: .45,

                ease: "back.out(2)",

                onComplete() {

                    gsap.to(hint, {

                        scale: 1.08,

                        duration: .7,

                        repeat: 1,

                        yoyo: true,

                        ease: "sine.inOut",

                        onComplete() {

                            gsap.to(hint, {

                                opacity: 0,

                                scale: .7,

                                y: -10,

                                duration: .4

                            });

                        }

                    });

                }

            }

        );

        current++;

        if (current >= cards.length) {

            current = 0;

        }

    }, 5000);

}