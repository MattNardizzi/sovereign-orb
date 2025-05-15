import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';
import { animateOrb } from './animate_loop.js';
import { updateEmotion } from './emotion_engine.js';

let scene, camera, renderer, orbMesh;
const clock = new THREE.Clock();

export function initOrb(containerId = 'orb-container') {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error('❌ Container not found:', containerId);
    return;
  }

  console.log('✅ Initializing Orb Scene');

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 2;

  // Geometry
  const geometry = new THREE.SphereGeometry(0.8, 128, 128);

  // 🔧 Use fallback test material to confirm rendering works
  // Comment this out later to re-enable shaderMaterial
  const fallbackMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: false });

  orbMesh = new THREE.Mesh(geometry, fallbackMaterial); // Use orbMaterial here when confirmed working
  scene.add(orbMesh);
  console.log('✅ Orb mesh added to scene');

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const dir = new THREE.DirectionalLight(0xaaaaff, 0.3);
  dir.position.set(2, 2, 3);
  scene.add(ambient);
  scene.add(dir);

  // Responsive resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Animation loop
  function loop() {
    requestAnimationFrame(loop);

    const delta = clock.getDelta();
    updateEmotion(delta);
    animateOrb(renderer, scene, camera);
  }

  console.log('🎥 Starting animation loop...');
  loop();
}
