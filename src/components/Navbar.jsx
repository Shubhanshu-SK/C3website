import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Events', href: '/events' },
  { label: 'Domains', href: '/domains' },
  { label: 'Projects', href: '/projects' },
  { label: 'Team', href: '/team' },
  { label: 'Contact', href: '#contact' },
  { label: 'Admin', href: '/admin' },
];

/* ── Animated 3-line hamburger / X ── */
function HamburgerIcon({ open }) {
  return (
    <span
      className={`flex flex-col items-center justify-center gap-[5px] ${open ? 'ham-open' : ''}`}
      style={{ width: 20, height: 20 }}
      aria-hidden="true"
    >
      <span className="ham-line ham-line-1" />
      <span className="ham-line ham-line-2" />
      <span className="ham-line ham-line-3" />
    </span>
  );
}

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (e, href) => {
    const wasOpen = mobileOpen;
    setMobileOpen(false);

    if (href.startsWith('#')) {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        setTimeout(() => {
          const el = document.querySelector(href);
          if (!el) return;
          const navOffset = 88;
          const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
          window.scrollTo({ top, behavior: 'smooth' });
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(el, { offset: -80 });
          }
        }, wasOpen ? 320 : 0);
      }
    }
  };

  // Text colour tokens that correctly update per theme
  const logoTextColor = isDark ? '#f0f4f8' : '#0d1117';
  const navBg = isDark ? 'rgba(8,11,16,0.85)' : 'rgba(255,255,255,0.92)';
  const navBorder = isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.08)';

  return (
    <>
      <style>{`
        .c3-nav-link {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--c-fg);
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: color 0.2s;
          position: relative;
          padding: 4px 0;
        }
        .c3-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0;
          width: 0; height: 1.5px;
          background: var(--c-mint);
          transition: width 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .c3-nav-link:hover { color: var(--c-mint); }
        .c3-nav-link:hover::after { width: 100%; }

        .c3-desktop-nav { display: none; }
        @media (min-width: 768px) { .c3-desktop-nav { display: flex; } }

        .c3-hamburger {
          display: flex;
          width: 38px; height: 38px;
          border-radius: 10px;
          border: 1px solid var(--c-border);
          background: var(--c-surface-2);
          align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        @media (min-width: 768px) { .c3-hamburger { display: none; } }
        .c3-hamburger:hover { background: var(--c-surface-3, var(--c-border)); }

        .c3-theme-btn {
          width: 36px; height: 36px; border-radius: 10px;
          border: 1px solid var(--c-border);
          background: var(--c-surface-2);
          display: flex; align-items: center; justify-content: center;
          color: var(--c-fg-soft); cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .c3-theme-btn:hover { color: var(--c-mint); background: var(--c-surface); }

        .c3-join-btn {
          display: none;
          padding: 8px 18px; border-radius: 9999px;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: 0.82rem; font-weight: 700;
          background: var(--c-gradient); color: #ffffff;
          text-decoration: none;
          box-shadow: 0 0 14px rgba(236,51,56,0.35);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        @media (min-width: 768px) { .c3-join-btn { display: inline-flex; align-items: center; } }
        .c3-join-btn:hover { transform: scale(1.04); box-shadow: 0 0 20px rgba(236,51,56,0.5); }

        .ham-line {
          display: block; width: 18px; height: 1.8px;
          background: var(--c-fg);
          border-radius: 2px;
          transform-origin: center;
          transition: transform 0.28s cubic-bezier(0.22,1,0.36,1), opacity 0.2s;
        }
        .ham-open .ham-line-1 { transform: translateY(6.8px) rotate(45deg); }
        .ham-open .ham-line-2 { opacity: 0; transform: scaleX(0); }
        .ham-open .ham-line-3 { transform: translateY(-6.8px) rotate(-45deg); }
      `}</style>

      {/* ─── STATIC NAVBAR SHELL ─── */}
      <header
        data-testid="main-navbar"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: navBg,
          backdropFilter: 'blur(20px) saturate(160%)',
          WebkitBackdropFilter: 'blur(20px) saturate(160%)',
          borderBottom: navBorder,
          boxShadow: isDark
            ? '0 2px 20px rgba(0,0,0,0.25)'
            : '0 2px 12px rgba(0,0,0,0.06)',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '14px 20px' : '14px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>

          {/* ── LOGO ── */}
          <Link
            data-testid="nav-logo"
            to="/"
            onClick={(e) => {
              setMobileOpen(false);
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                if (window.lenisInstance) window.lenisInstance.scrollTo(0);
              }
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 0,
              textDecoration: 'none', flexShrink: 0, userSelect: 'none', lineHeight: 1,
            }}
          >
            <img
              src="/logo.png"
              alt="C-Cell Logo"
              style={{ height: '36px', width: 'auto', display: 'inline-block' }}
            />
            {/* "Club" text uses CSS variable so it updates with theme automatically */}

          </Link>

          {/* ── DESKTOP LINKS ── */}
          <nav className="c3-desktop-nav" style={{ alignItems: 'center', gap: '26px', flex: 1, justifyContent: 'center' }}>
            {NAV_LINKS.map((l) => {
              const isAnchor = l.href.startsWith('#');
              if (isAnchor) {
                return (
                  <a
                    key={l.label}
                    data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, '-')}`}
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    className="c3-nav-link"
                  >
                    {l.label}
                  </a>
                );
              }
              return (
                <Link
                  key={l.label}
                  data-testid={`nav-link-${l.label.toLowerCase().replace(/\s+/g, '-')}`}
                  to={l.href}
                  className="c3-nav-link"
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          {/* ── RIGHT CONTROLS ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button
              data-testid="theme-toggle"
              onClick={toggle}
              aria-label="Toggle theme"
              className="c3-theme-btn"
            >
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="c3-join-btn"
            >
              Join Now
            </a>

            <button
              data-testid="mobile-menu-button"
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="c3-hamburger"
            >
              <HamburgerIcon open={mobileOpen} />
            </button>
          </div>
        </div>
      </header>

      {/* ─── MOBILE RIGHT-SIDE PANEL ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              data-testid="mobile-menu-backdrop"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 60,
                background: 'rgba(0,0,0,0.45)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
            />

            <motion.div
              data-testid="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                width: 'min(78vw, 300px)',
                zIndex: 70,
                background: isDark ? '#0c1018' : '#ffffff',
                borderLeft: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                display: 'flex', flexDirection: 'column',
                boxShadow: '-12px 0 48px rgba(0,0,0,0.25)',
                overflowY: 'auto',
              }}
            >
              {/* Panel header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 20px',
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
              }}>
                <Link
                  to="/"
                  onClick={() => {
                    setMobileOpen(false);
                    if (location.pathname === '/') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      if (window.lenisInstance) window.lenisInstance.scrollTo(0);
                    }
                  }}
                  style={{ display: 'flex', alignItems: 'baseline', gap: '1px', textDecoration: 'none', userSelect: 'none' }}
                >
                  <img
                    src="/logo.png"
                    alt="C-Cell Logo"
                    style={{ height: '32px', width: 'auto', display: 'inline-block' }}
                  />
                  <span style={{
                    fontFamily: "'Clash Display',sans-serif", fontSize: '1rem', fontWeight: 700,
                    color: isDark ? '#f0f4f8' : '#0d1117',
                    marginLeft: '4px',
                    transition: 'color 0.3s ease',
                  }}>Club</span>
                </Link>

                <button
                  data-testid="mobile-menu-close"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)'}`,
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--c-fg-mute)', cursor: 'pointer', flexShrink: 0,
                  }}
                >
                  <HamburgerIcon open={true} />
                </button>
              </div>

              {/* Nav links */}
              <nav style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '8px 0' }}>
                {NAV_LINKS.map((l) => {
                  const isAnchor = l.href.startsWith('#');
                  const linkStyle = {
                    fontFamily: "'Cabinet Grotesk', sans-serif",
                    fontSize: '1.05rem', fontWeight: 600,
                    color: 'var(--c-fg)', textDecoration: 'none',
                    padding: '13px 20px',
                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    transition: 'background 0.18s, color 0.18s',
                  };
                  const hoverOn = (e) => {
                    e.currentTarget.style.background = isDark ? 'rgba(236,51,56,0.08)' : 'rgba(236,51,56,0.06)';
                    e.currentTarget.style.color = 'var(--c-crimson)';
                  };
                  const hoverOff = (e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--c-fg)';
                  };

                  if (isAnchor) {
                    return (
                      <a key={l.label} href={l.href} onClick={(e) => handleNavClick(e, l.href)}
                        style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                      >
                        <span>{l.label}</span>
                        <span style={{ color: 'var(--c-fg-mute)', fontSize: '0.7rem', opacity: 0.6 }}>→</span>
                      </a>
                    );
                  }
                  return (
                    <Link key={l.label} to={l.href} onClick={() => setMobileOpen(false)}
                      style={linkStyle} onMouseEnter={hoverOn} onMouseLeave={hoverOff}
                    >
                      <span>{l.label}</span>
                      <span style={{ color: 'var(--c-fg-mute)', fontSize: '0.7rem', opacity: 0.6 }}>→</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Footer tag */}
              <div style={{
                padding: '14px 20px',
                borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)'}`,
              }}>
                <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: '10px', color: 'var(--c-fg-mute)', letterSpacing: '0.1em' }}>
                  C-Cell CLUB · COMMUNITY 2026
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}