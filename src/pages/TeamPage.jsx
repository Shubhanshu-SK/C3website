import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MemberCard from '../components/MemberCard';
import { useTheme } from '../context/ThemeContext';
import { TEAM_MEMBERS } from '../data/team';

const DOMAIN_FILTERS = [
  { label: 'All Crew', value: 'all' },
  { label: 'Tech', value: 'Tech_Team' },
  { label: 'Web Dev', value: 'Web_Development' },
  { label: 'DSA', value: 'DSA' },
  { label: 'Data Science', value: 'Data_Science' },
  { label: 'Operations', value: 'Operation_and_Management' },
  { label: 'PR', value: 'PR_and_Outreach' },
  { label: 'Media', value: 'Media_and_Content_Writing' },
  { label: 'Design', value: 'Graphic_Designing' }
];

export default function TeamPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState('all');
  const [members] = useState(TEAM_MEMBERS);
  const [loading] = useState(false);

  const filteredMembers = filter === 'all'
    ? members
    : members.filter(m => {
      if (!m.domain) return false;
      // Handle space vs underscore differences gracefully
      const mDom = m.domain.toLowerCase().replace(/_/g, ' ');
      const fDom = filter.toLowerCase().replace(/_/g, ' ');
      return mDom === fDom;
    });

  const coreTeam = filteredMembers.filter(m => m.role?.toLowerCase() === 'club lead');
  const domainLeads = filteredMembers.filter(m => (m.role?.toLowerCase().includes('lead') || m.role?.toLowerCase().includes('head')) && m.role?.toLowerCase() !== 'club lead');
  const generalMembers = filteredMembers.filter(m => !m.role?.toLowerCase().includes('lead') && !m.role?.toLowerCase().includes('head'));

  return (
    <section className="section-pad sec-b min-h-screen pt-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10"
        >
          <span className="eyebrow">Team Directory</span>
          <h2 className="section-heading mb-4">
            The People Behind C-Cell
          </h2>
          <p className="font-grotesk text-base md:text-lg body-text-width text-[var(--c-fg-soft)]">
            A collective of student engineers, product designers, writers, and organizers pushing local tech forwards.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {DOMAIN_FILTERS.map(f => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-grotesk border transition-all"
                style={{
                  background: active ? (isDark ? '#4af0a0' : '#0d9e5c') : 'var(--c-surface-2)',
                  color: active ? (isDark ? '#080b10' : '#ffffff') : 'var(--c-fg)',
                  borderColor: active ? (isDark ? '#4af0a0' : '#0d9e5c') : 'var(--c-border)',
                  boxShadow: active ? `0 2px 10px ${isDark ? 'rgba(74,240,160,0.22)' : 'rgba(13,158,92,0.20)'}` : 'none',
                  fontWeight: active ? 700 : 500,
                  transform: active ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* Roster Grid */}
        {loading ? (
          <div className="text-center py-16 font-mono text-xs tracking-wider" style={{ color: 'var(--c-crimson)' }}>
            LOADING_CREW_ROSTER...
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="flex flex-col gap-12">
            {coreTeam.length > 0 && (
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest mb-6 px-3 py-1 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-md inline-block" style={{ color: 'var(--c-crimson)' }}>
                  [Core Team]
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {coreTeam.map((member, idx) => (
                      <motion.div
                        layout
                        key={member._id || member.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                      >
                        <MemberCard member={member} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {domainLeads.length > 0 && (
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest mb-6 px-3 py-1 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-md inline-block" style={{ color: 'var(--c-electric)' }}>
                  [Domain Leads]
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {domainLeads.map((member, idx) => (
                      <motion.div
                        layout
                        key={member._id || member.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                      >
                        <MemberCard member={member} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {generalMembers.length > 0 && (
              <div>
                <h3 className="font-mono text-xs uppercase tracking-widest mb-6 px-3 py-1 bg-[var(--c-surface-2)] border border-[var(--c-border)] rounded-md inline-block" style={{ color: 'var(--c-fg-mute)' }}>
                  [Members]
                </h3>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  <AnimatePresence mode="popLayout">
                    {generalMembers.map((member, idx) => (
                      <motion.div
                        layout
                        key={member._id || member.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: idx * 0.04 }}
                      >
                        <MemberCard member={member} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border border-dashed border-[var(--c-border)] rounded-2xl"
          >
            <p className="font-mono text-sm text-[var(--c-fg-mute)]">
              NO TEAM MEMBERS IN THIS DOMAIN CURRENTLY.
            </p>
          </motion.div>
        )}

      </div>
    </section>
  );
}
