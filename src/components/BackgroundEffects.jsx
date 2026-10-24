import React, { useEffect, forwardRef, useImperativeHandle, useRef } from 'react';
import { playPopSound, playRocketWhistle } from '../utils/audioSynthesizer';

const BackgroundEffects = forwardRef(({ soundEnabled }, ref) => {
  const ambientCanvasRef = useRef(null);
  const celebrationCanvasRef = useRef(null);
  const celebrationParticlesRef = useRef([]);

  useImperativeHandle(ref, () => ({
    launchFireworkVolley(count = 4) {
      const HUES = [185, 325, 45, 275, 150];
      const screenW = window.innerWidth;
      const targetYMin = window.innerHeight * 0.12;
      const targetYMax = window.innerHeight * 0.38;

      for (let i = 0; i < count; i++) {
        setTimeout(() => {
          const startX = screenW * (0.15 + (i / count) * 0.7 + (Math.random() - 0.5) * 0.12);
          const targetY = targetYMin + Math.random() * (targetYMax - targetYMin);
          const hue = HUES[Math.floor(Math.random() * HUES.length)];
          playRocketWhistle(soundEnabled);

          const rocket = {
            x: Math.max(30, Math.min(screenW - 30, startX)),
            y: window.innerHeight + 10,
            targetY,
            hue,
            vx: (Math.random() - 0.5) * 2.2,
            vy: -(Math.random() * 3.5 + 13.5),
            gravity: 0.17,
            trail: [],
            life: 1,
            update() {
              this.trail.push({ x: this.x, y: this.y, alpha: 1 });
              if (this.trail.length > 7) this.trail.shift();
              this.x += this.vx;
              this.y += this.vy;
              this.vy += this.gravity;
              if (this.y <= this.targetY || this.vy >= -0.5) {
                this.life = 0;
                playPopSound(soundEnabled);
                const numParticles = 60;
                for (let j = 0; j < numParticles; j++) {
                  const angle = Math.random() * Math.PI * 2;
                  const speed = Math.random() * 8.5 + 2.0;
                  celebrationParticlesRef.current.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    gravity: 0.11,
                    decay: Math.random() * 0.015 + 0.012,
                    life: 1,
                    size: Math.random() * 3.0 + 1.8,
                    color: `hsl(${this.hue + (Math.random() - 0.5) * 45}, 100%, ${Math.random() * 25 + 60}%)`,
                    trail: [],
                    update() {
                      this.trail.push({ x: this.x, y: this.y, alpha: this.life });
                      if (this.trail.length > 4) this.trail.shift();
                      this.x += this.vx;
                      this.y += this.vy;
                      this.vy += this.gravity;
                      this.vx *= 0.96;
                      this.vy *= 0.96;
                      this.life -= this.decay;
                    },
                    draw(ctx) {
                      if (this.life <= 0) return;
                      ctx.save();
                      ctx.globalAlpha = Math.max(0, this.life);
                      ctx.fillStyle = this.color;
                      ctx.shadowColor = this.color;
                      ctx.shadowBlur = 8;
                      ctx.beginPath();
                      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                      ctx.fill();
                      ctx.restore();
                    }
                  });
                }
              }
            },
            draw(ctx) {
              if (this.life <= 0) return;
              ctx.save();
              ctx.strokeStyle = `hsl(${this.hue}, 100%, 75%)`;
              ctx.lineWidth = 2.5;
              ctx.shadowColor = `hsl(${this.hue}, 100%, 65%)`;
              ctx.shadowBlur = 10;
              ctx.beginPath();
              this.trail.forEach((t, idx) => {
                if (idx === 0) ctx.moveTo(t.x, t.y);
                else ctx.lineTo(t.x, t.y);
              });
              ctx.stroke();
              ctx.restore();
            }
          };

          celebrationParticlesRef.current.push(rocket);
        }, i * 220);
      }
    },

    launchConfetti(originX, originY, count = 50) {
      const colors = ['#00f0ff', '#ff007f', '#ffe600', '#7928ca', '#ffffff', '#38bdf8'];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 6;
        celebrationParticlesRef.current.push({
          x: originX,
          y: originY,
          size: Math.random() * 9 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          shape: Math.random() > 0.4 ? 'rect' : 'circle',
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 5,
          gravity: 0.28,
          rotation: Math.random() * 360,
          rotSpeed: (Math.random() - 0.5) * 14,
          decay: Math.random() * 0.008 + 0.008,
          life: 1,
          update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.vx *= 0.985;
            this.rotation += this.rotSpeed;
            this.life -= this.decay;
          },
          draw(ctx) {
            if (this.life <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.fillStyle = this.color;
            if (this.shape === 'rect') {
              ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            } else {
              ctx.beginPath();
              ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.restore();
          }
        });
      }
    },

    launchHeartsShower(startX, startY) {
      const hearts = ['💖', '❤️', '✨', '💕', '🥰', '💫'];
      for (let i = 0; i < 16; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 3;
        celebrationParticlesRef.current.push({
          x: startX,
          y: startY,
          emoji: hearts[Math.floor(Math.random() * hearts.length)],
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 4,
          decay: 0.018,
          life: 1,
          size: Math.floor(Math.random() * 10) + 18,
          update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.12;
            this.life -= this.decay;
          },
          draw(ctx) {
            if (this.life <= 0) return;
            ctx.save();
            ctx.font = `${this.size}px sans-serif`;
            ctx.globalAlpha = Math.max(0, this.life);
            ctx.fillText(this.emoji, this.x, this.y);
            ctx.restore();
          }
        });
      }
    }
  }));

  useEffect(() => {
    const ambientCanvas = ambientCanvasRef.current;
    const celebrationCanvas = celebrationCanvasRef.current;
    if (!ambientCanvas || !celebrationCanvas) return;

    const ambientCtx = ambientCanvas.getContext('2d');
    const celebrationCtx = celebrationCanvas.getContext('2d');

    const handleResize = () => {
      ambientCanvas.width = window.innerWidth;
      ambientCanvas.height = window.innerHeight;
      celebrationCanvas.width = window.innerWidth;
      celebrationCanvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const ambientParticles = [];
    for (let i = 0; i < 65; i++) {
      ambientParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.35 - 0.1,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        hue: Math.random() > 0.5 ? 185 : 325
      });
    }

    let animId;
    const render = () => {
      ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
      ambientParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * 0.002) * p.pulseSpeed;
        if (p.y < -10) { p.y = ambientCanvas.height + 10; p.x = Math.random() * ambientCanvas.width; }
        if (p.x < -10) p.x = ambientCanvas.width + 10;
        if (p.x > ambientCanvas.width + 10) p.x = -10;

        ambientCtx.save();
        ambientCtx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${Math.max(0.1, Math.min(0.9, p.alpha))})`;
        ambientCtx.shadowColor = `hsl(${p.hue}, 100%, 70%)`;
        ambientCtx.shadowBlur = p.size * 3;
        ambientCtx.beginPath();
        ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ambientCtx.fill();
        ambientCtx.restore();
      });

      celebrationCtx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);
      const particles = celebrationParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.update();
        pt.draw(celebrationCtx);
        if (pt.life <= 0) particles.splice(i, 1);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas ref={ambientCanvasRef} className="ambient-canvas" />
      <canvas ref={celebrationCanvasRef} className="celebration-canvas" />
    </>
  );
});

export default BackgroundEffects;
