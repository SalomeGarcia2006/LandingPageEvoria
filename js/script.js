// ============================================
// PARTICLES CONSTELLATION BACKGROUND
// ============================================

const canvas = document.getElementById('particles-canvas');

if (canvas) {

    const ctx = canvas.getContext('2d');

    let particles = [];
    let animationId;

    const mouse = {
        x: null,
        y: null,
        radius: 180
    };

    const config = {
        particleCount: 80,
        connectionDistance: 180,
        particleSpeed: 0.7,
        particleSize: 2.5
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

        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.addEventListener('mouseleave', () => {

        mouse.x = null;
        mouse.y = null;
    });

    class Particle {

        constructor() {

            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;

            this.vx = (Math.random() - 0.5) * config.particleSpeed;
            this.vy = (Math.random() - 0.5) * config.particleSpeed;

            this.size =
                Math.random() * config.particleSize + 1;
        }

        update() {

            this.x += this.vx;
            this.y += this.vy;

            if (
                this.x < 0 ||
                this.x > canvas.width
            ) {
                this.vx *= -1;
            }

            if (
                this.y < 0 ||
                this.y > canvas.height
            ) {
                this.vy *= -1;
            }

            if (mouse.x !== null) {

                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {

                    const angle =
                        Math.atan2(dy, dx);

                    const force =
                        (mouse.radius - distance) /
                        mouse.radius;

                    this.x +=
                        Math.cos(angle) *
                        force *
                        4;

                    this.y +=
                        Math.sin(angle) *
                        force *
                        4;
                }
            }
        }

        draw() {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.size,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = '#ffffff';

            ctx.shadowBlur = 10;
            ctx.shadowColor = '#ffffff';

            ctx.fill();
        }
    }

    function initParticles() {

        particles = [];

        for (
            let i = 0;
            i < config.particleCount;
            i++
        ) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {

        for (
            let i = 0;
            i < particles.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < particles.length;
                j++
            ) {

                const dx =
                    particles[i].x -
                    particles[j].x;

                const dy =
                    particles[i].y -
                    particles[j].y;

                const distance =
                    Math.sqrt(dx * dx + dy * dy);

                if (
                    distance <
                    config.connectionDistance
                ) {

                    const opacity =
                        1 -
                        distance /
                            config.connectionDistance;

                    let color =
                        `rgba(255,255,255,${
                            opacity * 0.2
                        })`;

                    if (mouse.x !== null) {

                        const mx =
                            (
                                particles[i].x +
                                particles[j].x
                            ) / 2;

                        const my =
                            (
                                particles[i].y +
                                particles[j].y
                            ) / 2;

                        const mouseDistance =
                            Math.sqrt(
                                (mx - mouse.x) ** 2 +
                                (my - mouse.y) ** 2
                            );

                        if (
                            mouseDistance < 200
                        ) {

                            color =
                                `rgba(255,255,255,${
                                    opacity
                                })`;
                        }
                    }

                    ctx.beginPath();

                    ctx.moveTo(
                        particles[i].x,
                        particles[i].y
                    );

                    ctx.lineTo(
                        particles[j].x,
                        particles[j].y
                    );

                    ctx.strokeStyle = color;
                    ctx.lineWidth = 1;

                    ctx.stroke();
                }
            }
        }
    }

    function animate() {

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        particles.forEach((particle) => {

            particle.update();
            particle.draw();
        });

        drawConnections();

        animationId =
            requestAnimationFrame(animate);
    }

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener(
        'resize',
        () => {

            resizeCanvas();
            initParticles();
        }
    );
}