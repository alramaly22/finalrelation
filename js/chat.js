// =======================================
// Project Hope
// Chapter 01
// First Chat
// =======================================

const firstChat = [

    {
        sender: "me",
        text: "حاسس إني شوفتك قبل كده... انتي من بورسعيد؟"
    },

    {
        sender: "her",
        text: "لا"
    },

    {
        sender: "me",
        text: "أومال منين"
    },

    {
        sender: "system",
        text: "تم إلغاء إرسال رسالة"
    },

    {
        sender: "system",
        text: "تم إلغاء إرسال رسالة"
    },

    {
        sender: "me",
        text: "ايوه برضه عايز اعرف اللي عملتيه عملتيه ليه."
    },

    {
        sender: "her",
        text: "عشان سألتني سؤال عادي... لقيتك بتقولي أومال منين وشكلها هتقلب إننا نتعرف وأنا مش بتعرف على حد."
    }

];

function initChat() {

    const section = document.querySelector("#first-chat");

    if (!section) return;
    if (section.dataset.rendered) return;

    section.dataset.rendered = "true";

    section.innerHTML = `

        <div class="chat-header">

            <span class="chat-date">
                1 فبراير 2021
            </span>

            <h2>
    رسالة غيرت كل حاجة...
</h2>

            <p>
    وقتها مكانش حد فينا يعرف...
    إن كام كلمة هيغيروا سنين كاملة من حياتنا.
</p>

        </div>

        <div class="phone">

            <div class="phone-top">

                <div class="avatar">

                    <img src="assets/images/first-chat/firstimage.jpg" alt="">

                </div>

                <div class="phone-info">

                    <h3>🦌</h3>

                    <span>Instagram Chat</span>

                </div>

            </div>

            <div id="chat-body"></div>

        </div>

        <!--
            Optional soundtrack for this chapter. Drop a file at
            assets/audio/chat-theme.mp3 and it fades in once the
            conversation starts, and fades out completely the
            moment it ends — otherwise this stays silent.
        -->
        <audio id="chat-theme-audio" loop preload="none">
            <source src="assets/audio/inst.mp3" type="audio/mpeg">
        </audio>

    `;

    initChatTheme();

    gsap.from(".chat-header", {

        opacity: 0,
        y: 80,
        duration: 1,

        scrollTrigger: {

            trigger: "#first-chat",
            start: "top 70%",
            once: true

        }

    });

    gsap.from(".phone", {

        opacity: 0,
        scale: .8,
        y: 120,
        duration: 1.3,
        ease: "back.out(1.7)",
        delay: .4,

        scrollTrigger: {

            trigger: "#first-chat",
            start: "top 70%",
            once: true

        },

        onComplete() {

            gsap.to(".phone", {

                y: -8,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"

            });

            if (chatThemeReady) {

                playSectionAudio(document.querySelector("#chat-theme-audio"), .22);

            }

            playChatConversation();


        }

    });

}

// Stays silent until assets/audio/chat-theme.mp3 actually exists —
// same readiness pattern used by every other optional track.
let chatThemeReady = false;

function initChatTheme() {

    const audio = document.querySelector("#chat-theme-audio");

    if (!audio) return;

    audio.addEventListener("canplaythrough", () => {

        chatThemeReady = true;

    }, { once: true });

    audio.addEventListener("error", () => {

        audio.remove();

    }, { once: true });

    audio.volume = 0;
    audio.load();

}

function playChatConversation() {

    const body = document.querySelector("#chat-body");

    if (!body) return;

    body.innerHTML = "";

    let delay = 0;

    firstChat.forEach((message, index) => {

        setTimeout(() => {

            showTyping(message, index);

        }, delay);

        delay += 2200;

    });

}

function showTyping(message, index) {

    const body = document.querySelector("#chat-body");

    const typing = document.createElement("div");

    typing.className = "typing";

    if (message.sender === "me") {

        typing.classList.add("me");

    }

    if (message.sender === "her") {

        typing.classList.add("her");

    }

    typing.innerHTML = `
        <span></span>
        <span></span>
        <span></span>
    `;

    body.appendChild(typing);

    body.scrollTop = body.scrollHeight;

    setTimeout(() => {

        typing.remove();

        addMessage(message);

        // بعد آخر رسالة — hold on the last message, bring in the
        // ending text, and only then fade the chapter's own
        // soundtrack out to silence instead of letting it play on.
        if (index === firstChat.length - 1) {

            setTimeout(() => {

                showEndingText();

                stopSectionAudio(document.querySelector("#chat-theme-audio"));

            }, 2500);

        }

    }, 900);

}

// EDIT ME: the moment this conversation starts, in-story.
// Timestamps below count forward from here, minute by minute.
const chatStartTime = new Date();
chatStartTime.setHours(22, 14, 0, 0);

let chatMinutesElapsed = 0;

// A soft message pop — stays silent everywhere until a real
// file exists at assets/audio/message.mp3.
let messageSound = null;

function playMessageSound() {

    if (messageSound === null) {

        messageSound = new Audio("assets/audio/inst.mp3");
        messageSound.volume = .35;

    }

    messageSound.currentTime = 0;
    messageSound.play().catch(() => {});

}

function addMessage(message) {

    const body = document.querySelector("#chat-body");

    const div = document.createElement("div");

    div.classList.add("message");

    if (message.sender === "me") {

        div.classList.add("me");

    }

    if (message.sender === "her") {

        div.classList.add("her");

    }

    if (message.sender === "system") {

        div.classList.add("system-message");

    }

    const bubble = document.createElement("span");

    bubble.className = "message-text";
    bubble.textContent = message.text;

    div.appendChild(bubble);

    if (message.sender !== "system") {

        chatMinutesElapsed += 1 + Math.floor(Math.random() * 2);

        const stamp = new Date(chatStartTime.getTime() + chatMinutesElapsed * 60000);
        const time = document.createElement("span");

        time.className = "message-time";
        time.textContent = stamp.toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit"
        });

        div.appendChild(time);

        playMessageSound();

    }

    body.appendChild(div);

    gsap.from(div, {

        opacity: 0,
        y: 35,
        scale: .7,
        filter: "blur(8px)",
        duration: .9,
        ease: "back.out(1.6)"

    });

    body.scrollTop = body.scrollHeight;

}

function showEndingText() {

    const section = document.querySelector("#first-chat");

    const ending = document.createElement("div");

    ending.className = "chapter-end";

    ending.innerHTML = `

        <p>

            كل حاجة كبيرة...
            بدأت برسالة صغيرة.

        </p>

    `;

    section.appendChild(ending);

    gsap.from(ending, {

        opacity: 0,
        y: 60,
        duration: 1.2,
        ease: "power3.out"

    });

}