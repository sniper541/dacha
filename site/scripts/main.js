// Initialize all Swiper carousels
document.addEventListener('DOMContentLoaded', function() {
    // Hero Swiper
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // House 1 Swiper
    const house1Swiper = new Swiper('.card:nth-child(1) .house-swiper', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // House 2 Swiper
    const house2Swiper = new Swiper('.card:nth-child(2) .house-swiper', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Territory Swiper
    const territorySwiper = new Swiper('.territory-swiper', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Kitchen Swiper
    const kitchenSwiper = new Swiper('.kitchen-swiper', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Banya Swiper
    const banyaSwiper = new Swiper('.banya-swiper', {
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Reviews Swiper
    const reviewsSwiper = new Swiper('.reviews-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 24,
        navigation: {
            nextEl: '.reviews-swiper .swiper-button-next',
            prevEl: '.reviews-swiper .swiper-button-prev',
        },
        pagination: {
            el: '.reviews-swiper .swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            },
        },
    });

    // Fullscreen Image Viewer Logic
    const fullscreenOverlay = document.getElementById('fullscreen-overlay');
    const fullscreenSwiperEl = document.querySelector('.fullscreen-swiper');
    let fullscreenSwiper = null; // To store the fullscreen Swiper instance

    // Collect all image carousels for easy iteration
    const imageCarousels = [
        house1Swiper,
        house2Swiper,
        territorySwiper,
        kitchenSwiper,
        banyaSwiper
    ];

    document.querySelectorAll('.swiper-slide img').forEach(img => {
        img.addEventListener('click', function() {
            const clickedImgSrc = this.src;
            const parentSwiperContainer = this.closest('.swiper');

            if (!parentSwiperContainer) return; // Should not happen with current HTML structure

            let targetSwiper = null;
            // Find which initialized Swiper instance this image belongs to
            for (const swiperInstance of imageCarousels) {
                if (parentSwiperContainer.contains(swiperInstance.el)) {
                    targetSwiper = swiperInstance;
                    break;
                }
            }
            if (!targetSwiper) return;

            // Get all images from the target carousel
            const allCarouselImages = Array.from(targetSwiper.slides).map(slide => {
                const imgElement = slide.querySelector('img');
                return imgElement ? imgElement.src : null;
            }).filter(src => src !== null);

            // Destroy existing fullscreen Swiper if any
            if (fullscreenSwiper) {
                fullscreenSwiper.destroy(true, true);
                fullscreenSwiper = null;
            }

            // Populate fullscreen Swiper with slides
            const fullscreenWrapper = fullscreenSwiperEl.querySelector('.swiper-wrapper');
            fullscreenWrapper.innerHTML = ''; // Clear previous slides
            allCarouselImages.forEach(src => {
                const slide = document.createElement('div');
                slide.className = 'swiper-slide';
                const imgElement = document.createElement('img');
                imgElement.src = src;
                imgElement.setAttribute('loading', 'lazy');
                slide.appendChild(imgElement);
                fullscreenWrapper.appendChild(slide);
            });

            // Initialize fullscreen Swiper
            fullscreenSwiper = new Swiper(fullscreenSwiperEl, {
                loop: true,
                navigation: {
                    nextEl: '.fullscreen-next',
                    prevEl: '.fullscreen-prev',
                },
                pagination: {
                    el: '.fullscreen-pagination',
                    clickable: true,
                },
            });

            // Set the initial slide to the clicked image
            const initialIndex = allCarouselImages.indexOf(clickedImgSrc);
            if (initialIndex !== -1) {
                fullscreenSwiper.slideToLoop(initialIndex, 0);
            }

            fullscreenOverlay.classList.add('active');
        });
    });

    const closeBtn = document.querySelector('.fullscreen-overlay .close-btn');
    closeBtn.addEventListener('click', function() {
        fullscreenOverlay.classList.remove('active');
        if (fullscreenSwiper) {
            fullscreenSwiper.destroy(true, true);
            fullscreenSwiper = null;
        }
    });

    fullscreenOverlay.addEventListener('click', function(e) {
        if (e.target === fullscreenOverlay) {
            fullscreenOverlay.classList.remove('active');
            if (fullscreenSwiper) {
                fullscreenSwiper.destroy(true, true);
                fullscreenSwiper = null;
            }
        }
    });

    // Mobile Navigation Logic
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    const mobileNavCloseBtn = document.getElementById('mobile-nav-close-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    hamburgerMenu.addEventListener('click', function() {
        mobileNavOverlay.classList.add('active');
    });

    mobileNavCloseBtn.addEventListener('click', function() {
        mobileNavOverlay.classList.remove('active');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileNavOverlay.classList.remove('active');
        });
    });

    // Close mobile nav if clicked outside (but only if it's the overlay itself)
    mobileNavOverlay.addEventListener('click', function(e) {
        if (e.target === mobileNavOverlay) {
            mobileNavOverlay.classList.remove('active');
        }
    });

});

// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Back to Top Button Logic
const backToTopButton = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) { // Show button after scrolling 300px
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // Close mobile nav overlay if open
        if (mobileNavOverlay.classList.contains('active')) {
            mobileNavOverlay.classList.remove('active');
        }
    });
}); 