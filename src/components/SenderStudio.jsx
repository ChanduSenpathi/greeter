import React from 'react';
import { MESSAGE_PRESETS, AVATAR_PRESETS } from '../utils/constants';

export default function SenderStudio({
  receiverName,
  setReceiverName,
  senderName,
  setSenderName,
  wishMessage,
  setWishMessage,
  photoUrl,
  setPhotoUrl,
  selectedAvatar,
  setSelectedAvatar,
  copyStatus,
  onCopyLink,
  onTestPreview,
  onShareWhatsApp
}) {
  const handlePhotoUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const rawData = uploadEvent.target.result;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 320;
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
          const compressedData = canvas.toDataURL('image/jpeg', 0.88);
          setPhotoUrl(compressedData);
          try {
            localStorage.setItem('cyberwish_photo', compressedData);
          } catch (err) {}
        };
        img.src = rawData;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section id="view-sender-studio" className="app-view">
      <div className="studio-card glass-panel">
        <div className="badge-pill cyber-badge">⚡ CYBER WISH CREATOR ⚡</div>
        <h1 className="studio-title">
          Send a Magical <span className="text-gradient">Birthday Wish</span>
        </h1>
        <p className="studio-sub">
          Enter the birthday person's name below to generate their exclusive interactive gift link.
        </p>

        <form className="studio-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="input-to-name">Birthday Person's Name (Receiver)</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">👑</span>
                <input
                  type="text"
                  id="input-to-name"
                  placeholder="e.g. Priya, Alex, Sarah, Mom"
                  maxLength={30}
                  autoComplete="off"
                  value={receiverName === 'Friend' ? '' : receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="input-from-name">Your Name (Sender)</label>
              <div className="input-icon-wrapper">
                <span className="input-icon">💌</span>
                <input
                  type="text"
                  id="input-from-name"
                  placeholder="e.g. Chandu Senapathi, Your Bestie, Sam"
                  maxLength={30}
                  autoComplete="off"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Photo Upload for Birthday Cake Reveal */}
          <div className="form-group photo-upload-group">
            <div className="label-with-presets">
              <label htmlFor="input-photo-file">
                <span>Birthday Person's Photo (Reveals on their Cake! 🎂)</span>
              </label>
              <span className="upload-badge-pill">Magical Cake Topper</span>
            </div>

            <div className="photo-upload-card" id="photo-upload-card">
              {/* Show Dropzone ONLY when NO photo is uploaded */}
              {!photoUrl ? (
                <div className="photo-dropzone" id="photo-dropzone">
                  <input
                    type="file"
                    id="input-photo-file"
                    accept="image/*"
                    className="photo-file-input"
                    aria-label="Upload birthday person photo"
                    onChange={handlePhotoUpload}
                  />
                  <div className="dropzone-content">
                    <div className="dropzone-icon-circle">📸</div>
                    <div className="dropzone-text-group">
                      <strong className="dropzone-title">Click or Drop Photo Here</strong>
                      <span className="dropzone-hint">Upload portrait to crown their illuminated birthday cake</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Once photo is uploaded, ONLY show this preview card and hide the upload dropzone */
                <div id="studio-photo-preview" className="studio-photo-preview">
                  <div className="studio-avatar-wrapper">
                    <img id="studio-photo-img" src={photoUrl} alt="Photo preview for birthday cake" />
                    <div className="studio-avatar-ring"></div>
                  </div>
                  <div className="studio-photo-details">
                    <div className="photo-status-tag">✨ Photo Ready to Crown the Cake!</div>
                    <p className="photo-status-sub">This portrait will emerge crowned on the cake when candles are blown.</p>
                    <button
                      type="button"
                      id="btn-remove-photo"
                      className="btn-remove-photo"
                      onClick={() => {
                        setPhotoUrl('');
                        try {
                          localStorage.removeItem('cyberwish_photo');
                        } catch (err) {}
                      }}
                    >
                      ✕ Remove & Choose Another
                    </button>
                  </div>
                </div>
              )}

              {/* Quick Avatar Presets */}
              <div className="quick-avatar-bar">
                <span className="quick-avatar-label">Or Pick a Cyber Avatar:</span>
                <div className="quick-avatar-chips">
                  {AVATAR_PRESETS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      className={`avatar-chip ${selectedAvatar === icon && !photoUrl ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedAvatar(icon);
                        setPhotoUrl('');
                      }}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="label-with-presets">
              <label htmlFor="input-wish-msg">Heartfelt Birthday Message</label>
              <div className="preset-chips">
                <button
                  type="button"
                  className="preset-chip"
                  onClick={() => setWishMessage(MESSAGE_PRESETS.heartfelt)}
                >
                  💖 Heartfelt
                </button>
                <button
                  type="button"
                  className="preset-chip"
                  onClick={() => setWishMessage(MESSAGE_PRESETS.joyful)}
                >
                  🎉 Cheerful
                </button>
                <button
                  type="button"
                  className="preset-chip"
                  onClick={() => setWishMessage(MESSAGE_PRESETS.inspirational)}
                >
                  🚀 Cosmic
                </button>
              </div>
            </div>
            <textarea
              id="input-wish-msg"
              rows={6}
              placeholder="Write something sweet, inspiring, or memorable..."
              value={wishMessage}
              onChange={(e) => setWishMessage(e.target.value)}
            />
          </div>

          {/* Live Gift Box Mini Preview */}
          <div className="live-preview-box">
            <span className="preview-badge">LIVE GIFT TAG PREVIEW</span>
            <div className="preview-tag-display">
              <div className="preview-tag-line">
                <span>TO:</span> <strong>{receiverName || 'Priya'}</strong>
              </div>
              <div className="preview-tag-line">
                <span>FROM:</span> <strong>{senderName || 'Chandu Senapathi'}</strong>
              </div>
            </div>
          </div>

          {/* Studio Actions */}
          <div className="studio-actions">
            <button
              type="button"
              id="btn-copy-link"
              className="btn-primary cyber-glow-btn"
              onClick={onCopyLink}
            >
              <span>📋 Copy Shareable Wish Link</span>
            </button>
            <button
              type="button"
              id="btn-whatsapp-share"
              className="btn-action secondary"
              onClick={onShareWhatsApp}
            >
              <span>📱 Share on WhatsApp</span>
            </button>
            <button
              type="button"
              id="btn-test-preview"
              className="btn-action tertiary"
              onClick={onTestPreview}
            >
              <span>👁️ Test & Preview as Receiver</span>
            </button>
          </div>

          {/* Link Copy Notification Toast */}
          {copyStatus && (
            <div id="copy-status-banner" className="copy-status">
              ✅ <strong>Personalized link copied to clipboard!</strong> Send it to your birthday friend to surprise them!
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
