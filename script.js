const orbCanvas = document.getElementById('orb');
const thoughtText = document.getElementById('thought');

// Emotional spectrum → glow
const emotionMap = {
  neutral: '#6ed6ff',
  happy: '#a3ffab',
  focused: '#00bfff',
  angry: '#ff4d4d',
  anxious: '#ffd966',
  sad: '#8899ff',
  mutated: '#ff00ff'
};

let currentColor = '#6ed6ff';
let targetColor = '#6ed6ff';
let lastThought = 'Initializing cognition...';
let pulsePhase = 0;
let emotionDrift = 0.0;

// Smoothly transition between colors
function lerpColor(a, b, t) {
  const ca = parseInt(a.slice(1), 16);
  const cb = parseInt(b.slice(1), 16);

  const ar = (ca >> 16) & 255, ag = (ca >> 8) & 255, ab = ca & 255;
  const br = (cb >> 16) & 255, bg = (cb >> 8) & 255, bb = cb & 255;

  const rr = Math.round(ar + (br - ar) * t);
  const rg = Math.round(ag + (bg - ag) * t);
  const rb = Math.round(ab + (bb - ab) * t);

  return `rgb(${rr},${rg},${rb})`;
}

// Live cognition + emotional glow sync
async function fetchThought() {
  try {
    const res = await fetch('last_spoken_thought.json?_t=' + Date.now());
    const data = await res.json();

    const newThought = data.thought || '...';
    const emotion = data.emotion || 'neutral';
    const mappedColor = emotionMap[emotion] || emotionMap['neutral'];

    // Only update thought if it's changed
    if (newThought !== lastThought) {
      lastThought = newThought;
      delayedPrint(newThought);
    }

    // Update emotion target
    targetColor = mappedColor;

    // If emotion is mutated, trigger spike
    if (emotion === 'mutated') {
      triggerMutationFlash();
    }

  } catch (err) {
    console.warn('[Tex] Failed to fetch cognition:', err);
  }
}

// Typing effect (to simulate thought forming)
function delayedPrint(text) {
  thoughtText.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    thoughtText.textContent += text[i++];
    if (i >= text.length) clearInterval(interval);
  }, 26 + Math.random() * 40); // irregular cadence
}

// Mutation flash — violent spike
function triggerMutationFlash() {
  orbCanvas.style.transition = 'none';
  orbCanvas.style.transform = 'scale(1.3) rotate(1deg)';
  orbCanvas.style.filter = `drop-shadow(0 0 80px ${targetColor})`;

  setTimeout(() => {
    orbCanvas.style.transition = 'transform 0.4s ease, filter 0.6s ease';
  }, 100);
}

// Lifelike animation loop
function animateOrb() {
  requestAnimationFrame(animateOrb);
  const now = Date.now();
  const t = now * 0.001;

  // Imperfect breathing
  const breath = 0.35 + Math.sin(t * 1.7 + Math.sin(t * 0.33)) * 0.25;
  emotionDrift += (Math.random() - 0.5) * 0.005;
  emotionDrift = Math.max(-0.1, Math.min(0.1, emotionDrift));

  const scale = 1 + 0.02 * Math.sin(t * 0.9) + emotionDrift;
  orbCanvas.style.transform = `scale(${scale}) rotate(${(t * 12) % 360}deg)`;

  // Glow color fade
  currentColor = lerpColor(currentColor, targetColor, 0.08);
  orbCanvas.style.boxShadow = `0 0 60px 20px ${currentColor}`;
  orbCanvas.style.filter = `drop-shadow(0 0 24px ${currentColor})`;
}

// Begin loop and data polling
animateOrb();
setInterval(fetchThought, 2000);
