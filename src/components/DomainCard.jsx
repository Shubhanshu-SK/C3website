import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight } from 'lucide-react';

// ── Unified accent — all domain cards share the same brand blue color ──
const DARK_ACCENT = 'rgb(0,140,169)';
const LIGHT_ACCENT = 'rgb(0,140,169)';
const ACCENT_RAW = '0,140,169';


export default function DomainCard({ domain, index }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const slug = domain.slug || domain.id || domain.name;
  const descText = domain.desc || domain.introduction || domain.description || '';
  const accent = isDark ? DARK_ACCENT : LIGHT_ACCENT;

  // Badge label based on domain type
  const badge = domain.type === 'sub' ? 'Sub-domain' : 'C-Cell Domain';

  const handleCardClick = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    navigate(`/domains/${slug}`);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      data-testid={`domain-card-${slug}`}
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="lift-card relative rounded-2xl border border-[var(--c-border)] overflow-hidden p-6 flex flex-col justify-between cursor-pointer"
      style={{ background: 'var(--c-surface)' }}
    >
      <div>
        {/* Accent top bar */}
        <div className="top-bar absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />

        {/* Badge */}
        <div className="mb-4">
          <span
            className="font-mono text-[10px] tracking-[0.25em] uppercase px-2 py-1 rounded"
            style={{ color: accent, background: `rgba(${ACCENT_RAW},${isDark ? '0.12' : '0.10'})` }}
          >
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-xl mb-2 font-mono" style={{ color: 'rgb(0,140,169)' }}>
          &lt;{domain.name ? domain.name.replace(/_/g, ' ') : ''}/&gt;
        </h3>

        {/* Description */}
        <p className="font-grotesk text-sm leading-relaxed mb-4" style={{ color: 'var(--c-fg-soft)' }}>
          {descText ? descText.replace(/_/g, ' ') : ''}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {domain.skills?.map((s) => (
            <span
              key={s}
              className="font-mono text-[9px] px-2 py-0.5 rounded border border-[var(--c-border)]"
              style={{ color: 'var(--c-fg-mute)' }}
            >
              [{s ? s.replace(/_/g, ' ') : ''}]
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Link */}
      <div>
        <div className="mt-5 pt-3 border-t border-[var(--c-border)] flex justify-end">
          <Link
            to={`/domains/${slug}`}
            className="font-grotesk text-xs font-semibold flex items-center gap-1 hover:text-[var(--c-mint)]"
            style={{ color: 'var(--c-fg-soft)' }}
          >
            View Domain Page
            <ArrowRight size={12} style={{ color: accent }} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
