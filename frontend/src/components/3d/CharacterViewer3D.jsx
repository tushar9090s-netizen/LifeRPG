import React, { useRef, useEffect, useState } from 'react';
import { CLASSES, INITIAL_EQUIPMENT_CATALOG } from '../../types/gameData.js';
import { useGame } from '../../state/GameContext.jsx';

export const CharacterViewer3D = ({
  classId,
  equipped,
  compact = false,
  height = 360,
  interactive = true,
  showRarityEffects = true
}) => {
  const canvasRef = useRef(null);
  const { theme } = useGame();
  const [rotationY, setRotationY] = useState(0);
  const isDraggingRef = useRef(false);
  const lastMouseXRef = useRef(0);

  const targetClassId = classId || 'knight';
  const classData = CLASSES[targetClassId] || CLASSES.knight;

  // Resolve equipped items
  const getItem = (slot) => {
    const itemId = equipped?.[slot];
    if (!itemId) return null;
    return INITIAL_EQUIPMENT_CATALOG.find(i => i.id === itemId);
  };

  const headItem = getItem('head');
  const bodyItem = getItem('body');
  const legsItem = getItem('legs');
  const feetItem = getItem('feet');

  // Determine highest rarity equipped for visual particle tier escalation
  const rarityOrder = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  const highestRarity = [headItem, bodyItem, legsItem, feetItem]
    .filter(Boolean)
    .reduce((highest, item) => {
      const currIdx = rarityOrder.indexOf(item.rarity);
      const highIdx = rarityOrder.indexOf(highest);
      return currIdx > highIdx ? item.rarity : highest;
    }, 'Common');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth || 320);
    let canvasHeight = (canvas.height = height);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 320;
      canvasHeight = canvas.height = height;
    };

    window.addEventListener('resize', handleResize);

    // Particle pool for Rare / Epic / Legendary / Mythic tiers
    const particles = [];
    const maxParticles = highestRarity === 'Mythic' ? 36 : highestRarity === 'Legendary' ? 26 : highestRarity === 'Epic' ? 16 : highestRarity === 'Rare' ? 8 : 0;

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 120,
        y: (Math.random() - 0.5) * 180,
        vy: -0.4 - Math.random() * 0.8,
        vx: (Math.random() - 0.5) * 0.4,
        size: 1.5 + Math.random() * 2.5,
        alpha: Math.random(),
        hueOffset: Math.random() * 40
      });
    }

    let startTime = null;

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * (compact ? 0.62 : 0.54);
      const scale = (height / 360) * (compact ? 1.15 : 1.0);

      // Idle breathing and cloth drift loops
      const breath = Math.sin(elapsed * 0.0022) * 3;
      const clothDrift = Math.sin(elapsed * 0.003) * 5;
      const gesture = Math.sin(elapsed * 0.0018);

      // Rotation matrix values
      const currentRot = rotationY;
      const cosR = Math.cos(currentRot);
      const sinR = Math.sin(currentRot);

      // Background volumetric lighting & rim light
      const isDivine = theme === 'divine';
      const rimLightColor = isDivine ? 'rgba(230, 200, 140, 0.22)' : 'rgba(139, 108, 240, 0.25)';
      const auraColor = classData.palette.glow;

      // Soft back-fog pedestal glow
      const radialFog = ctx.createRadialGradient(cx, cy, 10 * scale, cx, cy, 150 * scale);
      radialFog.addColorStop(0, rimLightColor);
      radialFog.addColorStop(0.6, 'rgba(0, 0, 0, 0.05)');
      radialFog.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialFog;
      ctx.fillRect(0, 0, width, height);

      // Shadow on floor
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(cx, cy + 130 * scale, 55 * scale, 14 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = isDivine ? 'rgba(80, 70, 50, 0.25)' : 'rgba(0, 0, 0, 0.55)';
      ctx.fill();
      ctx.restore();

      // Render Aura for Epic, Legendary, Mythic pieces
      if (showRarityEffects && (highestRarity === 'Epic' || highestRarity === 'Legendary' || highestRarity === 'Mythic')) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy - 20 * scale, (85 + Math.sin(elapsed * 0.004) * 6) * scale, 0, Math.PI * 2);
        const auraGrad = ctx.createRadialGradient(cx, cy - 20 * scale, 30 * scale, cx, cy - 20 * scale, 95 * scale);
        auraGrad.addColorStop(0, 'transparent');
        auraGrad.addColorStop(0.7, highestRarity === 'Mythic' ? 'rgba(180, 100, 255, 0.15)' : 'rgba(var(--creature-glow-rgb), 0.16)');
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.fill();
        ctx.restore();
      }

      // Draw Character Silhouette & 3D Layering
      ctx.save();
      ctx.translate(cx, cy);

      // Helper function to project 3D point with Y-rotation
      const project = (x, y, z) => {
        const rotX = x * cosR - z * sinR;
        const rotZ = x * sinR + z * cosR;
        return {
          x: rotX * scale,
          y: (y + breath * (y < 0 ? 0.8 : 0.2)) * scale,
          z: rotZ
        };
      };

      // 1. CAPE / BACK CLOTH LAYER (behind character)
      const capeGrad = ctx.createLinearGradient(0, -60 * scale, 0, 120 * scale);
      capeGrad.addColorStop(0, classData.palette.cloth);
      capeGrad.addColorStop(1, '#080910');

      ctx.beginPath();
      const cp1 = project(-30, -30, -12);
      const cp2 = project(30, -30, -12);
      const cp3 = project(45 + clothDrift, 110, -16);
      const cp4 = project(-45 + clothDrift * 0.7, 110, -16);

      ctx.moveTo(cp1.x, cp1.y);
      ctx.lineTo(cp2.x, cp2.y);
      ctx.quadraticCurveTo(project(25, 60, -14).x, project(25, 60, -14).y, cp3.x, cp3.y);
      ctx.lineTo(cp4.x, cp4.y);
      ctx.quadraticCurveTo(project(-25, 60, -14).x, project(-25, 60, -14).y, cp1.x, cp1.y);
      ctx.fillStyle = capeGrad;
      ctx.fill();
      ctx.strokeStyle = classData.palette.trim;
      ctx.lineWidth = 1;
      ctx.stroke();

      // 2. LEGS & FEET LAYER
      const legColor = feetItem ? classData.palette.armor : '#151720';
      ctx.beginPath();
      // Left leg
      const l1 = project(-16, 45, 0);
      const l2 = project(-8, 45, 0);
      const l3 = project(-10, 120, 2);
      const l4 = project(-22, 120, 2);
      ctx.moveTo(l1.x, l1.y);
      ctx.lineTo(l2.x, l2.y);
      ctx.lineTo(l3.x, l3.y);
      ctx.lineTo(l4.x, l4.y);
      ctx.closePath();

      // Right leg
      const r1 = project(8, 45, 0);
      const r2 = project(16, 45, 0);
      const r3 = project(22, 120, 2);
      const r4 = project(10, 120, 2);
      ctx.moveTo(r1.x, r1.y);
      ctx.lineTo(r2.x, r2.y);
      ctx.lineTo(r3.x, r3.y);
      ctx.lineTo(r4.x, r4.y);
      ctx.closePath();

      ctx.fillStyle = legColor;
      ctx.fill();
      ctx.strokeStyle = '#05060a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Feet sabatons / boots
      ctx.beginPath();
      const fL = project(-16, 125, 6);
      const fR = project(16, 125, 6);
      ctx.arc(fL.x, fL.y, 8 * scale, 0, Math.PI * 2);
      ctx.arc(fR.x, fR.y, 8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = classData.palette.trim;
      ctx.fill();

      // 3. TORSO / BODY LAYER
      const bodyColor = bodyItem ? classData.palette.armor : '#1a1d28';
      const bodyGrad = ctx.createLinearGradient(0, -45 * scale, 0, 45 * scale);
      bodyGrad.addColorStop(0, classData.palette.trim);
      bodyGrad.addColorStop(0.2, bodyColor);
      bodyGrad.addColorStop(1, '#0a0d14');

      ctx.beginPath();
      const t1 = project(-28, -35, 4); // Left shoulder
      const t2 = project(28, -35, 4);  // Right shoulder
      const t3 = project(16, 45, 2);   // Right waist
      const t4 = project(-16, 45, 2);  // Left waist
      ctx.moveTo(t1.x, t1.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.lineTo(t4.x, t4.y);
      ctx.closePath();
      ctx.fillStyle = bodyGrad;
      ctx.fill();
      ctx.strokeStyle = classData.palette.trim;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Chestplate emblem or sigil
      const chestCenter = project(0, -10, 8);
      ctx.beginPath();
      ctx.arc(chestCenter.x, chestCenter.y, 7 * scale, 0, Math.PI * 2);
      ctx.fillStyle = auraColor;
      ctx.shadowColor = auraColor;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. CLASS-SPECIFIC ARMS & SIGNATURE WEAPON / GESTURE
      if (targetClassId === 'knight') {
        // Knight: broad posture holding large 2-handed greatsword at rest
        const hL = project(-24, 0, 10);
        const hR = project(0, 18, 14);
        ctx.beginPath();
        ctx.moveTo(project(-28, -32, 4).x, project(-28, -32, 4).y);
        ctx.lineTo(hL.x, hL.y);
        ctx.lineTo(hR.x, hR.y);
        ctx.strokeStyle = classData.palette.armor;
        ctx.lineWidth = 7 * scale;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Greatsword
        const bladeTop = project(0, -55 + gesture * 2, 14);
        const bladeBot = project(0, 115, 14);
        ctx.beginPath();
        ctx.moveTo(bladeTop.x, bladeTop.y);
        ctx.lineTo(bladeBot.x, bladeBot.y);
        ctx.strokeStyle = '#d0d8e8';
        ctx.lineWidth = 5 * scale;
        ctx.stroke();
        // Crossguard
        ctx.beginPath();
        const cgL = project(-18, 12, 14);
        const cgR = project(18, 12, 14);
        ctx.moveTo(cgL.x, cgL.y);
        ctx.lineTo(cgR.x, cgR.y);
        ctx.strokeStyle = classData.palette.trim;
        ctx.lineWidth = 4 * scale;
        ctx.stroke();
      } else if (targetClassId === 'mage') {
        // Mage: one hand raised with floating arcane orb
        const handUp = project(28, -25 + gesture * 4, 12);
        ctx.beginPath();
        ctx.moveTo(project(28, -35, 4).x, project(28, -35, 4).y);
        ctx.lineTo(handUp.x, handUp.y);
        ctx.strokeStyle = classData.palette.cloth;
        ctx.lineWidth = 6 * scale;
        ctx.stroke();

        // Glowing Arcane Orb with pulse
        const orbPos = project(34, -45 + gesture * 5, 14);
        ctx.beginPath();
        ctx.arc(orbPos.x, orbPos.y, (8 + Math.sin(elapsed * 0.005) * 2) * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#6fa8ff';
        ctx.shadowColor = '#4a80e8';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (targetClassId === 'assassin') {
        // Assassin: twin curved daggers held low and ready
        const dL1 = project(-25, 30 + gesture * 3, 12);
        const dL2 = project(-42, 60 + gesture * 3, 14);
        const dR1 = project(25, 30 - gesture * 3, 12);
        const dR2 = project(42, 60 - gesture * 3, 14);

        ctx.beginPath();
        ctx.moveTo(dL1.x, dL1.y);
        ctx.lineTo(dL2.x, dL2.y);
        ctx.moveTo(dR1.x, dR1.y);
        ctx.lineTo(dR2.x, dR2.y);
        ctx.strokeStyle = '#c48bff';
        ctx.shadowColor = '#8b6cf0';
        ctx.shadowBlur = 10;
        ctx.lineWidth = 3.5 * scale;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (targetClassId === 'alchemist') {
        // Alchemist: holding glowing green potion vial
        const vialPos = project(26, 8 + gesture * 3, 12);
        ctx.beginPath();
        ctx.arc(vialPos.x, vialPos.y, 7 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#35e3a0';
        ctx.shadowColor = '#35e3a0';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (targetClassId === 'summoner') {
        // Summoner: dark spectral flame familiar coiling
        const flamePos = project(-28, -20 + gesture * 4, 14);
        ctx.beginPath();
        ctx.arc(flamePos.x, flamePos.y, (9 + Math.sin(elapsed * 0.006) * 3) * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#9c66ff';
        ctx.shadowColor = '#6d4ae8';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 5. HEAD & HELM / HAT LAYER
      const headCenter = project(0, -56, 6);

      // Head silhouette
      ctx.beginPath();
      ctx.arc(headCenter.x, headCenter.y, 14 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#1b1d28';
      ctx.fill();

      // Class-specific headwear
      if (targetClassId === 'knight') {
        // Crested Horned Helm
        ctx.beginPath();
        ctx.arc(headCenter.x, headCenter.y - 2 * scale, 15 * scale, 0, Math.PI * 2);
        ctx.fillStyle = classData.palette.armor;
        ctx.fill();
        ctx.strokeStyle = classData.palette.trim;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Visor slit
        const visor = project(0, -55, 16);
        ctx.beginPath();
        ctx.moveTo(visor.x - 7 * scale, visor.y);
        ctx.lineTo(visor.x + 7 * scale, visor.y);
        ctx.strokeStyle = auraColor;
        ctx.shadowColor = auraColor;
        ctx.shadowBlur = 6;
        ctx.lineWidth = 2 * scale;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (targetClassId === 'mage') {
        // Wide-brim pointed hat
        const brimL = project(-32, -56, 12);
        const brimR = project(32, -56, 12);
        const hatTip = project(4, -98, 8);
        ctx.beginPath();
        ctx.moveTo(brimL.x, brimL.y);
        ctx.lineTo(brimR.x, brimR.y);
        ctx.lineTo(hatTip.x, hatTip.y);
        ctx.closePath();
        ctx.fillStyle = classData.palette.cloth;
        ctx.fill();
        ctx.strokeStyle = classData.palette.trim;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (targetClassId === 'assassin') {
        // Deep shadow cowl
        ctx.beginPath();
        ctx.arc(headCenter.x, headCenter.y, 17 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#0f0e18';
        ctx.fill();
        // Glowing purple eye slit
        const eyeL = project(-4, -56, 14);
        const eyeR = project(4, -56, 14);
        ctx.fillStyle = '#b48cff';
        ctx.shadowColor = '#b48cff';
        ctx.shadowBlur = 6;
        ctx.fillRect(eyeL.x - 2, eyeL.y, 3, 2);
        ctx.fillRect(eyeR.x - 1, eyeR.y, 3, 2);
        ctx.shadowBlur = 0;
      } else if (targetClassId === 'alchemist') {
        // Goggles
        const gL = project(-6, -60, 14);
        const gR = project(6, -60, 14);
        ctx.beginPath();
        ctx.arc(gL.x, gL.y, 4.5 * scale, 0, Math.PI * 2);
        ctx.arc(gR.x, gR.y, 4.5 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#35e3a0';
        ctx.fill();
        ctx.strokeStyle = classData.palette.trim;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      } else if (targetClassId === 'summoner') {
        // Ceremonial rune headpiece
        ctx.beginPath();
        ctx.arc(headCenter.x, headCenter.y - 10 * scale, 8 * scale, 0, Math.PI * 2);
        ctx.strokeStyle = '#d6b8ff';
        ctx.shadowColor = '#6d4ae8';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      ctx.restore();

      // Render floating particle trails for Rare / Epic / Legendary / Mythic
      if (showRarityEffects && particles.length > 0) {
        particles.forEach(p => {
          p.y += p.vy;
          p.x += p.vx;
          p.alpha -= 0.008;

          if (p.alpha <= 0) {
            p.x = (Math.random() - 0.5) * 110 * scale;
            p.y = (Math.random() * 80 + 30) * scale;
            p.alpha = 0.8 + Math.random() * 0.2;
          }

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx + p.x, cy + p.y, p.size * scale, 0, Math.PI * 2);
          if (highestRarity === 'Mythic') {
            ctx.fillStyle = `hsla(${(elapsed * 0.1 + p.hueOffset) % 360}, 85%, 65%, ${p.alpha})`;
          } else if (highestRarity === 'Legendary') {
            ctx.fillStyle = `rgba(224, 182, 74, ${p.alpha})`;
          } else {
            ctx.fillStyle = `rgba(var(--creature-glow-rgb), ${p.alpha})`;
          }
          ctx.fill();
          ctx.restore();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [classId, equipped, theme, rotationY, height, compact, highestRarity, showRarityEffects]);

  // Mouse & Touch 360 degree drag rotation
  const handleMouseDown = (e) => {
    if (!interactive) return;
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current || !interactive) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const deltaX = clientX - lastMouseXRef.current;
    lastMouseXRef.current = clientX;
    setRotationY(prev => prev + deltaX * 0.015);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'grab' : 'default',
        overflow: 'hidden'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
      {interactive && (
        <div
          style={{
            position: 'absolute',
            bottom: 6,
            fontSize: '0.68rem',
            color: 'var(--dim-text)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            pointerEvents: 'none',
            opacity: 0.7
          }}
        >
          Drag to Rotate 360°
        </div>
      )}
    </div>
  );
};

