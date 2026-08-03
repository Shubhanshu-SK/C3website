import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Grid, Users, Briefcase } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MobileBottomNav() {
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const NAV_ITEMS = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Events', path: '/events', icon: Calendar },
    { label: 'Domains', path: '/domains', icon: Grid },
    { label: 'Projects', path: '/projects', icon: Briefcase },
    { label: 'Team', path: '/team', icon: Users },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t flex flex-col transition-colors duration-300"
      style={{
        background: isDark ? 'rgba(8, 11, 16, 0.85)' : 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        borderColor: 'var(--c-border)',
        boxShadow: isDark ? '0 -2px 10px rgba(0,0,0,0.3)' : '0 -2px 10px rgba(0,0,0,0.05)',
        paddingBottom: 'calc(4px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="flex items-center justify-around h-14">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.path === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.label}
              to={item.path}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center select-none"
              style={{
                color: isActive ? 'var(--c-mint)' : 'var(--c-fg-soft)',
                transition: 'color 0.2s ease',
              }}
            >
              <Icon size={18} className="transition-transform duration-200" style={{ transform: isActive ? 'scale(1.1)' : 'scale(1)' }} />
              <span className="font-mono text-[9px] mt-1 tracking-wider font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
