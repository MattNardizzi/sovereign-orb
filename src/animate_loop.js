import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { orbMaterial } from './shader_material.js';

const clock = new THREE.Clock();
const lastBreathOffset = Math.random() * Math.PI * 2;

export function animateOrb(renderer, scene, camera) {
  function animate() {
    requestAnimationFrame(animate);

    const elapsed = clock.getElapsedTime();

    // Time uniform for shader
    orbMaterial.uniforms.time.value = elapsed;

    // Smooth breathing modulation
    const breathRate = 0.4 + Math.sin(elapsed * 0.12 + lastBreathOffset) * 0.05;
    orbMaterial.uniforms.breath.value = breathRate;

    // Consistent twitch effect
    const twitchSpeed = 2.5;
    const twitchAmplitude = 0.03;
    const twitch = Math.sin(elapsed * twitchSpeed) * twitchAmplitude;
    orbMaterial.uniforms.pulse.value = 1.0 + twitch;

    // Render the scene
    renderer.render(scene, camera);
  }

  animate();
}
