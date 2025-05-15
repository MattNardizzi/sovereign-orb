import { orbMaterial } from './shader_material.js';

let clock = new THREE.Clock();
let lastBreathOffset = Math.random() * Math.PI * 2;

export function animateOrb(renderer, scene, camera) {
  function animate() {
    requestAnimationFrame(animate);

    let elapsed = clock.getElapsedTime();

    // Update time uniform
    orbMaterial.uniforms.time.value = elapsed;

    // Breathing modulation (non-sinusoidal + offset)
    let breathRate = 0.4 + Math.sin(elapsed * 0.12 + lastBreathOffset) * 0.05;
    orbMaterial.uniforms.breath.value = breathRate;

    // Micro pulse twitch (irregularity)
    let twitch = Math.sin(elapsed * (2.0 + Math.random() * 0.5)) * 0.04;
    orbMaterial.uniforms.pulse.value = 1.0 + twitch;

    renderer.render(scene, camera);
  }

  animate();
}
