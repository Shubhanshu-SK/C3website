import { useEffect, useRef } from 'react';

const isTouch = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: coarse)').matches;

export default function MouseTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isTouch()) return; // disable on mobile entirely

    const canvas = document.createElement('canvas');
    canvas.style.cssText = [
      'position:fixed',
      'inset:0',
      'width:100%',
      'height:100%',
      'z-index:1',
      'pointer-events:none',
    ].join(';');
    document.body.appendChild(canvas);
    canvasRef.current = canvas;

    const ctx = canvas.getContext('2d');
    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    // Current rendered position (lerps toward real mouse)
    const curr = { x: W / 2, y: H / 2 };
    // Real mouse position
    const mouse = { x: W / 2, y: H / 2 };
    const EASE = 0.08;
    const RADIUS = 300;

    let raf;

    const draw = () => {
      raf = requestAnimationFrame(draw);

      // Lerp toward mouse
      curr.x += (mouse.x - curr.x) * EASE;
      curr.y += (mouse.y - curr.y) * EASE;

      ctx.clearRect(0, 0, W, H);

      const grad = ctx.createRadialGradient(curr.x, curr.y, 0, curr.x, curr.y, RADIUS);
      grad.addColorStop(0,   'rgba(74,240,160,0.045)');
      grad.addColorStop(0.4, 'rgba(74,240,160,0.018)');
      grad.addColorStop(1,   'rgba(74,240,160,0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    };

    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      ro.disconnect();
      canvas.remove();
    };
  }, []);

  return null; // canvas is appended imperatively to keep export name unchanged
}
