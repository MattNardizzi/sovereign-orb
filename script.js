const orb = document.getElementById('orb');
const thoughtText = document.getElementById('thought');

let lastEmotion = 'neutral';
let lastThought = 'Initializing...';
let glowColor = '#6ed6ff';
let breathRate = 1.7;

// Emotion → glow color map
const emotionColors = {
  neutral: '#6ed6ff',
  happy: '#a3ffab',
  focused: '#00bfff',
  angry: '#ff4d4d',
  anxious: '#ffd966',
  sad: '#8899ff',
  mutated: '#ff00ff'
};

// Emotion → breath rhythm map (lower is slower)
const emotionBreaths = {
  neutral: 1.7,
  happy: 1.3,
  focused: 1.1,
  angry: 2.3,
  anxious: 2.6,
  sad: 2.0,
  mutated: 3.3
};

// Fetch Tex’s latest thought + emotion
async function fetchThoughtData() {
  try {
    const res = await fetch('last_spoken_thought.json?_t=' + Date.now());
    const data = await res.json();

    const newThought = data.thought || '...';
    const newEmotion = data.emotion || 'neutral';

    // Thought update
    if (newThought !== lastThought) {
      lastThought = newThought;
      fadeInThought(newThought);
    }

    // Emotion change → update glow + breathing
    if (newEmotion !== lastEmotion) {
      lastEmotion = newEmotion;
      glowColor = emotionColors[newEmotion] || '#6ed6ff';
      breathRate = emotionBreaths[newEmotion] || 1.7;

      orb.style.boxShadow = `0 0 80px 30px ${glowColor}`;
      orb.style.filter = `drop-shadow(0 0 24px ${glowColor}55)`;
    }

  } catch (err) {
    console.warn('[⚠️] Thought fetch failed:', err);
  }
}

// Animate breathing, twitching, drifting
function animateOrb() {
  const t = Date.now() / 1000;

  // Breathing rhythm (based on emotion)
  const scale = 1 + 0.015 * Math.sin(t * breathRate);
  const rotateY = (t * 0.6) % 360;
  const microTwitch = Math.sin(t * 17) * 0.003;

  orb.style.transform = `scale(${scale}) rotate(${rotateY}deg) translateY(${microTwitch}px)`;
  requestAnimationFrame(animateOrb);
}

// Smooth text reveal
function fadeInThought(text) {
  thoughtText.style.opacity = 0;
  setTimeout(() => {
    thoughtText.textContent = text;
    thoughtText.style.opacity = 1;
  }, 300 + Math.random() * 200); // slight async lag = realism
}

// Loop
setInterval(fetchThoughtData, 2000);
animateOrb();
