let userIsLooking = false;

// Glow adjustment range
const glowWhenWatched = '0 0 70px 30px #a3ffab';
const glowIdle = '0 0 60px 20px #6ed6ff';

// Gaze detection loop
function startGazeTracking() {
  if (!window.webgazer) return console.warn('WebGazer not loaded.');

  webgazer.setGazeListener((data, elapsedTime) => {
    if (data == null) return;

    const gazeX = data.x;
    const gazeY = data.y;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const dist = Math.sqrt((gazeX - centerX) ** 2 + (gazeY - centerY) ** 2);
    const lookingAtOrb = dist < 200;

    if (lookingAtOrb !== userIsLooking) {
      userIsLooking = lookingAtOrb;
      document.getElementById('orb').style.boxShadow = userIsLooking ? glowWhenWatched : glowIdle;
    }
  }).begin();
}

window.addEventListener('load', () => {
  setTimeout(startGazeTracking, 1500);
});
