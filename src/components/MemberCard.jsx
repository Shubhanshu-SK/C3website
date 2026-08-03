import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Award, Shield } from 'lucide-react';

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

const TwitterIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
  </svg>
);

export default function MemberCard({ member }) {
  const navigate = useNavigate();
  const memberId = member._id || member.id;

  const handleCardClick = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    navigate(`/team/${memberId}`);
  };

  // Get initials for profile picture fallback
  const initials = member.name
    ? member.name.replace(/_/g, ' ').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'CC';

  // Get social icon
  const getSocialIcon = (key) => {
    switch (key.toLowerCase()) {
      case 'github':
        return <GithubIcon size={16} />;
      case 'linkedin':
        return <LinkedinIcon size={16} />;
      case 'twitter':
        return <TwitterIcon size={16} />;
      default:
        return <Globe size={16} />;
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="lift-card relative rounded-2xl border border-[var(--c-border)] p-6 overflow-hidden flex flex-col items-center text-center cursor-pointer"
      style={{
        background: 'var(--c-surface)',
        '--card-accent-border': 'rgba(74,240,160,0.25)',
      }}
    >
      {/* Decorative top bar */}
      <div
        className="top-bar absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, var(--c-mint) 0%, var(--c-electric) 100%)',
        }}
      />

      {/* Avatar Container */}
      <div className="relative mb-4">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name ? member.name.replace(/_/g, ' ') : ''}
            className="w-20 h-20 rounded-full object-cover border-2 border-[var(--c-border)]"
          />
        ) : (
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center font-display font-bold text-2xl border border-[var(--c-border)]"
            style={{
              background: 'linear-gradient(135deg, rgba(74, 240, 160, 0.15) 0%, rgba(56, 191, 255, 0.15) 100%)',
              color: 'var(--c-mint)',
              boxShadow: 'inset 0 0 10px rgba(74,240,160,0.1)'
            }}
          >
            {initials}
          </div>
        )}

        {/* Small admin badge if they are a Lead */}
        {member.role?.toLowerCase().includes('lead') || member.role?.toLowerCase().includes('head') ? (
          <span
            className="absolute -bottom-1 -right-1 p-1 rounded-full border border-[var(--c-border)]"
            style={{ background: 'var(--c-bg)', color: 'var(--c-mint)' }}
            title="Lead"
          >
            <Shield size={12} />
          </span>
        ) : null}
      </div>

      {/* Name and Role */}
      <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--c-fg)' }}>
        {member.name ? member.name.replace(/_/g, ' ') : ''}
      </h3>
      <p className="font-mono text-[10px] tracking-wider uppercase mb-1" style={{ color: 'var(--c-mint)' }}>
        {member.role ? member.role.replace(/_/g, ' ') : ''}
      </p>


      <span
        className="px-2 py-0.5 rounded text-[9px] font-mono mb-4 border border-[var(--c-border)]"
        style={{ color: 'var(--c-fg-mute)', background: 'var(--c-surface-2)' }}
      >
        &lt;{member.domain ? member.domain.replace(/_/g, ' ') : ''}/&gt;
      </span>

      {/* Skills list */}
      <div className="flex flex-wrap justify-center gap-1.5 mb-5 flex-1 content-start">
        {member.skills?.map(s => (
          <span
            key={s}
            className="font-mono text-[9px] px-2 py-0.5 rounded border border-[var(--c-border)]"
            style={{ color: 'var(--c-fg-soft)' }}
          >
            [{s ? s.replace(/_/g, ' ') : ''}]
          </span>
        ))}
      </div>

      {/* Social Links */}
      {((member.github && member.github !== '#') || (member.linkedin && member.linkedin !== '#') || (member.socials && Object.keys(member.socials).length > 0)) && (
        <div className="flex justify-center gap-3 border-t border-[var(--c-border)] pt-4 w-full">
          {member.github && member.github !== '#' && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--c-fg-mute)] hover:text-[var(--c-mint)] transition-colors p-1"
              title="GitHub"
            >
              <GithubIcon size={16} />
            </a>
          )}
          {member.linkedin && member.linkedin !== '#' && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--c-fg-mute)] hover:text-[var(--c-mint)] transition-colors p-1"
              title="LinkedIn"
            >
              <LinkedinIcon size={16} />
            </a>
          )}
          {member.socials && Object.entries(member.socials).map(([key, url]) => (
            <a
              key={key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--c-fg-mute)] hover:text-[var(--c-mint)] transition-colors p-1"
              title={key}
            >
              {getSocialIcon(key)}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
