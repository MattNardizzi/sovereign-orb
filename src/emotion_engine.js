import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';

const EMOTIONS = {
  calm:       { glowColor: '#00ffff', pulseMod: 0.3, breathMod: 0.3, cluster: ['confident', 'melancholy'] },
  anxious:    { glowColor: '#ff6600', pulseMod: 1.3, breathMod: 0.8, cluster: ['alert', 'fear'] },
  excited:    { glowColor: '#ff00ff', pulseMod: 1.6, breathMod: 0.7, cluster: ['happy', 'awe'] },
  happy:      { glowColor: '#33ff00', pulseMod: 1.0, breathMod: 0.5, cluster: ['excited', 'confident'] },
  sad:        { glowColor: '#0033cc', pulseMod: 0.4, breathMod: 0.2, cluster: ['melancholy'] },
  confident:  { glowColor: '#ffff00', pulseMod: 1.1, breathMod: 0.4, cluster: ['calm', 'happy'] },
  awe:        { glowColor: '#8000ff', pulseMod: 0.8, breathMod: 0.5, cluster: ['excited'] },
  alert:      { glowColor: '#ffffff', pulseMod: 1.2, breathMod: 0.5, cluster: ['anxious', 'fear'] },
  melancholy: { glowColor: '#4455aa', pulseMod: 0.2, breathMod: 0.15, cluster: ['sad', 'calm'] },
  fear:       { glowColor: '#ff0033', pulseMod: 1.5, breathMod: 0.6, cluster: ['anxious', 'alert'] }
};

let currentEmotion = 'calm';
let emotionStrength = 1.0;
let shaderReady = false;
let driftTimer = 0;

const RECENT_HISTORY = [];
const HISTORY_LIMIT = 3;

let emotionWeights = Object.fromEntries(
  Object.keys(EMOTIONS).map(key => [key, key === 'calm' ? 1.0 : 0.5])
);

// ========== PUBLIC API ==========

export function markShaderReady() {
  shaderReady = true;
}

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

export function setEmotion(emotion) {
  if (!EMOTIONS[emotion]) return;

  // Prevent repeating recent emotions
  if (RECENT_HISTORY.includes(emotion)) return;

  currentEmotion = emotion;
  emotionStrength = 1.0;
  decayOtherWeights(emotion);
  applyEmotion(emotion);
  trackEmotionHistory(emotion);
  console.log(`🎭 Emotion manually set to: ${emotion}`);
}

export function getCurrentEmotionIntensity() {
  const mod = EMOTIONS[currentEmotion]?.pulseMod || 0.5;
  return mod * emotionStrength;
}

export function getCurrentGlowColor() {
  return new THREE.Color(EMOTIONS[currentEmotion]?.glowColor || '#90f1ff');
}

export function getEmotion() {
  return currentEmotion;
}

// ========== INTERNAL LOGIC ==========

function applyEmotion(state) {
  const e = EMOTIONS[state];
  if (!e || !orbMaterial?.uniforms?.glowColor) return;

  try {
    orbMaterial.uniforms.glowColor.value.set(e.glowColor);
  } catch (err) {
    console.warn(`⚠️ Emotion apply failed for ${state}`, err);
  }
}

function decayWeights() {
  for (let key in emotionWeights) {
    if (key !== currentEmotion) {
      emotionWeights[key] = Math.max(0.05, emotionWeights[key] * 0.975);
    }
  }
  emotionWeights[currentEmotion] = Math.min(1.5, emotionWeights[currentEmotion] + 0.01);
  emotionStrength = Math.max(0.0, emotionStrength - 0.005);
}

function decayOtherWeights(exception) {
  for (let key in emotionWeights) {
    if (key !== exception) {
      emotionWeights[key] *= 0.6;
    }
  }
  emotionWeights[exception] = 1.2;
}

function chooseNextEmotion() {
  const cluster = EMOTIONS[currentEmotion]?.cluster || [];
  const pool = [];

  for (let key in emotionWeights) {
    let weight = emotionWeights[key];
    if (cluster.includes(key)) weight *= 1.5;
    if (RECENT_HISTORY.includes(key)) weight *= 0.5;
    for (let i = 0; i < Math.floor(weight * 10); i++) {
      pool.push(key);
    }
  }

  const next = pool[Math.floor(Math.random() * pool.length)];
  return next;
}

function trackEmotionHistory(emotion) {
  RECENT_HISTORY.push(emotion);
  if (RECENT_HISTORY.length > HISTORY_LIMIT) {
    RECENT_HISTORY.shift();
  }
}
