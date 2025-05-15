import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';
import { getCurrentGlowColor, getCurrentEmotionIntensity } from './emotion_engine.js';

let lastColor = new THREE.Color('#000000');
let lastPulse = 0;

const COLOR_LERP_SPEED = 0.1;
const PULSE_LERP_SPEED = 0.1;
const PULSE_THRESHOLD = 0.005;

export function updateOrbShell() {
  if (!orbMaterial?.uniforms) return;

  // 💠 Emotion-derived inputs
  const targetColor = getCurrentGlowColor();
  const targetPulse = 1.0 + getCurrentEmotionIntensity();

  // 🎨 Glow color interpolation
  lastColor.lerp(targetColor, COLOR_LERP_SPEED);
  if (orbMaterial.uniforms.glowColor?.value) {
    orbMaterial.uniforms.glowColor.value.copy(lastColor);
  }

  // 💓 Pulse smoothing
  if (Math.abs(targetPulse - lastPulse) > PULSE_THRESHOLD) {
    lastPulse += (targetPulse - lastPulse) * PULSE_LERP_SPEED;
    if (orbMaterial.uniforms.pulse) {
      orbMaterial.uniforms.pulse.value = lastPulse;
    }
  }
}
