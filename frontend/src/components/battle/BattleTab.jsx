import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { CLASSES, NEUTRAL_POWERS } from '../../data/classes';
import { IconGold } from '../common/Icons';

export const BattleTab = () => {
  const {
    character,
    battles,
    battleResults,
    claimDuelVictory,
    createDuel,
    bosses,
    challengeBossGate
  } = useGame();

  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [oppName, setOppName] = useState('');
  const [oppClass, setOppClass] = useState('Knight');
  const [battleFormat, setBattleFormat] = useState('Streak Clash');
  const [wagerGold, setWagerGold] = useState(150);

  const [selectedDuel, setSelectedDuel] = useState(null);
  const [activePowers, setActivePowers] = useState([...character.activePowers]);

  const classData = CLASSES[character.class] || CLASSES.Mage;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createDuel(oppName.trim() || 'Rival Hunter', oppClass, battleFormat, wagerGold);
    setShowChallengeModal(false);
    setOppName('');
  };

  const handleTogglePower = (powerName) => {
    if (activePowers.includes(powerName)) {
      setActivePowers((prev) => prev.filter((p) => p !== powerName));
    } else {
      setActivePowers((prev) => [...prev, powerName]);
    }
  };

  return (
    <div className="battle-tab-view tab-content-enter">
      {/* Header (§17) */}
      <div className="battle-header-row">
        <div>
          <span className="section-super-tag font-mono">PRODUCTIVITY ARENA</span>
          <h2 className="battle-screen-title font-display">TASK BATTLE</h2>
          <p className="battle-subtitle font-mono">PRODUCTIVITY IS YOUR WEAPON.</p>
        </div>
        <button
          className="btn-primary font-display"
          onClick={() => setShowChallengeModal(true)}
        >
          + CHALLENGE HUNTER
        </button>
      </div>

      {/* Active Battles Grid (§17, §18) */}
      <div className="battles-container">
        <div className="battles-header-meta">
          <span className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-color)' }}>
            ACTIVE TASK DUELS
          </span>
          <span className="live-status-badge font-mono">● LIVE RESOLUTION</span>
        </div>

        <div className="battles-cards-stack">
          {battles.map((duel) => {
            const oppClassData = CLASSES[duel.opponentClass] || CLASSES.Knight;
            const scoreDiff = duel.myScore - duel.opponentScore;
            const totalScore = duel.myScore + duel.opponentScore || 1;
            const myPercent = Math.min(100, Math.max(10, Math.round((duel.myScore / totalScore) * 100)));

            return (
              <div key={duel.id} className="battle-duel-card card-base">
                <div className="duel-top-bar">
                  <span className="duel-format-pill font-mono">{duel.format.toUpperCase()}</span>
                  <span className="duel-timer font-mono">⏱️ {duel.timeRemaining} REMAINING</span>
                </div>

                {/* Duelling Matchup Preview (§17) */}
                <div className="duel-matchup-stage">
                  {/* User Side */}
                  <div className="fighter-side left-fighter">
                    <span className="fighter-rank-label font-mono">YOU</span>
                    <div className="fighter-name font-display">{character.name}</div>
                    <div className="fighter-class font-sans">{character.class} · LV. {character.level}</div>
                    <div className="fighter-score font-display">{duel.myScore}</div>
                    <span className="score-sub font-mono">SCORE</span>
                  </div>

                  <div className="duel-versus font-display">VS</div>

                  {/* Opponent Side */}
                  <div className="fighter-side right-fighter">
                    <span className="fighter-rank-label font-mono">OPPONENT</span>
                    <div className="fighter-name font-display">{duel.opponentName}</div>
                    <div className="fighter-class font-sans">{duel.opponentClass} · LV. {duel.opponentLevel}</div>
                    <div className="fighter-score font-display">{duel.opponentScore}</div>
                    <span className="score-sub font-mono">SCORE</span>
                  </div>
                </div>

                {/* Progress Bar of Relative Productivity */}
                <div className="duel-score-bar-track">
                  <div
                    className="duel-score-bar-fill"
                    style={{ width: `${myPercent}%` }}
                  />
                </div>

                <div className="duel-card-meta-row font-mono">
                  <span>
                    {scoreDiff >= 0
                      ? `HOLDING +${scoreDiff} PT PRODUCTIVITY LEAD`
                      : `TRAILING BY ${Math.abs(scoreDiff)} PTS · COMPLETE QUESTS TO SURGE`}
                  </span>
                  <span className="wager-tag">
                    WAGER: <IconGold size={13} /> {duel.wagerGold} GOLD
                  </span>
                </div>

                <div className="duel-card-actions">
                  <button
                    className="btn-secondary font-sans"
                    style={{ flex: 1 }}
                    onClick={() => setSelectedDuel(duel)}
                  >
                    Arm Class Powers
                  </button>
                  <button
                    className="btn-primary font-display"
                    style={{ flex: 1 }}
                    onClick={() => claimDuelVictory(duel.id)}
                  >
                    RESOLVE DUEL
                  </button>
                </div>
              </div>
            );
          })}

          {battles.length === 0 && (
            <div className="empty-state-box card-base">
              <div className="empty-title font-display">NO ACTIVE BATTLES</div>
              <div className="empty-msg font-mono">YOUR NEXT OPPONENT IS WAITING.</div>
              <p className="empty-sub font-sans">Challenge another hunter to a Sprint Duel or 24-hour Streak Clash.</p>
            </div>
          )}
        </div>
      </div>

      {/* Boss Gate Section (§25) */}
      <div className="boss-gate-section">
        <div className="boss-gate-title-row">
          <div>
            <span className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--gold-color)' }}>
              SOLO DUNGEON INSTANCE
            </span>
            <h3 className="boss-screen-title font-display">BOSS GATE</h3>
          </div>
          <span className="boss-drop-tag font-mono">GUARANTEED LEGENDARY DROP</span>
        </div>

        {bosses.map((boss) => {
          const isCleared = boss.status === 'cleared';
          const scorePercent = Math.min(100, Math.round((boss.currentScore / boss.targetScore) * 100));

          return (
            <div
              key={boss.id}
              className={`boss-gate-card card-base halo-legendary ${isCleared ? 'cleared' : ''}`}
            >
              <div className="boss-top-strip">
                <span className="boss-instance-label font-mono">
                  {isCleared ? 'CONQUERED DUNGEON' : `ACTIVE GATE · ${boss.hoursRemaining}H REMAINING`}
                </span>
                <span className="boss-level font-display">LV. {boss.levelRequirement}</span>
              </div>

              <div className="boss-hero-info">
                <h4 className="boss-title font-display">{boss.name}</h4>
                <div className="boss-subtitle font-mono">{boss.title}</div>
                <p className="boss-description font-sans">{boss.description}</p>
              </div>

              {/* Guaranteed Legendary Drop Card (§25) */}
              <div className="boss-legendary-drop-preview">
                <span className="drop-icon">{boss.guaranteedDrop.icon}</span>
                <div className="drop-info">
                  <span className="drop-label font-mono">GUARANTEED DROP</span>
                  <div className="drop-name font-display">{boss.guaranteedDrop.name}</div>
                  <span className="drop-slot font-sans">Slot: {boss.guaranteedDrop.slot}</span>
                </div>
              </div>

              {/* Target Score Meter */}
              <div className="boss-score-track-block">
                <div className="boss-score-labels font-mono">
                  <span>
                    OUTPUT: <strong>{boss.currentScore}</strong> / {boss.targetScore} REQUIRED SCORE
                  </span>
                  <span>{scorePercent}%</span>
                </div>
                <div className="boss-track-bar">
                  <div className="boss-fill-bar" style={{ width: `${scorePercent}%` }} />
                </div>
              </div>

              <div className="boss-card-footer">
                {isCleared ? (
                  <div className="gate-cleared-text font-display">
                    ✓ BOSS GATE SEALED & MONARCH ARTIFACT SECURED
                  </div>
                ) : (
                  <button
                    className="btn-primary boss-enter-btn font-display"
                    onClick={() => challengeBossGate(boss.id)}
                  >
                    [ ENTER GATE & RESOLVE ]
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Battle Results Log (§20) */}
      <div className="battle-results-section">
        <div className="results-header font-mono">RECENT BATTLE LOG</div>
        <div className="results-list-stack">
          {battleResults.map((res) => {
            const isWin = res.result === 'WIN';
            const isLoss = res.result === 'LOSS';

            return (
              <div key={res.id} className="result-log-card card-base">
                <div className="result-left-block">
                  <span
                    className={`result-pill font-mono ${isWin ? 'win-pill' : isLoss ? 'loss-pill' : 'draw-pill'}`}
                  >
                    {res.result}
                  </span>
                  <div className="result-opp-info">
                    <span className="opp-name font-display">{res.opponentName}</span>
                    <span className="opp-format font-mono">{res.format} · {res.date}</span>
                  </div>
                </div>

                <div className="result-score-block font-display">
                  <span>{res.myScore}</span>
                  <span className="dash">-</span>
                  <span>{res.opponentScore}</span>
                </div>

                <div className="result-rewards-block font-mono">
                  {res.goldGained > 0 && (
                    <span className="gain-gold">
                      <IconGold size={13} /> +{res.goldGained}
                    </span>
                  )}
                  {res.battleXpGained > 0 && (
                    <span className="gain-xp">+{res.battleXpGained} BATTLE XP</span>
                  )}
                  {res.titleProgress && (
                    <span className="title-progress-tag font-mono">{res.titleProgress}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Powers & Arena Drawer Modal (§19) */}
      {selectedDuel && (
        <div className="scrim-overlay" onClick={() => setSelectedDuel(null)}>
          <div className="modal-enter card-base arena-powers-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-display">BATTLE POWERS & MULTIPLIERS</h3>
              <button className="close-btn" onClick={() => setSelectedDuel(null)}>×</button>
            </div>

            <p className="powers-modal-sub font-sans">
              "Powers are earned exclusively through real task completion and spent during an active duel to amplify your output." (§19)
            </p>

            <div className="powers-cards-grid">
              {/* Class Special Power */}
              <div
                className={`battle-power-card ${activePowers.includes(classData.specialPower.name) ? 'armed' : ''}`}
                onClick={() => handleTogglePower(classData.specialPower.name)}
              >
                <div className="power-top">
                  <span className="power-name font-display">{classData.specialPower.name}</span>
                  <span className="power-class font-mono">{character.class}</span>
                </div>
                <div className="power-effect font-sans">{classData.specialPower.effect}</div>
                <div className="power-trigger font-mono">ARM TRIGGER: {classData.specialPower.trigger}</div>
                <div className="power-armed-status font-mono">
                  {activePowers.includes(classData.specialPower.name) ? '✓ ARMED IN DUEL' : '+ CLICK TO ARM'}
                </div>
              </div>

              {/* Neutral Powers */}
              {NEUTRAL_POWERS.map((np) => (
                <div
                  key={np.id}
                  className={`battle-power-card ${activePowers.includes(np.name) ? 'armed' : ''}`}
                  onClick={() => handleTogglePower(np.name)}
                >
                  <div className="power-top">
                    <span className="power-name font-display">{np.name}</span>
                    <span className="power-class font-mono">Neutral</span>
                  </div>
                  <div className="power-effect font-sans">{np.effect}</div>
                  <div className="power-trigger font-mono">TRIGGER: {np.trigger}</div>
                  <div className="power-armed-status font-mono">
                    {activePowers.includes(np.name) ? '✓ ARMED IN DUEL' : '+ CLICK TO ARM'}
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button
                className="btn-primary font-display"
                style={{ width: '100%' }}
                onClick={() => {
                  claimDuelVictory(selectedDuel.id);
                  setSelectedDuel(null);
                }}
              >
                RECONCILE & WIN DUEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Hunter Modal */}
      {showChallengeModal && (
        <div className="scrim-overlay" onClick={() => setShowChallengeModal(false)}>
          <div className="modal-enter card-base challenge-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-display">CHALLENGE HUNTER TO TASK DUEL</h3>
              <button className="close-btn" onClick={() => setShowChallengeModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="quest-form">
              <div className="form-group">
                <label className="form-label font-mono">OPPONENT HUNTER ID / NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hunter Baekho, Cha Hae-In, Choi Jong-In"
                  value={oppName}
                  onChange={(e) => setOppName(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="form-row">
                <div className="form-group flex-1">
                  <label className="form-label font-mono">OPPONENT CLASS</label>
                  <select
                    value={oppClass}
                    onChange={(e) => setOppClass(e.target.value)}
                    className="form-input"
                  >
                    <option value="Knight">Knight</option>
                    <option value="Mage">Mage</option>
                    <option value="Assassin">Assassin</option>
                    <option value="Alchemist">Alchemist</option>
                    <option value="Summoner">Summoner</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label className="form-label font-mono">DUEL FORMAT (§18)</label>
                  <select
                    value={battleFormat}
                    onChange={(e) => setBattleFormat(e.target.value)}
                    className="form-input"
                  >
                    <option value="Sprint Duel">Sprint Duel (1 Task · First to complete)</option>
                    <option value="Streak Clash">Streak Clash (24h · Most tasks win)</option>
                    <option value="Category Clash">Category Clash (24-48h · Single attribute)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label font-mono">GOLD WAGER</label>
                <input
                  type="number"
                  min="25"
                  max="1000"
                  value={wagerGold}
                  onChange={(e) => setWagerGold(Number(e.target.value))}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary font-sans"
                  onClick={() => setShowChallengeModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary font-display">
                  ISSUE CHALLENGE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .battle-tab-view {
          padding: 1.5rem 1.5rem 3.5rem 1.5rem;
          max-width: 820px;
          margin: 0 auto;
          width: 100%;
        }

        .battle-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .battle-screen-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--text-color);
          letter-spacing: 0.06em;
          line-height: 1.1;
        }

        .battle-subtitle {
          font-size: 0.76rem;
          color: var(--dim-text-color);
          margin-top: 2px;
        }

        .battles-container {
          margin-bottom: 3rem;
        }

        .battles-header-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .live-status-badge {
          font-size: 0.68rem;
          color: var(--danger-color);
          background: rgba(224, 84, 107, 0.12);
          border: 1px solid rgba(224, 84, 107, 0.35);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }

        .battles-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .battle-duel-card {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .duel-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .duel-format-pill {
          font-size: 0.72rem;
          color: var(--gold-color);
          background: rgba(224, 182, 74, 0.1);
          border: 1px solid var(--gold-dim);
          padding: 0.2rem 0.55rem;
          border-radius: var(--radius-sm);
        }

        .duel-timer {
          font-size: 0.75rem;
          color: var(--dim-text-color);
        }

        /* Matchup Stage (§17) */
        .duel-matchup-stage {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 0;
        }

        .fighter-side {
          display: flex;
          flex-direction: column;
        }

        .fighter-side.right-fighter {
          text-align: right;
        }

        .fighter-rank-label {
          font-size: 0.65rem;
          color: var(--dim-text-color);
        }

        .fighter-name {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-color);
        }

        .fighter-class {
          font-size: 0.75rem;
          color: var(--dim-text-color);
        }

        .fighter-score {
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--gold-color);
          line-height: 1.1;
          margin-top: 4px;
        }

        .score-sub {
          font-size: 0.6rem;
          color: var(--dim-text-color);
        }

        .duel-versus {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--accent-color);
          text-shadow: 0 0 10px var(--accent-glow);
        }

        .duel-score-bar-track {
          height: 8px;
          background: rgba(0, 0, 0, 0.45);
          border-radius: var(--radius-full);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .duel-score-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent-color), var(--gold-color));
          border-radius: var(--radius-full);
          transition: width 0.4s ease;
        }

        .duel-card-meta-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--dim-text-color);
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .wager-tag {
          color: var(--gold-color);
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .duel-card-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        /* Boss Gate Section (§25) */
        .boss-gate-section {
          margin-bottom: 3rem;
        }

        .boss-gate-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 1rem;
        }

        .boss-screen-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text-color);
        }

        .boss-drop-tag {
          font-size: 0.68rem;
          color: var(--gold-color);
          border: 1px solid var(--gold-dim);
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
        }

        .boss-gate-card {
          border-width: 2px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .boss-top-strip {
          display: flex;
          justify-content: space-between;
          font-size: 0.72rem;
          color: var(--gold-color);
        }

        .boss-title {
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--text-color);
        }

        .boss-subtitle {
          font-size: 0.75rem;
          color: var(--gold-color);
          margin-top: 2px;
        }

        .boss-description {
          font-size: 0.85rem;
          color: var(--dim-text-color);
          line-height: 1.4;
          margin-top: 0.4rem;
        }

        .boss-legendary-drop-preview {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          background: var(--surface-color-elevated);
          padding: 0.65rem 1rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--gold-color);
          box-shadow: 0 0 15px var(--gold-glow);
        }

        .drop-icon {
          font-size: 2.2rem;
        }

        .drop-label {
          font-size: 0.62rem;
          color: var(--gold-color);
        }

        .drop-name {
          font-size: 0.92rem;
          font-weight: 800;
          color: var(--text-color);
        }

        .drop-slot {
          font-size: 0.74rem;
          color: var(--dim-text-color);
        }

        .boss-score-track-block {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .boss-score-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--dim-text-color);
        }

        .boss-score-labels strong {
          color: var(--gold-color);
        }

        .boss-track-bar {
          height: 10px;
          background: rgba(0, 0, 0, 0.45);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .boss-fill-bar {
          height: 100%;
          background: linear-gradient(90deg, #ff6a4a, var(--gold-color));
          border-radius: var(--radius-full);
          box-shadow: 0 0 10px var(--gold-glow);
        }

        .boss-enter-btn {
          width: 100%;
          padding: 0.8rem;
          font-size: 0.95rem;
        }

        .gate-cleared-text {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--creature-glow);
          text-align: center;
          padding: 0.5rem;
        }

        /* Results Log (§20) */
        .battle-results-section {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .results-header {
          font-size: 0.7rem;
          color: var(--dim-text-color);
          letter-spacing: 0.1em;
        }

        .results-list-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .result-log-card {
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .result-left-block {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .result-pill {
          font-size: 0.72rem;
          font-weight: 900;
          padding: 0.2rem 0.55rem;
          border-radius: 2px;
          min-width: 48px;
          text-align: center;
        }

        .win-pill {
          background: rgba(53, 227, 160, 0.15);
          color: var(--creature-glow);
          border: 1px solid var(--creature-glow);
        }

        .loss-pill {
          background: rgba(224, 84, 107, 0.15);
          color: var(--danger-color);
          border: 1px solid var(--danger-color);
        }

        .draw-pill {
          background: rgba(224, 182, 74, 0.15);
          color: var(--gold-color);
          border: 1px solid var(--gold-color);
        }

        .result-opp-info {
          display: flex;
          flex-direction: column;
        }

        .opp-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text-color);
        }

        .opp-format {
          font-size: 0.7rem;
          color: var(--dim-text-color);
        }

        .result-score-block {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .result-score-block .dash {
          color: var(--dim-text-color);
        }

        .result-rewards-block {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          font-size: 0.74rem;
        }

        .gain-gold {
          color: var(--gold-color);
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .gain-xp {
          color: var(--creature-glow);
        }

        .title-progress-tag {
          color: var(--accent-color);
          background: rgba(139, 108, 240, 0.12);
          padding: 0.15rem 0.45rem;
          border-radius: 2px;
        }

        /* Modal */
        .arena-powers-modal {
          max-width: 580px;
          width: 100%;
          padding: 2rem;
        }

        .powers-modal-sub {
          font-size: 0.82rem;
          color: var(--dim-text-color);
          margin-top: 0.25rem;
          margin-bottom: 1.25rem;
          line-height: 1.4;
        }

        .powers-cards-grid {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .battle-power-card {
          background: var(--surface-color-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .battle-power-card:hover {
          border-color: var(--accent-color);
        }

        .battle-power-card.armed {
          border-color: var(--gold-color);
          background: rgba(224, 182, 74, 0.08);
          box-shadow: 0 0 12px var(--gold-glow);
        }

        .power-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .power-name {
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--gold-color);
        }

        .power-class {
          font-size: 0.7rem;
          color: var(--dim-text-color);
        }

        .power-effect {
          font-size: 0.82rem;
          color: var(--text-color);
          margin-top: 0.25rem;
        }

        .power-trigger {
          font-size: 0.68rem;
          color: var(--dim-text-color);
          margin-top: 0.2rem;
        }

        .power-armed-status {
          font-size: 0.7rem;
          color: var(--accent-color);
          margin-top: 0.4rem;
          font-weight: 800;
        }

        .challenge-modal {
          max-width: 500px;
          width: 100%;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

