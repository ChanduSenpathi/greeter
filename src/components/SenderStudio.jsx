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
  onTestPreview
}) {
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

  return (
    <section className="app-view">
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

          {/* Message Presets */}
          <div className="form-group">
            <div className="label-with-presets">
              <label htmlFor="input-wish-msg">Heartfelt Birthday Message</label>
              <div className="preset-chips">
                <button
                  type="button"
                  className="preset-chip"
                  onClick={() => setWishMessage(MESSAGE_PRESETS.heartfelt)}
                >
                  Heartfelt (BFF)
                </button>
                <button
                  type="button"
                  className="preset-chip"
                  onClick={() => setWishMessage(MESSAGE_PRESETS.joyful)}
                >
                  Joyful
                </button>
                <button
                  type="button"
                  className="preset-chip"
                  onClick={() => setWishMessage(MESSAGE_PRESETS.inspirational)}
                >
                  Cosmic
                </button>
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
            <button type="button" className="btn-action primary" onClick={onCopyLink}>
              <span>🔗 Copy Gift Link</span>
            </button>
            <button type="button" className="btn-action accent" onClick={onTestPreview}>
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
  );
}
