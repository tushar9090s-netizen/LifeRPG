import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext';
import { calculateNextLevelXp } from '../../data/api';

/**
 * ARISE — Full-Screen Dragon Orbit
 * =========================================
 * Canvas-rendered mythical serpentine dragon that sweeps the entire viewport.
 * Orbit is a large ellipse covering ~80% screen width and ~65% screen height.
 * Only visible on Home tab. Fixed-position behind all UI content (z-index: 2).
 */
export const DragonCanvas = () => {
  const canvasRef = useRef(null);
  const { theme } = useGame();
  const isShadow = theme === 'shadow';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Trail history for smooth following particles
    const trailHistory = [];
    const TRAIL_LENGTH = 32;

    const render = () => {
      const W = canvas.width;
      const H = canvas.height;
      time += 0.003; // orbit speed — 18s for full loop

      ctx.clearRect(0, 0, W, H);

      // ── Orbital ellipse parameters ──────────────────────────────
      const cx = W * 0.5;
      const cy = H * 0.48;
      const rx = W * 0.40;   // 80% of half-width
      const ry = H * 0.32;   // 65% of half-height

      // Dragon head position along ellipse orbit
      const headAngle = time * (Math.PI * 2); // full orbit = 1 time unit
      const headX = cx + Math.cos(headAngle) * rx;
      const headY = cy + Math.sin(headAngle) * ry;

      // Tangential direction (perpendicular to radius = direction of travel)
      const tangentX = -Math.sin(headAngle);
      const tangentY =  Math.cos(headAngle);
      // Correct for ellipse curvature
      const ellipTangentX = -rx * Math.sin(headAngle);
      const ellipTangentY =  ry * Math.cos(headAngle);
      const tLen = Math.sqrt(ellipTangentX * ellipTangentX + ellipTangentY * ellipTangentY);
      const normTX = ellipTangentX / tLen;
      const normTY = ellipTangentY / tLen;
      // Head rotation angle
      const headRot = Math.atan2(normTY, normTX);

      // ── Track head position history for body segments ──────────
      trailHistory.unshift({ x: headX, y: headY, angle: headRot });
      if (trailHistory.length > TRAIL_LENGTH * 6) trailHistory.pop();

      // ── DRAW: Body glow halo (wide soft bloom behind dragon) ───
      const bloomX = trailHistory[Math.min(20, trailHistory.length - 1)]?.x ?? headX;
      const bloomY = trailHistory[Math.min(20, trailHistory.length - 1)]?.y ?? headY;
      const bloomGrad = ctx.createRadialGradient(bloomX, bloomY, 0, bloomX, bloomY, 120);
      if (isShadow) {
        bloomGrad.addColorStop(0, 'rgba(13, 207, 255, 0.07)');
        bloomGrad.addColorStop(0.5, 'rgba(30, 143, 255, 0.04)');
        bloomGrad.addColorStop(1, 'transparent');
      } else {
        bloomGrad.addColorStop(0, 'rgba(77, 184, 212, 0.08)');
        bloomGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = bloomGrad;
      ctx.beginPath();
      ctx.arc(bloomX, bloomY, 120, 0, Math.PI * 2);
      ctx.fill();

      // ── DRAW: Mana particle trail ────────────────────────────────
      const particleInterval = 3;
      for (let i = 10; i < Math.min(trailHistory.length, TRAIL_LENGTH * 4); i += particleInterval) {
        const p = trailHistory[i];
        if (!p) continue;
        const alpha = Math.max(0, 1 - (i / (TRAIL_LENGTH * 4)));
        const sz = (1 - i / (TRAIL_LENGTH * 4)) * 4.5;

        // Main particle
        ctx.beginPath();
        ctx.arc(
          p.x + (Math.random() - 0.5) * 12,
          p.y + (Math.random() - 0.5) * 12,
          sz, 0, Math.PI * 2
        );
        ctx.fillStyle = isShadow
          ? `rgba(13, 207, 255, ${alpha * 0.7})`
          : `rgba(77, 184, 212, ${alpha * 0.6})`;
        ctx.fill();
      }

      // ── DRAW: Serpentine Body ────────────────────────────────────
      // Body is composed of multiple thick segments with scale texture
      const segCount = Math.min(trailHistory.length - 1, TRAIL_LENGTH * 5);
      const MAX_BODY_W = 28; // max body width at thickest point

      if (segCount > 4) {
        // Build body path
        ctx.save();

        // Outer body glow (soft halo around entire body)
        ctx.beginPath();
        for (let i = 0; i < segCount; i++) {
          const p = trailHistory[i];
          if (!p) continue;
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        const bodyWidth = (t) => {
          // Tapers from thick mid-body toward tail and narrows near head
          const headFactor = t < 0.12 ? t / 0.12 : 1;
          const tailFactor = t > 0.75 ? (1 - t) / 0.25 : 1;
          return MAX_BODY_W * headFactor * tailFactor;
        };

        // Spine glow stroke
        ctx.lineWidth = MAX_BODY_W * 0.8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        const spineGlowGrad = ctx.createLinearGradient(
          trailHistory[0].x, trailHistory[0].y,
          trailHistory[Math.min(segCount - 1, TRAIL_LENGTH - 1)].x,
          trailHistory[Math.min(segCount - 1, TRAIL_LENGTH - 1)].y
        );
        if (isShadow) {
          spineGlowGrad.addColorStop(0, 'rgba(13, 207, 255, 0.12)');
          spineGlowGrad.addColorStop(0.5, 'rgba(30, 143, 255, 0.08)');
          spineGlowGrad.addColorStop(1, 'rgba(13, 207, 255, 0)');
        } else {
          spineGlowGrad.addColorStop(0, 'rgba(77, 184, 212, 0.1)');
          spineGlowGrad.addColorStop(1, 'transparent');
        }
        ctx.strokeStyle = spineGlowGrad;
        ctx.stroke();

        // Body scale segments (draw individually for width taper)
        for (let i = 0; i < segCount - 1; i++) {
          const p = trailHistory[i];
          const pNext = trailHistory[i + 1];
          if (!p || !pNext) continue;

          const t = i / segCount;
          const w = bodyWidth(t);
          if (w < 0.5) continue;

          // Segment color — dark base with scale sheen
          const alpha = Math.max(0.1, 1 - t * 0.6);

          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pNext.x, pNext.y);
          ctx.lineWidth = w;
          ctx.lineCap = 'round';

          // Realistic scale color gradient per segment
          if (isShadow) {
            // Midnight dark body with blue-teal iridescence
            const r = Math.round(8 + t * 4);
            const g = Math.round(12 + t * 6);
            const b = Math.round(28 + t * 10);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          } else {
            // Ivory-white body with warm gold iridescence
            const r = Math.round(240 - t * 30);
            const g = Math.round(230 - t * 20);
            const b = Math.round(200 - t * 10);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          }
          ctx.stroke();

          // Dorsal ridge / spine line (bright line along top of body)
          if (i % 2 === 0 && i < segCount - 2 && w > 8) {
            const ridgeAlpha = alpha * 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pNext.x, pNext.y);
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = isShadow
              ? `rgba(13, 207, 255, ${ridgeAlpha})`
              : `rgba(180, 220, 240, ${ridgeAlpha})`;
            ctx.stroke();
          }
        }

        ctx.restore();

        // ── DRAW: Wing Silhouettes at ~1/3 body point ───────────
        const wingIdx = Math.min(Math.floor(segCount * 0.18), trailHistory.length - 1);
        const wingAnchor = trailHistory[wingIdx];
        if (wingAnchor && segCount > 20) {
          const wRot = wingAnchor.angle;
          const wingFlap = Math.sin(time * 8) * 0.35; // fast flap cycle

          ctx.save();
          ctx.translate(wingAnchor.x, wingAnchor.y);
          ctx.rotate(wRot);

          const wW = 70 + Math.abs(Math.sin(time * 8)) * 20; // wing span
          const wH = 40 + Math.abs(Math.sin(time * 8)) * 15;

          // Top wing
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-20, -wH - wingFlap * 20, -wW, -wH * 0.4 - wingFlap * 10);
          ctx.quadraticCurveTo(-wW * 0.5, 5, 0, 8);
          ctx.closePath();
          ctx.fillStyle = isShadow
            ? `rgba(10, 20, 50, 0.75)`
            : `rgba(200, 230, 240, 0.6)`;
          ctx.fill();
          ctx.strokeStyle = isShadow
            ? `rgba(13, 207, 255, 0.5)`
            : `rgba(100, 180, 220, 0.6)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Wing membrane veins
          for (let v = 1; v <= 3; v++) {
            const vt = v / 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(-wW * vt, (-wH - wingFlap * 20) * vt * 0.9);
            ctx.strokeStyle = isShadow
              ? `rgba(30, 143, 255, ${0.4 - vt * 0.1})`
              : `rgba(120, 200, 230, ${0.35 - vt * 0.08})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          // Bottom wing
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(-20, wH + wingFlap * 20, -wW, wH * 0.4 + wingFlap * 10);
          ctx.quadraticCurveTo(-wW * 0.5, -5, 0, -8);
          ctx.closePath();
          ctx.fillStyle = isShadow
            ? `rgba(6, 12, 38, 0.7)`
            : `rgba(180, 215, 230, 0.55)`;
          ctx.fill();
          ctx.strokeStyle = isShadow
            ? `rgba(13, 207, 255, 0.4)`
            : `rgba(100, 180, 220, 0.5)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.restore();
        }
      }

      // ── DRAW: Dragon Head ────────────────────────────────────────
      ctx.save();
      ctx.translate(headX, headY);
      ctx.rotate(headRot);

      // Head main shape — elongated diamond / serpentine skull
      const headScale = 1 + Math.sin(time * 3) * 0.02; // subtle breathing
      ctx.scale(headScale, headScale);

      // Head glow
      const headGlowGrad = ctx.createRadialGradient(8, 0, 0, 8, 0, 38);
      if (isShadow) {
        headGlowGrad.addColorStop(0, 'rgba(13, 207, 255, 0.35)');
        headGlowGrad.addColorStop(0.5, 'rgba(30, 143, 255, 0.15)');
        headGlowGrad.addColorStop(1, 'transparent');
      } else {
        headGlowGrad.addColorStop(0, 'rgba(200, 240, 255, 0.4)');
        headGlowGrad.addColorStop(1, 'transparent');
      }
      ctx.fillStyle = headGlowGrad;
      ctx.beginPath();
      ctx.arc(8, 0, 38, 0, Math.PI * 2);
      ctx.fill();

      // Skull / snout
      ctx.beginPath();
      ctx.moveTo(32, 0);            // snout tip
      ctx.lineTo(18, -7);           // upper jaw
      ctx.lineTo(-4, -9);           // back skull top
      ctx.lineTo(-14, -5);          // nape
      ctx.lineTo(-14, 5);           // nape bottom
      ctx.lineTo(-4, 9);            // back skull bottom
      ctx.lineTo(18, 7);            // lower jaw
      ctx.closePath();

      const skullGrad = ctx.createLinearGradient(-14, -9, 32, 0);
      if (isShadow) {
        skullGrad.addColorStop(0, '#050812');
        skullGrad.addColorStop(0.5, '#0a1030');
        skullGrad.addColorStop(1, '#0d1840');
      } else {
        skullGrad.addColorStop(0, '#e8f6ff');
        skullGrad.addColorStop(0.5, '#c8e8f8');
        skullGrad.addColorStop(1, '#a8d4ee');
      }
      ctx.fillStyle = skullGrad;
      ctx.fill();

      // Skull outline
      ctx.strokeStyle = isShadow ? 'rgba(13, 207, 255, 0.8)' : 'rgba(100, 180, 220, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing eyes (two — main + smaller)
      const eyeGlow = 0.6 + Math.sin(time * 5) * 0.4;
      // Main eye
      ctx.shadowColor = isShadow ? '#0dcfff' : '#4db8d4';
      ctx.shadowBlur = 14 * eyeGlow;
      ctx.fillStyle = isShadow ? '#0dcfff' : '#4db8d4';
      ctx.beginPath();
      ctx.ellipse(16, -4, 4, 3, -0.2, 0, Math.PI * 2);
      ctx.fill();
      // Pupil
      ctx.fillStyle = isShadow ? '#000a1a' : '#0a2030';
      ctx.beginPath();
      ctx.ellipse(16, -4, 2, 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Secondary small eye
      ctx.shadowBlur = 8 * eyeGlow;
      ctx.fillStyle = isShadow ? '#0dcfff' : '#4db8d4';
      ctx.beginPath();
      ctx.ellipse(20, -2.5, 2, 1.5, -0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';

      // Horns — sharp back-swept
      ctx.strokeStyle = isShadow ? 'rgba(30, 143, 255, 0.9)' : 'rgba(120, 190, 220, 0.8)';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      // Upper horn
      ctx.beginPath();
      ctx.moveTo(2, -8);
      ctx.quadraticCurveTo(-5, -22, -2, -28);
      ctx.stroke();
      // Lower smaller horn
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(6, -7);
      ctx.quadraticCurveTo(0, -16, 3, -21);
      ctx.stroke();

      // Scale pattern on head (subtle texture lines)
      ctx.strokeStyle = isShadow ? 'rgba(30, 143, 255, 0.2)' : 'rgba(100, 180, 210, 0.25)';
      ctx.lineWidth = 0.8;
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        ctx.arc(8 - s * 5, 0, 6 + s * 3, -Math.PI * 0.6, Math.PI * 0.6);
        ctx.stroke();
      }

      // Breath / mana wisps from snout tip
      const breathAlpha = 0.3 + Math.sin(time * 4) * 0.25;
      for (let b = 0; b < 3; b++) {
        const bx = 33 + b * 8 + Math.sin(time * 4 + b) * 6;
        const by = (b - 1) * 5 + Math.cos(time * 3 + b) * 4;
        const bSz = 3 - b * 0.8;
        ctx.beginPath();
        ctx.arc(bx, by, bSz, 0, Math.PI * 2);
        ctx.fillStyle = isShadow
          ? `rgba(13, 207, 255, ${breathAlpha - b * 0.08})`
          : `rgba(100, 200, 230, ${breathAlpha - b * 0.07})`;
        ctx.fill();
      }

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.92,
      }}
    />
  );
};

/**
 * Hub: Central XP / Level hub for Home tab (no longer combined with dragon)
 */
export const CreatureOrbit = () => {
  const { character } = useGame();
  const nextXp = calculateNextLevelXp(character.level);
  const xpPercent = Math.min(100, Math.round((character.xp / nextXp) * 100));
  const radius = 88;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (circ * xpPercent) / 100;

  return (
    <div className="sl-avatar-hub">
      {/* Animated outer orbit rings */}
      <div className="sl-hub-ring ring-1" />
      <div className="sl-hub-ring ring-2" />

      {/* XP Arc */}
      <svg className="sl-hub-svg" viewBox="0 0 220 220">
        <circle cx="110" cy="110" r={radius} fill="none"
          stroke="rgba(30,143,255,0.12)" strokeWidth="3" />
        <circle cx="110" cy="110" r={radius} fill="none"
          stroke="#1e8fff" strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 110 110)"
          style={{ filter: 'drop-shadow(0 0 8px #1e8fff)' }}
        />
      </svg>

      {/* Hub core */}
      <div className="sl-hub-core">
        <div className="sl-hub-class">{character.class}</div>
        <div className="sl-hub-level">
          <span className="sl-lv-prefix">LV.</span>
          <span className="sl-lv-num">{character.level}</span>
        </div>
        <div className="sl-hub-pct">{xpPercent}% TO NEXT</div>
        <div className="sl-hub-xp">{character.xp.toLocaleString()} / {nextXp.toLocaleString()}</div>
      </div>

      <style>{`
        .sl-avatar-hub {
          position: relative;
          width: 220px;
          height: 220px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }

        .sl-hub-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(30,143,255,0.18);
          pointer-events: none;
        }
        .ring-1 {
          width: 240px; height: 240px;
          animation: ringRotate 12s linear infinite;
          border-color: rgba(30,143,255,0.15);
          border-top-color: rgba(13,207,255,0.55);
          border-right-color: rgba(30,143,255,0.08);
        }
        .ring-2 {
          width: 268px; height: 268px;
          animation: ringRotate 20s linear infinite reverse;
          border-color: rgba(30,143,255,0.08);
          border-bottom-color: rgba(13,207,255,0.28);
          border-left-color: rgba(30,143,255,0.04);
        }
        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .sl-hub-svg {
          position: absolute;
          width: 100%; height: 100%;
          pointer-events: none;
        }

        .sl-hub-core {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 2;
          background: radial-gradient(circle, rgba(7,9,26,0.95) 0%, rgba(3,4,10,0.8) 100%);
          border: 1px solid rgba(30,143,255,0.25);
          border-radius: 50%;
          width: 170px;
          height: 170px;
          justify-content: center;
          box-shadow: 0 0 30px rgba(30,143,255,0.12), inset 0 0 20px rgba(30,143,255,0.06);
        }

        [data-theme="divine"] .sl-hub-core {
          background: radial-gradient(circle, rgba(248,244,232,0.98) 0%, rgba(240,235,224,0.9) 100%);
          border-color: rgba(182,137,46,0.3);
          box-shadow: 0 0 25px rgba(182,137,46,0.1);
        }

        .sl-hub-class {
          font-family: var(--font-display);
          font-size: 0.65rem;
          font-weight: 800;
          color: var(--accent-color);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-shadow: 0 0 10px var(--accent-color);
          margin-bottom: 2px;
        }

        .sl-hub-level {
          display: flex;
          align-items: baseline;
          gap: 3px;
          line-height: 1;
        }

        .sl-lv-prefix {
          font-family: var(--font-display);
          font-size: 0.85rem;
          color: var(--dim-text-color);
          font-weight: 700;
        }

        .sl-lv-num {
          font-family: var(--font-display);
          font-size: 3.2rem;
          font-weight: 900;
          color: var(--text-color-bright);
          text-shadow: 0 0 20px var(--accent-color), 0 0 40px var(--accent-glow);
          line-height: 1;
        }

        [data-theme="divine"] .sl-lv-num {
          text-shadow: 0 0 14px var(--accent-glow);
        }

        .sl-hub-pct {
          font-family: var(--font-mono);
          font-size: 0.62rem;
          font-weight: 700;
          color: var(--creature-glow);
          letter-spacing: 0.06em;
          text-shadow: 0 0 8px var(--creature-glow);
          margin-top: 3px;
        }

        .sl-hub-xp {
          font-family: var(--font-mono);
          font-size: 0.6rem;
          color: var(--dim-text-color);
          margin-top: 2px;
          letter-spacing: 0.04em;
        }
      `}</style>
    </div>
  );
};
