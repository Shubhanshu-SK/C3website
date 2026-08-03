import { useEffect, useRef } from 'react';

const BLOBS = [
  { color: [74, 240, 160, 0.13],   r: 520, speedX: 0.18, speedY: 0.11, ampX: 260, ampY: 180, phaseX: 0,    phaseY: 1.2  },
  { color: [56, 191, 255, 0.10],   r: 480, speedX: 0.13, speedY: 0.19, ampX: 300, ampY: 220, phaseX: 2.1,  phaseY: 0.7  },
  { color: [192, 132, 252, 0.08],  r: 440, speedX: 0.22, speedY: 0.14, ampX: 220, ampY: 260, phaseX: 4.2,  phaseY: 3.1  },
  { color: [74, 240, 160, 0.07],   r: 380, speedX: 0.09, speedY: 0.23, ampX: 340, ampY: 150, phaseX: 1.5,  phaseY: 5.0  },
  { color: [56, 191, 255, 0.06],   r: 560, speedX: 0.16, speedY: 0.08, ampX: 180, ampY: 300, phaseX: 3.7,  phaseY: 2.4  },
];

export default function AuroraBg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let raf;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width  = W;
      canvas.height = H;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    // Center positions for each blob (starts near center with phase offset)
    const centers = BLOBS.map((b, i) => ({
      x: W * (0.2 + (i % 3) * 0.3),
      y: H * (0.2 + Math.floor(i / 3) * 0.5),
    }));

    let t = 0;

    const draw = (ts) => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);

      if (!prefersReduced) t = ts * 0.001;

      BLOBS.forEach((b, i) => {
        const cx = centers[i].x + Math.sin(t * b.speedX + b.phaseX) * b.ampX;
        const cy = centers[i].y + Math.cos(t * b.speedY + b.phaseY) * b.ampY;

        const [r, g, bl, a] = b.color;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, b.r);
        grad.addColorStop(0, `rgba(${r},${g},${bl},${a})`);
        grad.addColorStop(1, `rgba(${r},${g},${bl},0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, b.r, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        width:         '100%',
        height:        '100%',
        zIndex:        -1,
        pointerEvents: 'none',
      }}
    />
  );
}
