import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';

const lastBreathOffset = Math.random() * Math.PI * 2;

export function animateOrb(renderer, scene, camera) {
  const elapsed = performance.now() * 0.001;

  orbMaterial.uniforms.time.value = elapsed;

  const breathRate = 0.4 + Math.sin(elapsed * 0.12 + lastBreathOffset) * 0.05;
  orbMaterial.uniforms.breath.value = breathRate;

  const twitch = Math.sin(elapsed * 2.5) * 0.04;
  orbMaterial.uniforms.pulse.value = 1.0 + twitch;

  renderer.render(scene, camera);
}
