import React, { useState } from 'react';
import { useGame } from '../../state/GameContext.jsx';

export const QuestsTab = () => {
  const { player, completeQuest, addQuest } = useGame();
  const [filter, setFilter] = useState('ALL');
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('STR');
  const [difficulty, setDifficulty] = useState('medium');

  const getAttrColor = (cat) => {
    switch (cat) {
      case 'STR': return 'var(--attr-str)';
      case 'INT': return 'var(--attr-int)';
      case 'AGI': return 'var(--attr-agi)';
      case 'VIT': return 'var(--attr-vit)';
      default: return 'var(--accent)';
    }
  };

  const filteredQuests = player.quests.filter(q => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return !q.completed;
    if (filter === 'COMPLETED') return q.completed;
    return q.category === filter;
  });

  const handleCreateQuest = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const baseXpMap = { easy: 75, medium: 120, hard: 180 };
    const goldMap = { easy: 40, medium: 65, hard: 100 };
    addQuest({
      title: title.trim(),
      category,
      difficulty,
      baseXp: baseXpMap[difficulty],
      gold: goldMap[difficulty]
    });
    setTitle('');
    setIsAdding(false);
  };

  return (
    <div
      style={{
        padding: '24px 20px 96px',
        maxWidth: '900px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* Header & Add Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.65rem',
              color: 'var(--text)',
              letterSpacing: '0.06em'
            }}
          >
            Daily Quest Directives
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--dim-text)', marginTop: '2px' }}>
            Complete real-world tasks to amplify stats, bank Power charges, and level up.
          </p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="btn-gold"
          style={{ padding: '8px 16px', fontSize: '0.82rem' }}
        >
          + Add Objective
        </button>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['ALL', 'ACTIVE', 'COMPLETED', 'STR', 'INT', 'AGI', 'VIT'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="btn-pill"
            style={{
              borderColor: filter === cat ? 'var(--accent)' : 'var(--border)',
              backgroundColor: filter === cat ? 'var(--accent-glow)' : 'var(--surface)',
              color: filter === cat ? 'var(--text)' : 'var(--dim-text)',
              fontSize: '0.74rem',
              padding: '6px 12px'
            }}
          >
            {cat === 'STR' && <span style={{ color: 'var(--attr-str)' }}>● </span>}
            {cat === 'INT' && <span style={{ color: 'var(--attr-int)' }}>● </span>}
            {cat === 'AGI' && <span style={{ color: 'var(--attr-agi)' }}>● </span>}
            {cat === 'VIT' && <span style={{ color: 'var(--attr-vit)' }}>● </span>}
            {cat}
          </button>
        ))}
      </div>

      {/* Add Quest Modal/Drawer */}
      {isAdding && (
        <form
          onSubmit={handleCreateQuest}
          className="arise-card"
          style={{
            padding: '20px',
            border: '1.5px solid var(--accent)',
            animation: 'overshootSettle 0.3s ease'
          }}
        >
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text)', marginBottom: '14px' }}>
            Commission New Objective
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input
              type="text"
              placeholder="e.g. Read research paper for 45 minutes"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-wash)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
                fontSize: '0.88rem',
                outline: 'none'
              }}
              autoFocus
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--dim-text)', display: 'block', marginBottom: '6px' }}>
                  ATTRIBUTE TARGET
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-wash)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="STR">STR (Strength / Fitness / Routine)</option>
                  <option value="INT">INT (Intellect / Focus / Study)</option>
                  <option value="AGI">AGI (Agility / Speed / Action)</option>
                  <option value="VIT">VIT (Vitality / Health / Recovery)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', color: 'var(--dim-text)', display: 'block', marginBottom: '6px' }}>
                  DIFFICULTY SCALE
                </label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-wash)',
                    border: '1px solid var(--border)',
                    color: 'var(--text)',
                    fontSize: '0.82rem'
                  }}
                >
                  <option value="easy">Easy (1.0x XP)</option>
                  <option value="medium">Medium (1.3x XP)</option>
                  <option value="hard">Hard (1.6x XP)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="btn-pill"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-gold"
              >
                Engrave Quest
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task Cards List (Vertical cards with metadata & color-coded attribute tags) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredQuests.map(quest => {
          const attrColor = getAttrColor(quest.category);
          return (
            <div
              key={quest.id}
              className="arise-card"
              style={{
                padding: '16px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: quest.completed ? 0.65 : 1,
                borderLeft: `4px solid ${attrColor}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    backgroundColor: `${attrColor}22`,
                    color: attrColor,
                    border: `1px solid ${attrColor}`,
                    minWidth: '42px',
                    textAlign: 'center'
                  }}
                >
                  {quest.category}
                </span>

                <div>
                  <div
                    style={{
                      fontSize: '0.94rem',
                      fontWeight: '600',
                      color: quest.completed ? 'var(--dim-text)' : 'var(--text)',
                      textDecoration: quest.completed ? 'line-through' : 'none'
                    }}
                  >
                    {quest.title}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.74rem', color: 'var(--dim-text)', marginTop: '4px' }}>
                    <span>+{quest.baseXp} XP</span>
                    <span>+{quest.gold} Gold</span>
                    <span style={{ textTransform: 'capitalize' }}>Tier: {quest.difficulty}</span>
                    <span>{quest.dueText}</span>
                  </div>
                </div>
              </div>

              <div>
                {quest.completed ? (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--creature-glow)',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(var(--creature-glow-rgb), 0.12)'
                    }}
                  >
                    ✓ Slain
                  </span>
                ) : (
                  <button
                    onClick={() => completeQuest(quest.id)}
                    style={{
                      backgroundColor: 'var(--surface)',
                      border: '1px solid var(--accent)',
                      color: 'var(--accent)',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = 'var(--accent)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'var(--surface)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                  >
                    Complete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Raids Section (Part 5 requirement: Active Raids shown below with a visible day-count) */}
      <div style={{ marginTop: '12px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.25rem',
            color: 'var(--text)',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>🔥</span> Active Dungeon Raids
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {player.raids.map(raid => {
            const progressPct = Math.round((raid.currentDays / raid.totalDays) * 100);
            return (
              <div
                key={raid.id}
                className="arise-card"
                style={{
                  padding: '18px',
                  border: '1.5px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.4rem' }}>{raid.icon}</span>
                    <h3 style={{ fontSize: '0.94rem', color: 'var(--text)' }}>{raid.title}</h3>
                  </div>
                  {/* Visible day count */}
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: '800',
                      color: 'var(--gold)',
                      padding: '3px 8px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-wash)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    Day {raid.currentDays} / {raid.totalDays}
                  </span>
                </div>

                <p style={{ fontSize: '0.78rem', color: 'var(--dim-text)', marginBottom: '14px', lineHeight: 1.4 }}>
                  {raid.description}
                </p>

                {/* Progress bar */}
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-wash)',
                    overflow: 'hidden',
                    marginBottom: '12px'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${progressPct}%`,
                      backgroundColor: raid.dropRarity === 'Legendary' ? 'var(--gold)' : 'var(--accent)',
                      boxShadow: raid.dropRarity === 'Legendary' ? '0 0 8px var(--gold-glow)' : '0 0 8px var(--accent-glow)'
                    }}
                  />
                </div>

                <div style={{ fontSize: '0.74rem', color: 'var(--dim-text)' }}>
                  Guaranteed Reward:{' '}
                  <strong style={{ color: raid.dropRarity === 'Legendary' ? 'var(--gold)' : 'var(--accent)' }}>
                    {raid.guaranteedDrop}
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

