import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { IconGold } from '../common/Icons';

export const ShopTab = () => {
  const { shopItems, character, buyShopItem, inventory, equipItem, equipped } = useGame();
  const [activeSubTab, setActiveSubTab] = useState('ARMORY'); // 'ARMORY' or 'VAULT'
  const [slotFilter, setSlotFilter] = useState('ALL');
  const [alertNotice, setAlertNotice] = useState(null);

  const SLOTS = ['ALL', 'Head', 'Body', 'Legs', 'Feet'];

  const filteredItems = shopItems.filter((item) => {
    const matchSlot = slotFilter === 'ALL' || item.slot === slotFilter;
    const matchClass = item.class === 'All' || item.class === character.class;
    return matchSlot && matchClass;
  });

  const handleAcquire = (item) => {
    const success = buyShopItem(item);
    if (success) {
      setAlertNotice(`Acquired ${item.name}! Added to your personal Armory Vault.`);
      setTimeout(() => setAlertNotice(null), 3000);
    } else {
      alert(`Insufficient Gold! You need ${item.price.toLocaleString()} Gold.`);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Mythic': return 'var(--rarity-mythic)';
      case 'Legendary': return 'var(--gold-color)';
      case 'Epic': return 'var(--rarity-epic)';
      case 'Rare': return 'var(--rarity-rare)';
      case 'Uncommon': return 'var(--rarity-uncommon)';
      default: return 'var(--rarity-common)';
    }
  };

  return (
    <div className="shop-tab-view tab-content-enter">
      {/* Header (§27) */}
      <div className="armory-header-row">
        <div>
          <span className="section-super-tag font-mono">COSMETIC ARMORY</span>
          <h2 className="armory-screen-title font-display">ARMORY</h2>
          <p className="armory-subtitle font-mono">COSMETICS ONLY · PURE CURRENCY SINK</p>
        </div>
        <div className="gold-balance-badge font-mono">
          <IconGold size={16} />
          <span>{character.gold.toLocaleString()} GOLD</span>
        </div>
      </div>

      {/* Armory vs Vault Sub-Navigation */}
      <div className="armory-subnav-strip">
        <button
          className={`subnav-btn font-mono ${activeSubTab === 'ARMORY' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('ARMORY')}
        >
          [ STOREFRONT ]
        </button>
        <button
          className={`subnav-btn font-mono ${activeSubTab === 'VAULT' ? 'active' : ''}`}
          onClick={() => setActiveSubTab('VAULT')}
        >
          [ WARDROBE VAULT ({inventory.length}) ]
        </button>
      </div>

      {alertNotice && (
        <div className="armory-alert-toast font-mono">
          ✓ {alertNotice}
        </div>
      )}

      {/* Slot Filters */}
      <div className="armory-filters-row">
        {SLOTS.map((slot) => (
          <button
            key={slot}
            className={`slot-pill font-mono ${slotFilter === slot ? 'active' : ''}`}
            onClick={() => setSlotFilter(slot)}
          >
            {slot.toUpperCase()}
          </button>
        ))}
      </div>

      {/* STOREFRONT VIEW (§27 straightforward and restrained) */}
      {activeSubTab === 'ARMORY' && (
        <div className="armory-cards-grid">
          {filteredItems.map((item) => {
            const canAfford = character.gold >= item.price;
            const alreadyOwned = inventory.some((inv) => inv.name === item.name);

            return (
              <div key={item.id} className="armory-card card-base">
                <div className="armory-card-header">
                  <span
                    className="item-rarity-pill font-mono"
                    style={{ color: getRarityColor(item.rarity) }}
                  >
                    {item.rarity.toUpperCase()} · {item.slot.toUpperCase()}
                  </span>
                  <span className="item-slot-icon">{item.icon}</span>
                </div>

                <h4 className="item-title font-display">{item.name}</h4>
                <p className="item-description font-sans">{item.description}</p>

                <div className="armory-card-footer">
                  <div className="item-price font-display">
                    <IconGold size={14} />
                    <span>{item.price.toLocaleString()} GOLD</span>
                  </div>

                  {alreadyOwned ? (
                    <button className="btn-secondary font-mono acquire-btn" disabled>
                      OWNED
                    </button>
                  ) : (
                    <button
                      className={`acquire-btn font-display ${canAfford ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => handleAcquire(item)}
                      disabled={!canAfford}
                    >
                      {canAfford ? '[ ACQUIRE ]' : 'NEED GOLD'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* WARDROBE VAULT VIEW */}
      {activeSubTab === 'VAULT' && (
        <div className="armory-cards-grid">
          {inventory
            .filter((item) => slotFilter === 'ALL' || item.slot === slotFilter)
            .map((item) => {
              const isEquipped = equipped[item.slot]?.name === item.name;

              return (
                <div key={item.id} className="armory-card card-base">
                  <div className="armory-card-header">
                    <span
                      className="item-rarity-pill font-mono"
                      style={{ color: getRarityColor(item.rarity) }}
                    >
                      {item.rarity.toUpperCase()} · {item.slot.toUpperCase()}
                    </span>
                    <span className="item-slot-icon">{item.icon || '🛡️'}</span>
                  </div>

                  <h4 className="item-title font-display">{item.name}</h4>
                  <p className="item-description font-sans">
                    {item.description || 'Personal cosmetic artifact stored in hunter inventory.'}
                  </p>

                  <div className="armory-card-footer">
                    <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--dim-text-color)' }}>
                      {isEquipped ? 'EQUIPPED IN LOADOUT' : 'STORED IN VAULT'}
                    </span>

                    {isEquipped ? (
                      <button className="btn-secondary font-mono acquire-btn" disabled>
                        IN USE
                      </button>
                    ) : (
                      <button
                        className="btn-primary font-display acquire-btn"
                        onClick={() => equipItem(item)}
                      >
                        EQUIP
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          {inventory.length === 0 && (
            <div className="empty-state-box card-base" style={{ gridColumn: '1 / -1' }}>
              <div className="empty-title font-display">THE ARMORY IS EMPTY.</div>
              <div className="empty-msg font-mono">Return after earning more Gold or conquering Boss Gates.</div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .shop-tab-view {
          padding: 1.5rem 1.5rem 3.5rem 1.5rem;
          max-width: 820px;
          margin: 0 auto;
          width: 100%;
        }

        .armory-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .armory-screen-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--text-color);
          letter-spacing: 0.06em;
          line-height: 1.1;
        }

        .armory-subtitle {
          font-size: 0.72rem;
          color: var(--dim-text-color);
          margin-top: 2px;
        }

        .gold-balance-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--gold-color);
          background: rgba(224, 182, 74, 0.1);
          border: 1px solid var(--gold-dim);
          padding: 0.35rem 0.85rem;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 800;
        }

        .armory-subnav-strip {
          display: flex;
          gap: 1rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1.25rem;
        }

        .subnav-btn {
          background: none;
          border: none;
          color: var(--dim-text-color);
          font-size: 0.75rem;
          padding: 0.5rem 0.25rem;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }

        .subnav-btn.active {
          color: var(--gold-color);
        }

        .subnav-btn.active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gold-color);
        }

        .armory-alert-toast {
          background: rgba(53, 227, 160, 0.12);
          border: 1px solid var(--creature-glow);
          color: var(--creature-glow);
          padding: 0.6rem 1rem;
          border-radius: var(--radius-sm);
          font-size: 0.78rem;
          margin-bottom: 1rem;
        }

        .armory-filters-row {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
        }

        .slot-pill {
          background: var(--surface-color);
          border: 1px solid var(--border-color);
          color: var(--dim-text-color);
          font-size: 0.7rem;
          padding: 0.3rem 0.8rem;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .slot-pill:hover {
          color: var(--text-color);
          border-color: var(--accent-color);
        }

        .slot-pill.active {
          border-color: var(--gold-color);
          color: var(--gold-color);
          background: rgba(224, 182, 74, 0.1);
        }

        /* Straightforward Card Layout (§27 least ornamented) */
        .armory-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1.1rem;
        }

        .armory-card {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 185px;
        }

        .armory-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .item-rarity-pill {
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.06em;
        }

        .item-slot-icon {
          font-size: 1.6rem;
        }

        .item-title {
          font-size: 0.98rem;
          font-weight: 800;
          color: var(--text-color);
          margin-bottom: 0.35rem;
        }

        .item-description {
          font-size: 0.78rem;
          color: var(--dim-text-color);
          line-height: 1.35;
          margin-bottom: 1rem;
          flex-grow: 1;
        }

        .armory-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-color-subtle);
          padding-top: 0.75rem;
          margin-top: auto;
        }

        .item-price {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--gold-color);
          font-size: 0.78rem;
          font-weight: 800;
        }

        .acquire-btn {
          font-size: 0.72rem;
          padding: 0.4rem 0.85rem;
        }
      `}</style>
    </div>
  );
};

