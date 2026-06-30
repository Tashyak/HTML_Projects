/**
 * 🍥 Naruto Journey - Interactive JavaScript Experience
 * Author: Antigravity Code Assistant
 * Will of Fire - 2026
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initMenuToggle();
    initScrollReveal();
    initTimelineProgress();
    initBackgroundCanvas();
    init3DTilt();
    initMagneticButtons();
    initJutsuParticles();
    initScrollToTop();
});

/* ==========================================================================
   1. Scroll Progress Indicator
   ========================================================================== */
function initScrollProgress() {
    const progressFill = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressFill.style.width = scrolled + '%';
    });
}

/* ==========================================================================
   2. Responsive Navigation Menu
   ========================================================================== */
function initMenuToggle() {
    const toggleBtn = document.querySelector('.btn-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navMenu) return;

    toggleBtn.addEventListener('click', () => {
        toggleBtn.classList.toggle('open');
        navMenu.classList.toggle('open');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleBtn.classList.remove('open');
            navMenu.classList.remove('open');

            // Set active class manually
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   3. Scroll Entrance Animations (Scroll Reveal)
   ========================================================================== */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal-fade-up, .reveal-slide-left, .reveal-slide-right');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it animates in, we can stop observing it
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   4. Journey Timeline Progress Line Filling
   ========================================================================== */
function initTimelineProgress() {
    const timeline = document.querySelector('.timeline-section');
    const progressFill = document.querySelector('.timeline-progress-fill');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (!timeline || !progressFill) return;

    // Define timeline images corresponding to milestones 1 to 8
    const timelineImages = [
        'assets/backgrounds/alone.jpg',                  // Milestone 1: Lonely Childhood
        'assets/backgrounds/team7.jpg',                  // Milestone 2: Team 7 Formation
        'assets/backgrounds/chunin_exams.jpg',            // Milestone 3: Chunin Exams
        'assets/backgrounds/Sasuke_retrieval.jpg',        // Milestone 4: Sasuke Retrieval
        'assets/backgrounds/Jiraiya_Training.jpg',        // Milestone 5: Jiraiya Training
        'assets/backgrounds/Pain_arc.jpg',                // Milestone 6: Pain Arc
        'assets/backgrounds/fourth_great_ninja_war.jpg',  // Milestone 7: Fourth Great Ninja War
        'assets/backgrounds/Hokage.jpg'                  // Milestone 8: Becoming Hokage
    ];

    // Create background crossfade container dynamically inside the timeline section
    const bgContainer = document.createElement('div');
    bgContainer.className = 'timeline-bg-container';
    
    const layer1 = document.createElement('div');
    layer1.className = 'timeline-bg-layer active';
    layer1.style.backgroundImage = `url('${timelineImages[0]}')`;
    
    const layer2 = document.createElement('div');
    layer2.className = 'timeline-bg-layer';
    
    bgContainer.appendChild(layer1);
    bgContainer.appendChild(layer2);
    timeline.insertBefore(bgContainer, timeline.firstChild);

    let activeLayer = layer1;
    let currentBgIndex = 0;

    function changeTimelineBg(imagePath) {
        const nextLayer = activeLayer === layer1 ? layer2 : layer1;
        const currentLayer = activeLayer;

        nextLayer.style.backgroundImage = `url('${imagePath}')`;
        nextLayer.classList.add('active');
        currentLayer.classList.remove('active');

        activeLayer = nextLayer;
    }

    window.addEventListener('scroll', () => {
        const rect = timeline.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Start filling when top of timeline enters middle of screen
        const startOffset = rect.top - (viewportHeight / 2);
        const totalHeight = rect.height;
        
        let progress = 0;
        
        if (startOffset < 0) {
            progress = Math.min(Math.abs(startOffset) / (totalHeight - viewportHeight / 2), 1);
        }
        
        progressFill.style.height = (progress * 100) + '%';

        let activeIndex = 0;

        // Activate dots when timeline fills past them and track current active node index
        timelineItems.forEach((item, index) => {
            const itemRect = item.getBoundingClientRect();
            if (itemRect.top < viewportHeight * 0.65) {
                item.classList.add('active-node');
                activeIndex = index;
            } else {
                item.classList.remove('active-node');
            }
        });

        // Trigger dynamic crossfade transition if active index changes
        if (activeIndex !== currentBgIndex) {
            currentBgIndex = activeIndex;
            changeTimelineBg(timelineImages[currentBgIndex]);
        }
    });
}

/* ==========================================================================
   5. Global Ambient Background Particles Canvas
   ========================================================================== */
function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 60;

    class AmbientParticle {
        constructor() {
            this.reset();
            // Start at random coordinates initially
            this.y = Math.random() * height;
        }

        reset() {
            this.x = Math.random() * width;
            this.size = Math.random() * 4 + 1;
            
            // Randomly pick particle type: 
            // 0 = Leaf (Orange/Green), 1 = Orange Chakra Ember, 2 = Blue Wind Sparkle
            this.type = Math.floor(Math.random() * 3);
            
            if (this.type === 0) {
                // Leaf: drifts down & sideways
                this.y = -20;
                this.speedY = Math.random() * 1.2 + 0.6;
                this.speedX = Math.random() * 1.5 - 0.75;
                this.color = Math.random() > 0.6 ? 'rgba(255, 122, 0, 0.45)' : 'rgba(52, 199, 89, 0.35)'; // Orange or Green leaf
                this.rotation = Math.random() * Math.PI;
                this.rotationSpeed = Math.random() * 0.02 - 0.01;
            } else if (this.type === 1) {
                // Chakra Ember: floats up
                this.y = height + 20;
                this.speedY = -(Math.random() * 1.5 + 0.8);
                this.speedX = Math.random() * 1 - 0.5;
                this.color = `rgba(255, 122, 0, ${Math.random() * 0.4 + 0.2})`;
            } else {
                // Blue Wind Sparkle: floats up and fast
                this.y = height + 20;
                this.speedY = -(Math.random() * 2 + 1.2);
                this.speedX = Math.random() * 2 - 1.0;
                this.color = `rgba(0, 210, 255, ${Math.random() * 0.3 + 0.15})`;
            }
            this.life = Math.random() * 200 + 100;
            this.maxLife = this.life;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life--;

            if (this.type === 0) {
                this.rotation += this.rotationSpeed;
                // Add sway
                this.speedX += Math.sin(this.y * 0.01) * 0.01;
            }

            if (this.life <= 0 || this.y < -30 || this.y > height + 30 || this.x < -30 || this.x > width + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            const opacity = this.life / this.maxLife;
            
            if (this.type === 0) {
                // Draw leaf path
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rotation);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size * 2, this.size * 0.8, 0, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Draw circular glow
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = this.size * 2;
                ctx.shadowColor = this.type === 1 ? 'rgba(255, 122, 0, 0.5)' : 'rgba(0, 210, 255, 0.5)';
                ctx.fill();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < maxParticles; i++) {
        particles.push(new AmbientParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   6. 3D Tilt Effect on Cards
   ========================================================================== */
function init3DTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    const maxTilt = 12; // Degrees of maximum rotation

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left; // Mouse position X relative to card
            const y = e.clientY - rect.top;  // Mouse position Y relative to card
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate tilt angle based on distance from center
            const tiltX = -((y - centerY) / centerY) * maxTilt;
            const tiltY = ((x - centerX) / centerX) * maxTilt;
            
            element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            
            // If card has a tail beast glow attribute, update its shadow dynamically
            const glowColor = element.getAttribute('data-beast-glow');
            if (glowColor) {
                // Project glow towards mouse position
                const shadowX = -((x - centerX) / centerX) * 15;
                const shadowY = -((y - centerY) / centerY) * 15;
                element.style.boxShadow = `${shadowX}px ${shadowY}px 35px ${glowColor}, 0 15px 35px rgba(0,0,0,0.6)`;
            }
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            
            const glowColor = element.getAttribute('data-beast-glow');
            if (glowColor) {
                element.style.boxShadow = `0 15px 35px rgba(0,0,0,0.6)`;
            }
        });
    });
}

/* ==========================================================================
   7. Magnetic Hover Effect for CTA/Hero Buttons
   ========================================================================== */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic');
    const speed = 0.25; // Speed of magnetic movement
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Pull the button towards mouse coordinate
            btn.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
}

/* ==========================================================================
   8. Interactive Jutsu Hover Canvas Particle Systems
   ========================================================================== */
function initJutsuParticles() {
    const jutsuCards = document.querySelectorAll('.jutsu-card');
    
    jutsuCards.forEach(card => {
        const canvas = card.querySelector('.jutsu-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const jutsuType = card.getAttribute('data-jutsu');
        
        let width = canvas.width = card.clientWidth;
        let height = canvas.height = card.clientHeight;
        
        let particles = [];
        let waterDragon = null; // Instantiated state for water dragon
        let earthWall = null;   // Instantiated state for earth mud wall
        let animationId = null;
        let mouseX = width / 2;
        let mouseY = height / 2;
        let angle = 0; // Utilized for rotation jutsu (Rasengan, Rasenshuriken)
        
        // Setup card resize behavior
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                width = canvas.width = entry.contentRect.width;
                height = canvas.height = entry.contentRect.height;
            }
        });
        resizeObserver.observe(card);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;

            particles = [];
            // Instantiate the water dragon if hovering the waterstyle card
            if (jutsuType === 'waterstyle') {
                waterDragon = new WaterDragon(mouseX, mouseY);
            }
            // Instantiate the earth mud wall if hovering the earthstyle card
            if (jutsuType === 'earthstyle') {
                earthWall = new EarthWall(width, height);
            }
            
            // Trigger animation loop
            if (animationId) cancelAnimationFrame(animationId);
            loop();
        });

        card.addEventListener('mouseleave', () => {
            // Smoothly cancel animation loop
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            waterDragon = null; // Clean up water dragon state
            earthWall = null;   // Clean up mud wall state
            // Clear canvas
            ctx.clearRect(0, 0, width, height);
        });

        // Particle Class for local canvas animations
        class JutsuParticle {
            constructor(x, y, color, sx, sy, size, life) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.sx = sx;
                this.sy = sy;
                this.size = size;
                this.life = life;
                this.maxLife = life;
                this.angle = Math.random() * Math.PI * 2;
                this.radius = Math.random() * 55 + 5;
                // Randomize orbit direction (clockwise or counter-clockwise for Rasengan turbulence)
                this.rotSpeed = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.05 + 0.08);
                // Custom variables
                this.bounceCount = 0;
                this.leafRotation = Math.random() * Math.PI * 2;
                this.leafRotSpeed = Math.random() * 0.06 - 0.03;
                this.earthType = Math.floor(Math.random() * 2); // 0 = rock block, 1 = dust particle
            }

            update(type) {
                this.life--;

                if (type === 'rasengan') {
                    // Complex multi-layered containment orbit swirling into mouse coordinate
                    this.angle += this.rotSpeed;
                    this.radius -= 0.45;
                    if (this.radius <= 2) {
                        this.radius = Math.random() * 60 + 15;
                        this.rotSpeed = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.05 + 0.08);
                    }
                    
                    // Add slight turbulent orbital sway (sine vibration)
                    const wobble = Math.sin(this.life * 0.15) * 2.5;
                    this.x = mouseX + Math.cos(this.angle) * (this.radius + wobble);
                    this.y = mouseY + Math.sin(this.angle) * (this.radius + wobble);
                } 
                else if (type === 'rasenshuriken') {
                    // Extremely fast blade spiral expanding outwards
                    this.angle += 0.22;
                    this.radius += 2.0;
                    this.x = mouseX + Math.cos(this.angle) * this.radius;
                    this.y = mouseY + Math.sin(this.angle) * this.radius;
                    // Shrink as they fly outwards to represent dispersing wind blades
                    this.size *= 0.97;
                }
                else if (type === 'shadowclone') {
                    // Soft clone smoke cloud expanding with air friction drag
                    this.x += this.sx;
                    this.y += this.sy;
                    this.sx *= 0.94;
                    this.sy *= 0.94;
                    this.size += 0.4; // Grow smoke puff size
                }
                else if (type === 'chidori') {
                    // Uncontrolled electricity - erratic rapid position jumps
                    this.x = mouseX + (Math.random() - 0.5) * 110;
                    this.y = mouseY + (Math.random() - 0.5) * 110;
                }
                else if (type === 'firestyle') {
                    // Rising flame embers with wave sways and thermal float acceleration
                    this.x += this.sx + Math.sin(this.life * 0.08) * 0.6;
                    this.y += this.sy;
                    this.sy -= 0.04; // Heat floating acceleration upward
                    this.size *= 0.95; // Shrink as they burn out
                }
                else if (type === 'waterstyle') {
                    // Splash droplets with physical gravity acceleration
                    this.sy += 0.18; // Heavy gravity
                    this.x += this.sx;
                    this.y += this.sy;
                    
                    // Bounce off the card bottom floor realistically
                    if (this.y > height - 12 && this.bounceCount < 2) {
                        this.y = height - 12;
                        this.sy = -this.sy * 0.45; // Absorb energy on bounce
                        this.sx *= 0.7;
                        this.bounceCount++;
                    }
                }
                else if (type === 'windstyle') {
                    // Swift wind drafts running sideways with leaf sways
                    this.x += this.sx;
                    this.y += this.sy + Math.sin(this.x * 0.035) * 1.2;
                    this.leafRotation += this.leafRotSpeed;
                }
                else if (type === 'earthstyle') {
                    // Rising and falling debris crumbling
                    this.sy += 0.22; // High gravity for heavy earth
                    this.x += this.sx;
                    this.y += this.sy;

                    // Bounce & shatter on ground impact
                    if (this.y > height - 15 && this.bounceCount < 1) {
                        this.y = height - 15;
                        this.sy = -this.sy * 0.25; // Low bounce height
                        this.sx = (Math.random() - 0.5) * 5; // Scatter debris
                        this.bounceCount++;
                    }
                }
                else if (type === 'lightningstyle') {
                    // Crackling thunder bolts
                    this.x += this.sx;
                    this.y += this.sy;
                }
            }

            draw(type) {
                const opacity = Math.max(0, this.life / this.maxLife);
                ctx.save();
                
                if (type === 'chidori' || type === 'lightningstyle') {
                    // Draw fractal jagged electric discharge vectors
                    ctx.globalCompositeOperation = 'screen';
                    ctx.beginPath();
                    ctx.moveTo(mouseX, mouseY);
                    
                    // Draw multi-segmented jagged path to targets
                    let currentX = mouseX;
                    let currentY = mouseY;
                    const segments = 4;
                    for (let i = 1; i <= segments; i++) {
                        const targetX = mouseX + (this.x - mouseX) * (i / segments);
                        const targetY = mouseY + (this.y - mouseY) * (i / segments);
                        const dev = (1 - (i / segments)) * 12; // Jagged deviation
                        
                        if (i === segments) {
                            ctx.lineTo(this.x, this.y);
                        } else {
                            currentX = targetX + (Math.random() - 0.5) * dev;
                            currentY = targetY + (Math.random() - 0.5) * dev;
                            ctx.lineTo(currentX, currentY);
                        }
                    }

                    ctx.strokeStyle = type === 'chidori' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)';
                    ctx.lineWidth = Math.random() * 2 + 1.2;
                    ctx.shadowBlur = 12;
                    ctx.shadowColor = type === 'chidori' ? 'rgba(0, 220, 255, 0.85)' : 'rgba(175, 82, 222, 0.85)';
                    ctx.stroke();

                    // Draw bright core sparks at vector endpoints
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, Math.random() * 3 + 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = '#ffffff';
                    ctx.fill();
                } 
                else if (type === 'shadowclone') {
                    // Soft realistic smoke cloud puff gradient
                    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                    grad.addColorStop(0, `rgba(230, 230, 235, ${opacity * 0.35})`);
                    grad.addColorStop(0.7, `rgba(180, 180, 185, ${opacity * 0.15})`);
                    grad.addColorStop(1, 'rgba(150, 150, 150, 0)');
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();
                }
                else if (type === 'firestyle') {
                    // Realistic flame core to tail color shifts (white-yellow-orange-red)
                    ctx.globalCompositeOperation = 'screen';
                    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                    grad.addColorStop(0, `rgba(255, 255, 255, ${opacity})`);
                    grad.addColorStop(0.2, `rgba(255, 220, 50, ${opacity * 0.95})`);
                    grad.addColorStop(0.6, `rgba(255, 90, 0, ${opacity * 0.7})`);
                    grad.addColorStop(1, 'rgba(230, 0, 0, 0)');
                    
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.shadowBlur = this.size;
                    ctx.shadowColor = 'rgba(255, 90, 0, 0.55)';
                    ctx.fill();
                }
                else if (type === 'waterstyle') {
                    // Fluid elongated droplets drawn in motion vector path
                    const angle = Math.atan2(this.sy, this.sx);
                    const speed = Math.sqrt(this.sx * this.sx + this.sy * this.sy);
                    const length = Math.max(1, speed * 1.5);
                    
                    ctx.translate(this.x, this.y);
                    ctx.rotate(angle);
                    
                    const grad = ctx.createLinearGradient(0, -this.size, 0, length);
                    grad.addColorStop(0, `rgba(255, 255, 255, ${opacity * 0.95})`);
                    grad.addColorStop(0.4, `rgba(0, 191, 255, ${opacity * 0.6})`);
                    grad.addColorStop(1, `rgba(0, 70, 220, ${opacity * 0.15})`);
                    
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.size, this.size + length, 0, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();
                }
                else if (type === 'windstyle') {
                    // Draw falling green leaf shapes with structural center lines
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.leafRotation);
                    
                    ctx.fillStyle = `rgba(52, 199, 89, ${opacity * 0.75})`;
                    ctx.strokeStyle = `rgba(30, 130, 50, ${opacity * 0.5})`;
                    ctx.lineWidth = 1;
                    
                    // Draw leaf outline
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size * 2);
                    ctx.quadraticCurveTo(this.size * 1.2, -this.size, 0, this.size * 2);
                    ctx.quadraticCurveTo(-this.size * 1.2, -this.size, 0, -this.size * 2);
                    ctx.fill();
                    ctx.stroke();

                    // Draw leaf center vein
                    ctx.beginPath();
                    ctx.moveTo(0, -this.size * 1.8);
                    ctx.lineTo(0, this.size * 1.8);
                    ctx.stroke();
                }
                else if (type === 'earthstyle') {
                    // Draw crumbled heavy stone fragments (rotating squares & polygons)
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.leafRotation); // Reuse rotation angle
                    
                    if (this.earthType === 0) {
                        // Rectangular debris chunk
                        ctx.fillStyle = `rgba(180, 150, 110, ${opacity * 0.8})`;
                        ctx.strokeStyle = `rgba(100, 80, 50, ${opacity * 0.5})`;
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.rect(-this.size/2, -this.size/2, this.size, this.size);
                        ctx.fill();
                        ctx.stroke();
                    } else {
                        // Fine dirt/dust particle
                        ctx.beginPath();
                        ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(139, 90, 43, ${opacity * 0.5})`;
                        ctx.fill();
                    }
                }
                else if (type === 'rasengan' || type === 'rasenshuriken') {
                    // High energy blue plasma bubbles
                    ctx.globalCompositeOperation = 'screen';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fillStyle = this.color;
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = this.color;
                    ctx.fill();
                }
                ctx.restore();
            }
        }

        // Water Dragon slithering follow trail class
        class WaterDragon {
            constructor(startX, startY) {
                this.segments = [];
                const length = 20; // Number of body segments
                for (let i = 0; i < length; i++) {
                    this.segments.push({ x: startX || 0, y: startY || 0 });
                }
                this.whiskersAngle = 0;
            }

            update(mx, my) {
                // Head tracks cursor position with magnetic delay
                const head = this.segments[0];
                head.x += (mx - head.x) * 0.14;
                head.y += (my - head.y) * 0.14;

                // Tail segments smoothly slither behind preceding segments
                for (let i = 1; i < this.segments.length; i++) {
                    const prev = this.segments[i - 1];
                    const curr = this.segments[i];
                    const dx = curr.x - prev.x;
                    const dy = curr.y - prev.y;
                    const angle = Math.atan2(dy, dx);
                    
                    // Maintain segment spacing
                    const targetDist = 9;
                    curr.x = prev.x + Math.cos(angle) * targetDist;
                    curr.y = prev.y + Math.sin(angle) * targetDist;
                    
                    // Animate side-to-side swimming oscillation wave
                    curr.y += Math.sin(Date.now() * 0.012 + i * 0.35) * 0.22;
                }
                
                this.whiskersAngle += 0.08;
            }

            draw(ctx) {
                ctx.save();
                ctx.globalCompositeOperation = 'source-over';
                
                // Draw body rings starting from tail so head prints on top
                for (let i = this.segments.length - 1; i > 0; i--) {
                    const curr = this.segments[i];
                    const prev = this.segments[i - 1];
                    
                    const progress = i / this.segments.length;
                    const size = (1 - progress) * 11 + 3;
                    
                    // Glowing radial water gradient
                    const grad = ctx.createRadialGradient(curr.x, curr.y, 0, curr.x, curr.y, size);
                    grad.addColorStop(0, 'rgba(230, 248, 255, 0.9)');
                    grad.addColorStop(0.3, 'rgba(0, 210, 255, 0.7)');
                    grad.addColorStop(0.8, 'rgba(0, 90, 220, 0.25)');
                    grad.addColorStop(1, 'rgba(0, 50, 180, 0)');
                    
                    ctx.beginPath();
                    ctx.arc(curr.x, curr.y, size, 0, Math.PI * 2);
                    ctx.fillStyle = grad;
                    ctx.fill();

                    // Draw spinal fin accents
                    if (i % 2 === 0) {
                        const angle = Math.atan2(curr.y - prev.y, curr.x - prev.x) + Math.PI / 2;
                        ctx.beginPath();
                        ctx.moveTo(curr.x, curr.y);
                        ctx.lineTo(curr.x + Math.cos(angle) * (size * 0.5), curr.y + Math.sin(angle) * (size * 0.5));
                        ctx.strokeStyle = 'rgba(0, 240, 255, 0.45)';
                        ctx.lineWidth = 1.8;
                        ctx.stroke();
                    }
                }
                
                // Head rotation math
                const head = this.segments[0];
                const next = this.segments[1];
                const angle = Math.atan2(head.y - next.y, head.x - next.x);
                
                ctx.translate(head.x, head.y);
                ctx.rotate(angle);
                
                // Draw glowing head sphere
                const headGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 15);
                headGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
                headGrad.addColorStop(0.5, 'rgba(0, 230, 255, 0.75)');
                headGrad.addColorStop(1, 'rgba(0, 80, 220, 0)');
                ctx.beginPath();
                ctx.arc(0, 0, 15, 0, Math.PI * 2);
                ctx.fillStyle = headGrad;
                ctx.fill();

                // Draw snout
                ctx.beginPath();
                ctx.ellipse(7, 0, 9, 6, 0, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 210, 255, 0.45)';
                ctx.fill();

                // Draw glowing eyes
                ctx.fillStyle = '#ffffff';
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#00f0ff';
                ctx.beginPath();
                ctx.arc(3, -5, 2.2, 0, Math.PI * 2);
                ctx.arc(3, 5, 2.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow

                // Draw horns
                ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(-3, -5);
                ctx.quadraticCurveTo(-12, -10, -16, -9);
                ctx.moveTo(-3, 5);
                ctx.quadraticCurveTo(-12, 10, -16, 9);
                ctx.stroke();

                // Draw animated whiskers
                ctx.strokeStyle = 'rgba(210, 245, 255, 0.75)';
                ctx.lineWidth = 1.2;
                const wave = Math.sin(this.whiskersAngle) * 2.5;
                ctx.beginPath();
                ctx.moveTo(12, -2);
                ctx.bezierCurveTo(20, -7 + wave, 24, -2 - wave, 30, -5);
                ctx.moveTo(12, 2);
                ctx.bezierCurveTo(20, 7 - wave, 24, 2 + wave, 30, 5);
                ctx.stroke();

                ctx.restore();
            }
        }

        // Earth Style mud wall summond class
        class EarthWall {
            constructor(canvasWidth, canvasHeight) {
                this.width = canvasWidth;
                this.height = canvasHeight;
                
                // Define 3 pillars: left, middle, right
                const pillarWidth = 48;
                const spacing = 6;
                const totalW = pillarWidth * 3 + spacing * 2;
                const startX = (this.width - totalW) / 2;
                
                this.pillars = [
                    {
                        x: startX,
                        w: pillarWidth,
                        h: 0,
                        targetH: 95,
                        delay: 8, // Left pillar rises third
                        cracks: this.generateCracks(startX, pillarWidth, 95)
                    },
                    {
                        x: startX + pillarWidth + spacing,
                        w: pillarWidth,
                        h: 0,
                        targetH: 115, // Middle is tallest
                        delay: 0, // Middle pillar rises first
                        cracks: this.generateCracks(startX + pillarWidth + spacing, pillarWidth, 115)
                    },
                    {
                        x: startX + (pillarWidth + spacing) * 2,
                        w: pillarWidth,
                        h: 0,
                        targetH: 95,
                        delay: 16, // Right pillar rises fourth (staggered)
                        cracks: this.generateCracks(startX + (pillarWidth + spacing) * 2, pillarWidth, 95)
                    }
                ];
                
                this.ticks = 0;
            }

            generateCracks(x, w, h) {
                const cracks = [];
                const count = Math.floor(Math.random() * 3) + 2;
                for (let i = 0; i < count; i++) {
                    const startY = Math.random() * (h - 20) + 10;
                    const points = [{ x: x + Math.random() * w, y: startY }];
                    const segments = Math.floor(Math.random() * 3) + 2;
                    let cx = points[0].x;
                    let cy = points[0].y;
                    for (let j = 0; j < segments; j++) {
                        cx += (Math.random() - 0.5) * 12;
                        cy += Math.random() * 15 + 5;
                        points.push({ x: cx, y: cy });
                    }
                    cracks.push(points);
                }
                return cracks;
            }

            update(particles) {
                this.ticks++;
                
                this.pillars.forEach(p => {
                    if (this.ticks > p.delay) {
                        const targetH = p.targetH;
                        const diff = targetH - p.h;
                        if (diff > 0.5) {
                            p.h += diff * 0.15; // Rise up smoothly
                            
                            // Emit dirt and dust particles at the bottom of the card
                            if (Math.random() > 0.35) {
                                const dustX = p.x + Math.random() * p.w;
                                particles.push(new JutsuParticle(
                                    dustX,
                                    this.height - 5,
                                    'rgba(139, 90, 43, opacity)',
                                    (Math.random() - 0.5) * 4,
                                    -(Math.random() * 2 + 1),
                                    Math.random() * 5 + 3,
                                    Math.random() * 25 + 15
                                ));
                            }
                        } else {
                            p.h = targetH;
                        }
                    }
                });
            }

            draw(ctx) {
                ctx.save();
                
                this.pillars.forEach(p => {
                    if (p.h <= 0) return;
                    
                    const topY = this.height - p.h;
                    
                    // Mud gradient styling
                    const grad = ctx.createLinearGradient(p.x, topY, p.x + p.w, this.height);
                    grad.addColorStop(0, '#8c704f'); // Clay highlight
                    grad.addColorStop(0.4, '#70573b'); // Medium soil mud
                    grad.addColorStop(1, '#40301f'); // Shadow dirt base
                    
                    ctx.fillStyle = grad;
                    ctx.strokeStyle = '#2b1f13';
                    ctx.lineWidth = 2;
                    
                    // Draw mud pillar
                    ctx.beginPath();
                    ctx.rect(p.x, topY, p.w, p.h);
                    ctx.fill();
                    ctx.stroke();

                    // Draw cracks
                    ctx.strokeStyle = 'rgba(43, 31, 19, 0.7)';
                    ctx.lineWidth = 1.2;
                    p.cracks.forEach(points => {
                        ctx.beginPath();
                        ctx.moveTo(points[0].x, topY + points[0].y);
                        for (let i = 1; i < points.length; i++) {
                            const pt = points[i];
                            if (pt.y < p.h) {
                                ctx.lineTo(pt.x, topY + pt.y);
                            }
                        }
                        ctx.stroke();
                    });

                    // Detail emblem (Kakashi's dog face representation) on middle pillar
                    if (p.targetH === 115 && p.h > 70) {
                        ctx.fillStyle = 'rgba(43, 31, 19, 0.3)';
                        const cx = p.x + p.w / 2;
                        const cy = topY + p.h / 2 - 10;
                        ctx.beginPath();
                        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                
                ctx.restore();
            }
        }

        function createSmokeBurst(x, y, count) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1.5;
                const sx = Math.cos(angle) * speed;
                const sy = Math.sin(angle) * speed - 0.8;
                const size = Math.random() * 14 + 6;
                const life = Math.random() * 35 + 25;
                particles.push(new JutsuParticle(x, y, '#ccc', sx, sy, size, life));
            }
        }

        function generateParticles() {
            // Generate continuous stream of particles
            if (jutsuType === 'rasengan') {
                if (particles.length < 80) {
                    const color = Math.random() > 0.45 ? 'rgba(0, 240, 255, 0.85)' : 'rgba(255, 255, 255, 0.95)';
                    particles.push(new JutsuParticle(mouseX, mouseY, color, 0, 0, Math.random() * 2.8 + 0.6, Math.random() * 45 + 20));
                }
            } 
            else if (jutsuType === 'rasenshuriken') {
                if (particles.length < 110) {
                    const color = Math.random() > 0.6 ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 230, 255, 0.85)';
                    particles.push(new JutsuParticle(mouseX, mouseY, color, 0, 0, Math.random() * 2.5 + 0.8, Math.random() * 35 + 15));
                }
            }
            else if (jutsuType === 'firestyle') {
                if (Math.random() > 0.15) {
                    const sx = (Math.random() - 0.5) * 3;
                    const sy = -(Math.random() * 2.0 + 0.5);
                    particles.push(new JutsuParticle(mouseX, mouseY + 25, 'rgba(255, 80, 0, opacity)', sx, sy, Math.random() * 6 + 4, Math.random() * 40 + 20));
                }
            }
            else if (jutsuType === 'waterstyle') {
                if (Math.random() > 0.1) {
                    const sx = (Math.random() - 0.5) * 6;
                    const sy = -(Math.random() * 4.5 + 2.5);
                    particles.push(new JutsuParticle(mouseX, mouseY, 'rgba(0, 180, 255, opacity)', sx, sy, Math.random() * 3.5 + 1.5, Math.random() * 50 + 25));
                }
            }
            else if (jutsuType === 'windstyle') {
                // Side-sweeping wind ribbon particles
                if (Math.random() > 0.25) {
                    const sx = -(Math.random() * 3.5 + 2.0);
                    const sy = (Math.random() - 0.5) * 1.8;
                    particles.push(new JutsuParticle(width + 10, Math.random() * height, 'rgba(144, 238, 144, opacity)', sx, sy, Math.random() * 4 + 2, Math.random() * 60 + 40));
                }
            }
            else if (jutsuType === 'earthstyle') {
                if (Math.random() > 0.3) {
                    const sx = (Math.random() - 0.5) * 4;
                    const sy = -(Math.random() * 3.0 + 1.0);
                    particles.push(new JutsuParticle(mouseX + (Math.random() - 0.5) * 50, mouseY - 10, 'rgba(210, 180, 140, opacity)', sx, sy, Math.random() * 7 + 3, Math.random() * 40 + 20));
                }
            }
            else if (jutsuType === 'chidori') {
                if (particles.length < 22) {
                    particles.push(new JutsuParticle(mouseX, mouseY, 'rgba(0, 240, 255, 0.95)', 0, 0, 0, Math.random() * 7 + 4));
                }
            }
            else if (jutsuType === 'lightningstyle') {
                if (particles.length < 25) {
                    const sx = (Math.random() - 0.5) * 10;
                    const sy = (Math.random() - 0.5) * 10;
                    particles.push(new JutsuParticle(mouseX, mouseY, 'rgba(175, 82, 222, 0.95)', sx, sy, 0, Math.random() * 8 + 4));
                }
            }
        }

        function loop() {
            ctx.clearRect(0, 0, width, height);
            
            generateParticles();

            // Render high-intensity background graphics
            if (jutsuType === 'rasengan') {
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                const grad = ctx.createRadialGradient(mouseX, mouseY, 2, mouseX, mouseY, 40);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
                grad.addColorStop(0.3, 'rgba(0, 240, 255, 0.65)');
                grad.addColorStop(0.6, 'rgba(0, 150, 255, 0.25)');
                grad.addColorStop(1, 'rgba(0, 210, 255, 0)');
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 40, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.shadowBlur = 25;
                ctx.shadowColor = 'rgba(0, 220, 255, 0.8)';
                ctx.fill();
                ctx.restore();
            }
            else if (jutsuType === 'rasenshuriken') {
                // Spin giant high-velocity wind blades in background
                angle += 0.12;
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                ctx.translate(mouseX, mouseY);
                ctx.rotate(angle);
                
                const grad = ctx.createRadialGradient(0, 0, 5, 0, 0, 65);
                grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
                grad.addColorStop(0.4, 'rgba(0, 240, 255, 0.35)');
                grad.addColorStop(0.8, 'rgba(0, 180, 255, 0.1)');
                grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
                ctx.fillStyle = grad;
                
                // Draw dynamic shuriken blade polygons
                ctx.beginPath();
                for (let i = 0; i < 4; i++) {
                    ctx.lineTo(0, -75);
                    ctx.quadraticCurveTo(20, -25, 25, 0);
                    ctx.rotate(Math.PI / 2);
                }
                ctx.closePath();
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'rgba(0, 240, 255, 0.55)';
                ctx.fill();
                ctx.restore();
            }
            else if (jutsuType === 'chidori') {
                // Draw explosive center flare for Chidori containment core
                ctx.save();
                ctx.globalCompositeOperation = 'screen';
                const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 25);
                grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
                grad.addColorStop(0.4, 'rgba(0, 230, 255, 0.7)');
                grad.addColorStop(1, 'rgba(0, 150, 255, 0)');
                ctx.beginPath();
                ctx.arc(mouseX, mouseY, 25, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.shadowBlur = 20;
                ctx.shadowColor = 'rgba(0, 220, 255, 0.85)';
                ctx.fill();
                ctx.restore();
            }
            else if (jutsuType === 'waterstyle' && waterDragon) {
                // Update and draw the slithering water dragon
                waterDragon.update(mouseX, mouseY);
                waterDragon.draw(ctx);
            }
            else if (jutsuType === 'earthstyle' && earthWall) {
                // Update and draw the rising mud wall
                earthWall.update(particles);
                earthWall.draw(ctx);
            }

            // Update and render each active particle
            particles.forEach((p, idx) => {
                p.update(jutsuType);
                p.draw(jutsuType);

                if (p.life <= 0) {
                    particles.splice(idx, 1);
                }
            });

            animationId = requestAnimationFrame(loop);
        }
    });
}

/* ==========================================================================
   9. Scroll Back to Top Action
   ========================================================================== */
function initScrollToTop() {
    const btn = document.getElementById('btn-explore-again');
    if (!btn) return;
    
    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
