import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getProjects, addProject, updateProject } from '../services/projectService';

const TOKEN_KEY = 'c3_admin_token';

const DOMAIN_OPTIONS = [
  { group: 'Tech Team', opts: ['Tech Team', 'Web Development', 'DSA', 'Data Science'] },
  { group: 'Other Domains', opts: ['Operation and Management', 'PR and Outreach', 'Media and Content Writing', 'Graphic Designing'] },
];

const Field = ({ label, value, onChange, type = 'text', required, rows }) => (
  <div>
    <label className="block font-mono text-[9px] uppercase tracking-wider text-[var(--c-fg-mute)] mb-1">{label}</label>
    {rows ? (
      <textarea
        required={required} rows={rows} value={value} onChange={onChange}
        className="w-full px-3 py-2 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-border)] text-xs font-mono focus:border-[var(--c-mint)] outline-none"
        style={{ color: 'var(--c-fg)' }}
      />
    ) : (
      <input
        type={type} required={required} value={value} onChange={onChange}
        className="w-full px-3 py-2 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-border)] text-xs font-mono focus:border-[var(--c-mint)] outline-none"
        style={{ color: 'var(--c-fg)' }}
      />
    )}
  </div>
);

export default function AdminProjectFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) navigate('/admin');
  }, [navigate]);

  const [form, setForm] = useState({
    title: '', description: '', image: '',
    domain: 'Web Development', contributors: '', technology: '',
    github: '', demo: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Load project for editing
  useEffect(() => {
    if (!isEdit) return;
    getProjects().then((projects) => {
      const pr = projects.find((p) => p._id === id);
      if (!pr) { setError('Project not found.'); return; }
      setForm({
        title: pr.title || '',
        description: pr.description || '',
        image: pr.image || '',
        domain: pr.domain ? pr.domain.replace(/_/g, ' ') : 'Web Development',
        // Display contributors and technology with underscores replaced by spaces
        contributors: (pr.contributors || []).map((c) => c.replace(/_/g, ' ')).join(', '),
        technology: (pr.technology || []).map((t) => t.replace(/_/g, ' ')).join(', '),
        github: pr.github || '',
        demo: pr.demo || '',
      });
    }).catch(() => setError('Failed to load project.'));
  }, [id, isEdit]);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openCloudinaryWidget = (onSuccess) => {
    if (window.cloudinary) {
      window.cloudinary.openUploadWidget(
        {
          cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
          uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'url', 'camera'],
          multiple: false,
          resourceType: 'image',
        },
        (error, result) => {
          if (!error && result.event === 'success') {
            onSuccess(result.info.secure_url);
          }
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Split comma-separated arrays; server-side formatHelper converts spaces → underscores
      const payload = {
        ...form,
        contributors: form.contributors ? form.contributors.split(',').map((s) => s.trim()).filter(Boolean) : [],
        technology: form.technology ? form.technology.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };
      if (isEdit) {
        await updateProject(id, payload);
        notify('Project updated!');
      } else {
        await addProject(payload);
        notify('Project created!');
      }
      setTimeout(() => navigate('/admin'), 1200);
    } catch (ex) {
      setError(ex.message || 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section-pad sec-b min-h-screen pt-28">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">

        {toast && (
          <div
            className="fixed top-24 right-5 z-[100] px-5 py-3 rounded-xl border font-mono text-xs font-semibold shadow-lg"
            style={{ background: 'var(--c-surface)', color: 'var(--c-mint)', borderColor: 'var(--c-mint)' }}
          >
            ✓ {toast}
          </div>
        )}

        <Link
          to="/admin"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase mb-6 hover:text-[var(--c-mint)] transition-colors"
          style={{ color: 'var(--c-fg-soft)' }}
        >
          <ArrowLeft size={14} /> Back to Admin
        </Link>

        <div className="mb-8 border-b border-[var(--c-border)] pb-6">
          <span className="eyebrow">{isEdit ? 'Edit' : 'New'} Project</span>
          <h2 className="section-heading text-2xl md:text-3xl mt-1">
            {isEdit ? 'Edit ' : 'Create '}
            <span className="text-gradient-mint">Project</span>
          </h2>
        </div>

        <div
          className="rounded-2xl border border-[var(--c-border)] p-6"
          style={{ background: 'var(--c-surface)' }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Title *" required value={form.title} onChange={f('title')} />
            <Field label="Description" rows={2} value={form.description} onChange={f('description')} />

            <div>
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[var(--c-fg-mute)] mb-1">Image</label>
              <button
                type="button"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider transition-all hover:scale-105"
                style={{ background: 'var(--c-mint)', color: 'var(--c-ink)' }}
                onClick={() => openCloudinaryWidget((url) => setForm((f) => ({ ...f, image: url })))}
              >
                Upload Image
              </button>
              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ maxWidth: 200, marginTop: 8, borderRadius: 8 }}
                />
              )}
            </div>

            {/* Domain */}
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[var(--c-fg-mute)] mb-1">Domain *</label>
              <select
                required value={form.domain} onChange={f('domain')}
                className="w-full px-3 py-2 rounded-lg border border-[var(--c-border)] text-xs font-mono focus:border-[var(--c-mint)] outline-none"
                style={{ color: 'white', background: 'var(--c-mint-hard)' }}
              >
                {DOMAIN_OPTIONS.map((g) => (
                  <optgroup key={g.group} label={`── ${g.group} ──`}>
                    {g.opts.map((o) => <option key={o} value={o}>{o}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>

            <Field label="Contributors (comma separated)" value={form.contributors} onChange={f('contributors')} />
            <Field label="Technology Stack (comma separated)" value={form.technology} onChange={f('technology')} />

            <div className="grid grid-cols-2 gap-3">
              <Field label="GitHub URL" type="url" value={form.github} onChange={f('github')} />
              <Field label="Demo URL" type="url" value={form.demo} onChange={f('demo')} />
            </div>

            {error && <p className="font-mono text-[10px] text-red-400">⚠ {error}</p>}

            <div className="flex gap-3 justify-end border-t border-[var(--c-border)] pt-4 mt-2">
              <Link
                to="/admin"
                className="px-4 py-2 rounded-xl font-grotesk text-xs border border-[var(--c-border)] hover:bg-[var(--c-surface-2)] transition-colors"
                style={{ color: 'var(--c-fg-soft)' }}
              >
                Cancel
              </Link>
              <button
                type="submit" disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider disabled:opacity-50 transition-all hover:scale-105"
                style={{ background: 'var(--c-mint)', color: 'var(--c-ink)' }}
              >
                <Save size={13} />
                {saving ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
