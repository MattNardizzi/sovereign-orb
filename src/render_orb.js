// engine/render_orb.js

export class SovereignOrb {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 6;

    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setClearColor(0x000000, 0);

    this.emotionColor = '#6ed6ff';
    this.currentColor = '#6ed6ff';

    this._setupLights();
    this._setupOrb();
    this._bindResize();
    this._loop();
  }

  _setupLights() {
    const light1 = new THREE.PointLight(0xffffff, 1.2);
    light1.position.set(4, 3, 5);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0x111144, 0.4);
    light2.position.set(-3, -2, -4);
    this.scene.add(light2);
  }

  _setupOrb() {
    const geometry = new THREE.SphereGeometry(2, 128, 128);
    const material = new THREE.MeshStandardMaterial({
      color: 0x6ed6ff,
      roughness: 0.2,
      metalness: 0.6,
      emissive: 0x001122,
      emissiveIntensity: 0.4
    });

    this.orb = new THREE.Mesh(geometry, material);
    this.scene.add(this.orb);
    this.material = material;
  }

  _bindResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  _loop() {
    const t = performance.now() * 0.001;

    this.orb.rotation.y += 0.01;
    this.orb.rotation.x += 0.005;

    const breath = 0.35 + Math.sin(t * 2.4 + Math.cos(t * 0.4)) * 0.2;
    this.material.emissiveIntensity = breath;

    this.currentColor = this._lerpColor(this.currentColor, this.emotionColor, 0.07);
    this.canvas.style.boxShadow = `0 0 120px 40px ${this.currentColor}`;
    this.canvas.style.filter = `drop-shadow(0 0 28px ${this.currentColor})`;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this._loop());
  }

  _lerpColor(a, b, t) {
    const ca = parseInt(a.slice(1), 16);
    const cb = parseInt(b.slice(1), 16);
    const r = (ca >> 16) + ((cb >> 16) - (ca >> 16)) * t;
    const g = ((ca >> 8 & 255) + ((cb >> 8 & 255) - (ca >> 8 & 255)) * t);
    const bl = (ca & 255) + ((cb & 255) - (ca & 255)) * t;
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(bl)})`;
  }

  updateEmotionColor(hex) {
    this.emotionColor = hex;
  }
}
