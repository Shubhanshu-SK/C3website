import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import { useTheme } from '../context/ThemeContext';
import { getProjects } from '../services/projectService';

const PROJECT_FILTERS = [
  { label: 'All Projects', value: 'all' },
  { label: 'Web Dev', value: 'Web_Development' },
  { label: 'DSA / CP', value: 'DSA' },
  { label: 'Data Science', value: 'Data_Science' },
  { label: 'Operations', value: 'Operation_and_Management' },
  { label: 'Design', value: 'Graphic_Designing' }
];

export default function ProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState('all');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects()
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching projects:', err);
        setProjects([]);
        setLoading(false);
      });
  }, []);

  const filteredProjects = filter === 'all'
    ? projects
    : projects.filter(p => {
      if (!p.domain) return false;
      // Normalize space vs underscores
      const pDom = p.domain.toLowerCase().replace(/_/g, ' ');
      const fDom = filter.toLowerCase().replace(/_/g, ' ');
      return pDom === fDom;
    });

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
          <span className="eyebrow">Project Showcase</span>
          <h2 className="section-heading mb-4">
            Projects Built By C-Cell
          </h2>
          <p className="font-grotesk text-base md:text-lg body-text-width text-[var(--c-fg-soft)]">
            Explore the tooling, applications, research models, and creative assets designed by the community.
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {PROJECT_FILTERS.map(f => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-grotesk border transition-all"
                style={{
                  background: active ? (isDark ? '#4af0a0' : '#0d9e5c') : 'var(--c-surface-2)',
                  color: active ? (isDark ? '#080b10' : '#ffffff') : 'var(--c-fg)',
                  borderColor: active ? (isDark ? '#4af0a0' : '#0d9e5c') : 'var(--c-border)',
                  boxShadow: active ? `0 2px 10px ${isDark ? 'rgba(74,240,160,0.22)' : 'rgba(13,158,92,0.20)'}` : 'none',
                  fontWeight: active ? 700 : 500,
                  transform: active ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-16 font-mono text-xs tracking-wider" style={{ color: 'var(--c-crimson)' }}>
            LOADING_COMMUNITY_PROJECTS...
          </div>
        ) : filteredProjects.length > 0 ? (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  layout
                  key={project._id || project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <ProjectCard project={project} />
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
              NO SHOWCASE PROJECTS IN THIS DOMAIN CURRENTLY.
            </p>
          </motion.div>
        )}

      </div>
    </section>
  );
}
