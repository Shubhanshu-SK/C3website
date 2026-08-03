import React from 'react';

const style = `
@keyframes glowPulse {
  0%   { box-shadow: 0 0 0px 0px rgba(74,240,160,0.0);  filter: drop-shadow(0 0 0px rgba(74,240,160,0.0));  transform: scale(1);   opacity: 1;   }
  50%  { box-shadow: 0 0 9px 4px rgba(236, 51, 56,0.9); filter: drop-shadow(0 0 2px rgba(236, 51, 56, 0)); transform: scale(1.1); opacity: 0.5;   }
  100% { box-shadow: 0 0 0px 0px rgba(74,240,160,0.0);  filter: drop-shadow(0 0 0px rgba(74,240,160,0.0));  transform: scale(1);   opacity: 0.15;}
}

.glow-caret {
  display: inline-block;
  color: var(--c-mint);
  border-radius: 2px;
  animation: glowPulse 0.9s ease-in-out infinite;
  will-change: transform, box-shadow, filter;
  line-height: 1;
}
`;

export default function GlowCaret() {
  return (
    <>
      <style>{style}</style>
      <span className="glow-caret font-mono text-sm" aria-hidden="true">|</span>
    </>
  );
}
