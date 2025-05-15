import { orbMaterial } from './shader_material.js';

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

function applyEmotion(state) {
  const e = EMOTIONS[state];
  if (!e || !orbMaterial || !orbMaterial.uniforms) return;

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
    console.warn('⚠️ Emotion engine failed to apply state:', err);
  }
}

export function updateEmotion(deltaTime) {
  driftTimer += deltaTime;

  if (driftTimer > 15) {
    const keys = Object.keys(EMOTIONS).filter(e => e !== currentEmotion);
    currentEmotion = keys[Math.floor(Math.random() * keys.length)];
    driftTimer = 0;
  }

  applyEmotion(currentEmotion);
}

export function setEmotion(state) {
  if (EMOTIONS[state]) {
    currentEmotion = state;
    driftTimer = 0;
    applyEmotion(state);
  }
}

export function getEmotion() {
  return currentEmotion;
}
