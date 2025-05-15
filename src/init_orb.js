import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';
import { setupAudioInput } from './audio_sync.js';
import { updateEmotion, markShaderReady } from './emotion_engine.js';

let scene, camera, renderer, orb;

export function initOrb(containerId = 'orb-container') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('❌ ORB CONTAINER NOT FOUND');
    return;
  }

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Scene and camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  // Orb mesh
  const orbGeo = new THREE.SphereGeometry(2, 128, 128);
  orb = new THREE.Mesh(orbGeo, orbMaterial);
  scene.add(orb);

  // Mark shader as ready for emotion engine
  markShaderReady();

  // 🎙️ Setup mic-driven pulse input
  setupAudioInput(volume => {
    if (orbMaterial?.uniforms?.pulse) {
      orbMaterial.uniforms.pulse.value = 1.5 + volume;
    }
  });

  // Responsive window resizing
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  const clock = new THREE.Clock();
  let drift = 0;

  function animate() {
    const delta = clock.getDelta();
    const time = clock.elapsedTime;

    orbMaterial.uniforms.time.value = time;

    drift += 0.002;
    orb.rotation.x = Math.sin(time * 0.3) * 0.12 + Math.sin(drift) * 0.03;
    orb.rotation.y = time * 0.4 + Math.sin(drift * 0.6) * 0.07;
    orb.rotation.z = Math.cos(time * 0.2) * 0.015;

    updateEmotion(delta);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
