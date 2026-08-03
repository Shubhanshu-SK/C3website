import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ExternalLink, Code2, Users, FolderGit2, ArrowRight } from 'lucide-react';

const GithubIcon = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const projectId = project._id || project.id;

  const handleCardClick = (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    navigate(`/projects/${projectId}`, { state: { project } });
  };

  return (
    <div
      onClick={handleCardClick}
      className="lift-card relative rounded-2xl border border-[var(--c-border)] overflow-hidden flex flex-col cursor-pointer h-full"
      style={{
        background: 'var(--c-surface)',
        '--card-accent-border': 'rgba(56,191,255,0.25)',
      }}
    >
      {/* Visual Accent Top Bar */}
      <div
        className="top-bar absolute top-0 left-0 right-0 h-1 z-10"
        style={{ background: 'linear-gradient(90deg, var(--c-mint) 0%, var(--c-electric) 100%)' }}
      />

      {/* Cover Image */}
      {project.image ? (
        <div className="relative w-full h-40 overflow-hidden shrink-0">
          <img
            src={project.image}
            alt={project.title ? project.title.replace(/_/g, ' ') : ''}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.5) 100%)' }} />
          {/* Domain badge on image */}
          <div className="absolute bottom-3 left-4">
            <span
              className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded border border-[var(--c-border)]"
              style={{ color: 'var(--c-mint)', background: 'rgba(8,11,16,0.7)' }}
            >
              &lt;{project.domain ? project.domain.replace(/_/g, ' ') : ''}/&gt;
            </span>
          </div>
        </div>
      ) : (
        /* Placeholder if no image */
        <div
          className="w-full h-40 shrink-0 flex items-center justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(56,191,255,0.08) 0%, rgba(74,240,160,0.08) 100%)' }}
        >
          <FolderGit2 size={40} style={{ color: 'rgba(56,191,255,0.30)' }} />
          <div className="absolute bottom-3 left-4">
            <span
              className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded border border-[var(--c-border)]"
              style={{ color: 'var(--c-mint)', background: 'var(--c-mint-bg)' }}
            >
              &lt;{project.domain ? project.domain.replace(/_/g, ' ') : ''}/&gt;
            </span>
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-6">

        {/* Project Name */}
        <h3 className="font-display font-semibold text-lg md:text-xl mb-2 leading-snug" style={{ color: 'var(--c-fg)' }}>
          {project.title ? project.title.replace(/_/g, ' ') : ''}
        </h3>

        {/* Description */}
        <p className="font-grotesk text-xs md:text-sm mb-4 leading-relaxed flex-1" style={{ color: 'var(--c-fg-soft)' }}>
          {project.description ? project.description.replace(/_/g, ' ') : ''}
        </p>

        {/* Contributors */}
        {project.contributors && project.contributors.length > 0 && (
          <div className="flex items-start gap-2 mb-3">
            <Users size={13} className="text-[var(--c-fg-mute)] mt-0.5 shrink-0" />
            <span className="font-mono text-[10px]" style={{ color: 'var(--c-fg-mute)' }}>
              By: {project.contributors.map(c => c.replace(/_/g, ' ')).join(', ')}
            </span>
          </div>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1 mb-5">
          {(project.technology || project.techStack)?.map(t => (
            <span
              key={t}
              className="font-mono text-[9px] px-1.5 py-0.5 rounded"
              style={{ color: 'var(--c-electric)', background: 'rgba(56,191,255,0.08)', border: '1px solid rgba(56,191,255,0.2)' }}
            >
              [{t ? t.replace(/_/g, ' ') : ''}]
            </span>
          ))}
        </div>

        {/* Action Links */}
        <div className="flex items-center justify-between gap-4 border-t border-[var(--c-border)] pt-4 mt-auto">
          <Link
            to={`/projects/${projectId}`}
            state={{ project }}
            className="font-grotesk text-xs font-semibold flex items-center gap-1 hover:text-[var(--c-mint)] transition-colors"
            style={{ color: 'var(--c-fg-soft)' }}
          >
            View Project
            <ArrowRight size={12} />
          </Link>

          <div className="flex gap-3">
            {(project.github || project.links?.github) && (
              <a
                href={project.github || project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--c-fg-mute)] hover:text-[var(--c-mint)] transition-colors"
                title="GitHub"
              >
                <GithubIcon size={14} />
              </a>
            )}
            {(project.demo || project.links?.demo) && (
              <a
                href={project.demo || project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--c-fg-mute)] hover:text-[var(--c-electric)] transition-colors"
                title="Live Demo"
              >
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
