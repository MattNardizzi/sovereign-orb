const thoughtText = document.getElementById('thought');

// Emotion-to-color mapping
const emotionColors = {
  neutral: '#6ed6ff',
  happy: '#a3ffab',
  focused: '#00bfff',
  angry: '#ff4d4d',
  anxious: '#ffd966',
  sad: '#8899ff',
  mutated: '#ff00ff'
};

let currentColor = '#6ed6ff';
let lastThought = 'Initializing Tex’s cognition...';

async function fetchThought() {
  try {
    const response = await fetch('last_spoken_thought.json');
    const data = await response.json();

    const newThought = data.thought || '...';
    const newEmotion = data.emotion || 'neutral';
    const glow = emotionColors[newEmotion] || emotionColors['neutral'];

    if (newThought !== lastThought) {
      thoughtText.textContent = newThought;
      lastThought = newThought;
    }

    if (glow !== currentColor) {
      document.body.style.setProperty('--glow', glow);
      currentColor = glow;
    }
  } catch (err) {
    console.warn('Thought fetch error:', err);
  }
}

setInterval(fetchThought, 2000); // Check for new thought every 2 seconds
