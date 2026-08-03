import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Code2, Users, FolderGit2 } from 'lucide-react';
import { getProjectById } from '../services/projectService';

const GithubIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function ProjectDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState(location.state?.project || null);
  const [loading, setLoading] = useState(!location.state?.project);

  useEffect(() => {
    if (location.state?.project) {
      setProject(location.state.project);
      setLoading(false);
      return;
    }

    getProjectById(id)
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching project detail:', err);
        setLoading(false);
      });
  }, [id, location.state?.project]);

  if (loading) {
    return (
      <section className="section-pad sec-b min-h-screen pt-28 flex items-center justify-center">
        <div className="font-mono text-xs tracking-wider" style={{ color: 'var(--c-crimson)' }}>
          LOADING_PROJECT_DETAILS...
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="section-pad sec-b min-h-screen pt-28 flex flex-col items-center justify-center">
        <h2 className="font-display font-semibold text-2xl mb-4">Project Not Found</h2>
        <Link to="/projects" className="px-5 py-2.5 rounded-full border border-[var(--c-border)] font-grotesk text-sm hover:text-[var(--c-crimson)]">
          Back to Projects
        </Link>
      </section>
    );
  }

  return (
    <section className="section-pad sec-b min-h-screen pt-28">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        {/* Back Link */}
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase mb-6 hover:text-[var(--c-crimson)] transition-colors"
          style={{ color: 'var(--c-fg-soft)' }}
        >
          <ArrowLeft size={14} />
          Back to Projects
        </Link>

        {/* Hero Area */}
        <div className="rounded-2xl overflow-hidden mb-8 border border-[var(--c-border)]">
          {project.image ? (
            <div className="relative h-40 sm:h-52 w-full overflow-hidden">
              <img
                src={project.image}
                alt={project.title ? project.title.replace(/_/g, ' ') : 'Project image'}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-0 flex items-end p-6 md:p-8">
                <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex flex-col gap-2">
                      <span className="font-mono text-[11px] sm:text-[12px] uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-[var(--c-border)]" style={{ color: 'var(--c-crimson)', background: 'rgba(8,11,16,0.65)' }}>
                        {project.domain ? project.domain.replace(/_/g, ' ') : ''}
                      </span>
                      <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl text-white mt-1">
                        {project.title ? project.title.replace(/_/g, ' ') : ''}
                      </h1>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-105 flex items-center gap-2"
                        style={{
                          background: 'var(--c-surface-2)',
                          color: 'var(--c-fg)',
                          border: '1px solid var(--c-border)'
                        }}
                      >
                        <GithubIcon size={14} />
                        <span>Source</span>
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-105 flex items-center gap-2"
                        style={{
                          background: 'var(--c-crimson)',
                          color: 'white',
                          boxShadow: '0 0 15px rgba(236,51,56,0.25)',
                        }}
                      >
                        <span>Live Demo</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="relative h-40 sm:h-52 w-full flex items-end p-6 md:p-8"
              style={{ background: 'linear-gradient(135deg, rgba(0, 140, 169, 0.1) 0%, rgba(236, 51, 56, 0.1) 100%)' }}
            >
              <div className="absolute inset-0 bg-black/30 z-0" />
              <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded border border-[var(--c-border)]" style={{ color: 'var(--c-crimson)', background: 'rgba(236,51,56,0.12)' }}>
                    {project.domain ? project.domain.replace(/_/g, ' ') : ''}
                  </span>
                  <h1 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-white mt-2">
                    {project.title ? project.title.replace(/_/g, ' ') : ''}
                  </h1>
                </div>
                <div className="flex gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-105 flex items-center gap-2"
                      style={{
                        background: 'var(--c-surface-2)',
                        color: 'var(--c-fg)',
                        border: '1px solid var(--c-border)'
                      }}
                    >
                      <GithubIcon size={14} />
                      <span>Source</span>
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider text-center transition-all hover:scale-105 flex items-center gap-2"
                      style={{
                        background: 'var(--c-crimson)',
                        color: 'white',
                        boxShadow: '0 0 15px rgba(236,51,56,0.25)',
                      }}
                    >
                      <span>Live Demo</span>
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-display font-semibold text-[32px] mb-4" style={{ color: 'var(--c-fg)' }}>
              Project Overview
            </h2>
            <p className="font-grotesk text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'var(--c-fg-soft)' }}>
              {project.description ? project.description.replace(/_/g, ' ') : ''}
            </p>
          </div>

          <div className="md:col-span-1">
            <div
              className="rounded-2xl border border-[var(--c-border)] p-6 flex flex-col gap-5 sticky top-28"
              style={{ background: 'var(--c-surface)' }}
            >
              <h3 className="font-display font-semibold text-[20px] border-b border-[var(--c-border)] pb-3" style={{ color: 'var(--c-fg)' }}>
                Tech Details
              </h3>

              <div className="flex flex-col gap-1">
                <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--c-fg-mute)' }}>Contributors</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {project.contributors?.map(c => (
                    <span key={c} className="font-grotesk text-[16px] font-semibold px-2 py-0.5 rounded border border-[var(--c-border)]" style={{ color: 'var(--c-fg)' }}>
                      {c.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1 border-t border-[var(--c-border)] pt-4">
                <span className="font-mono text-[9px] uppercase tracking-wider" style={{ color: 'var(--c-fg-mute)' }}>Technologies Used</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {(project.technology || project.techStack)?.map(t => (
                    <span key={t} className="font-mono text-[12px] px-2 py-0.5 rounded" style={{ color: 'var(--c-crimson)', background: 'rgba(236,51,56,0.12)' }}>
                      {t.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
