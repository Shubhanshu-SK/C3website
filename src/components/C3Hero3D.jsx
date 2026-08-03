import React, { useEffect, useRef } from 'react';

/* ─── floating code panel data ─── */
const PANELS = [
  {
    id: 'panel-tl',
    style: {
      top: '8%', left: '-18%',
      transform: 'rotateY(28deg) rotateX(-12deg) translateZ(40px)',
    },
    lines: ['import { useState }', "from 'react';", '', 'const Club = () => {', '  return <C3 />;', '};'],
    accent: '#ec3338',
  },
  {
    id: 'panel-tr',
    style: {
      top: '4%', right: '-16%',
      transform: 'rotateY(-24deg) rotateX(-8deg) translateZ(60px)',
    },
    lines: ['git push origin', '  main', '✓ Deployed', '● Build passing', '↑ 3 ahead'],
    accent: '#008ca9',
  },
  {
    id: 'panel-bl',
    style: {
      bottom: '10%', left: '-14%',
      transform: 'rotateY(22deg) rotateX(14deg) translateZ(30px)',
    },
    lines: ['</>', 'HTML · CSS', 'Tailwind', 'Framer'],
    accent: '#c084fc',
  },
  {
    id: 'panel-br',
    style: {
      bottom: '6%', right: '-12%',
      transform: 'rotateY(-20deg) rotateX(10deg) translateZ(50px)',
    },
    lines: ['npm run dev', '> vite', '', 'VITE ready', 'http://localhost'],
    accent: '#fbbf24',
  },
];

export default function C3Hero3D() {
  const sceneRef = useRef(null);

  /* ── gentle idle sway — no mouse tracking ── */
  useEffect(() => {
    let rafId;
    let t = 0;

    const tick = () => {
      t += 0.008;
      if (sceneRef.current) {
        const rx = Math.sin(t * 0.7) * 6;
        const ry = Math.cos(t * 0.9) * 8;
        const rz = Math.sin(t * 0.5) * 2;
        sceneRef.current.style.transform =
          `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <>
      <style>{`
        .c3-3d-wrap {
          perspective: 700px;
          perspective-origin: 50% 42%;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          min-height: 420px;
        }

        .c3-scene {
          position: relative;
          width: 260px;
          height: 260px;
          transform-style: preserve-3d;
          will-change: transform;
        }

        .c3-core {
          position: absolute;
          inset: 0;
          border-radius: 28px;
          background: linear-gradient(145deg, #0e1620 0%, #111b26 60%, #0a1018 100%);
          border: 1px solid rgba(236,51,56,0.25);
          box-shadow:
            0 0 0 1px rgba(236,51,56,0.10),
            0 0 60px rgba(236,51,56,0.18),
            0 0 120px rgba(0,140,169,0.10),
            inset 0 1px 0 rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          transform: translateZ(20px);
          animation: c3-float 4s ease-in-out infinite;
        }

        .c3-logo-img {
          width: 120px;
          height: 120px;
          object-fit: contain;
          transform: translateZ(40px);
          filter: drop-shadow(0 0 24px rgba(236,51,56,0.55))
                  drop-shadow(0 0 8px rgba(0,140,169,0.35));
          user-select: none;
          pointer-events: none;
        }

        .c3-triangle {
          position: absolute;
          bottom: -22%;
          left: 50%;
          transform: translateX(-50%) translateZ(-10px) rotateX(10deg);
          width: 0; height: 0;
          border-left:  100px solid transparent;
          border-right: 100px solid transparent;
          border-top:   70px solid rgba(236,51,56,0.18);
          filter: blur(2px);
        }
        .c3-triangle-glow {
          position: absolute;
          bottom: -28%; left: 50%;
          transform: translateX(-50%) translateZ(-30px);
          width: 260px; height: 80px;
          background: radial-gradient(ellipse at 50% 0%, rgba(236,51,56,0.30) 0%, transparent 70%);
          filter: blur(12px);
          pointer-events: none;
        }

        .c3-panel {
          position: absolute;
          width: 140px;
          background: rgba(14,22,32,0.92);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 10px 12px;
          transform-style: preserve-3d;
          box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04);
          animation: c3-float 4s ease-in-out infinite;
          pointer-events: none;
        }
        .c3-panel:nth-child(2) { animation-delay: -0.8s;  animation-duration: 4.4s; }
        .c3-panel:nth-child(3) { animation-delay: -1.6s;  animation-duration: 3.8s; }
        .c3-panel:nth-child(4) { animation-delay: -2.4s;  animation-duration: 4.6s; }
        .c3-panel:nth-child(5) { animation-delay: -3.2s;  animation-duration: 4.2s; }

        .c3-panel-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          display: inline-block;
          margin-bottom: 8px;
        }
        .c3-panel-line {
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          line-height: 1.7;
          color: rgba(255,255,255,0.45);
          white-space: nowrap;
          overflow: hidden;
        }
        .c3-panel-line.accent { font-weight: 500; }

        .c3-ring {
          position: absolute;
          inset: -40px;
          border-radius: 50%;
          border: 1px solid rgba(236,51,56,0.12);
          transform: rotateX(75deg) translateZ(-20px);
          animation: c3-spin 18s linear infinite;
          pointer-events: none;
        }
        .c3-ring::after {
          content: '';
          position: absolute;
          top: -3px; left: 50%;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #ec3338;
          box-shadow: 0 0 10px #ec3338;
          transform: translateX(-50%);
        }
        .c3-ring-2 {
          position: absolute;
          inset: -70px;
          border-radius: 50%;
          border: 1px solid rgba(0,140,169,0.09);
          transform: rotateX(75deg) rotateZ(60deg) translateZ(-20px);
          animation: c3-spin 28s linear infinite reverse;
          pointer-events: none;
        }
        .c3-ring-2::after {
          content: '';
          position: absolute;
          top: -3px; left: 50%;
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #008ca9;
          box-shadow: 0 0 8px #008ca9;
          transform: translateX(-50%);
        }

        .c3-corner-tag {
          position: absolute;
          bottom: -52px; left: 50%;
          transform: translateX(-50%) translateZ(10px);
          background: rgba(14,22,32,0.9);
          border: 1px solid rgba(236,51,56,0.22);
          border-radius: 8px;
          padding: 5px 12px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #ec3338;
          white-space: nowrap;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          pointer-events: none;
        }

        @keyframes c3-float {
          0%, 100% { margin-top: 0px; }
          50%       { margin-top: -14px; }
        }
        @keyframes c3-spin {
          from { transform: rotateX(75deg) translateZ(-20px) rotateZ(0deg); }
          to   { transform: rotateX(75deg) translateZ(-20px) rotateZ(360deg); }
        }

        @media (max-width: 640px) {
          .c3-scene { width: 180px; height: 180px; }
          .c3-logo-img { width: 80px; height: 80px; }
          .c3-panel, .c3-ring, .c3-ring-2, .c3-triangle { display: none; }
        }
      `}</style>

      <div className="c3-3d-wrap">
        <div className="c3-scene" ref={sceneRef}>

          <div className="c3-ring" />
          <div className="c3-ring-2" />

          {PANELS.map((p) => (
            <div key={p.id} className="c3-panel" style={p.style}>
              <div>
                <span
                  className="c3-panel-dot"
                  style={{ background: p.accent, boxShadow: `0 0 6px ${p.accent}` }}
                />
              </div>
              {p.lines.map((line, i) => (
                <div
                  key={i}
                  className={`c3-panel-line${i === 0 ? ' accent' : ''}`}
                  style={i === 0 ? { color: p.accent } : {}}
                >
                  {line || '\u00A0'}
                </div>
              ))}
            </div>
          ))}

          <div className="c3-triangle" />
          <div className="c3-triangle-glow" />

          <div className="c3-core">
            <img
              src="/logo.png"
              alt="C-Cell"
              className="c3-logo-img"
              draggable={false}
            />
          </div>

          <div className="c3-corner-tag">Coding Centralized</div>

        </div>
      </div>
    </>
  );
}