// Game Classes, Subclasses, Perks, Powers and Legendary Outfits
// Extracted strictly from Master Design Specification

export const CLASSES = {
  Knight: {
    id: 'Knight',
    name: 'Knight',
    primaryStats: ['STR', 'VIT'],
    badge: '⚔️',
    color: 'var(--attr-str)',
    tagline: 'Vanguard of Iron Fortitude & Discipline',
    visualIdentity: 'Heavy armor, steel, crimson accents, large silhouette',
    realTaskExamples: 'Gym, sports, chores, cooking, sleep schedule',
    passivePerk: {
      name: 'Unbroken',
      description: '+10% score in Streak Clash for every consecutive day active (caps at +50%)',
      bonusCalc: (streak) => Math.min(50, streak * 10)
    },
    subclasses: {
      Paladin: {
        id: 'Paladin',
        name: 'Paladin',
        description: 'Reliability — perk bonus applies even after 1 missed day (grace day shield).',
        signaturePower: 'Aegis of the Sun'
      },
      Berserker: {
        id: 'Berserker',
        name: 'Berserker',
        description: 'Volatility — perk bonus doubles in strength (+20% per day) but resets fully on any missed day.',
        signaturePower: 'Bloodfury Surge'
      }
    },
    skills: [
      { id: 'k1', name: 'Shield Bash', unlockLevel: 1, cooldown: 2, effect: { type: 'damage', value: 15, target: 'enemy' }, desc: 'Damage + reduce enemy score lead by 15%' },
      { id: 'k2', name: 'Fortify', unlockLevel: 5, cooldown: 3, effect: { type: 'buff', value: 25, target: 'self' }, desc: '+25% defense against opponent sabotage powers' },
      { id: 'k3', name: 'Radiant Smite', unlockLevel: 10, cooldown: 5, effect: { type: 'buff', value: 50, target: 'self' }, desc: 'Converts completed hard tasks into a 50% score surge' }
    ],
    specialPower: {
      id: 'Second Wind',
      name: 'Second Wind',
      effect: 'If you miss your streak today, this Power auto-fires to preserve it once.',
      trigger: 'Passive-armed after holding a 3-day streak.'
    },
    legendaryOutfit: {
      Head: { id: 'leg-k-head', name: "Sovereign's Horned Helm", rarity: 'Legendary', slot: 'Head', icon: '👑', desc: "Ancient horned crown of the Unbroken Vanguard." },
      Body: { id: 'leg-k-body', name: "Aegis Plate of the Unbroken", rarity: 'Legendary', slot: 'Body', icon: '🛡️', desc: "Impenetrable breastplate forged from fallen monarchs." },
      Legs: { id: 'leg-k-legs', name: "Bastion Greaves", rarity: 'Legendary', slot: 'Legs', icon: '👖', desc: "Heavy plate greaves engraved with runes of endurance." },
      Feet: { id: 'leg-k-feet', name: "Warden's Ironstep Boots", rarity: 'Legendary', slot: 'Feet', icon: '👢', desc: "Treads that anchor the user through any trial." }
    }
  },

  Mage: {
    id: 'Mage',
    name: 'Mage',
    primaryStats: ['INT'],
    badge: '🔮',
    color: 'var(--attr-int)',
    tagline: 'Master of Deep Focus & Arcane Calculation',
    visualIdentity: 'Elegant robe, arcane symbols, floating magical particles, violet/cyan energy',
    realTaskExamples: 'Studying, research, exams, deep reading, coding',
    passivePerk: {
      name: 'Overload',
      description: 'Tasks logged in a single unbroken 90+ min session score +25%',
      bonusCalc: (sessionMinutes) => (sessionMinutes >= 90 ? 25 : 0)
    },
    subclasses: {
      Elementalist: {
        id: 'Elementalist',
        name: 'Elementalist',
        description: 'Burst — huge score spike (+40%) on single long uninterrupted focus sessions.',
        signaturePower: 'Arcane Inferno'
      },
      Chronomancer: {
        id: 'Chronomancer',
        name: 'Chronomancer',
        description: 'Consistency — smaller bonus (+15%), but stacks across multiple focus sessions in one day.',
        signaturePower: 'Time Dilation'
      }
    },
    skills: [
      { id: 'm1', name: 'Mana Flow', unlockLevel: 1, cooldown: 2, effect: { type: 'buff', value: 20, target: 'self' }, desc: 'Boosts INT task XP by 20%' },
      { id: 'm2', name: 'Arcane Rift', unlockLevel: 5, cooldown: 4, effect: { type: 'dot', value: 15, target: 'enemy' }, desc: 'Creates continuous scoring pressure in duel' },
      { id: 'm3', name: 'Supernova', unlockLevel: 10, cooldown: 5, effect: { type: 'buff', value: 60, target: 'self' }, desc: 'Next completed study task awards double XP' }
    ],
    specialPower: {
      id: 'Focus Surge',
      name: 'Focus Surge',
      effect: 'Your next completed task scores +50% for this battle.',
      trigger: 'Must have studied 20+ min today to arm it.'
    },
    legendaryOutfit: {
      Head: { id: 'leg-m-head', name: 'Starveil Circlet', rarity: 'Legendary', slot: 'Head', icon: '✨', desc: 'Diadem pulsating with concentrated stellar intellect.' },
      Body: { id: 'leg-m-body', name: "Astral Warden's Robe", rarity: 'Legendary', slot: 'Body', icon: '🥋', desc: 'Flowing midnight robe lined with celestial constellations.' },
      Legs: { id: 'leg-m-legs', name: 'Runeforged Leggings', rarity: 'Legendary', slot: 'Legs', icon: '👖', desc: 'Woven with ancient arithmetic equations of power.' },
      Feet: { id: 'leg-m-feet', name: 'Levitation Slippers', rarity: 'Legendary', slot: 'Feet', icon: '🥿', desc: 'Footwear that hovers softly above ground plane.' }
    }
  },

  Assassin: {
    id: 'Assassin',
    name: 'Assassin',
    primaryStats: ['AGI'],
    badge: '🗡️',
    color: 'var(--attr-agi)',
    tagline: 'Operative of Precision, Speed & Sharp Habits',
    visualIdentity: 'Dark cloak, lightweight armor, hood, sharp silhouette, shadow particles',
    realTaskExamples: 'Quick chores, daily habits, admin/inbox-zero, short workouts',
    passivePerk: {
      name: 'First Blood',
      description: 'First task completed in any duel grants a small permanent score lead for that duel',
      bonusCalc: (isFirst) => (isFirst ? 30 : 0)
    },
    subclasses: {
      'Shadow Blade': {
        id: 'Shadow Blade',
        name: 'Shadow Blade',
        description: 'Duel specialist — First Blood bonus doubles (+60), only active in Sprint Duel format.',
        signaturePower: 'Phantom Strike'
      },
      Duelist: {
        id: 'Duelist',
        name: 'Duelist',
        description: 'Consistent threat — bonus active across all battle formats with reliable execution.',
        signaturePower: 'Blade Flurry'
      }
    },
    skills: [
      { id: 'a1', name: 'Quick Reflex', unlockLevel: 1, cooldown: 2, effect: { type: 'buff', value: 15, target: 'self' }, desc: 'Increases sprint speed score by 15%' },
      { id: 'a2', name: 'Shadow Cloak', unlockLevel: 5, cooldown: 3, effect: { type: 'buff', value: 30, target: 'self' }, desc: 'Blocks the next opponent sabotage attempt' },
      { id: 'a3', name: 'Assassinate', unlockLevel: 10, cooldown: 5, effect: { type: 'damage', value: 45, target: 'enemy' }, desc: 'Steals lead upon completing a task in under 15 minutes' }
    ],
    specialPower: {
      id: 'Shadow Step',
      name: 'Shadow Step',
      effect: 'Your next 2 tasks count double toward Sprint Duel speed-score.',
      trigger: 'Must complete a task in under 10 min to arm.'
    },
    legendaryOutfit: {
      Head: { id: 'leg-a-head', name: 'Nightshroud Hood', rarity: 'Legendary', slot: 'Head', icon: '🎭', desc: 'Veil that absorbs shadow light and conceals identity.' },
      Body: { id: 'leg-a-body', name: 'Shadow-Weave Cloak', rarity: 'Legendary', slot: 'Body', icon: '🥋', desc: 'Silken cloak with flowing shadow tendrils.' },
      Legs: { id: 'leg-a-legs', name: 'Silent Wraps', rarity: 'Legendary', slot: 'Legs', icon: '👖', desc: 'Fitted bindings that eliminate all sound of footsteps.' },
      Feet: { id: 'leg-a-feet', name: 'Whisperstep Boots', rarity: 'Legendary', slot: 'Feet', icon: '👢', desc: 'Soles made of phantom beast leather.' }
    }
  },

  Alchemist: {
    id: 'Alchemist',
    name: 'Alchemist',
    primaryStats: ['INT', 'AGI'],
    badge: '🧪',
    color: 'var(--accent-color)',
    tagline: 'Synthesizer of Logic, Prep & Chemical Systems',
    visualIdentity: 'Refined fantasy coat, belts, potion containers, glowing vials, magical chemistry',
    realTaskExamples: 'Coding challenges, projects, meal-prep, budgeting',
    passivePerk: {
      name: 'Brewmaster',
      description: 'Every 3rd task completed generates a bonus consumable Power charge',
      bonusCalc: (count) => (count % 3 === 0 ? 1 : 0)
    },
    subclasses: {
      'Poison Master': {
        id: 'Poison Master',
        name: 'Poison Master',
        description: 'Power charges generate faster (every 2nd task), each slightly weaker.',
        signaturePower: 'Noxious Cloud'
      },
      Enchanter: {
        id: 'Enchanter',
        name: 'Enchanter',
        description: 'Power charges generate slower, each stronger, and giftable to a teammate.',
        signaturePower: 'Transmutation Catalyst'
      }
    },
    skills: [
      { id: 'al1', name: 'Catalyst Shot', unlockLevel: 1, cooldown: 2, effect: { type: 'buff', value: 20, target: 'self' }, desc: '+20% Gold earned on the current task' },
      { id: 'al2', name: 'Acid Flask', unlockLevel: 5, cooldown: 4, effect: { type: 'debuff', value: 20, target: 'enemy' }, desc: 'Reduces opponent task multiplier by 20%' },
      { id: 'al3', name: "Philosopher's Touch", unlockLevel: 10, cooldown: 6, effect: { type: 'buff', value: 100, target: 'self' }, desc: 'Triples Gold gained and grants +50 XP' }
    ],
    specialPower: {
      id: 'Volatile Mixture',
      name: 'Volatile Mixture',
      effect: "Opponent's next task scores -20% (represents distraction).",
      trigger: 'Complete a task flagged "hard difficulty" to arm.'
    },
    legendaryOutfit: {
      Head: { id: 'leg-al-head', name: 'Alembic Goggles', rarity: 'Legendary', slot: 'Head', icon: '🧐', desc: 'Precision brass lenses that analyze mana densities.' },
      Body: { id: 'leg-al-body', name: 'Reagent-Strapped Coat', rarity: 'Legendary', slot: 'Body', icon: '🥋', desc: 'Leather trench coat rigged with shimmering elixir phials.' },
      Legs: { id: 'leg-al-legs', name: 'Flaskbelt Trousers', rarity: 'Legendary', slot: 'Legs', icon: '👖', desc: 'Reinforced pants lined with catalyst pouches.' },
      Feet: { id: 'leg-al-feet', name: 'Cinderwalk Boots', rarity: 'Legendary', slot: 'Feet', icon: '👢', desc: 'Treated with salamander skin immune to corrosive burns.' }
    }
  },

  Summoner: {
    id: 'Summoner',
    name: 'Summoner',
    primaryStats: ['INT', 'VIT'],
    badge: '👁️',
    color: 'var(--attr-vit)',
    tagline: 'Commander of Project Chains & Long-Horizon Systems',
    visualIdentity: 'Rune mantle, mystical ornaments, spirit particles, spectral energy',
    realTaskExamples: 'Long projects, essays, side-projects, courses',
    passivePerk: {
      name: 'Delegate',
      description: 'Tasks logged as part of a multi-day project chain score cumulative streak bonuses',
      bonusCalc: (chain) => Math.min(45, chain * 15)
    },
    subclasses: {
      Beastmaster: {
        id: 'Beastmaster',
        name: 'Beastmaster',
        description: 'One large project chain gives one big compounding bonus.',
        signaturePower: 'Titan Summon'
      },
      Necromancer: {
        id: 'Necromancer',
        name: 'Necromancer',
        description: 'Many small parallel task-chains each give small bonuses that add up.',
        signaturePower: 'Shadow Army Arise'
      }
    },
    skills: [
      { id: 's1', name: 'Shadow Minion', unlockLevel: 1, cooldown: 3, effect: { type: 'buff', value: 15, target: 'self' }, desc: 'Adds +15 auxiliary score each hour of active duel' },
      { id: 's2', name: 'Spectral Chain', unlockLevel: 5, cooldown: 4, effect: { type: 'debuff', value: 25, target: 'enemy' }, desc: 'Locks opponent bonus powers for 2 hours' },
      { id: 's3', name: 'Monarch Domain', unlockLevel: 10, cooldown: 5, effect: { type: 'buff', value: 50, target: 'self' }, desc: 'Absorbs 50% of completed task XP as bonus battle score' }
    ],
    specialPower: {
      id: 'Soul Link',
      name: 'Soul Link',
      effect: 'Split your XP gain 50/50 with a teammate or project chain for bonus yield.',
      trigger: 'Requires an active multi-day project chain.'
    },
    legendaryOutfit: {
      Head: { id: 'leg-s-head', name: 'Bound-Spirit Crown', rarity: 'Legendary', slot: 'Head', icon: '👑', desc: 'Circlet forged from trapped spectral shadows.' },
      Body: { id: 'leg-s-body', name: 'Rune-Stitched Mantle', rarity: 'Legendary', slot: 'Body', icon: '🥋', desc: 'Mantle woven with necromantic glyphs of dominion.' },
      Legs: { id: 'leg-s-legs', name: "Conjurer's Leg Wraps", rarity: 'Legendary', slot: 'Legs', icon: '👖', desc: 'Bindings that channel energy directly from the earth plane.' },
      Feet: { id: 'leg-s-feet', name: 'Spirit-Tether Sandals', rarity: 'Legendary', slot: 'Feet', icon: '👢', desc: 'Sandals leaving glowing spectral footprints.' }
    }
  }
};

export const NEUTRAL_POWERS = [
  {
    id: 'Adrenaline',
    name: 'Adrenaline',
    class: 'Neutral',
    effect: 'Instantly counts your current in-progress task toward the battle if completed within 15 min.',
    trigger: 'Available to everyone, 1 use/day.'
  },
  {
    id: "Guardian's Ward",
    name: "Guardian's Ward",
    class: 'Neutral',
    effect: 'Blocks one incoming debuff power from an opponent.',
    trigger: 'Earned after your first duel loss (comeback mechanic).'
  }
];

export const ATTRIBUTES = {
  STR: { name: 'Strength', color: 'var(--attr-str)', bg: 'var(--attr-str-bg)', icon: '⚔️', desc: 'Physical combat power, gym, sports, chores' },
  INT: { name: 'Intellect', color: 'var(--attr-int)', bg: 'var(--attr-int-bg)', icon: '🔮', desc: 'Magic/skill power, study, coding, reading' },
  AGI: { name: 'Agility', color: 'var(--attr-agi)', bg: 'var(--attr-agi-bg)', icon: '⚡', desc: 'Turn order, crit, speed, quick daily habits' },
  VIT: { name: 'Vitality', color: 'var(--attr-vit)', bg: 'var(--attr-vit-bg)', icon: '🛡️', desc: 'HP pool, stamina, sleep discipline, consistency' }
};

export const TITLES = [
  { id: 't1', name: 'Shadow Monarch', req: 'Level 18 + Defeat Blood-Igris', unlocked: true },
  { id: 't2', name: 'Mage Slayer', req: 'Win 3 duels against Mage class', unlocked: true },
  { id: 't3', name: 'Unbroken', req: 'Maintain a 14-day streak', unlocked: true },
  { id: 't4', name: 'Gate Breaker', req: 'Conquer any Boss Gate solo', unlocked: false },
  { id: 't5', name: 'Ascended Sovereign', req: 'Equip a full 4-piece Legendary set', unlocked: false }
];

