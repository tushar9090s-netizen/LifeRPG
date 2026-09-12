import React, { useRef, useEffect } from 'react';
import { useGame } from '../../state/GameContext.jsx';

export const OrbitingDragon = ({ mouseX = 0, mouseY = 0 }) => {
  const { theme } = useGame();
  const canvasRef = useRef(null);
  const isDivine = theme === 'divine';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Load dragon texture asset
    const dragonImg = new Image();
    dragonImg.src = isDivine ? '/assets/divine_dragon.jpg' : '/assets/shadow_dragon.jpg';

    // Mist & aura particles pool emitting from the dragon
    const dragonMotes = [];
    for (let i = 0; i < 35; i++) {
      dragonMotes.push({
        x: Math.random() * width,
        y: Math.random() * height * 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.3 - Math.random() * 0.6,
        size: Math.random() * 3 + 1,
        life: Math.random(),
        maxLife: 1.0,
        color: isDivine ? '#6fd6f0' : '#35e3a0'
      });
    }

    let startTime = null;
    const CYCLE_DURATION = 16000; // 16-second slow, majestic orbital float

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, width, height);

      // Orbital slow floating motion (15–18 seconds cycle - Section 12)
      const orbitProgress = (elapsed % CYCLE_DURATION) / CYCLE_DURATION;
      const floatY = Math.sin(orbitProgress * Math.PI * 2) * 16;
      const floatX = Math.cos(orbitProgress * Math.PI * 2) * 12;
      const breathingScale = 1.0 + Math.sin(elapsed * 0.002) * 0.025;

      // Mouse Parallax (subtle depth shift)
      const px = mouseX * 22;
      const py = mouseY * 14;

      // Render Dragon
      if (dragonImg.complete && dragonImg.naturalWidth > 0) {
        ctx.save();

        // Position: Looming in the upper midground coiling over the hero's shoulder
        const targetWidth = Math.min(width * 0.72, 880);
        const targetHeight = (targetWidth / dragonImg.naturalWidth) * dragonImg.naturalHeight;
        const dx = width * 0.52 - targetWidth * 0.5 + floatX + px;
        const dy = height * 0.28 - targetHeight * 0.5 + floatY + py;

        ctx.translate(dx + targetWidth / 2, dy + targetHeight / 2);
        ctx.scale(breathingScale, breathingScale);

        // Blending mode: screen for Shadow theme (pure black background becomes 100% transparent, luminous emerald and violet scales pop)
        // or source-over / soft-light for Divine
        if (!isDivine) {
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = 0.92;
        } else {
          ctx.globalCompositeOperation = 'multiply';
          ctx.globalAlpha = 0.88;
        }

        ctx.drawImage(dragonImg, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
        ctx.restore();

        // Glowing Eye Pulse Accent (Section 11: "subtle eye glow")
        ctx.save();
        const eyePulse = 0.75 + Math.sin(elapsed * 0.0035) * 0.25;
        const eyeColor = isDivine ? '#6fd6f0' : '#35e3a0';

        // Approximate eye coordinate relative to dragon head
        const eyeX = dx + targetWidth * 0.22 + floatX * 0.8 + px;
        const eyeY = dy + targetHeight * 0.42 + floatY * 0.8 + py;

        ctx.beginPath();
        ctx.arc(eyeX, eyeY, 8, 0, Math.PI * 2);
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 18 * eyePulse;
        ctx.globalAlpha = eyePulse;
        ctx.fill();
        ctx.restore();
      }

      // Dragon Magical Energy Particles (Section 9 & 13)
      dragonMotes.forEach(m => {
        m.y += m.vy;
        m.x += m.vx;
        m.life -= 0.007;

        if (m.life <= 0) {
          m.x = width * 0.35 + Math.random() * width * 0.35;
          m.y = height * 0.15 + Math.random() * height * 0.3;
          m.life = 0.7 + Math.random() * 0.3;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fillStyle = isDivine
          ? `rgba(111, 214, 240, ${m.life * 0.7})`
          : `rgba(53, 227, 160, ${m.life * 0.8})`;
        ctx.shadowColor = isDivine ? '#6fd6f0' : '#35e3a0';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme, isDivine, mouseX, mouseY]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 2
      }}
    />
  );
};
