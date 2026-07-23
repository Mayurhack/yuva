// Initialize Supabase Client safely
let supabase = null;
try {
    if (window.supabase && typeof CONFIG !== 'undefined') {
        supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
        window.supabaseClient = supabase;
    } else {
        if (!window.supabase) {
            console.error("Supabase CDN failed to load. Check your internet connection.");
        } else {
            console.warn("CONFIG is missing. Please make sure config.js is loaded.");
        }
    }
} catch (e) {
    console.error("Error creating Supabase client:", e);
    window.supabaseInitError = e.message;
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
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.querySelector('#reg-modal #reg-name').value;
            const contact = document.querySelector('#reg-modal #reg-contact').value;
            const occupation = document.querySelector('#reg-modal #reg-occupation').value;
            const dob = document.querySelector('#reg-modal #reg-dob').value;
            const address = document.querySelector('#reg-modal #reg-address').value;
            
            try {
                if (!supabase) {
                    let missing = [];
                    if (!window.supabase) missing.push("Supabase library SDK (CDN) did not load");
                    if (typeof CONFIG === 'undefined') missing.push("config.js file did not load");
                    if (window.supabaseInitError) missing.push("Init Error: " + window.supabaseInitError);
                    throw new Error("Initialization failed: " + (missing.join(" and ") || "Unknown reason"));
                }
                // Insert into Supabase registrations table
                const { error } = await supabase.from('registrations').insert([
                    { name, contact, occupation, dob, address }
                ]);
                
                if (error) throw error;
                
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
            } catch (err) {
                console.error("Error inserting registration:", err);
                alert("નોંધણી સબમિટ કરવામાં ભૂલ આવી. કૃપા કરીને ફરી પ્રયાસ કરો. \nError details: " + (err.message || err));
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
                ytPlayer.pauseVideo();
                volOnIcon.classList.add('hidden');
                volOffIcon.classList.remove('hidden');
                isPlaying = false;
            } else {
                ytPlayer.playVideo();
                volOnIcon.classList.remove('hidden');
                volOffIcon.classList.add('hidden');
                isPlaying = true;
            }
        });
    }

    // 6. Floating Status Indicator for Database Connection
    const debugDot = document.createElement('div');
    debugDot.style.position = 'fixed';
    debugDot.style.bottom = '15px';
    debugDot.style.right = '15px';
    debugDot.style.width = '14px';
    debugDot.style.height = '14px';
    debugDot.style.borderRadius = '50%';
    debugDot.style.zIndex = '9999';
    debugDot.style.cursor = 'pointer';
    debugDot.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    
    let statusText = "";
    if (!window.supabase) {
        debugDot.style.backgroundColor = '#ff3b30'; // Red
        debugDot.style.boxShadow = '0 0 10px #ff3b30';
        statusText = "Supabase SDK CDN failed to load. Check your internet connection.";
    } else if (typeof CONFIG === 'undefined') {
        debugDot.style.backgroundColor = '#ff9500'; // Orange
        debugDot.style.boxShadow = '0 0 10px #ff9500';
        statusText = "config.js file is missing or failed to load. Check file path or reload.";
    } else if (window.supabaseInitError) {
        debugDot.style.backgroundColor = '#ff3b30'; // Red
        debugDot.style.boxShadow = '0 0 10px #ff3b30';
        statusText = "Supabase client initialization error: " + window.supabaseInitError;
    } else {
        debugDot.style.backgroundColor = '#34c759'; // Green
        debugDot.style.boxShadow = '0 0 10px #34c759';
        statusText = "Supabase Database connected successfully!";
    }
    
    debugDot.title = "Database Status: " + statusText;
    debugDot.addEventListener('click', () => {
        alert("Database Status Details:\n\n" + statusText + "\n\n(Click anywhere to close)");
    });
    document.body.appendChild(debugDot);
});
