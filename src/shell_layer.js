import { orbMaterial } from './shader_material.js';
import { getCurrentGlowColor, getCurrentEmotionIntensity } from './emotion_engine.js';

let lastColor = new THREE.Color('#000000');
let lastPulse = 0;
const colorLerpSpeed = 0.1;
const pulseThreshold = 0.005;

export function updateOrbShell() {
  if (!orbMaterial?.uniforms) return;

  // 🔷 Get current emotional state values
  const targetColor = getCurrentGlowColor();
  const targetPulse = 1.0 + getCurrentEmotionIntensity();

  // 🎨 Smoothly blend glow color (avoids hard switches)
  lastColor.lerp(targetColor, colorLerpSpeed);
  orbMaterial.uniforms.glowColor.value.copy(lastColor);

  // 💓 Smooth pulse update if significantly changed
  if (Math.abs(targetPulse - lastPulse) > pulseThreshold) {
    lastPulse += (targetPulse - lastPulse) * 0.1;
    orbMaterial.uniforms.pulse.value = lastPulse;
  }
}
