/**
 * EquipmentManager — Manages RPG modular equipment slots on 3D Character Model
 * Supported Slots: HEAD, BODY, LEGS, FEET
 */

export const EQUIPMENT_SLOTS = {
  HEAD: 'Head',
  BODY: 'Body',
  LEGS: 'Legs',
  FEET: 'Feet',
};

export class EquipmentManager {
  constructor(characterModel) {
    this.model = characterModel;
    this.equipped = {
      [EQUIPMENT_SLOTS.HEAD]: null,
      [EQUIPMENT_SLOTS.BODY]: null,
      [EQUIPMENT_SLOTS.LEGS]: null,
      [EQUIPMENT_SLOTS.FEET]: null,
    };
  }

  /**
   * Attach an item model to a specific bone or replace a modular submesh
   */
  equip(slot, itemMesh, targetBoneName = null) {
    if (!this.equipped.hasOwnProperty(slot)) return;

    // Remove existing equipment in slot
    this.unequip(slot);

    this.equipped[slot] = itemMesh;

    if (this.model && itemMesh) {
      if (targetBoneName) {
        const bone = this.model.getObjectByName(targetBoneName);
        if (bone) {
          bone.add(itemMesh);
          return;
        }
      }
      this.model.add(itemMesh);
    }
  }

  unequip(slot) {
    const item = this.equipped[slot];
    if (item && item.parent) {
      item.parent.remove(item);
    }
    this.equipped[slot] = null;
  }

  getEquipped(slot) {
    return this.equipped[slot];
  }
}

