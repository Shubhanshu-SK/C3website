import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const FAQS = [
  { q: 'Who can join C-Cell?', a: 'Any student enrolled at the college — regardless of year, branch, or experience level. We welcome everyone from developers to designers.' },
  { q: 'Do I need coding experience?', a: 'No. C-Cell is a space for learning. We have domains like design, media, and operations alongside core tech teams, and we learn by building together.' },
  { q: 'Can I join multiple domains?', a: 'Yes. We encourage members to collaborate across multiple domains. You can write code, help design assets, or manage events.' },
  { q: 'How can I participate in events?', a: 'All our workshops, coding sessions, and hackathons are listed on the events page. Simply click register to sign up and join in.' },
  { q: 'What happens inside C-Cell?', a: 'We build real-world projects, hold algorithmic problem-solving sprints, host design reviews, write tech blogs, and run campus events.' }
];

export default function FAQ({ sectionClass = '' }) {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section id="faq" data-testid="faq-section" className={`section-pad ${sectionClass}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">
        <motion.div
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true, margin:'-80px' }}
          transition={{ duration:0.6, ease:[0.22,1,0.36,1] }}
        >
          <span className="eyebrow">FAQ</span>
          <h2 className="section-heading mb-4">
            Frequently asked.
          </h2>
          <p className="font-grotesk text-base md:text-lg body-text-width mb-12" style={{ color:'var(--c-fg-soft)' }}>
            Still have questions? Reach out on any of our social channels.
          </p>
        </motion.div>

        <div className="max-w-[720px]">
          {FAQS.map((item, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div
                key={i}
                data-testid={`faq-item-${i}`}
                initial={{ opacity:0, y:16 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-60px' }}
                transition={{ duration:0.4, delay:i*0.05, ease:[0.22,1,0.36,1] }}
              >
                {/* Wrapper: highlighted bg when open */}
                <div
                  className={isOpen ? 'faq-item-open' : ''}
                  style={{ transition:'background 0.3s' }}
                >
                  <div
                    style={{ borderBottom:'1px solid var(--c-border)' }}
                  >
                    <button
                      data-testid={`faq-button-${i}`}
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span
                        className="font-grotesk font-medium text-base md:text-lg"
                        style={{ color: isOpen ? 'var(--c-mint)' : 'var(--c-fg)', transition:'color 0.2s' }}
                      >
                        {item.q}
                      </span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration:0.3, ease:[0.22,1,0.36,1] }}
                        className="shrink-0"
                        style={{ color: isOpen ? 'var(--c-mint)' : 'var(--c-fg-mute)' }}
                      >
                        <Plus size={20} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          data-testid={`faq-answer-${i}`}
                          key="answer"
                          initial={{ height:0, opacity:0 }}
                          animate={{ height:'auto', opacity:1 }}
                          exit={{ height:0, opacity:0 }}
                          transition={{ duration:0.38, ease:[0.22,1,0.36,1] }}
                          className="faq-answer"
                        >
                          <p
                            className="font-grotesk text-sm md:text-base leading-relaxed pb-6 pr-4"
                            style={{ color:'var(--c-fg-soft)' }}
                          >
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
