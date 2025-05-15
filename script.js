const canvas = document.getElementById('orb');
const thought = document.getElementById('thought');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); // transparent background

const geometry = new THREE.SphereGeometry(2, 128, 128);
const material = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(0x6ed6ff),
  emissive: new THREE.Color(0x6ed6ff),
  emissiveIntensity: 0.35,
  transmission: 0.98,
  thickness: 1.0,
  roughness: 0.15,
  metalness: 0.05,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});

const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

const light1 = new THREE.PointLight(0x6ed6ff, 1.1);
light1.position.set(3, 4, 5);
scene.add(light1);

const light2 = new THREE.PointLight(0x111133, 0.5);
light2.position.set(-2, -3, -3);
scene.add(light2);

const emotionColors = {
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

  orb.rotation.y += 0.002 + Math.sin(t * 0.25) * 0.001;
  orb.rotation.x += 0.001 + Math.cos(t * 0.3) * 0.0006;

  const breath = 0.3 + Math.sin(t * 1.9 + Math.sin(t * 0.4)) * 0.25;
  material.emissiveIntensity = breath;

  material.roughness = 0.1 + Math.abs(Math.sin(t * 2.3)) * 0.08;

  currentGlow = lerpColor(currentGlow, targetGlow, 0.06);
  canvas.style.boxShadow = `0 0 110px 40px ${currentGlow}`;
  canvas.style.filter = `drop-shadow(0 0 26px ${currentGlow})`;

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
  }, 26 + Math.random() * 18);
}

async function fetchCognition() {
  try {
    const res = await fetch('last_spoken_thought.json?_t=' + Date.now());
    const data = await res.json();

    const newThought = data.thought || '...';
    const emotion = data.emotion || 'neutral';
    targetGlow = emotionColors[emotion] || emotionColors.neutral;

    if (newThought !== lastThought) {
      lastThought = newThought;
      updateThought(newThought);
    }
  } catch (err) {
    console.warn('[Tex] Failed to fetch thought:', err);
  }
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
setInterval(fetchCognition, 2000);
