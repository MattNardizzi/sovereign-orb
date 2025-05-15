let audioCtx;
let analyser;
let source;
let orb = document.getElementById('orb');
let thought = document.getElementById('thought');

function setupAudioGlow() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      analyser = audioCtx.createAnalyser();
      source = audioCtx.createMediaStreamSource(stream);

      source.connect(analyser);
      analyser.fftSize = 256;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let lastSurge = 0;

      function pulse() {
        analyser.getByteFrequencyData(dataArray);
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        const intensity = Math.min(volume / 100, 1.5);
        const glowSize = 30 + intensity * 100;
        const scale = 1 + intensity * 0.2;

        orb.style.boxShadow = `0 0 ${glowSize}px ${glowSize / 1.3}px #00e1ff`;
        orb.style.transform = `scale(${scale})`;

        // Text response only when volume spike occurs
        const now = Date.now();
        if (volume > 25 && now - lastSurge > 3000) {
          thought.textContent = "🧠 Listening...";
          lastSurge = now;
        }

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
