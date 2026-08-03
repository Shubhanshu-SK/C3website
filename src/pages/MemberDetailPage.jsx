import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Globe, Award, Shield } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/team';

const GithubIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function MemberDetailPage() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = TEAM_MEMBERS.find(m => m._id === id || m.id === id);
    setMember(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <section className="section-pad sec-b min-h-screen pt-28 flex items-center justify-center">
        <div className="font-mono text-xs tracking-wider" style={{ color: 'var(--c-crimson)' }}>
          LOADING_CREW_MEMBER_DETAILS...
        </div>
      </section>
    );
  }

  if (!member) {
    return (
      <section className="section-pad sec-b min-h-screen pt-28 flex flex-col items-center justify-center">
        <h2 className="font-display font-semibold text-2xl mb-4">Member Not Found</h2>
        <Link to="/team" className="px-5 py-2.5 rounded-full border border-[var(--c-border)] font-grotesk text-sm hover:text-[var(--c-crimson)]">
          Back to Team
        </Link>
      </section>
    );
  }

  const initials = member.name
    ? member.name.replace(/_/g, ' ').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'CC';

  return (
    <section className="section-pad sec-b min-h-screen pt-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        
        {/* Back Link */}
        <Link
          to="/team"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase mb-8 hover:text-[var(--c-crimson)] transition-colors"
          style={{ color: 'var(--c-fg-soft)' }}
        >
          <ArrowLeft size={14} />
          Back to Team
        </Link>

        {/* Profile Card Layout */}
        <div
          className="rounded-2xl border border-[var(--c-border)] p-6 sm:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden"
          style={{ background: 'var(--c-surface)' }}
        >
          {/* Accent top bar */}
          <div
            className="top-bar absolute top-0 left-0 right-0 h-1"
            style={{
              background: 'var(--c-gradient)',
            }}
          />

          {/* Avatar Area */}
          <div className="relative">
            {member.photo ? (
              <img
                src={member.photo}
                alt={member.name ? member.name.replace(/_/g, ' ') : ''}
                className="w-32 h-32 rounded-full object-cover border-4 border-[var(--c-border)] shadow-xl"
              />
            ) : (
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center font-display font-bold text-4xl border-2 border-[var(--c-border)]"
                style={{
                  background: 'linear-gradient(135deg, rgba(236, 51, 56, 0.15) 0%, rgba(0, 140, 169, 0.15) 100%)',
                  color: 'var(--c-crimson)',
                }}
              >
                {initials}
              </div>
            )}
          </div>

          {/* Details Area */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
              <h1 className="font-display font-semibold text-2xl sm:text-3xl" style={{ color: 'var(--c-fg)' }}>
                {member.name ? member.name.replace(/_/g, ' ') : ''}
              </h1>
              {member.role?.toLowerCase().includes('lead') || member.role?.toLowerCase().includes('head') ? (
                <span
                  className="px-2.5 py-0.5 rounded-full text-[9px] font-mono border border-[var(--c-border)] self-center flex items-center gap-1"
                  style={{ background: 'rgba(236,51,56,0.12)', color: 'var(--c-crimson)' }}
                >
                  <Shield size={10} />
                  <span>Lead Role</span>
                </span>
              ) : null}
            </div>

            <p className="font-mono text-xs uppercase tracking-wider mb-4" style={{ color: 'var(--c-crimson)' }}>
              {member.role ? member.role.replace(/_/g, ' ') : ''}
            </p>

            <div className="flex flex-wrap gap-2 mb-6 justify-center md:justify-start">
              <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-[var(--c-border)]" style={{ color: 'var(--c-fg-mute)', background: 'var(--c-surface-2)' }}>
                Domain: {member.domain ? member.domain.replace(/_/g, ' ') : ''}
              </span>
            </div>

            {/* Skills section */}
            <div className="mb-6">
              <h3 className="font-mono text-[10px] uppercase tracking-wider mb-2 text-left" style={{ color: 'var(--c-fg-mute)' }}>
                Core Competencies
              </h3>
              <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
                {member.skills?.map(s => (
                  <span key={s} className="font-mono text-[10px] px-2.5 py-0.5 rounded border border-[var(--c-border)]" style={{ color: 'var(--c-fg-soft)' }}>
                    {s ? s.replace(/_/g, ' ') : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start gap-4 border-t border-[var(--c-border)] pt-5">
              {member.github && member.github !== '#' && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--c-fg-soft)] hover:text-[var(--c-crimson)] transition-colors flex items-center gap-1.5 font-mono text-[10px]"
                >
                  <GithubIcon size={16} />
                  <span>GitHub</span>
                </a>
              )}
              {member.linkedin && member.linkedin !== '#' && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--c-fg-soft)] hover:text-[var(--c-crimson)] transition-colors flex items-center gap-1.5 font-mono text-[10px]"
                >
                  <LinkedinIcon size={16} />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
