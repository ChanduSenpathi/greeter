import React from 'react';

export default function BirthdayCake({
  receiverName,
  photoUrl,
  selectedAvatar,
  flameLit,
  balloonsPopped,
  photoRevealed,
  onToggleCandles,
  onLaunchFireworks
}) {
  return (
    <section className="wishing-beacon-arena">
      <div className="beacon-card glass-panel">
        {/* Cake Stage with Floating Balloons */}
        <div className="cake-stage-wrapper">
          {/* Left Balloon Cluster */}
          <div className={`balloons-cluster cluster-left ${balloonsPopped ? 'popped' : ''}`}>
            <div className="balloon balloon-cyan"><div className="balloon-shine"></div><div className="balloon-string"></div></div>
            <div className="balloon balloon-pink"><div className="balloon-shine"></div><div className="balloon-string"></div></div>
            <div className="balloon balloon-gold"><div className="balloon-shine"></div><div className="balloon-string"></div></div>
          </div>

          {/* The Cyber Neon Birthday Cake Container */}
          <div
            className="cyber-cake-container"
            role="button"
            tabIndex={0}
            onClick={onToggleCandles}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleCandles()}
            aria-label="Tap to blow out the candles and reveal the photo"
          >
            {/* Crowned Photo Topper */}
            <div className={`cake-photo-topper ${photoRevealed ? 'revealed' : ''}`}>
              <div className="topper-crown">👑</div>
              <div className="topper-frame">
                <div className="topper-glow-ring"></div>
                <div className="topper-frame-inner">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Birthday Star" className="cake-person-photo" />
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

            {/* Cyber Candles Row atop Cake */}
            <div className="cake-candles-row">
              {/* Left Candle */}
              <div className="cyber-candle candle-side candle-left">
                <div className="candle-wick"></div>
                <div className="flame-wrapper">
                  <div className={`celestial-flame candle-flame ${flameLit ? 'lit' : 'extinguished'}`}></div>
                  <div className={`flame-smoke ${!flameLit ? 'puff' : ''}`}></div>
                </div>
                <div className="candle-pillar"></div>
              </div>

              {/* Center Main Candle */}
              <div className="cyber-candle candle-main">
                <div className="candle-wick"></div>
                <div className="flame-wrapper">
                  <div className={`celestial-flame candle-flame ${flameLit ? 'lit' : 'extinguished'}`}></div>
                  <div className={`flame-smoke ${!flameLit ? 'puff' : ''}`}></div>
                </div>
                <div className="candle-pillar"></div>
              </div>

              {/* Right Candle */}
              <div className="cyber-candle candle-side candle-right">
                <div className="candle-wick"></div>
                <div className="flame-wrapper">
                  <div className={`celestial-flame candle-flame ${flameLit ? 'lit' : 'extinguished'}`}></div>
                  <div className={`flame-smoke ${!flameLit ? 'puff' : ''}`}></div>
                </div>
                <div className="candle-pillar"></div>
              </div>
            </div>

            {/* 3-Tier Cyber Cake Body */}
            <div className="cyber-cake-body">
              {/* Top Tier */}
              <div className="cake-tier tier-top">
                <div className="tier-frosting-drips">
                  <span className="drip d1"></span>
                  <span className="drip d2"></span>
                  <span className="drip d3"></span>
                  <span className="drip d4"></span>
                  <span className="drip d5"></span>
                </div>
                <div className="tier-glow-strip"></div>
                <div className="tier-sprinkles">✦ · ✦ · ✦</div>
              </div>

              {/* Middle Tier */}
              <div className="cake-tier tier-mid">
                <div className="tier-frosting-drips">
                  <span className="drip d1"></span>
                  <span className="drip d2"></span>
                  <span className="drip d3"></span>
                  <span className="drip d4"></span>
                  <span className="drip d5"></span>
                  <span className="drip d6"></span>
                </div>
                <div className="tier-accent-banner">
                  <span className="cake-banner-text">★ HAPPY BIRTHDAY ★</span>
                </div>
                <div className="tier-sprinkles">✦ · ✦ · ✦ · ✦</div>
              </div>

              {/* Base Tier */}
              <div className="cake-tier tier-base">
                <div className="tier-frosting-drips">
                  <span className="drip d1"></span>
                  <span className="drip d2"></span>
                  <span className="drip d3"></span>
                  <span className="drip d4"></span>
                  <span className="drip d5"></span>
                  <span className="drip d6"></span>
                  <span className="drip d7"></span>
                </div>
                <div className="tier-cyber-grid"></div>
              </div>

              {/* Cake Plate / Stand */}
              <div className="cake-stand-pedestal">
                <div className="pedestal-disc"></div>
                <div className="pedestal-glow"></div>
              </div>
            </div>
          </div>

          {/* Right Balloon Cluster */}
          <div className={`balloons-cluster cluster-right ${balloonsPopped ? 'popped' : ''}`}>
            <div className="balloon balloon-pink"><div className="balloon-shine"></div><div className="balloon-string"></div></div>
            <div className="balloon balloon-cyan"><div className="balloon-shine"></div><div className="balloon-string"></div></div>
            <div className="balloon balloon-gold"><div className="balloon-shine"></div><div className="balloon-string"></div></div>
          </div>
        </div>

        {/* Wish Controls */}
        <div className="beacon-actions">
          <button type="button" className="btn-action" onClick={onToggleCandles}>
            <span className="icon">🕯️</span>
            <span>{flameLit ? 'Blow the Wish Candles' : 'Relight Wish Candles 🕯️'}</span>
          </button>
          <button type="button" className="btn-action secondary" onClick={onLaunchFireworks}>
            <span className="icon">🎆</span>
            <span>Launch Cosmic Fireworks</span>
          </button>
        </div>

        {/* Wish Sent Cosmic Banner */}
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
      </div>
    </section>
  );
}
