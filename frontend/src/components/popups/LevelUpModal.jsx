import React from 'react';
import { useGame } from '../../state/GameContext.jsx';

export const LevelUpModal = ({ data, onDismiss }) => {
  const { player } = useGame();

  return (
    <div
      style={{
        position: 'relative',
        width: '90%',
        maxWidth: '420px',
        backgroundColor: 'var(--surface)',
        border: '1.5px solid var(--gold)',
        borderRadius: '16px',
        padding: '36px 24px',
        textAlign: 'center',
        boxShadow: '0 16px 48px rgba(0,0,0,0.8), 0 0 30px var(--gold-glow)',
        animation: 'overshootSettle 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        overflow: 'hidden'
      }}
    >
      {/* Slow breathing gold radial burst background */}
      <div
        style={{
          position: 'absolute',
          top: '-40%',
          left: '-40%',
          width: '180%',
          height: '180%',
          background: 'radial-gradient(circle, var(--gold-glow) 0%, transparent 65%)',
          animation: 'goldRadialBreath 3s infinite ease-in-out',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '2rem', marginBottom: '8px' }}>👑</div>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--gold)',
            textShadow: '0 0 16px var(--gold-glow)',
            letterSpacing: '0.12em',
            marginBottom: '6px'
          }}
        >
          LEVEL UP
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            color: 'var(--text)',
            marginBottom: '16px'
          }}
        >
          Rank Ascended to <span style={{ color: 'var(--gold)', fontWeight: '900' }}>Lv {data.newLevel}</span>
        </p>

        <div
          style={{
            background: 'var(--bg-wash)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '24px',
            fontSize: '0.85rem',
            color: 'var(--dim-text)',
            lineHeight: 1.5
          }}
        >
          {data.statSummary}
        </div>

        {/* Explicit tap to dismiss button (Part 6 requirement) */}
        <button
          onClick={onDismiss}
          className="btn-gold"
          style={{ width: '100%', padding: '12px 0', fontSize: '0.95rem' }}
        >
          Embrace Power
        </button>
      </div>
    </div>
  );
};

