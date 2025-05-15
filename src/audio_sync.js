let audioContext, analyser, micSource, dataArray;
let currentVolume = 0;
const SMOOTHING = 0.12;
const GAIN_MULTIPLIER = 3.0;
const NOISE_FLOOR = 0.005;

export function setupAudioInput(onVolume) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('❌ No microphone input available.');
    onVolume(0.0); // Silent fallback
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      micSource = audioContext.createMediaStreamSource(stream);

      analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;

      const bufferLength = analyser.fftSize;
      dataArray = new Uint8Array(bufferLength);

      micSource.connect(analyser);

      requestAnimationFrame(() => pollVolume(onVolume));
      console.log('🎤 Mic input initialized');
    })
    .catch(err => {
      console.warn('⚠️ Mic access error:', err);
      onVolume(0.0); // Silent fallback
    });
}

function pollVolume(callback) {
  if (!analyser) return;

  analyser.getByteTimeDomainData(dataArray);

  // Compute root mean square (RMS) volume
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const normalized = (dataArray[i] - 128) / 128; // Centered around 0
    sum += normalized * normalized;
  }

  const rms = Math.sqrt(sum / dataArray.length);
  const boosted = Math.min(1.0, Math.max(0.0, (rms - NOISE_FLOOR) * GAIN_MULTIPLIER));
  currentVolume = currentVolume * (1 - SMOOTHING) + boosted * SMOOTHING;

  if (typeof callback === 'function') {
    callback(currentVolume);
  }

  requestAnimationFrame(() => pollVolume(callback));
}
