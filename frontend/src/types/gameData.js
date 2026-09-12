// Game Seed Data & Class Catalog for "Arise" (Solo Leveling Edition)

export const CLASSES = {
  knight: {
    id: 'knight',
    name: 'Knight',
    archetype: 'Frontline / Disciplined / Routine-Driven',
    quote: 'Heavy plate forged in resilience. Built on unyielding daily discipline.',
    primaryAttr: 'STR',
    palette: {
      armor: '#1c1f26',
      cloth: '#8f1d2c',
      trim: '#c49a45',
      glow: '#e0546b'
    },
    baseStats: { str: 28, int: 10, agi: 14, vit: 24 },
    signatureGesture: 'Heavy two-handed blade guard rest',
    powerName: 'Second Wind',
    powerDesc: 'Shields score and grants +40% task score in active duels.'
  },
  mage: {
    id: 'mage',
    name: 'Mage',
    archetype: 'Deep-Focus / High-Risk / High-Reward',
    quote: 'Keeper of ancient sigils. Thrives in extended deep-work rituals.',
    primaryAttr: 'INT',
    palette: {
      armor: '#0d1527',
      cloth: '#18284d',
      trim: '#8bb4e8',
      glow: '#4a80e8'
    },
    baseStats: { str: 10, int: 32, agi: 14, vit: 16 },
    signatureGesture: 'Levitating arcane orb with pulse harmonics',
    powerName: 'Focus Surge',
    powerDesc: 'Amplifies next completed mental quest score by 2.0x.'
  },
  assassin: {
    id: 'assassin',
    name: 'Assassin',
    archetype: 'Speed / Consistency / Small Wins',
    quote: 'Serrated dual shadows. Masters of rapid momentum and unbroken streaks.',
    primaryAttr: 'AGI',
    palette: {
      armor: '#14121c',
      cloth: '#221936',
      trim: '#6c5594',
      glow: '#8b6cf0'
    },
    baseStats: { str: 14, int: 14, agi: 32, vit: 16 },
    signatureGesture: 'Reverse-grip curved daggers flourish',
    powerName: 'Shadow Step',
    powerDesc: 'Grants instant 1.5x score bonus on immediate task completion.'
  },
  alchemist: {
    id: 'alchemist',
    name: 'Alchemist',
    archetype: 'Prep / Multi-Tasking / Utility',
    quote: 'Master of reagents and systems. Converts complex rituals into power.',
    primaryAttr: 'VIT',
    palette: {
      armor: '#211a14',
      cloth: '#33261a',
      trim: '#cda851',
      glow: '#35e3a0'
    },
    baseStats: { str: 12, int: 22, agi: 18, vit: 28 },
    signatureGesture: 'Swirling emerald potion vial distillation',
    powerName: 'Volatile Mixture',
    powerDesc: 'Spills +25% bonus attribute points across all four attributes.'
  },
  summoner: {
    id: 'summoner',
    name: 'Summoner',
    archetype: 'Delegation / Systems-Thinking / Long-Term',
    quote: 'Commander of spectral legions. Builds cascading compound momentum.',
    primaryAttr: 'INT',
    palette: {
      armor: '#101018',
      cloth: '#1f1f2e',
      trim: '#d0d0e6',
      glow: '#6d4ae8'
    },
    baseStats: { str: 10, int: 28, agi: 16, vit: 22 },
    signatureGesture: 'Summoning a dark spectral flame familiar',
    powerName: 'Soul Link',
    powerDesc: 'Channels 1.35x compounding bonus for all tasks in duel window.'
  }
};

export const POWERS_CATALOG = [
  { id: 'focus_surge', classId: 'mage', name: 'Focus Surge', costCharges: 3, multiplier: 2.0, desc: 'Next completed INT quest yields 2x score in battle.' },
  { id: 'second_wind', classId: 'knight', name: 'Second Wind', costCharges: 3, multiplier: 1.4, desc: 'Boosts physical & routine task scores by +40%.' },
  { id: 'shadow_step', classId: 'assassin', name: 'Shadow Step', costCharges: 2, multiplier: 1.5, desc: 'Quick-strike 1.5x score boost on fastest tasks.' },
  { id: 'volatile_mix', classId: 'alchemist', name: 'Volatile Mixture', costCharges: 3, multiplier: 1.35, desc: 'Multi-attribute catalyst granting bonus points.' },
  { id: 'soul_link', classId: 'summoner', name: 'Soul Link', costCharges: 4, multiplier: 1.6, desc: 'Continuous spectral aura compounding task scores.' },
  { id: 'adrenaline', classId: 'all', name: 'Adrenaline Rush', costCharges: 2, multiplier: 1.25, desc: 'Universal burst of speed score across any category.' },
  { id: 'guardians_ward', classId: 'all', name: 'Guardian’s Ward', costCharges: 4, multiplier: 1.15, desc: 'Shields player against battle loss penalties.' }
];

export const INITIAL_EQUIPMENT_CATALOG = [
  // Knight Gear
  { id: 'k_head_1', classId: 'knight', slot: 'head', name: 'Standard Steel Sallet', rarity: 'Common', icon: '⛑', price: 0, unlocked: true },
  { id: 'k_body_1', classId: 'knight', slot: 'body', name: 'Tempered Iron Cuirass', rarity: 'Common', icon: '🛡', price: 0, unlocked: true },
  { id: 'k_legs_1', classId: 'knight', slot: 'legs', name: 'Heavy Steel Greaves', rarity: 'Common', icon: '🦵', price: 0, unlocked: true },
  { id: 'k_feet_1', classId: 'knight', slot: 'feet', name: 'Iron-Plated Sabatons', rarity: 'Common', icon: '👢', price: 0, unlocked: true },
  
  { id: 'k_head_2', classId: 'knight', slot: 'head', name: 'Vanguard Crested Helm', rarity: 'Uncommon', icon: '👑', price: 180, unlocked: true },
  { id: 'k_body_2', classId: 'knight', slot: 'body', name: 'Crimson Knight Hauberk', rarity: 'Rare', icon: '🥋', price: 450, unlocked: false },
  { id: 'k_body_3', classId: 'knight', slot: 'body', name: 'Dreadlord Plate of Agony', rarity: 'Epic', icon: '🎽', price: 900, unlocked: false },
  { id: 'k_head_4', classId: 'knight', slot: 'head', name: 'Crown of the Blood Sovereign', rarity: 'Legendary', icon: '🔱', price: 1800, unlocked: false },
  { id: 'k_body_5', classId: 'knight', slot: 'body', name: 'Aegis of the Immortal Monarch', rarity: 'Mythic', icon: '⚜', price: 3500, unlocked: false },

  // Mage Gear
  { id: 'm_head_1', classId: 'mage', slot: 'head', name: 'Apprentice Pointed Hat', rarity: 'Common', icon: '🧙', price: 0, unlocked: true },
  { id: 'm_body_1', classId: 'mage', slot: 'body', name: 'Deep Navy Scholar Robe', rarity: 'Common', icon: '👘', price: 0, unlocked: true },
  { id: 'm_legs_1', classId: 'mage', slot: 'legs', name: 'Loomed Linen Breeches', rarity: 'Common', icon: '👖', price: 0, unlocked: true },
  { id: 'm_feet_1', classId: 'mage', slot: 'feet', name: 'Velvet Stride Slippers', rarity: 'Common', icon: '🥿', price: 0, unlocked: true },
  
  { id: 'm_head_2', classId: 'mage', slot: 'head', name: 'Starlight Wide-Brim Hat', rarity: 'Uncommon', icon: '🎩', price: 190, unlocked: false },
  { id: 'm_body_2', classId: 'mage', slot: 'body', name: 'Astral Weave Robe', rarity: 'Rare', icon: '🌌', price: 460, unlocked: false },
  { id: 'm_body_3', classId: 'mage', slot: 'body', name: 'Archmage Nether Mantle', rarity: 'Epic', icon: '✨', price: 920, unlocked: false },
  { id: 'm_head_4', classId: 'mage', slot: 'head', name: 'Crown of Arcane Singularity', rarity: 'Legendary', icon: '🔮', price: 1900, unlocked: false },

  // Assassin Gear
  { id: 'a_head_1', classId: 'assassin', slot: 'head', name: 'Shadow Cowl', rarity: 'Common', icon: '👤', price: 0, unlocked: true },
  { id: 'a_body_1', classId: 'assassin', slot: 'body', name: 'Supple Leather Tunic', rarity: 'Common', icon: '🦺', price: 0, unlocked: true },
  { id: 'a_legs_1', classId: 'assassin', slot: 'legs', name: 'Midnight Stalker Chaps', rarity: 'Common', icon: '👖', price: 0, unlocked: true },
  { id: 'a_feet_1', classId: 'assassin', slot: 'feet', name: 'Silent Prowl Tabi', rarity: 'Common', icon: '🥾', price: 0, unlocked: true },

  { id: 'a_head_2', classId: 'assassin', slot: 'head', name: 'Phantom Veil Mask', rarity: 'Uncommon', icon: '🎭', price: 185, unlocked: false },
  { id: 'a_body_2', classId: 'assassin', slot: 'body', name: 'Eclipse Shadow Vest', rarity: 'Rare', icon: '🌒', price: 480, unlocked: false },
  { id: 'a_body_3', classId: 'assassin', slot: 'body', name: 'Nightstalker Spectral Shroud', rarity: 'Epic', icon: '🖤', price: 950, unlocked: false },
  { id: 'a_head_4', classId: 'assassin', slot: 'head', name: 'Visage of the Void Reaper', rarity: 'Legendary', icon: '💀', price: 2000, unlocked: false },

  // Alchemist Gear
  { id: 'alc_head_1', classId: 'alchemist', slot: 'head', name: 'Brass-Rimmed Goggles', rarity: 'Common', icon: '🥽', price: 0, unlocked: true },
  { id: 'alc_body_1', classId: 'alchemist', slot: 'body', name: 'Reagent Bandolier Duster', rarity: 'Common', icon: '🥼', price: 0, unlocked: true },
  { id: 'alc_legs_1', classId: 'alchemist', slot: 'legs', name: 'Reinforced Chemist Slacks', rarity: 'Common', icon: '👖', price: 0, unlocked: true },
  { id: 'alc_feet_1', classId: 'alchemist', slot: 'feet', name: 'Acid-Resistant Stompers', rarity: 'Common', icon: '🥾', price: 0, unlocked: true },

  { id: 'alc_head_2', classId: 'alchemist', slot: 'head', name: 'Plague Scholar Monocle', rarity: 'Uncommon', icon: '🧐', price: 175, unlocked: false },
  { id: 'alc_body_2', classId: 'alchemist', slot: 'body', name: 'Transmuter Emerald Coat', rarity: 'Rare', icon: '🧪', price: 440, unlocked: false },
  { id: 'alc_body_3', classId: 'alchemist', slot: 'body', name: 'Philosopher’s Sealed Greatcoat', rarity: 'Epic', icon: '💎', price: 880, unlocked: false },
  { id: 'alc_head_4', classId: 'alchemist', slot: 'head', name: 'Oculus of the Prima Materia', rarity: 'Legendary', icon: '👁', price: 1850, unlocked: false },

  // Summoner Gear
  { id: 's_head_1', classId: 'summoner', slot: 'head', name: 'Ceremonial Rune Band', rarity: 'Common', icon: '➰', price: 0, unlocked: true },
  { id: 's_body_1', classId: 'summoner', slot: 'body', name: 'Monarch Shadow Cassock', rarity: 'Common', icon: '🥻', price: 0, unlocked: true },
  { id: 's_legs_1', classId: 'summoner', slot: 'legs', name: 'Spectral Inscribed Skirt', rarity: 'Common', icon: '👗', price: 0, unlocked: true },
  { id: 's_feet_1', classId: 'summoner', slot: 'feet', name: 'Gravewalker Wraps', rarity: 'Common', icon: '👡', price: 0, unlocked: true },

  { id: 's_head_2', classId: 'summoner', slot: 'head', name: 'Crown of the Undead Realm', rarity: 'Rare', icon: '👑', price: 470, unlocked: false },
  { id: 's_body_3', classId: 'summoner', slot: 'body', name: 'Shadow Monarch Regalia', rarity: 'Legendary', icon: '🪶', price: 2100, unlocked: false },
  { id: 's_body_4', classId: 'summoner', slot: 'body', name: 'Eternal Sovereign Voidmantle', rarity: 'Mythic', icon: '🌌', price: 3800, unlocked: false }
];

export const INITIAL_QUESTS = [
  {
    id: 'q1',
    title: 'Crush 50 Push-ups & Core Workout',
    category: 'STR',
    difficulty: 'hard',
    baseXp: 150,
    gold: 85,
    completed: false,
    dueText: 'Daily Routine',
    tags: ['Fitness', 'Discipline']
  },
  {
    id: 'q2',
    title: '90-Minute Deep Architecture Coding Session',
    category: 'INT',
    difficulty: 'hard',
    baseXp: 180,
    gold: 95,
    completed: false,
    dueText: 'High Priority',
    tags: ['Deep Focus', 'Engineering']
  },
  {
    id: 'q3',
    title: 'Speed Inbox Zero & Clear 10 Pending Tasks',
    category: 'AGI',
    difficulty: 'easy',
    baseXp: 75,
    gold: 40,
    completed: false,
    dueText: 'Morning Sprint',
    tags: ['Momentum', 'Execution']
  },
  {
    id: 'q4',
    title: 'Drink 2.5L Water & 20-Min Sunlight Walk',
    category: 'VIT',
    difficulty: 'easy',
    baseXp: 60,
    gold: 35,
    completed: false,
    dueText: 'Bio-Recovery',
    tags: ['Health', 'Foundation']
  },
  {
    id: 'q5',
    title: 'Read 25 Pages of Technical Manuscript',
    category: 'INT',
    difficulty: 'medium',
    baseXp: 110,
    gold: 60,
    completed: true,
    dueText: 'Completed',
    tags: ['Intellect', 'Reading']
  }
];

export const ACTIVE_RAIDS = [
  {
    id: 'raid_1',
    title: 'Gate of the Cerberus: 7-Day Consistency Trial',
    description: 'Complete at least 3 daily tasks every day for 7 consecutive days.',
    currentDays: 5,
    totalDays: 7,
    guaranteedDrop: 'Dreadlord Plate of Agony (Epic Armor)',
    dropRarity: 'Epic',
    icon: '🔥'
  },
  {
    id: 'raid_2',
    title: 'Demon Castle Ascent: 14-Day Iron Will',
    description: 'Maintain an unbroken streak and vanquish 25 Hard-tier quests.',
    currentDays: 9,
    totalDays: 14,
    guaranteedDrop: 'Crown of the Blood Sovereign (Legendary Helm)',
    dropRarity: 'Legendary',
    icon: '🏰'
  }
];

export const OPPONENTS = [
  { id: 'opp_1', name: 'Viper_Jin', classId: 'assassin', level: 23, title: 'Blade Whisperer', winRate: '72%' },
  { id: 'opp_2', name: 'Archmage_Sol', classId: 'mage', level: 26, title: 'Mana Weaver', winRate: '68%' },
  { id: 'opp_3', name: 'Ironclad_Vane', classId: 'knight', level: 25, title: 'Unbroken Bulwark', winRate: '64%' },
  { id: 'opp_4', name: 'Chime_Rin', classId: 'alchemist', level: 21, title: 'Emerald Catalyst', winRate: '59%' }
];

export const TITLES_LIST = [
  { id: 't_monarch', name: 'Shadow Monarch', icon: '👑', unlocked: true, desc: 'Master of the dark sovereign army' },
  { id: 't_slayer', name: 'Mage Slayer', icon: '⚔️', unlocked: true, desc: 'Torphed 10 duels against spellcasters' },
  { id: 't_conqueror', name: 'Dungeon Conqueror', icon: '🏰', unlocked: false, desc: 'Clear 5 high-rank raid gates' },
  { id: 't_disciplinarian', name: 'Daily Disciplinarian', icon: '⏱️', unlocked: true, desc: 'Maintain an active streak for 14 days' },
  { id: 't_ironwill', name: 'Iron Will', icon: '🛡️', unlocked: true, desc: 'Log 50 consecutive task completions' },
  { id: 't_relentless', name: 'Relentless Ascendant', icon: '⚡', unlocked: false, desc: 'Reach Level 30 with pure consistency' }
];

export const RECENT_BATTLES = [
  { id: 'b1', opponent: 'Archmage_Sol', class: 'Mage', format: 'Sprint Duel', result: 'WIN', scoreUser: 420, scoreOpp: 310, date: 'Yesterday' },
  { id: 'b2', opponent: 'Viper_Jin', class: 'Assassin', format: 'Streak Clash', result: 'WIN', scoreUser: 680, scoreOpp: 650, date: '2 days ago' },
  { id: 'b3', opponent: 'Ironclad_Vane', class: 'Knight', format: 'Sprint Duel', result: 'DRAW', scoreUser: 250, scoreOpp: 250, date: '3 days ago' },
  { id: 'b4', opponent: 'Chime_Rin', class: 'Alchemist', format: 'Category Clash', result: 'LOSS', scoreUser: 310, scoreOpp: 390, date: '5 days ago' }
];

