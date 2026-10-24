import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import BackgroundEffects from './components/BackgroundEffects';
import SenderStudio from './components/SenderStudio';
import GiftArrival from './components/GiftArrival';
import BirthdayCake from './components/BirthdayCake';
import KeepsakeEnvelope from './components/KeepsakeEnvelope';
import WishingSky from './components/WishingSky';
import { MESSAGE_PRESETS, STAR_BLESSINGS } from './utils/constants';
import {
  getAudioContext,
  playTone,
  playPopSound,
  playBlowSound,
  playChimeVictory,
  playBirthdayMelody,
  stopBirthdayMelody
} from './utils/audioSynthesizer';

export default function App() {
  // Application State
  const [mode, setMode] = useState('receiver'); // 'receiver' or 'studio'
  const [receiverName, setReceiverName] = useState('Friend');
  const [senderName, setSenderName] = useState('Chandu Senapathi');
  const [wishMessage, setWishMessage] = useState(MESSAGE_PRESETS.heartfelt);
  const [photoUrl, setPhotoUrl] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('👑');

  // Interactive UI State
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

  // Refs
  const effectsRef = useRef(null);
  const autoBlowTimeoutRef = useRef(null);
  const fireworksIntervalRef = useRef(null);

  // --- CANDLE & CAKE CEREMONY ---
  const handleToggleCandles = useCallback(() => {
    if (flameLit) {
      setFlameLit(false);
      setBalloonsPopped(true);
      setPhotoRevealed(true);
      playBlowSound(soundEnabled);
      playPopSound(soundEnabled);

      setTimeout(() => {
        playChimeVictory(soundEnabled);
        if (effectsRef.current) {
          effectsRef.current.launchFireworkVolley(4);
          effectsRef.current.launchConfetti(window.innerWidth * 0.28, window.innerHeight * 0.42, 50);
          effectsRef.current.launchConfetti(window.innerWidth * 0.72, window.innerHeight * 0.42, 50);
          effectsRef.current.launchConfetti(window.innerWidth / 2, window.innerHeight * 0.38, 80);
        }
      }, 200);
    } else {
      setFlameLit(true);
      setBalloonsPopped(false);
      playTone(660, 0.12, 'triangle', 0.15, soundEnabled);
    }
  }, [flameLit, soundEnabled]);

  // --- UNWRAP SURPRISE GIFT ---
  const handleUnwrapGift = useCallback(() => {
    playPopSound(soundEnabled);
    playTone(523.25, 0.15, 'triangle', 0.2, soundEnabled);
    setGiftOpened(true);
    setIsEnvelopeOpened(false);

    // Initial celebratory blast
    setTimeout(() => {
      if (effectsRef.current) {
        effectsRef.current.launchFireworkVolley(4);
        effectsRef.current.launchConfetti(window.innerWidth / 2, window.innerHeight / 2, 80);
      }
    }, 400);

    // Auto-blow candles after 3 seconds
    if (autoBlowTimeoutRef.current) clearTimeout(autoBlowTimeoutRef.current);
    autoBlowTimeoutRef.current = setTimeout(() => {
      handleToggleCandles();
    }, 3000);

    // Continuous ambient fireworks
    if (fireworksIntervalRef.current) clearInterval(fireworksIntervalRef.current);
    fireworksIntervalRef.current = setInterval(() => {
      if (effectsRef.current) {
        effectsRef.current.launchFireworkVolley(Math.random() > 0.4 ? 4 : 3);
      }
    }, 5500);
  }, [soundEnabled, handleToggleCandles]);

  // --- REWIND TO GIFT ARRIVAL ---
  const handleRewindToGift = useCallback(() => {
    if (fireworksIntervalRef.current) clearInterval(fireworksIntervalRef.current);
    if (autoBlowTimeoutRef.current) clearTimeout(autoBlowTimeoutRef.current);
    setGiftOpened(false);
    setFlameLit(true);
    setBalloonsPopped(false);
    setPhotoRevealed(false);
    setIsEnvelopeOpened(false);
    playTone(450, 0.1, 'sine', 0.15, soundEnabled);
  }, [soundEnabled]);

  // --- TOGGLE SOUND ---
  const handleToggleSound = useCallback(() => {
    const nextSound = !soundEnabled;
    setSoundEnabled(nextSound);
    if (nextSound) {
      getAudioContext();
      playBirthdayMelody(true);
    } else {
      stopBirthdayMelody();
    }
  }, [soundEnabled]);

  // --- ORBS & BLESSINGS ---
  const spawnStarOrb = useCallback(() => {
    const emojis = ['⭐', '🌟', '✨', '🎈', '💖', '🎂'];
    const newOrb = {
      id: Date.now() + Math.random(),
      left: Math.random() * 85 + 5,
      bottom: Math.random() * 40 + 20,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      delay: Math.random() * 2
    };
    setFloatingOrbs((prev) => [...prev.slice(-12), newOrb]);
  }, []);

  const handlePopOrb = useCallback((id) => {
    playPopSound(soundEnabled);
    const blessing = STAR_BLESSINGS[Math.floor(Math.random() * STAR_BLESSINGS.length)];
    setActiveBlessing(blessing);
    setFloatingOrbs((prev) => prev.filter((orb) => orb.id !== id));
    setTimeout(() => setActiveBlessing(null), 4500);
  }, [soundEnabled]);

  // --- ENVELOPE HANDLERS ---
  const handleOpenEnvelope = useCallback(() => {
    if (!isEnvelopeOpened) {
      setIsEnvelopeOpened(true);
      playPopSound(soundEnabled);
      playTone(660, 0.18, 'triangle', 0.2, soundEnabled);
      if (effectsRef.current) {
        effectsRef.current.launchHeartsShower(window.innerWidth / 2, window.innerHeight * 0.55);
      }
    }
  }, [isEnvelopeOpened, soundEnabled]);

  const handleFoldEnvelope = useCallback(() => {
    setIsEnvelopeOpened(false);
    playTone(440, 0.12, 'sine', 0.12, soundEnabled);
  }, [soundEnabled]);

  // --- ROUTE & URL INITIALIZATION ---
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
    const presetVal = getParam('preset');
    const msgVal = getParam('msg') || getParam('message');
    const cmsgVal = getParam('cmsg');
    const photoVal = getParam('photo');
    const avatarVal = getParam('avatar');
    let savedPhoto = '';
    try {
      savedPhoto = localStorage.getItem('cyberwish_photo') || '';
    } catch (e) {}

    // Resolve wish message cleanly
    let resolvedMsg = MESSAGE_PRESETS.heartfelt;
    if (presetVal && MESSAGE_PRESETS[presetVal]) {
      resolvedMsg = MESSAGE_PRESETS[presetVal];
    } else if (cmsgVal) {
      try {
        resolvedMsg = decodeURIComponent(atob(cmsgVal));
      } catch (e) {
        resolvedMsg = MESSAGE_PRESETS.heartfelt;
      }
    } else if (msgVal) {
      resolvedMsg = msgVal.trim();
    }

    if (toVal) {
      setMode('receiver');
      setReceiverName(toVal.trim());
      if (fromVal) setSenderName(fromVal.trim());
      setWishMessage(resolvedMsg);
      if (photoVal) {
        setPhotoUrl(photoVal);
      } else if (savedPhoto) {
        setPhotoUrl(savedPhoto);
      }
      if (avatarVal) setSelectedAvatar(avatarVal);

      try {
        localStorage.setItem(
          'cyberwish_package',
          JSON.stringify({
            to: toVal.trim(),
            from: fromVal ? fromVal.trim() : 'Chandu Senapathi',
            msg: resolvedMsg,
            photo: photoVal || savedPhoto || '',
            avatar: avatarVal || '👑'
          })
        );
      } catch (e) {}
    } else {
      try {
        const saved = localStorage.getItem('cyberwish_package');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.to) {
            setMode('receiver');
            setReceiverName(parsed.to);
            if (parsed.from) setSenderName(parsed.from);
            if (parsed.msg) setWishMessage(parsed.msg);
            if (parsed.photo) {
              setPhotoUrl(parsed.photo);
            } else if (savedPhoto) {
              setPhotoUrl(savedPhoto);
            }
            if (parsed.avatar) setSelectedAvatar(parsed.avatar);
            return;
          }
        }
      } catch (e) {}
      setMode('studio');
      if (savedPhoto) setPhotoUrl(savedPhoto);
    }
  }, []);

  // --- STUDIO ACTIONS ---
  const buildShareUrl = useCallback(() => {
    const base = window.location.origin + window.location.pathname;
    const url = new URL(base);
    const to = receiverName.trim() || 'Priya';
    const from = senderName.trim() || 'Chandu Senapathi';
    url.searchParams.set('to', to);
    if (from !== 'Chandu Senapathi') {
      url.searchParams.set('from', from);
    }

    // Clean sharing: Do NOT expose raw message text in the URL!
    const trimmedMsg = wishMessage.trim();
    if (trimmedMsg === MESSAGE_PRESETS.joyful.trim()) {
      url.searchParams.set('preset', 'joyful');
    } else if (trimmedMsg === MESSAGE_PRESETS.inspirational.trim()) {
      url.searchParams.set('preset', 'inspirational');
    } else if (trimmedMsg === MESSAGE_PRESETS.heartfelt.trim()) {
      // Default heartfelt message: Receiver automatically uses this! Zero URL pollution.
    } else {
      // Custom message: encode cleanly to keep URL clean and maintain the unboxing surprise
      try {
        const encoded = btoa(encodeURIComponent(trimmedMsg));
        url.searchParams.set('cmsg', encoded);
      } catch (e) {
        url.searchParams.set('msg', trimmedMsg);
      }
    }

    if (selectedAvatar && selectedAvatar !== '👑') {
      url.searchParams.set('avatar', selectedAvatar);
    }
    if (photoUrl && (photoUrl.startsWith('http://') || photoUrl.startsWith('https://'))) {
      url.searchParams.set('photo', photoUrl);
    }
    return url.toString();
  }, [receiverName, senderName, wishMessage, selectedAvatar, photoUrl]);

  const handleCopyLink = useCallback(() => {
    const shareUrl = buildShareUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopyStatus(true);
      playTone(880, 0.15, 'sine', 0.2, soundEnabled);
      setTimeout(() => setCopyStatus(false), 4500);
    });
  }, [buildShareUrl, soundEnabled]);

  const handleShareWhatsApp = useCallback(() => {
    const shareUrl = buildShareUrl();
    const to = receiverName.trim() || 'Special Person';
    const text = encodeURIComponent(`🎉 Hey ${to}! You have received an exclusive birthday surprise package! Open your gift here: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  }, [buildShareUrl, receiverName]);

  const handleTestPreview = useCallback(() => {
    const receiverUrl = buildShareUrl();
    window.history.pushState({}, '', receiverUrl);
    try {
      localStorage.setItem(
        'cyberwish_package',
        JSON.stringify({
          to: receiverName.trim() || 'Priya',
          from: senderName.trim() || 'Chandu Senapathi',
          msg: wishMessage.trim() || MESSAGE_PRESETS.heartfelt,
          photo: photoUrl,
          avatar: selectedAvatar
        })
      );
      if (photoUrl) {
        localStorage.setItem('cyberwish_photo', photoUrl);
      }
    } catch (e) {}
    setMode('receiver');
    setGiftOpened(false);
  }, [buildShareUrl, receiverName, senderName, wishMessage, photoUrl, selectedAvatar]);

  return (
    <div className="cyber-experience-root">
      <BackgroundEffects ref={effectsRef} soundEnabled={soundEnabled} />
      <Navbar soundEnabled={soundEnabled} onToggleSound={handleToggleSound} />

      <main className="main-wrapper">
        {mode === 'studio' && (
          <SenderStudio
            receiverName={receiverName}
            setReceiverName={setReceiverName}
            senderName={senderName}
            setSenderName={setSenderName}
            wishMessage={wishMessage}
            setWishMessage={setWishMessage}
            photoUrl={photoUrl}
            setPhotoUrl={setPhotoUrl}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
            copyStatus={copyStatus}
            onCopyLink={handleCopyLink}
            onTestPreview={handleTestPreview}
            onShareWhatsApp={handleShareWhatsApp}
          />
        )}

        {mode === 'receiver' && !giftOpened && (
          <GiftArrival
            receiverName={receiverName}
            senderName={senderName}
            onUnwrap={handleUnwrapGift}
          />
        )}

        {mode === 'receiver' && giftOpened && (
          <section id="view-receiver-celebration" className="app-view">
            {/* Grand Celestial Happy Birthday Header */}
            <header className="celebration-hero" id="main-celebration-hero">
              <div className="celebration-badge animate-slide-up">🎉 Happy Birthday 🎉</div>
              <h1 className="hero-title animate-slide-up delay-1">
                Happy Birthday, <span className="text-gradient">{receiverName}</span>!
              </h1>
              <p className="hero-quote animate-slide-up delay-2">
                "May this new orbit around the sun bring you endless joy, fearless triumph, and radiant magic!"
              </p>
            </header>

            {/* 3D Birthday Cake & Candles Ritual */}
            <BirthdayCake
              receiverName={receiverName}
              photoUrl={photoUrl}
              selectedAvatar={selectedAvatar}
              flameLit={flameLit}
              balloonsPopped={balloonsPopped}
              photoRevealed={photoRevealed}
              onToggleCandles={handleToggleCandles}
              onLaunchFireworks={() => effectsRef.current && effectsRef.current.launchFireworkVolley(4)}
            />

            {/* 3D Interactive Keepsake Envelope */}
            <KeepsakeEnvelope
              receiverName={receiverName}
              senderName={senderName}
              wishMessage={wishMessage}
              isOpened={isEnvelopeOpened}
              onOpenEnvelope={handleOpenEnvelope}
              onFoldEnvelope={handleFoldEnvelope}
            />

            {/* Floating Wishing Sky */}
            <WishingSky
              floatingOrbs={floatingOrbs}
              activeBlessing={activeBlessing}
              onPopOrb={handlePopOrb}
              onSpawnOrb={spawnStarOrb}
            />

            {/* Footer Navigation */}
            <footer className="celebration-footer">
              <button
                type="button"
                id="btn-rewatch-gift"
                className="btn-link"
                onClick={handleRewindToGift}
              >
                🔄 Rewatch Gift Unboxing
              </button>
            </footer>
          </section>
        )}
      </main>
    </div>
  );
}
