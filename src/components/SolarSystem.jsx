import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '../context/ThemeContext';

const Icons = {
  react: (
    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-5 h-5" fill="none">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),
  javascript: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <rect width="24" height="24" rx="2" fill="#F7DF1E" />
      <path d="M6 17.5c.5.8 1.1 1.4 2.3 1.4 1 0 1.6-.5 1.6-1.2 0-.8-.6-1.1-1.7-1.6l-.6-.2c-1.7-.7-2.8-1.6-2.8-3.5 0-1.7 1.3-3 3.4-3 1.5 0 2.5.5 3.3 1.8l-1.8 1.1c-.4-.7-.8-1-1.5-1-.7 0-1.1.4-1.1 1 0 .7.4 1 1.5 1.4l.6.3c2 .9 3.1 1.7 3.1 3.6 0 2.1-1.6 3.2-3.8 3.2-2.1 0-3.5-1-4.2-2.4L6 17.5zm8.5.2c.4.7.8 1.3 1.7 1.3.9 0 1.4-.3 1.4-1.6V11h2.2v6.5c0 2.6-1.5 3.8-3.7 3.8-2 0-3.1-1-3.7-2.2l2.1-1.4z" fill="#000" />
    </svg>
  ),
  python: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M12.043 1.017c-2.157 0-2.078.918-2.078.918l.003 2.126h2.32v.639H7.768S5.449 4.487 5.449 6.72c0 2.233 0 2.767 0 2.767h1.568V8.282c0-.725.68-1.324 1.582-1.324h3.722c1.383 0 2.234-.84 2.234-2.234V3.11c0-1.156-.99-2.093-2.234-2.093h-2.32V1.017zm-1.09.934a.6.6 0 1 1 .002 1.2.6.6 0 0 1-.002-1.2z" fill="#387EB8" />
      <path d="M12.043 22.983c2.157 0 2.078-.918 2.078-.918l-.003-2.126h-2.32v-.639h4.518s2.32.217 2.32-2.017c0-2.233 0-2.767 0-2.767h-1.568v1.201c0 .725-.68 1.324-1.582 1.324h-3.722c-1.383 0-2.234.84-2.234 2.234v1.867c0 1.156.99 2.093 2.234 2.093h2.32v-.252h-.041z" fill="#FFD43B" />
    </svg>
  ),
  nodejs: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M12 1.5L2 7v10l10 5.5L22 17V7L12 1.5z" stroke="#68A063" strokeWidth="1.5" fill="none" />
      <path d="M12 1.5v21M2 7l10 5.5L22 7" stroke="#68A063" strokeWidth="1.5" />
    </svg>
  ),
  figma: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <rect x="8" y="2" width="8" height="6" rx="3" fill="#F24E1E" />
      <rect x="2" y="8" width="8" height="6" rx="3" fill="#FF7262" />
      <rect x="8" y="8" width="8" height="6" rx="3" fill="#A259FF" />
      <rect x="2" y="14" width="8" height="6" rx="3" fill="#0ACF83" />
      <circle cx="14" cy="17" r="3" fill="#1ABCFE" />
    </svg>
  ),
  git: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M22.165 10.998L13.002.835a1.164 1.164 0 0 0-1.645 0L9.17 3.022l2.082 2.083a1.383 1.383 0 0 1 1.75 1.76l2.006 2.006a1.383 1.383 0 1 1-.83.83l-1.872-1.872v4.926a1.383 1.383 0 1 1-1.138-.019V7.71a1.383 1.383 0 0 1-.75-1.814L8.34 3.81 1.836 10.31a1.164 1.164 0 0 0 0 1.645l9.163 9.163a1.164 1.164 0 0 0 1.645 0l9.521-9.475a1.164 1.164 0 0 0 0-1.645z" fill="#F05032" />
    </svg>
  ),
  dsa: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <circle cx="12" cy="4" r="2" fill="#fb923c" />
      <circle cx="6" cy="12" r="2" fill="#fb923c" />
      <circle cx="18" cy="12" r="2" fill="#fb923c" />
      <circle cx="3" cy="20" r="2" fill="#fb923c" />
      <circle cx="9" cy="20" r="2" fill="#fb923c" />
      <circle cx="15" cy="20" r="2" fill="#fb923c" />
      <circle cx="21" cy="20" r="2" fill="#fb923c" />
      <line x1="12" y1="6" x2="6" y2="10" stroke="#fb923c" strokeWidth="1.5" />
      <line x1="12" y1="6" x2="18" y2="10" stroke="#fb923c" strokeWidth="1.5" />
      <line x1="6" y1="14" x2="3" y2="18" stroke="#fb923c" strokeWidth="1.5" />
      <line x1="6" y1="14" x2="9" y2="18" stroke="#fb923c" strokeWidth="1.5" />
      <line x1="18" y1="14" x2="15" y2="18" stroke="#fb923c" strokeWidth="1.5" />
      <line x1="18" y1="14" x2="21" y2="18" stroke="#fb923c" strokeWidth="1.5" />
    </svg>
  ),
  mlai: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <circle cx="12" cy="12" r="2.5" fill="#22d3ee" />
      <circle cx="4" cy="6" r="1.5" fill="#22d3ee" />
      <circle cx="20" cy="6" r="1.5" fill="#22d3ee" />
      <circle cx="4" cy="18" r="1.5" fill="#22d3ee" />
      <circle cx="20" cy="18" r="1.5" fill="#22d3ee" />
      <circle cx="12" cy="2" r="1.5" fill="#22d3ee" />
      <circle cx="12" cy="22" r="1.5" fill="#22d3ee" />
      <line x1="12" y1="9.5" x2="4" y2="7.5" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="12" y1="9.5" x2="20" y2="7.5" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="12" y1="14.5" x2="4" y2="16.5" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="12" y1="14.5" x2="20" y2="16.5" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="12" y1="9.5" x2="12" y2="3.5" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.6" />
      <line x1="12" y1="14.5" x2="12" y2="20.5" stroke="#22d3ee" strokeWidth="1" strokeOpacity="0.6" />
    </svg>
  ),
  design: (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M12 2L8 8H4l3 5-1.5 7L12 17l6.5 3L17 13l3-5h-4L12 2z" stroke="rgb(236,51,56)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="2" fill="rgb(236,51,56)" />
    </svg>
  ),
};

const C3_ORBITS = [
  {
    id: 'inner',
    name: 'Core Technologies',
    radiusClass: 'var(--radius-inner)',
    radiusPx: 175,
    speed: 20,
    items: [
      { id: 'react', label: 'React', color: '#61DAFB', svg: Icons.react },
      { id: 'javascript', label: 'JavaScript', color: '#F7DF1E', svg: Icons.javascript },
      { id: 'python', label: 'Python', color: '#FFD43B', svg: Icons.python },
    ],
  },
  {
    id: 'mid',
    name: 'Tools & Frameworks',
    radiusClass: 'var(--radius-mid)',
    radiusPx: 285,
    speed: 32,
    items: [
      { id: 'nodejs', label: 'Node.js', color: '#68A063', svg: Icons.nodejs },
      { id: 'figma', label: 'Figma', color: '#F24E1E', svg: Icons.figma },
      { id: 'git', label: 'Git', color: '#F05032', svg: Icons.git },
    ],
  },
  {
    id: 'outer',
    name: 'Domains & Skills',
    radiusClass: 'var(--radius-outer)',
    radiusPx: 395,
    speed: 48,
    items: [
      { id: 'dsa', label: 'DSA', color: '#fb923c', svg: Icons.dsa },
      { id: 'ml-ai', label: 'ML / AI', color: '#22d3ee', svg: Icons.mlai },
      { id: 'design', label: 'Design', color: 'rgb(236,51,56)', svg: Icons.design },
    ],
  },
];

export const SolarSystem = React.forwardRef(
  ({ centerLogo, centerLogoAlt = 'Ccell Core', orbits = C3_ORBITS, isPaused = false, speedMultiplier = 1, className, ...props }, ref) => {
    const [hoveredId, setHoveredId] = useState(null);
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const logoSrc = isDark ?  '/logo.png' : '/togglelogo.png';

    const dustItems = [
      { delay: '-4s', radius: '165px', color: 'rgb(236,51,56)' },
      { delay: '-11s', radius: '260px', color: '#a78bfa' },
      { delay: '-19s', radius: '340px', color: 'rgb(0,140,169)' },
      { delay: '-28s', radius: '395px', color: 'rgb(236,51,56)' },
      { delay: '-7s', radius: '200px', color: 'rgb(0,140,169)' },
      { delay: '-15s', radius: '365px', color: '#a78bfa' },
      { delay: '-23s', radius: '430px', color: 'rgb(236,51,56)' },
    ];

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center justify-center w-full max-w-[940px] h-[320px] md:h-[450px] select-none overflow-visible',
          className
        )}
        style={{ perspective: '1200px' }}
        {...props}
      >
        <style dangerouslySetInnerHTML={{
          __html: `
          :root { --radius-inner:175px; --radius-mid:285px; --radius-outer:395px; }
          @media(max-width:768px){ :root{ --radius-inner:100px; --radius-mid:165px; --radius-outer:230px; } }
          @media(max-width:480px){ :root{ --radius-inner:70px;  --radius-mid:115px; --radius-outer:160px; } }
          @keyframes c3-orbitMove {
            0%   { transform: translate(-50%,-50%) rotateZ(0deg)    translateX(var(--orbit-radius)); }
            100% { transform: translate(-50%,-50%) rotateZ(-360deg) translateX(var(--orbit-radius)); }
          }
          @keyframes c3-billboard {
            0%   { transform: translate(-50%,-50%) rotateZ(0deg)    rotateY(10deg) rotateX(-65deg); }
            100% { transform: translate(-50%,-50%) rotateZ(360deg)  rotateY(10deg) rotateX(-65deg); }
          }
          @keyframes c3-sunPulse {
            0%   { transform: scale(0.9); opacity: 0.7; }
            100% { transform: scale(1.1); opacity: 1; }
          }
          @keyframes c3-spinCW {
            0%   { transform: rotateX(65deg) rotateY(-10deg) rotateZ(0deg); }
            100% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(360deg); }
          }
          @keyframes c3-spinCCW {
            0%   { transform: rotateX(65deg) rotateY(-10deg) rotateZ(0deg); }
            100% { transform: rotateX(65deg) rotateY(-10deg) rotateZ(-360deg); }
          }
          .c3-orbit     { animation: c3-orbitMove  var(--orbit-duration) linear infinite; animation-play-state: var(--orbit-play-state); }
          .c3-billboard { animation: c3-billboard  var(--orbit-duration) linear infinite; animation-play-state: var(--orbit-play-state); }
          .c3-sun-pulse { animation: c3-sunPulse   4s ease-in-out infinite alternate; }
          .c3-spin-cw   { animation: c3-spinCW     20s linear infinite; }
          .c3-spin-ccw  { animation: c3-spinCCW    30s linear infinite; }
          .c3-planet-card {
            position: absolute; left: 50%; top: 50%;
            display: flex; align-items: center; gap: 8px;
            padding: 0.45rem 0.95rem;
            background: var(--card-bg);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--card-border); border-radius: 100px;
            font-weight: 600; color: var(--c-fg); white-space: nowrap;
            cursor: pointer; pointer-events: auto;
            transition: border-color 0.3s, box-shadow 0.3s, scale 0.3s, background-color 0.3s, color 0.3s;
            box-shadow: var(--card-shadow);
          }
        `}} />

        {/* 3-D tilted stage */}
        <div
          className="absolute w-[360px] h-[360px] md:w-[940px] md:h-[940px] flex items-center justify-center"
          style={{ transform: 'rotateX(65deg) rotateY(-10deg)', transformStyle: 'preserve-3d' }}
        >
          {/* ── Center / Sun ───────────────────────────── */}
          <div
            className="absolute w-[100px] h-[100px] md:w-[130px] md:h-[130px] flex items-center justify-center z-20 pointer-events-none"
            style={{ transform: 'rotateY(10deg) rotateX(-65deg)', transformStyle: 'preserve-3d' }}
          >
            {/* Glow halo */}
            <div
              className="absolute w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-full filter blur-md c3-sun-pulse z-10"
              style={{ background: 'rgba(236,51,56,0.15)' }}
            />
            {/* Logo disc */}
            <div
              className="w-14 h-14 md:w-20 md:h-20 rounded-full border-2 border-[rgb(0,140,169)]/40 z-20 flex items-center justify-center p-2 relative"
              style={{ background: 'var(--card-bg)', boxShadow: '0 0 30px rgba(0,140,169,0.15)' }}
            >
              {centerLogo ?? (
                <img
                  src={logoSrc}
                  alt="C-Cell Logo"
                  draggable={false}
                  style={{ height: '100%', width: '100%', display: 'block', objectFit: 'contain' }}
                />
              )}
            </div>
            {/* Decorative rings */}
            <div className="absolute w-[110px] h-[110px] md:w-[140px] md:h-[140px] rounded-full border border-dashed border-[rgb(236,51,56)]/20 c3-spin-cw pointer-events-none" />
            <div className="absolute w-[150px] h-[150px] md:w-[185px] md:h-[185px] rounded-full border border-dashed border-[rgb(236,51,56)]/10 c3-spin-ccw pointer-events-none" />
          </div>

          {/* ── Cosmic dust particles ────────────────── */}
          {dustItems.map((dust, idx) => (
            <div
              key={idx}
              className="absolute left-1/2 top-1/2 w-1 h-1 rounded-full opacity-40 pointer-events-none c3-orbit"
              style={{
                background: dust.color,
                boxShadow: `0 0 6px ${dust.color}`,
                animationDelay: dust.delay,
                animationPlayState: isPaused ? 'paused' : 'running',
                animationDuration: `${24 / speedMultiplier}s`,
                '--orbit-radius': dust.radius,
                '--orbit-duration': `${24 / speedMultiplier}s`,
                '--orbit-play-state': isPaused ? 'paused' : 'running',
              }}
            />
          ))}

          {/* ── Orbits ──────────────────────────────── */}
          {orbits.map((orbit) => (
            <React.Fragment key={orbit.id}>
              {/* Orbit ring (dashed circle) */}
              <div
                className="absolute rounded-full border border-dashed border-[var(--c-border)] pointer-events-none"
                style={{
                  width: `calc(2 * ${orbit.radiusClass})`,
                  height: `calc(2 * ${orbit.radiusClass})`,
                }}
              />

              {/* Planets */}
              {orbit.items.map((item, idx, arr) => {
                const delayValue = -(orbit.speed / arr.length) * idx;
                const durationValue = orbit.speed / speedMultiplier;
                const isHovered = hoveredId === item.id;

                return (
                  <div
                    key={item.id}
                    className="absolute left-1/2 top-1/2 w-0 h-0 pointer-events-none c3-orbit"
                    style={{
                      animationDelay: `${delayValue}s`,
                      animationDuration: `${durationValue}s`,
                      animationPlayState: isPaused ? 'paused' : 'running',
                      '--orbit-radius': orbit.radiusClass,
                      '--orbit-duration': `${durationValue}s`,
                      '--orbit-play-state': isPaused ? 'paused' : 'running',
                      zIndex: isHovered ? 30 : 10,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Glow line toward center */}
                    <div
                      className="absolute right-0 top-1/2 h-[1.5px] origin-right -translate-y-1/2 pointer-events-none transition-opacity duration-300 z-0"
                      style={{
                        width: orbit.radiusClass,
                        opacity: isHovered ? 1 : 0,
                        background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.15) 20%, ${item.color} 80%, ${item.color} 100%)`,
                        boxShadow: `0 0 8px ${item.color}, 0 0 16px ${item.color}40`,
                      }}
                    />

                    {/* Planet card */}
                    <div
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="c3-planet-card c3-billboard"
                      style={{
                        animationDelay: `${delayValue}s`,
                        animationDuration: `${durationValue}s`,
                        animationPlayState: isPaused ? 'paused' : 'running',
                        '--orbit-duration': `${durationValue}s`,
                        '--orbit-play-state': isPaused ? 'paused' : 'running',
                        borderColor: isHovered ? item.color : undefined,
                        boxShadow: isHovered
                          ? `0 0 20px rgba(0,0,0,0.6), 0 0 15px ${item.color}35`
                          : undefined,
                        scale: isHovered ? 1.05 : 1,
                      }}
                    >
                      <div style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)', color: item.color, transition: 'transform 0.3s' }}>
                        {item.svg}
                      </div>
                      <span className="text-[11px] md:text-[13px] tracking-tight">{item.label}</span>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
);

SolarSystem.displayName = 'SolarSystem';
export default SolarSystem;
