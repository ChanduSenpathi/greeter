import React from 'react';

export default function WishingSky({
  floatingOrbs,
  activeBlessing,
  onPopOrb,
  onSpawnOrb
}) {
  return (
    <section className="wishing-sky-section glass-panel">
      <div className="sky-header">
        <span className="beacon-mini-badge">🎈 CELESTIAL BLESSINGS</span>
        <h3>Tap The Floating Star Orbs</h3>
        <p>
          Glowing lanterns of destiny are floating by. Tap any orb to reveal a special blessing for your year ahead!
        </p>
      </div>

      <div className="sky-orbs-container">
        {floatingOrbs.map((orb) => (
          <button
            key={orb.id}
            type="button"
            className="floating-star-orb"
            style={{
              left: `${orb.left}%`,
              bottom: `${orb.bottom}%`,
              animationDelay: `${orb.delay}s`
            }}
            onClick={() => onPopOrb(orb.id)}
          >
            <span>{orb.emoji}</span>
          </button>
        ))}
      </div>

      {activeBlessing && (
        <div id="blessing-reveal-toast" className="blessing-toast">
          <span className="blessing-icon">✨</span>
          <span>{activeBlessing}</span>
        </div>
      )}

      <div className="sky-controls">
        <button
          type="button"
          id="btn-release-orbs"
          className="btn-action secondary"
          onClick={onSpawnOrb}
        >
          <span>✨ Release More Star Orbs</span>
        </button>
      </div>
    </section>
  );
}
