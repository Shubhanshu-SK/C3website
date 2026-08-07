import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const NAV_LINKS = [
  { label: 'Home',     href: '/'         },
  { label: 'Events',   href: '/events'   },
  { label: 'Domains',  href: '/domains'  },
  { label: 'Projects', href: '/projects' },
  { label: 'Team',     href: '/team'     },
  { label: 'Contact',  href: '#contact'  },
  { label: 'Admin',    href: '/admin'    },
];

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const logoSrc = isDark ? '/logo.png' : '/togglelogo.png';

  const handleFooterClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (location.pathname !== '/') {
        navigate('/' + href);
      } else {
        const el = document.querySelector(href);
        if (el) {
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(el, { offset: -80 });
          } else {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    }
  };

  return (
    <footer
      data-testid="main-footer"
      className="transition-colors duration-300"
      style={{
        background: isDark ? '#0a0f18' : '#F1F5F9',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #E2E8F0',
      }}
    >
      {/* Top row */}
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Wordmark */}
        <Link
          to="/"
          onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              if (window.lenisInstance) window.lenisInstance.scrollTo(0);
            }
          }}
          className="flex items-center gap-1 select-none shrink-0"
        >
          <img
            src={logoSrc}
            alt="C-Cell Logo"
            draggable={false}
            style={{ height: '36px', width: 'auto', display: 'inline-block', objectFit: 'contain' }}
          />
        </Link>

        {/* Nav links */}
        <nav className="flex flex-wrap items-center justify-center gap-5">
          {NAV_LINKS.map((l) => {
            const isAnchor = l.href.startsWith('#');
            if (isAnchor) {
              return (
                <a
                  key={l.label}
                  data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g,'-')}`}
                  href={l.href}
                  onClick={(e) => handleFooterClick(e, l.href)}
                  className="font-grotesk text-sm transition-colors hover:text-[var(--c-mint)]"
                  style={{ color: isDark ? 'rgba(255,255,255,0.60)' : 'var(--c-fg-soft)' }}
                >
                  {l.label}
                </a>
              );
            }
            return (
              <Link
                key={l.label}
                data-testid={`footer-link-${l.label.toLowerCase().replace(/\s+/g,'-')}`}
                to={l.href}
                className="font-grotesk text-sm transition-colors hover:text-[var(--c-mint)]"
                style={{ color: isDark ? 'rgba(255,255,255,0.60)' : 'var(--c-fg-soft)' }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Copyright */}
        <p className="font-mono text-[11px]" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'var(--c-fg-mute)' }}>
          © 2025–26 C-Cell Club
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgb(0,140,169) 30%, rgb(236,51,56) 70%, transparent)',
          opacity: 0.5,
        }}
      />
    </footer>
  );
}
