import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';
import { getCurrentEmotionIntensity } from './emotion_engine.js';
import { updateOrbShell } from './shell_layer.js';

let lastTime = performance.now();
let lastEmotion = 0;
let lastPulse = 1.0;
let driftSeed = Math.random() * 1000;

export function animateOrb(renderer, scene, camera, orb) {
  const now = performance.now();
  const elapsed = now * 0.001;
  const delta = (now - lastTime) * 0.001;
  lastTime = now;

  // 📈 Emotion drive
  const targetEmotion = getCurrentEmotionIntensity(); // 0.0 - 1.0
  const smoothedEmotion = lastEmotion + (targetEmotion - lastEmotion) * 0.05;
  orbMaterial.uniforms.emotionState.value = smoothedEmotion;
  lastEmotion = smoothedEmotion;

  // 🫁 Breath modulation (non-periodic, alive)
  const breathA = Math.sin(elapsed * 0.15 + driftSeed) * 0.1;
  const breathB = Math.sin(elapsed * 0.07 + driftSeed * 0.5) * 0.05;
  const breath = 0.45 + breathA + breathB;

  // 💓 Pulse intensity w/ smoothing
  const targetPulse = breath * (0.9 + smoothedEmotion);
  lastPulse += (targetPulse - lastPulse) * 0.1;
  orbMaterial.uniforms.pulse.value = lastPulse;

  // 🌪️ Drift — intensity-responsive
  const intensity = 0.001 + 0.001 * smoothedEmotion;
  orb.rotation.x += Math.sin(elapsed * 0.3 + driftSeed) * intensity;
  orb.rotation.y += Math.sin(elapsed * 0.22 + driftSeed * 2.0) * intensity * 0.8;

  // 🌊 Shader drift modulation
  orbMaterial.uniforms.driftFactor.value = Math.sin(elapsed * 0.1 + driftSeed);

  // 🎨 Apply shell overlays (color, glow)
  updateOrbShell();

  // 🧠 Render the current cognition state
  renderer.render(scene, camera);
}
