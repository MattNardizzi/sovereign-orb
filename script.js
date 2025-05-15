const orbCanvas = document.getElementById('orb');
const thoughtText = document.getElementById('thought');
const voiceStatus = document.getElementById('voice-status');

// Emotion → glow mapping
const emotionColors = {
  neutral: '#6ed6ff',
  focused: '#00bfff',
  happy: '#a3ffab',
  anxious: '#ffd966',
  angry: '#ff4d4d',
  sad: '#8899ff',
  mutated: '#ff00ff'
};

let currentColor = '#6ed6ff';
let targetColor = '#6ed6ff';
let lastThought = 'Tex is stabilizing...';

// Smooth color interpolation
function lerpColor(a, b, t) {
  const ca = parseInt(a.slice(1), 16);
  const cb = parseInt(b.slice(1), 16);
  const r = (ca >> 16) + ((cb >> 16) - (ca >> 16)) * t;
  const g = ((ca >> 8) & 255) + (((cb >> 8) & 255) - ((ca >> 8) & 255)) * t;
  const bVal = (ca & 255) + ((cb & 255) - (ca & 255)) * t;
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(bVal)})`;
}

// Live thought + glow sync
async function fetchThought() {
  try {
    const res = await fetch('public_data/last_spoken_thought.json?_t=' + Date.now());
    const data = await res.json();

    const newThought = data.thought || '...';
    const emotion = data.emotion || 'neutral';
    targetColor = emotionColors[emotion] || emotionColors.neutral;

    if (newThought !== lastThought) {
      lastThought = newThought;
      displayTypedThought(newThought);
    }
  } catch (err) {
    console.warn('[Tex] Failed to fetch thought:', err);
  }
}

// Thought typing animation
function displayTypedThought(text) {
  thoughtText.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    thoughtText.textContent += text[i++];
    if (i >= text.length) clearInterval(interval);
  }, 32 + Math.random() * 18);
}

// Alive animation loop
function animateOrb() {
  requestAnimationFrame(animateOrb);
  const t = Date.now() * 0.001;
  const scale = 1 + 0.02 * Math.sin(t * 1.7 + Math.cos(t * 0.5));

  currentColor = lerpColor(currentColor, targetColor, 0.05);
  orbCanvas.style.transform = `scale(${scale}) rotate(${(t * 15) % 360}deg)`;
  orbCanvas.style.boxShadow = `0 0 90px 30px ${currentColor}`;
  orbCanvas.style.filter = `drop-shadow(0 0 24px ${currentColor})`;
}

setInterval(fetchThought, 2000);
animateOrb();
