import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Code, Calendar, Award } from 'lucide-react';
import MemberCard from '../components/MemberCard';
import ProjectCard from '../components/ProjectCard';
import EventCard from '../components/EventCard';
import { useTheme } from '../context/ThemeContext';
import { getProjects } from '../services/projectService';
import { getEvents } from '../services/eventService';
import { C3_DOMAINS } from '../data/domains';
import { TEAM_MEMBERS } from '../data/team';

export default function DomainDetailPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { domain: slug } = useParams();

  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [resProj, resEv] = await Promise.all([
          getProjects(),
          getEvents()
        ]);
        setProjects(resProj);
        setEvents(resEv);
      } catch (err) {
        console.error('Error fetching domain sub-page data:', err);
        setProjects([]);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const domain = C3_DOMAINS.find(d => {
    // First try direct slug match
    if (d.slug && d.slug.toLowerCase() === slug.toLowerCase()) return true;
    // Fallback: normalize name to slug-style comparison
    const dName = (d.name || '').toLowerCase().replace(/\s+/g, '-').replace(/_/g, '-');
    const targetSlug = slug.toLowerCase().replace(/_/g, '-');
    return dName === targetSlug;
  });

  if (loading) {
    return (
      <section className="section-pad sec-b min-h-screen pt-28 flex items-center justify-center">
        <div className="font-mono text-xs tracking-wider" style={{ color: 'var(--c-crimson)' }}>
          LOADING_DOMAIN_SPECS...
        </div>
      </section>
    );
  }

  if (!domain) {
    return (
      <section className="section-pad sec-b min-h-screen pt-28 flex flex-col items-center justify-center">
        <h2 className="font-display font-semibold text-2xl mb-4">Domain Not Found</h2>
        <Link to="/domains" className="px-5 py-2.5 rounded-full border border-[var(--c-border)] font-grotesk text-sm hover:text-[var(--c-crimson)]">
          Back to Domains
        </Link>
      </section>
    );
  }

  // Resolve Relations
  const domainName = domain.name || '';
  const leadName = domain.lead || '';

  const lead = TEAM_MEMBERS.find(m => {
    if (!m.name) return false;
    return m.name.toLowerCase().replace(/_/g, ' ') === leadName.toLowerCase().replace(/_/g, ' ');
  });

  const teamMembers = TEAM_MEMBERS.filter(m => {
    if (!m.domain) return false;
    const isSameDomain = m.domain.toLowerCase().replace(/_/g, ' ') === domainName.toLowerCase().replace(/_/g, ' ');
    const isLead = m.name && m.name.toLowerCase().replace(/_/g, ' ') === leadName.toLowerCase().replace(/_/g, ' ');
    return isSameDomain && !isLead;
  });

  const domainProjects = projects.filter(p => {
    if (!p.domain) return false;
    return p.domain.toLowerCase().replace(/_/g, ' ') === domainName.toLowerCase().replace(/_/g, ' ');
  });

  const domainEvents = events.filter(e => {
    if (!e.domain) return false;
    return e.domain.toLowerCase().replace(/_/g, ' ') === domainName.toLowerCase().replace(/_/g, ' ');
  });

  // Theme Raw Colors — use domain's own color if available
  const palette = [
    { color: '#4af0a0', colorLight: '#10b981', colorRaw: '74,240,160' },
    { color: '#38bfff', colorLight: '#0ea5e9', colorRaw: '56,191,255' },
    { color: '#c084fc', colorLight: '#a855f7', colorRaw: '192,132,252' },
    { color: '#fcd34d', colorLight: '#eab308', colorRaw: '252,211,77' }
  ];
  const colorAccent = domain.color
    ? { color: domain.color, colorLight: domain.colorLight || domain.color, colorRaw: domain.colorRaw || '74,240,160' }
    : palette[0];
  const accentColor = isDark ? colorAccent.color : colorAccent.colorLight;

  const dsaActivities = [
    { title: 'Weekly Coding Contests', desc: 'Active competitive coding challenges hosted on platforms like LeetCode and Codeforces with post-contest reviews.' },
    { title: 'Topic-wise DSA Bootcamps', desc: 'In-depth coding bootcamps mapping key algorithmic patterns: graph traversals, dynamic programming, and data structures.' },
    { title: 'Peer Programming Mentorship', desc: 'Direct logic and interview prep sessions linking senior club members to learners.' }
  ];

  const dsActivities = [
    { title: 'Kaggle Competition Sprints', desc: 'Team-based participation in machine learning and data visualization sprints on Kaggle.' },
    { title: 'Guest Lectures on AI & ML', desc: 'Technical sessions covering deep neural networks, natural language processing, and modern transformers.' },
    { title: 'Data Visualization Workshops', desc: 'Hands-on tutorials building interactive data dashboards using Python libraries.' }
  ];

  const webMembers = TEAM_MEMBERS.filter(m =>
    m.domain?.toLowerCase() === 'tech team'
  );

  const dsaMembers = TEAM_MEMBERS.filter(m =>
    m.name === 'Shubhanshu Choudhary'
  );

  const webProjects = domainProjects.filter(p => {
    const title = (p.title || '').toLowerCase();
    const tech = (p.technology || []).map(t => t.toLowerCase());
    return title.includes('web') || title.includes('platform') || title.includes('hub') || tech.some(t => ['react', 'node', 'mongodb', 'tailwind', 'js', 'html', 'css', 'javascript', 'express'].includes(t));
  });

  const dsProjects = domainProjects.filter(p => {
    const title = (p.title || '').toLowerCase();
    const tech = (p.technology || []).map(t => t.toLowerCase());
    return title.includes('data') || title.includes('ml') || title.includes('ai') || tech.some(t => ['python', 'ml', 'ai', 'tensorflow', 'pandas', 'numpy', 'scikit', 'pytorch'].includes(t));
  });

  const webEvents = domainEvents.filter(e => {
    const title = (e.title || '').toLowerCase();
    const desc = (e.description || '').toLowerCase();
    return title.includes('hackathon') || title.includes('web') || desc.includes('hackathon') || desc.includes('web');
  });

  const dsaEvents = domainEvents.filter(e => {
    const title = (e.title || '').toLowerCase();
    const desc = (e.description || '').toLowerCase();
    return title.includes('algorithm') || title.includes('graph') || title.includes('dsa') || title.includes('contest') || desc.includes('algorithm') || desc.includes('graph') || desc.includes('dsa');
  });

  const dsEvents = domainEvents.filter(e => {
    const title = (e.title || '').toLowerCase();
    const desc = (e.description || '').toLowerCase();
    return title.includes('data') || title.includes('ml') || title.includes('ai') || desc.includes('data') || desc.includes('ml') || desc.includes('ai');
  });

  return (
    <section
      className="section-pad sec-b min-h-screen pt-28"
      style={slug === 'design' ? { background: 'linear-gradient(135deg, rgb(24,72,82) 0%, rgb(0,140,169) 40%, rgb(24,72,82) 65%, rgb(236,51,56) 100%)' } : undefined}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 md:px-12">

        {/* Back Link */}
        <Link
          to="/domains"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase mb-6 hover:text-[var(--c-mint)] transition-colors"
          style={{ color: 'var(--c-fg-soft)' }}
        >
          <ArrowLeft size={14} />
          Back to Domains
        </Link>

        {/* Header Block */}
        <div className="border-b border-[var(--c-border)] pb-8 mb-10">
          <div className="flex flex-wrap gap-2 mb-3">
            <span
              className="font-mono text-[9px] tracking-wider uppercase px-2 py-0.5 rounded border"
              style={{
                color: accentColor,
                borderColor: accentColor,
                background: `rgba(${colorAccent.colorRaw}, 0.1)`
              }}
            >
              {(techDomainNames().includes(domain.slug) || techDomainNames().includes(domainName)) ? 'Tech Division' : 'Core Division'}
            </span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4" style={{ color: 'var(--c-fg)' }}>
            {domainName.replace(/_/g, ' ')}
          </h1>

          <p className="font-grotesk text-sm sm:text-base md:text-lg text-[var(--c-fg-soft)] leading-relaxed max-w-3xl">
            {(domain.desc || domain.description || domain.introduction || '').replace(/_/g, ' ')}
          </p>
        </div>

        {/* Core Sections Content Layout */}
        {['tech', 'tech-team', 'tech_team'].includes(slug.toLowerCase()) ? (
          <div className="flex flex-col gap-16">
            {/* Subsection: Web Development */}
            <div className="border-t border-[var(--c-border)] pt-10">
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-2 text-[var(--c-fg)]">
                Web Development
              </h2>
              <p className="font-grotesk text-xs md:text-sm text-[var(--c-fg-soft)] mb-8 max-w-2xl">
                Building dynamic, highly responsive web interfaces, modern full-stack systems, and robust platform utilities.
              </p>

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left/Middle: Projects & Events */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                  <div>
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                      <Code size={16} /> Web Projects
                    </h3>
                    {webProjects.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {webProjects.map(project => (
                          <ProjectCard key={project._id || project.id} project={project} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 border border-dashed border-[var(--c-border)] rounded-2xl text-center font-mono text-xs text-[var(--c-fg-mute)]">
                        NO ACTIVE WEB DEVELOPMENT PROJECTS YET.
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                      <Calendar size={16} /> Web Events
                    </h3>
                    {webEvents.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {webEvents.map(event => (
                          <EventCard key={event._id || event.id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 border border-dashed border-[var(--c-border)] rounded-2xl text-center font-mono text-xs text-[var(--c-fg-mute)]">
                        NO DIRECT WEB DEVELOPMENT EVENTS LISTED YET.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Team Members */}
                <div className="lg:col-span-1">
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                    <User size={16} /> Team Members
                  </h3>
                  <div className="flex flex-col gap-3">
                    {webMembers.map(member => (
                      <MemberCard key={member._id || member.id} member={member} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Subsection: DSA */}
            <div className="border-t border-[var(--c-border)] pt-10">
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-2 text-[var(--c-fg)]">
                Data Structures & Algorithms (DSA)
              </h2>
              <p className="font-grotesk text-xs md:text-sm text-[var(--c-fg-soft)] mb-8 max-w-2xl">
                Fostering algorithmic thinking, data modeling logic, optimization methods, and training for competitive coding platforms.
              </p>

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left/Middle: Activities & Events */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                  <div>
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                      <Award size={16} /> Activities
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {dsaActivities.map((act, i) => (
                        <div key={i} className="p-4 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] flex flex-col gap-1.5 hover:border-[var(--c-mint)]/40 transition-colors">
                          <span className="font-mono text-[9px] tracking-widest text-[var(--c-fg-mute)] uppercase">DSA Activity</span>
                          <h4 className="font-display font-semibold text-sm text-[var(--c-fg)]">{act.title}</h4>
                          <p className="font-grotesk text-xs text-[var(--c-fg-soft)] leading-relaxed">{act.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                      <Calendar size={16} /> DSA Events
                    </h3>
                    {dsaEvents.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {dsaEvents.map(event => (
                          <EventCard key={event._id || event.id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 border border-dashed border-[var(--c-border)] rounded-2xl text-center font-mono text-xs text-[var(--c-fg-mute)]">
                        NO DIRECT DSA EVENTS LISTED YET.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Team Members */}
                <div className="lg:col-span-1">
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                    <User size={16} /> Team Members
                  </h3>
                  <div className="flex flex-col gap-3">
                    {dsaMembers.map(member => (
                      <MemberCard key={member._id || member.id} member={member} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Subsection: Data Science */}
            <div className="border-t border-[var(--c-border)] pt-10">
              <h2 className="font-display font-bold text-2xl md:text-3xl mb-2 text-[var(--c-fg)]">
                Data Science
              </h2>
              <p className="font-grotesk text-xs md:text-sm text-[var(--c-fg-soft)] mb-8 max-w-2xl">
                Extracting valuable analytics, model training, artificial intelligence, and engineering complex predictive systems.
              </p>

              <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left/Middle: Projects & Events */}
                <div className="lg:col-span-2 flex flex-col gap-8">
                  <div>
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                      <Code size={16} /> Data Science Projects
                    </h3>
                    {dsProjects.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {dsProjects.map(project => (
                          <ProjectCard key={project._id || project.id} project={project} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 border border-dashed border-[var(--c-border)] rounded-2xl text-center font-mono text-xs text-[var(--c-fg-mute)]">
                        NO ACTIVE DATA SCIENCE PROJECTS YET.
                      </div>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                      <Calendar size={16} /> Data Science Events
                    </h3>
                    {dsEvents.length > 0 ? (
                      <div className="grid gap-6 sm:grid-cols-2">
                        {dsEvents.map(event => (
                          <EventCard key={event._id || event.id} event={event} />
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 border border-dashed border-[var(--c-border)] rounded-2xl text-center font-mono text-xs text-[var(--c-fg-mute)]">
                        NO DIRECT DATA SCIENCE EVENTS LISTED YET.
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Activities */}
                <div className="lg:col-span-1">
                  <h3 className="font-display font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color: accentColor }}>
                    <Award size={16} /> Subdomain Activities
                  </h3>
                  <div className="flex flex-col gap-3">
                    {dsActivities.map((act, i) => (
                      <div key={i} className="p-4 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] flex flex-col gap-1 hover:border-[var(--c-electric)]/40 transition-colors">
                        <h4 className="font-display font-semibold text-xs text-[var(--c-fg)]">{act.title}</h4>
                        <p className="font-grotesk text-[11px] text-[var(--c-fg-soft)] leading-normal">{act.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8 items-start">

            {/* Left / Middle: Projects & Events */}
            <div className="lg:col-span-2 flex flex-col gap-10">

              {/* Projects Section */}
              <div>
                <h2 className="font-display font-semibold text-xl md:text-2xl mb-6 flex items-center gap-2 border-b border-[var(--c-border)] pb-3" style={{ color: 'var(--c-fg)' }}>
                  <Code size={20} style={{ color: accentColor }} />
                  Domain Projects
                </h2>

                {domainProjects.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {domainProjects.map(project => (
                      <ProjectCard key={project._id || project.id} project={project} />
                    ))}
                  </div>
                ) : (
                  <div className="py-10 border border-dashed border-[var(--c-border)] rounded-2xl text-center">
                    <p className="font-mono text-xs text-[var(--c-fg-mute)]">NO DEDICATED PROJECTS YET.</p>
                  </div>
                )}
              </div>

              {/* Events Section */}
              <div>
                <h2 className="font-display font-semibold text-xl md:text-2xl mb-6 flex items-center gap-2 border-b border-[var(--c-border)] pb-3" style={{ color: 'var(--c-fg)' }}>
                  <Calendar size={20} style={{ color: accentColor }} />
                  Events Organized
                </h2>

                {domainEvents.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {domainEvents.map(event => (
                      <EventCard key={event._id || event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="py-10 border border-dashed border-[var(--c-border)] rounded-2xl text-center">
                    <p className="font-mono text-xs text-[var(--c-fg-mute)]">NO DIRECT EVENTS ASSOCIATED YET.</p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Lead & Members */}
            <div className="lg:col-span-1 flex flex-col gap-8">

              {/* Domain Lead */}
              {lead ? (
                <div>
                  <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--c-fg)' }}>
                    <Award size={18} style={{ color: accentColor }} />
                    Domain Lead
                  </h3>
                  <MemberCard member={lead} />
                </div>
              ) : (
                leadName && (
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2" style={{ color: 'var(--c-fg)' }}>
                      <Award size={18} style={{ color: accentColor }} />
                      Domain Lead
                    </h3>
                    <div className="p-4 rounded-xl border border-[var(--c-border)] bg-[var(--c-surface)] text-center font-grotesk text-sm">
                      Lead: {leadName.replace(/_/g, ' ')}
                    </div>
                  </div>
                )
              )}

              {/* Other Members */}
              <div>
                <h3 className="font-display font-semibold text-lg mb-4 flex items-center gap-2 border-b border-[var(--c-border)] pb-2" style={{ color: 'var(--c-fg)' }}>
                  <User size={18} style={{ color: accentColor }} />
                  Sub-team Members
                </h3>

                {teamMembers.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {teamMembers.map(member => (
                      <div
                        key={member._id || member.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-[var(--c-border)]"
                        style={{ background: 'var(--c-surface)' }}
                      >
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs" style={{ background: 'var(--c-surface-2)', color: 'var(--c-mint)', border: '1px solid var(--c-border)' }}>
                          {member.name ? member.name.replace(/_/g, ' ').split(' ').map(n => n[0]).join('').toUpperCase() : 'CC'}
                        </div>
                        <div>
                          <p className="font-grotesk text-sm font-semibold" style={{ color: 'var(--c-fg)' }}>
                            {member.name ? member.name.replace(/_/g, ' ') : ''}
                          </p>
                          <p className="font-mono text-[9px] uppercase" style={{ color: 'var(--c-fg-mute)' }}>
                            {member.role ? member.role.replace(/_/g, ' ') : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-mono text-xs text-[var(--c-fg-mute)] italic">No additional members listed.</p>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );

  function techDomainNames() {
    return ['tech', 'Web_Development', 'DSA', 'Data_Science', 'Tech_Team'];
  }
}
