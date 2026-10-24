import React from 'react';

export default function Navbar({ soundEnabled, onToggleSound }) {
  return (
    <header className="top-bar">
      <div className="control-actions">
        <button
          type="button"
          className={`icon-button ${soundEnabled ? 'highlight' : ''}`}
          onClick={onToggleSound}
          title="Toggle Music & Sound Effects"
          aria-label="Toggle Sound"
        >
          <span className="btn-icon">{soundEnabled ? '🔊' : '🔇'}</span>
          <span className="btn-label">Music</span>
        </button>
      </div>
    </header>
  );
}
