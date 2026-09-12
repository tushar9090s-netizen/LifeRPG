import React from 'react';
import { useGame } from '../../state/GameContext';
import { IconGold, IconSoundOn, IconSoundOff } from './Icons';

export const TopBar = () => {
  const { theme, toggleTheme, character, soundMuted, setSoundMuted, setProfileModalOpen } = useGame();
  const isShadow = theme === 'shadow';

  return (
    <header className="arise-topbar">
      {/* ── Logo ── */}
      <div className="topbar-logo">
        <div className="logo-gem" />
        <span className="logo-text font-display">ARISE</span>
      </div>

      {/* ── Right HUD ── */}
      <div className="topbar-hud">
        {/* Gold */}
        <div className="hud-gold-pill">
          <IconGold size={13} style={{ color: 'var(--gold)', filter: 'drop-shadow(0 0 4px var(--gold-glow))' }} />
          <span className="font-display hud-gold-val">{character.gold.toLocaleString()}</span>
        </div>

        {/* Level pill */}
        <div className="hud-level-pill">
          <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Lv.</span>
          <span className="font-display hud-level-val">{character.level}</span>
          <span className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>▾</span>
        </div>

        {/* Bell */}
        <button className="hud-icon-btn" aria-label="Notifications" title="Notifications">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>

        {/* Avatar (profile) */}
        <button
          className="hud-avatar-btn"
          onClick={() => setProfileModalOpen(true)}
          title="View Hunter Profile"
          aria-label="Profile"
        >
          <span className="avatar-initial font-display">{character.name.charAt(0)}</span>
        </button>

        {/* Rune-stone theme toggle */}
        <button
          className={`rune-toggle ${isShadow ? 'rune-shadow' : 'rune-divine'}`}
          onClick={toggleTheme}
          title={`${isShadow ? 'Shadow Realm' : 'Divine Realm'} — click to shift`}
          aria-label="Toggle Realm"
        >
          <span className="rune-sym rune-left" style={{ opacity: isShadow ? 1 : 0.3 }}>ᚲ</span>
          <span className="rune-stone-slider" />
          <span className="rune-sym rune-right" style={{ opacity: isShadow ? 0.3 : 1 }}>ᛋ</span>
        </button>

        {/* Sound */}
        <button className="hud-icon-btn" onClick={() => setSoundMuted(!soundMuted)} aria-label="Toggle Sound">
          {soundMuted ? <IconSoundOff size={14} /> : <IconSoundOn size={14} />}
        </button>
      </div>

      <style>{`
        .arise-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.2rem;
          background: rgba(10, 11, 18, 0.92);
          border-bottom: 1px solid var(--border-subtle);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.4s ease;
        }
        [data-theme="divine"] .arise-topbar {
          background: rgba(243, 239, 228, 0.94);
          border-bottom-color: var(--border);
        }

        /* Logo */
        .topbar-logo {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .logo-gem {
          width: 20px; height: 20px;
          background: linear-gradient(135deg, var(--accent), var(--accent-deep));
          border-radius: 3px;
          transform: rotate(45deg);
          box-shadow: 0 0 12px var(--accent-glow-md);
        }
        .logo-text {
          font-size: 1.1rem;
          font-weight: 900;
          letter-spacing: 0.14em;
          color: var(--text-bright);
          text-shadow: 0 0 14px var(--accent-glow);
        }
        [data-theme="divine"] .logo-text {
          text-shadow: 0 0 14px var(--accent-glow);
        }

        /* HUD strip */
        .topbar-hud {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        /* Gold pill */
        .hud-gold-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: rgba(224,182,74,0.08);
          border: 1px solid rgba(224,182,74,0.22);
          border-radius: var(--r-sm);
          padding: 4px 10px;
        }
        .hud-gold-val {
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--gold);
          letter-spacing: 0.04em;
          text-shadow: 0 0 8px var(--gold-glow);
        }

        /* Level pill */
        .hud-level-pill {
          display: flex;
          align-items: center;
          gap: 3px;
          background: var(--surface-glass);
          border: 1px solid var(--border);
          border-radius: var(--r-sm);
          padding: 4px 10px;
          backdrop-filter: blur(8px);
        }
        .hud-level-val {
          font-size: 0.88rem;
          font-weight: 900;
          color: var(--text-bright);
          text-shadow: 0 0 10px var(--accent-glow);
        }

        /* Icon buttons */
        .hud-icon-btn {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-dim);
          width: 32px; height: 32px;
          border-radius: var(--r-sm);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all var(--t-fast) ease;
        }
        .hud-icon-btn:hover {
          border-color: var(--accent);
          color: var(--accent);
          box-shadow: 0 0 8px var(--accent-glow);
        }

        /* Avatar button */
        .hud-avatar-btn {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-deep), var(--accent));
          border: 2px solid var(--accent);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          box-shadow: 0 0 10px var(--accent-glow);
          transition: all 0.2s;
        }
        .hud-avatar-btn:hover { transform: scale(1.08); box-shadow: 0 0 16px var(--accent-glow-md); }
        .avatar-initial {
          font-size: 0.8rem;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        /* Rune stone toggle */
        .rune-toggle {
          display: flex;
          align-items: center;
          gap: 5px;
          background: var(--surface-glass);
          border: 1px solid var(--border);
          border-radius: var(--r-sm);
          padding: 4px 7px;
          cursor: pointer;
          transition: border-color 0.3s, box-shadow 0.3s;
          backdrop-filter: blur(8px);
        }
        .rune-toggle:hover {
          border-color: var(--accent);
          box-shadow: 0 0 10px var(--accent-glow);
        }
        .rune-sym {
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 1;
          transition: opacity 0.35s;
        }
        .rune-left  { color: var(--accent);  }
        .rune-right { color: var(--gold);    }
        .rune-stone-slider {
          width: 14px; height: 14px;
          border-radius: 2px;
          transition: background 0.35s, box-shadow 0.35s;
        }
        .rune-shadow .rune-stone-slider {
          background: linear-gradient(135deg, var(--accent-deep), var(--accent));
          box-shadow: 0 0 8px var(--accent-glow-md);
        }
        .rune-divine .rune-stone-slider {
          background: linear-gradient(135deg, var(--gold-dim), var(--gold));
          box-shadow: 0 0 8px var(--gold-glow);
        }

        @media (max-width: 600px) {
          .hud-gold-pill span.hud-gold-val { display: none; }
          .rune-toggle .rune-sym { display: none; }
        }
      `}</style>
    </header>
  );
};
