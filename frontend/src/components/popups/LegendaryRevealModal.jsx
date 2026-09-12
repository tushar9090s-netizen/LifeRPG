import React from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { CLASSES } from '../../types/gameData.js';

export const LegendaryRevealModal = ({ data, onDismiss }) => {
  const { equipItem, theme } = useGame();
  const item = data.item;
  const className = CLASSES[item.classId]?.name || 'All Classes';

  const handleEquip = () => {
    equipItem(item.slot, item.id);
    onDismiss();
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '90%',
        maxWidth: '430px',
        backgroundColor: 'var(--surface)',
        border: '2px solid var(--creature-glow)',
        borderRadius: '16px',
        padding: '38px 24px',
        textAlign: 'center',
        boxShadow: '0 16px 48px rgba(0,0,0,0.85), 0 0 35px rgba(var(--creature-glow-rgb), 0.5)',
        animation: 'overshootSettle 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        overflow: 'hidden'
      }}
    >
      {/* Creature's glow burst (emerald / icy-cyan) rather than gold (Part 6 requirement) */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(var(--creature-glow-rgb), 0.35) 0%, transparent 60%)',
          animation: 'creatureAuraPulse 2.8s infinite ease-in-out',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '12px',
            backgroundColor: 'rgba(var(--creature-glow-rgb), 0.15)',
            border: '1px solid var(--creature-glow)',
            color: 'var(--creature-glow)',
            fontSize: '0.72rem',
            letterSpacing: '0.1em',
            fontWeight: '700',
            textTransform: 'uppercase',
            marginBottom: '14px'
          }}
        >
          {item.rarity} Relic Discovered
        </div>

        <div style={{ fontSize: '3rem', margin: '8px 0 16px' }}>{item.icon}</div>

        {/* Item name in a glowing gold treatment */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            color: 'var(--gold)',
            textShadow: '0 0 14px var(--gold-glow)',
            letterSpacing: '0.06em',
            marginBottom: '8px'
          }}
        >
          {item.name}
        </h2>

        {/* Slot + class-exclusivity noted beneath */}
        <p
          style={{
            fontSize: '0.84rem',
            color: 'var(--dim-text)',
            marginBottom: '26px'
          }}
        >
          Slot: <span style={{ color: 'var(--text)', fontWeight: '600' }}>{item.slot.toUpperCase()}</span> • Class: <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{className}</span> Exclusive
        </p>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onDismiss}
            className="btn-pill"
            style={{ flex: 1, justifyContent: 'center' }}
          >
            Vault to Bag
          </button>
          {/* Confirm button reads "Equip" (Part 6 requirement) */}
          <button
            onClick={handleEquip}
            className="btn-gold"
            style={{ flex: 1.4 }}
          >
            Equip
          </button>
        </div>
      </div>
    </div>
  );
};

