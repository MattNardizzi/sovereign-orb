import { orbMaterial } from './shader_material.js';

const EMOTIONS = {
  calm: {
    glowColor: '#3ee8ff',
    pulseMod: 0.5,
    breathMod: 0.4,
    noiseStrength: 0.3
  },
  fear: {
    glowColor: '#ff4560',
    pulseMod: 1.4,
    breathMod: 0.7,
    noiseStrength: 0.8
  },
  awe: {
    glowColor: '#ffffff',
    pulseMod: 1.0,
    breathMod: 0.5,
    noiseStrength: 0.4
  },
  melancholy: {
    glowColor: '#305878',
    pulseMod: 0.3,
    breathMod: 0.25,
    noiseStrength: 0.2
  },
  alert: {
    glowColor: '#ffff66',
    pulseMod: 1.2,
    breathMod: 0.6,
    noiseStrength: 0.6
  }
};

let currentEmotion = 'calm';
let driftTimer = 0;

function applyEmotion(state) {
  const e = EMOTIONS[state];
  if (!e) return;

  orbMaterial.uniforms.glowColor.value.set(e.glowColor);
  orbMaterial.uniforms.noiseStrength.value = e.noiseStrength;

  // Breath + pulse mods are additive — used in animate loop fusion later
  orbMaterial.uniforms.breath.value += e.breathMod;
  orbMaterial.uniforms.pulse.value += e.pulseMod;
}

export function updateEmotion(deltaTime) {
  driftTimer += deltaTime;

  // Every ~15 seconds, drift to a new emotion randomly
  if (driftTimer > 15) {
    const keys = Object.keys(EMOTIONS).filter(e => e !== currentEmotion);
    currentEmotion = keys[Math.floor(Math.random() * keys.length)];
    driftTimer = 0;
  }

  applyEmotion(currentEmotion);
}

// For external systems to override emotion
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
