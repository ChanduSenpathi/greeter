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
    <div className="cake-ceremony-section">
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
          onClick={onToggleCandles}
          role="button"
          tabIndex="0"
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggleCandles()}
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
        <button type="button" className="btn-action primary candle-blow-btn" onClick={onToggleCandles}>
          <span className="icon">🕯️</span>
          <span>{flameLit ? 'Blow the Wish Candles' : 'Relight Wish Candles 🕯️'}</span>
        </button>
        <button type="button" className="btn-action secondary fireworks-btn" onClick={onLaunchFireworks}>
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
    </div>
  );
}
