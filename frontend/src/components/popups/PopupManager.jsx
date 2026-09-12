import React from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { LevelUpModal } from './LevelUpModal.jsx';
import { LegendaryRevealModal } from './LegendaryRevealModal.jsx';
import { ChallengeReceivedModal } from './ChallengeReceivedModal.jsx';
import { BattleResultModal } from './BattleResultModal.jsx';

export const PopupManager = () => {
  const { currentPopup, dismissPopup } = useGame();

  if (!currentPopup) return null;

  // General rule: Level Up, Legendary Reveal, and Battle Result require explicit button
  const requiresExplicitButton =
    currentPopup.type === 'level_up' ||
    currentPopup.type === 'legendary_reveal' ||
    currentPopup.type === 'battle_result';

  const handleScrimClick = (e) => {
    if (e.target === e.currentTarget && !requiresExplicitButton) {
      dismissPopup();
    }
  };

  return (
    <div
      onClick={handleScrimClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'var(--overlay-scrim)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        transition: 'opacity 0.25s ease'
      }}
    >
      {currentPopup.type === 'level_up' && (
        <LevelUpModal data={currentPopup} onDismiss={dismissPopup} />
      )}
      {currentPopup.type === 'legendary_reveal' && (
        <LegendaryRevealModal data={currentPopup} onDismiss={dismissPopup} />
      )}
      {currentPopup.type === 'challenge_received' && (
        <ChallengeReceivedModal data={currentPopup} onDismiss={dismissPopup} />
      )}
      {currentPopup.type === 'battle_result' && (
        <BattleResultModal data={currentPopup} onDismiss={dismissPopup} />
      )}
    </div>
  );
};

