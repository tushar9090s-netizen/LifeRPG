import React from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { CharacterViewer3D } from '../3d/CharacterViewer3D.jsx';
import { CLASSES } from '../../types/gameData.js';

export const BattleResultModal = ({ data, onDismiss }) => {
  const { player } = useGame();
  const { battle, isWin, isDraw, rewards } = data;
  const opp = battle.opponent;

  return (
    <div
      style={{
        position: 'relative',
        width: '92%',
        maxWidth: '520px',
        backgroundColor: 'var(--surface)',
        border: `2px solid ${isWin ? 'var(--creature-glow)' : isDraw ? 'var(--gold)' : 'var(--border)'}`,
        borderRadius: '16px',
        padding: '28px 20px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
        animation: 'overshootSettle 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 14px',
            borderRadius: '12px',
            backgroundColor: isWin ? 'rgba(var(--creature-glow-rgb), 0.15)' : 'rgba(224, 84, 107, 0.15)',
            border: `1px solid ${isWin ? 'var(--creature-glow)' : 'var(--danger)'}`,
            color: isWin ? 'var(--creature-glow)' : 'var(--danger)',
            fontSize: '0.75rem',
            letterSpacing: '0.12em',
            fontWeight: '900',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}
        >
          {isWin ? 'VICTORY ACHIEVED' : isDraw ? 'STALEMATE / DRAW' : 'DEFEAT'}
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            color: isWin ? 'var(--gold)' : 'var(--text)',
            marginBottom: '16px'
          }}
        >
          {battle.format} Concluded
        </h2>

        {/* Side-by-side 3D model thumbnails, winner side lit brighter with creature glow (Part 6 requirement) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          {/* User side */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-wash)',
              border: isWin ? '2px solid var(--creature-glow)' : '1px solid var(--border)',
              boxShadow: isWin ? '0 0 20px rgba(var(--creature-glow-rgb), 0.35)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ height: '110px', overflow: 'hidden' }}>
              <CharacterViewer3D
                classId={player.selectedClass}
                equipped={player.equippedByClass[player.selectedClass]}
                compact={true}
                height={110}
                interactive={false}
                showRarityEffects={false}
              />
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text)', marginTop: '4px' }}>
              You ({CLASSES[player.selectedClass]?.name})
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '900',
                color: isWin ? 'var(--creature-glow)' : 'var(--text)',
                marginTop: '4px'
              }}
            >
              {battle.userScore} pts
            </div>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--dim-text)',
              fontWeight: '700'
            }}
          >
            VS
          </div>

          {/* Opponent side */}
          <div
            style={{
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-wash)',
              border: !isWin && !isDraw ? '2px solid var(--creature-glow)' : '1px solid var(--border)',
              boxShadow: !isWin && !isDraw ? '0 0 20px rgba(var(--creature-glow-rgb), 0.35)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <div style={{ height: '110px', overflow: 'hidden' }}>
              <CharacterViewer3D
                classId={opp.classId}
                compact={true}
                height={110}
                interactive={false}
                showRarityEffects={false}
              />
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text)', marginTop: '4px' }}>
              {opp.name}
            </div>
            <div
              style={{
                fontSize: '1.25rem',
                fontWeight: '900',
                color: !isWin && !isDraw ? 'var(--creature-glow)' : 'var(--text)',
                marginTop: '4px'
              }}
            >
              {battle.oppScore} pts
            </div>
          </div>
        </div>

        {/* Reward breakdown (Part 6 requirement: Gold / Battle XP / Title progress) */}
        <div
          style={{
            background: 'var(--bg-wash)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-around',
            textAlign: 'center'
          }}
        >
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--dim-text)', display: 'block' }}>REWARD GOLD</span>
            <strong style={{ color: 'var(--gold)', fontSize: '0.95rem' }}>+{rewards.gold}</strong>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--dim-text)', display: 'block' }}>BATTLE XP</span>
            <strong style={{ color: 'var(--accent)', fontSize: '0.95rem' }}>+{rewards.battleXp}</strong>
          </div>
          <div style={{ width: '1px', background: 'var(--border)' }} />
          <div>
            <span style={{ fontSize: '0.68rem', color: 'var(--dim-text)', display: 'block' }}>TITLE PROGRESS</span>
            <strong style={{ color: 'var(--text)', fontSize: '0.85rem' }}>{rewards.titleProgress}</strong>
          </div>
        </div>

        {/* Single tap dismiss */}
        <button
          onClick={onDismiss}
          className="btn-gold"
          style={{ width: '100%', padding: '12px 0' }}
        >
          Claim & Return
        </button>
      </div>
    </div>
  );
};

