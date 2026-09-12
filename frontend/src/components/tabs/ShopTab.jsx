import React from 'react';
import { useGame } from '../../state/GameContext.jsx';
import { INITIAL_EQUIPMENT_CATALOG, CLASSES } from '../../types/gameData.js';

export const ShopTab = () => {
  const { player, purchaseItem } = useGame();

  // Shop contains purchasable items with price > 0
  const shopItems = INITIAL_EQUIPMENT_CATALOG.filter(item => item.price > 0);

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
      {/* Header (Deliberately least ornamented tab - Part 5 requirement) */}
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
            Cosmetic Bazaar & Relics
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--dim-text)', marginTop: '2px' }}>
            Pure cosmetic prestige. Earned gold only. Never pay-to-win, stats never altered.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '16px',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)'
          }}
        >
          <span style={{ color: 'var(--gold)', fontWeight: '800' }}>🪙 {player.gold.toLocaleString()} Gold</span>
        </div>
      </div>

      {/* Grid of plain cards with rarity label and gold price button */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {shopItems.map(item => {
          const isOwned = player.unlockedItemIds.includes(item.id);
          const canAfford = player.gold >= item.price;
          const rarityColor = getRarityColor(item.rarity);
          const className = CLASSES[item.classId]?.name || 'All Classes';

          return (
            <div
              key={item.id}
              className="arise-card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: '1px solid var(--border)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '2.4rem' }}>{item.icon}</span>
                  {/* Rarity label */}
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: `${rarityColor}22`,
                      color: rarityColor,
                      border: `1px solid ${rarityColor}`
                    }}
                  >
                    {item.rarity}
                  </span>
                </div>

                <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text)', marginBottom: '4px' }}>
                  {item.name}
                </h3>

                <div style={{ fontSize: '0.74rem', color: 'var(--dim-text)', marginBottom: '16px' }}>
                  Slot: <strong style={{ color: 'var(--text)' }}>{item.slot.toUpperCase()}</strong> • {className}
                </div>
              </div>

              {/* Gold price button (Part 5 requirement) */}
              {isOwned ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '8px',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-wash)',
                    color: 'var(--dim-text)',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  ✓ Acquired in Vault
                </div>
              ) : (
                <button
                  disabled={!canAfford}
                  onClick={() => purchaseItem(item)}
                  className="btn-gold"
                  style={{
                    width: '100%',
                    opacity: canAfford ? 1 : 0.5,
                    cursor: canAfford ? 'pointer' : 'not-allowed'
                  }}
                >
                  🪙 {item.price.toLocaleString()} Gold
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

