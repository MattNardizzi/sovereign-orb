export function startRenderLoop(renderer, scene, camera, orb, orbMat) {
  let drift = 0;

  function animate(t) {
    const time = t * 0.001;
    orbMat.uniforms.time.value = time;

    drift += 0.002;
    orb.rotation.x = Math.sin(time * 0.3) * 0.12 + Math.sin(drift) * 0.03;
    orb.rotation.y = time * 0.4 + Math.sin(drift * 0.6) * 0.07;
    orb.rotation.z = Math.cos(time * 0.2) * 0.015;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
