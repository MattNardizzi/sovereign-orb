let audioContext, analyser, micSource, dataArray;
let currentVolume = 0;
const SMOOTHING = 0.15;
const GAIN_MULTIPLIER = 2.5;

export function setupAudioInput(onVolume) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('❌ No audio input available on this device');
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      // Setup AudioContext
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      micSource = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;

      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      micSource.connect(analyser);
      requestAnimationFrame(() => pollVolume(onVolume));
      console.log('🎤 Microphone input initialized');
    })
    .catch(err => {
      console.warn('⚠️ Microphone access failed:', err);
    });
}

function pollVolume(callback) {
  if (!analyser) return;

  analyser.getByteFrequencyData(dataArray);

  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum += dataArray[i];
  }

  const raw = sum / dataArray.length / 255;
  const boosted = Math.min(1.0, raw * GAIN_MULTIPLIER); // Clamp to 0.0–1.0
  currentVolume = currentVolume * (1 - SMOOTHING) + boosted * SMOOTHING;

  if (typeof callback === 'function') {
    callback(currentVolume);
  }

  requestAnimationFrame(() => pollVolume(callback));
}
