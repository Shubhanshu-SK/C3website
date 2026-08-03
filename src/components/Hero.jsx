import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import C3Hero3D from './C3Hero3D';
import GlowCaret from './GlowCaret';
import { Link } from "react-router-dom";

const PHRASES = [
  'initializing community...',
  'loading domains...',
  'projects ready...',
  'events available...',
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

const headline1 = 'C-Cell'.split('');
const headline2Part1 = 'Coding '.split('');
const headline2Part2 = 'Club'.split('');

export default function Hero() {
  const [phrase, setPhrase] = useState('');
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [mode, setMode] = useState('typing');
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    let timeout;
    const target = PHRASES[phraseIdx];
    if (mode === 'typing') {
      if (charIdx < target.length) {
        timeout = setTimeout(() => { setPhrase(target.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, 70);
      } else {
        timeout = setTimeout(() => setMode('pausing'), 1400);
      }
    } else if (mode === 'pausing') {
      timeout = setTimeout(() => setMode('erasing'), 500);
    } else if (mode === 'erasing') {
      if (charIdx > 0) {
        timeout = setTimeout(() => { setPhrase(target.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, 35);
      } else {
        setPhraseIdx(i => (i + 1) % PHRASES.length);
        setMode('typing');
      }
    }
    return () => clearTimeout(timeout);
  }, [mode, charIdx, phraseIdx]);

  return (
    <section
      id="hero"
      data-testid="hero-section"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden noise"
      style={{ background: '#080b10', color: '#f0f4f8' }}
    >
      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid radial-mask" />

      {/* Ambient blobs */}
      <div
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(236,51,56,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,140,169,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 pt-20 sm:pt-24 lg:pt-28 pb-16 sm:pb-18 lg:pb-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">

          {/* ── LEFT: text — full width + centered on mobile, left-aligned on desktop ── */}
          <div className="flex-1 min-w-0 w-full max-w-2xl lg:max-w-none text-center lg:text-left mx-auto lg:mx-0">
            {/* Headline — always white because hero is always dark */}
            <div className="overflow-hidden mb-0.5">
              <h1
                data-testid="hero-headline-top"
                className="font-display font-semibold whitespace-nowrap"
                style={{
                  color: '#f0f4f8',
                  fontSize: 'clamp(2.2rem, 6vw, 6.5rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.02em',
                }}
                aria-label="Club"
              >
                {headline1.map((char, i) => (
                  <motion.span
                    key={i}
                    style={{ display: 'inline-block' }}
                    initial={{ x: randomBetween(-500, 500), y: randomBetween(-300, 300), rotate: randomBetween(-70, 70), opacity: 0 }}
                    animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                    transition={{ duration: 1.0, delay: 0.3 + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {char}
                  </motion.span>
                ))}
              </h1>
            </div>
            {/* Headline line 2 */}
            <div className="overflow-hidden mb-5 sm:mb-7">
              <h1
                data-testid="hero-headline-bottom"
                className="font-display font-semibold whitespace-nowrap"
                style={{
                  fontSize: 'clamp(2.2rem, 6vw, 6.5rem)',
                  lineHeight: 0.92,
                  letterSpacing: '-0.02em',
                }}
              >
                <span style={{ color: '#f0f4f8' }}>
                  {headline2Part1.map((char, i) => (
                    <motion.span
                      key={i}
                      style={{ display: 'inline-block' }}
                      initial={{ x: randomBetween(-500, 500), y: randomBetween(-300, 300), rotate: randomBetween(-70, 70), opacity: 0 }}
                      animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 1.0, delay: 0.3 + (headline1.length + i) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
                <span style={{ color: 'rgb(236,51,56)' }}>
                  {headline2Part2.map((char, i) => (
                    <motion.span
                      key={i}
                      style={{ display: 'inline-block' }}
                      initial={{ x: randomBetween(-500, 500), y: randomBetween(-300, 300), rotate: randomBetween(-70, 70), opacity: 0 }}
                      animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                      transition={{ duration: 1.0, delay: 0.3 + (headline1.length + headline2Part1.length + i) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </span>
              </h1>
            </div>

            {/* Terminal */}
            <motion.div
              data-testid="hero-terminal"
              className="mb-5 sm:mb-7 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.10)' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <span className="font-mono text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>→</span>
              <span className="font-mono text-sm" style={{ color: 'rgb(0,140,169)' }}>ccell.club</span>
              <span className="font-mono text-sm mx-1" style={{ color: 'rgba(255,255,255,0.35)' }}>/</span>
              <span className="font-mono text-sm" style={{ color: 'rgb(236,51,56)' }}>{phrase}</span>
              <GlowCaret />
            </motion.div>

            {/* Subline */}
            <motion.p
              className="font-grotesk text-base md:text-lg mb-6 sm:mb-8 body-text-width"
              style={{ color: 'rgba(255,255,255,0.62)', lineHeight: 1.6 }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.5 }}
            >
              A student technology community where developers, designers, and creators collaborate, learn, and build real projects.
            </motion.p>

            {/* CTA */}
            <motion.div
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <Link
                to="/domains"
                data-testid="hero-cta-explore"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-grotesk font-semibold text-base transition-all hover:scale-105 hover:shadow-xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(24,72,82) 0%, rgb(0,140,169) 40%, rgb(24,72,82) 65%, rgb(236,51,56) 100%)",
                  color: "#ffffff",
                  boxShadow: "0 4px 20px rgba(236, 51, 56, 0.35)",
                  textDecoration: "none",
                }}
              >
                Explore Domains
                <ArrowUpRight size={18} />
              </Link>
                <Link
                  to="/events"
                  data-testid="hero-cta-events"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-grotesk font-semibold text-base transition-all hover:scale-105 hover:shadow-lg border border-[var(--c-border)]"
                  style={{
                    color: "#f0f4f8",
                    background: "rgba(255,255,255,0.05)",
                    textDecoration: "none",
                  }}
                >
                  View Events
                  <ArrowUpRight size={18} />
                </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: 3D widget — hidden on mobile, shown on desktop only ── */}
          <motion.div
            className="hidden lg:block flex-shrink-0 rounded-2xl overflow-hidden"
            style={{
              width: 'clamp(320px, 38vw, 480px)',
              height: 'clamp(280px, 34vw, 440px)',
              background: '#0e1620',
              border: '1px solid rgba(236,51,56,0.25)',
              boxShadow: '0 0 60px rgba(236,51,56,0.12), 0 24px 80px rgba(0,0,0,0.5)',
            }}
            initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <C3Hero3D />
          </motion.div>

        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
      >
        <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ color: 'rgba(255,255,255,0.3)' }}
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}