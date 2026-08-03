import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { ArrowRight } from 'lucide-react';

import { C3_DOMAINS } from '../data/domains';
import DomainCard from './DomainCard';
import { TEAM_MEMBERS } from '../data/team';

// ── Unified accent ───────────────────────────────────────────────
const DARK_ACCENT = 'rgb(236, 51, 56)';
const LIGHT_ACCENT = 'rgb(236, 51, 56)';
const ACCENT_RAW = '236, 51, 56';

// ── Derived lists ────────────────────────────────────────────────
const techTeam = C3_DOMAINS.find((d) => d.id === 'tech-team');
const techSubDomains = C3_DOMAINS.filter((d) => d.parent === 'tech-team');
const standaloneDomains = C3_DOMAINS.filter((d) => d.type === 'main' && d.id !== 'tech-team');

// ── Avatar initials chip ─────────────────────────────────────────
function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

const AVATAR_COLORS = [
  { bg: 'rgba(236,51,56,0.18)', border: 'rgba(236,51,56,0.45)', text: '#ec3338' },
  { bg: 'rgba(0,140,169,0.18)', border: 'rgba(0,140,169,0.45)', text: '#008ca9' },
  { bg: 'rgba(24,72,82,0.35)', border: 'rgba(0,140,169,0.30)', text: '#5cc8de' },
  { bg: 'rgba(236,51,56,0.12)', border: 'rgba(236,51,56,0.30)', text: '#f07478' },
];

const TECH_MEMBERS = TEAM_MEMBERS.filter((m) => m.domain.trim() === 'Tech Team');

// ── Sub-domain mini-card (inside TechTeamCard) ───────────────────
function SubDomainMini({ sub, accent, accentRaw, isDark }) {
  const navigate = useNavigate();
  // Pick 4 deterministic members based on subdomain slug
  const offset = sub.slug === 'web-development' ? 0 : sub.slug === 'dsa' ? 2 : 4;
  const avatarMembers = TECH_MEMBERS.slice(offset % TECH_MEMBERS.length, (offset % TECH_MEMBERS.length) + 4);
  const extraCount = Math.max(0, TECH_MEMBERS.length - 4);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03, y: -4 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => navigate(`/domains/${sub.slug}`)}
      className="lift-card rounded-2xl border border-[var(--c-border)] p-5 sm:p-6 cursor-pointer flex flex-col justify-between"
      style={{
        background: 'var(--c-surface)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div>
        {/* Badge */}
        <span
          className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 rounded-full mb-3 inline-block"
          style={{ color: '#008ca9', background: 'rgba(0,140,169,0.12)', border: '1px solid rgba(0,140,169,0.25)' }}
        >
          Sub-domain
        </span>

        {/* Title */}
        <h4
          className="font-display font-bold text-lg sm:text-xl tracking-tight mb-2 font-mono"
          style={{
            color: '#008ca9',
            textShadow: '0 0 16px rgba(0, 140, 169, 0.45)',
          }}
        >
          &lt;{sub.name}/&gt;
        </h4>

        {/* Desc */}
        <p className="font-grotesk text-xs leading-relaxed mb-4" style={{ color: 'var(--c-fg-soft)' }}>
          {sub.desc}
        </p>
      </div>

      {/* Member avatar stack */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
        <div style={{ display: 'flex' }}>
          {avatarMembers.map((m, i) => {
            const col = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div
                key={m.id}
                title={m.name}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: col.bg,
                  border: `1.5px solid ${col.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '8px',
                  fontWeight: 700,
                  color: col.text,
                  marginLeft: i === 0 ? 0 : '-7px',
                  zIndex: avatarMembers.length - i,
                  position: 'relative',
                  boxShadow: '0 0 0 1.5px rgba(8,11,16,0.85)',
                  letterSpacing: '0.03em',
                }}
              >
                {m.photo ? (
                  <img src={m.photo} alt={m.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  getInitials(m.name)
                )}
              </div>
            );
          })}
          {extraCount > 0 && (
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '7px',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.5)',
                marginLeft: '-7px',
                zIndex: 0,
                position: 'relative',
                boxShadow: '0 0 0 1.5px rgba(8,11,16,0.85)',
              }}
            >
              +{extraCount}
            </div>
          )}
        </div>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'var(--c-fg-mute)', marginLeft: '4px' }}>
          members
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {sub.skills?.map((s) => (
          <span
            key={s}
            className="font-mono text-[9px] px-2 py-0.5 rounded-md border border-[var(--c-border)]"
            style={{ color: 'var(--c-fg-mute)', background: 'rgba(255,255,255,0.03)' }}
          >
            [{s}]
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Tech Team cluster card (main + sub-domains nested) ───────────
function TechTeamCard() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const accent = isDark ? DARK_ACCENT : LIGHT_ACCENT;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-2xl border border-[var(--c-border)] overflow-hidden p-6 col-span-full"
      style={{ background: 'var(--c-surface)' }}
    >
      {/* Accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />

      {/* Header row */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <span
            className="font-mono text-[10px] tracking-[0.25em] uppercase px-2 py-1 rounded mb-3 inline-block"
            style={{ color: accent, background: `rgba(${ACCENT_RAW},${isDark ? '0.12' : '0.10'})` }}
          >
            Main Domain
          </span>
          <h3 className="font-display font-semibold text-2xl font-mono" style={{ color: 'var(--c-fg)' }}>
            &lt;Tech Team/&gt;
          </h3>
          <p className="font-grotesk text-sm mt-2 max-w-xl" style={{ color: 'var(--c-fg-soft)' }}>
            {techTeam?.desc}
          </p>
        </div>
        <span className="font-mono text-[10px] px-2 py-1 rounded border border-[var(--c-border)] self-start"
          style={{ color: 'var(--c-fg-mute)' }}>
          3 sub-domains
        </span>
      </div>

      {/* Sub-domain mini-cards */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))' }}
      >
        {techSubDomains.map((sub) => (
          <SubDomainMini
            key={sub.id}
            sub={sub}
            accent={accent}
            accentRaw={ACCENT_RAW}
            isDark={isDark}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-[var(--c-border)] flex justify-end">
        <Link
          to="/domains/tech-team"
          className="font-grotesk text-xs font-semibold flex items-center gap-1 hover:text-[var(--c-crimson)]"
          style={{ color: 'var(--c-fg-soft)' }}
        >
          View Tech Team page
          <ArrowRight size={12} style={{ color: accent }} />
        </Link>
      </div>
    </motion.div>
  );
}

// ── Main export ──────────────────────────────────────────────────
export default function Domains({ sectionClass = '' }) {
  return (
    <section id="domains" data-testid="domains-section" className={`section-pad ${sectionClass}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="eyebrow">Domains</span>
          <h2 className="section-heading mb-4">Explore Our Domains</h2>
          <p
            className="font-grotesk text-base md:text-lg body-text-width mb-10"
            style={{ color: 'var(--c-fg-soft)' }}
          >
            Seven specialisations under one roof. Pick your lane — or explore them all.
          </p>
        </motion.div>

        {/* Card grid — Tech Team spans full row; standalones fill the rest */}
        <motion.div
          layout
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))' }}
        >
          <TechTeamCard />

          {standaloneDomains.map((d, i) => (
            <DomainCard key={d.id} domain={d} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
