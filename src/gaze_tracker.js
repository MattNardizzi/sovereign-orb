let gazeTarget = { x: 0, y: 0 };
let orbTarget = { x: 0, y: 0 };

export function attachGazeTracker(orb) {
  webgazer.setGazeListener((data, timestamp) => {
    if (data) {
      // Normalize gaze position
      gazeTarget.x = (data.x / window.innerWidth - 0.5);
      gazeTarget.y = (data.y / window.innerHeight - 0.5);
    }
  }).begin();

  webgazer.showVideo(false).showFaceOverlay(false).showFaceFeedbackBox(false);

  // Apply gaze to orb in animation frame loop
  const damp = 0.05;

  function updateGaze() {
    // Smooth toward gaze target
    orbTarget.x += (gazeTarget.x - orbTarget.x) * damp;
    orbTarget.y += (gazeTarget.y - orbTarget.y) * damp;

    // Apply subtle rotation
    orb.rotation.y = orbTarget.x * 0.5;
    orb.rotation.x = -orbTarget.y * 0.3;

    requestAnimationFrame(updateGaze);
  }

  updateGaze();
}
