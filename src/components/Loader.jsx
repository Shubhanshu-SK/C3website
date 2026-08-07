import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [visible, setVisible] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const logoSrc = isDark ?  '/logo.png' : '/togglelogo.png';

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    let raf;

    const step = (now) => {
      const elapsed = now - start;
      const p = Math.min(100, Math.round((elapsed / duration) * 100));
      setPct(p);
      if (p < 100) {
        raf = requestAnimationFrame(step);
      } else {
        setTimeout(() => {
          setVisible(false);
          setTimeout(onDone, 600);
        }, 250);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          data-testid="loader-screen"
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--c-bg)]"
          exit={{ y: '-100%', transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        >
          {/* C³ mark */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 select-none"
          >
            <img
              src={logoSrc}
              alt="C-Cell Logo"
              style={{ height: '72px', width: 'auto', display: 'inline-block' }}
            />
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 h-[2px] rounded-full overflow-hidden" style={{ background: 'var(--c-border)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--c-gradient)' }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>

          <p className="mt-4 font-mono text-[11px] tracking-[0.3em] uppercase" style={{ color: 'var(--c-fg-mute)' }}>
            {pct}%
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
