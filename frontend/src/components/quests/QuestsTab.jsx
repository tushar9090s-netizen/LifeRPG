import React, { useState, useEffect } from 'react';
import { useGame } from '../../state/GameContext';
import { ATTRIBUTES } from '../../data/classes';
import { IconFlame } from '../common/Icons';

export const QuestsTab = () => {
  const { quests, completeQuest, addQuest, deleteQuest, raids, character } = useGame();

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('INT');
  const [newDifficulty, setNewDifficulty] = useState('hard');
  const [newMinutes, setNewMinutes] = useState(90);
  const [newBaseXp, setNewBaseXp] = useState(120);
  const [newChain, setNewChain] = useState('');

  // Built-in Focus Timer (for Mage Overload >90m / Assassin speed <10m)
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [focusTargetQuestId, setFocusTargetQuestId] = useState(null);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => setTimerSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const handleStartTimer = (id) => {
    setFocusTargetQuestId(id);
    setTimerSeconds(0);
    setTimerRunning(true);
  };

  const handleStopTimer = () => setTimerRunning(false);

  const handleCompleteWithTimer = (id) => {
    handleStopTimer();
    completeQuest(id);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addQuest({
      title: newTitle,
      category: newCategory,
      difficulty: newDifficulty,
      durationMinutes: newMinutes,
      baseXp: newBaseXp,
      projectChain: newChain.trim() || null
    });
    setNewTitle('');
    setNewChain('');
    setShowAddModal(false);
  };

  const filteredQuests = quests.filter((q) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'ACTIVE') return !q.completed;
    if (activeFilter === 'COMPLETED') return q.completed;
    return q.category === activeFilter;
  });

  const formatTimer = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="quests-tab-view tab-content-enter">
      {/* Header (§14) */}
      <div className="quests-header-row">
        <div>
          <div className="section-super-tag font-mono">SYSTEM DIRECTIVES</div>
          <h2 className="quests-screen-title font-display">QUESTS</h2>
          <p className="quests-subtitle font-mono">THE SYSTEM AWAITS YOUR ACTION.</p>
        </div>
        <button
          className="btn-primary font-display"
          onClick={() => setShowAddModal(true)}
        >
          + NEW QUEST
        </button>
      </div>

      {/* Focus Session Timer HUD */}
      {timerRunning && (
        <div className="focus-timer-hud card-base">
          <div className="timer-left">
            <span className="pulse-recording-dot" />
            <span className="timer-session-label font-mono">FOCUS SESSION RUNNING:</span>
            <span className="timer-time-val font-mono">{formatTimer(timerSeconds)}</span>
          </div>
          <div className="timer-actions">
            {focusTargetQuestId && (
              <button
                className="btn-primary font-display"
                style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
                onClick={() => handleCompleteWithTimer(focusTargetQuestId)}
              >
                COMPLETE & LOG
              </button>
            )}
            <button
              className="btn-secondary font-sans"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
              onClick={handleStopTimer}
            >
              Pause
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs (§14) */}
      <div className="quests-filters-strip">
        {['ALL', 'ACTIVE', 'COMPLETED', 'STR', 'INT', 'AGI', 'VIT'].map((key) => {
          const attr = ATTRIBUTES[key];
          const isSelected = activeFilter === key;
          return (
            <button
              key={key}
              className={`filter-pill font-mono ${isSelected ? 'active' : ''}`}
              style={{
                borderColor: attr ? attr.color : undefined,
                color: isSelected && attr ? '#ffffff' : undefined,
                backgroundColor: isSelected && attr ? attr.color : undefined
              }}
              onClick={() => setActiveFilter(key)}
            >
              {attr ? `${attr.icon} ${key}` : key}
            </button>
          );
        })}
      </div>

      {/* Quest Cards Grid (§14) */}
      <div className="quests-cards-list">
        {filteredQuests.map((quest) => {
          const attr = ATTRIBUTES[quest.category] || ATTRIBUTES.INT;
          const isTarget = focusTargetQuestId === quest.id && timerRunning;

          return (
            <div
              key={quest.id}
              className={`rpg-quest-card card-base ${quest.completed ? 'completed' : ''}`}
              style={{ borderLeft: `3.5px solid ${attr.color}` }}
            >
              <div className="quest-card-top">
                <span className="quest-type-tag font-mono">QUEST</span>
                <div className="quest-top-actions">
                  {!quest.completed && !isTarget && (
                    <button
                      className="btn-timer-trigger font-mono"
                      onClick={() => handleStartTimer(quest.id)}
                      title="Start Session Timer"
                    >
                      ⏱️ Focus Timer
                    </button>
                  )}
                  <button
                    className="btn-remove-directive"
                    onClick={() => deleteQuest(quest.id)}
                    title="Remove Quest"
                  >
                    ×
                  </button>
                </div>
              </div>

              {/* Title & Metadata (§14) */}
              <h3 className="quest-card-title">{quest.title}</h3>
              <div className="quest-card-meta font-sans">
                <span>{attr.name} · {quest.durationMinutes} MIN</span>
                {quest.projectChain && (
                  <span className="chain-link-tag font-mono">🔗 {quest.projectChain}</span>
                )}
              </div>

              {/* Reward & Difficulty Metrics (§14) */}
              <div className="quest-metrics-row font-mono">
                <span className="stat-impact" style={{ color: attr.color }}>
                  {quest.category} +{quest.statGain || Math.round(quest.baseXp * 0.15)}
                </span>
                <span className="xp-gain">XP +{quest.baseXp}</span>
                <span className="diff-tag">
                  ● {quest.difficulty.toUpperCase()} ({quest.difficulty === 'hard' ? '1.6x' : quest.difficulty === 'medium' ? '1.3x' : '1.0x'})
                </span>
                <span className="perk-tag font-sans">{quest.activePerkBonus}</span>
              </div>

              {/* Completion Action (§15) */}
              <div className="quest-card-footer">
                {quest.completed ? (
                  <div className="quest-harvested-badge font-mono">
                    ✓ COMPLETED & LOGGED TO SYSTEM
                  </div>
                ) : (
                  <button
                    className="btn-primary quest-complete-btn font-display"
                    onClick={() => completeQuest(quest.id)}
                  >
                    [ COMPLETE ]
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filteredQuests.length === 0 && (
          <div className="empty-state-box card-base">
            <div className="empty-title font-display">NO ACTIVE QUESTS</div>
            <div className="empty-msg font-mono">THE SYSTEM IS QUIET.</div>
            <p className="empty-sub font-sans">Create your next challenge to awaken more power.</p>
          </div>
        )}
      </div>

      {/* Active Raid Screen (§26) */}
      <div className="raid-section-container">
        <div className="raid-header-row">
          <div>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--rarity-epic)' }}>
              LONG-TERM COMMITMENT
            </span>
            <h3 className="raid-screen-title font-display">ACTIVE RAID</h3>
          </div>
          <span className="raid-epic-badge font-mono">GUARANTEED EPIC COSMETIC</span>
        </div>

        {raids.map((raid) => (
          <div key={raid.id} className="raid-display-card card-base halo-epic">
            <div className="raid-card-top">
              <div>
                <h4 className="raid-title font-display">{raid.name}</h4>
                <div className="raid-day-counter font-mono">
                  DAY {raid.currentDays} / {raid.targetDays}
                </div>
              </div>
              <div className="raid-reward-box">
                <span className="raid-reward-icon">{raid.guaranteedDrop.icon}</span>
                <div>
                  <span className="raid-reward-label font-mono">REWARD</span>
                  <div className="raid-reward-name font-display">{raid.guaranteedDrop.name}</div>
                </div>
              </div>
            </div>

            <div className="raid-requirement-text font-sans">
              <strong>REQUIRED:</strong> {raid.requirementDescription}
            </div>

            <div className="raid-meter-box">
              <div className="raid-meter-labels font-mono">
                <span>CURRENT STREAK: {character.streak} DAYS</span>
                <span>{Math.round((raid.currentDays / raid.targetDays) * 100)}%</span>
              </div>
              <div className="raid-meter-track">
                <div
                  className="raid-meter-fill"
                  style={{ width: `${Math.round((raid.currentDays / raid.targetDays) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Quest Modal */}
      {showAddModal && (
        <div className="scrim-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-enter card-base add-quest-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-display">AUTHORIZE NEW QUEST</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="quest-form">
              <div className="form-group">
                <label className="form-label font-mono">QUEST DIRECTIVE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Complete 90m Deep Learning Module"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label font-mono">ATTRIBUTE</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="form-input"
                  >
                    <option value="STR">STR (Strength / Gym / Chores)</option>
                    <option value="INT">INT (Intellect / Study / Code)</option>
                    <option value="AGI">AGI (Agility / Speed / Habits)</option>
                    <option value="VIT">VIT (Vitality / Health / Sleep)</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label font-mono">DIFFICULTY</label>
                  <select
                    value={newDifficulty}
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="form-input"
                  >
                    <option value="easy">Easy (1.0x)</option>
                    <option value="medium">Medium (1.3x)</option>
                    <option value="hard">Hard (1.6x)</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label font-mono">DURATION (MINUTES)</label>
                  <input
                    type="number"
                    min="5"
                    max="300"
                    value={newMinutes}
                    onChange={(e) => setNewMinutes(Number(e.target.value))}
                    className="form-input"
                  />
                </div>

                <div className="form-group flex-1">
                  <label className="form-label font-mono">BASE XP</label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newBaseXp}
                    onChange={(e) => setNewBaseXp(Number(e.target.value))}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label font-mono">PROJECT CHAIN (OPTIONAL)</label>
                <input
                  type="text"
                  placeholder="e.g. Master Thesis, Hackathon, Daily Workout"
                  value={newChain}
                  onChange={(e) => setNewChain(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary font-sans"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary font-display">
                  AUTHORIZE QUEST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .quests-tab-view {
          padding: 1.5rem 1.5rem 3.5rem;
          max-width: 820px;
          margin: 0 auto;
          width: 100%;
        }

        .quests-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-super-tag {
          font-size: 0.62rem;
          color: var(--accent);
          letter-spacing: 0.18em;
        }

        .quests-screen-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--text-bright);
          letter-spacing: 0.06em;
          line-height: 1.1;
          text-shadow: 0 0 20px var(--accent-glow);
        }

        .quests-subtitle {
          font-size: 0.74rem;
          color: var(--text-muted);
          margin-top: 2px;
          letter-spacing: 0.1em;
        }

        /* Focus Timer HUD */
        .focus-timer-hud {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.1rem;
          margin-bottom: 1rem;
          background: var(--panel-glass);
          border: 1px solid var(--border-glow);
          border-radius: var(--r-md);
          box-shadow: 0 0 16px var(--accent-glow);
          gap: 1rem;
          flex-wrap: wrap;
          backdrop-filter: blur(12px);
        }

        .timer-left {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }

        .pulse-recording-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--danger);
          box-shadow: 0 0 8px var(--danger-glow);
          animation: dotPulse 1.2s infinite ease-in-out alternate;
        }
        @keyframes dotPulse {
          0%  { opacity: 0.4; transform: scale(0.8); }
          100%{ opacity: 1;   transform: scale(1.3); }
        }

        .timer-session-label {
          font-size: 0.72rem;
          color: var(--text-dim);
          letter-spacing: 0.1em;
        }

        .timer-time-val {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--creature);
          text-shadow: 0 0 10px var(--creature-mid);
          letter-spacing: 0.04em;
        }

        .timer-actions {
          display: flex;
          gap: 0.6rem;
          align-items: center;
        }

        /* Filters */
        .quests-filters-strip {
          display: flex;
          gap: 0.45rem;
          flex-wrap: wrap;
          margin-bottom: 1.2rem;
        }

        .filter-pill {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 4px 11px;
          border-radius: var(--r-sm);
          border: 1px solid var(--border);
          background: var(--surface-glass);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--t-base) ease;
        }
        .filter-pill:hover { border-color: var(--accent); color: var(--accent); }
        .filter-pill.active {
          background: var(--accent);
          border-color: var(--accent);
          color: #fff;
          box-shadow: 0 0 10px var(--accent-glow);
        }

        /* Quest Cards */
        .quests-cards-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .rpg-quest-card {
          padding: 1.1rem 1.2rem;
          background: var(--panel-glass);
          border: 1px solid var(--border-subtle);
          border-radius: var(--r-md);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }
        .rpg-quest-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent) 50%, transparent);
          opacity: 0.3;
        }
        .rpg-quest-card:hover {
          border-color: var(--border-glow);
          box-shadow: 0 0 18px var(--accent-glow), 0 4px 20px rgba(0,0,0,0.4);
          transform: translateY(-1px);
        }
        .rpg-quest-card.completed {
          opacity: 0.55;
          filter: saturate(0.5);
        }
        .rpg-quest-card.completed::after {
          content: '';
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(53,227,160,0.02) 6px, rgba(53,227,160,0.02) 7px);
        }

        .quest-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.2rem;
        }

        .quest-type-tag {
          font-size: 0.6rem;
          letter-spacing: 0.18em;
          color: var(--text-muted);
        }

        .quest-top-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-timer-trigger {
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-muted);
          font-size: 0.65rem;
          padding: 3px 9px;
          border-radius: var(--r-sm);
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-timer-trigger:hover { border-color: var(--creature); color: var(--creature); }

        .btn-remove-directive {
          background: transparent;
          border: 1px solid var(--border-subtle);
          color: var(--text-muted);
          width: 22px; height: 22px;
          border-radius: var(--r-sm);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-remove-directive:hover { border-color: var(--danger); color: var(--danger); }

        .quest-card-title {
          font-family: var(--font-body);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1.3;
        }

        .quest-card-meta {
          font-size: 0.72rem;
          color: var(--text-dim);
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .chain-link-tag {
          font-size: 0.68rem;
          color: var(--accent);
          letter-spacing: 0.04em;
        }

        .quest-metrics-row {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
          align-items: center;
          font-size: 0.72rem;
        }

        .stat-impact { font-weight: 800; }
        .xp-gain    { color: var(--accent); font-weight: 700; }
        .diff-tag   { color: var(--text-dim); }
        .perk-tag   { font-size: 0.68rem; color: var(--gold); }

        .quest-card-footer { margin-top: 0.4rem; }

        .quest-complete-btn {
          width: 100%;
          padding: 0.6rem;
          font-size: 0.82rem;
        }

        .quest-harvested-badge {
          font-size: 0.76rem;
          color: var(--creature);
          text-align: center;
          padding: 0.35rem;
          letter-spacing: 0.08em;
          text-shadow: 0 0 8px var(--creature-mid);
        }

        .empty-state-box { text-align: center; padding: 3rem 1.5rem; }
        .empty-title { font-size: 1.1rem; color: var(--text-dim); }
        .empty-msg   { font-size: 0.8rem; color: var(--accent); margin-top: 0.35rem; }
        .empty-sub   { font-size: 0.8rem; color: var(--text-dim); margin-top: 0.25rem; }

        /* Raids */
        .raid-section-container { margin-top: 3rem; }

        .raid-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1rem;
        }

        .raid-screen-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text);
        }

        .raid-epic-badge {
          font-size: 0.68rem;
          color: var(--epic);
          border: 1px solid var(--epic);
          padding: 2px 8px;
          border-radius: var(--r-full);
        }

        .raid-display-card {
          padding: 1.4rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          background: var(--panel-glass);
          border: 1px solid var(--border);
          border-radius: var(--r-md);
          backdrop-filter: blur(10px);
        }

        .raid-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .raid-title { font-size: 1.1rem; font-weight: 800; color: var(--text); }
        .raid-day-counter { font-size: 0.78rem; color: var(--gold); margin-top: 2px; }

        .raid-reward-box {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--surface-subtle);
          padding: 0.4rem 0.85rem;
          border-radius: var(--r-sm);
          border: 1px solid var(--epic);
          box-shadow: 0 0 8px rgba(139,108,240,0.15);
        }

        .raid-reward-icon { font-size: 1.5rem; }
        .raid-reward-label { font-size: 0.62rem; color: var(--epic); letter-spacing: 0.1em; }
        .raid-reward-name  { font-size: 0.8rem; font-weight: 700; color: var(--text); }

        .raid-requirement-text { font-size: 0.83rem; color: var(--text-dim); line-height: 1.4; }

        .raid-meter-box { display: flex; flex-direction: column; gap: 0.4rem; }
        .raid-meter-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--text-dim);
        }
        .raid-meter-track {
          height: 8px;
          background: var(--surface-subtle);
          border-radius: var(--r-full);
          overflow: hidden;
          border: 1px solid var(--border-subtle);
        }
        .raid-meter-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-deep), var(--accent), var(--creature));
          border-radius: var(--r-full);
          box-shadow: 0 0 8px var(--accent-glow);
        }

        /* Add Quest Modal */
        .add-quest-modal {
          max-width: 520px;
          width: 100%;
          padding: 2rem;
          background: var(--surface);
          border: 1px solid var(--border-glow);
          border-radius: var(--r-lg);
          box-shadow: 0 0 40px var(--accent-glow), 0 20px 60px rgba(0,0,0,0.7);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-title {
          font-size: 1.1rem;
          color: var(--gold);
          text-shadow: 0 0 10px var(--gold-glow);
          letter-spacing: 0.06em;
        }

        .quest-form { display: flex; flex-direction: column; gap: 1rem; }

        .form-group { display: flex; flex-direction: column; gap: 0.3rem; }

        .form-label {
          font-size: 0.68rem;
          color: var(--text-dim);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .form-input {
          background: var(--surface-subtle);
          border: 1px solid var(--border);
          color: var(--text);
          padding: 0.65rem 0.85rem;
          border-radius: var(--r-sm);
          font-family: var(--font-body);
          font-size: 0.88rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .form-row { display: flex; gap: 1rem; }
        .flex-1 { flex: 1; }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.75rem;
        }
      `}</style>
    </div>
  );
};
