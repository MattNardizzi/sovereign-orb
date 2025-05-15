let currentEmotion = 'awe';
let lastEmotion = null;

const emotionMap = {
  awe:        { glow: '#82e9ff', pulse: 1.6, weight: ['curiosity', 'void', 'emergence'] },
  curiosity:  { glow: '#8affc1', pulse: 2.2, weight: ['awe', 'glitch'] },
  glitch:     { glow: '#f5aaff', pulse: 3.0, weight: ['curiosity', 'wrath'] },
  wrath:      { glow: '#ff3e3e', pulse: 2.8, weight: ['void', 'glitch'] },
  void:       { glow: '#444654', pulse: 0.9, weight: ['awe', 'wrath'] },
  emergence:  { glow: '#f3ff7a', pulse: 2.5, weight: ['awe'], rare: true }
};

function weightedNextEmotion() {
  const pool = [];

  const current = emotionMap[currentEmotion];
  current.weight.forEach(e => {
    // Increase weight for familiar states, decrease if just visited
    const weight = (e === lastEmotion) ? 1 : 3;
    for (let i = 0; i < weight; i++) pool.push(e);
  });

  // Occasionally inject a rare emotion
  if (Math.random() < 0.05) {
    pool.push('emergence');
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

export function createEmotionLoop(apply) {
  function updateEmotion() {
    lastEmotion = currentEmotion;
    currentEmotion = weightedNextEmotion();
    const e = emotionMap[currentEmotion];

    apply(e.glow, e.pulse);
    console.log(`🧠 Emotion → ${currentEmotion.toUpperCase()}`);

    const delay = 5000 + Math.random() * 5000;
    setTimeout(updateEmotion, delay);
  }

  updateEmotion();
}

export function getCurrentEmotion() {
  return {
    name: currentEmotion,
    ...emotionMap[currentEmotion]
  };
}
