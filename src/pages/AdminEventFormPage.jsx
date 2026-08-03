import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { getEvents, addEvent, updateEvent } from '../services/eventService';

const TOKEN_KEY = 'c3_admin_token';

/* ── Domain options (display values; controller converts to storage) ── */
const DOMAIN_OPTIONS = [
  { group: 'Tech Team', opts: ['Tech Team', 'Web Development', 'DSA', 'Data Science'] },
  { group: 'Other Domains', opts: ['Operation and Management', 'PR and Outreach', 'Media and Content Writing', 'Graphic Designing'] },
];

/* ── Shared field component ── */
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

export default function AdminEventFormPage() {
  const { id } = useParams(); // present only on edit route
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) navigate('/admin');
  }, [navigate]);

  const [form, setForm] = useState({
    title: '', description: '', date: '', time: '',
    venue: '', presenter: '', status: 'upcoming',
    image: '', registrationLink: '', domain: 'Web Development',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Load event for editing
  useEffect(() => {
    if (!isEdit) return;
    getEvents().then((events) => {
      const ev = events.find((e) => e._id === id);
      if (!ev) { setError('Event not found.'); return; }
      setForm({
        title: ev.title || '',
        description: ev.description || '',
        date: ev.date || '',
        time: ev.time || '',
        venue: ev.venue ? ev.venue.replace(/_/g, ' ') : '',
        presenter: ev.presenter ? ev.presenter.replace(/_/g, ' ') : '',
        status: ev.status || 'upcoming',
        image: ev.image || '',
        registrationLink: ev.registrationLink || '',
        domain: ev.domain ? ev.domain.replace(/_/g, ' ') : 'Web Development',
      });
    }).catch(() => setError('Failed to load event.'));
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
      // Spaces → underscores for category fields handled by server-side formatHelper
      const payload = { ...form };
      if (isEdit) {
        await updateEvent(id, payload);
        notify('Event updated!');
      } else {
        await addEvent(payload);
        notify('Event created!');
      }
      setTimeout(() => navigate('/admin'), 1200);
    } catch (ex) {
      setError(ex.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section-pad sec-b min-h-screen pt-28">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">

        {/* Toast */}
        {toast && (
          <div
            className="fixed top-24 right-5 z-[100] px-5 py-3 rounded-xl border font-mono text-xs font-semibold shadow-lg"
            style={{ background: 'var(--c-surface)', color: 'var(--c-mint)', borderColor: 'var(--c-mint)' }}
          >
            ✓ {toast}
          </div>
        )}

        {/* Back */}
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-wider uppercase mb-6 hover:text-[var(--c-mint)] transition-colors"
          style={{ color: 'var(--c-fg-soft)' }}
        >
          <ArrowLeft size={14} /> Back to Admin
        </Link>

        {/* Header */}
        <div className="mb-8 border-b border-[var(--c-border)] pb-6">
          <span className="eyebrow">{isEdit ? 'Edit' : 'New'} Event</span>
          <h2 className="section-heading text-2xl md:text-3xl mt-1">
            {isEdit ? 'Edit ' : 'Create '}
            <span className="text-gradient-mint">Event</span>
          </h2>
        </div>

        {/* Form */}
        <div
          className="rounded-2xl border border-[var(--c-border)] p-6"
          style={{ background: 'var(--c-surface)' }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label="Title *" required value={form.title} onChange={f('title')} />
            <Field label="Description" rows={3} value={form.description} onChange={f('description')} />

            <div className="grid grid-cols-2 gap-3">
              <Field label="Date *" type="date" required value={form.date} onChange={f('date')} />
              <Field label="Time" type="time" value={form.time} onChange={f('time')} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Venue" value={form.venue} onChange={f('venue')} />
              <Field label="Presenter" value={form.presenter} onChange={f('presenter')} />
            </div>

            {/* Status */}
            <div>
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[var(--c-fg-mute)] mb-1">Status</label>
              <select
                value={form.status} onChange={f('status')}
                className="w-full px-3 py-2 rounded-lg border border-[var(--c-border)] text-xs font-mono focus:border-[var(--c-mint)] outline-none"
                style={{ color: 'white', background: 'var(--c-mint-hard)' }}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>

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
            <Field label="Registration Link (leave blank to use built-in form)" type="url" value={form.registrationLink} onChange={f('registrationLink')} />

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

            {error && (
              <p className="font-mono text-[10px] text-red-400">⚠ {error}</p>
            )}

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
                {saving ? 'Saving…' : isEdit ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
}
