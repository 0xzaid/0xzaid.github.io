// Chaos text animation setup
function wrapLettersInSpans(element) {
    const text = element.textContent;
    element.innerHTML = '';

    text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'chaos-letter';
        span.textContent = char;
        span.style.setProperty('--char-index', index);
        if (char === ' ') {
            span.innerHTML = '&nbsp;';
        }
        element.appendChild(span);
    });
}

// Mouse repel effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function applyMouseRepel(letter) {
    const rect = letter.getBoundingClientRect();
    const letterX = rect.left + rect.width / 2;
    const letterY = rect.top + rect.height / 2;

    const deltaX = mouseX - letterX;
    const deltaY = mouseY - letterY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    const maxDistance = 150;

    if (distance < maxDistance) {
        const force = (1 - distance / maxDistance) * 20;
        const angle = Math.atan2(deltaY, deltaX);
        const pushX = -Math.cos(angle) * force;
        const pushY = -Math.sin(angle) * force;

        // Store rotation on the element to avoid jitter
        if (!letter.dataset.rotation) {
            letter.dataset.rotation = (Math.random() - 0.5) * 15;
        }
        const rotation = parseFloat(letter.dataset.rotation);

        letter.style.transform = `translate(${pushX}px, ${pushY}px) rotate(${rotation}deg)`;
        letter.style.opacity = Math.max(0.5, 1 - force/40);
    } else {
        letter.style.transform = '';
        letter.style.opacity = '';
        delete letter.dataset.rotation;
    }
}

// Initialize effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize chaos text on headings and paragraphs
    const chaosElements = document.querySelectorAll('h2, h3, .subtitle');
    chaosElements.forEach(element => {
        element.classList.add('chaos-text');
        wrapLettersInSpans(element);
    });

    // Fade in sections on scroll
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

    // Mouse repel animation loop
    function animateMouseRepel() {
        document.querySelectorAll('.chaos-letter').forEach(letter => {
            applyMouseRepel(letter);
        });
        requestAnimationFrame(animateMouseRepel);
    }
    animateMouseRepel();

    // Random letter disappear
    setInterval(() => {
        const letters = document.querySelectorAll('.chaos-letter');
        if (letters.length > 0 && Math.random() > 0.8) {
            const randomLetter = letters[Math.floor(Math.random() * letters.length)];
            if (!randomLetter.classList.contains('float-away')) {
                const floatRot = (Math.random() - 0.5) * 180;
                randomLetter.style.setProperty('--float-rot', `${floatRot}deg`);
                randomLetter.classList.add('float-away');

                setTimeout(() => {
                    randomLetter.classList.remove('float-away');
                }, 1400);
            }
        }
    }, 4000);

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

    // Flashlight Mode
    const flashlightBtn = document.getElementById('flashlight-toggle');
    const flashlightOverlay = document.getElementById('flashlight-overlay');
    let flashlightActive = false;
    let flickerInterval;

    flashlightBtn.addEventListener('click', () => {
        flashlightActive = !flashlightActive;
        flashlightBtn.classList.toggle('active');
        flashlightOverlay.classList.toggle('active');

        // Add subtle flicker effect when active
        if (flashlightActive) {
            flickerInterval = setInterval(() => {
                if (Math.random() > 0.95) {
                    flashlightOverlay.style.opacity = '0.96';
                    setTimeout(() => {
                        flashlightOverlay.style.opacity = '1';
                    }, 50);
                }
            }, 100);
        } else {
            clearInterval(flickerInterval);
            // Reset overlay background when deactivated
            flashlightOverlay.style.background = 'rgba(5, 5, 5, 0.98)';
            flashlightOverlay.style.opacity = '';
        }
    });

    // Update flashlight position based on mouse
    document.addEventListener('mousemove', (e) => {
        if (flashlightActive) {
            const x = e.clientX;
            const y = e.clientY;

            // Create realistic flashlight effect with multiple gradient rings
            const gradient = `
                radial-gradient(circle at ${x}px ${y}px,
                    transparent 0px,
                    transparent 40px,
                    rgba(5, 5, 5, 0.3) 60px,
                    rgba(5, 5, 5, 0.7) 90px,
                    rgba(5, 5, 5, 0.95) 120px,
                    rgba(5, 5, 5, 0.98) 140px
                )
            `;

            flashlightOverlay.style.background = gradient;
        }
    });
});
