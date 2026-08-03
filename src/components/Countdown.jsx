import React from 'react';
import useCountdown from '../hooks/useCountdown';

function CounterBox({ value, label }) {
  return (
    <div
      className="flex flex-col items-center rounded-xl border border-[var(--c-border)]"
      style={{ background: 'var(--c-surface-2)', padding: '8px 10px', minWidth: '50px' }}
    >
      <span
        className="font-display font-bold leading-none"
        style={{ color: 'var(--c-mint)', fontSize: '1.25rem' }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span className="font-mono tracking-widest uppercase mt-1" style={{ color: 'var(--c-fg-mute)', fontSize: '8px' }}>
        {label}
      </span>
    </div>
  );
}

export default function Countdown({ targetDate, label = 'Starts In' }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(targetDate);

  if (expired) {
    return (
      <div className="text-center font-mono text-xs tracking-wider py-2" style={{ color: 'var(--c-fg-mute)' }}>
        ● EVENT ALREADY STARTED
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {label && (
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase mb-2" style={{ color: 'var(--c-fg-mute)' }}>
          {label}
        </span>
      )}
      <div className="flex items-start gap-1.5">
        <CounterBox value={days} label="Days" />
        <span className="font-display font-bold self-center pb-2" style={{ color: 'var(--c-fg-mute)', fontSize: '1rem' }}>:</span>
        <CounterBox value={hours} label="Hrs" />
        <span className="font-display font-bold self-center pb-2" style={{ color: 'var(--c-fg-mute)', fontSize: '1rem' }}>:</span>
        <CounterBox value={minutes} label="Mins" />
        <span className="font-display font-bold self-center pb-2" style={{ color: 'var(--c-fg-mute)', fontSize: '1rem' }}>:</span>
        <CounterBox value={seconds} label="Secs" />
      </div>
    </div>
  );
}
