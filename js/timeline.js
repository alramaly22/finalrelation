// =======================================
// Project Hope
// Chapter 03
// Timeline — reimagined as a Memory Book (Stage 3)
// =======================================

// EDIT ME: one entry per page. `photo` is optional — omit it
// and the page just shows text, a little more like a diary entry.
const timelineData = [

    {
        year: "2021",
        date: "01 / 02 / 2021",
        title: "أول رسالة",
        text: "كنت عارف إنك من القاهرة أصلاً... لكن الحقيقة إني كنت بدور على أي سبب أكلمك. بعد أكتر من سنة كاملة مكنتش بكلم أي بنت، وجيتي إنتِ وكسرتي كل القواعد اللي كنت حاططها لنفسي.",
    },

    {
        year: "2021",
        date: "20 / 02 / 2021",
        title: "أول زعل... وأول رجوع",
        text: "فاكرة أول ريكورد بعتتيه؟ مقدرتش أسمعه وقتها لأن ماما كانت جنبي، وطلبت منك تبعتيه تاني... ومعملتيش كده. 😂 يمكن كانت أول خناقة، لكنها كانت أول مرة أفهم إن زعلك بيفرق معايا بجد.",
    },

    {
        year: "2021",
        date: "18 / 03 / 2021",
        title: "«أصالحك إزاي؟»",
        text: "اليوم ده عمره ما هيروح من ذاكرتي. لما قولتلك إني ببقى محتاج أحكيلك وأنا متضايق، قولتيلي: «تعالى حتى لو إحنا متخانقين... احكيلي، وأنا هقولك تصالحني إزاي.» وقتها حسيت إن أي خلاف بينا كان ليه نهاية... طول ما إحنا بنحاول.",
    },

    {
        year: "2021",
        date: "بعدها بفترة",
        title: "أول مرة سمعت صوتك",
        text: "أول Voice Note كان يمكن تلات ثواني بس... لكن فاكر إني قعدت أسمعه أكتر من مرة. مكنش مجرد صوت... كان أول مرة أحس إن الشخص اللي ورا الشاشة بقى حقيقي.",
    },

    {
        year: "2021",
        date: "بعدها بفترة",
        title: "أول مرة قولتلك بحبك",
        text: "كنت متردد... ويمكن خايف. لكن كنت متأكد إن الكلمة دي مكانها عندك إنتِ. ومن اليوم ده، الكلمة دي عمرها ما خرجت من قلبي.",
    },

    {
        year: "2021",
        date: "بعدها بفترة",
        title: "أول أغنية",
        text: "فاكرة أغنية «هفضل أحبك»؟ وقتها كانت مجرد أغنية... لكن بعد كل السنين دي، كل مرة بسمعها بحس إنها بتحكي جزء من حكايتنا.",
    },

    {
        year: "2022",
        date: "26 / 03 / 2022",
        title: "أول مرة شوفتك",
        text: "اليوم ده عمري ما هنساه. كنت مستني اللحظة دي من قبلها بوقت، وقلبي كان بيدق بطريقة عمري ما حسيتها قبل كده. ولما شوفتك... حسيت إن كل الصور اللي كنت بشوفها مكانتش كفاية توصف جمالك.",
    },

    {
        year: "2022",
        date: "بعد أول امتحان",
        title: "أول مكالمة",
        text: "خرجت من الامتحان، وكل اللي كان في دماغي إني أكلمك. صحيتي تتطمني عليا، وبعدها نمتي في المكالمة 😂 ولما صحيتي فضلت أشتغلك وأقولك إنك قولتي كلام إنتِ أصلاً مقولتوش.",
    },

    {
        year: "بدون تاريخ",
        date: "ذكرى",
        title: "لما بقيتي بيتي",
        text: "الذكرى دي ملهاش تاريخ... لأنها محصلتش في يوم واحد. كل مرة كنت بتعب فيها، كنت بلاقي نفسي بهرب عندك. مع الوقت فهمت إن البيت مش مكان... البيت ممكن يكون شخص.",
    }

];

let bookIndex = 0;

function initTimeline() {

    if (document.querySelector(".timeline")) return;

    const app = document.querySelector("#app");

    if (!app) return;

    app.insertAdjacentHTML("beforeend", `

<section class="timeline">

    <div class="timeline-header">

        <span>Chapter 03</span>

<h2>دفتر الذكريات</h2>

<p>
مش كل الحكايات بتتكتب...
في حكايات بتعيش جوه القلب.
وده...
مجرد جزء صغير منها.
</p>

    </div>

    <div class="memory-book" id="memory-book">

        <div class="book-cover" id="book-cover">

            <span class="book-cover-emblem">📖</span>
            <h3>دفتر الذكريات</h3>
<span>
افتحيه...
يمكن نلاقي نفسنا لسه مستخبيين بين صفحاته.
</span>
        </div>

        <div class="book-stage" id="book-stage"></div>

    </div>

    <div class="book-nav" id="book-nav">

        <button id="book-prev" aria-label="الصفحة السابقة">‹</button>
        <span class="book-page-indicator" id="book-indicator"></span>
        <button id="book-next" aria-label="الصفحة التالية">›</button>

    </div>

</section>

`);

    buildBookPages();
    animateTimelineEntrance();
    initBookInteractions();

}

function buildBookPages() {

    const stage = document.querySelector("#book-stage");

    timelineData.forEach((entry, index) => {

        const photoMarkup = entry.photo
            ? `<img class="page-photo" src="${entry.photo}" alt="${entry.title}"
                   onerror="this.remove()">`
            : "";

        stage.insertAdjacentHTML("beforeend", `

<div class="book-page ${index === 0 ? "is-active" : ""}" data-index="${index}"
     style="z-index:${timelineData.length - index}">

    <span class="page-year">${entry.year}</span>

    <span class="page-date">${entry.date}</span>

    ${photoMarkup}

    <h3>${entry.title}</h3>

    <p>${entry.text}</p>

    <span class="book-page-number">${index + 1} / ${timelineData.length}</span>

</div>

`);

    });

}

function animateTimelineEntrance() {

    gsap.from(".timeline-header", {

        scrollTrigger: {
            trigger: ".timeline",
            start: "top 75%"
        },

        opacity: 0,
        y: 70,
        filter: "blur(8px)",
        duration: 1.2

    });

    gsap.from("#memory-book", {

        scrollTrigger: {
            trigger: ".timeline",
            start: "top 65%"
        },

        opacity: 0,
        y: 50,
        scale: .96,
        duration: 1.3,
        ease: "power3.out"

    });

}

function renderBookState() {

    const pages = document.querySelectorAll(".book-page");

    pages.forEach((page) => {

        const i = Number(page.dataset.index);

        if (i < bookIndex) {

            page.classList.add("is-turned");
            page.classList.remove("is-active");
            page.style.zIndex = i;

        } else {

            page.classList.remove("is-turned");
            page.style.zIndex = timelineData.length - i;

            if (i === bookIndex) {

                page.classList.add("is-active");

            } else {

                page.classList.remove("is-active");

            }

        }

    });

    const indicator = document.querySelector("#book-indicator");
    const prev = document.querySelector("#book-prev");
    const next = document.querySelector("#book-next");

    if (indicator) {

        indicator.textContent = `${bookIndex + 1} / ${timelineData.length}`;

    }

    if (prev) prev.disabled = bookIndex === 0;
    if (next) next.disabled = bookIndex === timelineData.length - 1;

}

function initBookInteractions() {

    const cover = document.querySelector("#book-cover");
    const nav = document.querySelector("#book-nav");
    const prev = document.querySelector("#book-prev");
    const next = document.querySelector("#book-next");

    cover.addEventListener("click", () => {

        cover.classList.add("is-open");
        nav.classList.add("is-visible");
        renderBookState();

    }, { once: true });

    next.addEventListener("click", () => {

        if (bookIndex >= timelineData.length - 1) return;

        bookIndex++;
        renderBookState();
        playPageTurnSound();

    });

    prev.addEventListener("click", () => {

        if (bookIndex <= 0) return;

        bookIndex--;
        renderBookState();
        playPageTurnSound();

    });

}

// A soft page-turn sound — silent until a real file exists at
// assets/audio/page-turn.mp3, same pattern as the rest of the site.
let pageTurnSound = null;

function playPageTurnSound() {

    if (pageTurnSound === null) {

        pageTurnSound = new Audio("assets/audio/page-turn.mp3");
        pageTurnSound.volume = .3;

    }

    pageTurnSound.currentTime = 0;
    pageTurnSound.play().catch(() => {});

}
