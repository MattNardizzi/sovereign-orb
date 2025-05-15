const orbCanvas = document.getElementById('orb');
const thoughtText = document.getElementById('thought');

// Emotion color map
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
let lastThought = 'Initializing Tex...';
let flickerCounter = 0;

// Live update from JSON
async function fetchThought() {
  try {
    const res = await fetch('last_spoken_thought.json?_t=' + Date.now()); // prevent caching
    const data = await res.json();

    const newThought = data.thought || '...';
    const emotion = data.emotion || 'neutral';
    const glowColor = emotionColors[emotion] || emotionColors['neutral'];

    // Update thought
    if (newThought !== lastThought) {
      thoughtText.textContent = newThought;
      lastThought = newThought;
    }

    // Update glow
    if (glowColor !== currentColor) {
      orbCanvas.style.boxShadow = `0 0 60px 25px ${glowColor}`;
      currentColor = glowColor;
    }

  } catch (err) {
    console.warn('[Tex] Could not fetch thought:', err);
  }
}

// Micro-jitter animation loop for realism
function loopTwitch() {
  const t = Date.now() * 0.002;
  const flicker = 0.02 * Math.sin(t * 3 + Math.random()) + Math.random() * 0.005;
  const scale = 1 + flicker;

  orbCanvas.style.transform = `scale(${scale}) rotate(${(t % 360)}deg)`;
  orbCanvas.style.filter = `drop-shadow(0 0 12px ${currentColor}88)`;

  requestAnimationFrame(loopTwitch);
}

// Pull cognition every 2 seconds
setInterval(fetchThought, 2000);
loopTwitch();
