import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { calculateNextLevelXp } from '../../data/api';

/**
 * SystemHUD — Futuristic Solo-Leveling Holographic System Interface
 * Replaces bulky rectangular dashboard cards with:
 * - Floating holographic HUD modules
 * - Hairline luminous outlines & corner brackets
 * - Classified mission briefing quest module
 * - Telemetry readouts and interactive directive completion
 */
export const SystemHUD = ({ onQuestCompleteAnim }) => {
  const {
    character,
    theme,
    switchTab,
    quests,
    completeQuest,
    battleResults,
    setProfileModalOpen,
  } = useGame();

  const isShadow = theme === 'shadow';
  const nextXp = calculateNextLevelXp(character.level);
  const xpPct = Math.min(100, Math.round((character.xp / nextXp) * 100));

  // Current featured directive (primary mission)
  const activeQuests = quests.filter((q) => !q.completed);
  const primaryQuest = activeQuests[0] || {
    id: 'default-active',
    title: 'MASTER BINARY SEARCH TREE',
    objective: 'Complete 2 hours of focused algorithmic problem solving.',
    baseXp: 120,
    statGain: 3,
    category: 'INT',
  };

  const [isExecuting, setIsExecuting] = useState(false);

  const handleExecuteDirective = (questId) => {
    if (isExecuting) return;
    setIsExecuting(true);
    if (onQuestCompleteAnim) onQuestCompleteAnim();

    setTimeout(() => {
      completeQuest(questId);
      setIsExecuting(false);
    }, 600);
  };

  return (
    <div className="system-hud-overlay" aria-label="System Holographic HUD">
      {/* ════════════════ LEFT: PLAYER SYSTEM TELEMETRY ════════════════ */}
      <aside className="hud-module hud-left-telemetry">
        <div className="hud-corner-bracket top-left" />
        <div className="hud-corner-bracket top-right" />
        <div className="hud-corner-bracket bottom-left" />
        <div className="hud-corner-bracket bottom-right" />

        {/* System Header */}
        <div className="hud-sys-tag font-mono">
          <span className="sys-blink-dot" /> SYSTEM // AWAKENED HUNTER
        </div>

        {/* Player Identity Row */}
        <div className="hud-player-ident" onClick={() => setProfileModalOpen(true)}>
          <div className="hud-player-name font-display">{character.name.toUpperCase()}</div>
          <div className="hud-rank-pill font-mono">RANK A</div>
        </div>

        <div className="hud-meta-row font-mono">
          <span className="hud-class-badge">{character.class.toUpperCase()}</span>
          <span className="hud-level-tag">LV. {character.level}</span>
        </div>

        {/* Hairline Divider */}
        <div className="hud-hairline" />

        {/* XP Telemetry */}
        <div className="hud-xp-block font-mono">
          <div className="hud-xp-labels">
            <span>XP PROGRESSION</span>
            <span className="hud-xp-numbers">
              {character.xp.toLocaleString()} / {nextXp.toLocaleString()}
            </span>
          </div>
          <div className="hud-xp-line-track">
            <div className="hud-xp-line-fill" style={{ width: `${xpPct}%` }} />
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="hud-hairline" />

        {/* Core Attributes Telemetry Matrix */}
        <div className="hud-stats-matrix font-mono">
          <div className="hud-stat-cell">
            <span className="stat-code str">STR</span>
            <span className="stat-val">{character.stats.STR || 42}</span>
          </div>
          <div className="hud-stat-cell">
            <span className="stat-code int">INT</span>
            <span className="stat-val">{character.stats.INT || 67}</span>
          </div>
          <div className="hud-stat-cell">
            <span className="stat-code agi">AGI</span>
            <span className="stat-val">{character.stats.AGI || 51}</span>
          </div>
          <div className="hud-stat-cell">
            <span className="stat-code vit">VIT</span>
            <span className="stat-val">{character.stats.VIT || 45}</span>
          </div>
        </div>

        {/* Streak Cluster */}
        <div className="hud-streak-cluster">
          <div className="streak-header font-mono">
            <span>🔥 STREAK CYCLE</span>
            <span className="streak-days-val font-display">{character.streak} DAYS</span>
          </div>
          <div className="streak-pips-row">
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className={`streak-pip ${i < Math.min(7, character.streak % 8 || 7) ? 'pip-active' : ''}`}
              >
                ◆
              </span>
            ))}
          </div>
        </div>

        {/* Quick Command Triggers */}
        <div className="hud-commands-group font-mono">
          <button className="hud-cmd-btn" onClick={() => switchTab('quests')}>
            <span>[+]</span> FORGE QUEST
          </button>
          <button className="hud-cmd-btn" onClick={() => switchTab('battle')}>
            <span>[⚔]</span> ARENA DUEL
          </button>
          <button className="hud-cmd-btn" onClick={() => switchTab('shop')}>
            <span>[◈]</span> ARMORY SHOP
          </button>
        </div>
      </aside>

      {/* ════════════════ CENTER: CHARACTER HUD LABELS ════════════════ */}
      <div className="hud-center-cluster">
        <div className="hud-system-status font-mono">
          <span className="status-ping-beacon" />
          SYSTEM ONLINE · ARCHIVE ACTIVE
        </div>

        <div className="center-spacer" />

        <div className="hud-hero-identity-bottom font-mono">
          <div className="hero-class-line font-display">
            LEVEL {character.level} · {character.class.toUpperCase()}
          </div>
          <div className="hero-quote-text font-display">
            {isShadow ? '“DISCIPLINE BUILDS TRUE STRENGTH”' : '“HIGHER GOALS BRIGHTER TOMORROWS”'}
          </div>
        </div>
      </div>

      {/* ════════════════ RIGHT: DIRECTIVE & MISSION LOG ════════════════ */}
      <aside className="hud-module hud-right-briefing">
        <div className="hud-corner-bracket top-left" />
        <div className="hud-corner-bracket top-right" />
        <div className="hud-corner-bracket bottom-left" />
        <div className="hud-corner-bracket bottom-right" />

        {/* Directive Briefing Module */}
        <div className={`hud-directive-box ${isExecuting ? 'executing-scan' : ''}`}>
          <div className="hud-sys-tag font-mono">
            ┌ SYSTEM QUEST DIRECTIVE ─────────────────
          </div>
          <div className="directive-code font-mono">
            CODE: DIR-00{quests.findIndex((q) => q.id === primaryQuest.id) + 1 || 1}
          </div>

          <h3 className="directive-title font-display">{primaryQuest.title}</h3>

          <div className="directive-objective font-body">
            {primaryQuest.objective || 'Complete focused deep work block to advance hunter attributes.'}
          </div>

          <div className="directive-rewards font-mono">
            <span className="reward-tag xp">+{primaryQuest.baseXp} XP</span>
            <span className="reward-tag gold">+{Math.round(primaryQuest.baseXp * 0.45)} GOLD</span>
            <span className="reward-tag stat">+{primaryQuest.statGain || 3} {primaryQuest.category}</span>
          </div>

          <button
            className="hud-complete-btn font-mono"
            onClick={() => handleExecuteDirective(primaryQuest.id)}
            disabled={isExecuting}
          >
            {isExecuting ? '>>> EXECUTING SCAN <<<' : '[ COMPLETE DIRECTIVE ]'}
          </button>
        </div>

        {/* Hairline Divider */}
        <div className="hud-hairline" style={{ margin: '0.8rem 0' }} />

        {/* System Activity Stream */}
        <div className="hud-system-log">
          <div className="log-head font-mono">
            <span>[ SYSTEM LOG ]</span>
            <button className="view-all-link" onClick={() => switchTab('quests')}>
              EXPAND →
            </button>
          </div>

          <div className="log-entries-list font-mono">
            <div className="log-entry">
              <span className="entry-arrow">›</span>
              <span className="entry-msg">QUEST COMPLETE: STUDY DSA</span>
              <span className="entry-xp">+240 XP</span>
            </div>
            <div className="log-entry">
              <span className="entry-arrow">›</span>
              <span className="entry-msg">LEVEL EXPANSION DETECTED: LV. {character.level}</span>
            </div>
            <div className="log-entry">
              <span className="entry-arrow">›</span>
              <span className="entry-msg">CURRENCY SYNC: +50 GOLD</span>
            </div>
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="hud-hairline" style={{ margin: '0.8rem 0 0.5rem' }} />

        {/* Next Level Horizon Telemetry */}
        <div className="hud-next-level font-mono">
          <div className="next-level-meta">
            <span>HORIZON TARGET</span>
            <span>{character.xp} / {nextXp} XP</span>
          </div>
          <div className="hud-xp-line-track">
            <div className="hud-xp-line-fill" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </aside>

      {/* ════════════════ STYLES ════════════════ */}
      <style>{`
        /* ── Overlay Layout ── */
        .system-hud-overlay {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1280px;
          display: grid;
          grid-template-columns: 290px 1fr 310px;
          gap: 1.5rem;
          align-items: start;
          pointer-events: none;
        }

        /* ── Floating Holographic HUD Modules ── */
        .hud-module {
          position: relative;
          background: ${isShadow ? 'rgba(5, 6, 12, 0.72)' : 'rgba(251, 248, 239, 0.78)'};
          border: 1px solid ${isShadow ? 'rgba(91, 140, 255, 0.22)' : 'rgba(182, 137, 46, 0.35)'};
          padding: 1.1rem 1.15rem;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: ${isShadow
            ? '0 12px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(91, 140, 255, 0.04)'
            : '0 8px 30px rgba(0, 0, 0, 0.08), inset 0 0 20px rgba(182, 137, 46, 0.05)'};
          pointer-events: auto;
        }

        /* ── Tech Corner Brackets ── */
        .hud-corner-bracket {
          position: absolute;
          width: 8px;
          height: 8px;
          pointer-events: none;
        }
        .top-left {
          top: -1px; left: -1px;
          border-top: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'};
          border-left: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'};
        }
        .top-right {
          top: -1px; right: -1px;
          border-top: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'};
          border-right: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'};
        }
        .bottom-left {
          bottom: -1px; left: -1px;
          border-bottom: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'};
          border-left: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'};
        }
        .bottom-right {
          bottom: -1px; right: -1px;
          border-bottom: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'};
          border-right: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'};
        }

        /* System Telemetry Header */
        .hud-sys-tag {
          font-size: 0.62rem;
          letter-spacing: 0.14em;
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 0.6rem;
        }

        .sys-blink-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${isShadow ? '#35e3a0' : '#22d3ee'};
          box-shadow: 0 0 8px ${isShadow ? '#35e3a0' : '#22d3ee'};
          animation: blinkDot 1.4s infinite alternate;
        }
        @keyframes blinkDot {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        .hud-player-ident {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          cursor: pointer;
        }

        .hud-player-name {
          font-size: 1.35rem;
          font-weight: 900;
          letter-spacing: 0.06em;
          color: ${isShadow ? '#ffffff' : '#1e1810'};
          line-height: 1.1;
          text-shadow: ${isShadow ? '0 0 16px rgba(122, 162, 255, 0.4)' : 'none'};
        }

        .hud-rank-pill {
          font-size: 0.68rem;
          font-weight: 800;
          padding: 2px 7px;
          background: ${isShadow ? 'rgba(122, 162, 255, 0.15)' : 'rgba(182, 137, 46, 0.15)'};
          border: 1px solid ${isShadow ? '#7aa2ff' : '#b6892e'};
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
          border-radius: 2px;
        }

        .hud-meta-row {
          display: flex;
          gap: 12px;
          font-size: 0.7rem;
          color: ${isShadow ? '#8b9bb4' : '#766c4d'};
          margin: 4px 0 0.65rem;
        }

        .hud-class-badge {
          color: ${isShadow ? '#a78bfa' : '#b6892e'};
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .hud-hairline {
          height: 1px;
          background: ${isShadow
            ? 'linear-gradient(90deg, rgba(91, 140, 255, 0.4), transparent)'
            : 'linear-gradient(90deg, rgba(182, 137, 46, 0.4), transparent)'};
          margin: 0.65rem 0;
        }

        /* XP Gauge */
        .hud-xp-block {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .hud-xp-labels {
          display: flex;
          justify-content: space-between;
          font-size: 0.62rem;
          color: ${isShadow ? '#8b9bb4' : '#766c4d'};
        }

        .hud-xp-numbers {
          color: ${isShadow ? '#ffffff' : '#1e1810'};
          font-weight: 700;
        }

        .hud-xp-line-track {
          height: 3px;
          background: ${isShadow ? 'rgba(40, 48, 80, 0.8)' : 'rgba(216, 202, 160, 0.6)'};
          overflow: hidden;
        }

        .hud-xp-line-fill {
          height: 100%;
          background: ${isShadow
            ? 'linear-gradient(90deg, #5b8cff, #8b5cf6, #35e3a0)'
            : 'linear-gradient(90deg, #8a6a22, #d4af37, #22d3ee)'};
          box-shadow: 0 0 8px ${isShadow ? '#5b8cff' : '#d4af37'};
          transition: width 0.6s ease;
        }

        /* Core Attribute Grid */
        .hud-stats-matrix {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.45rem 0.8rem;
          font-size: 0.72rem;
        }

        .hud-stat-cell {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 3px 6px;
          background: ${isShadow ? 'rgba(15, 18, 34, 0.5)' : 'rgba(240, 235, 220, 0.6)'};
          border-left: 2px solid ${isShadow ? '#5b8cff' : '#b6892e'};
        }

        .stat-code.str { color: #f87171; }
        .stat-code.int { color: #60a5fa; }
        .stat-code.agi { color: #4ade80; }
        .stat-code.vit { color: #f472b6; }

        .stat-val {
          font-weight: 800;
          color: ${isShadow ? '#ffffff' : '#1e1810'};
        }

        /* Streak */
        .hud-streak-cluster {
          margin-top: 0.75rem;
          padding: 0.5rem 0.65rem;
          background: ${isShadow ? 'rgba(20, 24, 44, 0.4)' : 'rgba(245, 238, 220, 0.5)'};
          border: 1px dashed ${isShadow ? 'rgba(91, 140, 255, 0.3)' : 'rgba(182, 137, 46, 0.3)'};
        }

        .streak-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.65rem;
          color: ${isShadow ? '#8b9bb4' : '#766c4d'};
        }

        .streak-days-val {
          font-size: 0.95rem;
          font-weight: 900;
          color: #ff7844;
          text-shadow: 0 0 8px rgba(255, 120, 68, 0.5);
        }

        .streak-pips-row {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }

        .streak-pip {
          font-size: 0.62rem;
          color: ${isShadow ? '#2a3250' : '#d8caa0'};
        }
        .pip-active {
          color: #e0b64a !important;
          text-shadow: 0 0 6px rgba(224, 182, 74, 0.7);
        }

        /* Quick Command Triggers */
        .hud-commands-group {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-top: 0.75rem;
        }

        .hud-cmd-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: 1px solid ${isShadow ? 'rgba(91, 140, 255, 0.25)' : 'rgba(182, 137, 46, 0.35)'};
          color: ${isShadow ? '#c5cbe3' : '#3d3420'};
          padding: 0.38rem 0.65rem;
          font-size: 0.68rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }
        .hud-cmd-btn:hover {
          border-color: ${isShadow ? '#7aa2ff' : '#d4af37'};
          background: ${isShadow ? 'rgba(122, 162, 255, 0.12)' : 'rgba(182, 137, 46, 0.14)'};
          color: ${isShadow ? '#ffffff' : '#000000'};
          transform: translateX(2px);
        }
        .hud-cmd-btn span {
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
          font-weight: 800;
        }

        /* ── Center Status Cluster ── */
        .hud-center-cluster {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          min-height: 580px;
          pointer-events: none;
        }

        .hud-system-status {
          font-size: 0.68rem;
          letter-spacing: 0.18em;
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
          background: ${isShadow ? 'rgba(5, 6, 12, 0.65)' : 'rgba(251, 248, 239, 0.75)'};
          padding: 3px 14px;
          border: 1px solid ${isShadow ? 'rgba(91, 140, 255, 0.35)' : 'rgba(182, 137, 46, 0.4)'};
          border-radius: 9999px;
          display: flex;
          align-items: center;
          gap: 8px;
          backdrop-filter: blur(8px);
        }

        .status-ping-beacon {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${isShadow ? '#35e3a0' : '#22d3ee'};
          box-shadow: 0 0 8px ${isShadow ? '#35e3a0' : '#22d3ee'};
          animation: beaconPulse 1.2s infinite ease-out;
        }
        @keyframes beaconPulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }

        .center-spacer { flex: 1; }

        .hud-hero-identity-bottom {
          text-align: center;
          margin-bottom: 0.4rem;
          pointer-events: auto;
        }

        .hero-class-line {
          font-size: 0.82rem;
          font-weight: 800;
          letter-spacing: 0.14em;
          color: ${isShadow ? '#ffffff' : '#1e1810'};
          text-shadow: ${isShadow ? '0 0 12px rgba(122, 162, 255, 0.5)' : 'none'};
        }

        .hero-quote-text {
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          color: ${isShadow ? '#8b9bb4' : '#766c4d'};
          margin-top: 2px;
        }

        /* ── Right: Directive Briefing Module ── */
        .hud-right-briefing {
          display: flex;
          flex-direction: column;
        }

        .hud-directive-box {
          position: relative;
          overflow: hidden;
        }

        .hud-directive-box.executing-scan::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(122, 162, 255, 0.35), transparent);
          animation: laserScan 0.55s ease-in-out forwards;
        }
        @keyframes laserScan {
          0% { transform: translateX(0); }
          100% { transform: translateX(200%); }
        }

        .directive-code {
          font-size: 0.6rem;
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
          margin: 4px 0 2px;
        }

        .directive-title {
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: 0.04em;
          color: ${isShadow ? '#ffffff' : '#1e1810'};
          line-height: 1.25;
          margin-bottom: 0.4rem;
        }

        .directive-objective {
          font-size: 0.75rem;
          color: ${isShadow ? '#b0b8d0' : '#4a4230'};
          line-height: 1.35;
          margin-bottom: 0.65rem;
        }

        .directive-rewards {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 0.75rem;
        }

        .reward-tag {
          font-size: 0.62rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 2px;
        }
        .reward-tag.xp   { background: rgba(91, 140, 255, 0.15); border: 1px solid #5b8cff; color: #7aa2ff; }
        .reward-tag.gold { background: rgba(224, 182, 74, 0.15); border: 1px solid #e0b64a; color: #e0b64a; }
        .reward-tag.stat { background: rgba(139, 92, 246, 0.15); border: 1px solid #8b5cf6; color: #a78bfa; }

        .hud-complete-btn {
          width: 100%;
          background: ${isShadow
            ? 'linear-gradient(135deg, rgba(91, 140, 255, 0.35), rgba(139, 92, 246, 0.35))'
            : 'linear-gradient(135deg, rgba(182, 137, 46, 0.4), rgba(214, 168, 79, 0.4))'};
          border: 1px solid ${isShadow ? '#7aa2ff' : '#d4af37'};
          color: ${isShadow ? '#ffffff' : '#1e1810'};
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 0.6rem 0.8rem;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: ${isShadow ? '0 0 14px rgba(91, 140, 255, 0.2)' : '0 0 10px rgba(182, 137, 46, 0.2)'};
        }
        .hud-complete-btn:hover:not(:disabled) {
          background: ${isShadow ? '#5b8cff' : '#b6892e'};
          color: ${isShadow ? '#ffffff' : '#ffffff'};
          box-shadow: 0 0 20px ${isShadow ? '#5b8cff' : '#b6892e'};
          transform: translateY(-1px);
        }

        /* System Activity Log */
        .hud-system-log {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .log-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.62rem;
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
        }

        .view-all-link {
          background: none;
          border: none;
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
          font-size: 0.62rem;
          cursor: pointer;
        }

        .log-entries-list {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .log-entry {
          display: flex;
          align-items: baseline;
          gap: 6px;
          font-size: 0.65rem;
          color: ${isShadow ? '#8b9bb4' : '#6b6045'};
        }
        .entry-arrow { color: ${isShadow ? '#7aa2ff' : '#b6892e'}; font-weight: 900; }
        .entry-msg { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .entry-xp { color: ${isShadow ? '#35e3a0' : '#22d3ee'}; font-weight: 700; }

        /* Next Level Target */
        .hud-next-level {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .next-level-meta {
          display: flex;
          justify-content: space-between;
          font-size: 0.6rem;
          color: ${isShadow ? '#8b9bb4' : '#766c4d'};
        }

        /* ── Responsive Behavior ── */
        @media (max-width: 1040px) {
          .system-hud-overlay {
            grid-template-columns: 260px 1fr 280px;
            gap: 1rem;
          }
        }

        @media (max-width: 840px) {
          .system-hud-overlay {
            grid-template-columns: 1fr;
            gap: 1.2rem;
          }
          .hud-center-cluster {
            order: 1;
            min-height: 440px;
          }
          .hud-left-telemetry {
            order: 2;
          }
          .hud-right-briefing {
            order: 3;
          }
        }
      `}</style>
    </div>
  );
};

