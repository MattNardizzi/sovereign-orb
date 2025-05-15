import { ThoughtEngine } from './thought_engine.js';

const thoughtEngine = new ThoughtEngine({
  file: 'last_spoken_thought.json',
  interval: 2000,
  targetId: 'thought',
  onEmotion: (emotion) => {
    orb.updateEmotionColor(emotionToColor(emotion)); // Hook into render_orb
  }
});

thoughtEngine.start();
