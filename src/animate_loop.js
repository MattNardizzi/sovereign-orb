import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';
import { getCurrentEmotionIntensity, getCurrentGlowColor } from './emotion_engine.js';

let lastFrameTime = performance.now();
let driftSeed = Math.random() * 1000;

export function animateOrb(renderer, scene, camera, orb) {
  const now = performance.now();
  const elapsed = now * 0.001;
  const delta = (now - lastFrameTime) * 0.001;
  lastFrameTime = now;

  // Update core time uniform
  orbMaterial.uniforms.time.value = elapsed;

  // Emotion logic — dynamic glow color + pulse scaling
  const emotion = getCurrentEmotionIntensity(); // 0.0 - 1.0
  orbMaterial.uniforms.emotionState.value = emotion;

  // Optional: sync color based on current emotion definition
  const color = getCurrentGlowColor(); // should return a THREE.Color or hex
  if (color) orbMaterial.uniforms.glowColor.value.set(color);

  // Breathing — subtle, organic and non-looping
  const breathNoise = Math.sin(elapsed * 0.15 + driftSeed) * 0.1 +
                      Math.sin(elapsed * 0.07 + driftSeed * 0.5) * 0.05;
  const breath = 0.45 + breathNoise;
  orbMaterial.uniforms.pulse.value = breath * (0.9 + emotion); // scale with emotion

  // Drift — slow, imperfect twitching
  const driftX = Math.sin(elapsed * 0.3 + driftSeed) * 0.0015;
  const driftY = Math.sin(elapsed * 0.22 + driftSeed * 2.0) * 0.001;

  orb.rotation.x += driftX;
  orb.rotation.y += driftY;

  // Internal motion for shader
  orbMaterial.uniforms.driftFactor.value = Math.sin(elapsed * 0.1 + driftSeed);

  // Final render
  renderer.render(scene, camera);
}
