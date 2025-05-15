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
let shaderReady = false;
let driftTimer = 0;

// Weight tracking — how likely we are to drift into each state
let emotionWeights = Object.fromEntries(Object.keys(EMOTIONS).map(e => [e, e === 'calm' ? 1 : 0.5]));

export function markShaderReady() {
  shaderReady = true;
}

export function getEmotion() {
  return currentEmotion;
}

export function setEmotion(emotion) {
  if (!EMOTIONS[emotion]) return;
  currentEmotion = emotion;
  decayOtherWeights(emotion);
}

export function updateEmotion(deltaTime) {
  if (!shaderReady) return;

  driftTimer += deltaTime;
  decayWeights();

  if (driftTimer > 12) {
    currentEmotion = chooseNextEmotion();
    driftTimer = 0;
  }

  applyEmotion(currentEmotion);
}

function applyEmotion(state) {
  const e = EMOTIONS[state];
  if (!e || !orbMaterial?.uniforms?.glowColor?.value) return;

  try {
    orbMaterial.uniforms.glowColor.value.set(e.glowColor);
    orbMaterial.uniforms.pulse.value += e.pulseMod;
  } catch (err) {
    console.warn(`⚠️ Emotion apply failed for: ${state}`, err);
  }
}

function decayWeights() {
  for (let key in emotionWeights) {
    if (key !== currentEmotion) {
      emotionWeights[key] = Math.max(0.1, emotionWeights[key] * 0.975);
    }
  }
  emotionWeights[currentEmotion] = Math.min(1.5, emotionWeights[currentEmotion] + 0.015);
}

function decayOtherWeights(exception) {
  for (let key in emotionWeights) {
    if (key !== exception) {
      emotionWeights[key] *= 0.5;
    }
  }
  emotionWeights[exception] = 1.0;
}

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
