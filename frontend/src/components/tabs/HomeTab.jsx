import React, { useState } from 'react';
import { FantasyEnvironment } from '../home/FantasyEnvironment.jsx';
import { OrbitingDragon } from '../home/OrbitingDragon.jsx';
import { HeroCharacter } from '../home/HeroCharacter.jsx';
import { LeftHudPanel } from '../home/LeftHudPanel.jsx';
import { RightHudPanel } from '../home/RightHudPanel.jsx';

export const HomeTab = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Normalized mouse coordinate [-1, 1] for 3D parallax interaction
  const handleMouseMove = (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        minHeight: 'calc(100vh - 60px)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflowX: 'hidden',
        padding: '16px 24px 80px'
      }}
    >
      {/* 1. Deep Multi-Layered Fantasy Environment (Ruins, Sky, Fire Braziers, Embers) */}
      <FantasyEnvironment mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* 2. Massive Mythical Dragon Looming over the Hero (Section 8-12) */}
      <OrbitingDragon mouseX={mousePos.x} mouseY={mousePos.y} />

      {/* 3. Main 3-Column Wide Desktop RPG Composition (Matching Concept Art Image 2) */}
      <div
        style={{
          position: 'relative',
          zIndex: 8,
          width: '100%',
          maxWidth: '1360px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '300px 1fr 310px',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '28px'
        }}
        className="home-arena-grid"
      >
        {/* LEFT COLUMN: Profile Status, Attributes, Streak, Quick Actions */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LeftHudPanel />
        </div>

        {/* CENTER COLUMN: The Primary Hero Character on the Glowing Pedestal (45–50% focus) */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            minHeight: '600px'
          }}
        >
          <HeroCharacter mouseX={mousePos.x} mouseY={mousePos.y} />
        </div>

        {/* RIGHT COLUMN: Daily Quests, Recent Activity, Next Level */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RightHudPanel />
        </div>
      </div>

      {/* Responsive adjustments for mobile / tablet */}
      <style>{`
        @media (max-width: 1100px) {
          .home-arena-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            padding-bottom: 24px;
          }
          .home-arena-grid > div:nth-child(1) {
            order: 2;
          }
          .home-arena-grid > div:nth-child(2) {
            order: 1;
            min-height: 520px !important;
          }
          .home-arena-grid > div:nth-child(3) {
            order: 3;
          }
        }
      `}</style>
    </div>
  );
};
