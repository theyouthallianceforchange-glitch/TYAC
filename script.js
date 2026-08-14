// 
// TYAC Official Portal JavaScript
// 

document.addEventListener("DOMContentLoaded", () => {

    // 
    // ACTIVE NAVIGATION LINK
    // 
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
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
            link.classList.remove("active");

            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });

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
    // SCROLL REVEAL ANIMATION
    // 
    const revealElements = document.querySelectorAll(
        ".card, .story-card, .info-card"
    );

    const revealOnScroll = () => {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 100) {
                element.style.opacity = "1";
                element.style.transform = "translateY(0)";
            }
        });
    };

    revealElements.forEach(element => {
        element.style.opacity = "0";
        element.style.transform = "translateY(30px)";
        element.style.transition = "all 0.6s ease";
    });

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll();

    // 
    // HERO BUTTON RIPPLE EFFECT
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

            this.style.position = "relative";
            this.style.overflow = "hidden";

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

});