// ============================================
// PARTICLES WITH MOUSE INTERACTION
// ============================================

(function() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let mouseX = null;
    let mouseY = null;
    let mouseRadius = 150;
    let isMouseOnCanvas = false;

    const config = {
        count: 100,
        connectionDistance: 160,
        speed: 0.4,
        size: 2.5,
        glowIntensity: 0.3
    };

    function resizeCanvas() {
        const hero = document.querySelector('.hero');
        if (hero) {
            canvas.width = hero.offsetWidth;
            canvas.height = hero.offsetHeight;
        }
    }

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        isMouseOnCanvas = true;
    });

    canvas.addEventListener('mouseleave', () => {
        mouseX = null;
        mouseY = null;
        isMouseOnCanvas = false;
    });

    canvas.addEventListener('mouseenter', () => {
        isMouseOnCanvas = true;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * config.speed;
            this.vy = (Math.random() - 0.5) * config.speed;
            this.size = Math.random() * config.size + 1;
            this.baseSize = this.size;
            this.glow = 0;
            this.opacity = 0.3 + Math.random() * 0.4;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouseX !== null && mouseY !== null && isMouseOnCanvas) {
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseRadius) {
                    const force = (mouseRadius - distance) / mouseRadius;
                    const angle = Math.atan2(dy, dx);
                    const push = force * 4;
                    
                    this.x += Math.cos(angle) * push;
                    this.y += Math.sin(angle) * push;
                    
                    this.size = this.baseSize + force * 5;
                    this.glow = force;
                } else {
                    this.size += (this.baseSize - this.size) * 0.05;
                    this.glow *= 0.95;
                }
            } else {
                this.size += (this.baseSize - this.size) * 0.05;
                this.glow *= 0.95;
            }
        }

        draw() {
            ctx.save();
            
            if (this.glow > 0.1) {
                ctx.shadowColor = `rgba(255, 255, 255, ${this.glow * 0.6})`;
                ctx.shadowBlur = 25 * this.glow;
            }
            
            const alpha = this.opacity + this.glow * 0.4;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            if (this.glow > 0.1) {
                const gradient = ctx.createRadialGradient(
                    this.x - this.size * 0.3, 
                    this.y - this.size * 0.3, 
                    0,
                    this.x, 
                    this.y, 
                    this.size
                );
                gradient.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
                gradient.addColorStop(0.5, `rgba(200, 220, 255, ${alpha * 0.7})`);
                gradient.addColorStop(1, `rgba(150, 200, 255, ${alpha * 0.3})`);
                ctx.fillStyle = gradient;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.6})`;
            }
            
            ctx.fill();
            ctx.restore();
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.connectionDistance) {
                    let alpha = 1 - (distance / config.connectionDistance);
                    
                    let glowMultiplier = 1;
                    if (mouseX !== null && mouseY !== null && isMouseOnCanvas) {
                        const midX = (particles[i].x + particles[j].x) / 2;
                        const midY = (particles[i].y + particles[j].y) / 2;
                        const mouseDist = Math.sqrt(
                            (midX - mouseX) ** 2 + 
                            (midY - mouseY) ** 2
                        );
                        if (mouseDist < mouseRadius) {
                            glowMultiplier = 1 + (1 - mouseDist / mouseRadius) * 2;
                            alpha = Math.min(alpha * glowMultiplier, 1);
                        }
                    }
                    
                    const baseAlpha = alpha * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    
                    ctx.strokeStyle = `rgba(255, 255, 255, ${baseAlpha})`;
                    ctx.lineWidth = 0.5 + alpha * 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < config.count; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    window.addEventListener('beforeunload', () => {
        if (animationId) cancelAnimationFrame(animationId);
    });
})();

// ============================================
// NAV TOGGLE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggle && navLinks) {
        toggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});