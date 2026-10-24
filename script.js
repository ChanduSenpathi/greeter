/**
 * ============================================================================
 * CYBERWISH - INTERACTIVE ENGINE & CELEBRATION RUNTIME
 * Features:
 *  - Sender Studio vs. Receiver Route Engine (?to=Name&from=Sender&msg=...)
 *  - 3D Interactive Cyber Gift Box with Holographic Tag
 *  - Bottom-to-Top Kinetic Happy Birthday reveal animation
 *  - Interactive Celestial Wishing Beacon (Candle Ceremony)
 *  - Unfolding Holographic Keepsake Letter with Love Reaction
 *  - Interactive Floating Star Wishing Orbs
 *  - Web Audio API Synthesizer (Zero external audio file dependencies)
 *  - Canvas Particle Fireworks, Shooting Stars, Confetti & Heart Showers
 * ============================================================================
 */

(function () {
  'use strict';

  // --- APPLICATION STATE ---
  const state = {
    mode: 'receiver', // 'receiver' or 'studio'
    receiverName: 'Friend',
    senderName: 'Chandu Senapathi',
    wishMessage: "Through every wild adventure, storm we’ve braved together, you have always been my truest anchor.\nHaving you as my best friend isn’t just a blessing—it is proof that the universe gives us chosen family.\nThank you for understanding me even in silence, for standing by me through thick and thin, and for lighting up every room with your genuine soul.\nOn your special day, my deepest wish is that life rewards you with all the peace, pure magic, and boundless love you so selflessly give to the world.\nHappy Birthday to my best friend forever—here’s to an unbreakable bond that will shine across lifetimes!",
    photoUrl: '', // Base64 data URL or external URL for cake topper
    selectedAvatar: null, // Optional avatar icon if no custom photo uploaded
    soundEnabled: false,
    isPlayingMusic: false,
    flameLit: true,
    audioCtx: null,
    melodyInterval: null
  };

  const messagePresets = {
    heartfelt: "Through every wild adventure, storm we’ve braved together, you have always been my truest anchor.\nHaving you as my best friend isn’t just a blessing—it is proof that the universe gives us chosen family.\nThank you for understanding me even in silence, for standing by me through thick and thin, and for lighting up every room with your genuine soul.\nOn your special day, my deepest wish is that life rewards you with all the peace, pure magic, and boundless love you so selflessly give to the world.\nHappy Birthday to my best friend forever—here’s to an unbreakable bond that will shine across lifetimes!",
    joyful: "Happy Birthday! Wishing you 365 days of wild fun, zero stress, massive triumphs, and endless delicious moments!",
    inspirational: "To the brightest star in the universe: may your year ahead be filled with cosmic breakthroughs, pure magic, and all your greatest dreams taking flight!"
  };

  const starBlessings = [
    "🌈 Endless Joy, Deep Laughter & Good Vibes!",
    "🚀 Fearless Adventures, Bold Moves & Massive Wins!",
    "💖 Radiant Health, Inner Peace & Pure Love!",
    "🔥 Unstoppable Energy, Confidence & Drive!",
    "✨ Pure Magic, Unexpected Miracles & Wonder!",
    "👑 Master of Your Destiny, Star of Every Room!",
    "🎂 Sweetest Memories in Every Single Chapter Ahead!"
  ];

  // --- DOM REFERENCES ---
  const ambientCanvas = document.getElementById('ambient-canvas');
  const celebrationCanvas = document.getElementById('celebration-canvas');
  const ambientCtx = ambientCanvas.getContext('2d');
  const celebrationCtx = celebrationCanvas.getContext('2d');

  // Views
  const viewSenderStudio = document.getElementById('view-sender-studio');
  const viewReceiverArrival = document.getElementById('view-receiver-arrival');
  const viewReceiverCelebration = document.getElementById('view-receiver-celebration');

  // Studio Elements
  const inputToName = document.getElementById('input-to-name');
  const inputFromName = document.getElementById('input-from-name');
  const inputWishMsg = document.getElementById('input-wish-msg');
  const previewTo = document.getElementById('preview-to');
  const previewFrom = document.getElementById('preview-from');
  const btnCopyLink = document.getElementById('btn-copy-link');
  const btnWhatsappShare = document.getElementById('btn-whatsapp-share');
  const btnTestPreview = document.getElementById('btn-test-preview');
  const copyStatusBanner = document.getElementById('copy-status-banner');
  const presetChips = document.querySelectorAll('.preset-chip');

  // Studio Photo Elements
  const inputPhotoFile = document.getElementById('input-photo-file');
  const photoDropzone = document.getElementById('photo-dropzone');
  const studioPhotoPreview = document.getElementById('studio-photo-preview');
  const studioPhotoImg = document.getElementById('studio-photo-img');
  const btnRemovePhoto = document.getElementById('btn-remove-photo');
  const avatarChips = document.querySelectorAll('.avatar-chip');
  const previewPhotoStatus = document.getElementById('preview-photo-status');

  // Receiver Arrival Elements
  const arrivalNameDisplay = document.getElementById('arrival-name-display');
  const tagReceiverName = document.getElementById('tag-receiver-name');
  const tagSenderName = document.getElementById('tag-sender-name');
  const interactiveGiftBox = document.getElementById('interactive-gift-box');
  const btnUnwrapGift = document.getElementById('btn-unwrap-gift');

  // Receiver Celebration Elements
  const celebrationNameDisplay = document.getElementById('celebration-name-display');
  const celebrationHeadlineQuote = document.getElementById('celebration-headline-quote');
  const mainCelebrationHero = document.getElementById('main-celebration-hero');

  // Cyber Birthday Cake & Photo Topper Elements
  const interactiveCakeContainer = document.getElementById('interactive-cake-container');
  const cakePhotoTopper = document.getElementById('cake-photo-topper');
  const cakePersonPhoto = document.getElementById('cake-person-photo');
  const cakeFallbackAvatar = document.getElementById('cake-fallback-avatar');
  const cakeAvatarEmoji = document.getElementById('cake-avatar-emoji');
  const cakeAvatarName = document.getElementById('cake-avatar-name');
  const balloonsLeft = document.getElementById('balloons-left');
  const balloonsRight = document.getElementById('balloons-right');
  const wishSentDesc = document.getElementById('wish-sent-desc');

  // Wishing Beacon / Candle Elements
  const celestialFlame = document.getElementById('celestial-flame');
  const flameSmoke = document.getElementById('flame-smoke');
  const btnBlowFlame = document.getElementById('btn-blow-flame');
  const btnBlowLabel = document.getElementById('btn-blow-label');
  const beaconHint = document.getElementById('beacon-hint');
  const wishSentBanner = document.getElementById('wish-sent-banner');
  const btnFireworksLaunch = document.getElementById('btn-fireworks-launch');

  // Holographic Letter Elements
  const letterReceiverName = document.querySelector('.letter-receiver-name');
  const scrollMessageText = document.getElementById('scroll-message-text');
  const scrollSenderName = document.getElementById('scroll-sender-name');
  let autoBlowTimeout = null;
  let fireworksInterval = null;

  // Wishing Sky & Blessings
  const wishingSkyContainer = document.getElementById('wishing-sky-container');
  const blessingRevealToast = document.getElementById('blessing-reveal-toast');
  const blessingText = document.getElementById('blessing-text');
  const btnReleaseOrbs = document.getElementById('btn-release-orbs');

  // Navigation & Controls
  const btnSoundToggle = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  const btnRewatchGift = document.getElementById('btn-rewatch-gift');

  // --- AUDIO SYNTHESIZER (WEB AUDIO API) ---
  function getAudioContext() {
    if (!state.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) state.audioCtx = new AudioCtx();
    }
    if (state.audioCtx && state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
    return state.audioCtx;
  }

  function playTone(freq, duration = 0.25, type = 'sine', gainVal = 0.15) {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

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
    } catch (e) { }
  }

  function playPopSound() {
    if (!state.soundEnabled) return;
    playTone(587.33, 0.08, 'triangle', 0.18);
    setTimeout(() => playTone(880, 0.12, 'sine', 0.15), 30);
  }

  function playBlowSound() {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
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
    } catch (e) { }
  }

  function playChimeVictory() {
    if (!state.soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.45, 'triangle', 0.15), idx * 90);
    });
  }

  // Celesta / Music-Box Bell Synthesizer (rich harmonics and crystal tone)
  function playMusicBoxBell(freq, duration = 0.55, volume = 0.15) {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Fundamental oscillator (triangle wave for warm body)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(freq, now);

      gain1.gain.setValueAtTime(volume, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + duration);

      // Bell chime overtone (sine at 2x octave for crystal sparkle)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gain2.gain.setValueAtTime(volume * 0.4, now);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.7);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + duration * 0.7);
    } catch (e) { }
  }

  // Soft harmonic chord accompaniment
  function playHarmonicChord(chordNotes, duration = 1.1, volume = 0.04) {
    if (!state.soundEnabled) return;
    chordNotes.forEach(freq => {
      playTone(freq, duration, 'sine', volume);
    });
  }

  // Authentic Happy Birthday Score in F Major
  // (C4, D4, E4, F4, G4, A4, Bb4, C5)
  const happyBirthdayScore = [
    // Phrase 1: "Happy Birthday to you"
    { note: 261.63, dur: 0.28 }, // Hap-
    { note: 261.63, dur: 0.28 }, // py
    { note: 293.66, dur: 0.52 }, // Birth-
    { note: 261.63, dur: 0.52 }, // day
    { note: 349.23, dur: 0.52 }, // to
    { note: 329.63, dur: 1.05, chord: [174.61, 220.00, 261.63] }, // you (F Major chord)
    { note: 0, dur: 0.3 },

    // Phrase 2: "Happy Birthday to you"
    { note: 261.63, dur: 0.28 }, // Hap-
    { note: 261.63, dur: 0.28 }, // py
    { note: 293.66, dur: 0.52 }, // Birth-
    { note: 261.63, dur: 0.52 }, // day
    { note: 392.00, dur: 0.52 }, // to
    { note: 349.23, dur: 1.05, chord: [164.81, 196.00, 261.63] }, // you (C Major chord)
    { note: 0, dur: 0.3 },

    // Phrase 3: "Happy Birthday dear friend"
    { note: 261.63, dur: 0.28 }, // Hap-
    { note: 261.63, dur: 0.28 }, // py
    { note: 523.25, dur: 0.52 }, // Birth-
    { note: 440.00, dur: 0.52 }, // day
    { note: 349.23, dur: 0.52 }, // dear
    { note: 329.63, dur: 0.52 }, // [Friend]
    { note: 293.66, dur: 1.05, chord: [146.83, 174.61, 233.08] }, // [Name] (Bb Major chord)
    { note: 0, dur: 0.3 },

    // Phrase 4: "Happy Birthday to you!"
    { note: 466.16, dur: 0.28 }, // Hap-
    { note: 466.16, dur: 0.28 }, // py
    { note: 440.00, dur: 0.52 }, // Birth-
    { note: 349.23, dur: 0.52 }, // day
    { note: 392.00, dur: 0.52 }, // to
    { note: 349.23, dur: 1.45, chord: [174.61, 261.63, 349.23] } // you! (F Major chord)
  ];

  function playBirthdayMelody() {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    stopBirthdayMelody();
    state.isPlayingMusic = true;

    let timeOffset = 0;
    happyBirthdayScore.forEach(item => {
      if (item.note > 0) {
        setTimeout(() => {
          if (state.soundEnabled && state.isPlayingMusic) {
            playMusicBoxBell(item.note, item.dur * 0.95, 0.16);
            if (item.chord) {
              playHarmonicChord(item.chord, item.dur * 1.1, 0.05);
            }
          }
        }, timeOffset * 1000);
      }
      timeOffset += item.dur;
    });

    state.melodyInterval = setTimeout(() => {
      if (state.soundEnabled && state.isPlayingMusic) {
        playBirthdayMelody();
      }
    }, (timeOffset + 2.2) * 1000);
  }

  function stopBirthdayMelody() {
    state.isPlayingMusic = false;
    if (state.melodyInterval) {
      clearTimeout(state.melodyInterval);
      state.melodyInterval = null;
    }
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    if (state.soundEnabled) {
      getAudioContext();
      soundIcon.textContent = '🔊';
      btnSoundToggle.classList.add('highlight');
      playBirthdayMelody();
    } else {
      soundIcon.textContent = '🔇';
      btnSoundToggle.classList.remove('highlight');
      stopBirthdayMelody();
    }
  }

  // --- CANVAS RESIZE & AMBIENT STARFIELD ---
  function resizeCanvases() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ambientCanvas.width = w;
    ambientCanvas.height = h;
    celebrationCanvas.width = w;
    celebrationCanvas.height = h;
  }
  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();

  const ambientParticles = [];
  const AMBIENT_COUNT = 70;

  class AmbientParticle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * window.innerWidth;
      this.y = Math.random() * window.innerHeight;
      this.size = Math.random() * 2 + 0.6;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -Math.random() * 0.35 - 0.1;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.hue = Math.random() > 0.5 ? 185 : 325; // Cyan or Pink
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha += Math.sin(Date.now() * this.pulseSpeed) * 0.01;
      if (this.y < -10 || this.x < -10 || this.x > window.innerWidth + 10) {
        this.reset();
        this.y = window.innerHeight + 5;
      }
    }
    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 75%, ${Math.max(0.1, Math.min(0.9, this.alpha))})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 65%)`;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < AMBIENT_COUNT; i++) {
    ambientParticles.push(new AmbientParticle());
  }

  function renderAmbient() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    for (let p of ambientParticles) {
      p.update();
      p.draw(ambientCtx);
    }
    requestAnimationFrame(renderAmbient);
  }
  renderAmbient();

  // --- CELEBRATION CANVAS: FIREWORKS, CONFETTI & SHOOTING STARS ---
  const celebrationParticles = [];

  class ConfettiParticle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 9 + 5;
      this.color = ['#00f0ff', '#ff007f', '#ffe600', '#7928ca', '#ffffff', '#38bdf8'][Math.floor(Math.random() * 6)];
      this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 5;
      this.gravity = 0.28;
      this.rotation = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 14;
      this.decay = Math.random() * 0.008 + 0.008;
      this.life = 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.985;
      this.rotation += this.rotSpeed;
      this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      if (this.shape === 'rect') {
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Real-life fireworks audio: rocket whistle rising upward
  function playRocketWhistle() {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
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
    } catch (e) { }
  }

  // Real-life fireworks: ascending rocket from bottom with glowing trail
  class FireworkRocket {
    constructor(startX, targetY, hue) {
      this.x = Math.max(30, Math.min(window.innerWidth - 30, startX));
      this.y = window.innerHeight + 10; // Launch from bottom of the screen!
      this.targetY = targetY;
      this.hue = hue;
      this.vx = (Math.random() - 0.5) * 2.2;
      this.vy = -(Math.random() * 3.5 + 13.5); // Rapid upward launch velocity
      this.gravity = 0.17;
      this.trail = [];
      this.life = 1;
      this.hasExploded = false;
      playRocketWhistle();
    }
    update() {
      if (this.hasExploded) {
        this.life = 0;
        return;
      }
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      if (this.trail.length > 7) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;

      // Rocket reached target height or apex
      if (this.y <= this.targetY || this.vy >= -0.5) {
        this.explode();
      }
    }
    explode() {
      this.hasExploded = true;
      this.life = 0;
      playPopSound();
      const count = Math.floor(Math.random() * 20) + 60;
      for (let i = 0; i < count; i++) {
        celebrationParticles.push(new FireworkParticle(this.x, this.y, this.hue));
      }
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();

      // Draw sparkling rocket trail
      for (let i = 0; i < this.trail.length; i++) {
        const pt = this.trail[i];
        const progress = (i + 1) / this.trail.length;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2 * progress, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 230, 160, ${progress * 0.8})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffe600';
        ctx.fill();
      }

      // Draw rocket head
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3.2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 12;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
      ctx.fill();
      ctx.restore();
    }
  }

  class FireworkParticle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.hue = hue;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8.5 + 2.5;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.friction = 0.94;
      this.gravity = 0.12;
      this.life = 1;
      this.decay = Math.random() * 0.018 + 0.012;
      this.flicker = Math.random() > 0.4;
    }
    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      const alpha = this.flicker && Math.random() > 0.5 ? this.life * 0.5 : this.life;
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 55%)`;
      ctx.fill();
      ctx.restore();
    }
  }

  // Launch a volley of 3 to 4 fireworks coming from the bottom
  function launchFireworkVolley(count = 3) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const step = (w * 0.72) / (count - 1 || 1);
    for (let i = 0; i < count; i++) {
      const baseX = w * 0.14 + i * step + (Math.random() - 0.5) * 50;
      const targetY = h * (0.12 + Math.random() * 0.35); // Explodes at realistic altitude
      const hue = Math.floor(Math.random() * 360);
      const delay = i * 110 + Math.random() * 40;
      setTimeout(() => {
        celebrationParticles.push(new FireworkRocket(baseX, targetY, hue));
      }, delay);
    }
  }

  function launchFirework(x, y) {
    launchFireworkVolley(Math.random() > 0.5 ? 4 : 3);
  }

  class ShootingStar {
    constructor() {
      this.x = Math.random() * window.innerWidth * 0.7;
      this.y = Math.random() * window.innerHeight * 0.3;
      this.len = Math.random() * 80 + 40;
      this.speed = Math.random() * 12 + 10;
      this.angle = Math.PI / 4; // 45 deg
      this.life = 1;
      this.decay = 0.025;
    }
    update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - Math.cos(this.angle) * this.len, this.y - Math.sin(this.angle) * this.len);
      ctx.strokeStyle = `rgba(0, 240, 255, ${this.life})`;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f0ff';
      ctx.stroke();
      ctx.restore();
    }
  }

  class FloatingHeart {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 40;
      this.y = y;
      this.size = Math.random() * 14 + 14;
      this.vy = -Math.random() * 3 - 2;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.life = 1;
      this.decay = 0.015;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
    }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save();
      ctx.font = `${this.size}px serif`;
      ctx.globalAlpha = this.life;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff007f';
      ctx.fillText('❤️', this.x, this.y);
      ctx.restore();
    }
  }

  function launchConfettiCannon(originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 75) {
    playPopSound();
    for (let i = 0; i < count; i++) {
      celebrationParticles.push(new ConfettiParticle(originX, originY));
    }
  }

  function launchShootingStars(count = 5) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        celebrationParticles.push(new ShootingStar());
      }, i * 200);
    }
  }

  function launchHeartsShower(x = window.innerWidth / 2, y = window.innerHeight * 0.7) {
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        celebrationParticles.push(new FloatingHeart(x, y));
      }, i * 40);
    }
  }

  function renderCelebration() {
    celebrationCtx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);
    for (let i = celebrationParticles.length - 1; i >= 0; i--) {
      const p = celebrationParticles[i];
      p.update();
      p.draw(celebrationCtx);
      if (p.life <= 0) celebrationParticles.splice(i, 1);
    }
    requestAnimationFrame(renderCelebration);
  }
  renderCelebration();

  // --- FLOATING STAR WISHING ORBS ---
  const orbIcons = ['🌟', '💖', '🚀', '✨', '👑', '🌈', '🔥'];

  function createFloatingStarOrb() {
    if (document.querySelectorAll('.floating-star-orb').length >= 10) return;

    const orb = document.createElement('div');
    orb.className = 'floating-star-orb';
    orb.textContent = orbIcons[Math.floor(Math.random() * orbIcons.length)];

    const startX = Math.random() * (window.innerWidth - 80) + 20;
    orb.style.left = `${startX}px`;
    orb.style.bottom = `-80px`;

    const duration = Math.random() * 6 + 9; // 9s to 15s
    const drift = (Math.random() - 0.5) * 140;

    orb.animate([
      { transform: 'translateY(0) scale(0.8)', opacity: 0 },
      { opacity: 1, offset: 0.1 },
      { transform: `translateY(-${window.innerHeight + 120}px) translateX(${drift}px) scale(1)`, opacity: 0.9, offset: 0.95 },
      { transform: `translateY(-${window.innerHeight + 140}px) translateX(${drift}px) scale(1)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      easing: 'linear'
    }).onfinish = () => orb.remove();

    orb.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      popStarOrb(orb, e.clientX, e.clientY);
    });

    wishingSkyContainer.appendChild(orb);
  }

  function popStarOrb(orbEl, x, y) {
    playPopSound();
    launchConfettiCannon(x, y, 20);

    const randomBlessing = starBlessings[Math.floor(Math.random() * starBlessings.length)];
    blessingText.textContent = randomBlessing;
    blessingRevealToast.style.borderColor = '#00f0ff';
    blessingRevealToast.style.background = 'rgba(0, 240, 255, 0.25)';

    orbEl.remove();
  }

  let orbInterval = null;
  function startOrbSpawner() {
    if (orbInterval) clearInterval(orbInterval);
    for (let i = 0; i < 4; i++) {
      setTimeout(createFloatingStarOrb, i * 500);
    }
    orbInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && !viewReceiverCelebration.classList.contains('hidden')) {
        createFloatingStarOrb();
      }
    }, 2800);
  }

  // --- PHOTO & AVATAR ENGINE ---
  function handlePhotoFileUpload(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const maxDim = 240;
        let w = img.width;
        let h = img.height;
        if (w > h) {
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }
        } else {
          if (h > maxDim) {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.82);

        state.photoUrl = compressed;
        state.selectedAvatar = null;
        try {
          localStorage.setItem('cyberwish_photo', compressed);
        } catch (err) {
          console.warn('Storage quota warning', err);
        }
        updateStudioPhotoDisplay();
        syncCakePhoto();
        playTone(750, 0.12, 'sine', 0.15);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function updateStudioPhotoDisplay() {
    if (state.photoUrl) {
      if (studioPhotoImg) studioPhotoImg.src = state.photoUrl;
      if (studioPhotoPreview) studioPhotoPreview.classList.remove('hidden');
      if (photoDropzone) photoDropzone.classList.add('hidden');
      if (previewPhotoStatus) previewPhotoStatus.textContent = 'Custom Photo Loaded 📸';
      avatarChips.forEach(c => c.classList.remove('active'));
    } else if (state.selectedAvatar) {
      if (studioPhotoPreview) studioPhotoPreview.classList.add('hidden');
      if (photoDropzone) photoDropzone.classList.remove('hidden');
      if (previewPhotoStatus) previewPhotoStatus.textContent = `Avatar: ${state.selectedAvatar}`;
      avatarChips.forEach(c => {
        if (c.getAttribute('data-avatar') === state.selectedAvatar) {
          c.classList.add('active');
        } else {
          c.classList.remove('active');
        }
      });
    } else {
      if (studioPhotoPreview) studioPhotoPreview.classList.add('hidden');
      if (photoDropzone) photoDropzone.classList.remove('hidden');
      if (previewPhotoStatus) previewPhotoStatus.textContent = 'Default Royal Crown 👑';
      avatarChips.forEach(c => c.classList.remove('active'));
    }
  }

  function syncCakePhoto() {
    if (cakeAvatarName) cakeAvatarName.textContent = state.receiverName;

    if (state.photoUrl) {
      if (cakePersonPhoto) {
        cakePersonPhoto.src = state.photoUrl;
        cakePersonPhoto.style.display = 'block';
      }
      if (cakeFallbackAvatar) cakeFallbackAvatar.style.display = 'none';
    } else if (state.selectedAvatar) {
      if (cakePersonPhoto) cakePersonPhoto.style.display = 'none';
      if (cakeFallbackAvatar) cakeFallbackAvatar.style.display = 'flex';
      if (cakeAvatarEmoji) cakeAvatarEmoji.textContent = state.selectedAvatar;
    } else {
      if (cakePersonPhoto) cakePersonPhoto.style.display = 'none';
      if (cakeFallbackAvatar) cakeFallbackAvatar.style.display = 'flex';
      if (cakeAvatarEmoji) cakeAvatarEmoji.textContent = '👑';
    }
  }

  // --- ROUTE & PARAMETER ENGINE ---
  function parseRouteAndState() {
    // Read from query params or hash
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#\/?/, ''));

    const getParam = (key) => params.get(key) || hashParams.get(key);

    const isExplicitCreate = getParam('create') === 'true' || getParam('mode') === 'studio';

    if (isExplicitCreate) {
      // Explicit reset to studio mode
      localStorage.removeItem('cyberwish_package');
      sessionStorage.removeItem('cyberwish_package');
      state.mode = 'studio';
      switchToSenderStudio();
      syncDOMFromState();
      return;
    }

    const toVal = getParam('to') || getParam('name') || getParam('receiver');
    const fromVal = getParam('from') || getParam('sender');
    const msgVal = getParam('msg') || getParam('message');
    const avatarVal = getParam('avatar');
    const photoVal = getParam('photo');

    // Restore photo if saved in local storage or provided in URL
    const savedPhoto = localStorage.getItem('cyberwish_photo');
    if (photoVal) {
      state.photoUrl = photoVal;
    } else if (savedPhoto) {
      state.photoUrl = savedPhoto;
    }

    if (avatarVal) {
      state.selectedAvatar = avatarVal;
    }

    if (toVal) {
      // Direct Receiver Mode from URL!
      state.mode = 'receiver';
      state.receiverName = toVal.trim();
      state.senderName = fromVal ? fromVal.trim() : 'Chandu Senapathi';
      if (msgVal) state.wishMessage = msgVal.trim();

      // Persist so page refreshes always retain receiver experience
      localStorage.setItem('cyberwish_package', JSON.stringify({
        to: state.receiverName,
        from: state.senderName,
        msg: state.wishMessage,
        photo: state.photoUrl,
        avatar: state.selectedAvatar
      }));

      switchToReceiverArrival();
    } else {
      // Check if a receiver package was saved from a previous visit / preview
      const savedPackage = localStorage.getItem('cyberwish_package');
      if (savedPackage) {
        try {
          const parsed = JSON.parse(savedPackage);
          if (parsed && parsed.to) {
            state.mode = 'receiver';
            state.receiverName = parsed.to;
            state.senderName = parsed.from || 'Chandu Senapathi';
            state.wishMessage = parsed.msg || state.wishMessage;
            if (parsed.photo) state.photoUrl = parsed.photo;
            if (parsed.avatar) state.selectedAvatar = parsed.avatar;

            // Automatically restore the receiver URL parameters on refresh
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('to', state.receiverName);
            currentUrl.searchParams.set('from', state.senderName);
            currentUrl.searchParams.set('msg', state.wishMessage);
            if (state.selectedAvatar) currentUrl.searchParams.set('avatar', state.selectedAvatar);
            window.history.replaceState({}, '', currentUrl.toString());

            switchToReceiverArrival();
            syncDOMFromState();
            return;
          }
        } catch (e) { }
      }

      // No recipient in URL or storage: Default to Sender Studio Mode
      state.mode = 'studio';
      switchToSenderStudio();
    }

    syncDOMFromState();
  }

  function syncDOMFromState() {
    // Arrival
    arrivalNameDisplay.textContent = state.receiverName;
    tagReceiverName.textContent = state.receiverName;
    tagSenderName.textContent = state.senderName;

    // Celebration
    celebrationNameDisplay.textContent = state.receiverName;
    document.querySelectorAll('.letter-receiver-name').forEach(el => {
      el.textContent = state.receiverName;
    });
    const envSenderName = document.getElementById('env-sender-name');
    if (envSenderName) envSenderName.textContent = state.senderName;
    scrollSenderName.textContent = `— ${state.senderName}`;
    scrollMessageText.textContent = state.wishMessage;

    // Studio Inputs
    inputToName.value = state.receiverName === 'Friend' ? '' : state.receiverName;
    inputFromName.value = state.senderName || 'Chandu Senapathi';
    inputWishMsg.value = state.wishMessage;

    updateStudioPreview();
    updateStudioPhotoDisplay();
    syncCakePhoto();
  }

  function updateStudioPreview() {
    const to = inputToName.value.trim() || 'Priya';
    const from = inputFromName.value.trim() || 'Chandu Senapathi';
    previewTo.textContent = to;
    previewFrom.textContent = from;

    if (previewPhotoStatus) {
      if (state.photoUrl) {
        previewPhotoStatus.textContent = 'Custom Photo Loaded 📸';
      } else if (state.selectedAvatar) {
        previewPhotoStatus.textContent = `Avatar: ${state.selectedAvatar}`;
      } else {
        previewPhotoStatus.textContent = 'Default Royal Crown 👑';
      }
    }
  }

  function buildShareableUrl(forPreview = false) {
    const to = inputToName.value.trim() || 'Priya';
    const from = inputFromName.value.trim() || 'Chandu Senapathi';
    const msg = inputWishMsg.value.trim() || messagePresets.heartfelt;

    const base = window.location.origin + window.location.pathname;
    const url = new URL(base);
    url.searchParams.set('to', to);
    url.searchParams.set('from', from);
    url.searchParams.set('msg', msg);
    if (state.selectedAvatar) {
      url.searchParams.set('avatar', state.selectedAvatar);
    }
    return url.toString();
  }

  function copyShareLink() {
    const shareUrl = buildShareableUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        showCopySuccess();
      }).catch(() => fallbackCopy(shareUrl));
    } else {
      fallbackCopy(shareUrl);
    }
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showCopySuccess();
  }

  function showCopySuccess() {
    copyStatusBanner.classList.remove('hidden');
    playTone(880, 0.15, 'sine', 0.2);
    setTimeout(() => {
      copyStatusBanner.classList.add('hidden');
    }, 4500);
  }

  function shareOnWhatsApp() {
    const shareUrl = buildShareableUrl();
    const to = inputToName.value.trim() || 'Special Person';
    const text = encodeURIComponent(`🎉 Hey ${to}! You have received an exclusive birthday surprise package! Open your gift here: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }

  // --- VIEW SWITCHING ---
  function switchToSenderStudio() {
    state.mode = 'studio';
    stopContinuousFireworks();
    if (autoBlowTimeout) clearTimeout(autoBlowTimeout);

    viewReceiverArrival.classList.add('hidden');
    viewReceiverCelebration.classList.add('hidden');
    viewSenderStudio.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function switchToReceiverArrival() {
    state.mode = 'receiver';
    stopContinuousFireworks();
    if (autoBlowTimeout) clearTimeout(autoBlowTimeout);

    viewSenderStudio.classList.add('hidden');
    viewReceiverCelebration.classList.add('hidden');
    interactiveGiftBox.classList.remove('opened');

    viewReceiverArrival.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- CONTINUOUS FIREWORKS LOOP ---
  function startContinuousFireworks() {
    if (fireworksInterval) clearInterval(fireworksInterval);
    // Initial launch salvo of 3 to 4 fireworks from the bottom
    launchFireworkVolley(3);

    // Continuous fireworks salvo of 3 to 4 rockets from the bottom every 2.4 seconds
    fireworksInterval = setInterval(() => {
      if (document.visibilityState === 'visible' && !viewReceiverCelebration.classList.contains('hidden')) {
        const count = Math.random() > 0.4 ? 4 : 3;
        launchFireworkVolley(count);
      }
    }, 2400);
  }

  function stopContinuousFireworks() {
    if (fireworksInterval) {
      clearInterval(fireworksInterval);
      fireworksInterval = null;
    }
  }

  function triggerHeroAnimation() {
    const heroElements = document.querySelectorAll('.animate-slide-up');
    heroElements.forEach(el => {
      el.style.animation = 'none';
      void el.offsetHeight; // trigger reflow
      el.style.animation = '';
    });
  }

  // --- UNBOXING SEQUENCE (ARRIVAL -> CELEBRATION) ---
  function openGiftSurprise() {
    interactiveGiftBox.classList.add('opened');

    // Confetti from box
    const rect = interactiveGiftBox.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    launchConfettiCannon(centerX, centerY, 90);

    // Auto-enable audio if user permitted
    if (!state.soundEnabled) {
      toggleSound();
    } else {
      playChimeVictory();
    }

    setTimeout(() => {
      viewReceiverArrival.classList.add('hidden');
      viewReceiverCelebration.classList.remove('hidden');

      // Scroll smoothly to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger grand bottom-to-top animation
      triggerHeroAnimation();

      // Launch continuous celebratory fireworks
      startContinuousFireworks();
      startOrbSpawner();

      // Reset celebration state for fresh reveal
      if (cakePhotoTopper) cakePhotoTopper.classList.remove('revealed');
      if (balloonsLeft) balloonsLeft.classList.remove('popped');
      if (balloonsRight) balloonsRight.classList.remove('popped');
      const interactiveLetterEnvelope = document.getElementById('interactive-letter-envelope');
      if (interactiveLetterEnvelope) interactiveLetterEnvelope.classList.remove('opened');
      document.querySelectorAll('.celestial-flame').forEach(f => f.classList.remove('extinguished'));
      document.querySelectorAll('.flame-smoke').forEach(s => s.classList.remove('puff'));
      state.flameLit = true;
      if (btnBlowLabel) btnBlowLabel.textContent = "Blow the Wish Candles";
      if (beaconHint) beaconHint.textContent = "Close your eyes, make a silent wish... Candles will blow in 3 seconds! 🎂✨";
      if (wishSentBanner) wishSentBanner.classList.add('hidden');
      syncCakePhoto();

      // Automatically blow out the wish candles & reveal photo after 3 seconds
      if (autoBlowTimeout) clearTimeout(autoBlowTimeout);
      autoBlowTimeout = setTimeout(() => {
        if (state.flameLit && !viewReceiverCelebration.classList.contains('hidden')) {
          toggleWishingFlame();
        }
      }, 3000);
    }, 650);
  }

  // --- CELESTIAL WISHING CANDLE & CAKE CEREMONY ---
  function toggleWishingFlame() {
    if (state.flameLit) {
      // Extinguish Flame & Launch Wishes
      document.querySelectorAll('.celestial-flame').forEach(f => f.classList.add('extinguished'));
      document.querySelectorAll('.flame-smoke').forEach(s => s.classList.add('puff'));

      // Pop the festive balloons beside the cake
      if (balloonsLeft) balloonsLeft.classList.add('popped');
      if (balloonsRight) balloonsRight.classList.add('popped');

      playBlowSound();
      playPopSound();

      // REVEAL MAGICAL PHOTO TOPPER ON CAKE
      syncCakePhoto();
      if (cakePhotoTopper) {
        cakePhotoTopper.classList.add('revealed');
      }

      if (btnBlowLabel) btnBlowLabel.textContent = "Relight Wish Candles 🕯️";
      if (beaconHint) beaconHint.textContent = "🎉 Candles blown & photo crowned upon your cosmic cake!";

      if (wishSentDesc) {
        wishSentDesc.textContent = `May this year be filled with pure magic and all your wildest dreams come true, ${state.receiverName}!`;
      }
      wishSentBanner.classList.remove('hidden');
      state.flameLit = false;

      // Magical cosmic effects: balloon confetti + shooting stars + victory chimes + volley of 4 fireworks
      setTimeout(() => {
        playChimeVictory();
        launchShootingStars(6);
        launchFireworkVolley(4);
        launchConfettiCannon(window.innerWidth * 0.28, window.innerHeight * 0.42, 50);
        launchConfettiCannon(window.innerWidth * 0.72, window.innerHeight * 0.42, 50);
        launchConfettiCannon(window.innerWidth / 2, window.innerHeight * 0.38, 80);
      }, 200);
    } else {
      // Relight Candles
      document.querySelectorAll('.celestial-flame').forEach(f => f.classList.remove('extinguished'));
      document.querySelectorAll('.flame-smoke').forEach(s => s.classList.remove('puff'));
      if (balloonsLeft) balloonsLeft.classList.remove('popped');
      if (balloonsRight) balloonsRight.classList.remove('popped');

      if (btnBlowLabel) btnBlowLabel.textContent = "Blow the Wish Candles";
      if (beaconHint) beaconHint.textContent = "Close your eyes, make a silent wish in your heart, then tap to blow the candles ✨";
      wishSentBanner.classList.add('hidden');
      state.flameLit = true;
      playTone(660, 0.12, 'triangle', 0.15);
    }
  }



  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Studio Inputs Sync
    inputToName.addEventListener('input', updateStudioPreview);
    inputFromName.addEventListener('input', updateStudioPreview);

    // Photo File Upload Listeners
    if (inputPhotoFile) {
      inputPhotoFile.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) handlePhotoFileUpload(file);
      });
    }

    // Drag & Drop for Photo Dropzone
    if (photoDropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        photoDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          photoDropzone.classList.add('drag-active');
        }, false);
      });

      ['dragleave', 'drop'].forEach(eventName => {
        photoDropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          photoDropzone.classList.remove('drag-active');
        }, false);
      });

      photoDropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const file = dt && dt.files && dt.files[0];
        if (file) handlePhotoFileUpload(file);
      });
    }

    // Remove Photo Button
    if (btnRemovePhoto) {
      btnRemovePhoto.addEventListener('click', () => {
        state.photoUrl = '';
        state.selectedAvatar = null;
        try {
          localStorage.removeItem('cyberwish_photo');
        } catch (e) { }
        if (inputPhotoFile) inputPhotoFile.value = '';
        updateStudioPhotoDisplay();
        syncCakePhoto();
        playTone(450, 0.1, 'sine', 0.1);
      });
    }

    // Avatar Presets Selection
    avatarChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const avatar = chip.getAttribute('data-avatar');
        state.selectedAvatar = avatar;
        state.photoUrl = '';
        try {
          localStorage.removeItem('cyberwish_photo');
        } catch (e) { }
        if (inputPhotoFile) inputPhotoFile.value = '';
        updateStudioPhotoDisplay();
        syncCakePhoto();
        playTone(680, 0.1, 'triangle', 0.15);
      });
    });

    // Preset Chips
    presetChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const key = chip.getAttribute('data-preset');
        if (messagePresets[key]) {
          inputWishMsg.value = messagePresets[key];
          playTone(600, 0.08, 'sine', 0.1);
        }
      });
    });

    // Studio Buttons
    btnCopyLink.addEventListener('click', copyShareLink);
    btnWhatsappShare.addEventListener('click', shareOnWhatsApp);
    btnTestPreview.addEventListener('click', () => {
      state.receiverName = inputToName.value.trim() || 'Priya';
      state.senderName = inputFromName.value.trim() || 'Chandu Senapathi';
      state.wishMessage = inputWishMsg.value.trim() || messagePresets.heartfelt;

      // Update the browser URL bar so refreshing the page reloads the receiver link!
      const receiverUrl = buildShareableUrl();
      window.history.pushState({}, '', receiverUrl);

      // Persist in localStorage so refreshing stays in receiver mode
      localStorage.setItem('cyberwish_package', JSON.stringify({
        to: state.receiverName,
        from: state.senderName,
        msg: state.wishMessage,
        photo: state.photoUrl,
        avatar: state.selectedAvatar
      }));

      syncDOMFromState();
      switchToReceiverArrival();
    });

    // Receiver Arrival Actions
    interactiveGiftBox.addEventListener('click', openGiftSurprise);
    interactiveGiftBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openGiftSurprise();
      }
    });
    btnUnwrapGift.addEventListener('click', openGiftSurprise);

    // Cake & Candles Interaction
    if (interactiveCakeContainer) {
      interactiveCakeContainer.addEventListener('click', toggleWishingFlame);
      interactiveCakeContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleWishingFlame();
        }
      });
    }
    btnBlowFlame.addEventListener('click', toggleWishingFlame);
    btnFireworksLaunch.addEventListener('click', () => {
      launchFireworkVolley(4);
    });

    // Holographic Letter & Interactive Envelope
    const interactiveLetterEnvelope = document.getElementById('interactive-letter-envelope');
    const envelopeCover = document.getElementById('envelope-cover');
    const btnFoldLetter = document.getElementById('btn-fold-letter');

    if (interactiveLetterEnvelope && envelopeCover) {
      const openLetterEnvelope = () => {
        if (!interactiveLetterEnvelope.classList.contains('opened')) {
          interactiveLetterEnvelope.classList.add('opened');
          playPopSound();
          playTone(660, 0.18, 'triangle', 0.2);
          const rect = envelopeCover.getBoundingClientRect();
          launchHeartsShower(rect.left + rect.width / 2, rect.top + 30);
        }
      };

      envelopeCover.addEventListener('click', openLetterEnvelope);
      envelopeCover.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLetterEnvelope();
        }
      });
    }

    if (btnFoldLetter && interactiveLetterEnvelope) {
      btnFoldLetter.addEventListener('click', (e) => {
        e.stopPropagation();
        interactiveLetterEnvelope.classList.remove('opened');
        playTone(440, 0.12, 'sine', 0.12);
      });
    }

    // Star Orbs Spawner Button
    btnReleaseOrbs.addEventListener('click', () => {
      for (let i = 0; i < 4; i++) {
        setTimeout(createFloatingStarOrb, i * 250);
      }
      playTone(720, 0.1, 'sine', 0.1);
    });

    // Navigation & Replay
    btnRewatchGift.addEventListener('click', switchToReceiverArrival);
    btnSoundToggle.addEventListener('click', toggleSound);

    // Global Key Shortcuts
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'm' || e.key === 'M') toggleSound();
      if (e.key === 'f' || e.key === 'F') launchFireworkVolley(4);
    });
  }

  // --- INITIALIZATION ---
  function init() {
    parseRouteAndState();
    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
