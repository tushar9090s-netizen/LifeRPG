import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext.jsx';

export const PerimeterDragon = () => {
  const canvasRef = useRef(null);
  const { theme, activeTab } = useGame();

  // Part 3.1: "This creature only ever appears on the Home tab. Every other tab keeps identical chrome... but the frame is empty"
  if (activeTab !== 'home') {
    return null;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Resize handler
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color tokens
    const isShadow = theme === 'shadow';
    const primaryGlow = isShadow ? 'rgba(53, 227, 160, ' : 'rgba(111, 214, 240, '; // emerald vs icy cyan
    const bodyColor = isShadow ? '#090a10' : '#f5f1e8';
    const bodyStroke = isShadow ? '#1b2030' : '#d5c9ad';
    const eyeColor = isShadow ? '#35e3a0' : '#6fd6f0';

    // Perimeter path configuration
    const inset = 16;
    const radius = 24;

    // Total perimeter calculation
    const getPerimeterMetrics = (w, h) => {
      const straightW = Math.max(10, w - 2 * inset - 2 * radius);
      const straightH = Math.max(10, h - 2 * inset - 2 * radius);
      const cornerArc = (Math.PI / 2) * radius;
      const totalLen = 2 * straightW + 2 * straightH + 4 * cornerArc;
      return { straightW, straightH, cornerArc, totalLen };
    };

    // Mapping a linear distance `s` [0, totalLen] to a 2D point & tangent angle
    const getPerimeterPoint = (s, w, h, metrics) => {
      const { straightW, straightH, cornerArc, totalLen } = metrics;
      let dist = ((s % totalLen) + totalLen) % totalLen;

      const topY = inset;
      const bottomY = h - inset;
      const leftX = inset;
      const rightX = w - inset;

      // Section 1: Top edge (moving Left -> Right)
      // From (leftX + radius, topY) to (rightX - radius, topY)
      if (dist < straightW) {
        return {
          x: leftX + radius + dist,
          y: topY,
          angle: 0
        };
      }
      dist -= straightW;

      // Section 2: Top-Right Corner arc
      if (dist < cornerArc) {
        const theta = (dist / cornerArc) * (Math.PI / 2);
        return {
          x: rightX - radius + Math.sin(theta) * radius,
          y: topY + radius - Math.cos(theta) * radius,
          angle: theta
        };
      }
      dist -= cornerArc;

      // Section 3: Right edge (moving Top -> Bottom)
      if (dist < straightH) {
        return {
          x: rightX,
          y: topY + radius + dist,
          angle: Math.PI / 2
        };
      }
      dist -= straightH;

      // Section 4: Bottom-Right Corner arc
      if (dist < cornerArc) {
        const theta = (dist / cornerArc) * (Math.PI / 2);
        return {
          x: rightX - radius + Math.cos(theta) * radius,
          y: bottomY - radius + Math.sin(theta) * radius,
          angle: Math.PI / 2 + theta
        };
      }
      dist -= cornerArc;

      // Section 5: Bottom edge (moving Right -> Left)
      if (dist < straightW) {
        return {
          x: rightX - radius - dist,
          y: bottomY,
          angle: Math.PI
        };
      }
      dist -= straightW;

      // Section 6: Bottom-Left Corner arc
      if (dist < cornerArc) {
        const theta = (dist / cornerArc) * (Math.PI / 2);
        return {
          x: leftX + radius - Math.sin(theta) * radius,
          y: bottomY - radius + Math.cos(theta) * radius,
          angle: Math.PI + theta
        };
      }
      dist -= cornerArc;

      // Section 7: Left edge (moving Bottom -> Top)
      if (dist < straightH) {
        return {
          x: leftX,
          y: bottomY - radius - dist,
          angle: (3 * Math.PI) / 2
        };
      }
      dist -= straightH;

      // Section 8: Top-Left Corner arc
      const theta = (dist / cornerArc) * (Math.PI / 2);
      return {
        x: leftX + radius - Math.cos(theta) * radius,
        y: topY + radius - Math.sin(theta) * radius,
        angle: (3 * Math.PI) / 2 + theta
      };
    };

    // Motes / dark mist particles pool
    const particles = [];
    for (let i = 0; i < 35; i++) {
      particles.push({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        maxLife: 60 + Math.random() * 60,
        size: 1.5 + Math.random() * 3
      });
    }

    let startTime = null;
    const LOOP_DURATION = 22000; // 22 seconds per full loop (Part 3.1 requirement)

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, width, height);

      const metrics = getPerimeterMetrics(width, height);
      const loopProgress = (elapsed % LOOP_DURATION) / LOOP_DURATION;
      const headDist = loopProgress * metrics.totalLen;

      // Draw perimeter track glow guide (very subtle ambient atmosphere)
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(inset, inset, width - 2 * inset, height - 2 * inset, radius);
      ctx.strokeStyle = primaryGlow + '0.06)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      // Dragon body segments (head -> tail)
      const NUM_SEGMENTS = 52;
      const DRAGON_LENGTH = Math.min(metrics.totalLen * 0.42, 680); // Extends along ~40% of perimeter
      const segmentSpacing = DRAGON_LENGTH / NUM_SEGMENTS;

      const spinePoints = [];

      for (let i = 0; i <= NUM_SEGMENTS; i++) {
        const segDist = headDist - i * segmentSpacing;
        const pt = getPerimeterPoint(segDist, width, height, metrics);

        // Add subtle sinuous serpentine wave oscillation
        const waveFreq = 0.045;
        const waveSpeed = 0.005;
        const waveAmp = Math.sin(i * waveFreq - elapsed * waveSpeed) * (4 + (i / NUM_SEGMENTS) * 5);

        // Normal perpendicular vector to tangent
        const nx = -Math.sin(pt.angle);
        const ny = Math.cos(pt.angle);

        spinePoints.push({
          x: pt.x + nx * waveAmp,
          y: pt.y + ny * waveAmp,
          angle: pt.angle,
          index: i
        });
      }

      // Draw trailing mist / motes from the tail
      const tailPoint = spinePoints[spinePoints.length - 1];
      if (Math.random() < 0.4 && tailPoint) {
        const p = particles.find(p => p.life <= 0);
        if (p) {
          p.x = tailPoint.x + (Math.random() - 0.5) * 8;
          p.y = tailPoint.y + (Math.random() - 0.5) * 8;
          p.vx = (Math.random() - 0.5) * 0.6;
          p.vy = (Math.random() - 0.5) * 0.6;
          p.life = p.maxLife;
        }
      }

      particles.forEach(p => {
        if (p.life > 0) {
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 1;
          const alpha = (p.life / p.maxLife) * 0.4;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = primaryGlow + `${alpha})`;
          ctx.fill();
        }
      });

      // Render dragon segments from tail to head
      for (let i = NUM_SEGMENTS; i >= 1; i--) {
        const curr = spinePoints[i];
        const next = spinePoints[i - 1];
        const tFade = 1 - i / NUM_SEGMENTS; // 1 at head, 0 at tail

        // Segment thickness: wider at midsection/chest, tapering to sharp tail
        const baseThickness = 12 * Math.sin((1 - i / (NUM_SEGMENTS + 8)) * Math.PI * 0.85);
        const thickness = Math.max(2, baseThickness);

        // Draw body segment
        ctx.save();
        ctx.beginPath();
        const nx = -Math.sin(curr.angle) * thickness;
        const ny = Math.cos(curr.angle) * thickness;

        ctx.moveTo(curr.x + nx, curr.y + ny);
        ctx.lineTo(next.x + nx, next.y + ny);
        ctx.lineTo(next.x - nx, next.y - ny);
        ctx.lineTo(curr.x - nx, curr.y - ny);
        ctx.closePath();

        // Atmospheric opacity (deliberate low opacity so it never blocks dashboard)
        const alpha = Math.max(0.04, tFade * 0.55);
        ctx.fillStyle = bodyColor;
        ctx.globalAlpha = alpha;
        ctx.fill();

        ctx.strokeStyle = bodyStroke;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Render luminous spine ridge along length of dragon
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(curr.x, curr.y);
        ctx.lineTo(next.x, next.y);
        ctx.strokeStyle = primaryGlow + `${tFade * 0.75})`;
        ctx.lineWidth = Math.max(1, 3.5 * tFade);
        ctx.shadowColor = primaryGlow + '0.9)';
        ctx.shadowBlur = 8 * tFade;
        ctx.stroke();
        ctx.restore();
      }

      // Draw Dragon Head at spinePoints[0]
      const head = spinePoints[0];
      if (head) {
        ctx.save();
        ctx.translate(head.x, head.y);
        ctx.rotate(head.angle);

        // Head silhouette
        ctx.beginPath();
        ctx.moveTo(14, 0); // Snout
        ctx.lineTo(6, -6);
        ctx.lineTo(-4, -8); // Horn base
        ctx.lineTo(-14, -14); // Left Horn tip
        ctx.lineTo(-6, -5);
        ctx.lineTo(-12, 0); // Back of neck
        ctx.lineTo(-6, 5);
        ctx.lineTo(-14, 14); // Right Horn tip
        ctx.lineTo(-4, 8);
        ctx.lineTo(6, 6);
        ctx.closePath();

        ctx.fillStyle = bodyColor;
        ctx.globalAlpha = 0.85;
        ctx.fill();
        ctx.strokeStyle = primaryGlow + '0.7)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Glowing Emerald / Cyan Eyes
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 10;
        ctx.globalAlpha = 0.95;

        // Eye 1
        ctx.beginPath();
        ctx.ellipse(3, -3.5, 2.5, 1.2, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Eye 2
        ctx.beginPath();
        ctx.ellipse(3, 3.5, 2.5, 1.2, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Whisker / ethereal aura tendrils
        ctx.beginPath();
        ctx.moveTo(8, -2);
        ctx.quadraticCurveTo(16, -7, 20 + Math.sin(elapsed * 0.01) * 3, -10);
        ctx.moveTo(8, 2);
        ctx.quadraticCurveTo(16, 7, 20 + Math.sin(elapsed * 0.01 + 1) * 3, 10);
        ctx.strokeStyle = primaryGlow + '0.6)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, activeTab]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.92,
        filter: 'drop-shadow(0 0 10px rgba(var(--creature-glow-rgb), 0.25))'
      }}
    />
  );
};

