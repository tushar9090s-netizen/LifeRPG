import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext';

/**
 * AtmosphereCanvas — Cinematic live ambient layer.
 * Adds slow, floating magical mana motes, subtle mist drift,
 * and pulsating eye glow over the central hero & dragon scene.
 */
export const AtmosphereCanvas = () => {
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

    // Floating mana embers pool
    const particles = Array.from({ length: 30 }, () => ({
      x: 0.35 + Math.random() * 0.3, // Centered around the character
      y: 0.65 + Math.random() * 0.25, // Starting around platform/torso
      speedY: 0.0006 + Math.random() * 0.0012,
      speedX: (Math.random() - 0.5) * 0.0004,
      size: 1.2 + Math.random() * 2.2,
      opacity: 0.2 + Math.random() * 0.6,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      time += 0.016;
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) {
        rafId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, W, H);

      // ── 1. Pulsing Dragon Eye Glow ─────────────────────────────
      // Dragon head is located in the upper-right center of the composition
      const eyeX = W * (isShadow ? 0.63 : 0.66);
      const eyeY = H * (isShadow ? 0.21 : 0.23);
      const eyePulse = 0.55 + Math.sin(time * 1.8) * 0.35;

      const eyeGrad = ctx.createRadialGradient(eyeX, eyeY, 0, eyeX, eyeY, 24);
      if (isShadow) {
        eyeGrad.addColorStop(0, `rgba(53, 227, 160, ${0.4 * eyePulse})`);
        eyeGrad.addColorStop(0.6, `rgba(53, 227, 160, ${0.12 * eyePulse})`);
        eyeGrad.addColorStop(1, 'transparent');
      } else {
        eyeGrad.addColorStop(0, `rgba(111, 214, 240, ${0.45 * eyePulse})`);
        eyeGrad.addColorStop(0.6, `rgba(111, 214, 240, ${0.15 * eyePulse})`);
        eyeGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = eyeGrad;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 24, 0, Math.PI * 2);
      ctx.fill();

      // ── 2. Platform Rune Energy Pulse ──────────────────────────
      const platX = W * 0.5;
      const platY = H * 0.82;
      const platPulse = 0.14 + Math.sin(time * 1.2) * 0.04;

      const platGrad = ctx.createRadialGradient(platX, platY, 10, platX, platY, Math.min(W * 0.25, 180));
      if (isShadow) {
        platGrad.addColorStop(0, `rgba(139, 108, 240, ${platPulse})`);
        platGrad.addColorStop(0.6, `rgba(53, 227, 160, ${platPulse * 0.5})`);
        platGrad.addColorStop(1, 'transparent');
      } else {
        platGrad.addColorStop(0, `rgba(224, 182, 74, ${platPulse * 1.2})`);
        platGrad.addColorStop(0.6, `rgba(111, 214, 240, ${platPulse * 0.6})`);
        platGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = platGrad;
      ctx.beginPath();
      ctx.ellipse(platX, platY, Math.min(W * 0.25, 180), 45, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── 3. Rising Mana Embers ──────────────────────────────────
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.phase += 0.03;

        // Reset when floating past shoulder level
        if (p.y < 0.32) {
          p.y = 0.82 + Math.random() * 0.06;
          p.x = 0.35 + Math.random() * 0.3;
        }

        const alpha = Math.max(0, Math.sin(p.phase)) * p.opacity;
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
        ctx.shadowBlur = 6;
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
        zIndex: 2,
      }}
    />
  );
};

