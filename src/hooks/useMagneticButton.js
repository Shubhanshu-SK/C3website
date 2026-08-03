import { useRef, useEffect, useState } from 'react';

const isTouch = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none)').matches;

/**
 * useMagneticButton — attaches a smooth magnetic pull effect to a button.
 * @param {number} strength  0–1, how much the button moves. Default 0.35
 * @param {number} radius    px distance from button centre that activates the effect. Default 80
 * @returns {{ ref, style }}
 */
export default function useMagneticButton(strength = 0.35, radius = 80) {
  const ref       = useRef(null);
  const pos       = useRef({ x: 0, y: 0 });
  const target    = useRef({ x: 0, y: 0 });
  const raf       = useRef(null);
  const active    = useRef(false);
  const [style, setStyle] = useState({ transform: 'translate(0px, 0px)' });

  useEffect(() => {
    if (isTouch()) return; // disable on touch devices
    const el = ref.current;
    if (!el) return;

    const ease = 0.12;

    const loop = () => {
      const dx = target.current.x - pos.current.x;
      const dy = target.current.y - pos.current.y;
      pos.current.x += dx * ease;
      pos.current.y += dy * ease;

      const px = Math.round(pos.current.x * 100) / 100;
      const py = Math.round(pos.current.y * 100) / 100;
      setStyle({ transform: `translate(${px}px, ${py}px)` });

      // Keep looping while active or spring not settled
      if (active.current || Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
        raf.current = requestAnimationFrame(loop);
      } else {
        raf.current = null;
      }
    };

    const startLoop = () => {
      if (!raf.current) raf.current = requestAnimationFrame(loop);
    };

    const onMouseMove = (e) => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dist   = Math.hypot(e.clientX - cx, e.clientY - cy);

      if (dist < radius + rect.width / 2) {
        active.current   = true;
        target.current.x = (e.clientX - cx) * strength;
        target.current.y = (e.clientY - cy) * strength;
        startLoop();
      } else {
        active.current   = false;
        target.current.x = 0;
        target.current.y = 0;
        startLoop();
      }
    };

    const onMouseLeave = () => {
      active.current   = false;
      target.current.x = 0;
      target.current.y = 0;
      startLoop();
    };

    window.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [strength, radius]);

  return { ref, style };
}
