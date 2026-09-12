import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * GuardianModelLoader — Production GLB/GLTF Guardian Orbit Pipeline
 */
export class GuardianModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
    this.model = null;
    this.mixer = null;
    this.isLoaded = false;
    this.orbitAngle = 0;
    this.group = new THREE.Group();
  }

  load(onLoaded) {
    const candidates = [
      '/models/guardians/guardian.glb',
      '/models/guardians/dragon.glb',
      '/models/guardians/guardian.gltf',
    ];

    let idx = 0;
    const tryNext = () => {
      if (idx >= candidates.length) {
        this.isLoaded = false;
        return;
      }
      const path = candidates[idx++];
      this.loader.load(
        path,
        (gltf) => {
          this.model = gltf.scene;
          this.model.scale.set(0.85, 0.85, 0.85);
          this.group.add(this.model);
          this.isLoaded = true;

          if (gltf.animations && gltf.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(this.model);
            const action = this.mixer.clipAction(gltf.animations[0]);
            action.play();
          }

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

  update(delta) {
    if (this.mixer) {
      this.mixer.update(delta);
    }

    // 16-second continuous 3D elliptical orbit
    const orbitSpeed = (Math.PI * 2) / 16.0;
    this.orbitAngle += delta * orbitSpeed;

    const radiusX = 3.4;
    const radiusZ = 2.2;
    const gx = Math.cos(this.orbitAngle) * radiusX;
    const gz = Math.sin(this.orbitAngle) * radiusZ;
    const gy = 1.35 + Math.sin(this.orbitAngle * 2.0) * 0.35;

    this.group.position.set(gx, gy, gz);

    // Tangent orientation (face forward in direction of motion)
    const tangentX = -Math.sin(this.orbitAngle) * radiusX;
    const tangentZ = Math.cos(this.orbitAngle) * radiusZ;
    this.group.rotation.y = Math.atan2(tangentX, tangentZ);

    // Banking angle into curves
    this.group.rotation.z = Math.sin(this.orbitAngle) * 0.25;
  }
}

