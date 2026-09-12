import React from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { CharacterViewer3D } from '../3d/CharacterViewer3D.jsx';
import { RadarChart } from '../3d/RadarChart.jsx';
import { CLASSES, TITLES_LIST, INITIAL_EQUIPMENT_CATALOG } from '../../types/gameData.js';

export const ProfileTab = () => {
  const {
    player,
    theme,
    toggleTheme,
    isMuted,
    toggleSound,
    resetDemoState
  } = useGame();

  const currentClassData = CLASSES[player.selectedClass] || CLASSES.knight;
  const currentEquipped = player.equippedByClass[player.selectedClass] || {};

  // Monthly Activity Heatmap (30-day calendar-style grid)
  const daysInMonth = 30;
  const activeDays = new Set([1, 2, 3, 4, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25]);

  // Collection Log grouped by rarity tier
  const rarityTiers = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  const allGear = INITIAL_EQUIPMENT_CATALOG;

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Uncommon': return '#3ec07c';
      case 'Rare': return '#4a80e8';
      case 'Epic': return '#a855f7';
      case 'Legendary': return 'var(--gold)';
      case 'Mythic': return '#ec4899';
      default: return 'var(--dim-text)';
    }
  };

  return (
    <div
      style={{
        padding: '24px 20px 96px',
        maxWidth: '960px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* Header: 3D model thumbnail, display name, Rank/Title, class + subclass (Part 5.1 requirement) */}
      <div
        className="arise-card"
        style={{
          padding: '22px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}
      >
        {/* Smaller portrait-crop version of equipped character */}
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-wash)',
            border: '2px solid var(--accent)',
            boxShadow: '0 0 16px var(--accent-glow)',
            flexShrink: 0
          }}
        >
          <CharacterViewer3D
            classId={player.selectedClass}
            equipped={currentEquipped}
            compact={true}
            height={90}
            interactive={false}
            showRarityEffects={false}
          />
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.6rem',
                color: 'var(--text)',
                letterSpacing: '0.06em'
              }}
            >
              {player.displayName}
            </h1>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '12px',
                backgroundColor: 'rgba(224, 182, 74, 0.15)',
                border: '1px solid var(--gold)',
                color: 'var(--gold)',
                fontSize: '0.74rem',
                fontWeight: '800'
              }}
            >
              Lv {player.level}
            </span>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              color: 'var(--accent)',
              fontWeight: '700',
              marginTop: '4px'
            }}
          >
            « {player.title} »
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--dim-text)', marginTop: '4px' }}>
            Class: <strong style={{ color: 'var(--text)' }}>{currentClassData.name}</strong> • Subclass: <span style={{ color: 'var(--text)' }}>{player.subclass}</span>
          </div>
        </div>
      </div>

      {/* Core stats block: Level, total XP, and compact Radar/Spider chart (Part 5.1 requirement) */}
      <div className="arise-card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text)' }}>Build Shape & Attributes</h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--dim-text)' }}>
              Geometric visual representation of your life discipline profile.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--dim-text)' }}>TOTAL EXPERIENCE</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--gold)', fontWeight: '900' }}>
              {(player.level * 1000 + player.currentXp).toLocaleString()} XP
            </div>
          </div>
        </div>

        {/* Radar Spider Chart */}
        <div style={{ padding: '12px 0' }}>
          <RadarChart stats={player.stats} size={250} />
        </div>
      </div>

      {/* Streak & consistency: current streak, longest-ever, monthly activity heatmap (calendar-style grid) */}
      <div className="arise-card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text)' }}>Consistency & Discipline</h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--dim-text)' }}>
              Monthly logged activity calendar. Every block represents real work completed.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--dim-text)' }}>CURRENT</span>
              <div style={{ fontSize: '1.15rem', color: 'var(--gold)', fontWeight: '900' }}>{player.streak} Days</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--dim-text)' }}>LONGEST</span>
              <div style={{ fontSize: '1.15rem', color: 'var(--text)', fontWeight: '900' }}>{player.longestStreak} Days</div>
            </div>
          </div>
        </div>

        {/* Monthly Activity Heatmap (calendar-style grid, filled cells = active days) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            padding: '12px',
            backgroundColor: 'var(--bg-wash)',
            borderRadius: '10px',
            border: '1px solid var(--border)'
          }}
        >
          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isActive = activeDays.has(dayNum);
            return (
              <div
                key={dayNum}
                style={{
                  aspectRatio: '1',
                  borderRadius: '6px',
                  backgroundColor: isActive ? 'var(--gold)' : 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: isActive ? '0 0 6px var(--gold-glow)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  color: isActive ? '#0e0f14' : 'var(--dim-text)',
                  transition: 'all 0.2s ease'
                }}
              >
                {dayNum}
              </div>
            );
          })}
        </div>
      </div>

      {/* Battle record & scrollable list of earned Titles/Badges (Part 5.1 requirement) */}
      <div className="arise-card" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '14px' }}>
          Combat Chronicle & Titles
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}
        >
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-wash)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--dim-text)' }}>TOTAL DUELS</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--text)' }}>{player.battleRecord.total}</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-wash)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--creature-glow)' }}>VICTORIES</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--creature-glow)' }}>{player.battleRecord.wins}</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-wash)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--danger)' }}>DEFEATS</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--danger)' }}>{player.battleRecord.losses}</div>
          </div>
          <div style={{ padding: '12px', backgroundColor: 'var(--bg-wash)', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--gold)' }}>WIN STREAK</span>
            <div style={{ fontSize: '1.3rem', fontWeight: '900', color: 'var(--gold)' }}>{player.battleRecord.currentWinStreak}</div>
          </div>
        </div>

        {/* Scrollable list of earned Titles/Badges */}
        <div style={{ fontSize: '0.78rem', color: 'var(--dim-text)', marginBottom: '8px' }}>
          EARNED TITLES & EMBLEMS
        </div>
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
          {TITLES_LIST.map(title => (
            <div
              key={title.id}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-wash)',
                border: `1px solid ${title.unlocked ? 'var(--gold)' : 'var(--border)'}`,
                opacity: title.unlocked ? 1 : 0.45,
                minWidth: '160px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '1.3rem' }}>{title.icon}</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: title.unlocked ? 'var(--gold)' : 'var(--dim-text)' }}>
                  {title.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: 'var(--dim-text)' }}>
                  {title.unlocked ? 'Claimed' : 'Locked'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collection log: grid of every outfit piece ever earned across all classes, greyed-out silhouettes for unearned pieces */}
      <div className="arise-card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text)' }}>Trophy Collection Log</h3>
            <p style={{ fontSize: '0.76rem', color: 'var(--dim-text)' }}>
              Permanent trophy case across all classes. Unearned pieces show as silhouettes. Visible goals to chase, never purchasable shortcuts.
            </p>
          </div>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: '800',
              color: 'var(--accent)',
              padding: '4px 10px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-wash)',
              border: '1px solid var(--border)'
            }}
          >
            {player.unlockedItemIds.length} / {allGear.length} Relics Discovered
          </span>
        </div>

        {rarityTiers.map(tier => {
          const tierItems = allGear.filter(item => item.rarity === tier);
          if (tierItems.length === 0) return null;
          const tierColor = getRarityColor(tier);

          return (
            <div key={tier} style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.74rem', fontWeight: '800', color: tierColor, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {tier} TIER
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                {tierItems.map(item => {
                  const isUnlocked = player.unlockedItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--bg-wash)',
                        border: `1px solid ${isUnlocked ? tierColor : 'var(--border)'}`,
                        textAlign: 'center',
                        opacity: isUnlocked ? 1 : 0.35,
                        filter: isUnlocked ? 'none' : 'grayscale(100%)',
                        boxShadow: isUnlocked && (tier === 'Legendary' || tier === 'Mythic') ? `0 0 10px ${tierColor}` : 'none'
                      }}
                      title={isUnlocked ? item.name : `Unclaimed ${item.name} (${item.rarity})`}
                    >
                      <div style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
                        {isUnlocked ? item.icon : '🔒'}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '600',
                          color: isUnlocked ? 'var(--text)' : 'var(--dim-text)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}
                      >
                        {isUnlocked ? item.name : '??? Silhouette'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Account/settings access: theme preference, audio, reset, basic account management tucked at bottom (Part 5.1 requirement) */}
      <div
        className="arise-card"
        style={{
          padding: '18px',
          backgroundColor: 'var(--bg-wash)',
          border: '1px solid var(--border)',
          opacity: 0.85
        }}
      >
        <h4 style={{ fontSize: '0.85rem', color: 'var(--dim-text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Sanctum System Settings & Session Access
        </h4>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button onClick={toggleTheme} className="btn-pill">
            Realm Theme: {theme === 'shadow' ? 'Shadow' : 'Divine'}
          </button>
          <button onClick={toggleSound} className="btn-pill">
            Audio Effects: {isMuted ? 'Muted' : 'Enabled'}
          </button>
          <button onClick={resetDemoState} className="btn-pill" style={{ color: 'var(--danger)' }}>
            Reset Progression
          </button>
        </div>
      </div>
    </div>
  );
};

