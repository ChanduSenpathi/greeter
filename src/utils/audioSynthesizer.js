let audioCtx = null;
let melodyInterval = null;
let noteTimeouts = [];

export function getAudioContext() {
  if (!audioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioCtx = new AudioCtx();
  }
  if (audioCtx && audioCtx.state === 'suspended' && document.visibilityState === 'visible') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function suspendAudio() {
  stopBirthdayMelody();
  if (audioCtx && audioCtx.state === 'running') {
    audioCtx.suspend().catch(() => {});
  }
}

export function resumeAudio(isSoundEnabled = true) {
  if (!isSoundEnabled || document.visibilityState === 'hidden') return;
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().then(() => {
      playBirthdayMelody(isSoundEnabled);
    }).catch(() => {});
  } else {
    playBirthdayMelody(isSoundEnabled);
  }
}

export function playTone(freq, duration = 0.25, type = 'sine', gainVal = 0.15, isSoundEnabled = true) {
  if (!isSoundEnabled || document.visibilityState === 'hidden') return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(gainVal, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {}
}

export function playPopSound(isSoundEnabled = true) {
  if (!isSoundEnabled || document.visibilityState === 'hidden') return;
  playTone(587.33, 0.08, 'triangle', 0.18, isSoundEnabled);
  setTimeout(() => playTone(880, 0.12, 'sine', 0.15, isSoundEnabled), 30);
}

export function playBlowSound(isSoundEnabled = true) {
  if (!isSoundEnabled || document.visibilityState === 'hidden') return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.35);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch (e) {}
}

export function playChimeVictory(isSoundEnabled = true) {
  if (!isSoundEnabled || document.visibilityState === 'hidden') return;
  const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
  notes.forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 0.45, 'triangle', 0.15, isSoundEnabled), idx * 90);
  });
}

export function playRocketWhistle(isSoundEnabled = true) {
  if (!isSoundEnabled || document.visibilityState === 'hidden') return;
  const ctx = getAudioContext();
  if (!ctx || ctx.state === 'suspended') return;
  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(1050, now + 0.32);
    gain.gain.setValueAtTime(0.045, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  } catch (e) {}
}

export function playBirthdayMelody(isSoundEnabled = true) {
  if (!isSoundEnabled || document.visibilityState === 'hidden') return;
  stopBirthdayMelody();

  const score = [
    { note: 261.63, dur: 0.28 },
    { note: 261.63, dur: 0.28 },
    { note: 293.66, dur: 0.52 },
    { note: 261.63, dur: 0.52 },
    { note: 349.23, dur: 0.52 },
    { note: 329.63, dur: 1.05 },
    { note: 0, dur: 0.3 },
    { note: 261.63, dur: 0.28 },
    { note: 261.63, dur: 0.28 },
    { note: 293.66, dur: 0.52 },
    { note: 261.63, dur: 0.52 },
    { note: 392.00, dur: 0.52 },
    { note: 349.23, dur: 1.05 },
    { note: 0, dur: 0.3 },
    { note: 261.63, dur: 0.28 },
    { note: 261.63, dur: 0.28 },
    { note: 523.25, dur: 0.52 },
    { note: 440.00, dur: 0.52 },
    { note: 349.23, dur: 0.52 },
    { note: 329.63, dur: 0.52 },
    { note: 293.66, dur: 1.05 },
    { note: 0, dur: 0.3 },
    { note: 466.16, dur: 0.28 },
    { note: 466.16, dur: 0.28 },
    { note: 440.00, dur: 0.52 },
    { note: 349.23, dur: 0.52 },
    { note: 392.00, dur: 0.52 },
    { note: 349.23, dur: 1.45 }
  ];

  let timeOffset = 0;
  score.forEach(item => {
    if (item.note > 0) {
      const tid = setTimeout(() => {
        if (document.visibilityState === 'visible') {
          playTone(item.note, item.dur * 0.95, 'triangle', 0.16, isSoundEnabled);
        }
      }, timeOffset * 1000);
      noteTimeouts.push(tid);
    }
    timeOffset += item.dur;
  });

  melodyInterval = setTimeout(() => {
    if (document.visibilityState === 'visible') {
      playBirthdayMelody(isSoundEnabled);
    }
  }, (timeOffset + 2.5) * 1000);
}

export function stopBirthdayMelody() {
  if (melodyInterval) {
    clearTimeout(melodyInterval);
    melodyInterval = null;
  }
  noteTimeouts.forEach(tid => clearTimeout(tid));
  noteTimeouts = [];
}

