import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext.jsx';

export const FantasyEnvironment = ({ mouseX = 0, mouseY = 0 }) => {
  const { theme } = useGame();
  const canvasRef = useRef(null);
  const isDivine = theme === 'divine';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Load background image
    const bgImg = new Image();
    bgImg.src = isDivine ? '/assets/divine_bg.jpg' : '/assets/shadow_bg.jpg';

    // Particle system for rising fire embers & magical ash (Section 16 & 19)
    const particleCount = 55;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.5 - Math.random() * 0.9,
        size: Math.random() * 2.5 + 0.8,
        alpha: Math.random() * 0.7 + 0.3,
        flickerSpeed: 0.02 + Math.random() * 0.04,
        flickerPhase: Math.random() * Math.PI * 2,
        type: Math.random() < 0.45 ? 'fire' : Math.random() < 0.75 ? 'magic' : 'ash'
      });
    }

    let startTime = null;

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, width, height);

      // Subtle parallax shift based on cursor
      const px = mouseX * 12;
      const py = mouseY * 8;

      // Draw high-res cinematic background image with coverage
      if (bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.save();
        // Slight scale to prevent edge revealing during parallax
        const scaleX = (width + 30) / bgImg.naturalWidth;
        const scaleY = (height + 30) / bgImg.naturalHeight;
        const scale = Math.max(scaleX, scaleY);
        const dw = bgImg.naturalWidth * scale;
        const dh = bgImg.naturalHeight * scale;
        const dx = (width - dw) / 2 + px * 0.5;
        const dy = (height - dh) / 2 + py * 0.5;

        ctx.drawImage(bgImg, dx, dy, dw, dh);
        ctx.restore();
      } else {
        // Fallback atmospheric gradient
        const fallbackGrad = ctx.createLinearGradient(0, 0, 0, height);
        if (isDivine) {
          fallbackGrad.addColorStop(0, '#fbf8ef');
          fallbackGrad.addColorStop(1, '#ece5d3');
        } else {
          fallbackGrad.addColorStop(0, '#06070a');
          fallbackGrad.addColorStop(1, '#11121e');
        }
        ctx.fillStyle = fallbackGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // Torches & Braziers Flickering Fire Glow Overlay (Section 15: ADD FIRE)
      const fireFlicker = Math.sin(elapsed * 0.008) * 0.06 + Math.cos(elapsed * 0.015) * 0.04;
      if (!isDivine) {
        // Left Brazier Glow
        const leftFire = ctx.createRadialGradient(width * 0.12, height * 0.65, 5, width * 0.12, height * 0.65, 140);
        leftFire.addColorStop(0, `rgba(255, 120, 30, ${0.35 + fireFlicker})`);
        leftFire.addColorStop(0.5, `rgba(224, 84, 30, ${0.15 + fireFlicker * 0.5})`);
        leftFire.addColorStop(1, 'transparent');
        ctx.fillStyle = leftFire;
        ctx.beginPath();
        ctx.arc(width * 0.12, height * 0.65, 140, 0, Math.PI * 2);
        ctx.fill();

        // Right Brazier Glow
        const rightFire = ctx.createRadialGradient(width * 0.88, height * 0.65, 5, width * 0.88, height * 0.65, 140);
        rightFire.addColorStop(0, `rgba(255, 120, 30, ${0.35 + fireFlicker})`);
        rightFire.addColorStop(0.5, `rgba(224, 84, 30, ${0.15 + fireFlicker * 0.5})`);
        rightFire.addColorStop(1, 'transparent');
        ctx.fillStyle = rightFire;
        ctx.beginPath();
        ctx.arc(width * 0.88, height * 0.65, 140, 0, Math.PI * 2);
        ctx.fill();
      }

      // Continuous Upward Rising Particles (Section 16: fire embers, violet dust, sparks)
      particles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx + Math.sin(elapsed * 0.002 + p.flickerPhase) * 0.3;

        // Reset when moving off screen top
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const flicker = Math.sin(elapsed * p.flickerSpeed + p.flickerPhase) * 0.25;
        const currentAlpha = Math.max(0.1, Math.min(1, p.alpha + flicker));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (isDivine) {
          // Divine particles: golden light, cyan motes, white sparks (Section 19)
          if (p.type === 'fire') {
            ctx.fillStyle = `rgba(255, 215, 0, ${currentAlpha * 0.8})`;
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 6;
          } else if (p.type === 'magic') {
            ctx.fillStyle = `rgba(111, 214, 240, ${currentAlpha * 0.9})`;
            ctx.shadowColor = '#6fd6f0';
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.6})`;
          }
        } else {
          // Shadow particles: orange fire embers, violet arcane dust, teal sparks (Section 16)
          if (p.type === 'fire') {
            ctx.fillStyle = `rgba(255, 140, 40, ${currentAlpha * 0.85})`;
            ctx.shadowColor = '#ff7700';
            ctx.shadowBlur = 8;
          } else if (p.type === 'magic') {
            ctx.fillStyle = `rgba(139, 108, 240, ${currentAlpha * 0.75})`;
            ctx.shadowColor = '#8b6cf0';
            ctx.shadowBlur = 7;
          } else {
            ctx.fillStyle = `rgba(53, 227, 160, ${currentAlpha * 0.65})`;
            ctx.shadowColor = '#35e3a0';
            ctx.shadowBlur = 6;
          }
        }

        ctx.fill();
        ctx.restore();
      });

      // Atmospheric Vignette & Mood Darkening
      const vig = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        Math.min(width, height) * 0.35,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.78
      );
      if (isDivine) {
        vig.addColorStop(0, 'rgba(255, 255, 255, 0)');
        vig.addColorStop(0.7, 'rgba(240, 230, 210, 0.25)');
        vig.addColorStop(1, 'rgba(80, 65, 40, 0.45)');
      } else {
        vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vig.addColorStop(0.65, 'rgba(8, 9, 15, 0.4)');
        vig.addColorStop(1, 'rgba(5, 6, 10, 0.82)');
      }
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, width, height);

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isDivine, mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};
