import React from 'react';
import { GameProvider, useGame } from './state/GameContext.jsx';
import { TopBar } from './components/layout/TopBar.jsx';
import { BottomNav } from './components/layout/BottomNav.jsx';
import { HomeTab } from './components/tabs/HomeTab.jsx';
import { QuestsTab } from './components/tabs/QuestsTab.jsx';
import { BattleTab } from './components/tabs/BattleTab.jsx';
import { CharacterTab } from './components/tabs/CharacterTab.jsx';
import { ShopTab } from './components/tabs/ShopTab.jsx';
import { ProfileTab } from './components/tabs/ProfileTab.jsx';
import { QuestToast } from './components/popups/QuestToast.jsx';
import { PopupManager } from './components/popups/PopupManager.jsx';
import './styles/tokens.css';

const MainArena = () => {
  const { activeTab, activeToast } = useGame();

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: 'var(--bg)',
        color: 'var(--text)',
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden'
      }}
    >
      {/* Top Header */}
      <TopBar />

      {/* Main viewport area */}
      <main
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}
      >
        {/* Tab Viewport Switching with quick fade-and-rise transition (<400ms) */}
        <div
          key={activeTab}
          style={{
            animation: 'overshootSettle 0.32s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            width: '100%',
            height: '100%'
          }}
        >
          {activeTab === 'home' && <HomeTab />}
          {activeTab === 'quests' && <QuestsTab />}
          {activeTab === 'battle' && <BattleTab />}
          {activeTab === 'character' && <CharacterTab />}
          {activeTab === 'shop' && <ShopTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav />

      {/* Lightweight Non-blocking Quest Complete Toast */}
      <QuestToast toast={activeToast} />

      {/* Queued Non-stacking Popups (Level Up, Legendary Reveal, Challenge, Battle Result) */}
      <PopupManager />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainArena />
    </GameProvider>
  );
}

