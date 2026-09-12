import React, { useState } from 'react';
import { useGame } from '../../state/GameContext';
import { CharacterCanvas } from '../home/CharacterCanvas';
import { CLASSES, ATTRIBUTES } from '../../data/classes';

export const CharacterTab = () => {
  const {
    character,
    equipped,
    unequipItem,
    allocateStat,
    switchClass,
    selectSubclass,
    isAscended,
    setProfileModalOpen
  } = useGame();

  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubclassModal, setShowSubclassModal] = useState(false);

  const classData = CLASSES[character.class] || CLASSES.Mage;
  const SLOTS = ['Head', 'Body', 'Legs', 'Feet'];

  const getRarityClass = (rarity) => {
    if (!rarity) return '';
    if (rarity === 'Mythic') return 'halo-mythic';
    if (rarity === 'Legendary') return 'halo-legendary';
    if (rarity === 'Epic') return 'halo-epic';
    return '';
  };

  return (
    <div className="character-tab-view tab-content-enter">
      {/* Header */}
      <div className="char-header-row">
        <div>
          <span className="section-super-tag font-mono">PROGRESSION CHAMBER</span>
          <h2 className="char-screen-title font-display">{character.name}</h2>
          <p className="char-subtitle font-mono">
            {character.title} · {character.class} {character.subclass && `[${character.subclass}]`}
          </p>
        </div>
        <div className="char-top-actions">
          <button className="btn-secondary font-display" onClick={() => setProfileModalOpen(true)}>
            HUNTER DOSSIER
          </button>
          <button className="btn-secondary font-display" onClick={() => setShowClassModal(true)}>
            SWITCH CLASS
          </button>
        </div>
      </div>

      {/* 1. Large 3D Character Preview Area (§21) */}
      <div className={`character-stage-card card-base ${isAscended ? 'ascended-glow' : ''}`}>
        {isAscended && (
          <div className="ascended-state-banner font-display">
            ✧ ASCENDED SOVEREIGN FORM ACTIVE ✧
          </div>
        )}

        <div className="stage-canvas-box">
          <CharacterCanvas size={250} />
        </div>

        <div className="hunter-stats-chips font-mono">
          <span className="chip">LEVEL {character.level}</span>
          <span className="chip">STREAK {character.streak} DAYS</span>
          <span className="chip perk-chip">PASSIVE: {classData.passivePerk.name}</span>
        </div>
      </div>

      {/* 2. 2×2 Equipment Slots Grid (§21) */}
      <div className="equipment-grid-section">
        <div className="section-label-row">
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--dim-text-color)' }}>
            EQUIPMENT SLOTS (4 SLOTS)
          </span>
          <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--gold-color)' }}>
            KEYED PER CLASS · PRESERVED
          </span>
        </div>

        <div className="equipment-2x2-grid">
          {SLOTS.map((slot) => {
            const item = equipped[slot];
            const halo = item ? getRarityClass(item.rarity) : '';

            return (
              <div
                key={slot}
                className={`equipment-slot-frame card-base ${item ? 'equipped' : 'empty'} ${halo}`}
              >
                <div className="slot-type-header font-mono">{slot.toUpperCase()}</div>

                {item ? (
                  <div className="equipped-item-details">
                    <div className="item-icon-stage">{item.icon || '🛡️'}</div>
                    <div className="item-name-text font-display">{item.name}</div>
                    <div
                      className="item-rarity-badge font-mono"
                      style={{
                        color:
                          item.rarity === 'Mythic'
                            ? 'var(--rarity-mythic)'
                            : item.rarity === 'Legendary'
                            ? 'var(--gold-color)'
                            : item.rarity === 'Epic'
                            ? 'var(--rarity-epic)'
                            : item.rarity === 'Rare'
                            ? 'var(--rarity-rare)'
                            : 'var(--dim-text-color)'
                      }}
                    >
                      {item.rarity}
                    </div>
                    <button
                      className="btn-unequip font-mono"
                      onClick={() => unequipItem(slot)}
                    >
                      Unequip
                    </button>
                  </div>
                ) : (
                  <div className="empty-slot-content">
                    <span className="empty-rune-glyph">ᛟ</span>
                    <span className="empty-slot-label font-mono">EMPTY {slot.toUpperCase()}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Plain Stat Readout Beneath (§21 utilitarian) */}
      <div className="attributes-management-card card-base">
        <div className="attr-header-row">
          <div>
            <h3 className="attr-title font-display">ATTRIBUTES</h3>
            <span className="attr-sub font-mono">Real-world categorized directives power stat growth.</span>
          </div>
          {character.stats.unspent_points > 0 && (
            <div className="unspent-badge font-mono">
              +{character.stats.unspent_points} STAT POINTS AVAILABLE
            </div>
          )}
        </div>

        <div className="attributes-rows-stack">
          {Object.entries(ATTRIBUTES).map(([k, attr]) => {
            const val = character.stats[k] || 10;
            const isAffinity = classData.primaryStats.includes(k);

            return (
              <div key={k} className="attr-data-row">
                <div className="attr-data-left">
                  <span
                    className="attr-icon-box"
                    style={{ backgroundColor: attr.bg, color: attr.color }}
                  >
                    {attr.icon}
                  </span>
                  <div>
                    <div className="attr-title-line font-display">
                      <span>{attr.name} ({k})</span>
                      {isAffinity && <span className="affinity-pill font-mono">AFFINITY</span>}
                    </div>
                    <div className="attr-desc-line font-sans">{attr.desc}</div>
                  </div>
                </div>

                <div className="attr-data-right">
                  <span className="attr-numeric-val font-mono">{val}</span>
                  {character.stats.unspent_points > 0 && (
                    <button
                      className="btn-allocate-plus"
                      onClick={() => allocateStat(k)}
                      title={`Allocate 1 point to ${k}`}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Subclass Specialization Section (§9) */}
      <div className="subclass-management-card card-base">
        <div className="subclass-top">
          <div>
            <h3 className="subclass-heading font-display">
              SUBCLASS SPECIALIZATION {character.level < 10 && '(LOCKED UNTIL LVL 10)'}
            </h3>
            <p className="subclass-sub font-sans">
              "Branch into 2 subclasses per class, each refining how the passive perk pays off."
            </p>
          </div>
          {character.level >= 10 && (
            <button
              className="btn-primary font-display"
              onClick={() => setShowSubclassModal(true)}
            >
              {character.subclass ? 'SWITCH SUBCLASS' : 'CHOOSE SUBCLASS'}
            </button>
          )}
        </div>

        {character.subclass ? (
          <div className="subclass-active-box">
            <span className="subclass-tag font-mono">ACTIVE SUBCLASS: {character.subclass.toUpperCase()}</span>
            <p className="subclass-text font-sans">
              {classData.subclasses[character.subclass]?.description}
            </p>
            <div className="subclass-power-text font-display">
              Signature Power: {classData.subclasses[character.subclass]?.signaturePower}
            </div>
          </div>
        ) : (
          <div className="subclass-hint font-mono">
            Advance to Level 10 to unlock your dual subclass path.
          </div>
        )}
      </div>

      {/* Class Modal */}
      {showClassModal && (
        <div className="scrim-overlay" onClick={() => setShowClassModal(false)}>
          <div className="modal-enter card-base selection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-display">SELECT CLASS</h3>
              <button className="close-btn" onClick={() => setShowClassModal(false)}>×</button>
            </div>
            <div className="selection-list-stack">
              {Object.values(CLASSES).map((cls) => (
                <div
                  key={cls.id}
                  className={`class-item-card ${character.class === cls.id ? 'active' : ''}`}
                  onClick={() => {
                    switchClass(cls.id);
                    setShowClassModal(false);
                  }}
                >
                  <div className="class-item-top">
                    <span className="class-badge-emoji">{cls.badge}</span>
                    <div>
                      <div className="class-item-name font-display">{cls.name}</div>
                      <div className="class-item-tagline font-sans">{cls.tagline}</div>
                    </div>
                  </div>
                  <div className="class-item-perk font-sans">
                    <strong>{cls.passivePerk.name}:</strong> {cls.passivePerk.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Subclass Modal */}
      {showSubclassModal && (
        <div className="scrim-overlay" onClick={() => setShowSubclassModal(false)}>
          <div className="modal-enter card-base selection-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title font-display">AWAKEN SUBCLASS</h3>
              <button className="close-btn" onClick={() => setShowSubclassModal(false)}>×</button>
            </div>
            <div className="subclasses-grid">
              {Object.values(classData.subclasses).map((sub) => (
                <div
                  key={sub.id}
                  className={`subclass-option-card ${character.subclass === sub.id ? 'active' : ''}`}
                  onClick={() => {
                    selectSubclass(sub.id);
                    setShowSubclassModal(false);
                  }}
                >
                  <h4 className="sub-name font-display">{sub.name}</h4>
                  <p className="sub-desc font-sans">{sub.description}</p>
                  <div className="sub-power font-mono">POWER: {sub.signaturePower}</div>
                  <button className="btn-primary font-display" style={{ width: '100%', marginTop: '0.85rem' }}>
                    AWAKEN AS {sub.name.toUpperCase()}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .character-tab-view {
          padding: 1.5rem 1.5rem 3.5rem 1.5rem;
          max-width: 820px;
          margin: 0 auto;
          width: 100%;
        }

        .char-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .char-screen-title {
          font-size: 1.8rem;
          font-weight: 900;
          color: var(--text-color);
          letter-spacing: 0.06em;
          line-height: 1.1;
        }

        .char-subtitle {
          font-size: 0.76rem;
          color: var(--gold-color);
          margin-top: 2px;
        }

        .char-top-actions {
          display: flex;
          gap: 0.5rem;
        }

        /* Character Stage Preview Area (§21) */
        .character-stage-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 1rem 1.25rem 1rem;
          margin-bottom: 2rem;
          background: radial-gradient(circle, var(--surface-color-elevated) 0%, var(--surface-color) 75%);
        }

        .ascended-glow {
          box-shadow: 0 0 35px var(--gold-glow), inset 0 0 20px var(--gold-glow) !important;
          border-color: var(--gold-color) !important;
        }

        .ascended-state-banner {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--gold-color);
          letter-spacing: 0.12em;
          text-shadow: 0 0 10px var(--gold-glow);
          margin-bottom: 0.75rem;
        }

        .stage-canvas-box {
          margin-bottom: 1rem;
        }

        .hunter-stats-chips {
          display: flex;
          gap: 0.65rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .hunter-stats-chips .chip {
          font-size: 0.72rem;
          background: var(--surface-color-subtle);
          border: 1px solid var(--border-color);
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-full);
          color: var(--dim-text-color);
        }

        .perk-chip {
          color: var(--accent-color) !important;
          border-color: var(--accent-color) !important;
        }

        /* 2x2 Equipment Grid (§21) */
        .equipment-grid-section {
          margin-bottom: 2.5rem;
        }

        .section-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.85rem;
        }

        .equipment-2x2-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.1rem;
        }

        .equipment-slot-frame {
          min-height: 140px;
          padding: 1.1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .equipment-slot-frame.empty {
          border: 1px dashed var(--border-color);
          opacity: 0.6;
        }

        .slot-type-header {
          position: absolute;
          top: 10px;
          left: 12px;
          font-size: 0.65rem;
          color: var(--dim-text-color);
        }

        .equipped-item-details {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-top: 0.35rem;
        }

        .item-icon-stage {
          font-size: 2.2rem;
        }

        .item-name-text {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--gold-color);
          margin-top: 0.25rem;
        }

        .item-rarity-badge {
          font-size: 0.7rem;
          font-weight: 700;
        }

        .btn-unequip {
          background: none;
          border: none;
          color: var(--dim-text-color);
          font-size: 0.7rem;
          cursor: pointer;
          margin-top: 0.4rem;
          text-decoration: underline;
        }

        .btn-unequip:hover {
          color: var(--danger-color);
        }

        .empty-slot-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .empty-rune-glyph {
          font-size: 1.8rem;
          color: var(--dim-text-color);
        }

        .empty-slot-label {
          font-size: 0.7rem;
          color: var(--dim-text-color);
        }

        /* Attributes Management Card */
        .attributes-management-card {
          padding: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .attr-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .attr-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--text-color);
        }

        .attr-sub {
          font-size: 0.74rem;
          color: var(--dim-text-color);
        }

        .unspent-badge {
          font-size: 0.72rem;
          color: var(--gold-color);
          border: 1px solid var(--gold-dim);
          background: rgba(224, 182, 74, 0.12);
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full);
        }

        .attributes-rows-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .attr-data-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--surface-color-elevated);
          border: 1px solid var(--border-color-subtle);
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm);
        }

        .attr-data-left {
          display: flex;
          align-items: center;
          gap: 0.85rem;
        }

        .attr-icon-box {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
        }

        .attr-title-line {
          font-size: 0.88rem;
          font-weight: 800;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .affinity-pill {
          font-size: 0.62rem;
          color: var(--gold-color);
          background: rgba(224, 182, 74, 0.12);
          padding: 0.1rem 0.4rem;
          border-radius: 2px;
        }

        .attr-desc-line {
          font-size: 0.75rem;
          color: var(--dim-text-color);
        }

        .attr-data-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .attr-numeric-val {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-color);
        }

        .btn-allocate-plus {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--gold-color);
          color: #0c0b14;
          border: none;
          font-size: 1.1rem;
          font-weight: 900;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .btn-allocate-plus:hover {
          transform: scale(1.1);
        }

        /* Subclass Management */
        .subclass-management-card {
          padding: 1.5rem;
        }

        .subclass-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .subclass-heading {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--text-color);
        }

        .subclass-active-box {
          background: var(--surface-color-elevated);
          padding: 1.25rem;
          border-radius: var(--radius-sm);
          border: 1px solid var(--accent-color);
        }

        .subclass-tag {
          font-size: 0.75rem;
          color: var(--accent-color);
          display: block;
          margin-bottom: 0.25rem;
        }

        .subclass-text {
          font-size: 0.85rem;
          color: var(--text-color);
          line-height: 1.4;
        }

        .subclass-power-text {
          font-size: 0.8rem;
          color: var(--gold-color);
          margin-top: 0.5rem;
        }

        .subclass-hint {
          font-size: 0.82rem;
          color: var(--dim-text-color);
        }

        /* Modals */
        .selection-modal {
          max-width: 540px;
          width: 100%;
          padding: 2rem;
        }

        .selection-list-stack {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .class-item-card {
          background: var(--surface-color-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 0.85rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .class-item-card:hover {
          border-color: var(--accent-color);
        }

        .class-item-card.active {
          border-color: var(--gold-color);
          box-shadow: 0 0 12px var(--gold-glow);
        }

        .class-item-top {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .class-badge-emoji {
          font-size: 1.6rem;
        }

        .class-item-name {
          font-size: 1rem;
          font-weight: 800;
          color: var(--text-color);
        }

        .class-item-tagline {
          font-size: 0.76rem;
          color: var(--dim-text-color);
        }

        .class-item-perk {
          font-size: 0.78rem;
          color: var(--text-color);
          margin-top: 0.35rem;
        }

        .subclasses-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.85rem;
        }

        .subclass-option-card {
          background: var(--surface-color-elevated);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 1.1rem;
          cursor: pointer;
        }

        .subclass-option-card:hover {
          border-color: var(--gold-color);
        }

        .sub-name {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--gold-color);
        }

        .sub-desc {
          font-size: 0.8rem;
          color: var(--text-color);
          line-height: 1.35;
          margin-top: 0.35rem;
        }

        .sub-power {
          font-size: 0.72rem;
          color: var(--accent-color);
          margin-top: 0.5rem;
        }

        @media (max-width: 600px) {
          .equipment-2x2-grid,
          .subclasses-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

