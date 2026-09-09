const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".nav-link");
const typedText = document.querySelector(".typed-text");
const revealElements = document.querySelectorAll(".reveal");
const counterElements = document.querySelectorAll("[data-counter]");
const yearElement = document.getElementById("year");

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

const applyTheme = (theme) => {
    body.setAttribute("data-theme", theme);
    if (themeToggle) {
        const icon = theme === "dark" ? "☀️" : "🌙";
        themeToggle.querySelector(".toggle-icon").textContent = icon;
    }
    localStorage.setItem("portfolio-theme", theme);
};

const storedTheme = localStorage.getItem("portfolio-theme") || "dark";
applyTheme(storedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const currentTheme = body.getAttribute("data-theme") === "dark" ? "light" : "dark";
        applyTheme(currentTheme);
    });
}

if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const setActiveLink = () => {
    const sections = document.querySelectorAll("main section[id]");

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const id = section.getAttribute("id");
        const link = document.querySelector(`.nav-link[href="#${id}"]`);

        if (!link) return;

        if (rect.top <= 180 && rect.bottom >= 180) {
            navLinks.forEach((item) => item.classList.remove("active"));
            link.classList.add("active");
        }
    });
};

window.addEventListener("scroll", setActiveLink);
setActiveLink();

const typeText = () => {
    if (!typedText) return;

    const phrases = typedText.dataset.typed.split("|");
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const loop = () => {
        const current = phrases[phraseIndex];

        if (!deleting) {
            charIndex += 1;
            typedText.textContent = current.slice(0, charIndex);

            if (charIndex === current.length) {
                deleting = true;
                setTimeout(loop, 1200);
                return;
            }
        } else {
            charIndex -= 1;
            typedText.textContent = current.slice(0, charIndex);

            if (charIndex === 0) {
                deleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
            }
        }

        const speed = deleting ? 70 : 110;
        setTimeout(loop, speed);
    };

    loop();
};

typeText();

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealElements.forEach((element) => revealObserver.observe(element));

const animateCounters = () => {
    counterElements.forEach((counter) => {
        const target = Number(counter.dataset.counter || 0);
        const duration = 1400;
        const start = performance.now();

        const update = (time) => {
            const progress = Math.min((time - start) / duration, 1);
            const value = Math.floor(progress * target);
            counter.textContent = `${value}${target === 100 ? "%" : ""}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = `${target}${target === 100 ? "%" : ""}`;
            }
        };

        requestAnimationFrame(update);
    });
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            animateCounters();
            counterObserver.disconnect();
        }
    });
}, { threshold: 0.5 });

counterElements.forEach((counter) => counterObserver.observe(counter));

