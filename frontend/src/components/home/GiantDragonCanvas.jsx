import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext';

/**
 * GiantDragonCanvas — Massive mythical serpentine dragon framing the upper sky.
 * Pure procedural Canvas rendering:
 * - Massive serpentine body (60-80px thick) curving across the upper atmosphere
 * - Shimmering obsidian-black scales with glowing emerald dorsal spine ridges
 * - Detailed horned dragon head facing forward/downward with glowing slit eyes & breath mist
 * - Divine Mode: Celestial white/gold serpent with cyan glowing eyes & gold horns
 */
export const GiantDragonCanvas = () => {
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

    const render = () => {
      time += 0.012;
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) {
        rafId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, W, H);

      // Subtle breathing undulation
      const breath = Math.sin(time) * 6;
      const breathSlow = Math.cos(time * 0.7) * 4;

      // ── 1. Serpentine Body Spine Keypoints ─────────────────────────
      // Spanning from left midground, looping over the sky, and reaching the head on the right
      const p0 = { x: W * 0.08, y: H * 0.85 };
      const p1 = { x: W * 0.12, y: H * 0.48 + breathSlow };
      const p2 = { x: W * 0.28, y: H * 0.18 + breath };
      const p3 = { x: W * 0.52, y: H * 0.12 - breathSlow };
      const p4 = { x: W * 0.72, y: H * 0.24 + breath * 0.5 }; // Head location

      // Sample spline points
      const numSteps = 70;
      const bodyPoints = [];

      for (let i = 0; i <= numSteps; i++) {
        const t = i / numSteps;
        // Cubic Bézier combination
        const invT = 1 - t;
        const x =
          invT * invT * invT * invT * p0.x +
          4 * invT * invT * invT * t * p1.x +
          6 * invT * invT * t * t * p2.x +
          4 * invT * t * t * t * p3.x +
          t * t * t * t * p4.x;
        const y =
          invT * invT * invT * invT * p0.y +
          4 * invT * invT * invT * t * p1.y +
          6 * invT * invT * t * t * p2.y +
          4 * invT * t * t * t * p3.y +
          t * t * t * t * p4.y;

        // Thickness tapers from 25px at tail to 65px at mid-body and 50px near neck
        const thickness = 28 + Math.sin(t * Math.PI) * 42;
        bodyPoints.push({ x, y, thickness, t });
      }

      // ── 2. Draw Body Atmosphere Aura / Backlight ───────────────────
      ctx.save();
      ctx.beginPath();
      bodyPoints.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.lineWidth = 110;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = isShadow ? 'rgba(53, 227, 160, 0.06)' : 'rgba(111, 214, 240, 0.09)';
      ctx.shadowColor = isShadow ? '#35e3a0' : '#6fd6f0';
      ctx.shadowBlur = 40;
      ctx.stroke();
      ctx.restore();

      // ── 3. Draw Body Segments (Layered Scales) ─────────────────────
      for (let i = 0; i < bodyPoints.length - 1; i++) {
        const pA = bodyPoints[i];
        const pB = bodyPoints[i + 1];

        // Normal vector for body width
        const dx = pB.x - pA.x;
        const dy = pB.y - pA.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const hwA = pA.thickness * 0.5;
        const hwB = pB.thickness * 0.5;

        // Base Scale Body
        ctx.beginPath();
        ctx.moveTo(pA.x - nx * hwA, pA.y - ny * hwA);
        ctx.lineTo(pB.x - nx * hwB, pB.y - ny * hwB);
        ctx.lineTo(pB.x + nx * hwB, pB.y + ny * hwB);
        ctx.lineTo(pA.x + nx * hwA, pA.y + ny * hwA);
        ctx.closePath();

        if (isShadow) {
          // Obsidian scale color gradient
          const grad = ctx.createLinearGradient(
            pA.x - nx * hwA,
            pA.y - ny * hwA,
            pA.x + nx * hwA,
            pA.y + ny * hwA
          );
          grad.addColorStop(0, '#04060b');
          grad.addColorStop(0.5, '#0b0f1a');
          grad.addColorStop(1, '#020306');
          ctx.fillStyle = grad;
        } else {
          // Celestial pearl & ivory scales
          const grad = ctx.createLinearGradient(
            pA.x - nx * hwA,
            pA.y - ny * hwA,
            pA.x + nx * hwA,
            pA.y + ny * hwA
          );
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.5, '#eae2cf');
          grad.addColorStop(1, '#d8c7a2');
          ctx.fillStyle = grad;
        }
        ctx.fill();

        // Subtle scale edge stroke
        ctx.strokeStyle = isShadow ? 'rgba(58, 62, 102, 0.4)' : 'rgba(216, 202, 160, 0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // ── 4. Dorsal Spine Ridges (along the back) ───────────────────
        if (i % 2 === 0 && i > 5 && i < bodyPoints.length - 4) {
          const spineH = 14 + Math.sin(pA.t * Math.PI) * 18;
          const sx = pA.x - nx * (hwA + spineH);
          const sy = pA.y - ny * (hwA + spineH);

          ctx.beginPath();
          ctx.moveTo(pA.x - nx * hwA * 0.8, pA.y - ny * hwA * 0.8);
          ctx.lineTo(sx, sy);
          ctx.lineTo(pB.x - nx * hwB * 0.8, pB.y - ny * hwB * 0.8);
          ctx.closePath();

          ctx.fillStyle = isShadow ? '#060912' : '#f5edd8';
          ctx.fill();

          // Spine glowing ridge
          ctx.strokeStyle = isShadow ? 'rgba(53, 227, 160, 0.65)' : 'rgba(224, 182, 74, 0.75)';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = isShadow ? '#35e3a0' : '#e0b64a';
          ctx.shadowBlur = 8;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      }

      // ── 5. Detailed Dragon Head ────────────────────────────────────
      const head = p4;
      const prev = bodyPoints[bodyPoints.length - 3] || p3;
      const headAngle = Math.atan2(head.y - prev.y, head.x - prev.x);

      ctx.save();
      ctx.translate(head.x, head.y);
      ctx.rotate(headAngle);

      // Skull Geometry
      ctx.beginPath();
      ctx.moveTo(42, 4);    // Snout tip
      ctx.lineTo(24, -16);  // Upper jaw
      ctx.lineTo(0, -26);   // Forehead
      ctx.lineTo(-24, -32); // Horn base 1
      ctx.lineTo(-48, -22); // Skull back
      ctx.lineTo(-52, 14);  // Jaw base
      ctx.lineTo(-20, 24);  // Lower jaw
      ctx.lineTo(20, 16);   // Lower chin
      ctx.closePath();

      if (isShadow) {
        const headGrad = ctx.createLinearGradient(-48, -32, 42, 24);
        headGrad.addColorStop(0, '#04050a');
        headGrad.addColorStop(0.5, '#0d1222');
        headGrad.addColorStop(1, '#060914');
        ctx.fillStyle = headGrad;
      } else {
        const headGrad = ctx.createLinearGradient(-48, -32, 42, 24);
        headGrad.addColorStop(0, '#ffffff');
        headGrad.addColorStop(0.5, '#eee5cf');
        headGrad.addColorStop(1, '#d8caa0');
        ctx.fillStyle = headGrad;
      }
      ctx.fill();
      ctx.strokeStyle = isShadow ? 'rgba(53, 227, 160, 0.45)' : 'rgba(224, 182, 74, 0.55)';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Swept-back Horns
      const drawHorn = (hx, hy, len, curvature, w) => {
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.quadraticCurveTo(hx - len * 0.6, hy - curvature, hx - len, hy - curvature * 1.4);
        ctx.lineTo(hx - len * 0.9, hy - curvature * 1.3);
        ctx.quadraticCurveTo(hx - len * 0.5, hy - curvature * 0.8 + w, hx - 6, hy + w);
        ctx.closePath();

        ctx.fillStyle = isShadow ? '#020306' : '#c9a040';
        ctx.fill();

        ctx.strokeStyle = isShadow ? 'rgba(53, 227, 160, 0.7)' : 'rgba(240, 218, 140, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.shadowColor = isShadow ? '#35e3a0' : '#e0b64a';
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.shadowBlur = 0;
      };

      // Primary Horns
      drawHorn(-18, -28, 55, 32, 7);
      drawHorn(-32, -22, 44, 24, 6);
      drawHorn(-38, -8, 36, 12, 5);

      // Glowing Slit Eye
      const eyePulse = 0.75 + Math.sin(time * 2.2) * 0.25;
      const eyeX = 6;
      const eyeY = -10;

      ctx.save();
      ctx.shadowColor = isShadow ? '#35e3a0' : '#6fd6f0';
      ctx.shadowBlur = 18 * eyePulse;
      ctx.fillStyle = isShadow ? '#35e3a0' : '#6fd6f0';
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, 8, 4, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Slit Pupil
      ctx.fillStyle = isShadow ? '#010f07' : '#041824';
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, 2, 4, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Breath Mist from Snout
      for (let m = 0; m < 5; m++) {
        const mx = 46 + m * 9 + Math.sin(time * 2 + m) * 4;
        const my = 6 + m * 5 + Math.cos(time * 1.5 + m) * 3;
        const mr = 5 + m * 3.5;
        const mAlpha = (0.28 - m * 0.05) * eyePulse;

        ctx.beginPath();
        ctx.arc(mx, my, mr, 0, Math.PI * 2);
        ctx.fillStyle = isShadow
          ? `rgba(53, 227, 160, ${mAlpha})`
          : `rgba(111, 214, 240, ${mAlpha})`;
        ctx.fill();
      }

      ctx.restore();

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

