import React from 'react';
import { useGame } from './state/GameContext';
import { TopBar } from './components/common/TopBar';
import { ModalsContainer } from './components/common/Modals';
import { ProfileModal } from './components/character/ProfileModal';
import { HomeHall } from './components/home/HomeHall';
import { QuestsTab } from './components/quests/QuestsTab';
import { BattleTab } from './components/battle/BattleTab';
import { CharacterTab } from './components/character/CharacterTab';
import { ShopTab } from './components/shop/ShopTab';
import {
  IconHome, IconQuests, IconBattle, IconCharacter, IconShop
} from './components/common/Icons';

const NAV = [
  { id: 'home',      Icon: IconHome,      label: 'HOME'      },
  { id: 'quests',    Icon: IconQuests,    label: 'QUESTS'    },
  { id: 'battle',    Icon: IconBattle,    label: 'BATTLE'    },
  { id: 'character', Icon: IconCharacter, label: 'CHARACTER' },
  { id: 'shop',      Icon: IconShop,      label: 'SHOP'      },
];

export const App = () => {
  const { activeTab, switchTab } = useGame();

  return (
    <div className="arise-shell">
      <TopBar />

      <main className="arise-viewport">
        {activeTab === 'home'      && <HomeHall      key="home"      />}
        {activeTab === 'quests'    && <QuestsTab     key="quests"    />}
        {activeTab === 'battle'    && <BattleTab     key="battle"    />}
        {activeTab === 'character' && <CharacterTab  key="character" />}
        {activeTab === 'shop'      && <ShopTab       key="shop"      />}
      </main>

      {/* RPG Bottom Navigation */}
      <nav className="arise-nav" aria-label="Main Navigation">
        <div className="nav-glow-line" />
        {NAV.map(({ id, Icon, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              className={`nav-btn font-display ${active ? 'nav-active' : ''}`}
              onClick={() => switchTab(id)}
              aria-label={label}
            >
              {active && <span className="nav-active-indicator" />}
              <Icon size={18} />
              <span className="nav-label">{label}</span>
            </button>
          );
        })}
      </nav>

      <ProfileModal />
      <ModalsContainer />

      <style>{`
        .arise-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg);
          transition: background 0.4s ease;
        }

        .arise-viewport {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding-bottom: 62px; /* nav height */
          min-height: 0;
        }

        /* ── Bottom RPG Navigation ── */
        .arise-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 62px;
          background: rgba(8, 9, 16, 0.96);
          border-top: 1px solid var(--border-subtle);
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 100;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: background 0.4s;
        }
        [data-theme="divine"] .arise-nav {
          background: rgba(240, 235, 220, 0.97);
          border-top-color: var(--border);
        }

        /* Thin glowing top line */
        .nav-glow-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent 0%,
            var(--border-subtle) 10%,
            var(--accent) 35%,
            var(--creature) 50%,
            var(--accent) 65%,
            var(--border-subtle) 90%,
            transparent 100%);
          opacity: 0.5;
          pointer-events: none;
        }

        .nav-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 8px 14px;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          transition: color var(--t-base) ease, transform var(--t-base) var(--ease-out-expo);
          position: relative;
          border-radius: 0;
          flex: 1;
          max-width: 80px;
        }
        .nav-btn:hover:not(.nav-active) {
          color: var(--text-dim);
        }
        .nav-active {
          color: var(--accent);
          transform: translateY(-2px);
          text-shadow: 0 0 10px var(--accent-glow);
        }
        [data-theme="divine"] .nav-active {
          color: var(--accent);
        }

        /* Active tab indicator line */
        .nav-active-indicator {
          position: absolute;
          top: -1px;
          left: 10px;
          right: 10px;
          height: 2px;
          background: linear-gradient(90deg, var(--accent-deep), var(--accent), var(--creature), var(--accent), var(--accent-deep));
          box-shadow: 0 0 8px var(--accent-glow-md), 0 0 16px var(--accent-glow);
          border-radius: 0 0 2px 2px;
        }

        .nav-label {
          font-size: 0.58rem;
          letter-spacing: 0.08em;
          line-height: 1;
        }

        @media (max-width: 480px) {
          .nav-btn { padding: 8px 6px; max-width: 64px; }
          .nav-label { font-size: 0.54rem; }
        }
      `}</style>
    </div>
  );
};

export default App;
