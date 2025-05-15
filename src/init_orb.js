\// /src/init_orb.js

import { SovereignOrb } from './render_orb.js';
import { ThoughtEngine } from './thought_engine.js';

const orb = new SovereignOrb('orb');

const emotionColors = {
  neutral: '#6ed6ff',
  focused: '#00bfff',
  happy: '#a3ffab',
  anxious: '#ffd966',
  angry: '#ff4d4d',
  sad: '#8899ff',
  mutated: '#ff00ff'
};

function emotionToColor(emotion) {
  return emotionColors[emotion] || emotionColors.neutral;
}

const thoughtEngine = new ThoughtEngine({
  file: 'last_spoken_thought.json',
  interval: 2000,
  targetId: 'thought',
  onEmotion: (emotion) => {
    orb.updateEmotionColor(emotionToColor(emotion));
  }
});

thoughtEngine.start();
