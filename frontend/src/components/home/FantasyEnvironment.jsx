import React from 'react';
import { useGame } from '../../state/GameContext';

/**
 * FantasyEnvironment — Multi-layered atmospheric fantasy kingdom background.
 * Pure procedural vector architecture:
 * - Layer 1: Atmospheric sky gradient with nebula clouds
 * - Layer 2: Distant gothic spires, towers, and mountain ridges
 * - Layer 3: Ruined castle ramparts, archways, and glowing stained-glass spires
 * - Layer 4: Floating atmospheric fog and ambient lighting
 */
export const FantasyEnvironment = () => {
  const { theme } = useGame();
  const isShadow = theme === 'shadow';

  return (
    <div className="fantasy-env-container" aria-hidden="true">
      {/* ── Layer 1: Atmospheric Deep Sky & Nebula ── */}
      <div className="env-sky-layer" />

      {/* ── Layer 2 & 3: Gothic Fantasy Kingdom Architecture (SVG) ── */}
      <svg
        className="env-arch-svg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Shadow gradients */}
          <linearGradient id="sh-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#04050a" />
            <stop offset="40%" stopColor="#0a0c1a" />
            <stop offset="75%" stopColor="#120e26" />
            <stop offset="100%" stopColor="#06070e" />
          </linearGradient>

          <linearGradient id="sh-nebula" x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="rgba(91, 75, 184, 0.4)" />
            <stop offset="45%" stopColor="rgba(53, 227, 160, 0.15)" />
            <stop offset="80%" stopColor="rgba(139, 108, 240, 0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          <linearGradient id="sh-far-spires" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0d0e1c" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#05060c" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id="sh-mid-castle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#14162a" />
            <stop offset="50%" stopColor="#0f1122" />
            <stop offset="100%" stopColor="#070812" />
          </linearGradient>

          {/* Divine gradients */}
          <linearGradient id="div-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7f3e8" />
            <stop offset="45%" stopColor="#ece2cb" />
            <stop offset="75%" stopColor="#e2d4b5" />
            <stop offset="100%" stopColor="#f3efe4" />
          </linearGradient>

          <linearGradient id="div-far-spires" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d8caa0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ebdcb8" stopOpacity="0.85" />
          </linearGradient>

          <linearGradient id="div-mid-castle" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#efe5cf" />
            <stop offset="50%" stopColor="#e3d6b8" />
            <stop offset="100%" stopColor="#d5c49f" />
          </linearGradient>

          {/* Filter for ethereal mist glow */}
          <filter id="soft-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="16" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Sky Background */}
        <rect width="100%" height="100%" fill={isShadow ? 'url(#sh-sky)' : 'url(#div-sky)'} />

        {/* Ethereal Nebula Clouds */}
        <ellipse
          cx="800"
          cy="280"
          rx="650"
          ry="320"
          fill={isShadow ? 'url(#sh-nebula)' : 'rgba(240, 218, 160, 0.28)'}
          filter="url(#soft-glow)"
        />
        <ellipse
          cx="1200"
          cy="200"
          rx="400"
          ry="240"
          fill={isShadow ? 'rgba(53, 227, 160, 0.12)' : 'rgba(111, 214, 240, 0.22)'}
          filter="url(#soft-glow)"
        />

        {/* ── LAYER 2: Distant Spires & Towers Silhouette ── */}
        <g fill={isShadow ? 'url(#sh-far-spires)' : 'url(#div-far-spires)'} opacity="0.85">
          {/* Far Left Castle Spire */}
          <path d="M 60 900 L 60 480 L 75 420 L 75 310 L 85 240 L 95 310 L 95 420 L 110 480 L 110 900 Z" />
          <path d="M 120 900 L 120 540 L 145 460 L 155 350 L 165 460 L 190 540 L 190 900 Z" />
          <polygon points="155,290 152,350 158,350" />

          {/* Mid-Left High Tower */}
          <path d="M 260 900 L 260 430 L 280 340 L 295 210 L 310 340 L 330 430 L 330 900 Z" />
          <line x1="295" y1="180" x2="295" y2="210" stroke={isShadow ? '#8b6cf0' : '#b6892e'} strokeWidth="2" />

          {/* Center-Left Distant Citadel */}
          <path d="M 420 900 L 420 510 L 450 440 L 460 360 L 470 440 L 500 510 L 500 900 Z" />

          {/* Center-Right Massive Gothic Tower (matches reference right tower) */}
          <path d="M 1080 900 L 1080 410 L 1110 330 L 1125 190 L 1140 330 L 1170 410 L 1170 900 Z" />
          <path d="M 1190 900 L 1190 470 L 1215 390 L 1225 280 L 1235 390 L 1260 470 L 1260 900 Z" />
          <polygon points="1125,140 1122,190 1128,190" />
          <polygon points="1225,230 1222,280 1228,280" />

          {/* Far Right Flying Buttresses & Spires */}
          <path d="M 1340 900 L 1340 380 L 1370 290 L 1385 160 L 1400 290 L 1430 380 L 1430 900 Z" />
          <path d="M 1460 900 L 1460 490 L 1485 410 L 1500 310 L 1515 410 L 1540 490 L 1540 900 Z" />
          <polygon points="1385,110 1382,160 1388,160" />
        </g>

        {/* ── LAYER 3: Midground Ruined Fortress & Grand Archways ── */}
        <g fill={isShadow ? 'url(#sh-mid-castle)' : 'url(#div-mid-castle)'}>
          {/* Left Wing Fortress Wall & Buttresses */}
          <path d="M 0 900 L 0 520 L 50 480 L 160 520 L 220 570 L 270 550 L 340 600 L 400 660 L 400 900 Z" />
          {/* Gothic Arch cutouts */}
          <path d="M 90 620 C 90 570 140 570 140 620 L 140 730 L 90 730 Z" fill={isShadow ? '#080913' : '#dbcb9f'} />
          <path d="M 170 650 C 170 610 210 610 210 650 L 210 740 L 170 740 Z" fill={isShadow ? '#080913' : '#dbcb9f'} />

          {/* Center Background Mountain Ridge behind character */}
          <path d="M 380 900 L 490 680 L 610 620 L 740 660 L 800 630 L 890 670 L 1020 620 L 1150 710 L 1250 900 Z" opacity="0.6" />

          {/* Right Wing Grand Cathedral Spires & Wall */}
          <path d="M 1040 900 L 1040 620 L 1080 560 L 1160 520 L 1240 540 L 1320 480 L 1420 520 L 1600 460 L 1600 900 Z" />
          {/* Stained Glass Window Windows on Right Tower */}
          <path d="M 1180 590 C 1180 540 1220 540 1220 590 L 1220 680 L 1180 680 Z" fill={isShadow ? 'rgba(53, 227, 160, 0.25)' : 'rgba(212, 168, 78, 0.4)'} />
          <path d="M 1260 560 C 1260 520 1295 520 1295 560 L 1295 650 L 1260 650 Z" fill={isShadow ? 'rgba(139, 108, 240, 0.3)' : 'rgba(111, 214, 240, 0.45)'} />
        </g>

        {/* Ambient Window Lights / Stained Glass Glow */}
        {isShadow ? (
          <>
            <circle cx="1200" cy="620" r="18" fill="rgba(53, 227, 160, 0.2)" filter="url(#soft-glow)" />
            <circle cx="1277" cy="590" r="14" fill="rgba(139, 108, 240, 0.25)" filter="url(#soft-glow)" />
          </>
        ) : (
          <>
            <circle cx="1200" cy="620" r="22" fill="rgba(224, 182, 74, 0.3)" filter="url(#soft-glow)" />
            <circle cx="1277" cy="590" r="18" fill="rgba(111, 214, 240, 0.35)" filter="url(#soft-glow)" />
          </>
        )}
      </svg>

      {/* ── Layer 4: Floating Atmospheric Fog Vignette ── */}
      <div className="env-mist-layer" />

      <style>{`
        .fantasy-env-container {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 1;
        }

        .env-sky-layer {
          position: absolute;
          inset: 0;
          background: ${isShadow
            ? 'radial-gradient(ellipse 90% 60% at 50% 20%, rgba(91, 75, 184, 0.15) 0%, #06070d 80%)'
            : 'radial-gradient(ellipse 90% 60% at 50% 20%, rgba(224, 182, 74, 0.15) 0%, #f3efe4 80%)'};
        }

        .env-arch-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .env-mist-layer {
          position: absolute;
          inset: 0;
          background: ${isShadow
            ? 'radial-gradient(ellipse 120% 70% at 50% 100%, rgba(6, 7, 13, 0.95) 0%, rgba(6, 7, 13, 0.4) 60%, transparent 100%)'
            : 'radial-gradient(ellipse 120% 70% at 50% 100%, rgba(243, 239, 228, 0.95) 0%, rgba(243, 239, 228, 0.4) 60%, transparent 100%)'};
        }
      `}</style>
    </div>
  );
};

