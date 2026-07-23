// Файл: scripts/script.js

document.addEventListener("DOMContentLoaded", () => {
    // Плавное появление секций
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll("section").forEach(sec => {
        observer.observe(sec);
    });

    // Открытие галереи в новой вкладке по клику
    document.querySelectorAll(".gallery img").forEach(img => {
        img.addEventListener("click", () => {
            window.open(img.src, '_blank');
        });
    });

    const yearEl = document.getElementById("current-year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    // Ссылка WhatsApp в новой вкладке
    const waBtn = document.querySelector(".contacts .btn");
    if (waBtn) {
        waBtn.setAttribute("target", "_blank");
        waBtn.setAttribute("rel", "noopener noreferrer");
    }
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReducedMotion.matches) {
    document.documentElement.style.scrollBehavior = 'auto';
}
