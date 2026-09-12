import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CLASSES,
  POWERS_CATALOG,
  INITIAL_EQUIPMENT_CATALOG,
  INITIAL_QUESTS,
  ACTIVE_RAIDS,
  OPPONENTS,
  TITLES_LIST,
  RECENT_BATTLES
} from '../types/gameData.js';
import { soundEngine } from '../audio/soundEngine.js';

const GameContext = createContext(null);

const STORAGE_KEY = 'arise_solo_leveling_v2';

export const GameProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('arise_theme') || 'shadow';
  });

  // Active Tab: home, quests, battle, character, shop, profile
  const [activeTab, setActiveTab] = useState('home');

  // Sound muted state
  const [isMuted, setIsMuted] = useState(false);

  // Player state
  const [player, setPlayer] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved player state', e);
      }
    }
    return {
      displayName: 'Sung Jin-Woo',
      selectedClass: 'knight',
      subclass: 'Monarch Disciple',
      title: 'Shadow Monarch',
      level: 24,
      currentXp: 740,
      nextLevelXp: 1000,
      gold: 1250,
      essence: 180,
      streak: 8,
      longestStreak: 19,
      powerCharges: 4,
      maxPowerCharges: 6,
      stats: {
        str: 48,
        int: 36,
        agi: 30,
        vit: 42
      },
      equippedByClass: {
        knight: { head: 'k_head_2', body: 'k_body_1', legs: 'k_legs_1', feet: 'k_feet_1' },
        mage: { head: 'm_head_1', body: 'm_body_1', legs: 'm_legs_1', feet: 'm_feet_1' },
        assassin: { head: 'a_head_1', body: 'a_body_1', legs: 'a_legs_1', feet: 'a_feet_1' },
        alchemist: { head: 'alc_head_1', body: 'alc_body_1', legs: 'alc_legs_1', feet: 'alc_feet_1' },
        summoner: { head: 's_head_1', body: 's_body_1', legs: 's_legs_1', feet: 's_feet_1' }
      },
      unlockedItemIds: [
        'k_head_1', 'k_body_1', 'k_legs_1', 'k_feet_1', 'k_head_2',
        'm_head_1', 'm_body_1', 'm_legs_1', 'm_feet_1',
        'a_head_1', 'a_body_1', 'a_legs_1', 'a_feet_1',
        'alc_head_1', 'alc_body_1', 'alc_legs_1', 'alc_feet_1',
        's_head_1', 's_body_1', 's_legs_1', 's_feet_1'
      ],
      quests: INITIAL_QUESTS,
      raids: ACTIVE_RAIDS,
      activeBattle: {
        id: 'duel_curr',
        opponent: OPPONENTS[0],
        format: 'Sprint Duel',
        timeRemaining: '03:42:15',
        userScore: 290,
        oppScore: 240,
        isActive: true
      },
      battleRecord: {
        total: 28,
        wins: 20,
        losses: 6,
        draws: 2,
        currentWinStreak: 4
      },
      recentBattles: RECENT_BATTLES,
      activePower: null // currently active power multiplier
    };
  });

  // Popup Queue system (no modal stacking!)
  const [popupQueue, setPopupQueue] = useState([]);
  const [currentPopup, setCurrentPopup] = useState(null);

  // Toast notification (non-blocking, slides down from top bar)
  const [activeToast, setActiveToast] = useState(null);

  // Save on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }, [player]);

  // Sync theme to document body
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('arise_theme', theme);
  }, [theme]);

  // Queue runner: dequeue next popup when currentPopup is dismissed
  useEffect(() => {
    if (!currentPopup && popupQueue.length > 0) {
      const [next, ...rest] = popupQueue;
      setCurrentPopup(next);
      setPopupQueue(rest);
    }
  }, [currentPopup, popupQueue]);

  // Sound toggle
  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) soundEngine.playButtonTap();
  };

  // Theme toggle with heavy slide sound
  const toggleTheme = () => {
    const nextTheme = theme === 'shadow' ? 'divine' : 'shadow';
    setTheme(nextTheme);
    soundEngine.playThemeToggle(nextTheme === 'divine');
  };

  // Switch Tab with airy whoosh chime
  const switchTab = (tabId) => {
    if (tabId === activeTab) return;
    soundEngine.playTabSwitch();
    setActiveTab(tabId);
  };

  // Add a popup to the queue
  const enqueuePopup = (popup) => {
    setPopupQueue(prev => [...prev, popup]);
  };

  // Close the active popup
  const dismissPopup = () => {
    soundEngine.playButtonTap();
    setCurrentPopup(null);
  };

  // Trigger Toast
  const showToast = ({ message, xp, gold }) => {
    setActiveToast({ message, xp, gold });
    setTimeout(() => {
      setActiveToast(null);
    }, 3800);
  };

  // Select a new class
  const selectClass = (classId) => {
    if (!CLASSES[classId]) return;
    soundEngine.playButtonTap();
    setPlayer(prev => ({
      ...prev,
      selectedClass: classId
    }));
  };

  // Equip an item
  const equipItem = (slot, itemId) => {
    soundEngine.playButtonTap();
    setPlayer(prev => {
      const currClass = prev.selectedClass;
      const classEquip = { ...prev.equippedByClass[currClass], [slot]: itemId };
      return {
        ...prev,
        equippedByClass: {
          ...prev.equippedByClass,
          [currClass]: classEquip
        }
      };
    });
  };

  // Buy Item in Shop (Gold verified, deterministic)
  const purchaseItem = (item) => {
    if (player.gold < item.price) {
      return false;
    }
    soundEngine.playButtonTap();
    setPlayer(prev => ({
      ...prev,
      gold: prev.gold - item.price,
      unlockedItemIds: prev.unlockedItemIds.includes(item.id)
        ? prev.unlockedItemIds
        : [...prev.unlockedItemIds, item.id]
    }));

    if (item.rarity === 'Legendary' || item.rarity === 'Epic' || item.rarity === 'Rare') {
      soundEngine.playLegendaryDrop();
      enqueuePopup({
        type: 'legendary_reveal',
        item: item
      });
    }

    return true;
  };

  // Activate a Power using earned charges
  const activatePower = (power) => {
    if (player.powerCharges < power.costCharges) return false;
    soundEngine.playButtonTap();
    setPlayer(prev => ({
      ...prev,
      powerCharges: prev.powerCharges - power.costCharges,
      activePower: power
    }));
    return true;
  };

  // Complete a Task
  const completeQuest = (questId) => {
    const quest = player.quests.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    soundEngine.playQuestComplete();

    // Calculate score using strict server-side formula (Part 7 & 8)
    const diffMultipliers = { easy: 1.0, medium: 1.3, hard: 1.6 };
    const diffMult = diffMultipliers[quest.difficulty] || 1.0;

    // Streak multiplier: up to +50% at ~2 weeks
    const streakMult = 1 + Math.min(0.5, (player.streak / 14) * 0.5);

    // Class affinity bonus (e.g. 1.2x if task category aligns with class primary attribute)
    const currentClassData = CLASSES[player.selectedClass];
    const affinityBonus = currentClassData.primaryAttr === quest.category ? 1.2 : 1.0;

    // Power multiplier
    const powerMult = player.activePower ? player.activePower.multiplier : 1.0;

    // Total task score & XP
    const earnedXp = Math.round(quest.baseXp * diffMult * streakMult);
    const earnedGold = Math.round(quest.gold * (quest.difficulty === 'hard' ? 1.4 : 1.0));
    const taskScore = Math.round(quest.baseXp * diffMult * affinityBonus * powerMult);

    // Attribute point routing
    const attrPointsGained = quest.difficulty === 'hard' ? 3 : quest.difficulty === 'medium' ? 2 : 1;
    const attrKey = quest.category.toLowerCase();

    // Check level up
    const newXpTotal = player.currentXp + earnedXp;
    let newLevel = player.level;
    let nextLevelXp = player.nextLevelXp;
    let leveledUp = false;

    if (newXpTotal >= nextLevelXp) {
      newLevel += 1;
      nextLevelXp = Math.round(nextLevelXp * 1.35);
      leveledUp = true;
    }

    // Update quest status
    const updatedQuests = player.quests.map(q =>
      q.id === questId ? { ...q, completed: true } : q
    );

    // Update battle score if active
    let updatedBattle = player.activeBattle;
    if (updatedBattle && updatedBattle.isActive) {
      updatedBattle = {
        ...updatedBattle,
        userScore: updatedBattle.userScore + taskScore
      };
    }

    setPlayer(prev => ({
      ...prev,
      currentXp: newXpTotal,
      level: newLevel,
      nextLevelXp: nextLevelXp,
      gold: prev.gold + earnedGold,
      powerCharges: Math.min(prev.maxPowerCharges, prev.powerCharges + 1), // power charges strictly earned by real tasks
      activePower: null, // consumed on task
      quests: updatedQuests,
      activeBattle: updatedBattle,
      stats: {
        ...prev.stats,
        [attrKey]: (prev.stats[attrKey] || 0) + attrPointsGained
      }
    }));

    // Trigger Non-blocking Quest Complete toast
    showToast({
      message: `Quest Complete: "${quest.title}"`,
      xp: earnedXp,
      gold: earnedGold
    });

    // Level up popup trigger
    if (leveledUp) {
      setTimeout(() => {
        soundEngine.playLevelUp();
        enqueuePopup({
          type: 'level_up',
          oldLevel: player.level,
          newLevel: newLevel,
          statSummary: `All primary combat & productivity attributes surged! Next milestone: Lv ${newLevel + 1}`
        });
      }, 700);
    }
  };

  // Add custom quest
  const addQuest = ({ title, category, difficulty, baseXp, gold }) => {
    soundEngine.playButtonTap();
    const newQuest = {
      id: `q_${Date.now()}`,
      title,
      category,
      difficulty,
      baseXp: Number(baseXp) || 100,
      gold: Number(gold) || 50,
      completed: false,
      dueText: 'Custom Objective',
      tags: ['Personal Quest']
    };
    setPlayer(prev => ({
      ...prev,
      quests: [newQuest, ...prev.quests]
    }));
  };

  // Receive challenge modal
  const receiveRandomChallenge = () => {
    soundEngine.playChallengeReceived();
    const opp = OPPONENTS[Math.floor(Math.random() * OPPONENTS.length)];
    enqueuePopup({
      type: 'challenge_received',
      challenger: opp,
      format: 'Sprint Duel',
      windowText: '4 Hours Window'
    });
  };

  // Accept or decline challenge
  const respondChallenge = (accepted, challenger, format) => {
    dismissPopup();
    if (accepted) {
      soundEngine.playButtonTap();
      setPlayer(prev => ({
        ...prev,
        activeBattle: {
          id: `duel_${Date.now()}`,
          opponent: challenger,
          format: format || 'Sprint Duel',
          timeRemaining: '04:00:00',
          userScore: 0,
          oppScore: 30,
          isActive: true
        }
      }));
    }
  };

  // Conclude battle
  const concludeBattle = (forcedWinner = null) => {
    if (!player.activeBattle || !player.activeBattle.isActive) return;
    const battle = player.activeBattle;
    const isWin = forcedWinner !== null ? forcedWinner : battle.userScore >= battle.oppScore;
    const isDraw = !isWin && battle.userScore === battle.oppScore;

    if (isWin) {
      soundEngine.playBattleWin();
    } else {
      soundEngine.playButtonTap();
    }

    const goldReward = isWin ? 240 : isDraw ? 100 : 35;
    const battleXp = isWin ? 300 : isDraw ? 120 : 0;

    enqueuePopup({
      type: 'battle_result',
      battle,
      isWin,
      isDraw,
      rewards: {
        gold: goldReward,
        battleXp: battleXp,
        titleProgress: isWin ? '+1 toward "Mage Slayer"' : 'None'
      }
    });

    setPlayer(prev => ({
      ...prev,
      gold: prev.gold + goldReward,
      activeBattle: {
        ...prev.activeBattle,
        isActive: false
      },
      battleRecord: {
        ...prev.battleRecord,
        total: prev.battleRecord.total + 1,
        wins: prev.battleRecord.wins + (isWin ? 1 : 0),
        losses: prev.battleRecord.losses + (!isWin && !isDraw ? 1 : 0),
        draws: prev.battleRecord.draws + (isDraw ? 1 : 0),
        currentWinStreak: isWin ? prev.battleRecord.currentWinStreak + 1 : 0
      },
      recentBattles: [
        {
          id: `b_${Date.now()}`,
          opponent: battle.opponent.name,
          class: CLASSES[battle.opponent.classId]?.name || 'Hunter',
          format: battle.format,
          result: isWin ? 'WIN' : isDraw ? 'DRAW' : 'LOSS',
          scoreUser: battle.userScore,
          scoreOpp: battle.oppScore,
          date: 'Just now'
        },
        ...prev.recentBattles.slice(0, 4)
      ]
    }));
  };

  // Reset to default demo data
  const resetDemoState = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  return (
    <GameContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        switchTab,
        isMuted,
        toggleSound,
        player,
        selectClass,
        equipItem,
        purchaseItem,
        activatePower,
        completeQuest,
        addQuest,
        receiveRandomChallenge,
        respondChallenge,
        concludeBattle,
        resetDemoState,
        // Popup & toast controls
        currentPopup,
        dismissPopup,
        enqueuePopup,
        activeToast
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

