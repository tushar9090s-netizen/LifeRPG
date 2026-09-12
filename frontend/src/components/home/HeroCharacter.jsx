import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { soundEngine } from '../audio/soundEngine.js';

export const HeroCharacter = ({ mouseX = 0, mouseY = 0 }) => {
  const { theme, player } = useGame();
  const canvasRef = useRef(null);
  const isDivine = theme === 'divine';

  const [isAwakening, setIsAwakening] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Awakening click handler (Section 5: "Trigger a subtle awakening effect: energy pulse, aura expands, particles burst")
  const handleAwaken = () => {
    if (isAwakening) return;
    setIsAwakening(true);
    soundEngine.playLevelUp();
    setTimeout(() => {
      setIsAwakening(false);
    }, 1200);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 460);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 640);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth || 460;
      height = canvas.height = canvas.parentElement.clientHeight || 640;
    };

    window.addEventListener('resize', handleResize);

    // Load protagonist image
    const heroImg = new Image();
    heroImg.src = isDivine ? '/assets/divine_hero.jpg' : '/assets/shadow_hero.jpg';

    // Shadow tendril particles rising from the runic dais
    const shadowParticles = [];
    for (let i = 0; i < 30; i++) {
      shadowParticles.push({
        x: (Math.random() - 0.5) * 160,
        y: Math.random() * 120 + 80,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.6 - Math.random() * 0.8,
        size: Math.random() * 3 + 1,
        life: Math.random(),
        color: isDivine ? '#6fd6f0' : '#8b6cf0'
      });
    }

    let startTime = null;

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;

      // Cursor tracking & 3D tilt (Section 5: "subtly look / rotate toward cursor")
      const tiltX = mouseX * 16;
      const tiltY = mouseY * 10;
      const breathY = Math.sin(elapsed * 0.0024) * 4;
      const breathScale = 1.0 + Math.sin(elapsed * 0.0024) * 0.008;

      // Draw Hero Character
      if (heroImg.complete && heroImg.naturalWidth > 0) {
        ctx.save();

        // Calculate aspect ratio fit
        const targetHeight = Math.min(height * 0.94, 580);
        const targetWidth = (targetHeight / heroImg.naturalHeight) * heroImg.naturalWidth;
        const dx = cx - targetWidth * 0.5 + tiltX;
        const dy = cy - targetHeight * 0.5 + breathY + tiltY * 0.5;

        // Awakening flare expansion
        const awakenScale = isAwakening ? 1.04 + Math.sin(elapsed * 0.01) * 0.02 : breathScale;
        ctx.translate(dx + targetWidth / 2, dy + targetHeight / 2);
        ctx.scale(awakenScale, awakenScale);

        // Blending mode: screen for Shadow theme eliminates pure dark background
        if (!isDivine) {
          ctx.globalCompositeOperation = 'screen';
          ctx.globalAlpha = 0.96;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 0.96;
        }

        // Draw character
        ctx.drawImage(heroImg, -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
        ctx.restore();

        // Awakening shockwave ring
        if (isAwakening) {
          ctx.save();
          const waveRadius = ((elapsed % 1000) / 1000) * 180;
          const waveAlpha = 1 - (elapsed % 1000) / 1000;
          ctx.beginPath();
          ctx.ellipse(cx + tiltX, cy + 180, waveRadius, waveRadius * 0.35, 0, 0, Math.PI * 2);
          ctx.strokeStyle = isDivine ? `rgba(255, 215, 0, ${waveAlpha})` : `rgba(139, 108, 240, ${waveAlpha})`;
          ctx.lineWidth = 3;
          ctx.shadowColor = isDivine ? '#ffd700' : '#8b6cf0';
          ctx.shadowBlur = 15;
          ctx.stroke();
          ctx.restore();
        }
      }

      // Rising Shadow Smoke / Divine Sparks from Dais (Section 5)
      shadowParticles.forEach(p => {
        p.y += p.vy;
        p.x += p.vx;
        p.life -= 0.01;

        if (p.life <= 0) {
          p.x = (Math.random() - 0.5) * 140;
          p.y = 160 + Math.random() * 40;
          p.life = 0.7 + Math.random() * 0.3;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(cx + p.x + tiltX * 0.7, cy + p.y + tiltY * 0.4, p.size, 0, Math.PI * 2);
        ctx.fillStyle = isDivine
          ? `rgba(111, 214, 240, ${p.life * 0.7})`
          : `rgba(139, 108, 240, ${p.life * 0.8})`;
        ctx.shadowColor = p.color;
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
  }, [theme, isDivine, mouseX, mouseY, isAwakening]);

  return (
    <div
      onClick={handleAwaken}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Click to awaken monarch power"
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '480px',
        minHeight: '580px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto',
        zIndex: 10,
        cursor: 'pointer'
      }}
    >
      {/* Central Canvas */}
      <div style={{ position: 'relative', width: '100%', height: '540px' }}>
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      </div>

      {/* Inspirational Sovereign Quote beneath Pedestal (Matching Concept Image 2) */}
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          marginTop: '-18px',
          zIndex: 12,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.92rem',
            fontWeight: '700',
            letterSpacing: '0.22em',
            color: isDivine ? '#b6892e' : 'var(--gold)',
            textShadow: isDivine
              ? '0 0 10px rgba(182, 137, 46, 0.4), 0 2px 4px rgba(0,0,0,0.2)'
              : '0 0 12px var(--gold-glow), 0 2px 6px rgba(0,0,0,0.9)',
            textTransform: 'uppercase'
          }}
        >
          {isDivine ? '“HIGHER GOALS BRIGHTER TOMORROWS”' : '“DISCIPLINE BUILDS TRUE STRENGTH”'}
        </div>

        {/* Small subtle runic accent */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '4px'
          }}
        >
          <div style={{ width: '28px', height: '1px', background: 'linear-gradient(90deg, transparent, var(--border))' }} />
          <span style={{ fontSize: '0.62rem', color: 'var(--accent)', opacity: 0.8 }}>✦ ᛟ ✦</span>
          <div style={{ width: '28px', height: '1px', background: 'linear-gradient(90deg, var(--border), transparent)' }} />
        </div>
      </div>
    </div>
  );
};
