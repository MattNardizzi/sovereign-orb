export function setupAudioInput(onVolumeChange) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const micSource = audioContext.createMediaStreamSource(stream);
    micSource.connect(analyser);

    let ema = 0;            // Smoothed volume
    let silenceThreshold = 0.05;
    let lastActive = Date.now();

    function analyze() {
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }

      const raw = sum / bufferLength / 100;       // Normalize
      ema = ema * 0.9 + raw * 0.1;                // Exponential smoothing
      const clamped = Math.min(ema, 1.5);

      if (clamped > silenceThreshold) {
        lastActive = Date.now();
      }

      const timeSinceActive = Date.now() - lastActive;
      const silence = timeSinceActive > 3000;     // More than 3s of quiet

      onVolumeChange({
        rawVolume: raw,
        smoothedVolume: clamped,
        silence,
        timeSinceActive
      });

      requestAnimationFrame(analyze);
    }

    analyze();
  }).catch(err => {
    console.error("🎙 Microphone access denied or failed:", err);
  });
}
