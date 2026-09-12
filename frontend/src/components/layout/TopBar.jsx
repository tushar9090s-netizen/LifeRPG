import React from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { soundEngine } from '../../audio/soundEngine.js';

export const TopBar = () => {
  const { theme, toggleTheme, isMuted, toggleSound, player } = useGame();
  const isDivine = theme === 'divine';

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        backgroundColor: isDivine ? 'rgba(243, 239, 228, 0.72)' : 'rgba(10, 11, 18, 0.72)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        zIndex: 100,
        transition: 'var(--theme-transition)'
      }}
    >
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            fontWeight: '900',
            letterSpacing: '0.14em',
            color: 'var(--text)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ color: 'var(--accent)', textShadow: '0 0 10px var(--accent-glow)' }}>✦</span>
          ARISE
        </div>
        <span
          style={{
            fontSize: '0.66rem',
            padding: '2px 7px',
            borderRadius: '10px',
            border: '1px solid var(--border)',
            color: 'var(--dim-text)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}
        >
          Solo Leveling
        </span>
      </div>

      {/* Currency Strip (Part 3.2: Gold count and earned Essence always visible) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Gold */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.84rem',
            fontWeight: '700',
            color: 'var(--gold)',
            background: isDivine ? 'rgba(255, 255, 255, 0.7)' : 'rgba(23, 24, 38, 0.75)',
            padding: '4px 12px',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)'
          }}
          title="Gold Currency"
        >
          <span>🪙</span>
          <span>{player.gold.toLocaleString()}</span>
        </div>

        {/* Level Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.82rem',
            fontWeight: '700',
            color: 'var(--text)',
            background: isDivine ? 'rgba(255, 255, 255, 0.7)' : 'rgba(23, 24, 38, 0.75)',
            padding: '4px 10px',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-display)'
          }}
        >
          <span>Lv. {player.level}</span>
        </div>

        {/* Notification Bell */}
        <button
          style={{
            background: isDivine ? 'rgba(255, 255, 255, 0.7)' : 'rgba(23, 24, 38, 0.75)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.82rem',
            cursor: 'pointer',
            position: 'relative'
          }}
          title="Notifications"
        >
          <span>🔔</span>
          <span
            style={{
              position: 'absolute',
              top: '6px',
              right: '6px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent)',
              boxShadow: '0 0 6px var(--accent)'
            }}
          />
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          style={{
            background: isDivine ? 'rgba(255, 255, 255, 0.7)' : 'rgba(23, 24, 38, 0.75)',
            border: '1px solid var(--border-subtle)',
            color: isMuted ? 'var(--dim-text)' : 'var(--text)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
          title={isMuted ? 'Unmute Ceremonial Audio' : 'Mute Audio'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>

        {/* 2.3 The Theme Toggle: Carved Rune-Stone Pill Switch (weighted slide dial) */}
        <div
          onClick={toggleTheme}
          title={isDivine ? 'Switch to Shadow Realm' : 'Ascend to Divine Temple'}
          style={{
            width: '68px',
            height: '32px',
            borderRadius: '16px',
            background: isDivine
              ? 'linear-gradient(135deg, #d8caa0 0%, #ece5d3 100%)'
              : 'linear-gradient(135deg, #090a10 0%, #171826 100%)',
            border: `1.5px solid ${isDivine ? '#b6892e' : '#3a3a5c'}`,
            position: 'relative',
            cursor: 'pointer',
            padding: '2px',
            boxShadow: isDivine
              ? 'inset 0 2px 4px rgba(0,0,0,0.1), 0 0 10px rgba(182, 137, 46, 0.25)'
              : 'inset 0 2px 6px rgba(0,0,0,0.6), 0 0 10px rgba(139, 108, 240, 0.3)',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {/* Sliding Carved Rune-Stone knob */}
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '13px',
              background: isDivine
                ? 'radial-gradient(circle at 35% 35%, #fffdf7, #e0d5ba)'
                : 'radial-gradient(circle at 35% 35%, #252238, #111019)',
              border: `1px solid ${isDivine ? '#a97d1f' : '#6c5594'}`,
              transform: isDivine ? 'translateX(36px)' : 'translateX(0px)',
              boxShadow: isDivine
                ? '0 2px 6px rgba(169, 125, 31, 0.4), inset 0 0 4px #fff'
                : '0 2px 6px rgba(0,0,0,0.8), 0 0 6px rgba(139, 108, 240, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)'
            }}
          >
            {/* Ancient Rune glyph with violet ember vs gold glow */}
            <span
              style={{
                fontSize: '0.68rem',
                fontFamily: 'serif',
                fontWeight: '900',
                color: isDivine ? '#a97d1f' : '#8b6cf0',
                textShadow: isDivine
                  ? '0 0 5px rgba(169, 125, 31, 0.8)'
                  : '0 0 6px rgba(139, 108, 240, 0.9)'
              }}
            >
              {isDivine ? 'ᛟ' : 'ᚱ'}
            </span>
          </div>
        </div>

        {/* Profile Avatar Circle (Matching Concept Art Image 2) */}
        <button
          onClick={() => switchTab('profile')}
          title="Open Sanctum Profile"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: `1.5px solid ${isDivine ? 'var(--gold)' : 'var(--accent)'}`,
            padding: 0,
            background: 'var(--surface)',
            cursor: 'pointer',
            boxShadow: isDivine ? '0 0 10px var(--gold-glow)' : '0 0 10px var(--accent-glow)',
            flexShrink: 0
          }}
        >
          <img
            src={isDivine ? '/assets/divine_hero.jpg' : '/assets/shadow_hero.jpg'}
            alt="Profile Avatar"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top center'
            }}
          />
        </button>
      </div>
    </header>
  );
};

