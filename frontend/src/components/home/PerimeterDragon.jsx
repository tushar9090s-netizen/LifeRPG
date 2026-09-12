import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext';

/**
 * PerimeterDragon — cinematic edge-hugging serpentine dragon
 * Traces the perimeter of its container very slowly (25s full loop).
 * Never obstructs UI — pointer-events: none.
 * Shadow: dark scaled body + emerald spine glow + emerald eyes
 * Divine: pale/white body + icy-cyan glow + starlight particles
 */
export const PerimeterDragon = () => {
  const canvasRef = useRef(null);
  const { theme } = useGame();
  const isShadow = theme === 'shadow';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;
    let t = 0;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ── Build a perimeter waypoint path ──────────────────────────────────
    // Returns array of {x,y} that trace the rectangle perimeter (with margin)
    const buildPerimPath = (W, H, margin) => {
      const pts = [];
      const steps = 240; // resolution
      const perim = 2 * (W + H);
      for (let i = 0; i <= steps; i++) {
        const d = (i / steps) * perim;
        let x, y;
        // top edge: left→right
        if (d < W) {
          x = margin + d;
          y = margin;
        }
        // right edge: top→bottom
        else if (d < W + H) {
          x = W - margin;
          y = margin + (d - W);
        }
        // bottom edge: right→left
        else if (d < 2 * W + H) {
          x = W - margin - (d - W - H);
          y = H - margin;
        }
        // left edge: bottom→top
        else {
          x = margin;
          y = H - margin - (d - 2 * W - H);
        }
        pts.push({ x, y });
      }
      return pts;
    };

    // Trail: stores past head positions for body drawing
    const MAX_TRAIL = 280;
    const trail = [];

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) { rafId = requestAnimationFrame(render); return; }

      ctx.clearRect(0, 0, W, H);

      // Dragon speed: 25s full perimeter loop
      t += 1 / (25 * 60); // assuming 60fps
      const tClamped = t % 1;

      // Perimeter path for this frame
      const path = buildPerimPath(W, H, 28);
      const totalPts = path.length - 1;

      // Head position along perimeter
      const headIdx = Math.floor(tClamped * totalPts);
      const headFrac = (tClamped * totalPts) - headIdx;
      const hA = path[headIdx];
      const hB = path[(headIdx + 1) % totalPts];
      if (!hA || !hB) { rafId = requestAnimationFrame(render); return; }

      // Add slight organic serpentine wiggle perpendicular to path direction
      const dx = hB.x - hA.x;
      const dy = hB.y - hA.y;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = -dy / len; // perpendicular
      const ny =  dx / len;
      const wiggleAmp = 8 + Math.sin(t * 18) * 4;
      const wiggle = Math.sin(t * 22 + headIdx * 0.2) * wiggleAmp;

      const headX = hA.x + dx * headFrac + nx * wiggle;
      const headY = hA.y + dy * headFrac + ny * wiggle;

      // Record head position history
      trail.unshift({ x: headX, y: headY });
      if (trail.length > MAX_TRAIL) trail.pop();

      // ── DRAW: Atmospheric fog glow around trail mid-point ────────────
      if (trail.length > 40) {
        const mid = trail[Math.min(60, trail.length - 1)];
        const fogGrad = ctx.createRadialGradient(mid.x, mid.y, 0, mid.x, mid.y, 90);
        if (isShadow) {
          fogGrad.addColorStop(0, 'rgba(53,227,160,0.04)');
          fogGrad.addColorStop(1, 'transparent');
        } else {
          fogGrad.addColorStop(0, 'rgba(111,214,240,0.05)');
          fogGrad.addColorStop(1, 'transparent');
        }
        ctx.fillStyle = fogGrad;
        ctx.beginPath();
        ctx.arc(mid.x, mid.y, 90, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── DRAW: Body segments (thick tapering serpentine) ──────────────
      const segLen = Math.min(trail.length - 1, MAX_TRAIL - 1);
      const MAX_WIDTH = 24; // thickest part of body

      for (let i = 0; i < segLen - 1; i++) {
        const p = trail[i];
        const q = trail[i + 1];
        if (!p || !q) continue;

        const t_ratio = i / segLen;
        // Body width tapers: thin head, thick mid, thin tail
        const headFactor = t_ratio < 0.08 ? t_ratio / 0.08 : 1;
        const tailFactor = t_ratio > 0.72 ? (1 - t_ratio) / 0.28 : 1;
        const bW = MAX_WIDTH * headFactor * tailFactor;
        if (bW < 0.5) continue;

        const alpha = Math.max(0, 1 - t_ratio * 0.85) * 0.72;

        // Outer body (dark scales)
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.lineWidth = bW;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (isShadow) {
          // Deep midnight dark-green/teal scales
          const v = Math.round(6 + t_ratio * 6);
          ctx.strokeStyle = `rgba(${v + 2}, ${v + 8}, ${v + 14}, ${alpha})`;
        } else {
          // Pale ivory/cream scales
          const v = Math.round(240 - t_ratio * 25);
          ctx.strokeStyle = `rgba(${v}, ${v - 5}, ${v - 15}, ${alpha * 0.8})`;
        }
        ctx.stroke();

        // Inner spine glow line (every other segment)
        if (i % 2 === 0 && bW > 7) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.lineWidth = Math.min(2.5, bW * 0.14);
          const spineAlpha = alpha * (0.7 - t_ratio * 0.45);
          ctx.strokeStyle = isShadow
            ? `rgba(53, 227, 160, ${spineAlpha})`
            : `rgba(111, 214, 240, ${spineAlpha})`;
          ctx.stroke();
        }
      }

      // ── DRAW: Head ────────────────────────────────────────────────────
      if (trail.length > 2) {
        const prev = trail[1] || trail[0];
        const headRot = Math.atan2(headY - prev.y, headX - prev.x);

        ctx.save();
        ctx.translate(headX, headY);
        ctx.rotate(headRot);

        // Head glow halo
        const hgGrad = ctx.createRadialGradient(6, 0, 0, 6, 0, 32);
        if (isShadow) {
          hgGrad.addColorStop(0, 'rgba(53,227,160,0.22)');
          hgGrad.addColorStop(1, 'transparent');
        } else {
          hgGrad.addColorStop(0, 'rgba(111,214,240,0.25)');
          hgGrad.addColorStop(1, 'transparent');
        }
        ctx.fillStyle = hgGrad;
        ctx.beginPath();
        ctx.arc(6, 0, 32, 0, Math.PI * 2);
        ctx.fill();

        // Skull
        ctx.beginPath();
        ctx.moveTo(26, 0);
        ctx.lineTo(14, -6);
        ctx.lineTo(-5, -8);
        ctx.lineTo(-12, -4);
        ctx.lineTo(-12, 4);
        ctx.lineTo(-5, 8);
        ctx.lineTo(14, 6);
        ctx.closePath();

        if (isShadow) {
          const sg = ctx.createLinearGradient(-12, -8, 26, 0);
          sg.addColorStop(0, '#040a0e'); sg.addColorStop(1, '#061215');
          ctx.fillStyle = sg;
        } else {
          const sg = ctx.createLinearGradient(-12, -8, 26, 0);
          sg.addColorStop(0, '#e8f4f8'); sg.addColorStop(1, '#c8e8f2');
          ctx.fillStyle = sg;
        }
        ctx.fill();

        // Skull outline
        ctx.strokeStyle = isShadow ? 'rgba(53,227,160,0.6)' : 'rgba(111,214,240,0.65)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Eyes (pulse)
        const eyePulse = 0.55 + Math.sin(t * 300 * Math.PI) * 0.45;
        ctx.shadowColor = isShadow ? '#35e3a0' : '#6fd6f0';
        ctx.shadowBlur = 12 * eyePulse;
        ctx.fillStyle = isShadow ? '#35e3a0' : '#6fd6f0';
        ctx.beginPath();
        ctx.ellipse(14, -3.5, 3.5, 2.5, -0.15, 0, Math.PI * 2);
        ctx.fill();
        // Pupil
        ctx.shadowBlur = 0;
        ctx.fillStyle = isShadow ? '#011008' : '#061828';
        ctx.beginPath();
        ctx.ellipse(14, -3.5, 1.8, 1.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Horn
        ctx.shadowColor = isShadow ? '#35e3a0' : '#6fd6f0';
        ctx.shadowBlur = 6;
        ctx.strokeStyle = isShadow ? 'rgba(53,227,160,0.75)' : 'rgba(111,214,240,0.75)';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(2, -7);
        ctx.quadraticCurveTo(-4, -18, -1, -24);
        ctx.stroke();

        ctx.shadowBlur = 0;
        ctx.restore();
      }

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
        opacity: 0.85,
      }}
    />
  );
};
