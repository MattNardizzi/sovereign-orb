let userIsLooking = false;

const orb = document.getElementById('orb');
const thought = document.getElementById('thought');

// Glow states
const glowWhenWatched = '0 0 180px 60px #afff4b';
const glowIdle = '0 0 60px 20px #6ed6ff';

function startGazeTracking() {
  if (!window.webgazer) return console.warn('WebGazer not loaded.');

  webgazer.setGazeListener((data) => {
    if (data == null) return;

    const gazeX = data.x;
    const gazeY = data.y;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const dist = Math.sqrt((gazeX - centerX) ** 2 + (gazeY - centerY) ** 2);
    const lookingAtOrb = dist < 180;

    if (lookingAtOrb !== userIsLooking) {
      userIsLooking = lookingAtOrb;

      orb.style.boxShadow = userIsLooking ? glowWhenWatched : glowIdle;

      // Add a visual confirmation text pulse
      if (userIsLooking) {
        thought.textContent = "👁 I see you.";
      } else {
        thought.textContent = "Tex is waiting...";
      }
    }
  }).begin();
}

window.addEventListener('load', () => {
  setTimeout(startGazeTracking, 1500);
});
