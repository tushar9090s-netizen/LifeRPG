import React from 'react';
import { useGame } from '../../state/GameContext';
import { IconFlame, IconGold } from '../common/Icons';

export const ProfileModal = () => {
  const { character, titles, profileModalOpen, setProfileModalOpen } = useGame();
  if (!profileModalOpen) return null;

  const winRate = character.battlesCount > 0
    ? ((character.winsCount / character.battlesCount) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="scrim-overlay" onClick={() => setProfileModalOpen(false)}>
      <div className="modal-enter card-base profile-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="profile-modal-top">
          <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--dim-text-color)' }}>
            HUNTER REGISTRATION DOSSIER
          </span>
          <button className="close-btn" onClick={() => setProfileModalOpen(false)}>×</button>
        </div>

        {/* Hunter Identity */}
        <div className="profile-identity-card">
          <div className="profile-rank font-display">{character.title}</div>
          <div className="profile-name-row">
            <span className="profile-name font-display">{character.name}</span>
            <span className="profile-class font-mono">[{character.class}]</span>
          </div>
          <div className="profile-level-badge font-mono">LEVEL {character.level}</div>
        </div>

        {/* Battle Record Stats (§28) */}
        <div className="profile-stats-grid">
          <div className="profile-stat-box">
            <span className="box-lbl font-mono">STREAK</span>
            <strong className="box-val font-display" style={{ color: '#ff856b' }}>
              <IconFlame size={14} /> {character.streak} DAYS
            </strong>
          </div>
          <div className="profile-stat-box">
            <span className="box-lbl font-mono">BATTLES</span>
            <strong className="box-val font-display">{character.battlesCount}</strong>
          </div>
          <div className="profile-stat-box">
            <span className="box-lbl font-mono">WINS</span>
            <strong className="box-val font-display" style={{ color: 'var(--creature-glow)' }}>
              {character.winsCount}
            </strong>
          </div>
          <div className="profile-stat-box">
            <span className="box-lbl font-mono">WIN RATE</span>
            <strong className="box-val font-display" style={{ color: 'var(--gold-color)' }}>
              {winRate}%
            </strong>
          </div>
        </div>

        {/* Prestigious Titles List (§28) */}
        <div className="titles-section">
          <div className="titles-label font-mono">EARNED HUNTER TITLES</div>
          <div className="titles-chips-cloud">
            {titles.map((t) => (
              <div key={t.id} className={`title-chip ${t.unlocked ? 'unlocked' : 'locked'}`}>
                <span className="title-chip-name font-display">{t.name}</span>
                <span className="title-chip-req font-sans">{t.req}</span>
                {t.unlocked && <span className="title-verified font-mono">✓ ACTIVE</span>}
              </div>
            ))}
          </div>
        </div>

        <button
          className="btn-primary font-display"
          style={{ width: '100%', marginTop: '1.5rem' }}
          onClick={() => setProfileModalOpen(false)}
        >
          CLOSE DOSSIER
        </button>
      </div>

      <style>{`
        .profile-modal-box {
          max-width: 480px;
          width: 100%;
          padding: 2rem;
        }

        .profile-modal-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .profile-identity-card {
          background: var(--surface-color-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1.25rem;
          text-align: center;
          margin-bottom: 1.25rem;
        }

        .profile-rank {
          font-size: 1.25rem;
          font-weight: 900;
          color: var(--gold-color);
          letter-spacing: 0.08em;
          text-shadow: 0 0 10px var(--gold-glow);
        }

        .profile-name-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin: 0.25rem 0;
        }

        .profile-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-color);
        }

        .profile-class {
          font-size: 0.8rem;
          color: var(--accent-color);
        }

        .profile-level-badge {
          font-size: 0.75rem;
          color: var(--dim-text-color);
          margin-top: 2px;
        }

        .profile-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .profile-stat-box {
          background: var(--surface-color-elevated);
          border: 1px solid var(--border-color);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .box-lbl {
          font-size: 0.65rem;
          color: var(--dim-text-color);
        }

        .box-val {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .titles-section {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .titles-label {
          font-size: 0.68rem;
          color: var(--dim-text-color);
        }

        .titles-chips-cloud {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-height: 180px;
          overflow-y: auto;
        }

        .title-chip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background: var(--surface-color-subtle);
        }

        .title-chip.unlocked {
          border-color: var(--gold-dim);
          background: rgba(224, 182, 74, 0.08);
        }

        .title-chip.locked {
          opacity: 0.45;
        }

        .title-chip-name {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--gold-color);
        }

        .title-chip-req {
          font-size: 0.7rem;
          color: var(--dim-text-color);
        }

        .title-verified {
          font-size: 0.65rem;
          color: var(--creature-glow);
          font-weight: 800;
        }
      `}</style>
    </div>
  );
};

