export function setupAudioInput(onVolumeChange) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const micSource = audioContext.createMediaStreamSource(stream);
    micSource.connect(analyser);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function analyze() {
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      const average = sum / bufferLength;
      const normalized = Math.min(average / 80, 1.5); // clamp volume range

      onVolumeChange(normalized);
      requestAnimationFrame(analyze);
    }

    analyze();
  }).catch(err => {
    console.error("🎙 Microphone access denied or failed:", err);
  });
}
