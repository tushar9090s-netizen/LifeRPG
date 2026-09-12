import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext';

/**
 * StageEffects — Cinematic canvas overlay for the central hero & dragon stage.
 * Adds live breathing atmospheric particles:
 * - Mana sparks rising from the circular rune pedestal
 * - Dragon eye glow pulsation
 * - Soft magical aura around the hero
 */
export const StageEffects = () => {
  const canvasRef = useRef(null);
  const { theme } = useGame();
  const isShadow = theme === 'shadow';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Particle pool for pedestal sparks
    const particles = Array.from({ length: 35 }, () => ({
      x: 0.5 + (Math.random() - 0.5) * 0.35, // relative to width (around center)
      y: 0.72 + Math.random() * 0.15,         // relative to height (around platform)
      speedY: 0.0008 + Math.random() * 0.0016,
      speedX: (Math.random() - 0.5) * 0.0005,
      size: 1.2 + Math.random() * 2.2,
      opacity: 0.2 + Math.random() * 0.7,
      pulse: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      time += 0.02;
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) {
        rafId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, W, H);

      // ── 1. Pedestal Rotating Rune Glow Pool ──────────────────────
      const pedX = W * 0.5;
      const pedY = H * 0.73;
      const pedR = Math.min(W * 0.22, 140);

      const glowGrad = ctx.createRadialGradient(pedX, pedY, 5, pedX, pedY, pedR);
      if (isShadow) {
        glowGrad.addColorStop(0, `rgba(139, 108, 240, ${0.16 + Math.sin(time * 0.8) * 0.05})`);
        glowGrad.addColorStop(0.5, `rgba(53, 227, 160, ${0.08 + Math.cos(time * 0.9) * 0.03})`);
        glowGrad.addColorStop(1, 'transparent');
      } else {
        glowGrad.addColorStop(0, `rgba(224, 182, 74, ${0.18 + Math.sin(time * 0.8) * 0.05})`);
        glowGrad.addColorStop(0.6, `rgba(111, 214, 240, ${0.09 + Math.cos(time * 0.9) * 0.03})`);
        glowGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(pedX, pedY, pedR, pedR * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. Dragon Eye Pulsing Aura ─────────────────────────────
      // Dragon head is in the upper right/center area
      const eyeX = W * (isShadow ? 0.68 : 0.72);
      const eyeY = H * (isShadow ? 0.22 : 0.21);
      const eyePulse = 0.5 + Math.sin(time * 1.5) * 0.45;

      const eyeGrad = ctx.createRadialGradient(eyeX, eyeY, 0, eyeX, eyeY, 28);
      if (isShadow) {
        eyeGrad.addColorStop(0, `rgba(53, 227, 160, ${0.45 * eyePulse})`);
        eyeGrad.addColorStop(0.5, `rgba(53, 227, 160, ${0.15 * eyePulse})`);
        eyeGrad.addColorStop(1, 'transparent');
      } else {
        eyeGrad.addColorStop(0, `rgba(111, 214, 240, ${0.5 * eyePulse})`);
        eyeGrad.addColorStop(0.5, `rgba(111, 214, 240, ${0.2 * eyePulse})`);
        eyeGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = eyeGrad;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 28, 0, Math.PI * 2);
      ctx.fill();

      // ── 3. Rising Mana Sparks ──────────────────────────────────
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.pulse += 0.04;

        // Reset if floated above chest level
        if (p.y < 0.35) {
          p.y = 0.74 + Math.random() * 0.06;
          p.x = 0.5 + (Math.random() - 0.5) * 0.35;
        }

        const alpha = Math.max(0, Math.sin(p.pulse)) * p.opacity;
        const px = p.x * W;
        const py = p.y * H;

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        if (isShadow) {
          ctx.fillStyle = `rgba(139, 108, 240, ${alpha})`;
          ctx.shadowColor = '#8b6cf0';
        } else {
          ctx.fillStyle = `rgba(224, 182, 74, ${alpha})`;
          ctx.shadowColor = '#e0b64a';
        }
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  );
};

