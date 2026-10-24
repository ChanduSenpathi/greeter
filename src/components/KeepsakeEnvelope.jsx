import React from 'react';

export default function KeepsakeEnvelope({
  receiverName,
  senderName,
  wishMessage,
  isOpened,
  onOpenEnvelope,
  onFoldEnvelope
}) {
  return (
    <section className="letter-scroll-section">
      <div
        className={`envelope-container ${isOpened ? 'opened' : ''}`}
        role="button"
        tabIndex="0"
        aria-label="Tap on the cover to open your letter"
      >
        {/* Envelope Closed Cover */}
        <div className="envelope-cover" onClick={onOpenEnvelope}>
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
                  onFoldEnvelope();
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
  );
}
