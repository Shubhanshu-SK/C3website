import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Clock, MapPin, User, ArrowRight, Calendar } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function EventCard({ event, hideCountdown = false }) {
  const navigate = useNavigate();
  const isUpcoming = event.status?.toLowerCase() === 'upcoming';
  const eventId = event._id || event.id;

  const handleCardClick = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    navigate(`/events/${eventId}`);
  };

  // Format date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="lift-card relative rounded-2xl border border-[var(--c-border)] overflow-hidden flex flex-col cursor-pointer h-full"
      style={{
        background: 'var(--c-surface)',
        '--card-accent-border': isUpcoming ? 'rgba(74,240,160,0.3)' : 'rgba(56,191,255,0.2)',
      }}
    >
      {/* Visual Accent Top Bar */}
      <div
        className="top-bar absolute top-0 left-0 right-0 h-1 z-10"
        style={{
          background: isUpcoming
            ? 'linear-gradient(90deg, var(--c-mint) 0%, var(--c-electric) 100%)'
            : 'linear-gradient(90deg, var(--c-electric) 0%, #c084fc 100%)'
        }}
      />

      {/* Cover Image */}
      {event.image ? (
        <div className="relative w-full h-44 overflow-hidden shrink-0">
          <img
            src={event.image}
            alt={event.title ? event.title.replace(/_/g, ' ') : ''}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {/* Dark overlay gradient on image */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 100%)' }} />
          {/* Status badge over image */}
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <StatusBadge status={event.status} />
          </div>
        </div>
      ) : (
        /* Placeholder gradient if no image */
        <div
          className="w-full h-44 shrink-0 flex items-center justify-center relative overflow-hidden"
          style={{
            background: isUpcoming
              ? 'linear-gradient(135deg, rgba(74,240,160,0.12) 0%, rgba(56,191,255,0.12) 100%)'
              : 'linear-gradient(135deg, rgba(56,191,255,0.08) 0%, rgba(192,132,252,0.08) 100%)'
          }}
        >
          <Calendar size={42} style={{ color: isUpcoming ? 'rgba(74,240,160,0.35)' : 'rgba(56,191,255,0.35)' }} />
          <div className="absolute bottom-3 left-4">
            <StatusBadge status={event.status} />
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Date Badge — Highlighted */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="font-mono text-[11px] font-semibold px-2.5 py-1 rounded-lg border"
            style={{
              color: isUpcoming ? 'var(--c-mint)' : 'var(--c-electric)',
              borderColor: isUpcoming ? 'rgba(74,240,160,0.35)' : 'rgba(56,191,255,0.35)',
              background: isUpcoming ? 'rgba(74,240,160,0.08)' : 'rgba(56,191,255,0.08)',
            }}
          >
            {formatDate(event.date)}
          </span>
          {event.time && (
            <span className="font-mono text-[10px]" style={{ color: 'var(--c-fg-mute)' }}>
              @ {event.time}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-display font-semibold text-lg md:text-xl mb-2 leading-snug" style={{ color: 'var(--c-fg)' }}>
          {event.title ? event.title.replace(/_/g, ' ') : ''}
        </h3>

        {/* Description */}
        <p
          className="font-grotesk text-xs md:text-sm mb-4 leading-relaxed flex-1"
          style={{
            color: 'var(--c-fg-soft)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {event.description ? event.description.replace(/_/g, ' ') : ''}
        </p>

        {/* Event Meta Details */}
        <div className="flex flex-col gap-1.5 mb-5">
          {event.venue && (
            <div className="flex items-center gap-2 font-mono text-[10px]" style={{ color: 'var(--c-fg-mute)' }}>
              <MapPin size={11} className="text-[var(--c-electric)] shrink-0" />
              <span className="truncate">{event.venue.replace(/_/g, ' ')}</span>
            </div>
          )}
          {event.presenter && (
            <div className="flex items-center gap-2 font-mono text-[10px]" style={{ color: 'var(--c-fg-mute)' }}>
              <User size={11} className="shrink-0" />
              <span className="truncate">By: {event.presenter.replace(/_/g, ' ')}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 border-t border-[var(--c-border)] pt-4 mt-auto">
          <Link
            to={`/events/${eventId}`}
            className="font-grotesk text-xs font-semibold flex items-center gap-1 hover:text-[var(--c-mint)] transition-colors"
            style={{ color: 'var(--c-fg-soft)' }}
          >
            Details
            <ArrowRight size={12} />
          </Link>

          {isUpcoming && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                navigate(`/events/${eventId}`);
              }}
              className="px-3 py-1.5 rounded-full font-grotesk font-bold text-[10px] uppercase tracking-wider transition-all hover:scale-105"
              style={{
                background: 'var(--c-mint)',
                color: 'var(--c-ink)',
                boxShadow: '0 0 10px rgba(74,240,160,0.18)',
              }}
            >
              Register
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
