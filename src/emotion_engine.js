import { orbMaterial } from './shader_material.js';

const EMOTIONS = {
  calm:       { glowColor: '#3ee8ff', pulseMod: 0.5, breathMod: 0.4 },
  fear:       { glowColor: '#ff4560', pulseMod: 1.4, breathMod: 0.7 },
  awe:        { glowColor: '#ffffff', pulseMod: 1.0, breathMod: 0.5 },
  melancholy: { glowColor: '#305878', pulseMod: 0.3, breathMod: 0.25 },
  alert:      { glowColor: '#ffff66', pulseMod: 1.2, breathMod: 0.6 }
};

let currentEmotion = 'calm';
let driftTimer = 0;
let shaderReady = false;

export function markShaderReady() {
  shaderReady = true;
}

function applyEmotion(state) {
  if (!shaderReady) return;
  const e = EMOTIONS[state];
  if (!e || !orbMaterial.uniforms) return;
  orbMaterial.uniforms.glowColor.value.set(e.glowColor);
  orbMaterial.uniforms.breath.value += e.breathMod;
  orbMaterial.uniforms.pulse.value += e.pulseMod;
}

export function updateEmotion(deltaTime) {
  if (!shaderReady) return;
  driftTimer += deltaTime;
  if (driftTimer > 12) {
    const keys = Object.keys(EMOTIONS).filter(e => e !== currentEmotion);
    currentEmotion = keys[Math.floor(Math.random() * keys.length)];
    driftTimer = 0;
  }
  applyEmotion(currentEmotion);
}
