import React from 'react';
import { useGame } from '../../state/GameContext.jsx';

export const BottomNav = () => {
  const { activeTab, switchTab, theme } = useGame();
  const isDivine = theme === 'divine';

  const tabs = [
    { id: 'home', label: 'HOME', rune: 'ᛟ', glyph: '🏛️' },
    { id: 'quests', label: 'QUESTS', rune: 'ᚱ', glyph: '📜' },
    { id: 'battle', label: 'BATTLE', rune: 'ᛏ', glyph: '⚔️' },
    { id: 'character', label: 'HERO', rune: 'ᚦ', glyph: '🛡️' },
    { id: 'shop', label: 'BAZAAR', rune: 'ᚠ', glyph: '🏪' },
    { id: 'profile', label: 'SANCTUM', rune: 'ᛋ', glyph: '👤' }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '66px',
        backgroundColor: isDivine ? 'rgba(243, 239, 228, 0.82)' : 'rgba(10, 11, 18, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'center',
        zIndex: 100,
        boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.6)',
        transition: 'var(--theme-transition)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '840px',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-around',
          padding: '0 12px'
        }}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '2px',
                position: 'relative',
                background: 'transparent',
                color: isActive ? 'var(--accent)' : 'var(--dim-text)',
                opacity: isActive ? 1 : 0.6,
                transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
                padding: '6px 0',
                cursor: 'pointer'
              }}
            >
              {/* Glowing top-border indicator for active tab */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '25%',
                    right: '25%',
                    height: '2.5px',
                    borderRadius: '0 0 2px 2px',
                    backgroundColor: 'var(--accent)',
                    boxShadow: '0 0 12px var(--accent-glow), 0 0 6px var(--accent)'
                  }}
                />
              )}

              <span
                style={{
                  fontSize: '1.15rem',
                  filter: isActive ? 'drop-shadow(0 0 8px var(--accent-glow))' : 'none',
                  transition: 'filter 0.25s ease'
                }}
              >
                {tab.glyph}
              </span>

              <span
                style={{
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-display)',
                  fontWeight: isActive ? '900' : '600',
                  letterSpacing: '0.08em',
                  color: isActive ? 'var(--text)' : 'var(--dim-text)'
                }}
              >
                {tab.label}
              </span>

              {/* Magical rune underneath active state (Section 16 requirement) */}
              {isActive && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: '2px',
                    fontSize: '0.55rem',
                    color: 'var(--accent)',
                    textShadow: '0 0 6px var(--accent-glow)'
                  }}
                >
                  {tab.rune}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
