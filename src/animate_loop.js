export function startRenderLoop(renderer, scene, camera, orb, orbMat) {
  let driftPhase = 0;
  let twitchPhase = 0;
  let driftNoise = Math.random() * 100;
  let lastTwitch = 0;

  function animate(t) {
    const time = t * 0.001;
    orbMat.uniforms.time.value = time;

    // Drift
    driftPhase += 0.001;
    const drift = Math.sin(driftPhase + driftNoise) * 0.04;

    // Biotwitch (rare, fast micro-movement)
    const now = performance.now();
    const twitch = (now - lastTwitch > 3000 && Math.random() < 0.003)
      ? (lastTwitch = now, (Math.random() - 0.5) * 0.2)
      : 0;

    // Apply combined motion
    orb.rotation.x = Math.sin(time * 0.3) * 0.1 + drift;
    orb.rotation.y = time * 0.4 + Math.sin(driftPhase * 0.7) * 0.05 + twitch;
    orb.rotation.z = Math.cos(time * 0.2) * 0.015;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
