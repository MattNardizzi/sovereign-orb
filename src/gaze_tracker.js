import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

let mouse = new THREE.Vector2(0, 0);
let targetRotation = new THREE.Vector2(0, 0);
let easing = 0.05; // smoothness of orb movement

// Call once at startup
export function enableGazeTracking() {
  window.addEventListener('mousemove', (event) => {
    // Normalize mouse position (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
}

// Call each frame
export function updateOrbGaze(orb) {
  if (!orb) return;

  // Smooth interpolation to avoid sharp movement
  targetRotation.x += (mouse.y * 0.25 - targetRotation.x) * easing;
  targetRotation.y += (mouse.x * 0.25 - targetRotation.y) * easing;

  // Apply small rotation adjustments (clamped)
  orb.rotation.x = targetRotation.x;
  orb.rotation.y = targetRotation.y;
}
