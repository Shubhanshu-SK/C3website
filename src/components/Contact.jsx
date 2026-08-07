import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowUpRight } from 'lucide-react';

const InstagramIcon = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 22, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const SOCIALS = [
  { id: 'instagram', name: 'Instagram', handle: 'ccellrgpv', desc: 'Behind the scenes & announcements.', icon: InstagramIcon, gradient: 'grad-instagram', href: 'https://www.instagram.com/ccellrgpv?igsh=cnd6c2RpanUwbGw3' },
  { id: 'whatsapp', name: 'WhatsApp', handle: 'Community Group', desc: 'Join the official community for updates.', icon: MessageCircle, gradient: 'grad-whatsapp', href: 'https://chat.whatsapp.com/KaEHN8POKkKDmF2X1g0MYH?s=sw&p=a&mlu=4' },
  // { id: 'linkedin', name: 'LinkedIn', handle: 'ccellrgpv', desc: 'Events, recaps, and alumni network.', icon: LinkedinIcon, gradient: 'grad-linkedin', href: '#' },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Contact({ sectionClass = '' }) {
  return (
    <section id="contact" data-testid="contact-section" className={`section-pad ${sectionClass}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
        <motion.div {...fadeUp(0)}>
          <span className="eyebrow">Contact</span>
          <h2 className="section-heading mb-4">
            Find us. There.
          </h2>
          <p className="font-grotesk text-base md:text-lg body-text-width mb-10" style={{ color: 'var(--c-fg-soft)' }}>
            Follow along and connect with the C-Cell community members.
          </p>
        </motion.div>

        {/* Socials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOCIALS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.a
                key={s.id}
                {...fadeUp(i * 0.1)}
                data-testid={`social-${s.id}`}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border-soft flex flex-col justify-between"
                style={{
                  background: 'var(--c-surface)',
                  padding: '24px',
                  textDecoration: 'none',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  minHeight: '160px'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`${s.gradient} rounded-xl flex items-center justify-center`}
                    style={{ width: 44, height: 44, flexShrink: 0 }}
                  >
                    <Icon size={19} color="white" />
                  </div>
                  <ArrowUpRight
                    size={16}
                    style={{ color: 'var(--c-fg-mute)', flexShrink: 0, transition: 'transform 0.2s' }}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>

                <div className="mt-4">
                  <p className="font-display font-semibold text-sm" style={{ color: 'var(--c-fg)' }}>
                    {s.name}
                  </p>
                  <p className="font-mono text-[11px] mt-0.5" style={{ color: 'var(--c-mint)' }}>
                    {s.handle}
                  </p>
                  <p
                    className="font-grotesk text-xs mt-1 leading-snug"
                    style={{ color: 'var(--c-fg-mute)' }}
                  >
                    {s.desc}
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}