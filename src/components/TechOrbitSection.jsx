import React from 'react';
import SolarSystem from './SolarSystem';

export default function TechOrbitSection() {
  return (
    <section
      style={{ padding: '100px 0', textAlign: 'center', position: 'relative' }}
      aria-label="C-Cell Technology Stack"
    >
      {/* Eyebrow — matches site's .eyebrow CSS utility style */}
      <span className="eyebrow">Our Tech</span>

      {/* Section heading — Clash Display, bold white + italic crimson */}
      <h2
        className="section-heading"
        style={{ marginBottom: '16px' }}
      >
        Powering{' '}
        <span style={{ color: 'var(--c-crimson)', fontStyle: 'italic' }}>C-Cell</span>
      </h2>

      {/* Subtitle */}
      <p
        style={{
          color: 'var(--c-fg-soft)',
          fontSize: '1rem',
          maxWidth: '520px',
          margin: '0 auto 56px',
          lineHeight: 1.6,
          fontFamily: '"Cabinet Grotesk", sans-serif',
        }}
      >
        The tools and skills behind every project, event, and initiative we run.
      </p>

      {/* Solar System orbit animation */}
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <SolarSystem isPaused={false} speedMultiplier={1} />
      </div>
    </section>
  );
}
