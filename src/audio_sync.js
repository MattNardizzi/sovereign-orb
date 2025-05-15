export function setupAudioInput(onVolume) {
  navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 512;

    const data = new Uint8Array(analyser.frequencyBinCount);
    source.connect(analyser);

    function update() {
      analyser.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      const volume = sum / data.length / 255;

      const eased = Math.min(1.5, Math.max(0, volume * 2.5));
      onVolume(eased);

      requestAnimationFrame(update);
    }

    update();
  }).catch(err => {
    console.warn('🎙️ Microphone access failed:', err);
  });
}
