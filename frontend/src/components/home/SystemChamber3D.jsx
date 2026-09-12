import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext';

/**
 * SystemChamber3D — 3D Living System Chamber
 * - Deep obsidian chamber with 3D perspective floor grid & floating atmospheric dust
 * - Central 3D ancient circular rune dais with rotating concentric rings & dynamic XP energy ring
 * - Real 3D Orbiting Dragon Guardian: circles around the hero on an elliptical 3D orbit (15-18s period),
 *   moving in front and behind with natural banking, wing flapping, glowing eyes, and particle trail
 * - Full-body human dark-fantasy Mage hero (~50% viewport height, realistic human proportions),
 *   standing firmly on the platform with layered trench coat, silver inner lining, belts, boots,
 *   subtle idle breathing, cloth sway, and dramatic rim lighting
 */
export const SystemChamber3D = ({ xpPct = 65, isQuestFulfilling = false }) => {
  const canvasRef = useRef(null);
  const { character, theme } = useGame();
  const isShadow = theme === 'shadow';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let rafId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    // Floating dimensional embers
    const embers = Array.from({ length: 45 }, () => ({
      x: Math.random(),
      y: Math.random(),
      speedY: 0.0004 + Math.random() * 0.0008,
      speedX: (Math.random() - 0.5) * 0.0003,
      size: 1 + Math.random() * 2,
      opacity: 0.2 + Math.random() * 0.6,
      pulse: Math.random() * Math.PI * 2,
    }));

    // Guardian dragon particle trail
    const dragonTrail = [];

    const render = () => {
      time += 0.016;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      if (!W || !H) {
        rafId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, W, H);

      // ══════════════════════════════════════════════════════════════
      // 1. DEEP 3D OBSIDIAN CHAMBER & PERSPECTIVE GRID
      // ══════════════════════════════════════════════════════════════
      const horizonY = H * 0.46;
      const cx = W * 0.5;
      const floorBaseY = H * 0.82;

      // Dark atmospheric chamber background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
      if (isShadow) {
        skyGrad.addColorStop(0, '#040508');
        skyGrad.addColorStop(0.4, '#070912');
        skyGrad.addColorStop(0.7, '#0b0e1b');
        skyGrad.addColorStop(1, '#05060a');
      } else {
        skyGrad.addColorStop(0, '#f8f5ee');
        skyGrad.addColorStop(0.4, '#ede6d4');
        skyGrad.addColorStop(0.7, '#e4d9be');
        skyGrad.addColorStop(1, '#f2ede0');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Distant System Monolith Pillars (Gothic architectural silhouettes)
      ctx.fillStyle = isShadow ? 'rgba(15, 18, 34, 0.45)' : 'rgba(216, 202, 160, 0.35)';
      // Left pillars
      ctx.fillRect(W * 0.06, horizonY - 140, 28, H);
      ctx.fillRect(W * 0.14, horizonY - 100, 22, H);
      // Right pillars
      ctx.fillRect(W * 0.82, horizonY - 100, 22, H);
      ctx.fillRect(W * 0.90, horizonY - 140, 28, H);

      // Atmospheric fog along horizon
      const fogGrad = ctx.createRadialGradient(cx, horizonY, 20, cx, horizonY, W * 0.65);
      fogGrad.addColorStop(0, isShadow ? 'rgba(91, 140, 255, 0.12)' : 'rgba(224, 182, 74, 0.14)');
      fogGrad.addColorStop(0.5, isShadow ? 'rgba(139, 92, 246, 0.08)' : 'rgba(111, 214, 240, 0.08)');
      fogGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(0, horizonY - 120, W, 240);

      // 3D Perspective Floor Grid
      ctx.save();
      ctx.strokeStyle = isShadow ? 'rgba(91, 140, 255, 0.12)' : 'rgba(182, 137, 46, 0.16)';
      ctx.lineWidth = 1;

      // Longitudinal lines converging to center horizon
      const numLines = 16;
      for (let i = -numLines; i <= numLines; i++) {
        const bottomX = cx + i * (W / (numLines * 0.9));
        ctx.beginPath();
        ctx.moveTo(cx + i * 8, horizonY);
        ctx.lineTo(bottomX, H);
        ctx.stroke();
      }

      // Latitudinal distance rings
      for (let j = 1; j <= 8; j++) {
        const d = (j / 8) ** 2;
        const lineY = horizonY + d * (H - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(W, lineY);
        ctx.stroke();
      }
      ctx.restore();

      // ══════════════════════════════════════════════════════════════
      // 2. ORBITING 3D GUARDIAN CREATURE (DRAGON) — BEHIND PASS
      // Elliptical 3D orbit: period ~16s
      // ══════════════════════════════════════════════════════════════
      const orbitPeriod = 16; // seconds per orbit
      const orbitAngle = ((time / orbitPeriod) * Math.PI * 2) % (Math.PI * 2);

      // 3D Orbit Coordinates
      // X: horizontal ellipse, Y: elevation tilt, Z: depth (-1 = behind hero, +1 = in front)
      const orbitRadiusX = W * 0.32;
      const orbitRadiusY = 75;
      const orbitZ = Math.sin(orbitAngle); // -1 to 1
      const isGuardianBehind = orbitZ < 0;

      const guardianX = cx + Math.cos(orbitAngle) * orbitRadiusX;
      const guardianY = floorBaseY - 240 + Math.sin(orbitAngle) * orbitRadiusY * 0.4 - Math.abs(Math.sin(orbitAngle * 2)) * 30;
      // Scale: 0.65 when behind, 1.15 when in front
      const guardianScale = 0.85 + orbitZ * 0.3;
      const guardianAlpha = isGuardianBehind ? 0.65 + (orbitZ + 1) * 0.25 : 1.0;

      // Function to render the 3D guardian dragon at its current position
      const drawGuardian = () => {
        ctx.save();
        ctx.translate(guardianX, guardianY);
        ctx.scale(guardianScale, guardianScale);
        ctx.globalAlpha = guardianAlpha;

        // Determine orientation angle based on orbit motion direction
        const velocityX = -Math.sin(orbitAngle);
        const flipX = velocityX < 0 ? -1 : 1;
        ctx.scale(flipX, 1);

        // Wing flap cycle (flaps ~2.2x per second)
        const wingFlap = Math.sin(time * 6.5) * 22;

        // Guardian Energy Trail
        dragonTrail.push({ x: guardianX, y: guardianY, alpha: 0.7, scale: guardianScale });
        if (dragonTrail.length > 25) dragonTrail.shift();

        // ── Guardian Serpentine Body ──
        ctx.fillStyle = isShadow ? '#080a14' : '#ffffff';
        ctx.strokeStyle = isShadow ? '#35e3a0' : '#d4af37';
        ctx.lineWidth = 1.6;

        // Body segments
        ctx.beginPath();
        ctx.moveTo(35, 0);
        ctx.quadraticCurveTo(15, -12, -25, 4);
        ctx.quadraticCurveTo(-55, 14, -85, -5);
        ctx.quadraticCurveTo(-50, 22, -20, 14);
        ctx.quadraticCurveTo(15, 6, 35, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Wings (sweeping fantasy draconic wings)
        ctx.fillStyle = isShadow ? 'rgba(15, 20, 36, 0.9)' : 'rgba(245, 238, 220, 0.95)';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(-25, -55 + wingFlap);
        ctx.lineTo(-60, -68 + wingFlap * 1.2);
        ctx.lineTo(-45, -25 + wingFlap * 0.8);
        ctx.lineTo(-20, -10);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Horned Dragon Head
        ctx.fillStyle = isShadow ? '#0a0d1c' : '#ffffff';
        ctx.beginPath();
        ctx.moveTo(30, -5);
        ctx.lineTo(55, -2);   // Snout
        ctx.lineTo(44, 8);    // Jaw
        ctx.lineTo(24, 6);
        ctx.lineTo(16, -14);  // Horn
        ctx.lineTo(12, -8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Swept Horn
        ctx.strokeStyle = isShadow ? '#35e3a0' : '#e0b64a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(20, -10);
        ctx.quadraticCurveTo(10, -32, -8, -42);
        ctx.stroke();

        // Glowing Eye (piercing emerald / cyan)
        const eyeColor = isShadow ? '#35e3a0' : '#22d3ee';
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(38, -1, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      };

      // Draw Guardian behind if in back half of orbit
      if (isGuardianBehind) {
        drawGuardian();
      }

      // ══════════════════════════════════════════════════════════════
      // 3. MAGICAL RUNE PLATFORM & FLOATING CIRCULAR XP RING
      // ══════════════════════════════════════════════════════════════

      // Platform Outer Glow
      const daisRadiusX = Math.min(W * 0.26, 175);
      const daisRadiusY = daisRadiusX * 0.28;

      const daisGlow = ctx.createRadialGradient(cx, floorBaseY, 20, cx, floorBaseY, daisRadiusX * 1.4);
      daisGlow.addColorStop(0, isShadow ? 'rgba(139, 92, 246, 0.22)' : 'rgba(214, 168, 79, 0.26)');
      daisGlow.addColorStop(0.6, isShadow ? 'rgba(53, 227, 160, 0.08)' : 'rgba(34, 211, 238, 0.08)');
      daisGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = daisGlow;
      ctx.beginPath();
      ctx.ellipse(cx, floorBaseY, daisRadiusX * 1.4, daisRadiusY * 1.4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Stone Platform Surface (3D Bevel)
      ctx.fillStyle = isShadow ? '#090c18' : '#e5dac2';
      ctx.beginPath();
      ctx.ellipse(cx, floorBaseY + 12, daisRadiusX, daisRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = isShadow ? '#121628' : '#fcf8ee';
      ctx.beginPath();
      ctx.ellipse(cx, floorBaseY, daisRadiusX, daisRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rotating Concentric Ancient Rune Rings
      const ringAngle = time * 0.15;
      ctx.save();
      ctx.lineWidth = 1.4;

      // Outer Rune Ring
      ctx.strokeStyle = isShadow ? 'rgba(139, 92, 246, 0.55)' : 'rgba(214, 168, 79, 0.65)';
      ctx.beginPath();
      ctx.ellipse(cx, floorBaseY, daisRadiusX * 0.9, daisRadiusY * 0.9, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Middle Runic Inscriptions (small notches radiating around)
      for (let k = 0; k < 24; k++) {
        const a = ringAngle + (k / 24) * Math.PI * 2;
        const rx1 = cx + Math.cos(a) * daisRadiusX * 0.88;
        const ry1 = floorBaseY + Math.sin(a) * daisRadiusY * 0.88;
        const rx2 = cx + Math.cos(a) * daisRadiusX * 0.76;
        const ry2 = floorBaseY + Math.sin(a) * daisRadiusY * 0.76;
        ctx.beginPath();
        ctx.moveTo(rx1, ry1);
        ctx.lineTo(rx2, ry2);
        ctx.stroke();
      }

      // ── THE HOLOGRAPHIC XP ENERGY RING ──
      // Dynamic XP ring encircling the hero on the platform
      const xpRingRadiusX = daisRadiusX * 0.72;
      const xpRingRadiusY = daisRadiusY * 0.72;
      const xpEndAngle = -Math.PI * 0.5 + (xpPct / 100) * Math.PI * 2;

      // XP Track Base
      ctx.strokeStyle = isShadow ? 'rgba(91, 140, 255, 0.2)' : 'rgba(214, 168, 79, 0.25)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, floorBaseY, xpRingRadiusX, xpRingRadiusY, 0, 0, Math.PI * 2);
      ctx.stroke();

      // XP Active Illuminated Arc
      ctx.strokeStyle = isShadow ? '#5b8cff' : '#d4af37';
      ctx.lineWidth = 3.5;
      ctx.shadowColor = isShadow ? '#7aa2ff' : '#f0cc6a';
      ctx.shadowBlur = isQuestFulfilling ? 20 : 10;
      ctx.beginPath();
      ctx.ellipse(cx, floorBaseY, xpRingRadiusX, xpRingRadiusY, 0, -Math.PI * 0.5, xpEndAngle);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();

      // Hero Floor Contact Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.ellipse(cx, floorBaseY - 3, 55, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // ══════════════════════════════════════════════════════════════
      // 4. THE CENTRAL HERO — FULL BODY MAGE PROTAGONIST (~50% HEIGHT)
      // Height: ~380-420px tall, realistic human anatomy (~8 heads tall)
      // ══════════════════════════════════════════════════════════════
      const heroFootY = floorBaseY - 4;
      const breathe = Math.sin(time * 1.8) * 2.5;
      const coatWind = Math.sin(time * 1.4) * 4;

      ctx.save();

      // ── Layer 1: Flowing Trench Coat Back Wings (Dark with Silver/White Lining) ──
      // Left Wing
      ctx.fillStyle = isShadow ? '#090b14' : '#221e17';
      ctx.beginPath();
      ctx.moveTo(cx - 24, heroFootY - 210);
      ctx.quadraticCurveTo(cx - 70 + coatWind, heroFootY - 120, cx - 82 + coatWind * 1.4, heroFootY - 32);
      ctx.lineTo(cx - 30, heroFootY - 28);
      ctx.quadraticCurveTo(cx - 32, heroFootY - 130, cx - 12, heroFootY - 210);
      ctx.closePath();
      ctx.fill();

      // Silver/White Interior Lining on Left Coat Flap
      ctx.fillStyle = isShadow ? '#e0e4f5' : '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx - 30, heroFootY - 28);
      ctx.lineTo(cx - 44, heroFootY - 40);
      ctx.quadraticCurveTo(cx - 62 + coatWind, heroFootY - 110, cx - 18, heroFootY - 195);
      ctx.lineTo(cx - 12, heroFootY - 210);
      ctx.quadraticCurveTo(cx - 32, heroFootY - 130, cx - 30, heroFootY - 28);
      ctx.closePath();
      ctx.fill();

      // Right Wing
      ctx.fillStyle = isShadow ? '#080a12' : '#1d1912';
      ctx.beginPath();
      ctx.moveTo(cx + 24, heroFootY - 210);
      ctx.quadraticCurveTo(cx + 75 - coatWind, heroFootY - 110, cx + 88 - coatWind * 1.5, heroFootY - 34);
      ctx.lineTo(cx + 32, heroFootY - 28);
      ctx.quadraticCurveTo(cx + 32, heroFootY - 130, cx + 12, heroFootY - 210);
      ctx.closePath();
      ctx.fill();

      // Silver/White Interior Lining on Right Coat Flap
      ctx.fillStyle = isShadow ? '#d4daf0' : '#f4edd8';
      ctx.beginPath();
      ctx.moveTo(cx + 32, heroFootY - 28);
      ctx.lineTo(cx + 50, heroFootY - 42);
      ctx.quadraticCurveTo(cx + 66 - coatWind, heroFootY - 100, cx + 22, heroFootY - 195);
      ctx.lineTo(cx + 12, heroFootY - 210);
      ctx.quadraticCurveTo(cx + 32, heroFootY - 130, cx + 32, heroFootY - 28);
      ctx.closePath();
      ctx.fill();

      // ── Layer 2: Fitted Trousers & Buckled Combat Boots ──
      // Left Leg
      ctx.fillStyle = isShadow ? '#0d0f1c' : '#1d1a15';
      ctx.beginPath();
      ctx.moveTo(cx - 22, heroFootY - 200);
      ctx.lineTo(cx - 11, heroFootY - 200);
      ctx.lineTo(cx - 13, heroFootY - 95); // Knee
      ctx.lineTo(cx - 20, heroFootY - 95);
      ctx.closePath();
      ctx.fill();

      // Right Leg
      ctx.beginPath();
      ctx.moveTo(cx + 11, heroFootY - 200);
      ctx.lineTo(cx + 24, heroFootY - 200);
      ctx.lineTo(cx + 26, heroFootY - 95); // Knee
      ctx.lineTo(cx + 15, heroFootY - 95);
      ctx.closePath();
      ctx.fill();

      // Left Knee-High Combat Boot
      const bootL = ctx.createLinearGradient(cx - 26, heroFootY - 95, cx - 10, heroFootY);
      bootL.addColorStop(0, isShadow ? '#1a1d30' : '#35291b');
      bootL.addColorStop(0.7, isShadow ? '#0f1122' : '#1d160e');
      bootL.addColorStop(1, '#04050a');
      ctx.fillStyle = bootL;
      ctx.beginPath();
      ctx.moveTo(cx - 20, heroFootY - 95);
      ctx.lineTo(cx - 13, heroFootY - 95);
      ctx.lineTo(cx - 12, heroFootY - 16);
      ctx.lineTo(cx - 8, heroFootY);
      ctx.lineTo(cx - 28, heroFootY);
      ctx.lineTo(cx - 21, heroFootY - 20);
      ctx.closePath();
      ctx.fill();

      // Silver Boot Straps
      ctx.strokeStyle = isShadow ? '#7aa2ff' : '#d4af37';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx - 20, heroFootY - 70); ctx.lineTo(cx - 13, heroFootY - 70);
      ctx.moveTo(cx - 19, heroFootY - 48); ctx.lineTo(cx - 13, heroFootY - 48);
      ctx.moveTo(cx - 18, heroFootY - 26); ctx.lineTo(cx - 12, heroFootY - 26);
      ctx.stroke();

      // Right Knee-High Combat Boot
      const bootR = ctx.createLinearGradient(cx + 10, heroFootY - 95, cx + 30, heroFootY);
      bootR.addColorStop(0, isShadow ? '#1d2036' : '#3a2d1d');
      bootR.addColorStop(0.7, isShadow ? '#111324' : '#1e160e');
      bootR.addColorStop(1, '#04050a');
      ctx.fillStyle = bootR;
      ctx.beginPath();
      ctx.moveTo(cx + 15, heroFootY - 95);
      ctx.lineTo(cx + 26, heroFootY - 95);
      ctx.lineTo(cx + 28, heroFootY - 20);
      ctx.lineTo(cx + 34, heroFootY);
      ctx.lineTo(cx + 15, heroFootY);
      ctx.lineTo(cx + 14, heroFootY - 16);
      ctx.closePath();
      ctx.fill();

      // Right Silver Straps
      ctx.beginPath();
      ctx.moveTo(cx + 15, heroFootY - 70); ctx.lineTo(cx + 25, heroFootY - 70);
      ctx.moveTo(cx + 15, heroFootY - 48); ctx.lineTo(cx + 26, heroFootY - 48);
      ctx.moveTo(cx + 14, heroFootY - 26); ctx.lineTo(cx + 27, heroFootY - 26);
      ctx.stroke();

      // ── Layer 3: Torso, Tunic, Belts & Chest Straps ──
      const torsoY = heroFootY - 205 + breathe;

      // Fitted Tunic with Shadow/Light Gradient
      const tunic = ctx.createLinearGradient(cx - 28, torsoY - 95, cx + 28, torsoY);
      tunic.addColorStop(0, isShadow ? '#171a30' : '#ffffff');
      tunic.addColorStop(0.5, isShadow ? '#0e101f' : '#ede3cb');
      tunic.addColorStop(1, isShadow ? '#070812' : '#d2c19a');
      ctx.fillStyle = tunic;
      ctx.beginPath();
      ctx.moveTo(cx - 32, torsoY - 90); // Left shoulder
      ctx.lineTo(cx + 32, torsoY - 90); // Right shoulder
      ctx.lineTo(cx + 22, torsoY);       // Right waist
      ctx.lineTo(cx - 22, torsoY);       // Left waist
      ctx.closePath();
      ctx.fill();

      // Tactical Cross Harness with Silver Buckle
      ctx.strokeStyle = isShadow ? '#04050a' : '#3e301e';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(cx - 28, torsoY - 82);
      ctx.lineTo(cx + 16, torsoY - 12);
      ctx.stroke();

      ctx.fillStyle = isShadow ? '#7aa2ff' : '#d4af37';
      ctx.fillRect(cx - 8, torsoY - 50, 7, 7);

      // Double Waist Belts
      ctx.fillStyle = isShadow ? '#05060b' : '#281e12';
      ctx.fillRect(cx - 23, torsoY - 16, 46, 6);
      ctx.fillRect(cx - 21, torsoY - 6, 42, 5);
      ctx.fillStyle = isShadow ? '#7aa2ff' : '#d4af37';
      ctx.fillRect(cx - 4, torsoY - 17, 8, 8);

      // ── Layer 4: Overcoat Pauldrons & Flared High Collar ──
      const coatShoulder = ctx.createLinearGradient(cx - 42, torsoY - 95, cx + 42, torsoY - 35);
      coatShoulder.addColorStop(0, isShadow ? '#1b1d34' : '#ffffff');
      coatShoulder.addColorStop(0.5, isShadow ? '#101222' : '#efe5cf');
      coatShoulder.addColorStop(1, isShadow ? '#080912' : '#cab88e');
      ctx.fillStyle = coatShoulder;

      // Left Pauldron
      ctx.beginPath();
      ctx.moveTo(cx - 14, torsoY - 104);
      ctx.lineTo(cx - 42, torsoY - 94);
      ctx.lineTo(cx - 38, torsoY - 42);
      ctx.lineTo(cx - 18, torsoY - 48);
      ctx.closePath();
      ctx.fill();

      // Right Pauldron
      ctx.beginPath();
      ctx.moveTo(cx + 14, torsoY - 104);
      ctx.lineTo(cx + 42, torsoY - 94);
      ctx.lineTo(cx + 38, torsoY - 42);
      ctx.lineTo(cx + 18, torsoY - 48);
      ctx.closePath();
      ctx.fill();

      // Flared High Collar
      ctx.fillStyle = isShadow ? '#0d0f1e' : '#302618';
      ctx.beginPath();
      ctx.moveTo(cx - 16, torsoY - 90);
      ctx.lineTo(cx - 25, torsoY - 124); // Left wing
      ctx.lineTo(cx - 8,  torsoY - 114);
      ctx.lineTo(cx,      torsoY - 104);
      ctx.lineTo(cx + 8,  torsoY - 114);
      ctx.lineTo(cx + 25, torsoY - 124); // Right wing
      ctx.lineTo(cx + 16, torsoY - 90);
      ctx.closePath();
      ctx.fill();

      // ── Layer 5: Arms & Armored Gauntlets ──
      // Left Arm
      ctx.fillStyle = isShadow ? '#0b0d18' : '#221a10';
      ctx.beginPath();
      ctx.moveTo(cx - 38, torsoY - 88);
      ctx.lineTo(cx - 50, torsoY - 25);
      ctx.lineTo(cx - 42, torsoY + 26);
      ctx.lineTo(cx - 32, torsoY + 26);
      ctx.lineTo(cx - 38, torsoY - 25);
      ctx.lineTo(cx - 28, torsoY - 84);
      ctx.closePath();
      ctx.fill();
      // Gauntlet
      ctx.fillStyle = isShadow ? '#1b1d30' : '#45351f';
      ctx.fillRect(cx - 44, torsoY + 6, 11, 20);

      // Right Arm (channeling subtle mana orb at fingertips)
      ctx.fillStyle = isShadow ? '#0a0c16' : '#1c150c';
      ctx.beginPath();
      ctx.moveTo(cx + 38, torsoY - 88);
      ctx.lineTo(cx + 52, torsoY - 25);
      ctx.lineTo(cx + 44, torsoY + 26);
      ctx.lineTo(cx + 34, torsoY + 26);
      ctx.lineTo(cx + 40, torsoY - 25);
      ctx.lineTo(cx + 28, torsoY - 84);
      ctx.closePath();
      ctx.fill();
      // Gauntlet
      ctx.fillStyle = isShadow ? '#1b1d30' : '#45351f';
      ctx.fillRect(cx + 35, torsoY + 6, 11, 20);

      // Subtle Arcane Orb in Right Hand
      const orbPulse = 0.5 + Math.sin(time * 3) * 0.4;
      const orbColor = isShadow ? 'rgba(122, 162, 255, ' : 'rgba(214, 168, 79, ';
      ctx.fillStyle = `${orbColor}${0.8 * orbPulse})`;
      ctx.shadowColor = isShadow ? '#7aa2ff' : '#f0cc6a';
      ctx.shadowBlur = 14 * orbPulse;
      ctx.beginPath();
      ctx.arc(cx + 42, torsoY + 32, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // ── Layer 6: Head, Face, Neck & Anime Hair ──
      const headY = torsoY - 132;

      // Neck
      ctx.fillStyle = '#c5a080';
      ctx.fillRect(cx - 6, headY + 10, 12, 16);

      // Face
      ctx.beginPath();
      ctx.ellipse(cx, headY, 11, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Anime Protagonist Tousled Black Hair
      ctx.fillStyle = isShadow ? '#06070d' : '#14121a';
      ctx.beginPath();
      ctx.moveTo(cx - 14, headY - 3);
      ctx.quadraticCurveTo(cx - 22, headY - 22, cx, headY - 25);
      ctx.quadraticCurveTo(cx + 22, headY - 22, cx + 14, headY - 3);
      ctx.lineTo(cx + 10, headY - 10);
      ctx.lineTo(cx + 5, headY + 1);  // Front strand right
      ctx.lineTo(cx, headY - 12);
      ctx.lineTo(cx - 4, headY + 3);  // Front strand center
      ctx.lineTo(cx - 9, headY - 8);
      ctx.closePath();
      ctx.fill();

      // Flowing Hair Ends
      ctx.beginPath();
      ctx.moveTo(cx - 16, headY - 10); ctx.lineTo(cx - 24, headY); ctx.lineTo(cx - 14, headY - 3);
      ctx.moveTo(cx + 16, headY - 10); ctx.lineTo(cx + 24, headY); ctx.lineTo(cx + 14, headY - 3);
      ctx.fill();

      // Glowing Anime Slit Eyes (Monarch purple/emerald)
      const eyeC = isShadow ? '#7aa2ff' : '#22d3ee';
      ctx.shadowColor = eyeC;
      ctx.shadowBlur = 8;
      ctx.fillStyle = eyeC;
      ctx.beginPath();
      ctx.ellipse(cx - 3.5, headY - 2, 2.2, 1.2, -0.1, 0, Math.PI * 2);
      ctx.ellipse(cx + 3.5, headY - 2, 2.2, 1.2, 0.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // ── Layer 7: Dramatic Holographic Rim Lighting ──
      // Sharp separation highlight along shoulders and flowing coat
      ctx.strokeStyle = isShadow ? 'rgba(122, 162, 255, 0.45)' : 'rgba(214, 168, 79, 0.55)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      // Left rim line
      ctx.moveTo(cx - 42, torsoY - 94);
      ctx.lineTo(cx - 50, torsoY - 25);
      ctx.lineTo(cx - 70 + coatWind, heroFootY - 120);
      ctx.lineTo(cx - 82 + coatWind * 1.4, heroFootY - 32);
      // Right rim line
      ctx.moveTo(cx + 42, torsoY - 94);
      ctx.lineTo(cx + 52, torsoY - 25);
      ctx.lineTo(cx + 75 - coatWind, heroFootY - 110);
      ctx.lineTo(cx + 88 - coatWind * 1.5, heroFootY - 34);
      ctx.stroke();

      ctx.restore();

      // ══════════════════════════════════════════════════════════════
      // 5. ORBITING 3D GUARDIAN CREATURE — IN FRONT PASS
      // ══════════════════════════════════════════════════════════════
      if (!isGuardianBehind) {
        drawGuardian();
      }

      // Draw Guardian Particle Trail
      dragonTrail.forEach((tp, i) => {
        tp.alpha -= 0.025;
        if (tp.alpha > 0) {
          ctx.fillStyle = isShadow
            ? `rgba(53, 227, 160, ${tp.alpha * 0.4})`
            : `rgba(214, 168, 79, ${tp.alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(tp.x, tp.y, 4 * tp.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // ══════════════════════════════════════════════════════════════
      // 6. RISING MANA EMBERS IN THE CHAMBER
      // ══════════════════════════════════════════════════════════════
      embers.forEach((em) => {
        em.y -= em.speedY;
        em.x += em.speedX;
        em.pulse += 0.03;

        if (em.y < 0.1) {
          em.y = 0.9;
          em.x = Math.random();
        }

        const alpha = Math.max(0, Math.sin(em.pulse)) * em.opacity;
        const px = em.x * W;
        const py = em.y * H;

        ctx.beginPath();
        ctx.arc(px, py, em.size, 0, Math.PI * 2);
        ctx.fillStyle = isShadow
          ? `rgba(122, 162, 255, ${alpha})`
          : `rgba(214, 168, 79, ${alpha})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [character.class, theme, xpPct, isQuestFulfilling]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

