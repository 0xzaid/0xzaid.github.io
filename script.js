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

// Prevent scroll restoration on page load
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Initialize effects
document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top on load
    window.scrollTo(0, 0);

    // Typing animation for name with misspellings
    const typingElement = document.getElementById('typing-name');
    const correctName = 'zaid al-dirbashi';

    let currentText = '';
    let isTyping = true;
    let charIndex = 0;
    let shouldMisspell = false;
    let errorDetected = false;
    let errorPosition = -1;

    // More typo variations
    function getTypoVersion() {
        const typoTypes = [
            { pos: 2, char: 'y' },   // zayd
            { pos: 3, char: 'e' },   // zaied
            { pos: 1, char: 'i' },   // ziaid
            { pos: 0, char: 's' },   // said
            { pos: 8, char: 'u' },   // zaid al-durbashi
            { pos: 9, char: 'e' },   // zaid al-derbashi
            { pos: 11, char: 'i' },  // zaid al-diibashi
            { pos: 12, char: 'e' },  // zaid al-direbashi
            { pos: 13, char: 'p' },  // zaid al-dirpashi
            { pos: 14, char: 'e' },  // zaid al-dirbeashi
            { pos: 15, char: 'a' },  // zaid al-dirbashi
            { pos: 4, char: 'd' },   // zaiddaldirbashi
        ];
        return typoTypes[Math.floor(Math.random() * typoTypes.length)];
    }

    let currentTypo = null;
    let attempts = 0;

    function type() {
        // Decide if we should misspell on this attempt
        if (charIndex === 0 && isTyping) {
            attempts++;
            // 50% chance of error
            shouldMisspell = Math.random() < 0.5;
            errorDetected = false;
            errorPosition = -1;
            currentText = ''; // Reset text

            if (shouldMisspell) {
                currentTypo = getTypoVersion();
            } else {
                currentTypo = null;
            }
        }

        if (isTyping) {
            // Typing forward
            if (charIndex < correctName.length) {
                let charToType;

                // Check if we should introduce an error at this position
                if (shouldMisspell && currentTypo && charIndex === currentTypo.pos && !errorDetected) {
                    charToType = currentTypo.char;
                    errorDetected = true;
                    errorPosition = charIndex;
                } else {
                    charToType = correctName[charIndex];
                }

                currentText += charToType;
                typingElement.textContent = currentText;
                charIndex++;

                // If we just typed an error, type ONE more character then start backspacing
                if (errorDetected && charIndex === errorPosition + 2) {
                    setTimeout(() => {
                        isTyping = false;
                        type();
                    }, 300);
                    return; // Important: return here to prevent double setTimeout
                }

                setTimeout(type, 80 + Math.random() * 40);
            } else {
                // Finished typing correctly! Pause longer, then restart
                setTimeout(() => {
                    isTyping = false;
                    type();
                }, 3000);
            }
        } else {
            // Backspacing
            if (charIndex > 0) {
                charIndex--;
                currentText = currentText.slice(0, -1);
                typingElement.textContent = currentText;
                setTimeout(type, 40 + Math.random() * 20);
            } else {
                // Finished backspacing, start typing again
                isTyping = true;
                currentText = '';
                setTimeout(type, 300);
            }
        }
    }

    // Start the animation
    setTimeout(type, 500);

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
