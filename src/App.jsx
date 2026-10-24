import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- PRESETS & DATA ---
const MESSAGE_PRESETS = {
  heartfelt: `Through every wild adventure, storm we’ve braved together, you have always been my truest anchor.
Having you as my best friend isn’t just a blessing—it is proof that the universe gives us chosen family.
Thank you for understanding me even in silence, for standing by me through thick and thin, and for lighting up every room with your genuine soul.
On your special day, my deepest wish is that life rewards you with all the peace, pure magic, and boundless love you so selflessly give to the world.
Happy Birthday to my best friend forever—here’s to an unbreakable bond that will shine across lifetimes!`,
  joyful: "Happy Birthday! Wishing you 365 days of wild fun, zero stress, massive triumphs, and endless delicious moments!",
  inspirational: "To the brightest star in the universe: may your year ahead be filled with cosmic breakthroughs, pure magic, and all your greatest dreams taking flight!"
};

const STAR_BLESSINGS = [
  "🌈 Endless Joy, Deep Laughter & Good Vibes!",
  "🚀 Fearless Adventures, Bold Moves & Massive Wins!",
  "💖 Radiant Health, Inner Peace & Pure Love!",
  "🔥 Unstoppable Energy, Confidence & Drive!",
  "✨ Pure Magic, Unexpected Miracles & Wonder!",
  "👑 Master of Your Destiny, Star of Every Room!",
  "🎂 Sweetest Memories in Every Single Chapter Ahead!"
];

const AVATAR_PRESETS = ['👑', '⭐', '🎂', '🌟', '💎', '🎉'];

export default function App() {
  // App State
  const [mode, setMode] = useState('receiver'); // 'receiver' or 'studio'
  const [receiverName, setReceiverName] = useState('Friend');
  const [senderName, setSenderName] = useState('Chandu Senapathi');
  const [wishMessage, setWishMessage] = useState(MESSAGE_PRESETS.heartfelt);
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👑');

  // Interactive Flow States
  const [giftOpened, setGiftOpened] = useState(false);
  const [flameLit, setFlameLit] = useState(true);
  const [balloonsPopped, setBalloonsPopped] = useState(false);
  const [photoRevealed, setPhotoRevealed] = useState(false);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [activeBlessing, setActiveBlessing] = useState(null);
  const [copyStatus, setCopyStatus] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Floating Star Orbs
  const [floatingOrbs, setFloatingOrbs] = useState([]);

  // Canvas Refs
  const ambientCanvasRef = useRef(null);
  const celebrationCanvasRef = useRef(null);
  const celebrationParticlesRef = useRef([]);

  // Audio Context Ref
  const audioCtxRef = useRef(null);
  const melodyTimeoutRef = useRef(null);
  const autoBlowTimeoutRef = useRef(null);
  const fireworksIntervalRef = useRef(null);

  // --- AUDIO SYNTHESIZER ---
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq, duration = 0.25, type = 'sine', gainVal = 0.15) => {
    if (!soundEnabled) return;
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
    } catch (e) {}
  }, [soundEnabled, getAudioContext]);

  const playPopSound = useCallback(() => {
    if (!soundEnabled) return;
    playTone(587.33, 0.08, 'triangle', 0.18);
    setTimeout(() => playTone(880, 0.12, 'sine', 0.15), 30);
  }, [soundEnabled, playTone]);

  const playBlowSound = useCallback(() => {
    if (!soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
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
  }, [soundEnabled, getAudioContext]);

  const playChimeVictory = useCallback(() => {
    if (!soundEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.45, 'triangle', 0.15), idx * 90);
    });
  }, [soundEnabled, playTone]);

  const playRocketWhistle = useCallback(() => {
    if (!soundEnabled) return;
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
    } catch (e) {}
  }, [soundEnabled, getAudioContext]);

  const playBirthdayMelody = useCallback(() => {
    if (!soundEnabled) return;
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
        setTimeout(() => {
          if (soundEnabled) playTone(item.note, item.dur * 0.95, 'triangle', 0.16);
        }, timeOffset * 1000);
      }
      timeOffset += item.dur;
    });

    melodyTimeoutRef.current = setTimeout(() => {
      if (soundEnabled) playBirthdayMelody();
    }, (timeOffset + 2.5) * 1000);
  }, [soundEnabled, playTone]);

  // --- CELEBRATION EFFECTS ---
  const launchFireworkVolley = useCallback((count = 4) => {
    const HUES = [185, 325, 45, 275, 150];
    const screenW = window.innerWidth;
    const targetYMin = window.innerHeight * 0.12;
    const targetYMax = window.innerHeight * 0.38;

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const startX = screenW * (0.15 + (i / count) * 0.7 + (Math.random() - 0.5) * 0.12);
        const targetY = targetYMin + Math.random() * (targetYMax - targetYMin);
        const hue = HUES[Math.floor(Math.random() * HUES.length)];
        playRocketWhistle();

        // Create Rocket
        const rocket = {
          x: Math.max(30, Math.min(screenW - 30, startX)),
          y: window.innerHeight + 10,
          targetY,
          hue,
          vx: (Math.random() - 0.5) * 2.2,
          vy: -(Math.random() * 3.5 + 13.5),
          gravity: 0.17,
          trail: [],
          isRocket: true,
          life: 1,
          update() {
            this.trail.push({ x: this.x, y: this.y, alpha: 1 });
            if (this.trail.length > 7) this.trail.shift();
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            if (this.y <= this.targetY || this.vy >= -0.5) {
              this.life = 0;
              playPopSound();
              // Spawn Burst Particles
              const numParticles = 60;
              for (let j = 0; j < numParticles; j++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 8.5 + 2.0;
                celebrationParticlesRef.current.push({
                  x: this.x,
                  y: this.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  gravity: 0.11,
                  decay: Math.random() * 0.015 + 0.012,
                  life: 1,
                  size: Math.random() * 3.0 + 1.8,
                  color: `hsl(${this.hue + (Math.random() - 0.5) * 45}, 100%, ${Math.random() * 25 + 60}%)`,
                  trail: [],
                  update() {
                    this.trail.push({ x: this.x, y: this.y, alpha: this.life });
                    if (this.trail.length > 4) this.trail.shift();
                    this.x += this.vx;
                    this.y += this.vy;
                    this.vy += this.gravity;
                    this.vx *= 0.96;
                    this.vy *= 0.96;
                    this.life -= this.decay;
                  },
                  draw(ctx) {
                    if (this.life <= 0) return;
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, this.life);
                    ctx.fillStyle = this.color;
                    ctx.shadowColor = this.color;
                    ctx.shadowBlur = 8;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                  }
                });
              }
            }
          },
          draw(ctx) {
            if (this.life <= 0) return;
            ctx.save();
            ctx.strokeStyle = `hsl(${this.hue}, 100%, 75%)`;
            ctx.lineWidth = 2.5;
            ctx.shadowColor = `hsl(${this.hue}, 100%, 65%)`;
            ctx.shadowBlur = 10;
            ctx.beginPath();
            this.trail.forEach((t, idx) => {
              if (idx === 0) ctx.moveTo(t.x, t.y);
              else ctx.lineTo(t.x, t.y);
            });
            ctx.stroke();
            ctx.restore();
          }
        };

        celebrationParticlesRef.current.push(rocket);
      }, i * 220);
    }
  }, [playRocketWhistle, playPopSound]);

  const launchConfetti = useCallback((originX, originY, count = 50) => {
    const colors = ['#00f0ff', '#ff007f', '#ffe600', '#7928ca', '#ffffff', '#38bdf8'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      celebrationParticlesRef.current.push({
        x: originX,
        y: originY,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        gravity: 0.28,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 14,
        decay: Math.random() * 0.008 + 0.008,
        life: 1,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += this.gravity;
          this.vx *= 0.985;
          this.rotation += this.rotSpeed;
          this.life -= this.decay;
        },
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
      });
    }
  }, []);

  const launchHeartsShower = useCallback((startX, startY) => {
    const hearts = ['💖', '❤️', '✨', '💕', '🥰', '💫'];
    for (let i = 0; i < 16; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 3;
      celebrationParticlesRef.current.push({
        x: startX,
        y: startY,
        emoji: hearts[Math.floor(Math.random() * hearts.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        decay: 0.018,
        life: 1,
        size: Math.floor(Math.random() * 10) + 18,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += 0.12;
          this.life -= this.decay;
        },
        draw(ctx) {
          if (this.life <= 0) return;
          ctx.save();
          ctx.font = `${this.size}px sans-serif`;
          ctx.globalAlpha = Math.max(0, this.life);
          ctx.fillText(this.emoji, this.x, this.y);
          ctx.restore();
        }
      });
    }
  }, []);

  // --- BLOW CANDLES & REVEAL TOPPER ---
  const toggleWishingCandles = useCallback(() => {
    if (flameLit) {
      setFlameLit(false);
      setBalloonsPopped(true);
      setPhotoRevealed(true);
      playBlowSound();
      playPopSound();

      setTimeout(() => {
        playChimeVictory();
        launchFireworkVolley(4);
        launchConfetti(window.innerWidth * 0.28, window.innerHeight * 0.42, 50);
        launchConfetti(window.innerWidth * 0.72, window.innerHeight * 0.42, 50);
        launchConfetti(window.innerWidth / 2, window.innerHeight * 0.38, 80);
      }, 200);
    } else {
      setFlameLit(true);
      setBalloonsPopped(false);
      playTone(660, 0.12, 'triangle', 0.15);
    }
  }, [flameLit, playBlowSound, playPopSound, playChimeVictory, launchFireworkVolley, launchConfetti, playTone]);

  // --- UNWRAP SURPRISE GIFT ---
  const handleUnwrapGift = useCallback(() => {
    playPopSound();
    playTone(523.25, 0.15, 'triangle', 0.2);
    setGiftOpened(true);
    setIsEnvelopeOpened(false);

    // Initial celebratory blast
    setTimeout(() => {
      launchFireworkVolley(4);
      launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
    }, 400);

    // Auto-blow candles after 3 seconds
    if (autoBlowTimeoutRef.current) clearTimeout(autoBlowTimeoutRef.current);
    autoBlowTimeoutRef.current = setTimeout(() => {
      toggleWishingCandles();
    }, 3000);

    // Continuous ambient fireworks
    if (fireworksIntervalRef.current) clearInterval(fireworksIntervalRef.current);
    fireworksIntervalRef.current = setInterval(() => {
      launchFireworkVolley(Math.random() > 0.4 ? 4 : 3);
    }, 5500);
  }, [playPopSound, playTone, launchFireworkVolley, launchConfetti, toggleWishingCandles]);

  // --- REWIND TO GIFT ARRIVAL ---
  const handleRewindToGift = useCallback(() => {
    if (fireworksIntervalRef.current) clearInterval(fireworksIntervalRef.current);
    if (autoBlowTimeoutRef.current) clearTimeout(autoBlowTimeoutRef.current);
    setGiftOpened(false);
    setFlameLit(true);
    setBalloonsPopped(false);
    setPhotoRevealed(false);
    setIsEnvelopeOpened(false);
    playTone(450, 0.1, 'sine', 0.15);
  }, [playTone]);

  // --- TOGGLE SOUND ---
  const toggleSound = useCallback(() => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    if (nextSound) {
      getAudioContext();
      playBirthdayMelody();
    } else {
      if (melodyTimeoutRef.current) clearTimeout(melodyTimeoutRef.current);
    }
  }, [soundEnabled, getAudioContext, playBirthdayMelody]);

  // --- ORB SPAWNER ---
  const spawnStarOrb = useCallback(() => {
    const emojis = ['⭐', '🌟', '✨', '🎈', '💖', '🎂'];
    const newOrb = {
      id: Date.now() + Math.random(),
      left: Math.random() * 85 + 5,
      bottom: Math.random() * 40 + 20,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: Math.random() * 2
    };
    setFloatingOrbs(prev => [...prev.slice(-12), newOrb]);
  }, []);

  const handlePopOrb = useCallback((id) => {
    playPopSound();
    const blessing = STAR_BLESSINGS[Math.floor(Math.random() * STAR_BLESSINGS.length)];
    setActiveBlessing(blessing);
    setFloatingOrbs(prev => prev.filter(orb => orb.id !== id));
    setTimeout(() => setActiveBlessing(null), 4500);
  }, [playPopSound]);

  // --- URL PARSING & INITIALIZATION ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#\/?/, ''));
    const getParam = (k) => params.get(k) || hashParams.get(k);

    const isStudio = getParam('create') === 'true' || getParam('mode') === 'studio';
    if (isStudio) {
      setMode('studio');
      return;
    }

    const toVal = getParam('to') || getParam('name') || getParam('receiver');
    const fromVal = getParam('from') || getParam('sender');
    const msgVal = getParam('msg') || getParam('message');
    const photoVal = getParam('photo');
    const avatarVal = getParam('avatar');

    if (toVal) {
      setMode('receiver');
      setReceiverName(toVal.trim());
      if (fromVal) setSenderName(fromVal.trim());
      if (msgVal) setWishMessage(msgVal.trim());
      if (photoVal) setPhotoUrl(photoVal);
      if (avatarVal) setSelectedAvatar(avatarVal);

      // Save to localStorage for refresh retention
      try {
        localStorage.setItem('cyberwish_package', JSON.stringify({
          to: toVal.trim(),
          from: fromVal ? fromVal.trim() : 'Chandu Senapathi',
          msg: msgVal ? msgVal.trim() : MESSAGE_PRESETS.heartfelt,
          photo: photoVal || '',
          avatar: avatarVal || '👑'
        }));
      } catch (e) {}
    } else {
      // Check saved package
      try {
        const saved = localStorage.getItem('cyberwish_package');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.to) {
            setMode('receiver');
            setReceiverName(parsed.to);
            if (parsed.from) setSenderName(parsed.from);
            if (parsed.msg) setWishMessage(parsed.msg);
            if (parsed.photo) setPhotoUrl(parsed.photo);
            if (parsed.avatar) setSelectedAvatar(parsed.avatar);
            return;
          }
        }
      } catch (e) {}
      // No receiver info: default to studio
      setMode('studio');
    }
  }, []);

  // --- CANVAS PARTICLE LOOPS ---
  useEffect(() => {
    const ambientCanvas = ambientCanvasRef.current;
    const celebrationCanvas = celebrationCanvasRef.current;
    if (!ambientCanvas || !celebrationCanvas) return;

    const ambientCtx = ambientCanvas.getContext('2d');
    const celebrationCtx = celebrationCanvas.getContext('2d');

    const handleResize = () => {
      ambientCanvas.width = window.innerWidth;
      ambientCanvas.height = window.innerHeight;
      celebrationCanvas.width = window.innerWidth;
      celebrationCanvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Setup Ambient Particles
    const ambientParticles = [];
    for (let i = 0; i < 65; i++) {
      ambientParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.35 - 0.1,
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        hue: Math.random() > 0.5 ? 185 : 325
      });
    }

    let animId;
    const render = () => {
      // Ambient Render
      ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
      ambientParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * 0.002) * p.pulseSpeed;
        if (p.y < -10) { p.y = ambientCanvas.height + 10; p.x = Math.random() * ambientCanvas.width; }
        if (p.x < -10) p.x = ambientCanvas.width + 10;
        if (p.x > ambientCanvas.width + 10) p.x = -10;

        ambientCtx.save();
        ambientCtx.fillStyle = `hsla(${p.hue}, 100%, 75%, ${Math.max(0.1, Math.min(0.9, p.alpha))})`;
        ambientCtx.shadowColor = `hsl(${p.hue}, 100%, 70%)`;
        ambientCtx.shadowBlur = p.size * 3;
        ambientCtx.beginPath();
        ambientCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ambientCtx.fill();
        ambientCtx.restore();
      });

      // Celebration Render
      celebrationCtx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);
      const particles = celebrationParticlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.update();
        pt.draw(celebrationCtx);
        if (pt.life <= 0) {
          particles.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // --- STUDIO ACTIONS ---
  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotoUrl(uploadEvent.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const buildShareUrl = () => {
    const base = window.location.origin + window.location.pathname;
    const url = new URL(base);
    url.searchParams.set('to', receiverName.trim() || 'Priya');
    url.searchParams.set('from', senderName.trim() || 'Chandu Senapathi');
    url.searchParams.set('msg', wishMessage.trim() || MESSAGE_PRESETS.heartfelt);
    if (selectedAvatar) url.searchParams.set('avatar', selectedAvatar);
    return url.toString();
  };

  const handleCopyLink = () => {
    const shareUrl = buildShareUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyStatus(true);
      playTone(880, 0.15, 'sine', 0.2);
      setTimeout(() => setCopyStatus(false), 4500);
    });
  };

  const handleTestPreview = () => {
    const receiverUrl = buildShareUrl();
    window.history.pushState({}, '', receiverUrl);
    try {
      localStorage.setItem('cyberwish_package', JSON.stringify({
        to: receiverName.trim() || 'Priya',
        from: senderName.trim() || 'Chandu Senapathi',
        msg: wishMessage.trim() || MESSAGE_PRESETS.heartfelt,
        photo: photoUrl,
        avatar: selectedAvatar
      }));
    } catch (e) {}
    setMode('receiver');
    setGiftOpened(false);
  };

  return (
    <div className="cyber-experience-root">
      {/* Background Canvases */}
      <canvas ref={ambientCanvasRef} className="ambient-canvas" />
      <canvas ref={celebrationCanvasRef} className="celebration-canvas" />

      {/* Top Navbar */}
      <header className="top-bar">
        <div className="control-actions">
          <button
            type="button"
            className={`icon-button ${soundEnabled ? 'highlight' : ''}`}
            onClick={toggleSound}
            title="Toggle Music & Sound Effects"
            aria-label="Toggle Sound"
          >
            <span className="btn-icon">{soundEnabled ? '🔊' : '🔇'}</span>
            <span className="btn-label">Music</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-wrapper">
        {/* ================= SENDER STUDIO VIEW ================= */}
        {mode === 'studio' && (
          <section className="app-view">
            <div className="studio-card glass-panel">
              <div className="badge-pill cyber-badge">⚡ CYBER WISH CREATOR ⚡</div>
              <h1 className="studio-title">Send a Magical <span className="text-gradient">Birthday Wish</span></h1>
              <p className="studio-sub">Enter the birthday person's name below to generate their exclusive interactive gift link.</p>

              <form className="studio-form" onSubmit={(e) => e.preventDefault()}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="input-to-name">Birthday Person's Name (Receiver)</label>
                    <input
                      id="input-to-name"
                      type="text"
                      className="input-field"
                      value={receiverName === 'Friend' ? '' : receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="e.g. Rutuja, Rahul..."
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="input-from-name">Your Name (Sender)</label>
                    <input
                      id="input-from-name"
                      type="text"
                      className="input-field"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Chandu Senapathi"
                    />
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="form-group">
                  <label>Person's Photo on Cake (Crowns atop the cake on blow!)</label>
                  <div className="photo-upload-container">
                    <label className="photo-dropzone">
                      <input
                        type="file"
                        accept="image/*"
                        className="photo-file-input"
                        onChange={handlePhotoUpload}
                      />
                      <div className="dropzone-content">
                        <span className="dropzone-icon">📸</span>
                        <span className="dropzone-text">Click to upload photo of the birthday star</span>
                        <span className="dropzone-sub">PNG, JPG or WebP</span>
                      </div>
                    </label>

                    {photoUrl && (
                      <div className="studio-photo-preview">
                        <img src={photoUrl} alt="Preview" className="preview-thumb" />
                        <button
                          type="button"
                          className="btn-remove-photo"
                          onClick={() => setPhotoUrl('')}
                        >
                          ✕ Remove Photo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Avatar fallback chips */}
                  <div className="avatar-selection-row">
                    <span className="avatar-selection-label">Or choose a celebratory avatar:</span>
                    <div className="avatar-chip-list">
                      {AVATAR_PRESETS.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          className={`avatar-chip ${selectedAvatar === icon ? 'active' : ''}`}
                          onClick={() => { setSelectedAvatar(icon); setPhotoUrl(''); }}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Message Presets */}
                <div className="form-group">
                  <div className="label-with-presets">
                    <label htmlFor="input-wish-msg">Heartfelt Birthday Message</label>
                    <div className="preset-chips">
                      <button type="button" className="preset-chip" onClick={() => setWishMessage(MESSAGE_PRESETS.heartfelt)}>Heartfelt (BFF)</button>
                      <button type="button" className="preset-chip" onClick={() => setWishMessage(MESSAGE_PRESETS.joyful)}>Joyful</button>
                      <button type="button" className="preset-chip" onClick={() => setWishMessage(MESSAGE_PRESETS.inspirational)}>Cosmic</button>
                    </div>
                  </div>
                  <textarea
                    id="input-wish-msg"
                    rows="5"
                    className="input-field textarea"
                    value={wishMessage}
                    onChange={(e) => setWishMessage(e.target.value)}
                  />
                </div>

                <div className="studio-actions">
                  <button type="button" className="btn-action primary" onClick={handleCopyLink}>
                    <span>🔗 Copy Gift Link</span>
                  </button>
                  <button type="button" className="btn-action accent" onClick={handleTestPreview}>
                    <span>👀 Test Surprise Preview</span>
                  </button>
                </div>

                {copyStatus && (
                  <div className="status-banner success">
                    <span>✨ Exclusive Gift Link copied to clipboard! Share it with {receiverName || 'them'}!</span>
                  </div>
                )}
              </form>
            </div>
          </section>
        )}

        {/* ================= RECEIVER ARRIVAL VIEW (GIFT BOX) ================= */}
        {mode === 'receiver' && !giftOpened && (
          <section className="app-view">
            <div className="arrival-hero">
              <div className="arrival-badge">
                <span className="pulse-dot"></span>
                <span>EXCLUSIVE CELEBRATION DELIVERY</span>
              </div>
              <h1 className="arrival-title">
                Incoming Surprise for <span className="text-gradient-gold">{receiverName}</span>!
              </h1>
              <p className="arrival-sub">
                A handcrafted cyber birthday experience has arrived from across the cosmos.
              </p>
            </div>

            {/* 3D Interactive Cyber Gift Box */}
            <div
              className="gift-stage-wrapper"
              onClick={handleUnwrapGift}
              role="button"
              tabIndex="0"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleUnwrapGift()}
            >
              <div className="gift-box-3d">
                <div className="gift-box-lid">
                  <div className="gift-bow">
                    <div className="bow-loop bow-left"></div>
                    <div className="bow-loop bow-right"></div>
                    <div className="bow-core"></div>
                  </div>
                </div>
                <div className="gift-box-body">
                  <div className="gift-ribbon-vertical"></div>
                  <div className="gift-ribbon-horizontal"></div>
                </div>
              </div>

              {/* Holographic Gift Tag */}
              <div className="gift-tag glass-panel">
                <div className="gift-tag-header">
                  <span className="sparkle-gold">✦</span>
                  <span>SPECIAL DELIVERY</span>
                </div>
                <div className="gift-tag-row">
                  <span className="tag-label">FOR:</span>
                  <span className="tag-value">{receiverName}</span>
                </div>
                <div className="gift-tag-row">
                  <span className="tag-label">FROM:</span>
                  <span className="tag-value">{senderName}</span>
                </div>
              </div>
            </div>

            <div className="arrival-actions">
              <button type="button" className="btn-action primary pulse-glow" onClick={handleUnwrapGift}>
                <span className="gift-icon">🎁</span>
                <span>Unwrap Your Birthday Gift</span>
              </button>
              <span className="interaction-hint">👆 Tap the gift box to reveal your celebration!</span>
            </div>
          </section>
        )}

        {/* ================= RECEIVER CELEBRATION VIEW ================= */}
        {mode === 'receiver' && giftOpened && (
          <section className="app-view">
            {/* Grand Kinetic Hero */}
            <div className="celebration-hero">
              <div className="kinetic-text-wrap">
                <span className="kinetic-word word-happy">HAPPY</span>
                <span className="kinetic-word word-birthday">BIRTHDAY</span>
              </div>
              <h1 className="celebration-name text-gradient">
                {receiverName}!
              </h1>
            </div>

            {/* 3D Cyber Neon Cake & Photo Topper */}
            <div className="cake-stage-wrapper">
              {/* Balloon clusters */}
              <div className={`balloons-cluster cluster-left ${balloonsPopped ? 'popped' : ''}`}>
                <div className="festive-balloon balloon-cyan"><div className="balloon-body"></div><div className="balloon-string"></div></div>
                <div className="festive-balloon balloon-gold"><div className="balloon-body"></div><div className="balloon-string"></div></div>
              </div>
              <div className={`balloons-cluster cluster-right ${balloonsPopped ? 'popped' : ''}`}>
                <div className="festive-balloon balloon-magenta"><div className="balloon-body"></div><div className="balloon-string"></div></div>
                <div className="festive-balloon balloon-purple"><div className="balloon-body"></div><div className="balloon-string"></div></div>
              </div>

              {/* Interactive Cake Container */}
              <div
                className="cyber-cake-container"
                onClick={toggleWishingCandles}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleWishingCandles()}
              >
                {/* Crowned Photo Topper */}
                <div className={`cake-photo-topper ${photoRevealed ? 'revealed' : ''}`}>
                  <div className="topper-crown">👑</div>
                  <div className="topper-frame">
                    <div className="topper-glow-ring"></div>
                    <div className="topper-frame-inner">
                      {photoUrl ? (
                        <img src={photoUrl} alt={receiverName} className="cake-person-photo" />
                      ) : (
                        <div className="cake-fallback-avatar">
                          <span className="avatar-emoji">{selectedAvatar || '👑'}</span>
                          <span className="avatar-label">{receiverName}</span>
                        </div>
                      )}
                    </div>
                    <div className="topper-orbit-stars">✦ ✦ ✦</div>
                  </div>
                </div>

                {/* Candles Row */}
                <div className="cake-candles-row">
                  <div className="cyber-candle candle-side candle-left">
                    <div className="candle-wick"></div>
                    <div className="flame-wrapper">
                      <div className={`celestial-flame candle-flame ${flameLit ? 'lit' : 'extinguished'}`}></div>
                      <div className={`flame-smoke ${!flameLit ? 'puff' : ''}`}></div>
                    </div>
                    <div className="candle-pillar"></div>
                  </div>
                  <div className="cyber-candle candle-main">
                    <div className="candle-wick"></div>
                    <div className="flame-wrapper">
                      <div className={`celestial-flame candle-flame main-flame ${flameLit ? 'lit' : 'extinguished'}`}></div>
                      <div className={`flame-smoke ${!flameLit ? 'puff' : ''}`}></div>
                    </div>
                    <div className="candle-pillar main-pillar"></div>
                  </div>
                  <div className="cyber-candle candle-side candle-right">
                    <div className="candle-wick"></div>
                    <div className="flame-wrapper">
                      <div className={`celestial-flame candle-flame ${flameLit ? 'lit' : 'extinguished'}`}></div>
                      <div className={`flame-smoke ${!flameLit ? 'puff' : ''}`}></div>
                    </div>
                    <div className="candle-pillar"></div>
                  </div>
                </div>

                {/* Cyber Tiered Cake Structure */}
                <div className="cyber-cake-body">
                  <div className="cake-tier tier-top"><div className="tier-frosting-stripes"></div></div>
                  <div className="cake-tier tier-middle"><div className="tier-frosting-stripes"></div></div>
                  <div className="cake-tier tier-bottom"><div className="tier-frosting-stripes"></div></div>
                  <div className="cake-pedestal"><div className="pedestal-rim"></div></div>
                </div>
              </div>
            </div>

            {/* Candle Controls & Wish Sent Banner */}
            <div className="beacon-controls">
              <button type="button" className="btn-action primary candle-blow-btn" onClick={toggleWishingCandles}>
                <span className="icon">🕯️</span>
                <span>{flameLit ? 'Blow the Wish Candles' : 'Relight Wish Candles 🕯️'}</span>
              </button>
              <button type="button" className="btn-action secondary fireworks-btn" onClick={() => launchFireworkVolley(4)}>
                <span className="icon">🎆</span>
                <span>Launch Cosmic Fireworks</span>
              </button>
            </div>

            {!flameLit && (
              <div className="wish-sent-banner">
                <div className="wish-sent-content">
                  <span className="star-icon">🌟</span>
                  <div>
                    <strong>✨ Candles Blown & Secret Wish Sent to the Cosmos! ✨</strong>
                    <p>May this year be filled with pure magic and all your wildest dreams come true, {receiverName}!</p>
                  </div>
                </div>
              </div>
            )}

            {/* ================= INTERACTIVE ENVELOPE COVER ================= */}
            <section className="letter-scroll-section">
              <div
                className={`envelope-container ${isEnvelopeOpened ? 'opened' : ''}`}
                role="button"
                tabIndex="0"
                aria-label="Tap on the cover to open your letter"
              >
                {/* Envelope Closed Cover */}
                <div
                  className="envelope-cover"
                  onClick={() => {
                    if (!isEnvelopeOpened) {
                      setIsEnvelopeOpened(true);
                      playPopSound();
                      playTone(660, 0.18, 'triangle', 0.2);
                      launchHeartsShower(window.innerWidth / 2, window.innerHeight * 0.55);
                    }
                  }}
                >
                  <div className="envelope-top-flap">
                    <div className="flap-v-shape"></div>
                    <div className="wax-seal-wrapper">
                      <div className="wax-seal-ring"></div>
                      <div className="wax-seal-core">
                        <span className="seal-emoji">💌</span>
                      </div>
                    </div>
                  </div>

                  <div className="envelope-front-face">
                    <div className="envelope-address-card">
                      <span className="envelope-tag-badge">💖 CONFIDENTIAL KEEPSAKE LETTER</span>
                      <div className="envelope-recipient-line">
                        <span className="env-lbl">SPECIAL DELIVERY FOR:</span>
                        <span className="env-val">{receiverName}</span>
                      </div>
                      <div className="envelope-sender-line">
                        <span className="env-lbl">SENT WITH LOVE BY:</span>
                        <span className="env-val">{senderName}</span>
                      </div>
                    </div>

                    <div className="envelope-gesture-prompt">
                      <div className="gesture-icon-bounce">👆</div>
                      <div className="gesture-text-wrap">
                        <strong className="gesture-title">Tap on the cover to open your letter</strong>
                        <span className="gesture-sub">A personal message from the heart is sealed inside ✨</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unfolded Letter Card (Inside Envelope) */}
                <div className="letter-inner-card glass-panel">
                  <div className="scroll-header">
                    <div className="letter-top-row">
                      <span className="scroll-badge">💌 PERSONAL KEEPSAKE LETTER</span>
                      <button
                        type="button"
                        className="btn-fold-letter"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsEnvelopeOpened(false);
                          playTone(440, 0.12, 'sine', 0.12);
                        }}
                        title="Fold back into envelope"
                      >
                        <span>Fold Back ✕</span>
                      </button>
                    </div>
                    <h3 className="scroll-title">A Message From The Heart</h3>
                  </div>

                  <div className="scroll-body">
                    <div className="scroll-salutation">Dear {receiverName},</div>
                    <p className="scroll-text">{wishMessage}</p>
                    <div className="scroll-signature">
                      <span>With all my love & warmest wishes,</span>
                      <strong>— {senderName}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ================= FLOATING SKY BLESSINGS ================= */}
            <section className="wishing-sky-section glass-panel">
              <div className="sky-header">
                <span className="beacon-mini-badge">🎈 CELESTIAL BLESSINGS</span>
                <h3 className="sky-title">Interactive Floating Wishing Sky</h3>
                <p className="sky-sub">Floating star orbs drift above your celebration. Tap any orb to reveal a cosmic blessing!</p>
              </div>

              <div className="sky-orbs-container">
                {floatingOrbs.map(orb => (
                  <button
                    key={orb.id}
                    type="button"
                    className="floating-star-orb"
                    style={{ left: `${orb.left}%`, bottom: `${orb.bottom}%`, animationDelay: `${orb.delay}s` }}
                    onClick={() => handlePopOrb(orb.id)}
                  >
                    <span>{orb.emoji}</span>
                  </button>
                ))}
              </div>

              {activeBlessing && (
                <div className="blessing-toast">
                  <span>✨ {activeBlessing}</span>
                </div>
              )}

              <div className="sky-action-bar">
                <button type="button" className="btn-action primary small" onClick={spawnStarOrb}>
                  <span>✨ Release More Star Wishing Orbs</span>
                </button>
              </div>
            </section>

            {/* Footer Navigation */}
            <footer className="celebration-footer">
              <button type="button" className="btn-action ghost" onClick={handleRewindToGift}>
                <span>🎁 Rewatch Gift Surprise</span>
              </button>
            </footer>
          </section>
        )}
      </main>
    </div>
  );
}
