import React, { createContext, useContext, useState, useEffect } from 'react';
import soundFx from '../audio/soundSystem';
import { CLASSES, TITLES } from '../data/classes';
import {
  INITIAL_QUESTS,
  INITIAL_RAIDS,
  INITIAL_BOSSES,
  INITIAL_BATTLES,
  INITIAL_BATTLE_RESULTS,
  SHOP_ITEMS,
  DEFAULT_STARTING_EQUIPPED
} from '../data/defaultData';
import { calculateNextLevelXp, api } from '../data/api';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
  // Theme: 'shadow' (default) or 'divine'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('arise_theme') || 'shadow';
  });

  const [soundMuted, setSoundMuted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  // Character Profile initialized precisely to prompt spec (Level 18, 2,480 Gold, 14-day streak)
  const initialNextXp = calculateNextLevelXp(18); // e.g. ~3817 XP
  const initialXp = Math.round(initialNextXp * 0.72); // Exactly 72% to next level

  const [character, setCharacter] = useState({
    name: 'Isham',
    title: 'Shadow Monarch',
    class: 'Mage',
    subclass: 'Elementalist',
    level: 18,
    xp: initialXp,
    gold: 2480,
    streak: 14,
    stats: {
      STR: 42,
      INT: 67,
      AGI: 51,
      VIT: 45,
      unspent_points: 3
    },
    battlesCount: 27,
    winsCount: 19,
    activePowers: ['Focus Surge']
  });

  // Equipped gear per class (§3.3 & §23)
  const [equippedByClass, setEquippedByClass] = useState(() => {
    // Give Mage its legendary outfit pieces to demonstrate the 3D character and Ascended aura
    return {
      ...DEFAULT_STARTING_EQUIPPED,
      Mage: CLASSES.Mage.legendaryOutfit
    };
  });

  const [inventory, setInventory] = useState([
    { id: 'inv-1', name: 'Apprentice Mana Cloak', rarity: 'Uncommon', slot: 'Body', icon: '🥋' },
    { id: 'inv-2', name: 'Traveler Leather Boots', rarity: 'Uncommon', slot: 'Feet', icon: '👢' }
  ]);

  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [raids, setRaids] = useState(INITIAL_RAIDS);
  const [bosses, setBosses] = useState(INITIAL_BOSSES);
  const [battles, setBattles] = useState(INITIAL_BATTLES);
  const [battleResults, setBattleResults] = useState(INITIAL_BATTLE_RESULTS);
  const [titles, setTitles] = useState(TITLES);

  // Popups & Ceremony State
  const [questToast, setQuestToast] = useState(null); // { title, xp, gold, stat, attr }
  const [levelUpModal, setLevelUpModal] = useState(null); // { oldLevel, newLevel, stats }
  const [legendaryRevealModal, setLegendaryRevealModal] = useState(null); // item object
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('arise_theme', theme);
  }, [theme]);

  // Sync sound muted
  useEffect(() => {
    soundFx.setMuted(soundMuted);
  }, [soundMuted]);

  // Weighted Theme Toggle with §8 procedural sound
  const toggleTheme = () => {
    const nextTheme = theme === 'shadow' ? 'divine' : 'shadow';
    setTheme(nextTheme);
    soundFx.playThemeToggle(nextTheme === 'divine');
  };

  // Switch Tab with sound
  const switchTab = (tabName) => {
    if (tabName !== activeTab) {
      soundFx.playTabSwitch();
      setActiveTab(tabName);
    }
  };

  // Complete Quest Micro Reward Sequence (§15)
  const completeQuest = async (questId) => {
    const quest = quests.find((q) => q.id === questId);
    if (!quest || quest.completed) return;

    soundFx.playQuestComplete();

    // Mark completed optimistically
    setQuests((prev) =>
      prev.map((q) => (q.id === questId ? { ...q, completed: true, completedAt: new Date().toISOString() } : q))
    );

    // Calculate rewards through authoritative engine
    const res = await api.completeTask(quest, character, character.activePowers);
    const { earnedXp, earnedGold, earnedStat, attributeGained } = res.rewards;

    // Toast slides down beneath top bar (§15)
    setQuestToast({
      title: quest.title,
      xp: earnedXp,
      gold: earnedGold,
      stat: earnedStat,
      attribute: attributeGained
    });

    setTimeout(() => {
      setQuestToast(null);
    }, 3400);

    // Update character state and check level up
    setCharacter((prev) => {
      const newXp = prev.xp + earnedXp;
      const newGold = prev.gold + earnedGold;
      let currentLevel = prev.level;
      let currentXp = newXp;
      let didLevelUp = false;

      let nextXp = calculateNextLevelXp(currentLevel);
      while (currentXp >= nextXp) {
        currentXp -= nextXp;
        currentLevel += 1;
        didLevelUp = true;
        nextXp = calculateNextLevelXp(currentLevel);
      }

      const updatedStats = {
        ...prev.stats,
        [attributeGained]: (prev.stats[attributeGained] || 10) + Math.max(1, Math.round(earnedStat / 10))
      };

      if (didLevelUp) {
        setTimeout(() => {
          soundFx.playLevelUp();
          setLevelUpModal({
            oldLevel: prev.level,
            newLevel: currentLevel,
            stats: {
              INT: 4,
              AGI: 1,
              VIT: 2
            }
          });
        }, 500);

        updatedStats.INT += 4;
        updatedStats.AGI += 1;
        updatedStats.VIT += 2;
        updatedStats.unspent_points += 3;
      }

      return {
        ...prev,
        level: currentLevel,
        xp: currentXp,
        gold: newGold,
        stats: updatedStats
      };
    });

    // Feed active boss gate target score
    setBosses((prev) =>
      prev.map((b) => (b.status === 'active' ? { ...b, currentScore: b.currentScore + earnedXp } : b))
    );

    // Feed active battles
    setBattles((prev) =>
      prev.map((b) => (b.status === 'in_progress' ? { ...b, myScore: b.myScore + Math.round(earnedXp * 0.8) } : b))
    );
  };

  // Add Quest
  const addQuest = (newQuest) => {
    soundFx.playButtonTap();
    const quest = {
      id: `q-${Date.now()}`,
      title: newQuest.title || 'Untitled Directive',
      category: newQuest.category || 'STR',
      difficulty: newQuest.difficulty || 'medium',
      durationMinutes: Number(newQuest.durationMinutes) || 30,
      baseXp: Number(newQuest.baseXp) || 60,
      statGain: Math.round((Number(newQuest.baseXp) || 60) * 0.15),
      streakBonus: 10,
      activePerkBonus: `${newQuest.category} Affinity`,
      completed: false,
      projectChain: newQuest.projectChain || null
    };
    setQuests((prev) => [quest, ...prev]);
  };

  // Delete Quest
  const deleteQuest = (questId) => {
    soundFx.playButtonTap();
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  // Allocate Stat Point
  const allocateStat = async (attribute) => {
    if (character.stats.unspent_points <= 0) return;
    soundFx.playButtonTap();

    const res = await api.allocateStat(attribute, character.stats, character.stats.unspent_points);
    if (res.success) {
      setCharacter((prev) => ({
        ...prev,
        stats: res.newStats
      }));
    }
  };

  // Switch Character Class (Preserves each class's own outfit loadout! §3.6)
  const switchClass = (newClassId) => {
    if (!CLASSES[newClassId] || character.class === newClassId) return;
    soundFx.playButtonTap();
    setCharacter((prev) => ({
      ...prev,
      class: newClassId,
      subclass: Object.keys(CLASSES[newClassId].subclasses)[0]
    }));
  };

  // Select Subclass
  const selectSubclass = (subclassId) => {
    soundFx.playButtonTap();
    setCharacter((prev) => ({
      ...prev,
      subclass: subclassId
    }));
  };

  // Equip Item
  const equipItem = (item) => {
    soundFx.playButtonTap();
    const currentClass = character.class;
    setEquippedByClass((prev) => ({
      ...prev,
      [currentClass]: {
        ...prev[currentClass],
        [item.slot]: item
      }
    }));
  };

  // Unequip Item
  const unequipItem = (slot) => {
    soundFx.playButtonTap();
    const currentClass = character.class;
    setEquippedByClass((prev) => ({
      ...prev,
      [currentClass]: {
        ...prev[currentClass],
        [slot]: null
      }
    }));
  };

  // Buy Shop Item
  const buyShopItem = (item) => {
    if (character.gold < item.price) return false;
    soundFx.playButtonTap();

    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold - item.price
    }));

    setInventory((prev) => [
      {
        ...item,
        id: `inv-${Date.now()}`
      },
      ...prev
    ]);

    return true;
  };

  // Challenge Boss Gate
  const challengeBossGate = async (bossId) => {
    soundFx.playButtonTap();
    const boss = bosses.find((b) => b.id === bossId);
    if (!boss) return;

    const res = await api.resolveBossGate(boss, boss.currentScore);
    if (res.won && res.drop) {
      soundFx.playLegendaryDrop();
      setLegendaryRevealModal(res.drop);

      setInventory((prev) => [res.drop, ...prev]);
      setCharacter((prev) => ({
        ...prev,
        gold: prev.gold + res.goldAward,
        xp: prev.xp + res.xpAward
      }));
      setBosses((prev) =>
        prev.map((b) => (b.id === bossId ? { ...b, status: 'cleared' } : b))
      );
    } else {
      alert(`Boss barrier holding! Output reached: ${boss.currentScore} / ${boss.targetScore}. Complete more directives to breach!`);
    }
  };

  // Complete Battle Duel
  const claimDuelVictory = (battleId) => {
    const battle = battles.find((b) => b.id === battleId);
    if (!battle) return;

    soundFx.playBattleWin();

    setCharacter((prev) => ({
      ...prev,
      gold: prev.gold + battle.wagerGold,
      xp: prev.xp + battle.wagerXp,
      battlesCount: prev.battlesCount + 1,
      winsCount: prev.winsCount + 1
    }));

    setBattleResults((prev) => [
      {
        id: `br-${Date.now()}`,
        opponentName: battle.opponentName,
        opponentClass: battle.opponentClass,
        format: battle.format,
        result: battle.myScore >= battle.opponentScore ? 'WIN' : 'LOSS',
        myScore: battle.myScore,
        opponentScore: battle.opponentScore,
        goldGained: battle.wagerGold,
        battleXpGained: battle.wagerXp,
        titleProgress: 'Mage Slayer 4/5',
        date: 'Just now'
      },
      ...prev
    ]);

    setBattles((prev) => prev.filter((b) => b.id !== battleId));
  };

  // Create Duel
  const createDuel = (opponentName, opponentClass, format, wagerGold) => {
    soundFx.playButtonTap();
    const newDuel = {
      id: `b-${Date.now()}`,
      opponentName: opponentName || 'Rival Hunter',
      opponentClass: opponentClass || 'Knight',
      opponentLevel: Math.max(1, character.level),
      format: format || 'Streak Clash',
      formatSubtitle: format === 'Sprint Duel' ? '1 TASK · FIRST TO COMPLETE' : '24 HOURS · MOST PRODUCTIVITY WINS',
      myScore: 0,
      opponentScore: 40,
      timeRemaining: format === 'Sprint Duel' ? '01h 00m' : '24h 00m',
      status: 'in_progress',
      wagerGold: Number(wagerGold) || 100,
      wagerXp: 80
    };
    setBattles((prev) => [newDuel, ...prev]);
  };

  // Ascended Visual State check (§3.4: all 4 slots Legendary or Mythic)
  const currentEquipped = equippedByClass[character.class] || {};
  const isAscended = ['Head', 'Body', 'Legs', 'Feet'].every((slot) => {
    const item = currentEquipped[slot];
    return item && (item.rarity === 'Legendary' || item.rarity === 'Mythic');
  });

  return (
    <GameContext.Provider
      value={{
        theme,
        toggleTheme,
        soundMuted,
        setSoundMuted,
        activeTab,
        switchTab,
        character,
        setCharacter,
        equipped: currentEquipped,
        equipItem,
        unequipItem,
        inventory,
        quests,
        completeQuest,
        addQuest,
        deleteQuest,
        allocateStat,
        switchClass,
        selectSubclass,
        raids,
        bosses,
        challengeBossGate,
        battles,
        claimDuelVictory,
        createDuel,
        battleResults,
        titles,
        shopItems: SHOP_ITEMS,
        buyShopItem,
        isAscended,
        questToast,
        setQuestToast,
        levelUpModal,
        setLevelUpModal,
        legendaryRevealModal,
        setLegendaryRevealModal,
        profileModalOpen,
        setProfileModalOpen
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
};

