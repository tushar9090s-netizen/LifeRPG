import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useGame } from '../../state/GameContext';
import { CharacterModelLoader } from '../character/CharacterModelLoader';
import { GuardianModelLoader } from '../character/GuardianModelLoader';

/**
 * CharacterScene — Production WebGL 3D Showcase for Solo Leveling / ARISE
 * 
 * Strict Architecture:
 * - Real Three.js WebGL rendering with OrbitControls (drag to rotate, scroll to zoom, reset view)
 * - 3D Environment: Obsidian reflective floor, gothic pillars, atmospheric fog, floating mana motes
 * - Elevated Rune Dais with dynamic 360° holographic XP energy ring
 * - Pure GLTF Character Pipeline (CharacterModelLoader):
 *   Loads real full-body human GLB/GLTF assets from /models/characters/
 *   NEVER procedurally builds geometric stick figures or mannequins!
 * - Professional System Loading State when model asset is required
 * - Pure GLTF Guardian Pipeline (GuardianModelLoader):
 *   Continuous 16s elliptical orbit, tangent orientation, ready for real guardian GLB
 */
export const CharacterScene = ({ xpPct = 65, isQuestFulfilling = false }) => {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const cameraRef = useRef(null);
  const { character, theme } = useGame();
  const isShadow = theme === 'shadow';

  const [modelStatus, setModelStatus] = useState('CHECKING'); // 'CHECKING' | 'LOADED' | 'REQUIRED'
  const [modelPath, setModelPath] = useState('');

  // Reset Camera View Handler
  const handleResetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 1.45, 5.6);
      controlsRef.current.target.set(0, 1.25, 0);
      controlsRef.current.update();
    }
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── 1. SCENE & CAMERA ──
    const scene = new THREE.Scene();
    const bgColor = isShadow ? new THREE.Color(0x05060b) : new THREE.Color(0xf5f0e4);
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(isShadow ? 0x070912 : 0xede4d2, 0.048);

    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.45, 5.6);
    cameraRef.current = camera;

    // ── 2. RENDERER ──
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isShadow ? 1.15 : 1.0;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    // ── 3. ORBIT CONTROLS ──
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 1.25, 0);
    controls.minDistance = 2.4;
    controls.maxDistance = 8.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // Prevent going below floor
    controlsRef.current = controls;

    // ── 4. LIGHTING ──
    const ambientLight = new THREE.AmbientLight(
      isShadow ? 0x1a2035 : 0xf0e6d2,
      isShadow ? 0.9 : 1.2
    );
    scene.add(ambientLight);

    // Key Light (cyan/blue-tinted frontal directional)
    const keyLight = new THREE.DirectionalLight(
      isShadow ? 0x7aa2ff : 0xfffaed,
      isShadow ? 2.2 : 1.8
    );
    keyLight.position.set(2.5, 4.0, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    // Fill Light (purple/violet soft fill)
    const fillLight = new THREE.DirectionalLight(
      isShadow ? 0x8b5cf6 : 0xd4af37,
      isShadow ? 1.3 : 0.8
    );
    fillLight.position.set(-3.0, 2.0, 2.0);
    scene.add(fillLight);

    // Rim Light (high-intensity separation edge light behind character)
    const rimLight = new THREE.DirectionalLight(
      isShadow ? 0x5b8cff : 0x22d3ee,
      isShadow ? 4.5 : 2.5
    );
    rimLight.position.set(0, 3.5, -3.2);
    scene.add(rimLight);

    // Platform Up-light (illuminates dais)
    const daisLight = new THREE.PointLight(
      isShadow ? 0x35e3a0 : 0xe0b64a,
      isShadow ? 2.2 : 1.6,
      5.0
    );
    daisLight.position.set(0, 0.35, 0);
    scene.add(daisLight);

    // ── 5. ENVIRONMENT ──
    const floorGeo = new THREE.PlaneGeometry(30, 30, 32, 32);
    const floorMat = new THREE.MeshStandardMaterial({
      color: isShadow ? 0x05070f : 0xece3d0,
      roughness: 0.25,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Floor Perspective Grid
    const gridHelper = new THREE.GridHelper(
      24,
      24,
      isShadow ? 0x5b8cff : 0xd4af37,
      isShadow ? 0x161d32 : 0xd8caa0
    );
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // Distant Gothic Monolith Pillars
    const pillarMat = new THREE.MeshStandardMaterial({
      color: isShadow ? 0x090b16 : 0xdad0bc,
      roughness: 0.7,
      metalness: 0.3,
    });
    const pillarPositions = [
      [-4.5, 4, -8], [-2.8, 3.5, -9], [2.8, 3.5, -9], [4.5, 4, -8]
    ];
    pillarPositions.forEach(([px, py, pz]) => {
      const pGeo = new THREE.BoxGeometry(0.7, 8, 0.7);
      const pMesh = new THREE.Mesh(pGeo, pillarMat);
      pMesh.position.set(px, py, pz);
      scene.add(pMesh);
    });

    // ── 6. RUNIC DAIS & HOLOGRAPHIC XP ENERGY RING ──
    const daisGroup = new THREE.Group();
    scene.add(daisGroup);

    // Base Stone Pedestal
    const baseDaisGeo = new THREE.CylinderGeometry(1.6, 1.75, 0.12, 48);
    const baseDaisMat = new THREE.MeshStandardMaterial({
      color: isShadow ? 0x0c1020 : 0xded2be,
      roughness: 0.4,
      metalness: 0.6,
    });
    const baseDais = new THREE.Mesh(baseDaisGeo, baseDaisMat);
    baseDais.position.y = 0.06;
    baseDais.receiveShadow = true;
    daisGroup.add(baseDais);

    // Concentric Inscribed Rune Ring
    const innerDaisGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.13, 48);
    const innerDaisMat = new THREE.MeshStandardMaterial({
      color: isShadow ? 0x11162b : 0xeae0cc,
      roughness: 0.3,
      metalness: 0.7,
    });
    const innerDais = new THREE.Mesh(innerDaisGeo, innerDaisMat);
    innerDais.position.y = 0.07;
    innerDais.receiveShadow = true;
    daisGroup.add(innerDais);

    // Dynamic 360° Holographic XP Ring
    const xpAngle = (xpPct / 100) * Math.PI * 2;
    const xpRingGeo = new THREE.TorusGeometry(1.15, 0.024, 16, 64, xpAngle);
    const xpRingMat = new THREE.MeshStandardMaterial({
      color: isShadow ? 0x5b8cff : 0xd4af37,
      emissive: isShadow ? 0x3b82f6 : 0xb6892e,
      emissiveIntensity: isQuestFulfilling ? 3.5 : 1.8,
      roughness: 0.2,
      metalness: 0.9,
    });
    const xpRing = new THREE.Mesh(xpRingGeo, xpRingMat);
    xpRing.rotation.x = Math.PI / 2;
    xpRing.position.y = 0.14;
    daisGroup.add(xpRing);

    // Guide Base Ring
    const xpGuideGeo = new THREE.TorusGeometry(1.15, 0.008, 12, 64);
    const xpGuideMat = new THREE.MeshBasicMaterial({
      color: isShadow ? 0x22325c : 0xcac0a5,
      transparent: true,
      opacity: 0.5,
    });
    const xpGuide = new THREE.Mesh(xpGuideGeo, xpGuideMat);
    xpGuide.rotation.x = Math.PI / 2;
    xpGuide.position.y = 0.14;
    daisGroup.add(xpGuide);

    // ── 7. FLOATING 3D MANA PARTICLES ──
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3 + 0] = (Math.random() - 0.5) * 7.0;
      particlePositions[i * 3 + 1] = Math.random() * 4.5;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
      particleVelocities[i] = 0.003 + Math.random() * 0.006;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isShadow ? 0x7aa2ff : 0xd4af37,
      size: 0.035,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ── 8. HOLOGRAPHIC SCAN BEAM (SHOWN WHEN MODEL IS REQUIRED) ──
    const scanBeamGroup = new THREE.Group();
    scene.add(scanBeamGroup);

    const beamGeo = new THREE.CylinderGeometry(0.8, 1.15, 2.4, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: isShadow ? 0x5b8cff : 0xd4af37,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const scanBeam = new THREE.Mesh(beamGeo, beamMat);
    scanBeam.position.y = 1.27;
    scanBeamGroup.add(scanBeam);

    // ── 9. CHARACTER MODEL PIPELINE ──
    const charLoader = new CharacterModelLoader();
    charLoader.load(
      character.class,
      (loadedLoader) => {
        scene.add(loadedLoader.model);
        scanBeamGroup.visible = false;
        setModelStatus('LOADED');
        setModelPath(loadedLoader.loadedPath);
      },
      (errorMsg) => {
        scanBeamGroup.visible = true;
        setModelStatus('REQUIRED');
      }
    );

    // ── 10. GUARDIAN MODEL PIPELINE ──
    const guardianLoader = new GuardianModelLoader();
    scene.add(guardianLoader.group);
    guardianLoader.load(() => {});

    // ── 11. ANIMATION LOOP ──
    let clock = new THREE.Clock();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Update Controls
      controls.update();

      // Update Character
      charLoader.update(delta);

      // Update Guardian Orbit
      guardianLoader.update(delta);

      // Pulse Scan Beam if Model Required
      if (scanBeamGroup.visible) {
        scanBeam.rotation.y = time * 0.4;
        beamMat.opacity = 0.12 + Math.sin(time * 2.5) * 0.06;
      }

      // Pulse XP Ring
      if (isQuestFulfilling) {
        xpRingMat.emissiveIntensity = 2.5 + Math.sin(time * 10) * 1.5;
      }

      // Rising Mana Particles
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += particleVelocities[i];
        if (pos[i * 3 + 1] > 4.5) {
          pos[i * 3 + 1] = 0.1;
          pos[i * 3 + 0] = (Math.random() - 0.5) * 7.0;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 6.0;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // ── RESIZE LISTENER ──
    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── CLEANUP ──
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [theme, xpPct, isQuestFulfilling, character.class]);

  return (
    <div className="three-character-scene-root">
      {/* WebGL Canvas Mount */}
      <div ref={mountRef} className="three-webgl-mount" />

      {/* OrbitControls Reset HUD Trigger */}
      <div className="scene-controls-hud">
        <button
          className="reset-view-btn font-mono"
          onClick={handleResetView}
          title="Reset Camera to Center Showcase View"
        >
          <span>⊙</span> RESET VIEW
        </button>
      </div>

      {/* Professional Holographic System Model Target State (NO STICK FIGURES) */}
      {modelStatus === 'REQUIRED' && (
        <div className="system-model-required-beacon">
          <div className="beacon-bracket tl" />
          <div className="beacon-bracket tr" />
          <div className="beacon-bracket bl" />
          <div className="beacon-bracket br" />

          <div className="beacon-head font-mono">
            <span className="beacon-blink-dot" /> SYSTEM // TELEMETRY
          </div>

          <div className="beacon-title font-display">
            CHARACTER MODEL REQUIRED
          </div>

          <div className="beacon-body font-mono">
            Place your full-body human 3D model asset (.glb / .gltf) into:
            <div className="target-path font-mono">
              public/models/characters/{character.class.toLowerCase()}.glb
            </div>
            <div className="alt-path font-mono">
              or: public/models/characters/player.glb
            </div>
          </div>

          <div className="beacon-specs font-mono">
            <span>FORMAT: GLB / GLTF</span>
            <span>SCALE: 1.0 (HUMAN)</span>
            <span>RIGGED: IDLE / BREATHING</span>
          </div>
        </div>
      )}

      <style>{`
        .three-character-scene-root {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
        }

        .three-webgl-mount {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          cursor: grab;
        }
        .three-webgl-mount:active {
          cursor: grabbing;
        }

        /* Reset View Button */
        .scene-controls-hud {
          position: absolute;
          bottom: 1.2rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          pointer-events: auto;
        }

        .reset-view-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: ${isShadow ? 'rgba(7, 9, 18, 0.85)' : 'rgba(250, 246, 236, 0.9)'};
          border: 1px solid ${isShadow ? 'rgba(91, 140, 255, 0.35)' : 'rgba(182, 137, 46, 0.4)'};
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
          padding: 0.35rem 0.85rem;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          border-radius: 4px;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.2s;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }
        .reset-view-btn:hover {
          border-color: ${isShadow ? '#7aa2ff' : '#d4af37'};
          background: ${isShadow ? 'rgba(122, 162, 255, 0.15)' : 'rgba(182, 137, 46, 0.15)'};
          color: ${isShadow ? '#ffffff' : '#000000'};
          transform: translateY(-1px);
        }

        /* Holographic System Beacon (Zero Stick Figures) */
        .system-model-required-beacon {
          position: absolute;
          top: 36%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: ${isShadow ? 'rgba(5, 7, 14, 0.88)' : 'rgba(252, 248, 238, 0.92)'};
          border: 1px solid ${isShadow ? 'rgba(91, 140, 255, 0.4)' : 'rgba(182, 137, 46, 0.45)'};
          padding: 1.1rem 1.4rem;
          max-width: 440px;
          width: 90%;
          text-align: center;
          z-index: 15;
          backdrop-filter: blur(16px);
          box-shadow: ${isShadow
            ? '0 16px 40px rgba(0, 0, 0, 0.85), inset 0 0 20px rgba(91, 140, 255, 0.08)'
            : '0 12px 30px rgba(0, 0, 0, 0.1), inset 0 0 20px rgba(182, 137, 46, 0.08)'};
          pointer-events: none;
        }

        .beacon-bracket {
          position: absolute;
          width: 8px;
          height: 8px;
        }
        .beacon-bracket.tl { top: -1px; left: -1px; border-top: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'}; border-left: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'}; }
        .beacon-bracket.tr { top: -1px; right: -1px; border-top: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'}; border-right: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'}; }
        .beacon-bracket.bl { bottom: -1px; left: -1px; border-bottom: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'}; border-left: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'}; }
        .beacon-bracket.br { bottom: -1px; right: -1px; border-bottom: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'}; border-right: 2px solid ${isShadow ? '#7aa2ff' : '#d4af37'}; }

        .beacon-head {
          font-size: 0.65rem;
          letter-spacing: 0.16em;
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-bottom: 0.4rem;
        }

        .beacon-blink-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 8px #f59e0b;
          animation: blink 1.2s infinite alternate;
        }
        @keyframes blink {
          0% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        .beacon-title {
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: 0.08em;
          color: ${isShadow ? '#ffffff' : '#1e1810'};
          margin-bottom: 0.6rem;
          text-shadow: ${isShadow ? '0 0 12px rgba(122, 162, 255, 0.4)' : 'none'};
        }

        .beacon-body {
          font-size: 0.72rem;
          color: ${isShadow ? '#a8b4cc' : '#5a523e'};
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .target-path {
          background: ${isShadow ? 'rgba(15, 20, 36, 0.8)' : 'rgba(240, 235, 220, 0.8)'};
          border: 1px solid ${isShadow ? 'rgba(91, 140, 255, 0.3)' : 'rgba(182, 137, 46, 0.3)'};
          padding: 3px 8px;
          margin-top: 5px;
          color: ${isShadow ? '#35e3a0' : '#22d3ee'};
          font-weight: 700;
          border-radius: 2px;
        }

        .alt-path {
          font-size: 0.65rem;
          color: ${isShadow ? '#7aa2ff' : '#b6892e'};
          margin-top: 3px;
        }

        .beacon-specs {
          display: flex;
          justify-content: space-around;
          font-size: 0.58rem;
          color: ${isShadow ? '#657492' : '#8c8065'};
          border-top: 1px solid ${isShadow ? 'rgba(91, 140, 255, 0.2)' : 'rgba(182, 137, 46, 0.2)'};
          padding-top: 0.5rem;
        }
      `}</style>
    </div>
  );
};

