import React, { useState } from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { OPPONENTS, POWERS_CATALOG, CLASSES } from '../../types/gameData.js';
import { CharacterViewer3D } from '../3d/CharacterViewer3D.jsx';

export const BattleTab = () => {
  const {
    player,
    activatePower,
    concludeBattle,
    respondChallenge,
    receiveRandomChallenge
  } = useGame();

  const [selectedOpponent, setSelectedOpponent] = useState(OPPONENTS[0]);
  const [selectedFormat, setSelectedFormat] = useState('Sprint Duel');

  const handleStartDuel = () => {
    respondChallenge(true, selectedOpponent, selectedFormat);
  };

  const currentClassData = CLASSES[player.selectedClass] || CLASSES.knight;

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
      {/* Tab Header */}
      <div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.65rem',
            color: 'var(--text)',
            letterSpacing: '0.06em'
          }}
        >
          Shadow Colosseum & Duels
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--dim-text)', marginTop: '2px' }}>
          Task-completion combat where productivity powers real victories. Never stat math.
        </p>
      </div>

      {/* Active Battle Arena Card */}
      {player.activeBattle?.isActive ? (
        <div
          className="arise-card"
          style={{
            padding: '24px',
            border: '2px solid var(--creature-glow)',
            boxShadow: '0 8px 32px rgba(var(--creature-glow-rgb), 0.25)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '10px',
                backgroundColor: 'rgba(var(--creature-glow-rgb), 0.15)',
                color: 'var(--creature-glow)',
                border: '1px solid var(--creature-glow)',
                textTransform: 'uppercase'
              }}
            >
              LIVE DUEL WINDOW: {player.activeBattle.format}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--text)', fontWeight: '700' }}>
              ⏱️ {player.activeBattle.timeRemaining} Left
            </span>
          </div>

          {/* Side by side score representation */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '16px',
              margin: '16px 0'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--dim-text)' }}>You ({currentClassData.name})</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--creature-glow)', fontWeight: '900' }}>
                {player.activeBattle.userScore} pts
              </div>
            </div>

            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--border)', fontWeight: '900' }}>
              VS
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--dim-text)' }}>{player.activeBattle.opponent.name}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--danger)', fontWeight: '900' }}>
                {player.activeBattle.oppScore} pts
              </div>
            </div>
          </div>

          {/* Score comparison bar */}
          <div
            style={{
              height: '12px',
              borderRadius: '6px',
              backgroundColor: 'var(--bg-wash)',
              border: '1px solid var(--border)',
              overflow: 'hidden',
              display: 'flex',
              marginBottom: '16px'
            }}
          >
            <div
              style={{
                width: `${Math.max(10, Math.min(90, (player.activeBattle.userScore / (player.activeBattle.userScore + player.activeBattle.oppScore || 1)) * 100))}%`,
                backgroundColor: 'var(--creature-glow)',
                boxShadow: '0 0 12px rgba(var(--creature-glow-rgb), 0.8)',
                transition: 'width 0.4s ease'
              }}
            />
            <div style={{ flex: 1, backgroundColor: 'var(--danger)' }} />
          </div>

          <p style={{ fontSize: '0.78rem', color: 'var(--dim-text)', textAlign: 'center', marginBottom: '18px' }}>
            Complete quests in the Quests tab to surge your battle score before the window closes!
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => concludeBattle(true)}
              className="btn-gold"
              style={{ flex: 1 }}
            >
              Simulate Victory & Claim Loot
            </button>
            <button
              onClick={() => concludeBattle(false)}
              className="btn-pill"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Forfeit Window
            </button>
          </div>
        </div>
      ) : (
        /* Duel Initiation Card */
        <div className="arise-card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '14px' }}>
            Initiate Real-Task Duel
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '18px' }}>
            {/* Format selection */}
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--dim-text)', display: 'block', marginBottom: '6px' }}>
                SELECT DUEL FORMAT
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { id: 'Sprint Duel', desc: 'Single agreed task, first-to-complete wins' },
                  { id: 'Streak Clash', desc: '24h window, highest task_score wins (favors Knight/Summoner)' },
                  { id: 'Category Clash', desc: '24h window, single attribute only (favors Mage)' }
                ].map(fmt => (
                  <div
                    key={fmt.id}
                    onClick={() => setSelectedFormat(fmt.id)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: selectedFormat === fmt.id ? 'var(--accent-glow)' : 'var(--bg-wash)',
                      border: `1px solid ${selectedFormat === fmt.id ? 'var(--accent)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: selectedFormat === fmt.id ? 'var(--accent)' : 'var(--text)' }}>
                      {fmt.id}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--dim-text)', marginTop: '2px' }}>
                      {fmt.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Opponent Selection */}
            <div>
              <label style={{ fontSize: '0.72rem', color: 'var(--dim-text)', display: 'block', marginBottom: '6px' }}>
                CHOOSE CHALLENGER
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {OPPONENTS.map(opp => (
                  <div
                    key={opp.id}
                    onClick={() => setSelectedOpponent(opp)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      backgroundColor: selectedOpponent.id === opp.id ? 'var(--accent-glow)' : 'var(--bg-wash)',
                      border: `1px solid ${selectedOpponent.id === opp.id ? 'var(--accent)' : 'var(--border)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: '700', color: selectedOpponent.id === opp.id ? 'var(--accent)' : 'var(--text)' }}>
                        {opp.name} (Lv {opp.level})
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--dim-text)' }}>
                        {opp.title} • Win Rate {opp.winRate}
                      </div>
                    </div>
                    <span style={{ fontSize: '1.2rem' }}>⚔️</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleStartDuel}
              className="btn-gold"
              style={{ flex: 1.5 }}
            >
              Issue Challenge
            </button>
            <button
              onClick={receiveRandomChallenge}
              className="btn-pill"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Receive Incoming Duel
            </button>
          </div>
        </div>
      )}

      {/* Powers Catalog & Active Charges */}
      <div className="arise-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--text)' }}>Banked Powers</h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--dim-text)' }}>
              Charges earned strictly through real task count (Part 8.5)
            </span>
          </div>
          <div
            style={{
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: 'var(--bg-wash)',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
              fontWeight: '800',
              fontSize: '0.84rem'
            }}
          >
            ⚡ {player.powerCharges} / {player.maxPowerCharges} Charges
          </div>
        </div>

        {player.activePower && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              backgroundColor: 'rgba(var(--creature-glow-rgb), 0.12)',
              border: '1px solid var(--creature-glow)',
              color: 'var(--creature-glow)',
              fontSize: '0.82rem',
              fontWeight: '700',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>✨</span> Active Power Primed: {player.activePower.name} ({player.activePower.multiplier}x Multiplier on next quest)
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {POWERS_CATALOG.map(pow => {
            const canAfford = player.powerCharges >= pow.costCharges;
            const isCurrentClass = pow.classId === player.selectedClass || pow.classId === 'all';
            return (
              <div
                key={pow.id}
                style={{
                  padding: '12px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-wash)',
                  border: '1px solid var(--border)',
                  opacity: isCurrentClass ? 1 : 0.45,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text)' }}>
                      {pow.name}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: '700' }}>
                      {pow.costCharges} ⚡
                    </span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: 'var(--dim-text)', margin: '6px 0 10px', lineHeight: 1.3 }}>
                    {pow.desc}
                  </p>
                </div>

                <button
                  disabled={!canAfford || !isCurrentClass}
                  onClick={() => activatePower(pow)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    backgroundColor: canAfford && isCurrentClass ? 'var(--surface)' : 'var(--bg-wash)',
                    border: `1px solid ${canAfford && isCurrentClass ? 'var(--accent)' : 'var(--border)'}`,
                    color: canAfford && isCurrentClass ? 'var(--accent)' : 'var(--dim-text)',
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    cursor: canAfford && isCurrentClass ? 'pointer' : 'not-allowed'
                  }}
                >
                  {canAfford && isCurrentClass ? 'Channel Power' : 'Need Charges'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visually heavier Boss Gate entry (thicker border, gold edge glow) - Part 5 requirement */}
      <div
        className="arise-card"
        style={{
          padding: '24px',
          border: '3px solid var(--gold)',
          boxShadow: '0 0 26px var(--gold-glow), inset 0 0 16px rgba(224, 182, 74, 0.1)',
          background: 'linear-gradient(135deg, var(--surface) 0%, rgba(224, 182, 74, 0.08) 100%)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>👹</span>
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  color: 'var(--gold)',
                  letterSpacing: '0.08em'
                }}
              >
                BOSS GATE: Monarch of Destruction
              </h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--dim-text)' }}>
                S-Rank Dungeon Gate • Guaranteed Legendary Relic
              </span>
            </div>
          </div>
          <span
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              backgroundColor: 'rgba(224, 182, 74, 0.2)',
              border: '1px solid var(--gold)',
              color: 'var(--gold)',
              fontWeight: '900',
              fontSize: '0.74rem'
            }}
          >
            S-RANK
          </span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text)', marginBottom: '18px', lineHeight: 1.5 }}>
          The Red Gate is open. Complete 5 consecutive Hard-tier quests and maintain an unbroken 7-day streak to vanquish the sovereign and extract deterministic Legendary gear.
        </p>

        <button
          onClick={() => {
            alert('Boss Gate requirements logged! Complete active Hard quests in the Quests tab to break through.');
          }}
          className="btn-gold"
          style={{ width: '100%', padding: '12px 0' }}
        >
          Enter Boss Gate Trial
        </button>
      </div>

      {/* Recent Results with WIN/LOSS/DRAW tags (Part 5 requirement) */}
      <div className="arise-card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', color: 'var(--text)', marginBottom: '14px' }}>
          Recent Battle Chronicles
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {player.recentBattles.map(battle => {
            const isWin = battle.result === 'WIN';
            const isDraw = battle.result === 'DRAW';
            const tagColor = isWin ? 'var(--creature-glow)' : isDraw ? 'var(--gold)' : 'var(--danger)';

            return (
              <div
                key={battle.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-wash)',
                  borderRadius: '8px',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: '900',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      backgroundColor: `${tagColor}22`,
                      color: tagColor,
                      border: `1px solid ${tagColor}`
                    }}
                  >
                    {battle.result}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text)' }}>
                      vs {battle.opponent} ({battle.class})
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--dim-text)' }}>
                      {battle.format} • {battle.date}
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text)' }}>
                  {battle.scoreUser} - {battle.scoreOpp}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

