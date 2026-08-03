import React from 'react';
import { motion } from 'framer-motion';

const CARDS = [
  { num:'01', title:'Cross-domain exposure', desc:"Every domain runs collaborative projects. You'll work alongside designers, coders, creatives, and strategists — all in one club." },
  { num:'02', title:'Hands-on learning',     desc:'No lectures. Real briefs, real feedback, real deliverables. We learn by shipping — projects, products, and events.' },
  { num:'03', title:'Ship opportunities',    desc:'Hackathons, exhibitions, brand campaigns, open-source contributions. Build a portfolio that speaks louder than a resume.' },
  { num:'04', title:'An actual community',   desc:'A space where curious, ambitious people gather. Late-night builds, hot takes in the group chat, and real friendships that outlast college.' },
];

export default function WhyJoin({ sectionClass = '' }) {
  return (
    <section id="why-join" data-testid="why-section" className={`section-pad ${sectionClass}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-80px' }}
          transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
        >
          <span className="eyebrow">Why Join</span>
          <h2 className="section-heading mb-4">
            Four reasons it's worth the time.
          </h2>
          <p className="font-grotesk text-base md:text-lg body-text-width mb-14" style={{ color:'var(--c-fg-soft)' }}>
            We're not another club that meets once a month. Here's what actually happens.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.num}
              data-testid={`why-card-${card.num}`}
              className="lift-card relative rounded-2xl border-soft p-7 md:p-8 overflow-hidden"
              style={{ background:'var(--c-surface)' }}
              initial={{ opacity:0, y:30 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:'-80px' }}
              transition={{ duration:0.5, delay:i*0.1, ease:[0.22,1,0.36,1] }}
            >
              <span className="watermark-num absolute -bottom-6 -right-4 select-none" aria-hidden="true">
                {card.num}
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase block mb-4" style={{ color:'var(--c-mint)' }}>
                {card.num}
              </span>
              <h3 className="font-display font-semibold text-xl md:text-2xl mb-3" style={{ color:'var(--c-fg)' }}>
                {card.title}
              </h3>
              <p className="font-grotesk text-sm leading-relaxed" style={{ color:'var(--c-fg-soft)' }}>
                {card.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
