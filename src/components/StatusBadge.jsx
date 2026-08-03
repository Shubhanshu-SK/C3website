import React from 'react';

export default function StatusBadge({ status }) {
  let styles = {};
  let label = '';

  switch (status?.toLowerCase()) {
    case 'upcoming':
      styles = {
        color: 'var(--c-mint)',
        borderColor: 'var(--c-mint)',
        background: 'var(--c-mint-bg)'
      };
      label = 'Upcoming';
      break;
    case 'ongoing':
      styles = {
        color: 'var(--c-electric)',
        borderColor: 'var(--c-electric)',
        background: 'rgba(56, 191, 255, 0.1)'
      };
      label = 'Ongoing';
      break;
    case 'completed':
      styles = {
        color: 'var(--c-fg-mute)',
        borderColor: 'var(--c-border)',
        background: 'var(--c-surface)'
      };
      label = 'Completed';
      break;
    default:
      styles = {
        color: 'var(--c-fg-soft)',
        borderColor: 'var(--c-border)',
        background: 'var(--c-surface)'
      };
      label = status || 'Unknown';
  }

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase border font-medium"
      style={styles}
    >
      {label}
    </span>
  );
}
