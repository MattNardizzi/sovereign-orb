let audioCtx;
let analyser;
let source;
let orb = document.getElementById('orb');

function setupAudioGlow() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaStreamSource(stream);

      source.connect(analyser);
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      function pulse() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        const intensity = Math.min(volume / 150, 1.0);
        const glowSize = 20 + intensity * 50;
        const scale = 1 + intensity * 0.1;

        orb.style.boxShadow = `0 0 ${glowSize}px ${glowSize / 1.5}px #6ed6ff`;
        orb.style.transform = `scale(${scale})`;

        requestAnimationFrame(pulse);
      }

      pulse();
    })
    .catch((err) => {
      console.warn('[Audio] Microphone access denied:', err);
    });
}

window.addEventListener('load', () => {
  setTimeout(setupAudioGlow, 1500);
});
