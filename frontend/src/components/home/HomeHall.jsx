import React, { useMemo } from 'react';
import { useGame } from '../../state/GameContext';
import { calculateNextLevelXp } from '../../data/api';
import { CharacterScene } from './CharacterScene';

/**
 * HomeHall — Authentic Cinematic Solo Leveling / ARISE System Interface
 * - Center: Real Three.js WebGL 3D CharacterScene with GLTF loader pipeline, OrbitControls,
 *   3D obsidian reflective chamber, elevated rune dais, 360° XP ring, and orbiting guardian
 * - Left: Live Player Status, Streak, and Quick Actions
 * - Right: Live Daily Quests, Recent Activity, and Next Level XP
 */
export const HomeHall = () => {
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

  const pendingQuests = quests.filter((q) => !q.completed);
  const completedCount = quests.filter((q) => q.completed).length;
  const totalQuests = quests.length || 5;

  // Dynamic Recent Activity list
  const recentActivity = useMemo(() => {
    const list = [];
    quests
      .filter((q) => q.completed && q.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 2)
      .forEach((q) => {
        list.push({
          id: q.id,
          time: 'Just now',
          title: `Completed: ${q.title.slice(0, 24)}${q.title.length > 24 ? '…' : ''}`,
          reward: `+${q.baseXp} XP  +${Math.round(q.baseXp * 0.5)} Gold`,
          iconType: 'quest',
        });
      });

    if (battleResults && battleResults[0]) {
      const br = battleResults[0];
      list.push({
        id: 'br-recent',
        time: '5h ago',
        title: `Battle ${br.result} vs ${br.opponentName}`,
        reward: `+${br.goldGained} Gold`,
        iconType: 'battle',
      });
    }

    if (list.length < 3) {
      list.push(
        {
          id: 'def-1',
          time: '2h ago',
          title: 'Completed: Study DSA for 2 hours',
          reward: '+240 XP  +60 Gold',
          iconType: 'quest',
        },
        {
          id: 'def-2',
          time: '5h ago',
          title: `Leveled up to ${character.level}`,
          reward: '+2 Attribute Points',
          iconType: 'level',
        },
        {
          id: 'def-3',
          time: '1d ago',
          title: 'Earned: Gold Coin',
          reward: '+50 Gold',
          iconType: 'gold',
        }
      );
    }
    return list.slice(0, 3);
  }, [quests, battleResults, character.level]);

  return (
    <div
      className="arise-home-arena tab-content-enter"
      style={{
        background: isShadow ? '#05060b' : '#f5f0e4',
      }}
    >
      {/* ── Real WebGL Three.js 3D Showcase (GLTF Pipeline, OrbitControls, Environment) ── */}
      <CharacterScene xpPct={xpPct} />

      {/* ── 3-Column Composition Grid (Layout Frozen) ── */}
      <div className="arise-main-grid">
        {/* ════════════════ LEFT COLUMN ════════════════ */}
        <aside className="arise-side-col arise-left-side">
          {/* Card 1: Player Status Panel */}
          <div className="sl-system-panel player-panel" onClick={() => setProfileModalOpen(true)}>
            <div className="sl-top-illuminator" />

            <div className="player-id-row">
              <div className="class-diamond-glyph">
                <span>◈</span>
              </div>
              <div className="player-id-text">
                <div className="player-title-name font-display">{character.name.toUpperCase()}</div>
                <div className="player-class-sub font-mono">{character.class.toUpperCase()}</div>
              </div>
            </div>

            {/* Level XP Progress */}
            <div className="status-xp-meta font-mono">
              <span className="xp-tag">XP</span>
              <span className="xp-val">
                {character.xp.toLocaleString()} / {nextXp.toLocaleString()}
              </span>
            </div>

            <div className="status-progress-row">
              <div className="status-progress-track">
                <div className="status-progress-bar" style={{ width: `${xpPct}%` }} />
              </div>
              <div className="status-level-pill font-display">
                <span className="lv-prefix">Lv.</span>
                <span className="lv-number">{character.level}</span>
              </div>
            </div>

            {/* 4 Core Attributes */}
            <div className="attributes-grid">
              <div className="attr-item-row">
                <span className="attr-circle-icon str-icon">⚔</span>
                <span className="attr-label font-body">Strength</span>
                <span className="attr-number font-mono">{character.stats.STR || 42}</span>
              </div>
              <div className="attr-item-row">
                <span className="attr-circle-icon int-icon">🧠</span>
                <span className="attr-label font-body">Intellect</span>
                <span className="attr-number font-mono">{character.stats.INT || 78}</span>
              </div>
              <div className="attr-item-row">
                <span className="attr-circle-icon agi-icon">⚡</span>
                <span className="attr-label font-body">Agility</span>
                <span className="attr-number font-mono">{character.stats.AGI || 36}</span>
              </div>
              <div className="attr-item-row">
                <span className="attr-circle-icon vit-icon">❤️</span>
                <span className="attr-label font-body">Vitality</span>
                <span className="attr-number font-mono">{character.stats.VIT || 48}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Current Streak Panel */}
          <div className="sl-system-panel streak-panel">
            <div className="sl-top-illuminator" />
            <div className="streak-main-row">
              <span className="streak-fire-symbol">🔥</span>
              <div>
                <div className="streak-super-tag font-body">Current Streak</div>
                <div className="streak-days-count font-display">
                  {character.streak} <span className="days-label">Days</span>
                </div>
              </div>
            </div>
            <div className="streak-sub-banner font-mono">Keep the flame burning!</div>
            <div className="streak-stars-group">
              {Array.from({ length: 7 }).map((_, i) => (
                <span
                  key={i}
                  className={`streak-star-glyph ${i < Math.min(7, character.streak % 8 || 7) ? 'star-lit' : ''}`}
                >
                  ✦
                </span>
              ))}
            </div>
          </div>

          {/* Card 3: Quick Actions Panel */}
          <div className="sl-system-panel quick-panel">
            <div className="sl-top-illuminator" />
            <div className="sl-panel-header-text font-body">Quick Actions</div>
            <div className="quick-actions-list">
              <button
                className="sl-command-btn font-body"
                onClick={() => switchTab('quests')}
              >
                <span className="cmd-icon">＋</span>
                <span>Forge New Quest</span>
              </button>
              <button
                className="sl-command-btn font-body"
                onClick={() => switchTab('battle')}
              >
                <span className="cmd-icon">⚔</span>
                <span>Enter Battle</span>
              </button>
              <button
                className="sl-command-btn font-body"
                onClick={() => switchTab('shop')}
              >
                <span className="cmd-icon">🛍</span>
                <span>Visit Shop</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ════════════════ CENTER COLUMN: THE HERO & DRAGON ════════════════ */}
        {/* The central corridor is open so the hero, rune platform, and dragon
            are fully visible and unobstructed, occupying 45-55% of height! */}
        <div className="arise-hero-center">
          <div className="hero-center-spacer" />
          <div className="hero-ground-quote font-display">
            {isShadow ? '“DISCIPLINE BUILDS TRUE STRENGTH”' : '“HIGHER GOALS BRIGHTER TOMORROWS”'}
          </div>
        </div>

        {/* ════════════════ RIGHT COLUMN ════════════════ */}
        <aside className="arise-side-col arise-right-side">
          {/* Card 4: Daily Quests Panel */}
          <div className="sl-system-panel quests-panel">
            <div className="sl-top-illuminator" />
            <div className="quests-panel-head">
              <span className="quests-panel-title font-display">DAILY QUESTS</span>
              <span className="quests-counter font-mono">
                {completedCount}/{totalQuests}
              </span>
            </div>

            <div className="daily-quests-list">
              {pendingQuests.length === 0 ? (
                <div className="quests-cleared font-mono">
                  All daily directives completed! ✦
                </div>
              ) : (
                pendingQuests.slice(0, 3).map((q, idx) => (
                  <div
                    key={q.id}
                    className="daily-quest-card"
                    onClick={() => completeQuest(q.id)}
                    title="Click to complete quest"
                  >
                    <div className="quest-badge-box">
                      {q.category === 'STR' ? '⚔' : q.category === 'INT' ? '📖' : q.category === 'AGI' ? '⚡' : '❤️'}
                    </div>
                    <div className="quest-text-box">
                      <div className="quest-title-text font-body">
                        {q.title.slice(0, 25)}{q.title.length > 25 ? '…' : ''}
                      </div>
                      <div className="quest-rewards-text font-mono">
                        <span className="reward-xp">+{q.baseXp} XP</span>
                        <span className="reward-gold">+{Math.round(q.baseXp * 0.45)} Gold</span>
                      </div>
                    </div>
                    <div className="quest-count-indicator font-mono">
                      {idx === 0 ? '1/2' : '0/1'}
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              className="view-quests-link font-body"
              onClick={() => switchTab('quests')}
            >
              View All Quests →
            </button>
          </div>

          {/* Card 5: Recent Activity Panel */}
          <div className="sl-system-panel activity-panel">
            <div className="sl-top-illuminator" />
            <div className="sl-panel-header-text font-body" style={{ marginBottom: '0.65rem' }}>
              Recent Activity
            </div>

            <div className="activity-items-stack">
              {recentActivity.map((act) => (
                <div key={act.id} className="activity-entry">
                  <div className={`entry-dot-symbol ${act.iconType}`}>
                    {act.iconType === 'quest' ? '✦' : act.iconType === 'level' ? '▲' : '●'}
                  </div>
                  <div className="entry-body">
                    <div className="entry-time font-mono">{act.time}</div>
                    <div className="entry-title font-body">{act.title}</div>
                    <div className="entry-reward font-mono">{act.reward}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Next Level Panel */}
          <div className="sl-system-panel next-level-box">
            <div className="sl-top-illuminator" />
            <div className="next-level-title font-body">Next Level</div>
            <div className="next-level-row">
              <div className="next-level-track">
                <div className="next-level-bar" style={{ width: `${xpPct}%` }} />
              </div>
              <div className="next-level-diamond-badge">
                <span>◈</span>
              </div>
            </div>
            <div className="next-level-count font-mono">
              {character.xp.toLocaleString()} / {nextXp.toLocaleString()} XP
            </div>
          </div>
        </aside>
      </div>

      {/* ════════════════ STYLES ════════════════ */}
      <style>{`
        /* ── Fullscreen Dark Fantasy Arena ── */
        .arise-home-arena {
          position: relative;
          width: 100%;
          min-height: calc(100vh - 56px - 62px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem 1.4rem 1.6rem;
          overflow: hidden;
          background-repeat: no-repeat;
          background-position: center 25%;
          background-size: cover;
          transition: background-image 0.4s ease;
        }

        /* ── 3-Column Composition Grid (Frozen Layout) ── */
        .arise-main-grid {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 1220px;
          display: grid;
          grid-template-columns: 275px 1fr 275px;
          gap: 1.4rem;
          align-items: start;
        }

        .arise-side-col {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        /* ── System Window Panel Styling (Restrained, Crisp) ── */
        .sl-system-panel {
          position: relative;
          background: ${isShadow ? 'rgba(9, 11, 22, 0.88)' : 'rgba(251, 248, 239, 0.92)'};
          border: 1px solid ${isShadow ? 'rgba(58, 62, 102, 0.65)' : 'rgba(216, 202, 160, 0.85)'};
          border-radius: 5px;
          padding: 0.9rem 1rem;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: ${isShadow
            ? '0 10px 30px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(139, 108, 240, 0.18)'
            : '0 8px 24px rgba(0, 0, 0, 0.09), inset 0 1px 0 rgba(182, 137, 46, 0.22)'};
          transition: border-color 0.25s, box-shadow 0.25s;
          overflow: hidden;
        }

        .sl-system-panel:hover {
          border-color: ${isShadow ? 'rgba(139, 108, 240, 0.75)' : 'rgba(182, 137, 46, 0.85)'};
          box-shadow: ${isShadow
            ? '0 12px 36px rgba(0, 0, 0, 0.85), 0 0 18px rgba(139, 108, 240, 0.22)'
            : '0 10px 28px rgba(0, 0, 0, 0.12), 0 0 14px rgba(182, 137, 46, 0.22)'};
        }

        .sl-top-illuminator {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: ${isShadow
            ? 'linear-gradient(90deg, transparent, rgba(139, 108, 240, 0.85) 50%, transparent)'
            : 'linear-gradient(90deg, transparent, rgba(182, 137, 46, 0.8) 50%, transparent)'};
          pointer-events: none;
        }

        .sl-panel-header-text {
          font-size: 0.76rem;
          font-weight: 700;
          color: ${isShadow ? '#eae8f5' : '#2b2718'};
          margin-bottom: 0.45rem;
        }

        /* ── Player Status Panel ── */
        .player-panel { cursor: pointer; }

        .player-id-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0.65rem;
        }

        .class-diamond-glyph {
          width: 32px;
          height: 32px;
          background: ${isShadow ? 'rgba(139, 108, 240, 0.18)' : 'rgba(182, 137, 46, 0.15)'};
          border: 1px solid ${isShadow ? 'rgba(139, 108, 240, 0.6)' : 'rgba(182, 137, 46, 0.6)'};
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${isShadow ? '#a987f5' : '#b6892e'};
          font-size: 1.15rem;
          box-shadow: ${isShadow ? '0 0 12px rgba(139, 108, 240, 0.35)' : '0 0 10px rgba(182, 137, 46, 0.25)'};
          flex-shrink: 0;
        }

        .player-title-name {
          font-size: 1.15rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: ${isShadow ? '#ffffff' : '#1e1810'};
          line-height: 1.1;
        }

        .player-class-sub {
          font-size: 0.66rem;
          letter-spacing: 0.14em;
          color: ${isShadow ? '#8b6cf0' : '#b6892e'};
          font-weight: 700;
        }

        .status-xp-meta {
          display: flex;
          align-items: baseline;
          gap: 6px;
          font-size: 0.68rem;
          color: ${isShadow ? '#9b98b8' : '#766c4d'};
          margin-bottom: 4px;
        }

        .xp-tag {
          font-weight: 800;
          color: ${isShadow ? '#8b6cf0' : '#b6892e'};
        }

        .status-progress-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 0.8rem;
        }

        .status-progress-track {
          flex: 1;
          height: 6px;
          background: ${isShadow ? 'rgba(40, 44, 75, 0.8)' : 'rgba(216, 202, 160, 0.5)'};
          border-radius: 9999px;
          overflow: hidden;
        }

        .status-progress-bar {
          height: 100%;
          background: ${isShadow
            ? 'linear-gradient(90deg, #5b4bb8, #8b6cf0, #35e3a0)'
            : 'linear-gradient(90deg, #8a6a22, #b6892e, #6fd6f0)'};
          border-radius: 9999px;
          box-shadow: 0 0 8px ${isShadow ? '#8b6cf0' : '#b6892e'};
          transition: width 0.6s ease;
        }

        .status-level-pill {
          display: flex;
          align-items: baseline;
          gap: 2px;
          background: ${isShadow ? '#1a1d33' : '#efe8d3'};
          border: 1px solid ${isShadow ? 'rgba(139, 108, 240, 0.45)' : 'rgba(182, 137, 46, 0.45)'};
          border-radius: 12px;
          padding: 1px 7px;
          font-size: 0.72rem;
          color: ${isShadow ? '#eae8f5' : '#2b2718'};
          flex-shrink: 0;
        }

        .lv-prefix { font-size: 0.58rem; color: ${isShadow ? '#9b98b8' : '#766c4d'}; }
        .lv-number { font-weight: 800; }

        .attributes-grid {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .attr-item-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
        }

        .attr-circle-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.68rem;
          flex-shrink: 0;
        }
        .str-icon { background: rgba(200, 100, 70, 0.2);  border: 1px solid #c86446; color: #c86446; }
        .int-icon { background: rgba(59, 130, 246, 0.2);  border: 1px solid #3b82f6; color: #3b82f6; }
        .agi-icon { background: rgba(34, 197, 94, 0.2);   border: 1px solid #22c55e; color: #22c55e; }
        .vit-icon { background: rgba(244, 63, 94, 0.2);   border: 1px solid #f43f5e; color: #f43f5e; }

        .attr-label {
          flex: 1;
          color: ${isShadow ? '#c5c3db' : '#4a4430'};
          font-weight: 500;
        }

        .attr-number {
          font-weight: 800;
          color: ${isShadow ? '#ffffff' : '#1e1810'};
          font-size: 0.84rem;
        }

        /* ── Streak Panel ── */
        .streak-main-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .streak-fire-symbol {
          font-size: 1.4rem;
          line-height: 1;
          filter: drop-shadow(0 0 6px #ff6b3d);
        }

        .streak-super-tag {
          font-size: 0.72rem;
          color: ${isShadow ? '#9b98b8' : '#766c4d'};
          font-weight: 600;
        }

        .streak-days-count {
          font-size: 1.25rem;
          font-weight: 900;
          color: ${isShadow ? '#ffffff' : '#1e1810'};
          line-height: 1.1;
        }

        .days-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: ${isShadow ? '#9b98b8' : '#766c4d'};
        }

        .streak-sub-banner {
          font-size: 0.65rem;
          color: ${isShadow ? '#6b688d' : '#a89870'};
          margin: 4px 0 6px;
        }

        .streak-stars-group {
          display: flex;
          gap: 6px;
        }

        .streak-star-glyph {
          font-size: 0.72rem;
          color: ${isShadow ? '#3a3a5c' : '#d8caa0'};
        }
        .star-lit {
          color: #e0b64a !important;
          text-shadow: 0 0 6px rgba(224, 182, 74, 0.7);
        }

        /* ── Quick Actions Panel ── */
        .quick-actions-list {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .sl-command-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: ${isShadow ? 'rgba(23, 26, 48, 0.75)' : 'rgba(240, 235, 220, 0.8)'};
          border: 1px solid ${isShadow ? 'rgba(58, 62, 102, 0.5)' : 'rgba(216, 202, 160, 0.6)'};
          border-radius: 6px;
          padding: 0.52rem 0.85rem;
          font-size: 0.78rem;
          font-weight: 600;
          color: ${isShadow ? '#eae8f5' : '#2b2718'};
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .sl-command-btn:hover {
          border-color: ${isShadow ? '#8b6cf0' : '#b6892e'};
          color: ${isShadow ? '#ffffff' : '#000000'};
          background: ${isShadow ? 'rgba(139, 108, 240, 0.16)' : 'rgba(182, 137, 46, 0.16)'};
          transform: translateY(-1px);
        }

        .cmd-icon {
          font-size: 0.95rem;
          color: ${isShadow ? '#8b6cf0' : '#b6892e'};
        }

        /* ── Center Hero Corridor ── */
        .arise-hero-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          min-height: 620px;
          position: relative;
          pointer-events: none;
        }

        .hero-center-spacer {
          flex: 1;
        }

        .hero-ground-quote {
          font-size: 0.75rem;
          letter-spacing: 0.18em;
          color: ${isShadow ? '#9b98b8' : '#766c4d'};
          text-shadow: ${isShadow ? '0 0 14px rgba(0, 0, 0, 0.95)' : '0 0 10px rgba(255, 255, 255, 0.9)'};
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.8rem;
          pointer-events: auto;
        }

        /* ── Right Column: Daily Quests ── */
        .quests-panel-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.65rem;
        }

        .quests-panel-title {
          font-size: 0.84rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: ${isShadow ? '#ffffff' : '#1e1810'};
        }

        .quests-counter {
          font-size: 0.72rem;
          font-weight: 700;
          color: ${isShadow ? '#8b6cf0' : '#b6892e'};
        }

        .daily-quests-list {
          display: flex;
          flex-direction: column;
          gap: 0.55rem;
        }

        .daily-quest-card {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.45rem 0.6rem;
          background: ${isShadow ? 'rgba(15, 17, 34, 0.75)' : 'rgba(244, 238, 222, 0.75)'};
          border: 1px solid ${isShadow ? 'rgba(58, 62, 102, 0.4)' : 'rgba(216, 202, 160, 0.5)'};
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .daily-quest-card:hover {
          border-color: ${isShadow ? '#8b6cf0' : '#b6892e'};
          background: ${isShadow ? 'rgba(139, 108, 240, 0.14)' : 'rgba(182, 137, 46, 0.14)'};
          transform: translateX(2px);
        }

        .quest-badge-box {
          width: 24px;
          height: 24px;
          border-radius: 4px;
          background: ${isShadow ? 'rgba(139, 108, 240, 0.2)' : 'rgba(182, 137, 46, 0.18)'};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
        }

        .quest-text-box {
          flex: 1;
          min-width: 0;
        }

        .quest-title-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: ${isShadow ? '#eae8f5' : '#2b2718'};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.2;
        }

        .quest-rewards-text {
          display: flex;
          gap: 6px;
          font-size: 0.62rem;
          margin-top: 2px;
        }

        .reward-xp {
          color: ${isShadow ? '#8b6cf0' : '#b6892e'};
          font-weight: 700;
        }

        .reward-gold {
          color: #e0b64a;
          font-weight: 700;
        }

        .quest-count-indicator {
          font-size: 0.68rem;
          color: ${isShadow ? '#9b98b8' : '#766c4d'};
        }

        .view-quests-link {
          background: none;
          border: none;
          color: ${isShadow ? '#8b6cf0' : '#b6892e'};
          font-size: 0.72rem;
          font-weight: 700;
          cursor: pointer;
          padding: 0.4rem 0 0;
          text-align: left;
          width: 100%;
          transition: color 0.2s;
        }
        .view-quests-link:hover {
          color: ${isShadow ? '#a987f5' : '#8a6a22'};
        }

        /* ── Recent Activity Panel ── */
        .activity-items-stack {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .activity-entry {
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .entry-dot-symbol {
          font-size: 0.7rem;
          margin-top: 2px;
        }
        .entry-dot-symbol.quest  { color: ${isShadow ? '#8b6cf0' : '#b6892e'}; }
        .entry-dot-symbol.level  { color: #35e3a0; }
        .entry-dot-symbol.battle { color: #e0b64a; }

        .entry-body { flex: 1; }
        .entry-time { font-size: 0.58rem; color: ${isShadow ? '#6b688d' : '#a89870'}; }
        .entry-title { font-size: 0.74rem; font-weight: 600; color: ${isShadow ? '#eae8f5' : '#2b2718'}; line-height: 1.2; }
        .entry-reward { font-size: 0.62rem; color: ${isShadow ? '#9b98b8' : '#766c4d'}; }

        /* ── Next Level Panel ── */
        .next-level-title {
          font-size: 0.75rem;
          font-weight: 700;
          color: ${isShadow ? '#eae8f5' : '#2b2718'};
          margin-bottom: 4px;
        }

        .next-level-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3px;
        }

        .next-level-track {
          flex: 1;
          height: 5px;
          background: ${isShadow ? 'rgba(40, 44, 75, 0.8)' : 'rgba(216, 202, 160, 0.5)'};
          border-radius: 9999px;
          overflow: hidden;
        }

        .next-level-bar {
          height: 100%;
          background: ${isShadow
            ? 'linear-gradient(90deg, #5b4bb8, #8b6cf0, #35e3a0)'
            : 'linear-gradient(90deg, #8a6a22, #b6892e, #6fd6f0)'};
          border-radius: 9999px;
          box-shadow: 0 0 8px ${isShadow ? '#8b6cf0' : '#b6892e'};
          transition: width 0.6s ease;
        }

        .next-level-diamond-badge {
          width: 22px;
          height: 22px;
          background: ${isShadow ? 'rgba(139, 108, 240, 0.18)' : 'rgba(182, 137, 46, 0.18)'};
          border: 1px solid ${isShadow ? 'rgba(139, 108, 240, 0.6)' : 'rgba(182, 137, 46, 0.6)'};
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${isShadow ? '#a987f5' : '#b6892e'};
          font-size: 0.85rem;
          flex-shrink: 0;
        }

        .next-level-count {
          font-size: 0.62rem;
          color: ${isShadow ? '#9b98b8' : '#766c4d'};
        }

        /* ── Responsive Behavior ── */
        @media (max-width: 980px) {
          .arise-main-grid {
            grid-template-columns: 240px 1fr 240px;
            gap: 0.75rem;
          }
        }

        @media (max-width: 768px) {
          .arise-main-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .arise-hero-center {
            order: 1;
            min-height: 480px;
          }
          .arise-left-side {
            order: 2;
          }
          .arise-right-side {
            order: 3;
          }
        }
      `}</style>
    </div>
  );
};
