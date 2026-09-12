import React from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { CharacterViewer3D } from '../3d/CharacterViewer3D.jsx';
import { CLASSES } from '../../types/gameData.js';

export const ChallengeReceivedModal = ({ data }) => {
  const { respondChallenge } = useGame();
  const challenger = data.challenger;
  const classData = CLASSES[challenger.classId] || CLASSES.assassin;

  return (
    <div
      style={{
        position: 'relative',
        width: '90%',
        maxWidth: '440px',
        backgroundColor: 'var(--surface)',
        border: '1.5px solid var(--danger)',
        borderRadius: '16px',
        padding: '30px 24px',
        textAlign: 'center',
        boxShadow: '0 16px 48px rgba(0,0,0,0.85), 0 0 24px rgba(224, 84, 107, 0.35)',
        animation: 'overshootSettle 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          borderRadius: '12px',
          backgroundColor: 'rgba(224, 84, 107, 0.15)',
          border: '1px solid var(--danger)',
          color: 'var(--danger)',
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          fontWeight: '700',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}
      >
        <span>⚔️</span> Duel Challenge Issued
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.4rem',
          color: 'var(--text)',
          marginBottom: '4px'
        }}
      >
        {challenger.name}
      </h2>

      <p style={{ fontSize: '0.82rem', color: 'var(--dim-text)', marginBottom: '16px' }}>
        Lv {challenger.level} {classData.name} • "{challenger.title}"
      </p>

      {/* Challenger 3D model thumbnail (Part 6 requirement) */}
      <div
        style={{
          width: '180px',
          height: '180px',
          margin: '0 auto 16px',
          borderRadius: '12px',
          backgroundColor: 'var(--bg-wash)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        <CharacterViewer3D
          classId={challenger.classId}
          compact={true}
          height={180}
          interactive={false}
          showRarityEffects={false}
        />
      </div>

      {/* Proposed battle format & window */}
      <div
        style={{
          background: 'var(--bg-wash)',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          padding: '12px',
          marginBottom: '22px',
          display: 'flex',
          justifyContent: 'space-around',
          fontSize: '0.82rem'
        }}
      >
        <div>
          <span style={{ color: 'var(--dim-text)', display: 'block', fontSize: '0.7rem' }}>FORMAT</span>
          <strong style={{ color: 'var(--accent)' }}>{data.format || 'Sprint Duel'}</strong>
        </div>
        <div style={{ width: '1px', background: 'var(--border)' }} />
        <div>
          <span style={{ color: 'var(--dim-text)', display: 'block', fontSize: '0.7rem' }}>WINDOW</span>
          <strong style={{ color: 'var(--text)' }}>{data.windowText || '4 Hours'}</strong>
        </div>
      </div>

      {/* Two clear actions: Accept and Decline (Part 6 requirement) */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={() => respondChallenge(false, challenger, data.format)}
          className="btn-pill"
          style={{ flex: 1, justifyContent: 'center', color: 'var(--dim-text)' }}
        >
          Decline
        </button>
        <button
          onClick={() => respondChallenge(true, challenger, data.format)}
          className="btn-gold"
          style={{ flex: 1.4 }}
        >
          Accept Duel
        </button>
      </div>
    </div>
  );
};

