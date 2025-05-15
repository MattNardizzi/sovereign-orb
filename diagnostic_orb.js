const canvas = document.getElementById('orb');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0);

// Big obvious orb
const geometry = new THREE.SphereGeometry(2, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  metalness: 0.6,
  roughness: 0.2,
});

const orb = new THREE.Mesh(geometry, material);
scene.add(orb);

// Off-angle light
const light = new THREE.PointLight(0xffffff, 1.5);
light.position.set(4, 4, 4);
scene.add(light);

function animate() {
  requestAnimationFrame(animate);

  // Obvious visible rotation
  orb.rotation.y += 0.01;
  orb.rotation.x += 0.005;

  renderer.render(scene, camera);
}

animate();
