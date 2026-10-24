import React from 'react';

export default function GiftArrival({ receiverName, senderName, onUnwrap }) {
  return (
    <section id="view-receiver-arrival" className="app-view">
      <div className="arrival-showcase">
        <div className="badge-pill cyber-badge pulse-glow">🎁 SPECIAL DELIVERY INCOMING</div>
        <h1 className="arrival-title">
          A Cosmic Surprise For <span className="text-gradient">{receiverName}</span>
        </h1>
        <p className="arrival-sub">A special package sent with pure love and celebration has just landed.</p>

        {/* 3D Interactive Cyber Holographic Gift Box */}
        <div
          id="interactive-gift-box"
          className="gift-box-wrapper"
          role="button"
          tabIndex={0}
          onClick={onUnwrap}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onUnwrap()}
          aria-label="Tap to open your birthday surprise"
        >
          <div className="gift-box">
            <div className="gift-lid">
              <div className="ribbon-bow">
                <span className="bow-loop left"></span>
                <span className="bow-loop right"></span>
                <span className="bow-center"></span>
              </div>
              <div className="lid-ribbon"></div>
            </div>
            <div className="gift-body">
              <div className="body-ribbon-v"></div>
              <div className="body-ribbon-h"></div>
              <div className="hologram-tag">
                <div className="tag-row">
                  <span className="tag-lbl">TO:</span>
                  <span className="tag-val">{receiverName}</span>
                </div>
                <div className="tag-row">
                  <span className="tag-lbl">FROM:</span>
                  <span className="tag-val">{senderName}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="gift-shadow"></div>
          <div className="gift-sparkles">
            <span className="sparkle s1">⭐</span>
            <span className="sparkle s2">✨</span>
            <span className="sparkle s3">🌟</span>
            <span className="sparkle s4">💖</span>
          </div>
        </div>

        <button type="button" id="btn-unwrap-gift" className="btn-primary cyber-glow-btn pulse-btn" onClick={onUnwrap}>
          <span>🎁 Tap Gift to Unwrap Your Surprise</span>
        </button>
      </div>
    </section>
  );
}
