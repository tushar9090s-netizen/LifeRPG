import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EquipmentManager } from './EquipmentManager';

/**
 * CharacterModelLoader — Production GLB/GLTF Character Pipeline
 * 
 * Pipeline:
 * 1. Checks class-specific model: /models/characters/${className.toLowerCase()}.glb
 * 2. Fallback to generic player model: /models/characters/player.glb
 * 3. Inspects and registers animation clips (Idle, Breathing, etc.)
 * 4. Centers model at ground origin (0, 0, 0)
 * 5. Attaches EquipmentManager for Head, Body, Legs, Feet slots
 */
export class CharacterModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
    this.model = null;
    this.mixer = null;
    this.animations = {};
    this.activeAction = null;
    this.equipmentManager = null;
    this.isLoaded = false;
    this.loadError = null;
  }

  load(className = 'Mage', onLoaded, onError) {
    const candidates = [
      `/models/characters/${className.toLowerCase()}.glb`,
      `/models/characters/player.glb`,
      `/models/characters/${className.toLowerCase()}.gltf`,
      `/models/characters/player.gltf`,
    ];

    let currentIdx = 0;

    const tryNext = () => {
      if (currentIdx >= candidates.length) {
        this.isLoaded = false;
        this.loadError = 'NO_MODEL_FOUND';
        if (onError) onError('No 3D character GLB/GLTF file found in /public/models/characters/');
        return;
      }

      const path = candidates[currentIdx++];
      this.loader.load(
        path,
        (gltf) => {
          this.setupModel(gltf, path);
          if (onLoaded) onLoaded(this);
        },
        undefined,
        () => {
          tryNext();
        }
      );
    };

    tryNext();
  }

  setupModel(gltf, loadedPath) {
    this.model = gltf.scene;
    this.model.name = 'PlayerCharacter';
    this.loadedPath = loadedPath;
    this.isLoaded = true;
    this.loadError = null;

    // Enable shadows and configure materials
    this.model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.side = THREE.FrontSide;
        }
      }
    });

    // Center model at origin with feet at y = 0
    const box = new THREE.Box3().setFromObject(this.model);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Normalize height to approx 2.0 units if needed
    if (size.y > 0) {
      const targetHeight = 1.95;
      const scale = targetHeight / size.y;
      this.model.scale.set(scale, scale, scale);
    }

    // Re-calculate after scaling
    const finalBox = new THREE.Box3().setFromObject(this.model);
    const center = new THREE.Vector3();
    finalBox.getCenter(center);
    this.model.position.x = -center.x;
    this.model.position.z = -center.z;
    this.model.position.y = -finalBox.min.y;

    // Animation Clips
    if (gltf.animations && gltf.animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.model);
      gltf.animations.forEach((clip) => {
        this.animations[clip.name.toLowerCase()] = this.mixer.clipAction(clip);
      });

      // Find Idle animation
      const idleClip =
        this.animations['idle'] ||
        this.animations['idle_standing'] ||
        this.animations['breathing'] ||
        this.animations[Object.keys(this.animations)[0]];

      if (idleClip) {
        this.activeAction = idleClip;
        this.activeAction.play();
      }
    }

    // Initialize Equipment Manager
    this.equipmentManager = new EquipmentManager(this.model);
  }

  update(delta) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  playAnimation(name, fadeDuration = 0.3) {
    const nextAction = this.animations[name.toLowerCase()];
    if (!nextAction || nextAction === this.activeAction) return;

    if (this.activeAction) {
      this.activeAction.fadeOut(fadeDuration);
    }
    nextAction.reset().fadeIn(fadeDuration).play();
    this.activeAction = nextAction;
  }
}

