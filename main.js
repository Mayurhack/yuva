document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Canvas Setup
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const maxParticles = 60;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + Math.random() * 50;
            this.size = Math.random() * 3 + 1;
            this.speedY = -(Math.random() * 1.5 + 0.5);
            this.speedX = Math.sin(Math.random() * 2 * Math.PI) * 0.4;
            // Saffron to Gold colors
            const colors = [
                'rgba(255, 119, 0, ', // Saffron
                'rgba(255, 196, 0, ', // Gold
                'rgba(255, 153, 51, ', // Light Saffron
                'rgba(255, 230, 100, ' // Warm Yellow
            ];
            this.baseColor = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.3;
            this.fadeSpeed = Math.random() * 0.005 + 0.002;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.alpha -= this.fadeSpeed;

            if (this.alpha <= 0 || this.y < -10 || this.x < 0 || this.x > canvas.width) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.baseColor + this.alpha + ')';
            ctx.shadowBlur = this.size * 2;
            ctx.shadowColor = 'rgba(255, 196, 0, 0.5)';
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Clear shadow settings for performance
        ctx.shadowBlur = 0;
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();

    // 2. Intersection Observer for Scroll Reveal
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 3. 3D Tilt Effect on Bharat Mata Image Container
    const container3d = document.querySelector('.image-container-3d');
    const img3d = document.querySelector('.bharat-mata-img');
    
    if (container3d && img3d) {
        container3d.addEventListener('mousemove', (e) => {
            const rect = container3d.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within element
            const y = e.clientY - rect.top;  // y position within element
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation values (-15deg to 15deg)
            const rotateX = ((centerY - y) / centerY) * 15;
            const rotateY = ((x - centerX) / centerX) * 15;
            
            container3d.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            img3d.style.transform = `scale(1.05) translateZ(20px)`;
        });

        container3d.addEventListener('mouseleave', () => {
            container3d.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            img3d.style.transform = 'scale(1) translateZ(0px)';
        });
    }

    // 4. Interactive Reveal Date & Button Event
    const notifyBtn = document.getElementById('notify-btn');
    const modal = document.getElementById('modal');
    const closeModal = document.getElementById('close-modal');

    // Confetti canvas or simple firework burst animation on click
    function createFireworks() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const burstParticle = new Particle();
                // Override to burst from the center of screen
                burstParticle.x = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
                burstParticle.y = window.innerHeight / 2 + (Math.random() - 0.5) * 200;
                burstParticle.speedY = (Math.random() - 0.5) * 6;
                burstParticle.speedX = (Math.random() - 0.5) * 6;
                burstParticle.size = Math.random() * 5 + 2;
                burstParticle.alpha = 1.0;
                burstParticle.fadeSpeed = 0.015;
                particles.push(burstParticle);
                
                // Remove extra particles after animation to maintain performance
                setTimeout(() => {
                    const idx = particles.indexOf(burstParticle);
                    if (idx > -1) particles.splice(idx, 1);
                }, 2000);
            }, i * 20);
        }
    }

    if (notifyBtn) {
        notifyBtn.addEventListener('click', () => {
            createFireworks();
            setTimeout(() => {
                modal.classList.add('active');
            }, 500);
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // Close modal if user clicks outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // 5. Audio Control Logic
    const audioToggle = document.getElementById('audio-toggle');
    const bgMusic = document.getElementById('bg-music');
    const volOnIcon = document.querySelector('.volume-on');
    const volOffIcon = document.querySelector('.volume-off');
    
    let isPlaying = false;

    if (audioToggle && bgMusic) {
        // Lower the volume to make it pleasant background music
        bgMusic.volume = 0.35;

        audioToggle.addEventListener('click', () => {
            if (isPlaying) {
                bgMusic.pause();
                volOnIcon.classList.add('hidden');
                volOffIcon.classList.remove('hidden');
                isPlaying = false;
            } else {
                // Play audio, handle browser autoplace block gracefully
                bgMusic.play().then(() => {
                    volOnIcon.classList.remove('hidden');
                    volOffIcon.classList.add('hidden');
                    isPlaying = true;
                }).catch(err => {
                    console.log("Audio play blocked by browser. User interaction required.", err);
                });
            }
        });
    }
});
