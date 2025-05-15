import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';

const EMOTIONS = {
  calm:       { glowColor: '#00ffff', pulseMod: 0.3, breathMod: 0.3 },
  anxious:    { glowColor: '#ff6600', pulseMod: 1.3, breathMod: 0.8 },
  excited:    { glowColor: '#ff00ff', pulseMod: 1.6, breathMod: 0.7 },
  happy:      { glowColor: '#33ff00', pulseMod: 1.0, breathMod: 0.5 },
  sad:        { glowColor: '#0033cc', pulseMod: 0.4, breathMod: 0.2 },
  confident:  { glowColor: '#ffff00', pulseMod: 1.1, breathMod: 0.4 },
  awe:        { glowColor: '#8000ff', pulseMod: 0.8, breathMod: 0.5 },
  alert:      { glowColor: '#ffffff', pulseMod: 1.2, breathMod: 0.5 },
  melancholy: { glowColor: '#4455aa', pulseMod: 0.2, breathMod: 0.15 },
  fear:       { glowColor: '#ff0033', pulseMod: 1.5, breathMod: 0.6 }
};

let currentEmotion = 'calm';
let emotionStrength = 1.0;
let shaderReady = false;
let driftTimer = 0;

// Weight tracking for probabilistic emotional drift
let emotionWeights = Object.fromEntries(
  Object.keys(EMOTIONS).map(key => [key, key === 'calm' ? 1.0 : 0.5])
);

// ========== PUBLIC API ==========

// Called once when orb is ready
export function markShaderReady() {
  shaderReady = true;
}

// Update emotional drift over time
export function updateEmotion(deltaTime) {
  if (!shaderReady) return;

  driftTimer += deltaTime;
  decayWeights();

  if (driftTimer > 12) {
    const next = chooseNextEmotion();
    if (next !== currentEmotion) {
      setEmotion(next);
    }
    driftTimer = 0;
  }

  applyEmotion(currentEmotion);
}

// Manually override emotion (e.g. from sentiment, API input)
export function setEmotion(emotion) {
  if (!EMOTIONS[emotion]) return;
  currentEmotion = emotion;
  emotionStrength = 1.0;
  decayOtherWeights(emotion);
  applyEmotion(emotion);
  console.log(`🎭 Emotion manually set to: ${emotion}`);
}

// Returns a float 0.0–1.0 for pulse intensity
export function getCurrentEmotionIntensity() {
  const mod = EMOTIONS[currentEmotion]?.pulseMod || 0.5;
  return mod * emotionStrength;
}

// Returns a THREE.Color object for shader glowColor
export function getCurrentGlowColor() {
  return new THREE.Color(EMOTIONS[currentEmotion]?.glowColor || '#90f1ff');
}

// Optional: Get current raw emotion name
export function getEmotion() {
  return currentEmotion;
}

// ========== INTERNAL LOGIC ==========

// Apply emotion values to orbMaterial shader
function applyEmotion(state) {
  const e = EMOTIONS[state];
  if (!e || !orbMaterial?.uniforms?.glowColor) return;

  try {
    orbMaterial.uniforms.glowColor.value.set(e.glowColor);
    // We let animate_loop handle pulse dynamically based on intensity
  } catch (err) {
    console.warn(`⚠️ Emotion apply failed for ${state}`, err);
  }
}

// Slowly decays weights to promote diversity
function decayWeights() {
  for (let key in emotionWeights) {
    if (key !== currentEmotion) {
      emotionWeights[key] = Math.max(0.05, emotionWeights[key] * 0.975);
    }
  }
  emotionWeights[currentEmotion] = Math.min(1.5, emotionWeights[currentEmotion] + 0.01);
  emotionStrength = Math.max(0.0, emotionStrength - 0.005);
}

// After a manual switch, soften all others
function decayOtherWeights(exception) {
  for (let key in emotionWeights) {
    if (key !== exception) {
      emotionWeights[key] *= 0.6;
    }
  }
  emotionWeights[exception] = 1.2;
}

// Pick next emotion probabilistically
function chooseNextEmotion() {
  const pool = [];
  for (let key in emotionWeights) {
    const weight = emotionWeights[key];
    for (let i = 0; i < Math.floor(weight * 10); i++) {
      pool.push(key);
    }
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
