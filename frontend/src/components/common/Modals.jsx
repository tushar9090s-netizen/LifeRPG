import React from 'react';
import { useGame } from '../../state/GameContext';
import { IconGold } from './Icons';

export const ModalsContainer = () => {
  const {
    theme,
    questToast,
    levelUpModal,
    setLevelUpModal,
    legendaryRevealModal,
    setLegendaryRevealModal,
    equipItem
  } = useGame();

  const isShadow = theme === 'shadow';

  return (
    <>
      {/* 1. Quest Complete Lightweight Slide-down Toast (§15) */}
      {questToast && (
        <div className="system-quest-toast">
          <div className="toast-tag font-mono">SYSTEM NOTIFICATION</div>
          <div className="toast-header font-display">QUEST COMPLETE</div>
          <div className="toast-title font-sans">{questToast.title}</div>
          <div className="toast-rewards font-mono">
            <span className="reward-item xp">+{questToast.xp} XP</span>
            <span className="reward-item gold">
              <IconGold size={13} /> +{questToast.gold} GOLD
            </span>
            <span className="reward-item stat">
              +{questToast.stat} {questToast.attribute}
            </span>
          </div>
        </div>
      )}

      {/* 2. Level Up Ceremonial Experience (§16) */}
      {levelUpModal && (
        <div className="scrim-overlay">
          {/* Radial Gold Bloom Breathing (§16) */}
          <div className="level-up-gold-bloom" />

          <div className="modal-enter card-base level-up-modal-card">
            <div className="system-ceremony-tag font-mono">[ SYSTEM LEVEL EXPANSION ]</div>
            <h1 className="level-up-title font-display">LEVEL UP</h1>

            <div className="level-transition-badge font-display">
              LEVEL {levelUpModal.oldLevel} → {levelUpModal.newLevel}
            </div>

            <div className="level-up-stat-increases font-mono">
              <div className="stat-increase-row">
                <span>INTELLECT</span>
                <strong>+{levelUpModal.stats.INT}</strong>
              </div>
              <div className="stat-increase-row">
                <span>AGILITY</span>
                <strong>+{levelUpModal.stats.AGI}</strong>
              </div>
              <div className="stat-increase-row">
                <span>VITALITY</span>
                <strong>+{levelUpModal.stats.VIT}</strong>
              </div>
            </div>

            <div className="power-unlocked-banner font-mono">
              NEW SYSTEM POWER UNLOCKED
            </div>

            <button
              className="btn-primary font-display"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              onClick={() => setLevelUpModal(null)}
            >
              ACKNOWLEDGE ASCENSION
            </button>
          </div>
        </div>
      )}

      {/* 3. Legendary Reward Reveal Experience (§24) */}
      {legendaryRevealModal && (
        <div className="scrim-overlay">
          {/* Creature Glow Radial Burst (§24) */}
          <div
            className="legendary-creature-burst"
            style={{
              background: isShadow
                ? 'radial-gradient(circle, rgba(53, 227, 160, 0.4) 0%, transparent 65%)'
                : 'radial-gradient(circle, rgba(111, 214, 240, 0.45) 0%, transparent 65%)'
            }}
          />

          <div className="modal-enter card-base legendary-reveal-card halo-legendary">
            <div className="legendary-super-tag font-mono">
              ✧ LEGENDARY ARTIFACT ACQUIRED ✧
            </div>

            <div className="legendary-item-frame">
              <span className="legendary-glyph">{legendaryRevealModal.icon || '✨'}</span>
            </div>

            <h2 className="legendary-reveal-name font-display">{legendaryRevealModal.name}</h2>

            <div className="legendary-slot-meta font-mono">
              <span>{legendaryRevealModal.slot?.toUpperCase()}</span>
              <span>·</span>
              <span>LEGENDARY COSMETIC</span>
            </div>

            <p className="legendary-flavor-quote font-sans">
              "Bound to the sovereign hunter. Resonates with ancient monarch energy."
            </p>

            <div className="legendary-btn-group">
              <button
                className="btn-primary font-display"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  fontSize: '0.95rem',
                  background: isShadow
                    ? 'linear-gradient(135deg, #35e3a0, #166534)'
                    : 'linear-gradient(135deg, #6fd6f0, #0369a1)',
                  color: isShadow ? '#02180e' : '#ffffff'
                }}
                onClick={() => {
                  equipItem(legendaryRevealModal);
                  setLegendaryRevealModal(null);
                }}
              >
                EQUIP
              </button>
              <button
                className="btn-secondary font-mono"
                style={{ width: '100%', padding: '0.65rem' }}
                onClick={() => setLegendaryRevealModal(null)}
              >
                Store in Vault
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Quest Toast (§15 slides down from beneath top bar, auto-dismisses) */
        .system-quest-toast {
          position: fixed;
          top: 68px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
          background: var(--surface-color-elevated);
          border: 1px solid var(--accent-color);
          box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6), 0 0 20px var(--accent-glow);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1.4rem;
          min-width: 320px;
          max-width: 90vw;
          animation: toastSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        @keyframes toastSlideDown {
          from { opacity: 0; transform: translate(-50%, -24px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }

        .toast-tag {
          font-size: 0.62rem;
          color: var(--dim-text-color);
          letter-spacing: 0.12em;
        }

        .toast-header {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--gold-color);
          letter-spacing: 0.08em;
        }

        .toast-title {
          font-size: 0.85rem;
          color: var(--text-color);
          font-weight: 600;
        }

        .toast-rewards {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          margin-top: 0.35rem;
          font-size: 0.76rem;
        }

        .reward-item.xp { color: var(--creature-glow); font-weight: 700; }
        .reward-item.gold { color: var(--gold-color); font-weight: 700; display: flex; align-items: center; gap: 2px; }
        .reward-item.stat { color: var(--accent-color); font-weight: 700; }

        /* Scrim Overlay */
        .scrim-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: var(--scrim-bg);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }

        /* Level Up (§16) */
        .level-up-gold-bloom {
          position: absolute;
          width: 520px;
          height: 520px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(224, 182, 74, 0.38) 0%, transparent 68%);
          pointer-events: none;
          animation: bloomBreathing 3s ease-in-out infinite alternate;
        }

        @keyframes bloomBreathing {
          0% { transform: scale(0.92); opacity: 0.6; }
          100% { transform: scale(1.12); opacity: 0.95; }
        }

        .level-up-modal-card {
          position: relative;
          z-index: 10;
          max-width: 420px;
          width: 100%;
          padding: 2.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .system-ceremony-tag {
          font-size: 0.68rem;
          color: var(--dim-text-color);
          letter-spacing: 0.15em;
          margin-bottom: 0.5rem;
        }

        .level-up-title {
          font-size: 2.6rem;
          font-weight: 900;
          color: var(--gold-color);
          text-shadow: 0 0 25px var(--gold-glow);
          letter-spacing: 0.1em;
          line-height: 1;
          margin-bottom: 0.85rem;
        }

        .level-transition-badge {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-color);
          background: var(--surface-color-elevated);
          padding: 0.4rem 1.25rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          margin-bottom: 1.5rem;
        }

        .level-up-stat-increases {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
          margin-bottom: 1.25rem;
        }

        .stat-increase-row {
          display: flex;
          justify-content: space-between;
          background: rgba(224, 182, 74, 0.08);
          border: 1px solid var(--gold-dim);
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          color: var(--gold-color);
        }

        .power-unlocked-banner {
          font-size: 0.72rem;
          color: var(--creature-glow);
          letter-spacing: 0.08em;
          margin-bottom: 1.5rem;
        }

        /* Legendary Reveal (§24) */
        .legendary-creature-burst {
          position: absolute;
          width: 550px;
          height: 550px;
          border-radius: 50%;
          pointer-events: none;
          animation: bloomBreathing 2.5s ease-in-out infinite alternate;
        }

        .legendary-reveal-card {
          position: relative;
          z-index: 10;
          max-width: 440px;
          width: 100%;
          padding: 2.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .legendary-super-tag {
          font-size: 0.72rem;
          color: var(--gold-color);
          letter-spacing: 0.12em;
          margin-bottom: 1.25rem;
        }

        .legendary-item-frame {
          width: 90px;
          height: 90px;
          border-radius: var(--radius-sm);
          background: var(--surface-color-elevated);
          border: 1px solid var(--gold-color);
          box-shadow: 0 0 25px var(--gold-glow);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .legendary-glyph {
          font-size: 3rem;
        }

        .legendary-reveal-name {
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--text-color);
          margin-bottom: 0.35rem;
        }

        .legendary-slot-meta {
          font-size: 0.75rem;
          color: var(--gold-color);
          display: flex;
          gap: 6px;
          margin-bottom: 1rem;
        }

        .legendary-flavor-quote {
          font-size: 0.82rem;
          color: var(--dim-text-color);
          font-style: italic;
          line-height: 1.4;
          margin-bottom: 1.75rem;
        }

        .legendary-btn-group {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          width: 100%;
        }
      `}</style>
    </>
  );
};

