// Default Starting Datasets for Arise Life RPG

export const INITIAL_QUESTS = [
  {
    id: 'q-1',
    title: 'Master Binary Search Trees & Tree Traversal',
    category: 'INT',
    difficulty: 'hard', // 1.6x multiplier
    durationMinutes: 90, // Qualifies for Mage Overload (>90m)
    baseXp: 120,
    statGain: 18,
    streakBonus: 15,
    activePerkBonus: 'Overload (+25%)',
    completed: false,
    projectChain: 'Algorithms Mastery'
  },
  {
    id: 'q-2',
    title: '5km Interval Sprint & Pushup Pyramid',
    category: 'STR',
    difficulty: 'medium', // 1.3x multiplier
    durationMinutes: 35,
    baseXp: 65,
    statGain: 12,
    streakBonus: 10,
    activePerkBonus: 'Unbroken (+10%)',
    completed: false,
    projectChain: null
  },
  {
    id: 'q-3',
    title: 'Zero-Inbox Clearance & Sprint Review Notes',
    category: 'AGI',
    difficulty: 'easy', // 1.0x multiplier
    durationMinutes: 12,
    baseXp: 35,
    statGain: 8,
    streakBonus: 5,
    activePerkBonus: 'First Blood Lead',
    completed: false,
    projectChain: null
  },
  {
    id: 'q-4',
    title: 'Complete Distributed Systems Consensus Engine',
    category: 'INT',
    difficulty: 'hard',
    durationMinutes: 110,
    baseXp: 140,
    statGain: 22,
    streakBonus: 20,
    activePerkBonus: 'Brewmaster Charge +1',
    completed: false,
    projectChain: 'Compiler Project'
  },
  {
    id: 'q-5',
    title: 'Screen-Free Wind Down, Melatonin & 8h Sleep Cycle',
    category: 'VIT',
    difficulty: 'medium',
    durationMinutes: 45,
    baseXp: 60,
    statGain: 14,
    streakBonus: 10,
    activePerkBonus: 'Vitality Shield',
    completed: false,
    projectChain: null
  }
];

export const INITIAL_RAIDS = [
  {
    id: 'raid-1',
    name: 'The Seven Day Ascension',
    levelRequirement: 10,
    currentDays: 4,
    targetDays: 7,
    requirementDescription: 'Maintain a 7-day streak with at least one Hard quest every day',
    guaranteedDrop: {
      id: 'epic-raid-pauldrons',
      slot: 'Body',
      name: 'Void-Forged Pauldrons',
      rarity: 'Epic',
      icon: '🛡️',
      desc: 'Forged within the deep rifts of the seven-day trial.'
    }
  }
];

export const INITIAL_BOSSES = [
  {
    id: 'boss-1',
    name: 'The Gatekeeper (Blood-Igris)',
    title: 'The Gatekeeper Demands Proof of Your Resolve',
    levelRequirement: 18,
    targetScore: 500,
    currentScore: 360,
    timeWindowHours: 48,
    hoursRemaining: 22,
    description: 'A crimson phantom guarding the inner monarch throne. Score 500+ combining Study + Coding tasks within 48 hours.',
    guaranteedDrop: {
      id: 'leg-starveil',
      slot: 'Head',
      name: 'Starveil Circlet',
      rarity: 'Legendary',
      icon: '✨',
      desc: 'Legendary diadem pulsating with celestial intellect.'
    },
    status: 'active'
  }
];

export const INITIAL_BATTLES = [
  {
    id: 'b-1',
    opponentName: 'Hunter Baekho',
    opponentClass: 'Knight',
    opponentLevel: 17,
    format: 'Streak Clash',
    formatSubtitle: '24 HOURS · MOST PRODUCTIVITY WINS',
    myScore: 842,
    opponentScore: 721,
    timeRemaining: '18h 42m',
    status: 'in_progress',
    wagerGold: 150,
    wagerXp: 80
  },
  {
    id: 'b-2',
    opponentName: 'Cha Hae-In',
    opponentClass: 'Assassin',
    opponentLevel: 18,
    format: 'Sprint Duel',
    formatSubtitle: '1 TASK · FIRST TO COMPLETE',
    myScore: 120,
    opponentScore: 90,
    timeRemaining: '01h 15m',
    status: 'in_progress',
    wagerGold: 100,
    wagerXp: 60
  }
];

export const INITIAL_BATTLE_RESULTS = [
  {
    id: 'br-1',
    opponentName: 'Hunter Min Byung-Gu',
    opponentClass: 'Knight',
    format: 'Category Clash (INT)',
    result: 'WIN',
    myScore: 842,
    opponentScore: 721,
    goldGained: 150,
    battleXpGained: 80,
    titleProgress: 'Mage Slayer 3/5',
    date: 'Yesterday'
  },
  {
    id: 'br-2',
    opponentName: 'Shadow Duplicate',
    opponentClass: 'Mage',
    format: 'Sprint Duel',
    result: 'LOSS',
    myScore: 65,
    opponentScore: 80,
    goldGained: 25, // Consolation gold, zero XP deducted
    battleXpGained: 0,
    titleProgress: null,
    date: '2 days ago'
  }
];

export const DEFAULT_STARTING_EQUIPPED = {
  Knight: {
    Head: { id: 'init-k-h', name: 'Recruit Visor', rarity: 'Common', slot: 'Head', icon: '🪖' },
    Body: { id: 'init-k-b', name: 'Standard Cuirass', rarity: 'Common', slot: 'Body', icon: '🥋' },
    Legs: { id: 'init-k-l', name: 'Iron Greaves', rarity: 'Common', slot: 'Legs', icon: '👖' },
    Feet: { id: 'init-k-f', name: 'Marching Sabatons', rarity: 'Common', slot: 'Feet', icon: '👢' }
  },
  Mage: {
    Head: { id: 'init-m-h', name: "Scholar's Band", rarity: 'Common', slot: 'Head', icon: '🔮' },
    Body: { id: 'init-m-b', name: 'Apprentice Robes', rarity: 'Common', slot: 'Body', icon: '🥋' },
    Legs: { id: 'init-m-l', name: 'Linen Trousers', rarity: 'Common', slot: 'Legs', icon: '👖' },
    Feet: { id: 'init-m-f', name: 'Spell Slippers', rarity: 'Common', slot: 'Feet', icon: '🥿' }
  },
  Assassin: {
    Head: { id: 'init-a-h', name: 'Midnight Cowl', rarity: 'Common', slot: 'Head', icon: '🎭' },
    Body: { id: 'init-a-b', name: 'Leather Jerkin', rarity: 'Common', slot: 'Body', icon: '🥋' },
    Legs: { id: 'init-a-l', name: 'Agile Breeches', rarity: 'Common', slot: 'Legs', icon: '👖' },
    Feet: { id: 'init-a-f', name: 'Shadow Runners', rarity: 'Common', slot: 'Feet', icon: '👢' }
  },
  Alchemist: {
    Head: { id: 'init-al-h', name: 'Safety Monocle', rarity: 'Common', slot: 'Head', icon: '🧐' },
    Body: { id: 'init-al-b', name: "Apothecary's Smock", rarity: 'Common', slot: 'Body', icon: '🥋' },
    Legs: { id: 'init-al-l', name: 'Reinforced Pants', rarity: 'Common', slot: 'Legs', icon: '👖' },
    Feet: { id: 'init-al-f', name: 'Acid-Resistant Boots', rarity: 'Common', slot: 'Feet', icon: '👢' }
  },
  Summoner: {
    Head: { id: 'init-s-h', name: 'Occult Hood', rarity: 'Common', slot: 'Head', icon: '🧙' },
    Body: { id: 'init-s-b', name: 'Robe of Spirits', rarity: 'Common', slot: 'Body', icon: '🥋' },
    Legs: { id: 'init-s-l', name: 'Wraith Wraps', rarity: 'Common', slot: 'Legs', icon: '👖' },
    Feet: { id: 'init-s-f', name: 'Spirit Walkers', rarity: 'Common', slot: 'Feet', icon: '👢' }
  }
};

export const SHOP_ITEMS = [
  // Uncommon (Green Accent)
  {
    id: 'armory-1',
    name: 'Iron Mercenary Visor',
    rarity: 'Uncommon',
    slot: 'Head',
    price: 320,
    class: 'All',
    icon: '🪖',
    description: 'Forged plate offering clear line of sight.'
  },
  {
    id: 'armory-2',
    name: 'Shadow Weave Tunic',
    rarity: 'Uncommon',
    slot: 'Body',
    price: 480,
    class: 'All',
    icon: '🥋',
    description: 'Supple fabric woven with dark thread for rapid movement.'
  },
  {
    id: 'armory-3',
    name: 'Silent Strider Boots',
    rarity: 'Uncommon',
    slot: 'Feet',
    price: 280,
    class: 'All',
    icon: '👢',
    description: 'Padded leather soles that muffle step noise completely.'
  },
  // Rare (Blue Accent)
  {
    id: 'armory-4',
    name: 'Crown of Concentrated Will',
    rarity: 'Rare',
    slot: 'Head',
    price: 850,
    class: 'Mage',
    icon: '👑',
    description: 'Sharpened diadem focusing deep mathematical cognition.'
  },
  {
    id: 'armory-5',
    name: 'Aegis Plate of Fortitude',
    rarity: 'Rare',
    slot: 'Body',
    price: 950,
    class: 'Knight',
    icon: '🛡️',
    description: 'Inscribed with unbroken runes of physical stamina.'
  },
  // Epic (Purple Glow)
  {
    id: 'armory-6',
    name: 'Spectral Overcoat',
    rarity: 'Epic',
    slot: 'Body',
    price: 1600,
    class: 'Summoner',
    icon: '🧥',
    description: 'Woven from ectoplasmic filaments of fallen shadows.'
  },
  // Mythic (Prismatic / Red - The Flex of Flexes)
  {
    id: 'armory-7',
    name: 'Crown of the Shadow Sovereign',
    rarity: 'Mythic',
    slot: 'Head',
    price: 4500,
    class: 'All',
    icon: '✨',
    description: 'The definitive flex of flexes. Radiates prismatic monarch aura.'
  }
];

