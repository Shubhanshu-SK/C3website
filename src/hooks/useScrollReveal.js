import { useEffect, useRef, useState } from 'react';

/**
 * useScrollReveal — returns { ref, isVisible }
 * @param {object} opts - IntersectionObserver options
 * @param {string} opts.rootMargin  default '-80px'
 * @param {number} opts.threshold  default 0
 * @param {boolean} opts.once      default true
 */
export default function useScrollReveal({
  rootMargin = '-80px',
  threshold  = 0,
  once       = true,
} = {}) {
  const ref       = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, threshold, once]);

  return { ref, isVisible };
}
