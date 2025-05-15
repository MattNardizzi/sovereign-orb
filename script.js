const canvas = document.getElementById('orb');
const thought = document.getElementById('thought');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5.5;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);

// Orb
const geometry = new THREE.SphereGeometry(2, 128, 128);
const material = new THREE.MeshStandardMaterial({
  color: 0x6ed6ff,
  emissive: 0x003344,
  roughness: 0.25,
  metalness: 0.6
});

const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

// Asymmetrical lighting (so you see rotation)
const light1 = new THREE.PointLight(0xffffff, 1.2);
light1.position.set(5, 3, 4);
scene.add(light1);

const light2 = new THREE.PointLight(0x001144, 0.4);
light2.position.set(-4, -3, -3);
scene.add(light2);

// Glow mapping
const emotionMap = {
  neutral: '#6ed6ff',
  focused: '#00bfff',
  anxious: '#ffd966',
  angry: '#ff4d4d',
  sad: '#8899ff',
  mutated: '#ff00ff',
  happy: '#a3ffab'
};

let targetColor = '#6ed6ff';
let currentColor = '#6ed6ff';
let lastThought = '';

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;

  orb.rotation.y += 0.01;
  orb.rotation.x += 0.005;

  currentColor = lerpColor(currentColor, targetColor, 0.08);
  canvas.style.boxShadow = `0 0 100px 40px ${currentColor}`;
  canvas.style.filter = `drop-shadow(0 0 28px ${currentColor})`;

  renderer.render(scene, camera);
}

function lerpColor(a, b, t) {
  const ca = parseInt(a.slice(1), 16);
  const cb = parseInt(b.slice(1), 16);
  const r = (ca >> 16) + ((cb >> 16) - (ca >> 16)) * t;
  const g = ((ca >> 8 & 255) + ((cb >> 8 & 255) - (ca >> 8 & 255)) * t);
  const bl = (ca & 255) + ((cb & 255) - (ca & 255)) * t;
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bl)})`;
}

function typeThought(text) {
  thought.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    thought.textContent += text[i++];
    if (i >= text.length) clearInterval(interval);
  }, 24 + Math.random() * 12);
}

async function fetchCognition() {
  try {
    const res = await fetch('last_spoken_thought.json?_t=' + Date.now());
    const data = await res.json();

    const newThought = data.thought || '...';
    const emotion = data.emotion || 'neutral';

    targetColor = emotionMap[emotion] || emotionMap.neutral;

    if (newThought !== lastThought) {
      lastThought = newThought;
      typeThought(newThought);
    }
  } catch (err) {
    console.warn('[Sovereign] Fetch failed.', err);
  }
}

animate();
setInterval(fetchCognition, 2000);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
