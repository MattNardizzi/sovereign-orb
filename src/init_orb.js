import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';

let scene, camera, renderer, orb;

export function initOrb(containerId = 'orb-container') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('❌ ORB CONTAINER NOT FOUND');
    return;
  }

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 5;

  const orbGeo = new THREE.SphereGeometry(2, 128, 128);
  orb = new THREE.Mesh(orbGeo, orbMaterial);
  scene.add(orb);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let drift = 0;
  function animate(t) {
    const time = t * 0.001;
    orbMaterial.uniforms.time.value = time;

    drift += 0.002;
    orb.rotation.x = Math.sin(time * 0.3) * 0.12 + Math.sin(drift) * 0.03;
    orb.rotation.y = time * 0.4 + Math.sin(drift * 0.6) * 0.07;
    orb.rotation.z = Math.cos(time * 0.2) * 0.015;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
