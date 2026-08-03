import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import Countdown from '../components/Countdown';
import RegistrationModal from '../components/RegistrationModal';
import { getEventById } from '../services/eventService';

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventById(id)
      .then((data) => {
        setEvent(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching event details:', err);
        setEvent(null);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <section className="section-pad sec-b min-h-screen pt-28 flex items-center justify-center">
        <div className="font-mono text-xs tracking-wider" style={{ color: 'var(--c-crimson)' }}>
          LOADING_EVENT_DETAILS...
        </div>
      </section>
    );
  }

  if (!event) {
    return (
      <section className="section-pad sec-b min-h-screen pt-28 flex flex-col items-center justify-center">
        <h2 className="font-display font-semibold text-2xl mb-4">Event Not Found</h2>
        <Link to="/events" className="px-5 py-2.5 rounded-full border border-[var(--c-border)] font-grotesk text-sm hover:text-[var(--c-crimson)]">
          Back to Events
        </Link>
      </section>
    );
  }

  const isUpcoming = event.status?.toLowerCase() === 'upcoming';

  return (
    <section className="section-pad sec-b min-h-screen pt-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">

        {/* Back Link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase mb-6 hover:text-[var(--c-crimson)] transition-colors"
          style={{ color: 'var(--c-fg-soft)' }}
        >
          <ArrowLeft size={14} />
          Back to Events
        </Link>

        {/* Hero Banner Area */}
        <div className="rounded-2xl overflow-hidden mb-8 border border-[var(--c-border)]">
          {event.image ? (
            <div className="relative h-48 sm:h-64 w-full overflow-hidden">
              <img
                src={event.image}
                alt={event.title ? event.title.replace(/_/g, ' ') : 'Event image'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-end p-6 md:p-8">
                <div className="relative z-10 w-full">
                  <div className="mb-2">
                    <StatusBadge status={event.status} />
                  </div>
                  <h1 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-white">
                    {event.title ? event.title.replace(/_/g, ' ') : ''}
                  </h1>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="relative h-48 sm:h-64 w-full flex items-end p-6 md:p-8"
              style={{ background: 'var(--c-gradient)' }}
            >
              <div className="absolute inset-0 bg-black/40 z-0" />
              <div className="relative z-10 w-full">
                <div className="mb-2">
                  <StatusBadge status={event.status} />
                </div>
                <h1 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-white">
                  {event.title ? event.title.replace(/_/g, ' ') : ''}
                </h1>
              </div>
            </div>
          )}
        </div>

        {/* Content Layout Grid */}
        <div className="grid md:grid-cols-3 gap-8">

          {/* Left: Info & Description */}
          <div className="md:col-span-2">
            <h2 className="font-display font-semibold text-xl mb-4" style={{ color: 'var(--c-fg)' }}>
              About the Event
            </h2>
            <p className="font-grotesk text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--c-fg-soft)' }}>
              {event.description ? event.description.replace(/_/g, ' ') : ''}
            </p>

            <div className="border-t border-[var(--c-border)] pt-6">
              <h3 className="font-display font-semibold text-base mb-3" style={{ color: 'var(--c-fg)' }}>
                Host & Presenters
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold text-xs" style={{ background: 'var(--c-surface-2)', color: 'var(--c-crimson)', border: '1px solid var(--c-border)' }}>
                  C-Cell
                </div>
                <div>
                  <p className="font-grotesk text-sm font-semibold" style={{ color: 'var(--c-fg)' }}>
                    {event.presenter ? event.presenter.replace(/_/g, ' ') : ''}
                  </p>
                  <p className="font-mono text-[9px] uppercase" style={{ color: 'var(--c-fg-mute)' }}>
                    C-Cell Core Lead Facilitator
                  </p>
                </div>
              </div>

              {isUpcoming && !event.registrationLink && (
                <div className="mt-6 rounded-2xl border border-[var(--c-border)] p-4 sm:p-6" style={{ background: 'var(--c-surface)' }}>
                  <h4 className="font-display font-semibold text-base mb-3" style={{ color: 'var(--c-fg)' }}>
                    Register for this event
                  </h4>
                  <RegistrationModal event={event} inline />
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick details & registration Card */}
          <div className="md:col-span-1">
            <div
              className="rounded-2xl border border-[var(--c-border)] p-6 flex flex-col gap-5 sticky top-28"
              style={{ background: 'var(--c-surface)' }}
            >
              <h3 className="font-display font-semibold text-md border-b border-[var(--c-border)] pb-3" style={{ color: 'var(--c-fg)' }}>
                Event Details
              </h3>

              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-[var(--c-crimson)] mt-0.5 shrink-0" />
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--c-fg-mute)' }}>Date</span>
                  <span className="font-grotesk text-sm font-medium" style={{ color: 'var(--c-fg)' }}>{event.date}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[var(--c-crimson)] mt-0.5 shrink-0" />
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--c-fg-mute)' }}>Time</span>
                  <span className="font-grotesk text-sm font-medium" style={{ color: 'var(--c-fg)' }}>{event.time}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[var(--c-cyan)] mt-0.5 shrink-0" />
                <div>
                  <span className="block font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--c-fg-mute)' }}>Venue</span>
                  <span className="font-grotesk text-sm font-medium" style={{ color: 'var(--c-fg)' }}>{event.venue ? event.venue.replace(/_/g, ' ') : ''}</span>
                </div>
              </div>

              {/* Countdown for upcoming */}
              {isUpcoming && (
                <div className="border-t border-b border-[var(--c-border)] py-4 my-2">
                  <Countdown targetDate={`${event.date}T${event.time}`} />
                </div>
              )}

              {/* Action Button */}
              {isUpcoming ? (
                event.registrationLink ? (
                  <a
                    href={event.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-105 flex items-center justify-center gap-2"
                    style={{
                      background: 'var(--c-crimson)',
                      color: 'white',
                      boxShadow: '0 0 15px rgba(236,51,56,0.25)',
                    }}
                  >
                    Register
                  </a>
                ) : (
                  <div
                    className="rounded-xl border border-[var(--c-border)] p-3 text-center font-mono text-[10px] uppercase tracking-wider"
                    style={{ color: 'var(--c-fg-soft)', background: 'var(--c-surface-2)' }}
                  >
                    Registration form below
                  </div>
                )
              ) : (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider text-center"
                  style={{
                    background: 'var(--c-surface-3)',
                    color: 'var(--c-fg-mute)',
                    border: '1px solid var(--c-border)',
                  }}
                >
                  Event Completed
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
