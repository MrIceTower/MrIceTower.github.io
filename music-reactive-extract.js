// Audio setup
const ctx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = ctx.createAnalyser();
analyser.fftSize = 1024;
analyser.smoothingTimeConstant = 0.75;
const src = ctx.createMediaElementSource(audioEl);
src.connect(analyser);
analyser.connect(ctx.destination);

// Per-frame: read bands and react
const data = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(data);
const avg = (a, b) => {
  let s = 0; for (let i = a; i < b; i++) s += data[i];
  return s / ((b - a) * 255);
};
const bass    = avg(0, Math.floor(data.length * 0.08));
const mid     = avg(Math.floor(data.length * 0.08), Math.floor(data.length * 0.4));
const treble  = avg(Math.floor(data.length * 0.4), data.length);

// Beat detection on bass spikes
if (bass - lastBass > 0.18 && t - lastBeat > 180) {
  lastBeat = t; beatPulse = 1; carBounce = 1;
}
lastBass = bass;
beatPulse *= 0.9;
carBounce *= 0.85;

// Then bass drives sun/glow size, treble brightens stars, beat bounces the car
