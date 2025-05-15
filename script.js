const canvas = document.getElementById('orb');
const thought = document.getElementById('thought');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);

// Orb
const geometry = new THREE.SphereGeometry(2, 128, 128);
const material = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0x6ed6ff),
  emissive: new THREE.Color(0x6ed6ff),
  emissiveIntensity: 0.25,
  transmission: 0.96,
  thickness: 1.0,
  roughness: 0.15,
  metalness: 0.1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});

const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

// Lighting
const lightA = new THREE.PointLight(0x6ed6ff, 1.2);
lightA.position.set(3, 3, 4);
scene.add(lightA);

const lightB = new THREE.PointLight(0x111133, 0.5);
lightB.position.set(-3, -4, -3);
scene.add(lightB);

// Emotion glow map
const emotions = {
  neutral: '#6ed6ff',
  focused: '#00bfff',
  anxious: '#ffd966',
  angry: '#ff4d4d',
  sad: '#8899ff',
  mutated: '#ff00ff',
  happy: '#a3ffab'
};

let currentGlow = '#6ed6ff';
let targetGlow = '#6ed6ff';
let lastThought = '';

function animate() {
  requestAnimationFrame(animate);
  const t = performance.now() * 0.001;

  orb.rotation.y += 0.004 + Math.sin(t * 0.3) * 0.0015;
  orb.rotation.x += 0.003 + Math.cos(t * 0.2) * 0.001;

  material.emissiveIntensity = 0.3 + Math.sin(t * 2.5) * 0.25;
  material.roughness = 0.1 + Math.abs(Math.sin(t * 2.8)) * 0.08;

  currentGlow = lerpColor(currentGlow, targetGlow, 0.05);
  canvas.style.boxShadow = `0 0 120px 38px ${currentGlow}`;
  canvas.style.filter = `drop-shadow(0 0 30px ${currentGlow})`;

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
  }, 25 + Math.random() * 18);
}

async function loadCognition() {
  try {
    const res = await fetch('last_spoken_thought.json?_t=' + Date.now());
    const data = await res.json();

    const newThought = data.thought || '...';
    const emotion = data.emotion || 'neutral';

    targetGlow = emotions[emotion] || emotions.neutral;

    if (newThought !== lastThought) {
      lastThought = newThought;
      typeThought(newThought);
    }
  } catch (err) {
    console.warn('[Sovereign] cognition stream failed.', err);
  }
}

setInterval(loadCognition, 2000);
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
