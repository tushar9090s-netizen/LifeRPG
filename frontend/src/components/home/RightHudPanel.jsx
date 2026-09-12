import React, { useState } from 'react';
import { useGame } from '../../state/GameContext.jsx';

export const RightHudPanel = () => {
  const { player, completeQuest, switchTab, theme } = useGame();
  const [animatingQuestId, setAnimatingQuestId] = useState(null);
  const [flyingSparks, setFlyingSparks] = useState([]);
  const isDivine = theme === 'divine';

  const xpPercent = Math.min(100, Math.round((player.currentXp / player.nextLevelXp) * 100));

  // Incomplete quests (show up to 3)
  const activeQuests = player.quests.filter(q => !q.completed).slice(0, 3);
  const totalQuests = player.quests.length;
  const completedQuestsCount = player.quests.filter(q => q.completed).length;

  const getAttrColor = (cat) => {
    switch (cat) {
      case 'STR': return 'var(--attr-str)';
      case 'INT': return 'var(--attr-int)';
      case 'AGI': return 'var(--attr-agi)';
      case 'VIT': return 'var(--attr-vit)';
      default: return 'var(--accent)';
    }
  };

  const getAttrIcon = (cat) => {
    switch (cat) {
      case 'STR': return '⚔️';
      case 'INT': return '📖';
      case 'AGI': return '⚡';
      case 'VIT': return '❤️';
      default: return '📜';
    }
  };

  // Quest Claim interaction with flying particles
  const handleClaim = (questId, e) => {
    if (animatingQuestId) return;
    setAnimatingQuestId(questId);

    const rect = e.currentTarget.getBoundingClientRect();
    const sparks = [];
    for (let i = 0; i < 8; i++) {
      sparks.push({
        id: Math.random(),
        x: rect.left + rect.width / 2 + (Math.random() - 0.5) * 15,
        y: rect.top + (Math.random() - 0.5) * 10,
        targetX: -260 + (Math.random() - 0.5) * 30,
        targetY: -140 + (Math.random() - 0.5) * 30,
        color: i % 2 === 0 ? 'var(--accent)' : 'var(--gold)'
      });
    }
    setFlyingSparks(sparks);

    setTimeout(() => {
      completeQuest(questId);
      setAnimatingQuestId(null);
      setFlyingSparks([]);
    }, 450);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        width: '100%',
        maxWidth: '310px',
        zIndex: 10
      }}
    >
      {/* Flying particles container */}
      {flyingSparks.map(s => (
        <div
          key={s.id}
          className="xp-fly-sparkle"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            background: s.color,
            boxShadow: `0 0 10px ${s.color}`,
            '--target-x': `${s.targetX}px`,
            '--target-y': `${s.targetY}px`
          }}
        />
      ))}

      {/* 1. TOP CARD: DAILY QUESTS (Matching Concept Art Image 2) */}
      <div className="fantasy-hud-panel" style={{ padding: '16px 14px' }}>
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.84rem',
              fontWeight: '900',
              letterSpacing: '0.1em',
              color: 'var(--text)'
            }}
          >
            DAILY QUESTS
          </div>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: '700',
              color: 'var(--dim-text)',
              fontFamily: 'var(--font-display)'
            }}
          >
            {completedQuestsCount} / {totalQuests}
          </span>
        </div>

        {/* Quest List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {activeQuests.length === 0 ? (
            <div style={{ padding: '16px 8px', textAlign: 'center', color: 'var(--dim-text)', fontSize: '0.74rem' }}>
              All daily directives vanquished! Forge new quests in the Quests tab.
            </div>
          ) : (
            activeQuests.map((quest, idx) => {
              const attrColor = getAttrColor(quest.category);
              const attrIcon = getAttrIcon(quest.category);
              const isAnimating = animatingQuestId === quest.id;

              return (
                <div
                  key={quest.id}
                  className={isAnimating ? 'quest-rewarding' : ''}
                  style={{
                    backgroundColor: isDivine ? 'rgba(255, 255, 255, 0.65)' : 'rgba(12, 14, 22, 0.75)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  {/* Category icon */}
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: `${attrColor}18`,
                      border: `1px solid ${attrColor}44`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.82rem',
                      flexShrink: 0
                    }}
                  >
                    {attrIcon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: '600',
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {quest.title}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', fontSize: '0.68rem', marginTop: '1px' }}>
                      <span style={{ color: 'var(--accent)', fontWeight: '700' }}>+{quest.baseXp} XP</span>
                      <span style={{ color: 'var(--gold)', fontWeight: '700' }}>+{quest.gold} Gold</span>
                    </div>
                  </div>

                  {/* Progress & Claim button */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                    <span style={{ fontSize: '0.64rem', color: 'var(--dim-text)', fontWeight: '700' }}>
                      0 / 1
                    </span>
                    <button
                      onClick={(e) => handleClaim(quest.id, e)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '3px',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--accent)',
                        color: 'var(--accent)',
                        fontSize: '0.64rem',
                        fontWeight: '800',
                        cursor: 'pointer'
                      }}
                      title="Claim quest reward"
                    >
                      CLAIM
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View All Quests link */}
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <button
            onClick={() => switchTab('quests')}
            style={{
              fontSize: '0.72rem',
              color: 'var(--accent)',
              fontWeight: '700',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.04em',
              cursor: 'pointer'
            }}
          >
            View All Quests →
          </button>
        </div>
      </div>

      {/* 2. MIDDLE CARD: Recent Activity (Matching Concept Art Image 2) */}
      <div className="fantasy-hud-panel" style={{ padding: '14px' }}>
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />

        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.74rem',
            fontWeight: '900',
            letterSpacing: '0.08em',
            color: 'var(--dim-text)',
            marginBottom: '8px',
            textTransform: 'uppercase'
          }}
        >
          Recent Activity
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--accent)' }}>✦</span>
            <div>
              <div style={{ color: 'var(--dim-text)', fontSize: '0.66rem' }}>2h ago</div>
              <div style={{ color: 'var(--text)', fontWeight: '600' }}>Completed: Study DSA</div>
              <div style={{ color: 'var(--gold)', fontSize: '0.66rem' }}>+240 XP • +60 Gold</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--gold)' }}>👑</span>
            <div>
              <div style={{ color: 'var(--dim-text)', fontSize: '0.66rem' }}>5h ago</div>
              <div style={{ color: 'var(--text)', fontWeight: '600' }}>Leveled up to 24</div>
              <div style={{ color: 'var(--accent)', fontSize: '0.66rem' }}>+2 Attribute Points</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.72rem' }}>
            <span style={{ color: 'var(--creature-glow)' }}>🪙</span>
            <div>
              <div style={{ color: 'var(--dim-text)', fontSize: '0.66rem' }}>1d ago</div>
              <div style={{ color: 'var(--text)', fontWeight: '600' }}>Earned: Gold Coin</div>
              <div style={{ color: 'var(--gold)', fontSize: '0.66rem' }}>+50 Gold</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM CARD: Next Level Progress (Matching Concept Art Image 2) */}
      <div className="fantasy-hud-panel" style={{ padding: '12px 14px' }}>
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-display)', fontWeight: '700', color: 'var(--dim-text)', letterSpacing: '0.06em' }}>
            NEXT LEVEL
          </span>
          <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--gold)' }}>
            {player.currentXp.toLocaleString()} / {player.nextLevelXp.toLocaleString()} XP
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '3px',
              backgroundColor: 'rgba(0,0,0,0.45)',
              border: '1px solid var(--border-subtle)',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${xpPercent}%`,
                height: '100%',
                background: isDivine
                  ? 'linear-gradient(90deg, #b6892e, #6fd6f0)'
                  : 'linear-gradient(90deg, var(--accent-2), var(--accent))',
                boxShadow: isDivine ? '0 0 8px var(--creature-glow)' : '0 0 8px var(--accent-glow)',
                transition: 'width 0.5s ease'
              }}
            />
          </div>

          <span style={{ fontSize: '0.85rem', color: isDivine ? 'var(--gold)' : 'var(--accent)' }}>
            ⚜
          </span>
        </div>
      </div>
    </div>
  );
};
