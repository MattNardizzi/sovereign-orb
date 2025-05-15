import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';
import { setupAudioInput } from './audio_sync.js';
import { markShaderReady, updateEmotion } from './emotion_engine.js';
import { animateOrb } from './animate_loop.js';
import { enableGazeTracking, updateOrbGaze } from './gaze_tracker.js';

let scene, camera, renderer, orb;

export function initOrb(containerId = 'orb-container') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('❌ ORB CONTAINER NOT FOUND');
    return;
  }

  // 🖥️ Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // 🌌 Scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  // 🧠 Create Orb
  const orbGeo = new THREE.SphereGeometry(2, 128, 128);
  orb = new THREE.Mesh(orbGeo, orbMaterial);
  scene.add(orb);

  // ✅ Emotion engine → allow emotion syncing to begin
  markShaderReady();

  // 🎧 Mic audio input → pulse override
  setupAudioInput(volume => {
    const emotion = orbMaterial.uniforms.emotionState.value || 0.5;
    orbMaterial.uniforms.pulse.value = 1.2 + volume * (0.5 + emotion);
  });

  // 🖱️ Enable mouse-based gaze tracking
  enableGazeTracking();

  // 📐 Responsive resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 🌀 Animation loop
  function loop() {
    const delta = renderer.info.render.frame * 0.001 || 0.016;
    updateEmotion(delta);          // decay + drift
    updateOrbGaze(orb);            // rotate toward user
    animateOrb(renderer, scene, camera, orb); // main visual driver
    requestAnimationFrame(loop);
  }

  loop();
}
