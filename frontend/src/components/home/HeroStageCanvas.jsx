import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext';

/**
 * HeroStageCanvas — Large, full-body cinematic fantasy protagonist standing
 * atop a glowing circular magical rune platform.
 * - Realistic human proportions (tall heroic figure ~8 heads tall)
 * - Layered high-collar Monarch coat with white inner lining, belts, straps, and boots
 * - 3D circular stone dais with glowing concentric rune rings and rising mana sparks
 * - Strong dramatic rim lighting separating the hero from the background
 * - Subtle idle breathing and wind movement
 */
export const HeroStageCanvas = ({ width = 460, height = 580 }) => {
  const canvasRef = useRef(null);
  const { character, theme } = useGame();
  const isShadow = theme === 'shadow';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;
    let time = 0;

    canvas.width = width;
    canvas.height = height;

    // Mana particles rising from platform
    const platformSparks = Array.from({ length: 24 }, () => ({
      x: (Math.random() - 0.5) * 220,
      y: Math.random() * 40,
      speedY: 0.5 + Math.random() * 0.9,
      size: 1.2 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }));

    const render = () => {
      time += 0.024;
      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const basePlatformY = height - 60; // Platform floor level
      const breathe = Math.sin(time * 1.6) * 2.5;
      const coatSway = Math.sin(time * 1.4) * 4;

      // ══════════════════════════════════════════════════════════════
      // 1. MAGICAL CIRCULAR PEDESTAL / RUNE PLATFORM
      // ══════════════════════════════════════════════════════════════

      // Ground Soft Mist Vignette
      const mistGrad = ctx.createRadialGradient(cx, basePlatformY + 15, 20, cx, basePlatformY + 15, 210);
      mistGrad.addColorStop(0, isShadow ? 'rgba(139, 108, 240, 0.18)' : 'rgba(224, 182, 74, 0.22)');
      mistGrad.addColorStop(0.5, isShadow ? 'rgba(53, 227, 160, 0.06)' : 'rgba(111, 214, 240, 0.08)');
      mistGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = mistGrad;
      ctx.beginPath();
      ctx.ellipse(cx, basePlatformY + 15, 200, 48, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal Stone Base (3D Bevel)
      ctx.fillStyle = isShadow ? '#090b16' : '#dfd2b0';
      ctx.beginPath();
      ctx.ellipse(cx, basePlatformY + 18, 175, 42, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pedestal Vertical Rim
      const rimGrad = ctx.createLinearGradient(cx - 175, basePlatformY, cx + 175, basePlatformY + 20);
      rimGrad.addColorStop(0, isShadow ? '#060810' : '#cfc09b');
      rimGrad.addColorStop(0.5, isShadow ? '#1b1e33' : '#efe5cf');
      rimGrad.addColorStop(1, isShadow ? '#060810' : '#cfc09b');
      ctx.fillStyle = rimGrad;
      ctx.beginPath();
      ctx.ellipse(cx, basePlatformY + 10, 175, 40, 0, 0, Math.PI);
      ctx.lineTo(cx - 175, basePlatformY);
      ctx.ellipse(cx, basePlatformY, 175, 40, 0, Math.PI, 0, true);
      ctx.closePath();
      ctx.fill();

      // Pedestal Top Surface
      const topGrad = ctx.createRadialGradient(cx, basePlatformY, 20, cx, basePlatformY, 175);
      topGrad.addColorStop(0, isShadow ? '#16192d' : '#fcf8ee');
      topGrad.addColorStop(0.8, isShadow ? '#0b0d1a' : '#ece2c8');
      topGrad.addColorStop(1, isShadow ? '#070810' : '#d8caa0');
      ctx.fillStyle = topGrad;
      ctx.beginPath();
      ctx.ellipse(cx, basePlatformY, 175, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Concentric Glowing Rune Circles
      const runeAlpha = 0.65 + Math.sin(time * 1.8) * 0.2;
      const runeColor = isShadow
        ? `rgba(139, 108, 240, ${runeAlpha})`
        : `rgba(224, 182, 74, ${runeAlpha})`;

      // Outer Rune Ring
      ctx.strokeStyle = runeColor;
      ctx.lineWidth = 1.8;
      ctx.shadowColor = isShadow ? '#8b6cf0' : '#e0b64a';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.ellipse(cx, basePlatformY, 162, 35, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Middle Rune Ring
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, basePlatformY, 128, 28, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Star Rune Ring
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, basePlatformY, 82, 18, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Platform Radial Spokes
      for (let r = 0; r < 8; r++) {
        const ang = (r / 8) * Math.PI * 2 + time * 0.08;
        const rx = cx + Math.cos(ang) * 155;
        const ry = basePlatformY + Math.sin(ang) * 33;
        const ix = cx + Math.cos(ang) * 85;
        const iy = basePlatformY + Math.sin(ang) * 19;
        ctx.strokeStyle = isShadow ? 'rgba(53, 227, 160, 0.35)' : 'rgba(111, 214, 240, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(rx, ry);
        ctx.stroke();
      }

      // Hero Contact Shadow on Pedestal
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.ellipse(cx, basePlatformY - 4, 68, 14, 0, 0, Math.PI * 2);
      ctx.fill();

      // ══════════════════════════════════════════════════════════════
      // 2. FULL-BODY HUMAN HERO (ANIME PROTAGONIST PROPORTIONS)
      // Height: ~450px tall (from top of hair ~y:70 to boots ~y:520)
      // ══════════════════════════════════════════════════════════════

      const heroFootY = basePlatformY - 6;

      ctx.save();

      // ── Layer A: Flowing Back Coattails & White Inner Lining ──
      // Coat left flap
      ctx.fillStyle = isShadow ? '#0a0c16' : '#28241a';
      ctx.beginPath();
      ctx.moveTo(cx - 24, heroFootY - 240);
      ctx.quadraticCurveTo(cx - 75 + coatSway, heroFootY - 140, cx - 88 + coatSway * 1.4, heroFootY - 40);
      ctx.lineTo(cx - 32, heroFootY - 35);
      ctx.quadraticCurveTo(cx - 35, heroFootY - 150, cx - 12, heroFootY - 240);
      ctx.closePath();
      ctx.fill();

      // White/Silver Inner Lining on Left Flap (matches reference)
      ctx.fillStyle = isShadow ? '#e2e5f5' : '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx - 32, heroFootY - 35);
      ctx.lineTo(cx - 48, heroFootY - 48);
      ctx.quadraticCurveTo(cx - 65 + coatSway, heroFootY - 130, cx - 18, heroFootY - 225);
      ctx.lineTo(cx - 12, heroFootY - 240);
      ctx.quadraticCurveTo(cx - 35, heroFootY - 150, cx - 32, heroFootY - 35);
      ctx.closePath();
      ctx.fill();

      // Coat right flap
      ctx.fillStyle = isShadow ? '#090b14' : '#221e16';
      ctx.beginPath();
      ctx.moveTo(cx + 24, heroFootY - 240);
      ctx.quadraticCurveTo(cx + 80 - coatSway, heroFootY - 130, cx + 96 - coatSway * 1.5, heroFootY - 42);
      ctx.lineTo(cx + 34, heroFootY - 36);
      ctx.quadraticCurveTo(cx + 35, heroFootY - 150, cx + 12, heroFootY - 240);
      ctx.closePath();
      ctx.fill();

      // White/Silver Inner Lining on Right Flap
      ctx.fillStyle = isShadow ? '#d8dced' : '#f5edd8';
      ctx.beginPath();
      ctx.moveTo(cx + 34, heroFootY - 36);
      ctx.lineTo(cx + 54, heroFootY - 50);
      ctx.quadraticCurveTo(cx + 70 - coatSway, heroFootY - 120, cx + 22, heroFootY - 225);
      ctx.lineTo(cx + 12, heroFootY - 240);
      ctx.quadraticCurveTo(cx + 35, heroFootY - 150, cx + 34, heroFootY - 36);
      ctx.closePath();
      ctx.fill();

      // ── Layer B: Legs & Buckled Combat Boots ──
      // Left Leg
      ctx.fillStyle = isShadow ? '#0d0e1a' : '#1e1a14';
      ctx.beginPath();
      ctx.moveTo(cx - 24, heroFootY - 230);
      ctx.lineTo(cx - 12, heroFootY - 230);
      ctx.lineTo(cx - 14, heroFootY - 110); // Knee
      ctx.lineTo(cx - 22, heroFootY - 110);
      ctx.closePath();
      ctx.fill();

      // Right Leg
      ctx.beginPath();
      ctx.moveTo(cx + 12, heroFootY - 230);
      ctx.lineTo(cx + 26, heroFootY - 230);
      ctx.lineTo(cx + 28, heroFootY - 110); // Knee
      ctx.lineTo(cx + 16, heroFootY - 110);
      ctx.closePath();
      ctx.fill();

      // Left Combat Boot (detailed knee-high leather)
      const bootGradL = ctx.createLinearGradient(cx - 30, heroFootY - 110, cx - 10, heroFootY);
      bootGradL.addColorStop(0, isShadow ? '#1b1d30' : '#32281a');
      bootGradL.addColorStop(0.6, isShadow ? '#0f1120' : '#1a140c');
      bootGradL.addColorStop(1, '#05060b');
      ctx.fillStyle = bootGradL;
      ctx.beginPath();
      ctx.moveTo(cx - 22, heroFootY - 110);
      ctx.lineTo(cx - 14, heroFootY - 110);
      ctx.lineTo(cx - 13, heroFootY - 20); // Ankle
      ctx.lineTo(cx - 9, heroFootY);       // Heel
      ctx.lineTo(cx - 30, heroFootY);      // Toe
      ctx.lineTo(cx - 23, heroFootY - 24);
      ctx.closePath();
      ctx.fill();

      // Left Boot Silver Buckles
      ctx.strokeStyle = isShadow ? '#8b6cf0' : '#e0b64a';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx - 22, heroFootY - 80); ctx.lineTo(cx - 14, heroFootY - 80);
      ctx.moveTo(cx - 21, heroFootY - 55); ctx.lineTo(cx - 14, heroFootY - 55);
      ctx.moveTo(cx - 20, heroFootY - 30); ctx.lineTo(cx - 13, heroFootY - 30);
      ctx.stroke();

      // Right Combat Boot
      const bootGradR = ctx.createLinearGradient(cx + 10, heroFootY - 110, cx + 32, heroFootY);
      bootGradR.addColorStop(0, isShadow ? '#20233b' : '#3a3020');
      bootGradR.addColorStop(0.6, isShadow ? '#121424' : '#1e170e');
      bootGradR.addColorStop(1, '#05060b');
      ctx.fillStyle = bootGradR;
      ctx.beginPath();
      ctx.moveTo(cx + 16, heroFootY - 110);
      ctx.lineTo(cx + 28, heroFootY - 110);
      ctx.lineTo(cx + 31, heroFootY - 24);
      ctx.lineTo(cx + 38, heroFootY);       // Toe
      ctx.lineTo(cx + 17, heroFootY);       // Heel
      ctx.lineTo(cx + 15, heroFootY - 20);
      ctx.closePath();
      ctx.fill();

      // Right Boot Buckles
      ctx.beginPath();
      ctx.moveTo(cx + 17, heroFootY - 80); ctx.lineTo(cx + 28, heroFootY - 80);
      ctx.moveTo(cx + 17, heroFootY - 55); ctx.lineTo(cx + 29, heroFootY - 55);
      ctx.moveTo(cx + 16, heroFootY - 30); ctx.lineTo(cx + 30, heroFootY - 30);
      ctx.stroke();

      // ── Layer C: Torso, Tunic, Belts & Chest Harness ──
      const torsoY = heroFootY - 240 + breathe;

      // Torso Base Tunic
      const tunicGrad = ctx.createLinearGradient(cx - 30, torsoY - 110, cx + 30, torsoY);
      tunicGrad.addColorStop(0, isShadow ? '#16192e' : '#ffffff');
      tunicGrad.addColorStop(0.5, isShadow ? '#0e101f' : '#ede2ca');
      tunicGrad.addColorStop(1, isShadow ? '#070812' : '#d2c19a');
      ctx.fillStyle = tunicGrad;
      ctx.beginPath();
      ctx.moveTo(cx - 36, torsoY - 105); // Left shoulder
      ctx.lineTo(cx + 36, torsoY - 105); // Right shoulder
      ctx.lineTo(cx + 26, torsoY);       // Waist right
      ctx.lineTo(cx - 26, torsoY);       // Waist left
      ctx.closePath();
      ctx.fill();

      // Diagonal Tactical Harness / Belt across chest
      ctx.strokeStyle = isShadow ? '#06070d' : '#4a3b25';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - 32, torsoY - 95);
      ctx.lineTo(cx + 18, torsoY - 15);
      ctx.stroke();

      // Belt Buckle (Silver / Gold)
      ctx.fillStyle = isShadow ? '#8b6cf0' : '#e0b64a';
      ctx.fillRect(cx - 10, torsoY - 60, 8, 8);

      // Waist Belts & Buckles
      ctx.fillStyle = isShadow ? '#04050a' : '#2d2212';
      ctx.fillRect(cx - 27, torsoY - 18, 54, 7);
      ctx.fillRect(cx - 25, torsoY - 7, 50, 6);

      ctx.fillStyle = isShadow ? '#8b6cf0' : '#e0b64a';
      ctx.fillRect(cx - 5, torsoY - 19, 10, 9);

      // ── Layer D: Monarch Overcoat Shoulders & High Collar ──
      const shoulderGrad = ctx.createLinearGradient(cx - 48, torsoY - 110, cx + 48, torsoY - 40);
      shoulderGrad.addColorStop(0, isShadow ? '#1a1c33' : '#ffffff');
      shoulderGrad.addColorStop(0.5, isShadow ? '#0f1122' : '#f0e6d0');
      shoulderGrad.addColorStop(1, isShadow ? '#070812' : '#c9b78e');
      ctx.fillStyle = shoulderGrad;

      // Left Pauldron / Shoulder
      ctx.beginPath();
      ctx.moveTo(cx - 16, torsoY - 118);
      ctx.lineTo(cx - 46, torsoY - 108);
      ctx.lineTo(cx - 42, torsoY - 50);
      ctx.lineTo(cx - 22, torsoY - 55);
      ctx.closePath();
      ctx.fill();

      // Right Pauldron / Shoulder
      ctx.beginPath();
      ctx.moveTo(cx + 16, torsoY - 118);
      ctx.lineTo(cx + 46, torsoY - 108);
      ctx.lineTo(cx + 42, torsoY - 50);
      ctx.lineTo(cx + 22, torsoY - 55);
      ctx.closePath();
      ctx.fill();

      // High Flared Collar (signature dark fantasy anime protagonist)
      ctx.fillStyle = isShadow ? '#0d0f1e' : '#302618';
      ctx.beginPath();
      ctx.moveTo(cx - 18, torsoY - 105);
      ctx.lineTo(cx - 28, torsoY - 138); // Left collar wing
      ctx.lineTo(cx - 10, torsoY - 128);
      ctx.lineTo(cx, torsoY - 118);
      ctx.lineTo(cx + 10, torsoY - 128);
      ctx.lineTo(cx + 28, torsoY - 138); // Right collar wing
      ctx.lineTo(cx + 18, torsoY - 105);
      ctx.closePath();
      ctx.fill();

      // ── Layer E: Arms & Armored Gauntlets ──
      // Left Arm
      ctx.fillStyle = isShadow ? '#0b0d18' : '#221a10';
      ctx.beginPath();
      ctx.moveTo(cx - 42, torsoY - 100);
      ctx.lineTo(cx - 55, torsoY - 30); // Elbow
      ctx.lineTo(cx - 46, torsoY + 28); // Hand
      ctx.lineTo(cx - 36, torsoY + 28);
      ctx.lineTo(cx - 42, torsoY - 30);
      ctx.lineTo(cx - 32, torsoY - 95);
      ctx.closePath();
      ctx.fill();

      // Left Hand Gauntlet
      ctx.fillStyle = isShadow ? '#1b1d30' : '#45351f';
      ctx.fillRect(cx - 48, torsoY + 8, 12, 22);

      // Right Arm (resting naturally / holding magical aura)
      ctx.fillStyle = isShadow ? '#090b16' : '#1c150c';
      ctx.beginPath();
      ctx.moveTo(cx + 42, torsoY - 100);
      ctx.lineTo(cx + 56, torsoY - 30); // Elbow
      ctx.lineTo(cx + 48, torsoY + 28); // Hand
      ctx.lineTo(cx + 38, torsoY + 28);
      ctx.lineTo(cx + 43, torsoY - 30);
      ctx.lineTo(cx + 32, torsoY - 95);
      ctx.closePath();
      ctx.fill();

      // Right Hand Gauntlet
      ctx.fillStyle = isShadow ? '#1b1d30' : '#45351f';
      ctx.fillRect(cx + 38, torsoY + 8, 12, 22);

      // ── Layer F: Head, Face, Neck & Protagonist Hairstyle ──
      const headY = torsoY - 148;

      // Neck
      ctx.fillStyle = '#c8a482';
      ctx.fillRect(cx - 7, headY + 12, 14, 18);

      // Face
      ctx.beginPath();
      ctx.ellipse(cx, headY, 13, 17, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Protagonist Hair (layered black strands)
      ctx.fillStyle = isShadow ? '#05060b' : '#14121a';
      ctx.beginPath();
      ctx.moveTo(cx - 16, headY - 4);
      ctx.quadraticCurveTo(cx - 24, headY - 24, cx, headY - 28);
      ctx.quadraticCurveTo(cx + 24, headY - 24, cx + 16, headY - 4);
      ctx.lineTo(cx + 12, headY - 12);
      ctx.lineTo(cx + 6, headY + 2); // Front strand right
      ctx.lineTo(cx, headY - 14);
      ctx.lineTo(cx - 5, headY + 4); // Front strand center
      ctx.lineTo(cx - 10, headY - 10);
      ctx.closePath();
      ctx.fill();

      // Flowing Hair Tips
      ctx.beginPath();
      ctx.moveTo(cx - 18, headY - 12);
      ctx.lineTo(cx - 26, headY);
      ctx.lineTo(cx - 16, headY - 4);
      ctx.moveTo(cx + 18, headY - 12);
      ctx.lineTo(cx + 26, headY);
      ctx.lineTo(cx + 16, headY - 4);
      ctx.fill();

      // Glowing Anime Eye (signature Monarch blue/emerald)
      const eyeColor = isShadow ? '#35e3a0' : '#6fd6f0';
      ctx.shadowColor = eyeColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = eyeColor;
      ctx.beginPath();
      ctx.ellipse(cx - 4, headY - 2, 2.5, 1.4, -0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 4, headY - 2, 2.5, 1.4, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // ── Layer G: Dramatic Rim Light Edge Highlight ──
      // Highlight along the left and right silhouettes separating hero from darkness
      ctx.strokeStyle = isShadow ? 'rgba(139, 108, 240, 0.45)' : 'rgba(240, 218, 140, 0.6)';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      // Left silhouette line
      ctx.moveTo(cx - 46, torsoY - 108);
      ctx.lineTo(cx - 55, torsoY - 30);
      ctx.lineTo(cx - 75 + coatSway, heroFootY - 140);
      ctx.lineTo(cx - 88 + coatSway * 1.4, heroFootY - 40);
      // Right silhouette line
      ctx.moveTo(cx + 46, torsoY - 108);
      ctx.lineTo(cx + 56, torsoY - 30);
      ctx.lineTo(cx + 80 - coatSway, heroFootY - 130);
      ctx.lineTo(cx + 96 - coatSway * 1.5, heroFootY - 42);
      ctx.stroke();

      ctx.restore();

      // ══════════════════════════════════════════════════════════════
      // 3. RISING MANA SPARKS FROM PLATFORM
      // ══════════════════════════════════════════════════════════════
      platformSparks.forEach((sp) => {
        sp.y -= sp.speedY;
        sp.phase += 0.05;

        // Reset if floated above knee
        if (sp.y < -160) {
          sp.y = 10;
          sp.x = (Math.random() - 0.5) * 220;
        }

        const alpha = Math.max(0, 0.7 - Math.abs(sp.y) / 180);
        const px = cx + sp.x + Math.sin(sp.phase) * 12;
        const py = basePlatformY + sp.y;

        ctx.beginPath();
        ctx.arc(px, py, sp.size, 0, Math.PI * 2);
        ctx.fillStyle = isShadow
          ? `rgba(139, 108, 240, ${alpha})`
          : `rgba(224, 182, 74, ${alpha})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(rafId);
  }, [character.class, theme, width, height]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        margin: '0 auto',
        maxWidth: '100%',
        height: 'auto',
        pointerEvents: 'none',
      }}
    />
  );
};

