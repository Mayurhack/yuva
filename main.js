// Initialize Firebase safely
let db = null;
if (window.firebase && typeof firebaseConfig !== 'undefined') {
    try {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        window.firebaseDB = db;
    } catch (err) {
        console.error("Firebase initialization error:", err);
    }
} else {
    console.warn("Firebase SDK not loaded or firebaseConfig is missing. Running in simulator mode.");
}

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

    // 4. Interactive Registration & Modal Events
    const navRegBtn = document.getElementById('nav-reg-btn');
    const notifyBtn = document.getElementById('notify-btn');
    const regModal = document.getElementById('reg-modal');
    const closeRegModal = document.getElementById('close-reg-modal');
    const regForm = document.getElementById('reg-form');
    const inviteModal = document.getElementById('invite-modal');
    const closeInviteModal = document.getElementById('close-invite-modal');

    // Confetti canvas or simple firework burst animation on click
    function createFireworks() {
        for (let i = 0; i < 45; i++) {
            setTimeout(() => {
                const burstParticle = new Particle();
                // Override to burst from the center of screen
                burstParticle.x = window.innerWidth / 2 + (Math.random() - 0.5) * 150;
                burstParticle.y = window.innerHeight / 2 + (Math.random() - 0.5) * 150;
                burstParticle.speedY = (Math.random() - 0.5) * 8;
                burstParticle.speedX = (Math.random() - 0.5) * 8;
                burstParticle.size = Math.random() * 6 + 2.5;
                burstParticle.alpha = 1.0;
                burstParticle.fadeSpeed = 0.012;
                particles.push(burstParticle);
                
                // Remove extra particles after animation to maintain performance
                setTimeout(() => {
                    const idx = particles.indexOf(burstParticle);
                    if (idx > -1) particles.splice(idx, 1);
                }, 2000);
            }, i * 15);
        }
    }
    window.createFireworks = createFireworks;

    // Open Registration Modal
    if (navRegBtn) {
        navRegBtn.addEventListener('click', () => {
            regModal.classList.add('active');
        });
    }

    if (notifyBtn) {
        notifyBtn.addEventListener('click', () => {
            regModal.classList.add('active');
        });
    }

    // Close Registration Modal
    if (closeRegModal) {
        closeRegModal.addEventListener('click', () => {
            regModal.classList.remove('active');
        });
    }

    // Submit Registration Form
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = regForm.querySelector('#reg-name') ? regForm.querySelector('#reg-name').value : '';
            const contact = regForm.querySelector('#reg-contact') ? regForm.querySelector('#reg-contact').value : '';
            const occupation = regForm.querySelector('#reg-occupation') ? regForm.querySelector('#reg-occupation').value : '';
            const dob = regForm.querySelector('#reg-dob') ? regForm.querySelector('#reg-dob').value : '';
            const address = regForm.querySelector('#reg-address') ? regForm.querySelector('#reg-address').value : '';

            const handleSuccess = () => {
                // Close registration modal
                regModal.classList.remove('active');
                
                // Trigger spectacular saffron/gold fireworks animation
                createFireworks();
                
                // Show invite modal after a tiny delay
                setTimeout(() => {
                    inviteModal.classList.add('active');
                }, 300);
                
                // Reset form for future use
                regForm.reset();
            };

            if (db) {
                db.collection("registrations").add({
                    name,
                    contact,
                    occupation,
                    dob,
                    address,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                })
                .then(() => {
                    handleSuccess();
                })
                .catch((error) => {
                    console.error("Error saving registration to Firebase:", error);
                    alert("નોંધણી સબમિટ કરવામાં ભૂલ આવી: " + error.message);
                });
            } else {
                console.log("Firebase database not active. Saving registration locally (simulated).");
                handleSuccess();
            }
        });
    }

    // Close Invite Modal
    if (closeInviteModal) {
        closeInviteModal.addEventListener('click', () => {
            inviteModal.classList.remove('active');
        });
    }

    // Close modals if user clicks outside content
    window.addEventListener('click', (e) => {
        if (e.target === regModal) {
            regModal.classList.remove('active');
        }
        if (e.target === inviteModal) {
            inviteModal.classList.remove('active');
        }
    });

    // 5. Audio Control Logic using YouTube API
    const audioToggle = document.getElementById('audio-toggle');
    const volOnIcon = document.querySelector('.volume-on');
    const volOffIcon = document.querySelector('.volume-off');
    
    let isPlaying = false;
    let ytPlayerReady = false;
    let ytPlayer;

    function playMusic() {
        if (!ytPlayerReady || !ytPlayer || isPlaying) return;
        
        try {
            ytPlayer.playVideo();
            volOnIcon.classList.remove('hidden');
            volOffIcon.classList.add('hidden');
            isPlaying = true;
        } catch (e) {
            console.log("Autoplay blocked by browser. Waiting for interaction.");
        }
    }

    function pauseMusic() {
        if (!ytPlayerReady || !ytPlayer || !isPlaying) return;
        
        try {
            ytPlayer.pauseVideo();
            volOnIcon.classList.add('hidden');
            volOffIcon.classList.remove('hidden');
            isPlaying = false;
        } catch (e) {
            console.error("Error pausing video:", e);
        }
    }

    // Play audio on first user interaction if autoplay is blocked
    const autoPlayEvents = ['click', 'touchstart', 'scroll', 'keydown'];
    function playOnInteraction() {
        if (!isPlaying) {
            playMusic();
        }
        // Remove listeners after first interaction attempt
        autoPlayEvents.forEach(event => {
            window.removeEventListener(event, playOnInteraction);
        });
    }

    function initYTPlayer() {
        if (ytPlayerReady || ytPlayer) return;
        ytPlayer = new YT.Player('yt-player', {
            height: '200',
            width: '200',
            videoId: 'RHMM8tKsGbw',
            playerVars: {
                'playsinline': 1,
                'loop': 1,
                'playlist': 'RHMM8tKsGbw'
            },
            events: {
                'onReady': () => {
                    ytPlayerReady = true;
                    ytPlayer.setVolume(35);
                    // Try to play immediately on ready
                    playMusic();
                    // Set up event listeners for interaction fallback
                    autoPlayEvents.forEach(event => {
                        window.addEventListener(event, playOnInteraction, { passive: true });
                    });
                }
            }
        });
    }

    if (document.getElementById('yt-player')) {
        if (window.YT && window.YT.Player) {
            initYTPlayer();
        } else {
            // Load YouTube API script dynamically
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = function() {
                initYTPlayer();
            }
        }
    }

    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            if (!ytPlayerReady || !ytPlayer) {
                console.log("YouTube Player is loading, please wait...");
                return;
            }
            
            if (isPlaying) {
                pauseMusic();
            } else {
                playMusic();
            }
        });
    }
});
