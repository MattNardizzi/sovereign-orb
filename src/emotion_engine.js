import { orbMaterial } from './shader_material.js';

// Core emotional states mapped to visual modifiers
const EMOTIONS = {
  calm: {
    glowColor: '#3ee8ff',
    pulseMod: 0.5,
    breathMod: 0.4
  },
  fear: {
    glowColor: '#ff4560',
    pulseMod: 1.4,
    breathMod: 0.7
  },
  awe: {
    glowColor: '#ffffff',
    pulseMod: 1.0,
    breathMod: 0.5
  },
  melancholy: {
    glowColor: '#305878',
    pulseMod: 0.3,
    breathMod: 0.25
  },
  alert: {
    glowColor: '#ffff66',
    pulseMod: 1.2,
    breathMod: 0.6
  }
};

let currentEmotion = 'calm';
let driftTimer = 0;
let shaderReady = false;

export function markShaderReady() {
  shaderReady = true;
}

export function getEmotion() {
  return currentEmotion;
}

function applyEmotion(state) {
  if (!shaderReady || !orbMaterial?.uniforms) return;

  const e = EMOTIONS[state];
  if (!e) return;

  try {
    if (orbMaterial.uniforms.glowColor?.value?.set) {
      orbMaterial.uniforms.glowColor.value.set(e.glowColor);
    }

    if (typeof orbMaterial.uniforms.breath?.value === 'number') {
      orbMaterial.uniforms.breath.value += e.breathMod;
    }

    if (typeof orbMaterial.uniforms.pulse?.value === 'number') {
      orbMaterial.uniforms.pulse.value += e.pulseMod;
    }
  } catch (err) {
    console.warn(`⚠️ Emotion state application failed: ${state}`, err);
  }
}

export function updateEmotion(deltaTime) {
  if (!shaderReady) return;

  driftTimer += deltaTime;
  if (driftTimer > 12) {
    const options = Object.keys(EMOTIONS).filter(e => e !== currentEmotion);
    currentEmotion = options[Math.floor(Math.random() * options.length)];
    driftTimer = 0;
  }

  applyEmotion(currentEmotion);
}
