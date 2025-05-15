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

  // 🖥️ Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // 🌌 Scene & Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  // 🧠 Orb Creation
  const orbGeo = new THREE.SphereGeometry(2, 128, 128);
  orb = new THREE.Mesh(orbGeo, orbMaterial);
  scene.add(orb);

  // 🌀 Emotion System Ready
  markShaderReady();

  // 🎧 Audio Pulse Integration
  setupAudioInput(volume => {
    const emotion = orbMaterial.uniforms.emotionState?.value || 0.5;
    const pulse = 1.2 + volume * (0.4 + emotion);
    orbMaterial.uniforms.pulse.value = Math.min(pulse, 2.0); // clamp to max
  });

  // 🖱️ Gaze Awareness
  enableGazeTracking();

  // 🔁 Window Resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // 🧭 True Delta Clock
  const clock = new THREE.Clock();

  // 🔂 Sovereign Render Loop
  function loop() {
    const delta = clock.getDelta();
    updateEmotion(delta);              // Emotion decay & drift
    updateOrbGaze(orb);                // Subtle gaze response
    animateOrb(renderer, scene, camera, orb); // Visual rendering
    requestAnimationFrame(loop);
  }

  loop();
}
