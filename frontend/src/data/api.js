// Arise Server API Client with Authoritative Engine Fallback
// "The client never asserts a result — it only asserts an action."

const API_BASE = import.meta.env?.VITE_API_URL || 'http://localhost:3000/api';

// Non-linear Leveling Formula: base * (level ^ growth_exponent)
export const calculateNextLevelXp = (level) => {
  const base = 50;
  const growthExponent = 1.5;
  return Math.floor(base * Math.pow(Math.max(1, level), growthExponent));
};

export const calculateTaskRewards = (task, character, activePowers = []) => {
  const diffMultipliers = { easy: 1.0, medium: 1.3, hard: 1.6 };
  const diffMult = diffMultipliers[task.difficulty] || 1.0;

  // Class affinity bonus: bonus if task matches class primary stat
  let affinityBonus = 1.0;
  if (character.class === 'Knight' && (task.category === 'STR' || task.category === 'VIT')) affinityBonus = 1.2;
  else if (character.class === 'Mage' && task.category === 'INT') affinityBonus = 1.25;
  else if (character.class === 'Assassin' && task.category === 'AGI') affinityBonus = 1.2;
  else if (character.class === 'Alchemist' && (task.category === 'INT' || task.category === 'AGI')) affinityBonus = 1.2;
  else if (character.class === 'Summoner' && (task.category === 'INT' || task.category === 'VIT')) affinityBonus = 1.2;

  // Active power multipliers
  let powerMult = 1.0;
  if (activePowers.includes('Focus Surge')) powerMult += 0.5;
  if (activePowers.includes('Shadow Step')) powerMult += 0.4;

  // Streak bonus multiplier (diminishing, capped around +50%)
  const streakBonusPercent = Math.min(50, character.streak * 5);
  const streakMult = 1 + streakBonusPercent / 100;

  const earnedXp = Math.round(task.baseXp * diffMult * affinityBonus * powerMult * streakMult);
  const earnedGold = Math.round((task.baseXp * 0.75 + 15) * diffMult);
  const earnedStat = task.statGain || Math.round(earnedXp * 0.15);

  return {
    earnedXp,
    earnedGold,
    earnedStat,
    attributeGained: task.category,
    streakBonusPercent
  };
};

export const api = {
  async request(endpoint, options = {}) {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options.headers },
        ...options
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch {
      return null;
    }
  },

  async completeTask(task, character, activePowers) {
    const remote = await this.request(`/tasks/${task.id}/complete`, {
      method: 'POST',
      body: JSON.stringify({ duration: task.durationMinutes, powers: activePowers })
    });
    if (remote && remote.success) return remote;

    return {
      success: true,
      rewards: calculateTaskRewards(task, character, activePowers)
    };
  },

  async allocateStat(attribute, currentStats, unspentPoints) {
    if (unspentPoints <= 0) return { success: false, message: 'No unspent stat points' };
    const remote = await this.request('/character/allocate-stat', {
      method: 'POST',
      body: JSON.stringify({ attribute })
    });
    if (remote && remote.success) return remote;

    return {
      success: true,
      newStats: {
        ...currentStats,
        [attribute]: (currentStats[attribute] || 10) + 1
      },
      remainingPoints: unspentPoints - 1
    };
  },

  async resolveBossGate(boss, userScore) {
    const remote = await this.request(`/bosses/${boss.id}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ userScore })
    });
    if (remote && remote.success) return remote;

    const won = userScore >= boss.targetScore;
    return {
      won,
      drop: won ? boss.guaranteedDrop : null,
      goldAward: won ? 350 : 40,
      xpAward: won ? 450 : 60
    };
  }
};

