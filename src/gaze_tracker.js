import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';
import { getCurrentEmotionIntensity } from './emotion_engine.js';

let mouse = new THREE.Vector2(0, 0);
let target = new THREE.Vector2(0, 0);
let lastMouseMoveTime = performance.now();
let lastSeen = 0;

const baseEasing = 0.05;
const maxRotation = 0.3; // Maximum gaze arc (radians)
const decayTime = 8;     // Seconds before reset to center

export function enableGazeTracking() {
  window.addEventListener('mousemove', (event) => {
    lastMouseMoveTime = performance.now();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
}

export function updateOrbGaze(orb) {
  if (!orb) return;

  const now = performance.now();
  const timeSinceMove = (now - lastMouseMoveTime) * 0.001;

  // Gaze intensity = emotional volatility
  const emotion = getCurrentEmotionIntensity(); // 0.0 – 1.0
  const gazeSensitivity = baseEasing + emotion * 0.07;

  // Target rot scales with emotion volatility too
  const targetX = mouse.y * maxRotation * (0.6 + emotion);
  const targetY = mouse.x * maxRotation * (0.6 + emotion);

  // Inactivity reset after delay
  if (timeSinceMove > decayTime) {
    target.set(0, 0); // neutral forward
  } else {
    target.set(targetX, targetY);
  }

  // Interpolate toward target smoothly
  orb.rotation.x += (target.x - orb.rotation.x) * gazeSensitivity;
  orb.rotation.y += (target.y - orb.rotation.y) * gazeSensitivity;
}
