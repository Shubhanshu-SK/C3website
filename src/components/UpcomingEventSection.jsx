import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, User, ArrowRight } from 'lucide-react';
import Countdown from './Countdown';
import { getEvents } from '../services/eventService';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function UpcomingEventSection() {
  const navigate = useNavigate();
  const [nearestEvent, setNearestEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then((data) => {
        // Filter upcoming events that are in the future
        const upcoming = data.filter((e) => {
          if (e.status?.toLowerCase() !== 'upcoming') return false;
          const eventDateTime = new Date(`${e.date}T${e.time}`);
          return eventDateTime > new Date();
        });

        if (upcoming.length > 0) {
          // Sort ascending (nearest first)
          upcoming.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA - dateB;
          });
          setNearestEvent(upcoming[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading upcoming event:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !nearestEvent) {
    return null; // Hide section if loading or no upcoming events exist
  }

  const eventId = nearestEvent._id || nearestEvent.id;

  return (
    <section id="events" className="section-pad sec-c relative overflow-hidden">
      {/* Decorative radial blur gradient */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74, 240, 160, 0.08) 0%, transparent 70%)',
          filter: 'blur(45px)',
          zIndex: 0
        }}
      />

      <div className="max-w-4xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div {...fadeUp(0)} className="text-center mb-8">
          <span className="eyebrow justify-center">Next Event</span>
          <h2 className="section-heading mt-2">
            Explore Our Events
          </h2>
          <p className="font-grotesk text-sm mt-3" style={{ color: 'var(--c-fg-soft)' }}>
            Workshops, coding sessions, hackathons, and community events organized by C-Cell.
          </p>
        </motion.div>

        <motion.div
          {...fadeUp(0.12)}
          className="rounded-2xl border border-[var(--c-border)] p-6 sm:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
          style={{
            background: 'var(--c-surface)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
          }}
        >
          {/* Top Bar Highlight */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{
              background: 'linear-gradient(90deg, var(--c-mint) 0%, var(--c-electric) 100%)',
            }}
          />

          {/* Left Column: Event details */}
          <div className="flex-1 text-center md:text-left">
            <span
              className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[var(--c-border)]"
              style={{ color: 'var(--c-mint)', background: 'var(--c-mint-bg)' }}
            >
              {nearestEvent.domain ? nearestEvent.domain.replace(/_/g, ' ') : ''}
            </span>

            <h3 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl mt-3 mb-4" style={{ color: 'var(--c-fg)' }}>
              {nearestEvent.title ? nearestEvent.title.replace(/_/g, ' ') : ''}
            </h3>

            {/* Meta Rows */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center md:justify-start items-center font-mono text-[10px] mt-2" style={{ color: 'var(--c-fg-soft)' }}>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-[var(--c-mint)]" />
                <span>{nearestEvent.date} @ {nearestEvent.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-[var(--c-electric)]" />
                <span>{nearestEvent.venue ? nearestEvent.venue.replace(/_/g, ' ') : ''}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User size={13} style={{ color: 'var(--c-fg-mute)' }} />
                <span>By: {nearestEvent.presenter ? nearestEvent.presenter.replace(/_/g, ' ') : ''}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Countdown and CTA */}
          <div className="flex flex-col items-center gap-6 shrink-0 w-full md:w-auto md:border-l border-[var(--c-border)] md:pl-8">
            <Countdown targetDate={`${nearestEvent.date}T${nearestEvent.time}`} label="Starts in" />

            <button
              onClick={() => navigate(`/events/${eventId}`)}
              className="px-6 py-2.5 rounded-full font-grotesk font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-2"
              style={{
                background: 'var(--c-mint)',
                color: 'var(--c-ink)',
                boxShadow: '0 0 15px rgba(74,240,160,0.22)',
              }}
            >
              <span>View Event</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
