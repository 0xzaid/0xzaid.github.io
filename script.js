// Initialize Locomotive Smooth Scroll
const scroll = new LocomotiveScroll({
    el: document.querySelector('#smooth-content'),
    smooth: true,
    smoothMobile: false,
    multiplier: 0.8,
    lerp: 0.08,
    class: 'is-inview',
    scrollbarClass: 'c-scrollbar',
    scrollbarContainer: false,
    getDirection: true,
    getSpeed: true,
    reloadOnContextChange: true
});

// Smooth scroll reveal effect
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Update locomotive scroll after images load
    scroll.update();

    // Glitch effect on link hover
    const links = document.querySelectorAll('a');
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

    links.forEach(link => {
        link.dataset.originalText = link.textContent;

        link.addEventListener('mouseenter', function() {
            let iterations = 0;
            const originalText = this.dataset.originalText;
            const maxIterations = 8;

            const interval = setInterval(() => {
                this.textContent = originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iterations || char === ' ') {
                            return originalText[index];
                        }
                        // Randomly glitch 1-2 characters
                        if (Math.random() > 0.7) {
                            return characters[Math.floor(Math.random() * characters.length)];
                        }
                        return originalText[index];
                    })
                    .join('');

                iterations += 1;

                if (iterations > maxIterations) {
                    clearInterval(interval);
                    this.textContent = originalText;
                }
            }, 40);
        });
    });
});
