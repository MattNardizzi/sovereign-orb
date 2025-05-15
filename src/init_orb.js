import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';
import { animateOrb } from './animate_loop.js';
import { updateEmotion } from './emotion_engine.js';

let scene, camera, renderer, orbMesh;
const clock = new THREE.Clock();

export function initOrb(containerId = 'orb-container') {
  const container = document.getElementById(containerId);
  if (!container) return console.error('Missing container');

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 2;

  const geometry = new THREE.SphereGeometry(0.8, 128, 128);
  orbMesh = new THREE.Mesh(geometry, orbMaterial);
  scene.add(orbMesh);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function loop() {
    requestAnimationFrame(loop);
    const delta = clock.getDelta();
    orbMaterial.uniforms.time.value += delta;
    updateEmotion(delta);
    animateOrb(renderer, scene, camera);
  }

  loop();
}
