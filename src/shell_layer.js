import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { getEmotion } from './emotion_engine.js';

export function createShellLayer() {
  const geometry = new THREE.SphereGeometry(0.82, 128, 128);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.0,
    roughness: 0.1,
    transmission: 1.0,
    thickness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.9,
    envMapIntensity: 1.0,
    ior: 1.4,
    transparent: true,
    opacity: 0.18,
    side: THREE.FrontSide
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.onBeforeRender = () => {
    const emotion = getEmotion?.() || 'calm';
    const shift = {
      calm: 0.2,
      fear: 0.9,
      awe: 0.6,
      melancholy: 0.3,
      alert: 0.7
    }[emotion] || 0.4;
    material.opacity = 0.12 + shift * 0.2;
    material.clearcoatRoughness = 0.03 + shift * 0.1;
    material.transmission = 0.9 + Math.sin(performance.now() * 0.001 + shift) * 0.1;
  };

  return mesh;
}
