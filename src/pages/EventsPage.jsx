import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import EventCard from '../components/EventCard';
import Countdown from '../components/Countdown';
import { useTheme } from '../context/ThemeContext';
import { getEvents } from '../services/eventService';

const FILTERS = [
  { label: 'All Events', value: 'all' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Completed', value: 'completed' }
];

export default function EventsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [nearestEvent, setNearestEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEvents()
      .then((data) => {
        setEvents(data);

        // Find nearest upcoming event
        const upcoming = data.filter((e) => {
          if (e.status?.toLowerCase() !== 'upcoming') return false;
          const eventDateTime = new Date(`${e.date}T${e.time}`);
          return eventDateTime > new Date();
        });

        if (upcoming.length > 0) {
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
        console.error('Error loading events from backend:', err);
        setEvents([]);
        setLoading(false);
      });
  }, []);

  const filteredEvents = filter === 'all'
    ? events
    : events.filter(e => e.status?.toLowerCase() === filter);

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
          <span className="eyebrow">Events Portal</span>
          <h2 className="section-heading mb-4">
            Explore our activities.
          </h2>
          <p className="font-grotesk text-base md:text-lg body-text-width text-[var(--c-fg-soft)]">
            Join workshops, design jams, hackathons, and guest lectures hosted by C-Cell Club.
          </p>
        </motion.div>

        {/* Large Top Countdown Clock Section */}
        {nearestEvent && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mb-12 rounded-2xl border border-[var(--c-border)] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6"
            style={{
              background: 'linear-gradient(135deg, rgba(236, 51, 56, 0.08) 0%, rgba(0, 140, 169, 0.08) 100%)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="text-center md:text-left">
              <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[var(--c-border)]" style={{ color: 'var(--c-crimson)', background: 'rgba(236,51,56,0.12)' }}>
                Next Event Countdown
              </span>
              <h3 className="font-display font-semibold text-xl sm:text-2xl mt-2 mb-1" style={{ color: 'var(--c-fg)' }}>
                {nearestEvent.title ? nearestEvent.title.replace(/_/g, ' ') : ''}
              </h3>
              <p className="font-grotesk text-xs sm:text-sm" style={{ color: 'var(--c-fg-soft)' }}>
                Presenter: {nearestEvent.presenter ? nearestEvent.presenter.replace(/_/g, ' ') : ''} | Venue: {nearestEvent.venue ? nearestEvent.venue.replace(/_/g, ' ') : ''}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 shrink-0 w-full md:w-auto">
              <Countdown targetDate={`${nearestEvent.date}T${nearestEvent.time}`} label="" />
              <Link
                to={`/events/${nearestEvent._id || nearestEvent.id}`}
                className="px-5 py-2 rounded-full font-grotesk font-bold text-[10px] uppercase tracking-wider transition-all hover:scale-105 flex items-center gap-1.5"
                style={{
                  background: 'var(--c-crimson)',
                  color: 'white',
                  boxShadow: '0 0 12px rgba(236,51,56,0.25)',
                }}
              >
                <span>View Event Details</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </motion.div>
        )}

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {FILTERS.map(f => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="px-4 py-2 rounded-full text-xs font-grotesk border transition-all"
                style={{
                  background: active ? 'var(--c-crimson)' : 'var(--c-surface-2)',
                  color: active ? '#ffffff' : 'var(--c-fg)',
                  borderColor: active ? 'var(--c-crimson)' : 'var(--c-border)',
                  boxShadow: active ? '0 2px 12px rgba(236,51,56,0.30)' : 'none',
                  fontWeight: active ? 700 : 500,
                  transform: active ? 'scale(1.03)' : 'scale(1)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-16 font-mono text-xs tracking-wider" style={{ color: 'var(--c-crimson)' }}>
            LOADING_COMMUNITY_EVENTS...
          </div>
        ) : filteredEvents.length > 0 ? (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => (
                <motion.div
                  layout
                  key={event._id || event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <EventCard event={event} hideCountdown={true} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 border border-dashed border-[var(--c-border)] rounded-2xl"
          >
            <p className="font-mono text-sm text-[var(--c-fg-mute)]">
              NO EVENTS FOUND UNDER THIS CATEGORY.
            </p>
          </motion.div>
        )}

      </div>
    </section>
  );
}
