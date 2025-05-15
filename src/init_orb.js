import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';
import { animateOrb } from './animate_loop.js';
import { updateEmotion } from './emotion_engine.js';

let scene, camera, renderer, orbMesh;
let clock = new THREE.Clock();

export function initOrb(containerId = 'orb-container') {
  const container = document.getElementById(containerId);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 2;

  // Orb geometry
  const geometry = new THREE.SphereGeometry(0.8, 128, 128);
  orbMesh = new THREE.Mesh(geometry, orbMaterial);
  scene.add(orbMesh);

  // Lighting (ambient + subtle directional)
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);

  const dir = new THREE.DirectionalLight(0xaaaaff, 0.3);
  dir.position.set(2, 2, 3);
  scene.add(dir);

  // Resize handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Start animation
  function loop() {
    requestAnimationFrame(loop);

    const delta = clock.getDelta();
    updateEmotion(delta);

    animateOrb(renderer, scene, camera);
  }

  loop();
}
