import React from 'react';

export default function GiftArrival({ receiverName, senderName, onUnwrap }) {
  return (
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
        onClick={onUnwrap}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onUnwrap()}
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
        <button type="button" className="btn-action primary pulse-glow" onClick={onUnwrap}>
          <span className="gift-icon">🎁</span>
          <span>Unwrap Your Birthday Gift</span>
        </button>
        <span className="interaction-hint">👆 Tap the gift box to reveal your celebration!</span>
      </div>
    </section>
  );
}
