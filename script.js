const canvas = document.getElementById('orb');
const thought = document.getElementById('thought');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const geometry = new THREE.SphereGeometry(2, 128, 128);

const material = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0x6ed6ff),
  emissive: new THREE.Color(0x6ed6ff),
  emissiveIntensity: 0.3,
  transmission: 0.85,
  thickness: 1.0,
  roughness: 0.25,
  metalness: 0.05,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});

const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

const light1 = new THREE.PointLight(0x6ed6ff, 0.9);
light1.position.set(3, 4, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0x111133, 0.4);
light2.position.set(-2, -3, -2);
scene.add(light2);

camera.position.z = 6;

// Emotion colors
const emotionMap = {
  neutral: '#6ed6ff',
  focused: '#00bfff',
  happy: '#a3ffab',
  anxious: '#ffd966',
  angry: '#ff4d4d',
  sad: '#8899ff',
  mutated: '#ff00ff'
};

let targetGlow = '#6ed6ff';
let currentGlow = '#6ed6ff';
let lastThought = '';

function animate() {
  requestAnimationFrame(animate);
  const t = Date.now() * 0.001;

  // Drift rotation
  orb.rotation.y += 0.002 + Math.sin(t * 0.25) * 0.001;
  orb.rotation.x += 0.001 + Math.cos(t * 0.33) * 0.0005;

  // Breathing pulse
  const breath = 0.3 + Math.sin(t * 1.8 + Math.sin(t * 0.4)) * 0.22;
  material.emissiveIntensity = breath;

  // Shimmer flicker
  material.roughness = 0.15 + Math.abs(Math.sin(t * 2.2)) * 0.1;

  // Glow shift
  currentGlow = lerpColor(currentGlow, targetGlow, 0.06);
  canvas.style.boxShadow = `0 0 100px 35px ${currentGlow}`;
  canvas.style.filter = `drop-shadow(0 0 24px ${currentGlow})`;

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

function updateThought(text) {
  thought.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    thought.textContent += text[i++];
    if (i >= text.length) clearInterval(interval);
  }, 28 + Math.random() * 20);
}

async function fetchCognition() {
  try {
    const res = await fetch('last_spoken_thought.json?_t=' + Date.now());
    const data = await res.json();

    const newThought = data.thought || '...';
    const emotion = data.emotion || 'neutral';
    targetGlow = emotionMap[emotion] || emotionMap.neutral;

    if (newThought !== lastThought) {
      lastThought = newThought;
      updateThought(newThought);
    }
  } catch (err) {
    console.warn('[Tex] Thought fetch failed.', err);
  }
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
setInterval(fetchCognition, 2000);
