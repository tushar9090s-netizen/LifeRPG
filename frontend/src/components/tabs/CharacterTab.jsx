import React, { useState } from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { CharacterViewer3D } from '../3d/CharacterViewer3D.jsx';
import { CLASSES, INITIAL_EQUIPMENT_CATALOG } from '../../types/gameData.js';

export const CharacterTab = () => {
  const { player, selectClass, equipItem } = useGame();
  const [selectedSlotForSwap, setSelectedSlotForSwap] = useState(null);

  const currentClassData = CLASSES[player.selectedClass] || CLASSES.knight;
  const currentEquipped = player.equippedByClass[player.selectedClass] || {};

  // Find items for each slot
  const slots = ['head', 'body', 'legs', 'feet'];

  const getEquippedItem = (slot) => {
    const itemId = currentEquipped[slot];
    return INITIAL_EQUIPMENT_CATALOG.find(i => i.id === itemId);
  };

  // Get available inventory items for the selected slot and current class
  const availableItemsForSlot = selectedSlotForSwap
    ? INITIAL_EQUIPMENT_CATALOG.filter(
        item =>
          item.slot === selectedSlotForSwap &&
          (item.classId === player.selectedClass || item.classId === 'all') &&
          player.unlockedItemIds.includes(item.id)
      )
    : [];

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
        maxWidth: '920px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* Header & Class Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.65rem',
              color: 'var(--text)',
              letterSpacing: '0.06em'
            }}
          >
            Character Armory & Attire
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--dim-text)', marginTop: '2px' }}>
            "What am I wearing" — Equipment loadout, cosmetic layers, and base attributes.
          </p>
        </div>

        {/* 5 Classes Select / Respec */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%' }}>
          {Object.values(CLASSES).map(cls => (
            <button
              key={cls.id}
              onClick={() => selectClass(cls.id)}
              className="btn-pill"
              style={{
                borderColor: player.selectedClass === cls.id ? 'var(--accent)' : 'var(--border)',
                backgroundColor: player.selectedClass === cls.id ? 'var(--accent-glow)' : 'var(--surface)',
                color: player.selectedClass === cls.id ? 'var(--text)' : 'var(--dim-text)',
                fontSize: '0.76rem',
                padding: '6px 12px'
              }}
            >
              {cls.name}
            </button>
          ))}
        </div>
      </div>

      {/* Full 3D Model Preview at top (Part 5 requirement) */}
      <div
        className="arise-card"
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <div style={{ width: '100%', maxWidth: '480px', height: '340px' }}>
          <CharacterViewer3D
            classId={player.selectedClass}
            equipped={currentEquipped}
            height={340}
            interactive={true}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.4rem',
              color: 'var(--text)'
            }}
          >
            {currentClassData.name} — {player.subclass}
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--dim-text)', maxWidth: '520px', margin: '4px auto 0' }}>
            {currentClassData.quote}
          </p>
        </div>
      </div>

      {/* 2x2 Equipment Slot Grid (Head/Body/Legs/Feet) beneath it (Part 5 requirement) */}
      <div>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '12px' }}>
          Equipped Gear (2×2 Loadout)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
          {slots.map(slotKey => {
            const item = getEquippedItem(slotKey);
            const rarityColor = item ? getRarityColor(item.rarity) : 'var(--border)';

            return (
              <div
                key={slotKey}
                onClick={() => setSelectedSlotForSwap(slotKey)}
                className="arise-card"
                style={{
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  cursor: 'pointer',
                  border: `1.5px solid ${rarityColor}`,
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--bg-wash)',
                    border: `1px solid ${rarityColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.8rem',
                    boxShadow: item?.rarity === 'Legendary' ? '0 0 12px var(--gold-glow)' : 'none'
                  }}
                >
                  {item?.icon || '❓'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--dim-text)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {slotKey} SLOT
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text)', marginTop: '2px' }}>
                    {item?.name || 'Empty'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: rarityColor, fontWeight: '600', marginTop: '2px' }}>
                    {item?.rarity || 'Common'} • Tap to Swap
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment Swapping Drawer / Modal */}
      {selectedSlotForSwap && (
        <div
          className="arise-card"
          style={{
            padding: '20px',
            border: '2px solid var(--accent)',
            animation: 'overshootSettle 0.3s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--text)' }}>
              Select Gear for {selectedSlotForSwap.toUpperCase()}
            </h4>
            <button onClick={() => setSelectedSlotForSwap(null)} className="btn-pill">
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
            {availableItemsForSlot.map(item => {
              const isEquipped = currentEquipped[selectedSlotForSwap] === item.id;
              const rColor = getRarityColor(item.rarity);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    equipItem(selectedSlotForSwap, item.id);
                    setSelectedSlotForSwap(null);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: isEquipped ? 'var(--accent-glow)' : 'var(--bg-wash)',
                    border: `1px solid ${isEquipped ? 'var(--accent)' : 'var(--border)'}`,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: '700', color: 'var(--text)' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: rColor }}>
                      {item.rarity} {isEquipped && '• (Equipped)'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Plain Stat Readout Below That (Part 5 requirement) */}
      <div className="arise-card" style={{ padding: '22px' }}>
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text)', marginBottom: '14px' }}>
          Attribute Readout
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          <div style={{ padding: '14px', backgroundColor: 'var(--bg-wash)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--attr-str)', fontWeight: '800' }}>STR (Strength)</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '900', color: 'var(--text)', marginTop: '4px' }}>
              {player.stats.str}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--dim-text)' }}>Power, Routine Resilience</span>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-wash)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--attr-int)', fontWeight: '800' }}>INT (Intellect)</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '900', color: 'var(--text)', marginTop: '4px' }}>
              {player.stats.int}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--dim-text)' }}>Focus, Systems Architecture</span>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-wash)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--attr-agi)', fontWeight: '800' }}>AGI (Agility)</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '900', color: 'var(--text)', marginTop: '4px' }}>
              {player.stats.agi}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--dim-text)' }}>Speed, Micro-Habits, Streak</span>
          </div>

          <div style={{ padding: '14px', backgroundColor: 'var(--bg-wash)', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--attr-vit)', fontWeight: '800' }}>VIT (Vitality)</span>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '900', color: 'var(--text)', marginTop: '4px' }}>
              {player.stats.vit}
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--dim-text)' }}>Health, Bio-Recovery, Stamina</span>
          </div>
        </div>
      </div>
    </div>
  );
};

