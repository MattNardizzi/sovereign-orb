import { orbMaterial } from './shader_material.js';
import { getCurrentGlowColor, getCurrentEmotionIntensity } from './emotion_engine.js';

let lastColor = null;
let lastPulse = 0;

export function updateOrbShell() {
  if (!orbMaterial?.uniforms) return;

  const currentColor = getCurrentGlowColor();
  const currentIntensity = getCurrentEmotionIntensity();

  // Update glow color if changed
  if (!lastColor || !lastColor.equals(currentColor)) {
    orbMaterial.uniforms.glowColor.value.copy(currentColor);
    lastColor = currentColor.clone();
  }

  // Update pulse value if intensity changed significantly
  const pulse = 1.0 + currentIntensity;
  if (Math.abs(pulse - lastPulse) > 0.01) {
    orbMaterial.uniforms.pulse.value = pulse;
    lastPulse = pulse;
  }
}
