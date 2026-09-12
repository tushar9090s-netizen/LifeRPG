import React, { useRef, useEffect, useCallback } from 'react';
import { useGame } from '../../state/GameContext';

/**
 * CharacterCanvas — Semi-realistic, class-specific RPG character.
 * Large (fills center stage), with class-distinct silhouette,
 * rim lighting, idle breathing, and ground atmosphere.
 */
export const CharacterCanvas = ({ size = 420 }) => {
  const canvasRef = useRef(null);
  const { character, theme, isAscended } = useGame();
  const isShadow = theme === 'shadow';

  // Safe roundRect fallback
  const roundRect = useCallback((ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = size;
    const H = Math.round(size * 1.4);
    canvas.width  = W;
    canvas.height = H;
    let rafId;
    let time = 0;

    // Class-specific color palette
    const classColors = {
      Knight:    { primary: '#1a1a2e', armor: '#252535', accent: '#c86446', cape: '#8a1010', rim: '#e06045' },
      Mage:      { primary: '#12101e', armor: '#1e1a30', accent: '#8b6cf0', cape: '#30204a', rim: '#b090ff' },
      Assassin:  { primary: '#0e0e14', armor: '#18181f', accent: '#7b3cb0', cape: '#150d1e', rim: '#9050d0' },
      Alchemist: { primary: '#1a1408', armor: '#28200c', accent: '#c8a030', cape: '#201808', rim: '#d4b040' },
      Summoner:  { primary: '#100818', armor: '#1a0e28', accent: '#6040c0', cape: '#180830', rim: '#8868e8' },
    };
    const cls = classColors[character.class] || classColors.Mage;

    // Creature glow color for eyes
    const eyeColor  = isShadow ? '#35e3a0' : '#6fd6f0';
    const glowColor = isShadow ? 'rgba(53,227,160,0.55)' : 'rgba(111,214,240,0.5)';

    const render = () => {
      time += 0.012;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H * 0.44;
      const breathe = Math.sin(time) * 2.5;

      // ── Ground atmosphere pool ──────────────────────────────────────
      const poolGrad = ctx.createRadialGradient(cx, H - 30, 5, cx, H - 30, W * 0.55);
      poolGrad.addColorStop(0, isShadow ? 'rgba(139,108,240,0.2)' : 'rgba(182,137,46,0.15)');
      poolGrad.addColorStop(0.5, isShadow ? 'rgba(53,227,160,0.06)' : 'rgba(111,214,240,0.08)');
      poolGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = poolGrad;
      ctx.beginPath();
      ctx.ellipse(cx, H - 30, W * 0.5, 30, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── Character shadow on ground ──────────────────────────────────
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.ellipse(cx, H - 22, 55, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // ── Ascended aura (legendary outfit glow) ──────────────────────
      if (isAscended) {
        const ascGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 160);
        ascGrad.addColorStop(0, 'rgba(224,182,74,0.08)');
        ascGrad.addColorStop(0.5, 'rgba(139,108,240,0.05)');
        ascGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = ascGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 160, 200, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // ── Rim light effect (back-light silhouette glow) ───────────────
      const rimGrad = ctx.createRadialGradient(cx, cy - 30, 20, cx, cy - 30, 180);
      rimGrad.addColorStop(0, 'transparent');
      rimGrad.addColorStop(0.6, 'transparent');
      rimGrad.addColorStop(0.82, isShadow ? 'rgba(139, 108, 240, 0.12)' : 'rgba(224, 182, 74, 0.12)');
      rimGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.ellipse(cx, cy - 30, 90, 180, 0, 0, Math.PI * 2);
      ctx.fill();

      // Solid rim light line along edges of character silhouette
      ctx.save();
      ctx.shadowColor = isShadow ? cls.rim : '#d4a840';
      ctx.shadowBlur = 18;

      // === CLASS-SPECIFIC RENDERING ===

      if (character.class === 'Knight') {
        drawKnight(ctx, cx, cy, breathe, cls, roundRect, W, H);
      } else if (character.class === 'Mage') {
        drawMage(ctx, cx, cy, breathe, cls, roundRect, time, isShadow);
      } else if (character.class === 'Assassin') {
        drawAssassin(ctx, cx, cy, breathe, cls, roundRect, time);
      } else if (character.class === 'Alchemist') {
        drawAlchemist(ctx, cx, cy, breathe, cls, roundRect, time);
      } else if (character.class === 'Summoner') {
        drawSummoner(ctx, cx, cy, breathe, cls, roundRect, time, isShadow);
      } else {
        drawMage(ctx, cx, cy, breathe, cls, roundRect, time, isShadow);
      }

      ctx.restore();

      // ── Eyes ────────────────────────────────────────────────────────
      const eyePulse = 0.7 + Math.sin(time * 2.5) * 0.3;
      ctx.shadowColor = eyeColor;
      ctx.shadowBlur = 10 * eyePulse;
      ctx.fillStyle = eyeColor;
      // Eyes drawn per class in the draw functions, but add extra glow here
      ctx.shadowBlur = 0;

      // ── Floating mana particles ─────────────────────────────────────
      ctx.save();
      for (let i = 0; i < 8; i++) {
        const px = cx + Math.sin(time * 0.7 + i * 0.9) * (52 + i * 9);
        const py = cy + Math.cos(time * 0.5 + i * 1.1) * 50 - 20;
        const pA = 0.35 + Math.sin(time * 1.8 + i) * 0.25;
        const pR = 1.2 + Math.sin(time + i * 0.4) * 0.6;
        ctx.beginPath();
        ctx.arc(px, py, pR, 0, Math.PI * 2);
        ctx.fillStyle = isShadow
          ? `rgba(139,108,240,${pA})`
          : `rgba(182,137,46,${pA})`;
        ctx.shadowColor = isShadow ? '#8b6cf0' : '#e0b64a';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      ctx.restore();

      rafId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(rafId);
  }, [character.class, theme, isAscended, size]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={Math.round(size * 1.4)}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
};

// ══════════════════════════════════════════════════════
// CLASS DRAWING FUNCTIONS
// ══════════════════════════════════════════════════════

function drawKnight(ctx, cx, cy, breathe, cls, roundRect, W, H) {
  // Heavy boots
  ctx.fillStyle = '#1a1a28';
  ctx.beginPath(); ctx.ellipse(cx - 15, cy + 115 + breathe * 0.3, 16, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 15, cy + 115 + breathe * 0.3, 16, 9, 0, 0, Math.PI * 2); ctx.fill();

  // Leg plate armor
  ctx.fillStyle = cls.armor;
  roundRect(ctx, cx - 20, cy + 58 + breathe * 0.4, 18, 55, 3); ctx.fill();
  roundRect(ctx, cx + 2, cy + 58 + breathe * 0.4, 18, 55, 3); ctx.fill();

  // Cape (drawn before torso)
  const capeGrad = ctx.createLinearGradient(cx - 45, cy - 20, cx + 55, cy + 100);
  capeGrad.addColorStop(0, cls.cape);
  capeGrad.addColorStop(1, '#0a0408');
  ctx.fillStyle = capeGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 28 + breathe);
  ctx.quadraticCurveTo(cx - 52, cy + 20, cx - 48, cy + 110 + breathe * 0.5);
  ctx.lineTo(cx + 10, cy + 108 + breathe * 0.5);
  ctx.quadraticCurveTo(cx + 48, cy + 12, cx + 18, cy - 28 + breathe);
  ctx.closePath();
  ctx.fill();

  // Torso plate armor
  const armorGrad = ctx.createLinearGradient(cx - 28, cy - 20, cx + 28, cy + 50);
  armorGrad.addColorStop(0, '#2e2e42');
  armorGrad.addColorStop(0.5, cls.armor);
  armorGrad.addColorStop(1, '#12121e');
  ctx.fillStyle = armorGrad;
  roundRect(ctx, cx - 26, cy - 22 + breathe, 52, 80, 4);
  ctx.fill();
  // Chest accent lines
  ctx.strokeStyle = cls.accent + '88';
  ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - 14, cy - 12 + breathe); ctx.lineTo(cx, cy + 20 + breathe); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 14, cy - 12 + breathe); ctx.lineTo(cx, cy + 20 + breathe); ctx.stroke();

  // Shoulder pauldrons
  ctx.fillStyle = '#2a2a3c';
  ctx.beginPath(); ctx.ellipse(cx - 33, cy - 14 + breathe, 16, 11, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 33, cy - 14 + breathe, 16, 11, 0.3, 0, Math.PI * 2); ctx.fill();
  // Pauldron spike
  ctx.strokeStyle = cls.accent + 'aa';
  ctx.lineWidth = 2; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 36, cy - 22 + breathe); ctx.lineTo(cx - 34, cy - 34 + breathe); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 36, cy - 22 + breathe); ctx.lineTo(cx + 34, cy - 34 + breathe); ctx.stroke();

  // Neck + face skin
  ctx.fillStyle = '#c5a080';
  ctx.fillRect(cx - 6, cy - 38 + breathe, 12, 16);
  ctx.beginPath(); ctx.ellipse(cx, cy - 50 + breathe, 14, 17, 0, 0, Math.PI * 2); ctx.fill();

  // Hair - short dark
  ctx.fillStyle = '#0a0a12';
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - 48 + breathe);
  ctx.quadraticCurveTo(cx - 16, cy - 66 + breathe, cx, cy - 68 + breathe);
  ctx.quadraticCurveTo(cx + 16, cy - 66 + breathe, cx + 14, cy - 48 + breathe);
  ctx.closePath();
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#e08050';
  ctx.shadowColor = '#e08050'; ctx.shadowBlur = 8;
  ctx.beginPath(); ctx.ellipse(cx - 5, cy - 50 + breathe, 2.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 5, cy - 50 + breathe, 2.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Two-handed sword (right side)
  ctx.save();
  ctx.translate(cx + 36, cy + 30 + breathe * 0.3);
  ctx.rotate(0.18);
  // Blade
  const bladeGrad = ctx.createLinearGradient(-3, -90, 3, 0);
  bladeGrad.addColorStop(0, '#c0c8d8');
  bladeGrad.addColorStop(0.4, '#8898a8');
  bladeGrad.addColorStop(1, '#304050');
  ctx.fillStyle = bladeGrad;
  roundRect(ctx, -3, -90, 6, 90, 1); ctx.fill();
  // Crossguard
  ctx.fillStyle = cls.accent;
  roundRect(ctx, -16, -8, 32, 6, 2); ctx.fill();
  // Grip
  ctx.fillStyle = '#2a1a10';
  roundRect(ctx, -3, -2, 6, 28, 2); ctx.fill();
  // Pommel
  ctx.fillStyle = cls.accent;
  ctx.beginPath(); ctx.arc(0, 28, 5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawMage(ctx, cx, cy, breathe, cls, roundRect, time, isShadow) {
  // Robe base (long, wide)
  const robeGrad = ctx.createLinearGradient(cx - 30, cy - 20, cx + 30, cy + 115);
  robeGrad.addColorStop(0, cls.primary);
  robeGrad.addColorStop(0.4, cls.armor);
  robeGrad.addColorStop(1, '#07060e');
  ctx.fillStyle = robeGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 28, cy - 20 + breathe);
  ctx.quadraticCurveTo(cx - 38, cy + 40, cx - 42, cy + 115);
  ctx.lineTo(cx + 42, cy + 115);
  ctx.quadraticCurveTo(cx + 38, cy + 40, cx + 28, cy - 20 + breathe);
  ctx.closePath();
  ctx.fill();

  // Robe inner layer / contrast
  ctx.fillStyle = '#0a0818';
  ctx.beginPath();
  ctx.moveTo(cx - 8, cy - 18 + breathe);
  ctx.lineTo(cx - 16, cy + 115);
  ctx.lineTo(cx + 16, cy + 115);
  ctx.lineTo(cx + 8, cy - 18 + breathe);
  ctx.closePath();
  ctx.fill();

  // Belt clasp
  ctx.fillStyle = cls.accent;
  roundRect(ctx, cx - 9, cy + 36 + breathe * 0.5, 18, 7, 2); ctx.fill();
  ctx.strokeStyle = cls.accent + 'aa'; ctx.lineWidth = 1;
  ctx.strokeRect(cx - 9, cy + 36 + breathe * 0.5, 18, 7);

  // Rune embroidery on robe
  ctx.strokeStyle = cls.accent + '55'; ctx.lineWidth = 1;
  for (let r = 0; r < 3; r++) {
    ctx.beginPath();
    ctx.arc(cx, cy + 65 + r * 16 + breathe * 0.3, 8 + r * 2, -1.0, 1.0);
    ctx.stroke();
  }

  // Wide-brim hat
  // Brim
  const hatGrad = ctx.createLinearGradient(cx - 35, cy - 68, cx + 35, cy - 40);
  hatGrad.addColorStop(0, '#0c0c18'); hatGrad.addColorStop(1, '#1a1828');
  ctx.fillStyle = hatGrad;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 58 + breathe, 36, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = cls.accent + '88'; ctx.lineWidth = 1;
  ctx.stroke();
  // Cone
  ctx.fillStyle = cls.primary;
  ctx.beginPath();
  ctx.moveTo(cx - 20, cy - 58 + breathe);
  ctx.lineTo(cx, cy - 110 + breathe);
  ctx.lineTo(cx + 20, cy - 58 + breathe);
  ctx.closePath(); ctx.fill();
  // Hat band
  ctx.fillStyle = cls.accent;
  roundRect(ctx, cx - 19, cy - 68 + breathe, 38, 8, 2); ctx.fill();

  // Neck and face
  ctx.fillStyle = '#bda080';
  ctx.fillRect(cx - 7, cy - 42 + breathe, 14, 16);
  ctx.beginPath(); ctx.ellipse(cx, cy - 52 + breathe, 14, 16, 0, 0, Math.PI * 2); ctx.fill();

  // Hair strands below hat
  ctx.fillStyle = '#0f0d1c';
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy - 56 + breathe);
  ctx.quadraticCurveTo(cx - 18, cy - 44 + breathe, cx - 15, cy - 36 + breathe);
  ctx.lineTo(cx - 12, cy - 36 + breathe);
  ctx.quadraticCurveTo(cx - 10, cy - 44 + breathe, cx - 8, cy - 52 + breathe);
  ctx.fill();

  // Glowing orb (held in left hand)
  const orbX = cx - 38, orbY = cy + 10 + breathe;
  const orbPulse = 0.8 + Math.sin(time * 2.2) * 0.2;
  const orbGrad = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, 20);
  orbGrad.addColorStop(0, `rgba(180,150,255,${orbPulse})`);
  orbGrad.addColorStop(0.5, `rgba(139,108,240,${orbPulse * 0.6})`);
  orbGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = orbGrad;
  ctx.beginPath(); ctx.arc(orbX, orbY, 20, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = `rgba(200,180,255,${orbPulse})`;
  ctx.beginPath(); ctx.arc(orbX, orbY, 9, 0, Math.PI * 2); ctx.fill();
  // Orb glow outer
  ctx.shadowColor = '#8b6cf0'; ctx.shadowBlur = 22 * orbPulse;
  ctx.fillStyle = `rgba(139,108,240,${orbPulse * 0.8})`;
  ctx.beginPath(); ctx.arc(orbX, orbY, 7, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Staff (right hand)
  ctx.save();
  ctx.translate(cx + 34, cy - 30 + breathe * 0.4);
  ctx.rotate(0.1);
  ctx.fillStyle = '#2a1a0a';
  roundRect(ctx, -3, 0, 5, 135, 2); ctx.fill();
  // Staff gem
  ctx.shadowColor = cls.accent; ctx.shadowBlur = 14;
  ctx.fillStyle = cls.accent;
  ctx.beginPath(); ctx.arc(0, -6, 8, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();

  // Mage eyes — glowing arcane violet
  ctx.fillStyle = cls.accent;
  ctx.shadowColor = cls.accent; ctx.shadowBlur = 10;
  ctx.beginPath(); ctx.ellipse(cx - 5, cy - 52 + breathe, 2.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 5, cy - 52 + breathe, 2.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
}

function drawAssassin(ctx, cx, cy, breathe, cls, roundRect, time) {
  // Dark base body / cloak
  const cloakGrad = ctx.createLinearGradient(cx - 25, cy - 35, cx + 25, cy + 110);
  cloakGrad.addColorStop(0, '#0c0c16');
  cloakGrad.addColorStop(0.5, '#100e1a');
  cloakGrad.addColorStop(1, '#06050c');
  ctx.fillStyle = cloakGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy - 32 + breathe);
  ctx.quadraticCurveTo(cx - 32, cy + 30, cx - 28, cy + 110);
  ctx.lineTo(cx + 28, cy + 110);
  ctx.quadraticCurveTo(cx + 32, cy + 30, cx + 24, cy - 32 + breathe);
  ctx.closePath();
  ctx.fill();

  // Hood
  ctx.fillStyle = '#0d0d1a';
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy - 36 + breathe);
  ctx.quadraticCurveTo(cx - 24, cy - 64 + breathe, cx, cy - 72 + breathe);
  ctx.quadraticCurveTo(cx + 24, cy - 64 + breathe, cx + 22, cy - 36 + breathe);
  ctx.closePath(); ctx.fill();
  // Hood shadow
  ctx.fillStyle = '#050508';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 52 + breathe, 16, 8, 0, Math.PI * 0.1, Math.PI * 0.9);
  ctx.fill();

  // Face mask / lower face concealed
  ctx.fillStyle = '#0a0a14';
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy - 48 + breathe);
  ctx.lineTo(cx + 10, cy - 48 + breathe);
  ctx.lineTo(cx + 10, cy - 40 + breathe);
  ctx.quadraticCurveTo(cx, cy - 35 + breathe, cx - 10, cy - 40 + breathe);
  ctx.closePath(); ctx.fill();

  // Eyes (glowing narrow)
  ctx.fillStyle = '#9040c0';
  ctx.shadowColor = '#9040c0'; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.ellipse(cx - 6, cy - 52 + breathe, 3.5, 1.5, -0.1, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 6, cy - 52 + breathe, 3.5, 1.5, 0.1, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  // Violet accent stripe
  ctx.fillStyle = cls.accent + 'aa';
  roundRect(ctx, cx - 2, cy - 22 + breathe, 4, 50, 1); ctx.fill();

  // Twin daggers (crossed behind back, visible at sides)
  const drawDagger = (side) => {
    ctx.save();
    ctx.translate(cx + side * 28, cy - 5 + breathe * 0.5);
    ctx.rotate(side * 0.4);
    // Blade
    const dGrad = ctx.createLinearGradient(-2, -48, 2, 0);
    dGrad.addColorStop(0, '#c0c8d0'); dGrad.addColorStop(1, '#404860');
    ctx.fillStyle = dGrad;
    ctx.beginPath();
    ctx.moveTo(0, -48);
    ctx.lineTo(-2.5, 0);
    ctx.lineTo(2.5, 0);
    ctx.closePath(); ctx.fill();
    // Guard
    ctx.fillStyle = '#7b3cb0';
    roundRect(ctx, -9, 0, 18, 4, 1); ctx.fill();
    // Grip
    ctx.fillStyle = '#1a1020';
    roundRect(ctx, -3, 4, 6, 18, 1); ctx.fill();
    ctx.restore();
  };
  drawDagger(-1);
  drawDagger(1);
}

function drawAlchemist(ctx, cx, cy, breathe, cls, roundRect, time) {
  // Adventurer coat
  const coatGrad = ctx.createLinearGradient(cx - 28, cy - 20, cx + 28, cy + 110);
  coatGrad.addColorStop(0, '#241a08'); coatGrad.addColorStop(1, '#0e0c06');
  ctx.fillStyle = coatGrad;
  roundRect(ctx, cx - 28, cy - 22 + breathe, 56, 132, 5); ctx.fill();

  // Coat lapels
  ctx.fillStyle = '#1a1006';
  ctx.beginPath();
  ctx.moveTo(cx - 28, cy - 22 + breathe);
  ctx.lineTo(cx, cy + 15 + breathe);
  ctx.lineTo(cx - 28, cy + 40 + breathe);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 28, cy - 22 + breathe);
  ctx.lineTo(cx, cy + 15 + breathe);
  ctx.lineTo(cx + 28, cy + 40 + breathe);
  ctx.closePath(); ctx.fill();

  // Goggles
  ctx.fillStyle = '#2a2010';
  ctx.strokeStyle = '#c8a030'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx - 7, cy - 48 + breathe, 6, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx + 7, cy - 48 + breathe, 6, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();
  // Goggle lens
  ctx.fillStyle = 'rgba(0,180,80,0.3)';
  ctx.beginPath(); ctx.arc(cx - 7, cy - 48 + breathe, 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(cx + 7, cy - 48 + breathe, 4, 0, Math.PI * 2); ctx.fill();
  // Bridge
  ctx.strokeStyle = '#c8a030'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(cx - 1, cy - 48 + breathe); ctx.lineTo(cx + 1, cy - 48 + breathe); ctx.stroke();

  // Face
  ctx.fillStyle = '#c8a080';
  ctx.beginPath(); ctx.ellipse(cx, cy - 52 + breathe, 13, 15, 0, 0, Math.PI * 2); ctx.fill();

  // Hair
  ctx.fillStyle = '#3a2808';
  ctx.beginPath();
  ctx.moveTo(cx - 12, cy - 55 + breathe);
  ctx.quadraticCurveTo(cx - 15, cy - 66 + breathe, cx, cy - 68 + breathe);
  ctx.quadraticCurveTo(cx + 15, cy - 66 + breathe, cx + 12, cy - 55 + breathe);
  ctx.closePath(); ctx.fill();

  // Glowing potion (in hand)
  const poX = cx - 35, poY = cy + 20 + breathe;
  const poPulse = 0.7 + Math.sin(time * 3) * 0.3;
  ctx.shadowColor = '#00cc60'; ctx.shadowBlur = 16 * poPulse;
  ctx.fillStyle = `rgba(0,200,80,${poPulse * 0.9})`;
  ctx.beginPath(); ctx.arc(poX, poY, 10, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#1a0a08';
  roundRect(ctx, poX - 3, poY - 20, 6, 12, 2); ctx.fill();

  // Potion belt dots
  for (let b = 0; b < 4; b++) {
    const bx = cx - 14 + b * 8, by = cy + 44 + breathe * 0.4;
    ctx.fillStyle = b % 2 === 0 ? '#00cc60' : '#c8a030';
    ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 5;
    ctx.beginPath(); ctx.arc(bx, by, 3.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.shadowBlur = 0;
}

function drawSummoner(ctx, cx, cy, breathe, cls, roundRect, time, isShadow) {
  // Ceremonial dark robe
  const robeGrad = ctx.createLinearGradient(cx - 26, cy - 20, cx + 26, cy + 120);
  robeGrad.addColorStop(0, '#100818'); robeGrad.addColorStop(1, '#060412');
  ctx.fillStyle = robeGrad;
  ctx.beginPath();
  ctx.moveTo(cx - 24, cy - 22 + breathe);
  ctx.quadraticCurveTo(cx - 36, cy + 50, cx - 44, cy + 118);
  ctx.lineTo(cx + 44, cy + 118);
  ctx.quadraticCurveTo(cx + 36, cy + 50, cx + 24, cy - 22 + breathe);
  ctx.closePath(); ctx.fill();

  // Pale rune embroidery (animated)
  ctx.strokeStyle = `rgba(180,140,255,${0.25 + Math.sin(time * 1.5) * 0.12})`;
  ctx.lineWidth = 1;
  for (let r = 0; r < 5; r++) {
    const ry = cy + 20 + r * 18 + breathe * 0.3;
    ctx.beginPath();
    ctx.moveTo(cx - 16 + Math.sin(time + r) * 3, ry);
    ctx.lineTo(cx + 16 + Math.cos(time + r) * 3, ry);
    ctx.stroke();
  }

  // Face
  ctx.fillStyle = '#b8a0c0';
  ctx.beginPath(); ctx.ellipse(cx, cy - 52 + breathe, 13, 16, 0, 0, Math.PI * 2); ctx.fill();

  // Hood/cowl
  ctx.fillStyle = '#0d0818';
  ctx.beginPath();
  ctx.moveTo(cx - 22, cy - 40 + breathe);
  ctx.quadraticCurveTo(cx - 20, cy - 72 + breathe, cx, cy - 74 + breathe);
  ctx.quadraticCurveTo(cx + 20, cy - 72 + breathe, cx + 22, cy - 40 + breathe);
  ctx.quadraticCurveTo(cx + 22, cy - 32 + breathe, cx, cy - 28 + breathe);
  ctx.quadraticCurveTo(cx - 22, cy - 32 + breathe, cx - 22, cy - 40 + breathe);
  ctx.closePath(); ctx.fill();

  // Spectral familiar flame above hand
  const famX = cx - 38, famY = cy - 10 + breathe;
  const famPulse = 0.6 + Math.sin(time * 3.5) * 0.4;
  ctx.shadowColor = '#8060ff'; ctx.shadowBlur = 22 * famPulse;
  ctx.fillStyle = `rgba(120,80,240,${famPulse * 0.85})`;
  ctx.beginPath();
  ctx.moveTo(famX, famY - 22);
  ctx.quadraticCurveTo(famX - 10, famY - 10, famX - 8, famY);
  ctx.quadraticCurveTo(famX, famY + 5, famX + 8, famY);
  ctx.quadraticCurveTo(famX + 10, famY - 10, famX, famY - 22);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Summoner eyes — pale violet
  ctx.fillStyle = '#c0a0ff';
  ctx.shadowColor = '#c0a0ff'; ctx.shadowBlur = 12;
  ctx.beginPath(); ctx.ellipse(cx - 5, cy - 52 + breathe, 2.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + 5, cy - 52 + breathe, 2.5, 1.8, 0, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
}
