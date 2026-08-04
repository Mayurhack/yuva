// Initialize Firebase safely (supports both local config file and Vercel Environment Variables API fallback)
let db = null;
window.firebaseDBPromise = new Promise((resolve) => {
    if (window.firebase && typeof firebaseConfig !== 'undefined') {
        try {
            if (!firebase.apps.length) {
                firebase.initializeApp(firebaseConfig);
            }
            db = firebase.firestore();
            window.firebaseDB = db;
            resolve(db);
        } catch (err) {
            console.error("Firebase initialization error:", err);
            resolve(null);
        }
    } else if (window.firebase) {
        // Try fetching configuration from Vercel Serverless Function fallback
        fetch('/api/config')
            .then(res => {
                if (!res.ok) throw new Error("Status " + res.status);
                return res.json();
            })
            .then(config => {
                if (config && config.apiKey && config.apiKey !== "YOUR_API_KEY" && config.apiKey !== "") {
                    if (!firebase.apps.length) {
                        firebase.initializeApp(config);
                    }
                    db = firebase.firestore();
                    window.firebaseDB = db;
                    console.log("Firebase initialized successfully using Vercel configuration.");
                    resolve(db);
                } else {
                    console.warn("Firebase config fetched from API is empty or placeholder. Running in simulator mode.");
                    resolve(null);
                }
            })
            .catch(err => {
                console.warn("Firebase config is missing locally and API fetch failed (this is expected in local development if offline or API not running). Running in simulator mode:", err.message);
                resolve(null);
            });
    } else {
        console.warn("Firebase SDK not loaded. Running in simulator mode.");
        resolve(null);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 0. Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close mobile drawer when a link is clicked
        const navLinksList = navLinks.querySelectorAll('a');
        navLinksList.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Close mobile drawer when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

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
            const email = regForm.querySelector('#reg-email') ? regForm.querySelector('#reg-email').value : '';
            const gender = regForm.querySelector('#reg-gender') ? regForm.querySelector('#reg-gender').value : '';
            const subject = regForm.querySelector('#reg-subject') ? regForm.querySelector('#reg-subject').value : '';
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

            const submitRegistration = (database) => {
                if (database) {
                    database.collection("registrations").add({
                        name,
                        contact,
                        email,
                        gender,
                        subject,
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
                        const errorMsg = {
                            en: "Error submitting registration: ",
                            gu: "નોંધણી સબમિટ કરવામાં ભૂલ આવી: ",
                            hi: "पंजीकरण जमा करने में त्रुटि: "
                        };
                        const currentLang = localStorage.getItem('lang') || 'en';
                        alert((errorMsg[currentLang] || errorMsg['en']) + error.message);
                    });
                } else {
                    console.log("Firebase database not active. Saving registration locally (simulated).");
                    handleSuccess();
                }
            };

            if (window.firebaseDBPromise) {
                window.firebaseDBPromise.then(submitRegistration);
            } else {
                submitRegistration(db);
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

    // 5. Audio Control Logic using HTML5 Audio Element
    const audioToggle = document.getElementById('audio-toggle');
    const volOnIcon = document.querySelector('.volume-on');
    const volOffIcon = document.querySelector('.volume-off');
    
    let isPlaying = false;
    let audioPlayer = null;

    // Play/unmute audio on first user interaction if autoplay is blocked
    const autoPlayEvents = ['click', 'touchstart', 'keydown', 'mousedown'];
    function playOnInteraction() {
        if (audioPlayer && (!isPlaying || audioPlayer.muted)) {
            audioPlayer.muted = false;
            audioPlayer.play().then(() => {
                isPlaying = true;
                if (volOnIcon) volOnIcon.classList.remove('hidden');
                if (volOffIcon) volOffIcon.classList.add('hidden');
            }).catch(err => {
                console.log("Interaction play failed:", err.message);
            });
        }
        // Remove listeners after first interaction attempt
        autoPlayEvents.forEach(event => {
            window.removeEventListener(event, playOnInteraction);
        });
    }

    function initAudioPlayer() {
        if (audioPlayer) return;
        
        audioPlayer = document.getElementById('ambient-audio');
        if (!audioPlayer) return;
        
        audioPlayer.volume = 0.35;
        
        // Listen to audio play/pause events to keep state sync'd
        audioPlayer.addEventListener('play', () => {
            isPlaying = true;
            if (!audioPlayer.muted) {
                if (volOnIcon) volOnIcon.classList.remove('hidden');
                if (volOffIcon) volOffIcon.classList.add('hidden');
                
                // If it starts playing unmuted, clean up the interaction listeners
                autoPlayEvents.forEach(event => {
                    window.removeEventListener(event, playOnInteraction);
                });
            } else {
                if (volOnIcon) volOnIcon.classList.add('hidden');
                if (volOffIcon) volOffIcon.classList.remove('hidden');
            }
        });
        
        audioPlayer.addEventListener('pause', () => {
            isPlaying = false;
            if (volOnIcon) volOnIcon.classList.add('hidden');
            if (volOffIcon) volOffIcon.classList.remove('hidden');
        });
        
        // Try playing immediately (unmuted)
        playMusic();
        
        // Set up event listeners for interaction fallback
        autoPlayEvents.forEach(event => {
            window.addEventListener(event, playOnInteraction);
        });
    }
 
    function playMusic() {
        if (!audioPlayer) return;
        
        audioPlayer.muted = false;
        const playPromise = audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                if (volOnIcon) volOnIcon.classList.remove('hidden');
                if (volOffIcon) volOffIcon.classList.add('hidden');
            }).catch(err => {
                console.log("Autoplay unmuted blocked. Keeping paused until user interaction...", err.message);
                isPlaying = false;
                if (volOnIcon) volOnIcon.classList.add('hidden');
                if (volOffIcon) volOffIcon.classList.remove('hidden');
            });
        }
    }
 
    function pauseMusic() {
        if (!audioPlayer) return;
        audioPlayer.pause();
    }

    if (audioToggle) {
        audioToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent window click listener from immediately running
            if (!audioPlayer) return;
            if (isPlaying && !audioPlayer.muted) {
                pauseMusic();
            } else {
                audioPlayer.muted = false;
                playMusic();
            }
        });
    }

    // Initialize the player
    initAudioPlayer();

    // 6. Countdown Timer Logic
    const targetDate = new Date("Aug 16, 2026 16:30:00").getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference < 0) {
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    if (daysEl) {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // 7. Admin Dashboard and Secret Trigger
    const servicePillar = document.getElementById('service-pillar');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const closeAdminLogin = document.getElementById('close-admin-login');
    const adminLoginForm = document.getElementById('admin-login-form');
    const adminLoginError = document.getElementById('admin-login-error');
    
    const adminDashboardModal = document.getElementById('admin-dashboard-modal');
    const closeAdminDashboard = document.getElementById('close-admin-dashboard');
    const adminRoleBadge = document.getElementById('admin-role-badge');
    const adminRefreshBtn = document.getElementById('admin-refresh-btn');
    const adminDataContainer = document.getElementById('admin-data-container');
    
    let serviceClickCount = 0;
    let serviceClickTimer = null;
    let currentAdminRole = null; // 'view' or 'edit'
    let registrationsData = []; // Store active list
    let inlineEditingDocId = null; // Doc ID currently being edited inline
    
    if (servicePillar) {
        servicePillar.addEventListener('click', (e) => {
            serviceClickCount++;
            clearTimeout(serviceClickTimer);
            serviceClickTimer = setTimeout(() => {
                serviceClickCount = 0;
            }, 2000); // 2 seconds window to click 3 times
            
            if (serviceClickCount === 3) {
                serviceClickCount = 0;
                clearTimeout(serviceClickTimer);
                if (adminLoginModal) {
                    // Reset login form
                    if (adminLoginForm) adminLoginForm.reset();
                    if (adminLoginError) adminLoginError.style.display = 'none';
                    adminLoginModal.classList.add('active');
                }
            }
        });
    }
    
    // Close Modals
    if (closeAdminLogin) {
        closeAdminLogin.addEventListener('click', () => {
            adminLoginModal.classList.remove('active');
        });
    }
    if (closeAdminDashboard) {
        closeAdminDashboard.addEventListener('click', () => {
            adminDashboardModal.classList.remove('active');
        });
    }
    
    // Login Submission Handler
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('admin-username').value.trim();
            const password = document.getElementById('admin-password').value.trim();
            const submitBtn = adminLoginForm.querySelector('button[type="submit"]');
            
            if (adminLoginError) adminLoginError.style.display = 'none';
            
            // Check credentials locally first
            let matchedRole = null;
            if (username === 'mayur@admin.com' && password === 'harharmahadev') {
                matchedRole = 'view';
            } else if (username === 'mayuredit@admin.com' && password === 'edit.com') {
                matchedRole = 'edit';
            }
            
            if (!matchedRole) {
                if (adminLoginError) {
                    adminLoginError.innerText = "Invalid username or password.";
                    adminLoginError.style.display = 'block';
                }
                return;
            }
            
            currentAdminRole = matchedRole;
            
            // Attempt to authenticate with Firebase Auth to get the token for security rules
            const hasAuth = (window.firebase && typeof firebase.auth === 'function');
            
            if (hasAuth) {
                if (submitBtn) submitBtn.disabled = true;
                const origText = submitBtn.innerHTML;
                submitBtn.innerHTML = 'Authenticating...';
                
                firebase.auth().signInWithEmailAndPassword(username, password)
                    .then((userCredential) => {
                        console.log("Firebase Auth successful:", userCredential.user.email);
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = origText;
                        }
                        loginSuccess(false);
                    })
                    .catch((error) => {
                        console.warn("Firebase Auth failed (but local credentials matched):", error.code, error.message);
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = origText;
                        }
                        // We still allow them to enter the dashboard, in case they did not configure Auth but opened their database rules.
                        loginSuccess(true, error.message);
                    });
            } else {
                // If firebase auth is not active or loaded, proceed with local-only mode
                console.log("Firebase Auth SDK not active. Proceeding in local-only mode.");
                loginSuccess(true, "Firebase Auth SDK not active.");
            }
        });
    }
    
    let authFailedWarning = false;
    let authFailedErrorMsg = '';

    function loginSuccess(authFailed = false, errorMsg = '') {
        authFailedWarning = authFailed;
        authFailedErrorMsg = errorMsg;

        if (adminLoginModal) adminLoginModal.classList.remove('active');
        if (adminDashboardModal) adminDashboardModal.classList.add('active');
        
        if (adminRoleBadge) {
            const warningSuffix = authFailed ? ' (Local-Only)' : '';
            if (currentAdminRole === 'view') {
                adminRoleBadge.innerText = 'View Only Access' + warningSuffix;
                adminRoleBadge.style.backgroundColor = authFailed ? '#b37405' : '#614d3c';
            } else {
                adminRoleBadge.innerText = 'Edit Access' + warningSuffix;
                adminRoleBadge.style.backgroundColor = authFailed ? '#b37405' : '#118007';
            }
        }
        
        loadRegistrations();
    }
    
    if (adminRefreshBtn) {
        adminRefreshBtn.addEventListener('click', loadRegistrations);
    }
    
    function loadRegistrations() {
        if (adminDataContainer) {
            adminDataContainer.innerHTML = `
                <div style="text-align: center; padding: 30px; font-size: 1.2rem; color: var(--text-muted);">
                    Loading registrations...
                </div>
            `;
        }
        
        inlineEditingDocId = null;
        
        // Check if database is defined
        const activeDB = window.firebaseDB || db;
        if (activeDB) {
            activeDB.collection("registrations").orderBy("timestamp", "desc").get()
                .then((querySnapshot) => {
                    registrationsData = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        registrationsData.push({
                            id: doc.id,
                            name: data.name || '',
                            contact: data.contact || '',
                            gender: data.gender || '',
                            address: data.address || '',
                            subject: data.subject || '',
                            occupation: data.occupation || '',
                            dob: data.dob || ''
                        });
                    });
                    renderRegistrations();
                })
                .catch((error) => {
                    console.error("Error fetching registrations: ", error);
                    if (adminDataContainer) {
                        let helperHTML = '';
                        if (error.code === 'permission-denied' || error.message.toLowerCase().includes('permission')) {
                            helperHTML = `
                                <div style="margin-top: 20px; padding: 20px; background: rgba(225, 37, 37, 0.05); border: 1.5px solid rgba(225, 37, 37, 0.2); border-radius: 12px; font-size: 0.95rem; text-align: left; line-height: 1.6; color: #4a3a2d;">
                                    <h4 style="color: #e12525; margin-top: 0; font-family: 'Baloo Bhai 2', sans-serif; font-size: 1.25rem; display: flex; align-items: center; gap: 8px;">
                                        ⚠️ Configure Firestore Security Rules
                                    </h4>
                                    <p style="margin: 5px 0 15px 0;">To resolve this error and keep registration submissions open while securing the read/edit access, follow these steps:</p>
                                    <ol style="margin-bottom: 0; padding-left: 20px;">
                                        <li style="margin-bottom: 10px;"><strong>Enable Email/Password Sign-in</strong>:
                                            <br>Go to your <a href="https://console.firebase.google.com/" target="_blank" style="color: var(--saffron-bright); text-decoration: underline; font-weight: 700;">Firebase Console</a> &rarr; <strong>Build</strong> &rarr; <strong>Authentication</strong> &rarr; <strong>Sign-in method</strong>, and enable the <strong>Email/Password</strong> provider.
                                        </li>
                                        <li style="margin-bottom: 10px;"><strong>Create Admin Users</strong>:
                                            <br>Under the <strong>Users</strong> tab, click <strong>Add user</strong> to create these two accounts:
                                            <ul style="list-style-type: square; padding-left: 20px; margin: 5px 0;">
                                                <li>Email: <code>mayur@admin.com</code> (Password: <code>harharmahadev</code>)</li>
                                                <li>Email: <code>mayuredit@admin.com</code> (Password: <code>edit.com</code>)</li>
                                            </ul>
                                        </li>
                                        <li style="margin-bottom: 10px;"><strong>Apply Secure Firestore Rules</strong>:
                                            <br>Go to <strong>Firestore Database</strong> &rarr; <strong>Rules</strong>, and paste the following rules:
                                            <pre style="background: #fffcf8; padding: 12px; border-radius: 8px; font-family: monospace; overflow-x: auto; font-size: 0.85rem; margin: 10px 0; border: 1.5px solid rgba(230, 92, 0, 0.2); color: #111; line-height: 1.4;">rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /registrations/{document} {
      allow create: if true;
      allow read: if request.auth != null && (request.auth.token.email == 'mayur@admin.com' || request.auth.token.email == 'mayuredit@admin.com');
      allow update, delete: if request.auth != null && request.auth.token.email == 'mayuredit@admin.com';
    }
  }
}</pre>
                                        </li>
                                    </ol>
                                </div>
                            `;
                        }
                        
                        adminDataContainer.innerHTML = `
                            <div style="color: #e12525; padding: 15px; text-align:center; font-weight: 700; font-size: 1.1rem; border: 1px solid rgba(225,37,37,0.2); background: rgba(225,37,37,0.02); border-radius: 8px;">
                                Error loading data: ${error.message}
                            </div>
                            ${helperHTML}
                        `;
                    }
                });
        } else {
            console.log("Firebase database not active. Loading mock data.");
            // Load mock registrations from LocalStorage
            let mockData = JSON.parse(localStorage.getItem('mock_registrations'));
            if (!mockData) {
                mockData = [
                    { id: 'mock-1', name: 'Rohan Sharma', contact: '9876543210', gender: 'Male', address: '12, Gorwa Road, Vadodara' },
                    { id: 'mock-2', name: 'Priya Patel', contact: '8765432109', gender: 'Female', address: 'A-402, Samrajya Flat, Vadodara' },
                    { id: 'mock-3', name: 'Jayesh Amit', contact: '7654321098', gender: 'Male', address: 'Subhanpura, Vadodara' }
                ];
                localStorage.setItem('mock_registrations', JSON.stringify(mockData));
            }
            registrationsData = mockData;
            setTimeout(renderRegistrations, 400); // Simulate network delay
        }
    }
    
    function renderRegistrations() {
        if (!adminDataContainer) return;
        
        if (registrationsData.length === 0) {
            adminDataContainer.innerHTML = `<div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 1.1rem;">No registrations found.</div>`;
            return;
        }
        
        // 1. Build Desktop Table
        let tableHTML = `
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Mobile Number</th>
                        <th>Gender</th>
                        <th>Address</th>
                        ${currentAdminRole === 'edit' ? '<th>Actions</th>' : ''}
                    </tr>
                </thead>
                <tbody>
        `;
        
        // 2. Build Mobile Cards Container
        let cardsHTML = `<div class="admin-cards-container">`;
        
        registrationsData.forEach((reg) => {
            const isEditing = (reg.id === inlineEditingDocId);
            
            // Render Table Row
            tableHTML += `<tr id="row-${reg.id}">`;
            if (isEditing) {
                tableHTML += `
                    <td><input type="text" id="edit-name-${reg.id}" value="${escapeHtml(reg.name)}"></td>
                    <td><input type="tel" id="edit-contact-${reg.id}" value="${escapeHtml(reg.contact)}" pattern="[0-9]{10}"></td>
                    <td>
                        <select id="edit-gender-${reg.id}">
                            <option value="Male" ${reg.gender === 'Male' ? 'selected' : ''}>Male</option>
                            <option value="Female" ${reg.gender === 'Female' ? 'selected' : ''}>Female</option>
                            <option value="Other" ${reg.gender === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </td>
                    <td><input type="text" id="edit-address-${reg.id}" value="${escapeHtml(reg.address)}"></td>
                    <td>
                        <button class="admin-action-btn admin-save-btn" onclick="window.saveAdminEdit('${reg.id}')">Save</button>
                        <button class="admin-action-btn admin-cancel-btn" onclick="window.cancelAdminEdit()">Cancel</button>
                    </td>
                `;
            } else {
                tableHTML += `
                    <td><strong>${escapeHtml(reg.name)}</strong></td>
                    <td><a href="tel:${escapeHtml(reg.contact)}" class="admin-tel-link">📞 ${escapeHtml(reg.contact)}</a></td>
                    <td>${escapeHtml(reg.gender)}</td>
                    <td>${escapeHtml(reg.address)}</td>
                    ${currentAdminRole === 'edit' ? `
                        <td>
                            <button class="admin-action-btn admin-edit-btn" onclick="window.startAdminEdit('${reg.id}')">Edit</button>
                            <button class="admin-action-btn admin-delete-btn" onclick="window.deleteAdminRecord('${reg.id}')">Delete</button>
                        </td>
                    ` : ''}
                `;
            }
            tableHTML += `</tr>`;
            
            // Render Mobile Card
            cardsHTML += `
                <div class="admin-user-card" id="card-${reg.id}">
            `;
            if (isEditing) {
                cardsHTML += `
                    <div class="admin-card-row">
                        <span class="admin-card-label">Name</span>
                        <div class="admin-card-value"><input type="text" id="edit-name-mob-${reg.id}" value="${escapeHtml(reg.name)}"></div>
                    </div>
                    <div class="admin-card-row">
                        <span class="admin-card-label">Mobile Number</span>
                        <div class="admin-card-value"><input type="tel" id="edit-contact-mob-${reg.id}" value="${escapeHtml(reg.contact)}" pattern="[0-9]{10}"></div>
                    </div>
                    <div class="admin-card-row">
                        <span class="admin-card-label">Gender</span>
                        <div class="admin-card-value">
                            <select id="edit-gender-mob-${reg.id}">
                                <option value="Male" ${reg.gender === 'Male' ? 'selected' : ''}>Male</option>
                                <option value="Female" ${reg.gender === 'Female' ? 'selected' : ''}>Female</option>
                                <option value="Other" ${reg.gender === 'Other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                    </div>
                    <div class="admin-card-row">
                        <span class="admin-card-label">Address</span>
                        <div class="admin-card-value"><input type="text" id="edit-address-mob-${reg.id}" value="${escapeHtml(reg.address)}"></div>
                    </div>
                    <div class="admin-card-actions">
                        <button class="admin-action-btn admin-save-btn" onclick="window.saveAdminEdit('${reg.id}', true)">Save</button>
                        <button class="admin-action-btn admin-cancel-btn" onclick="window.cancelAdminEdit()">Cancel</button>
                    </div>
                `;
            } else {
                cardsHTML += `
                    <div class="admin-card-row">
                        <span class="admin-card-label">Name</span>
                        <div class="admin-card-value" style="font-weight: 700;">${escapeHtml(reg.name)}</div>
                    </div>
                    <div class="admin-card-row">
                        <span class="admin-card-label">Mobile Number</span>
                        <div class="admin-card-value">
                            <a href="tel:${escapeHtml(reg.contact)}" class="admin-tel-link">📞 ${escapeHtml(reg.contact)}</a>
                        </div>
                    </div>
                    <div class="admin-card-row">
                        <span class="admin-card-label">Gender</span>
                        <div class="admin-card-value">${escapeHtml(reg.gender)}</div>
                    </div>
                    <div class="admin-card-row">
                        <span class="admin-card-label">Address</span>
                        <div class="admin-card-value">${escapeHtml(reg.address)}</div>
                    </div>
                    ${currentAdminRole === 'edit' ? `
                        <div class="admin-card-actions">
                            <button class="admin-action-btn admin-edit-btn" onclick="window.startAdminEdit('${reg.id}')">Edit</button>
                            <button class="admin-action-btn admin-delete-btn" onclick="window.deleteAdminRecord('${reg.id}')">Delete</button>
                        </div>
                    ` : ''}
                `;
            }
            cardsHTML += `</div>`;
        });
        
        tableHTML += `</tbody></table>`;
        cardsHTML += `</div>`;
        
        adminDataContainer.innerHTML = tableHTML + cardsHTML;
    }
    
    // Bind window functions so they are callable from inline onclick attributes
    window.startAdminEdit = function(id) {
        inlineEditingDocId = id;
        renderRegistrations();
    };
    
    window.cancelAdminEdit = function() {
        inlineEditingDocId = null;
        renderRegistrations();
    };
    
    window.saveAdminEdit = function(id, isMobile = false) {
        const suffix = isMobile ? '-mob' : '';
        const newName = document.getElementById(`edit-name${suffix}-${id}`).value.trim();
        const newContact = document.getElementById(`edit-contact${suffix}-${id}`).value.trim();
        const newGender = document.getElementById(`edit-gender${suffix}-${id}`).value;
        const newAddress = document.getElementById(`edit-address${suffix}-${id}`).value.trim();
        
        if (!newName || !newContact || !newAddress) {
            alert("All fields are required.");
            return;
        }
        if (!/^[0-9]{10}$/.test(newContact)) {
            alert("Mobile Number must be exactly 10 digits.");
            return;
        }
        
        const activeDB = window.firebaseDB || db;
        if (activeDB) {
            activeDB.collection("registrations").doc(id).update({
                name: newName,
                contact: newContact,
                gender: newGender,
                address: newAddress
            })
            .then(() => {
                inlineEditingDocId = null;
                loadRegistrations();
            })
            .catch((error) => {
                console.error("Error updating record: ", error);
                alert("Failed to update record: " + error.message);
            });
        } else {
            // Update in mock mode
            const idx = registrationsData.findIndex(r => r.id === id);
            if (idx > -1) {
                registrationsData[idx].name = newName;
                registrationsData[idx].contact = newContact;
                registrationsData[idx].gender = newGender;
                registrationsData[idx].address = newAddress;
                localStorage.setItem('mock_registrations', JSON.stringify(registrationsData));
            }
            inlineEditingDocId = null;
            renderRegistrations();
        }
    };
    
    window.deleteAdminRecord = function(id) {
        const record = registrationsData.find(r => r.id === id);
        if (!record) return;
        
        if (confirm(`Are you sure you want to delete registration for "${record.name}"?`)) {
            const activeDB = window.firebaseDB || db;
            if (activeDB) {
                activeDB.collection("registrations").doc(id).delete()
                .then(() => {
                    loadRegistrations();
                })
                .catch((error) => {
                    console.error("Error deleting record: ", error);
                    alert("Failed to delete record: " + error.message);
                });
            } else {
                // Delete in mock mode
                registrationsData = registrationsData.filter(r => r.id !== id);
                localStorage.setItem('mock_registrations', JSON.stringify(registrationsData));
                renderRegistrations();
            }
        }
    };
    
    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
    }
    
    // Add close events for click-outside on admin modals
    window.addEventListener('click', (e) => {
        if (e.target === adminLoginModal) {
            adminLoginModal.classList.remove('active');
        }
        if (e.target === adminDashboardModal) {
            adminDashboardModal.classList.remove('active');
        }
    });
});
