import React from 'react';

/**
 * SectionDivider — a whisper-thin gradient line.
 * Replaces the old circuit-board SVG which was visually intrusive.
 * Alternating section backgrounds already handle visual separation;
 * this just adds a subtle accent rhythm between them.
 */
export default function CircuitDivider() {
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '1px',
        background: 'linear-gradient(90deg, rgba(74,240,160,0) 0%, var(--c-mint) 35%, var(--c-electric) 65%, rgba(56,191,255,0) 100%)',
        opacity: 0.18,
        pointerEvents: 'none',
      }}
    />
  );
}
