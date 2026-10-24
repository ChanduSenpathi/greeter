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
        <h3 className="sky-title">Interactive Floating Wishing Sky</h3>
        <p className="sky-sub">
          Floating star orbs drift above your celebration. Tap any orb to reveal a cosmic blessing!
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
        <div className="blessing-toast">
          <span>✨ {activeBlessing}</span>
        </div>
      )}

      <div className="sky-action-bar">
        <button type="button" className="btn-action primary small" onClick={onSpawnOrb}>
          <span>✨ Release More Star Wishing Orbs</span>
        </button>
      </div>
    </section>
  );
}
