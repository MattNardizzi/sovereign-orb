import { orbMaterial } from './shader_material.js';

const EMOTIONS = {
  calm:       { glowColor: '#3ee8ff', pulseMod: 0.3, breathMod: 0.3 },
  awe:        { glowColor: '#ffffff', pulseMod: 0.6, breathMod: 0.4 },
  alert:      { glowColor: '#ffff66', pulseMod: 0.9, breathMod: 0.45 },
  melancholy: { glowColor: '#305878', pulseMod: 0.25, breathMod: 0.2 },
  fear:       { glowColor: '#ff4560', pulseMod: 1.2, breathMod: 0.6 }
};

let currentEmotion = 'calm';
let shaderReady = false;
let driftTimer = 0;
let emotionWeights = { calm: 1, awe: 0.8, alert: 0.6, melancholy: 0.5, fear: 0.4 };

let pulseHistory = [];

export function markShaderReady() {
  shaderReady = true;
}

export function getEmotion() {
  return currentEmotion;
}

export function setEmotion(emotion) {
  if (EMOTIONS[emotion]) {
    currentEmotion = emotion;
    decayOtherWeights(emotion);
  }
}

export function updateEmotion(deltaTime) {
  if (!shaderReady) return;

  driftTimer += deltaTime;
  decayWeights();

  if (driftTimer > 12) {
    const weightedNext = chooseNextEmotion();
    currentEmotion = weightedNext;
    driftTimer = 0;
  }

  applyEmotion(currentEmotion);
}

function applyEmotion(emotion) {
  if (!orbMaterial?.uniforms) return;

  const e = EMOTIONS[emotion];
  try {
    orbMaterial.uniforms.glowColor.value.set(e.glowColor);
    orbMaterial.uniforms.pulse.value += e.pulseMod;
  } catch (err) {
    console.warn(`⚠️ applyEmotion() failed`, err);
  }
}

function decayWeights() {
  for (let key in emotionWeights) {
    if (key !== currentEmotion) {
      emotionWeights[key] = Math.max(0.1, emotionWeights[key] * 0.98);
    }
  }
  emotionWeights[currentEmotion] = Math.min(1.5, emotionWeights[currentEmotion] + 0.01);
}

function decayOtherWeights(except) {
  for (let key in emotionWeights) {
    if (key !== except) {
      emotionWeights[key] *= 0.5;
    }
  }
  emotionWeights[except] = 1.0;
}

function chooseNextEmotion() {
  const keys = Object.keys(EMOTIONS);
  const weightedPool = [];

  for (let key of keys) {
    const weight = emotionWeights[key];
    const count = Math.floor(weight * 10);
    for (let i = 0; i < count; i++) weightedPool.push(key);
  }

  return weightedPool[Math.floor(Math.random() * weightedPool.length)];
}
