// 
// TYAC Official Portal JavaScript
// All original behaviours are preserved: scroll-spy navigation, contact form
// notice, scroll reveal, button ripple and the dynamic footer year.
// Added: the measuring rail, the plotter (strip) image reveal and the
// CAD crosshair cursor.
// 

document.addEventListener("DOMContentLoaded", () => {

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 
    // SECTION REGISTRY — drives scroll-spy and the measuring rail
    // 
    const SHEETS = [
        { id: "home", sheet: "01", label: "HOME" },
        { id: "about", sheet: "03", label: "ABOUT" },
        { id: "blog", sheet: "04", label: "BLOG" },
        { id: "contact", sheet: "05", label: "CONTACT" }
    ];

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    const rail = document.querySelector(".rail");
    const railStamp = document.querySelector(".rail__stamp");
    const railTrack = document.querySelector(".rail__track");

    let ticking = false;

    const onScrollFrame = () => {
        ticking = false;

        // Active section (original scroll-spy behaviour)
        let current = "";

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;

            if (window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle("is-active", link.getAttribute("href") === `#${current}`);
        });

        // Measuring rail: progress + current sheet
        if (rail) {
            const scrollable = document.documentElement.scrollHeight - window.innerHeight;
            const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
            rail.style.setProperty("--p", progress.toFixed(4));
        }

        if (railStamp) {
            const active = SHEETS.find(s => s.id === current) || SHEETS[0];
            railStamp.textContent = `${active.sheet} / ${active.label}`;
        }
    };

    window.addEventListener("scroll", () => {
        if (!ticking) {
            ticking = true;
            window.requestAnimationFrame(onScrollFrame);
        }
    });

    // 
    // MEASURING RAIL — millimetre markings drawn to the height of the track
    // 
    const drawRailTicks = () => {
        if (!railTrack) return;

        const height = railTrack.clientHeight;
        if (height < 80) return;

        const step = 16;
        const count = Math.max(2, Math.floor(height / step));
        const gap = height / (count - 1);

        railTrack.querySelectorAll(".rail__tick").forEach(t => t.remove());

        for (let i = 0; i < count; i++) {
            const tick = document.createElement("span");
            tick.className = "rail__tick";
            if (i % 5 === 0) {
                tick.classList.add("rail__tick--major");
                const value = document.createElement("span");
                value.textContent = String(i * 20);
                tick.appendChild(value);
            }
            tick.style.top = `${Math.round(i * gap)}px`;
            railTrack.appendChild(tick);
        }
    };

    // 
    // PLOTTER REVEAL — images print themselves in vertical strips
    // 
    const plotterIO = "IntersectionObserver" in window
        ? new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const strips = entry.target.querySelectorAll(".plotter__strip");
                strips.forEach((strip, i) => {
                    window.setTimeout(() => strip.classList.add("is-in"), i * 55);
                });
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.2 })
        : null;

    const stagePlotter = (plotter) => {
        const image = plotter.querySelector(".plotter__img");
        if (!image || plotter.dataset.staged === "true") return;

        const strips = 8;
        const container = document.createElement("div");
        container.className = "plotter__strips";
        container.setAttribute("aria-hidden", "true");

        for (let i = 0; i < strips; i++) {
            const strip = document.createElement("div");
            strip.className = "plotter__strip";
            strip.style.left = `${(i * 100) / strips}%`;
            strip.style.width = `${100 / strips}%`;

            const slice = image.cloneNode(true);
            slice.classList.remove("plotter__img");
            slice.removeAttribute("alt");
            slice.setAttribute("alt", "");
            slice.style.width = `${strips * 100}%`;
            slice.style.left = `${-i * 100}%`;

            strip.appendChild(slice);
            container.appendChild(strip);
        }

        plotter.appendChild(container);
        plotter.classList.add("is-staged");
        plotter.dataset.staged = "true";

        if (plotterIO && !prefersReducedMotion) {
            plotterIO.observe(plotter);
        } else {
            plotter.querySelectorAll(".plotter__strip").forEach(s => s.classList.add("is-in"));
        }
    };

    const initPlotters = () => {
        document.querySelectorAll(".plotter").forEach(stagePlotter);
    };

    initPlotters();

    // 
    // SCROLL REVEAL ANIMATION
    // 
    const revealElements = document.querySelectorAll(
        ".pillar-card, .story-card, .leader-card, .blog-card, .info-card, .section-head"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
        const revealIO = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry, i) => {
                if (!entry.isIntersecting) return;
                entry.target.style.setProperty("--d", `${(i % 3) * 0.08}s`);
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });

        revealElements.forEach(element => revealIO.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("is-visible"));
    }

    // 
    // CAD CROSSHAIR CURSOR (fine pointers only)
    // 
    const cursor = document.querySelector(".cursor");

    if (cursor && window.matchMedia("(pointer: fine)").matches && !prefersReducedMotion) {
        const cursorLabel = cursor.querySelector(".cursor__label");
        let cursorX = window.innerWidth / 2;
        let cursorY = window.innerHeight / 2;
        let cursorFrame = null;

        document.body.classList.add("has-cursor");

        const renderCursor = () => {
            cursorFrame = null;
            cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        };

        window.addEventListener("mousemove", (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
            if (!cursorFrame) cursorFrame = window.requestAnimationFrame(renderCursor);
        }, { passive: true });

        const interactiveSelector = "a, button, .plate";

        document.addEventListener("mouseover", (e) => {
            const target = e.target.closest(interactiveSelector);
            if (!target) return;
            cursorLabel.textContent = target.dataset.cursor || "VIEW";
            cursor.classList.add("is-active");
        });

        document.addEventListener("mouseout", (e) => {
            const target = e.target.closest(interactiveSelector);
            if (!target) return;
            if (target.contains(e.relatedTarget)) return;
            cursor.classList.remove("is-active");
        });
    }

    // 
    // CONTACT FORM HANDLER (Option A: Standard Redirect Submission)
    // 
    const form = document.querySelector(".styled-form");

    if (form) {
        form.addEventListener("submit", (e) => {
            // REMOVED e.preventDefault(); 
            // This allows the form data to successfully send to FormSubmit's server.

            const name = document.getElementById("name").value.trim();

            // Optional alert (might close quickly due to redirect)
            alert(`Thank you, ${name}! Sending your message to The Youth Alliance Change...`);
        });
    }

    // 
    // BUTTON RIPPLE EFFECT
    // 
    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(button => {
        button.addEventListener("click", function (e) {
            const ripple = document.createElement("span");

            const rect = this.getBoundingClientRect();

            ripple.style.width = ripple.style.height = "20px";
            ripple.style.position = "absolute";
            ripple.style.borderRadius = "50%";
            ripple.style.background = "rgba(255,255,255,0.4)";
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            ripple.style.transform = "translate(-50%, -50%)";
            ripple.style.pointerEvents = "none";
            ripple.style.animation = "ripple 0.6s linear";

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 
    // DYNAMIC FOOTER YEAR
    // 
    const footerCopy = document.querySelector(".footer-copy");

    if (footerCopy) {
        footerCopy.innerHTML =
            `&copy; ${new Date().getFullYear()} TYAC. Built to modern web production and accessibility standards.`;
    }

    // 
    // RAIL GEOMETRY — measured after layout, redrawn on resize
    // 
    drawRailTicks();
    onScrollFrame();

    let resizeTimer = null;
    window.addEventListener("resize", () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
            drawRailTicks();
            onScrollFrame();
        }, 180);
    });

});
