import React from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { CLASSES } from '../../types/gameData.js';

export const LeftHudPanel = () => {
  const { player, switchTab, theme } = useGame();
  const isDivine = theme === 'divine';

  const currentClassData = CLASSES[player.selectedClass] || CLASSES.knight;
  const xpPercent = Math.min(100, Math.round((player.currentXp / player.nextLevelXp) * 100));

  const attributes = [
    { label: 'Strength', val: player.stats.str, icon: '🛡️', color: 'var(--attr-str)' },
    { label: 'Intellect', val: player.stats.int, icon: '✦', color: 'var(--attr-int)' },
    { label: 'Agility', val: player.stats.agi, icon: '🍃', color: 'var(--attr-agi)' },
    { label: 'Vitality', val: player.stats.vit, icon: '💜', color: 'var(--attr-vit)' }
  ];

  // 7-day stars tracker (Section 22 & Concept Art Image 2)
  const streakStars = [1, 2, 3, 4, 5, 6, 7];
  const activeStarCount = Math.min(7, player.streak % 7 || (player.streak > 0 ? 7 : 0));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '100%',
        maxWidth: '300px',
        zIndex: 10
      }}
    >
      {/* 1. TOP CARD: Profile & Attributes (Matching Concept Art Image 2) */}
      <div className="fantasy-hud-panel" style={{ padding: '16px 14px' }}>
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />

        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: isDivine ? 'rgba(182, 137, 46, 0.15)' : 'rgba(139, 108, 240, 0.18)',
              border: `1.5px solid ${isDivine ? 'var(--gold)' : 'var(--accent)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: isDivine ? '0 0 10px var(--gold-glow)' : '0 0 10px var(--accent-glow)'
            }}
          >
            ✦
          </div>

          <div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                fontWeight: '900',
                letterSpacing: '0.1em',
                color: 'var(--text)'
              }}
            >
              {player.displayName.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                color: 'var(--accent)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}
            >
              {currentClassData.name}
            </div>
          </div>
        </div>

        {/* XP Bar with circular Level Badge */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--dim-text)', fontWeight: '700' }}>XP</span>
            <span style={{ color: 'var(--text)', fontWeight: '600' }}>
              {player.currentXp.toLocaleString()} / {player.nextLevelXp.toLocaleString()}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                flex: 1,
                height: '7px',
                borderRadius: '3.5px',
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${xpPercent}%`,
                  height: '100%',
                  background: isDivine
                    ? 'linear-gradient(90deg, #b6892e, #6fd6f0)'
                    : 'linear-gradient(90deg, var(--accent-2), var(--accent))',
                  boxShadow: isDivine ? '0 0 8px var(--creature-glow)' : '0 0 8px var(--accent-glow)',
                  transition: 'width 0.6s ease'
                }}
              />
            </div>

            {/* Circular Level Badge */}
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--surface)',
                border: `1.5px solid ${isDivine ? 'var(--gold)' : 'var(--accent)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.62rem',
                fontFamily: 'var(--font-display)',
                fontWeight: '900',
                color: 'var(--gold)',
                boxShadow: '0 0 8px rgba(0,0,0,0.5)',
                flexShrink: 0
              }}
            >
              {player.level}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '10px 0' }} />

        {/* Attributes List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {attributes.map(attr => (
            <div key={attr.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.78rem' }}>{attr.icon}</span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text)', fontWeight: '600' }}>
                  {attr.label}
                </span>
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.86rem',
                  fontWeight: '900',
                  color: attr.color
                }}
              >
                {attr.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MIDDLE CARD: Current Streak (Matching Concept Art Image 2) */}
      <div className="fantasy-hud-panel" style={{ padding: '14px' }}>
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
          <span style={{ fontSize: '1.4rem', filter: 'drop-shadow(0 0 6px rgba(255, 140, 0, 0.6))' }}>🔥</span>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'var(--dim-text)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Current Streak
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: '900',
                color: 'var(--gold)',
                textShadow: '0 0 10px var(--gold-glow)'
              }}
            >
              {player.streak} Days
            </div>
          </div>
        </div>

        <div style={{ fontSize: '0.7rem', color: 'var(--dim-text)', fontStyle: 'italic', marginBottom: '8px' }}>
          Keep the flame burning!
        </div>

        {/* Weekly Stars Tracker: ✦ ✦ ✦ ✦ ✦ ✧ ✧ */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {streakStars.map(starIdx => {
            const isFilled = starIdx <= activeStarCount;
            return (
              <span
                key={starIdx}
                style={{
                  fontSize: '0.85rem',
                  color: isFilled ? 'var(--gold)' : 'var(--border)',
                  textShadow: isFilled ? '0 0 6px var(--gold-glow)' : 'none',
                  transition: 'color 0.3s ease'
                }}
              >
                {isFilled ? '✦' : '✧'}
              </span>
            );
          })}
        </div>
      </div>

      {/* 3. LOWER CARD: Quick Actions (Matching Concept Art Image 2) */}
      <div className="fantasy-hud-panel" style={{ padding: '12px' }}>
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />

        <div
          style={{
            fontSize: '0.7rem',
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            color: 'var(--dim-text)',
            letterSpacing: '0.08em',
            marginBottom: '10px',
            textTransform: 'uppercase'
          }}
        >
          Quick Actions
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={() => switchTab('quests')}
            className="fantasy-hud-btn"
            style={{ padding: '8px 12px', fontSize: '0.74rem' }}
          >
            <span>+</span> Forge New Quest
          </button>
          <button
            onClick={() => switchTab('battle')}
            className="fantasy-hud-btn"
            style={{ padding: '8px 12px', fontSize: '0.74rem' }}
          >
            <span>⚔</span> Enter Battle
          </button>
          <button
            onClick={() => switchTab('shop')}
            className="fantasy-hud-btn"
            style={{ padding: '8px 12px', fontSize: '0.74rem' }}
          >
            <span>👜</span> Visit Shop
          </button>
        </div>
      </div>
    </div>
  );
};
