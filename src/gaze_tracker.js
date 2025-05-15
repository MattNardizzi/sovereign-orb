export function attachGazeTracker(orb) {
  webgazer.setGazeListener((data, timestamp) => {
    if (data) {
      const x = data.x / window.innerWidth - 0.5;
      const y = data.y / window.innerHeight - 0.5;

      // Subtle gaze-based orb rotation
      orb.rotation.y += x * 0.002;
      orb.rotation.x += -y * 0.002;
    }
  }).begin();

  // Hide webcam overlays
  webgazer.showVideo(false).showFaceOverlay(false).showFaceFeedbackBox(false);
}
