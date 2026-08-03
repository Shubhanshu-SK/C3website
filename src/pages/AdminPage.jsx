import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, LogOut, LayoutDashboard,
  Calendar, Briefcase, ClipboardList, Download,
} from 'lucide-react';
import { loginAdmin } from '../services/authService';
import { getEvents, deleteEvent } from '../services/eventService';
import { getProjects, deleteProject } from '../services/projectService';
import AdminRegistrations from '../components/AdminRegistrations';

const TOKEN_KEY = 'c3_admin_token';

// ── Login Screen ──────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      const { token } = await loginAdmin(username, password);
      localStorage.setItem(TOKEN_KEY, token);
      onLogin();
    } catch (ex) {
      setErr(ex.message);
    } finally { setLoading(false); }
  };

  return (
    <section className="section-pad sec-b min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-[var(--c-border)] p-8"
        style={{ background: 'var(--c-surface)' }}
      >
        <div className="mb-8 text-center">
          <span className="eyebrow justify-center">Admin Access</span>
          <h2 className="section-heading text-2xl mt-1">
            C-Cell <span className="text-gradient-mint">Control Panel</span>
          </h2>
          <p className="font-mono text-[10px] text-[var(--c-fg-mute)] mt-1">Restricted — authorised personnel only</p>
        </div>
        <form onSubmit={submit} className="flex flex-col gap-4">
          {[
            { label: 'Username', key: 'username', val: username, set: setUsername, type: 'text' },
            { label: 'Password', key: 'password', val: password, set: setPassword, type: 'password' },
          ].map(f => (
            <div key={f.key}>
              <label className="block font-mono text-[9px] uppercase tracking-wider text-[var(--c-fg-mute)] mb-1">{f.label}</label>
              <input
                type={f.type} required autoComplete={f.key}
                value={f.val} onChange={e => f.set(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-border)] text-sm font-mono focus:border-[var(--c-mint)] outline-none"
              />
            </div>
          ))}
          {err && <p className="text-red-400 font-mono text-[10px]">⚠ {err}</p>}
          <button
            type="submit" disabled={loading}
            className="mt-2 py-3 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: 'var(--c-mint)', color: 'var(--c-ink)' }}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </motion.div>
    </section>
  );
}

// ── Main Dashboard ────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive active tab from URL path; default to 'events'
  const pathTab = location.pathname.startsWith('/admin/registrations')
    ? 'registrations'
    : location.pathname.startsWith('/admin/projects')
      ? 'projects'
      : 'events';

  const [tab, setTab] = useState(pathTab);

  const [events, setEvents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  useEffect(() => {
    setLoading(true);
    Promise.all([getEvents(), getProjects()])
      .then(([ev, pr]) => {
        setEvents(ev);
        setProjects(pr);
      })
      .catch(() => notify('Failed to load data from server.'))
      .finally(() => setLoading(false));
  }, []);

  // Keep tab in sync if user uses browser back/forward
  useEffect(() => {
    setTab(pathTab);
  }, [pathTab]);

  const switchTab = (t) => {
    setTab(t);
    if (t === 'events') navigate('/admin');
    else if (t === 'projects') navigate('/admin');
    else navigate('/admin/registrations');
  };

  const handleDeleteEvent = async (id, label) => {
    if (!window.confirm(`Delete "${label}"?`)) return;
    try {
      await deleteEvent(id);
      setEvents(p => p.filter(e => e._id !== id));
      notify(`Deleted "${label}"`);
    } catch (ex) { notify(`Error: ${ex.message}`); }
  };

  const handleDeleteProject = async (id, label) => {
    if (!window.confirm(`Delete "${label}"?`)) return;
    try {
      await deleteProject(id);
      setProjects(p => p.filter(pr => pr._id !== id));
      notify(`Deleted "${label}"`);
    } catch (ex) { notify(`Error: ${ex.message}`); }
  };

  const TABS = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'registrations', label: 'Registrations', icon: ClipboardList },
  ];

  return (
    <section className="section-pad sec-b min-h-screen pt-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 right-5 z-[100] px-5 py-3 rounded-xl border border-[var(--c-mint)] font-mono text-xs font-semibold shadow-lg"
              style={{ background: 'var(--c-surface)', color: 'var(--c-mint)' }}>
              ✓ {toast}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-b border-[var(--c-border)] pb-6">
          <div>
            <span className="eyebrow flex items-center gap-1"><LayoutDashboard size={12} /> Admin Panel</span>
            <h2 className="section-heading text-2xl md:text-3xl mt-1">C-Cell <span className="text-gradient-mint">Control Panel</span></h2>
          </div>
          <div className="flex gap-3 flex-wrap">
            {tab !== 'registrations' && (
              <button
                onClick={() => navigate(tab === 'events' ? '/admin/events/create' : '/admin/projects/create')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all"
                style={{ background: 'var(--c-mint)', color: 'var(--c-ink)' }}
              >
                <Plus size={14} /> Add {tab === 'events' ? 'Event' : 'Project'}
              </button>
            )}

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider border border-[var(--c-border)] hover:bg-[var(--c-surface-2)] transition-all"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(t => {
            const Icon = t.icon; const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => switchTab(t.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-grotesk border transition-all"
                style={{
                  background: active ? 'var(--c-surface-2)' : 'var(--c-surface)',
                  color: active ? 'var(--c-mint)' : 'var(--c-fg-soft)',
                  borderColor: active ? 'var(--c-mint)' : 'var(--c-border)',
                  fontWeight: active ? 700 : 500,
                }}>
                <Icon size={13} style={{ color: active ? 'var(--c-mint)' : 'var(--c-fg-mute)' }} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-16 font-mono text-xs" style={{ color: 'var(--c-mint)' }}>
            LOADING DATA FROM MONGODB ATLAS...
          </div>
        ) : tab === 'registrations' ? (
          <AdminRegistrations
            events={events}
            notify={notify}
          />
        ) : (
          /* ── Events / Projects table ── */
          <div className="rounded-2xl border border-[var(--c-border)] overflow-hidden" style={{ background: 'var(--c-surface)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[var(--c-border)]" style={{ background: 'var(--c-surface-2)' }}>
                    {tab === 'events' && ['Title', 'Date', 'Venue', 'Presenter', 'Status', 'Actions'].map(h => (
                      <th key={h} className="p-4 text-[var(--c-fg-mute)]">{h}</th>
                    ))}
                    {tab === 'projects' && ['Title', 'Domain', 'Contributors', 'Tech Stack', 'Actions'].map(h => (
                      <th key={h} className="p-4 text-[var(--c-fg-mute)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--c-border)]">
                  {tab === 'events' && events.map(ev => (
                    <tr key={ev._id} className="hover:bg-[var(--c-surface-2)]/40">
                      <td className="p-4 font-semibold text-[var(--c-fg)] max-w-[140px] truncate">{ev.title?.replace(/_/g, ' ')}</td>
                      <td className="p-4 text-[var(--c-fg-soft)] whitespace-nowrap">{ev.date} {ev.time}</td>
                      <td className="p-4 text-[var(--c-fg-soft)] max-w-[120px] truncate">{ev.venue?.replace(/_/g, ' ')}</td>
                      <td className="p-4 text-[var(--c-fg-soft)] max-w-[120px] truncate">{ev.presenter?.replace(/_/g, ' ')}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full text-[9px] border uppercase"
                          style={{
                            color: ev.status === 'upcoming' ? 'var(--c-mint)' : ev.status === 'ongoing' ? 'var(--c-electric)' : 'var(--c-fg-mute)',
                            borderColor: ev.status === 'upcoming' ? 'var(--c-mint)' : ev.status === 'ongoing' ? 'var(--c-electric)' : 'var(--c-border)',
                          }}>
                          {ev.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/events/edit/${ev._id}`)}
                            className="p-1.5 rounded hover:bg-[var(--c-border)] text-[var(--c-electric)]"
                            title="Edit event"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev._id, ev.title)}
                            className="p-1.5 rounded hover:bg-[var(--c-border)] text-red-400"
                            title="Delete event"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {tab === 'projects' && projects.map(pr => (
                    <tr key={pr._id} className="hover:bg-[var(--c-surface-2)]/40">
                      <td className="p-4 font-semibold text-[var(--c-fg)] max-w-[140px] truncate">{pr.title?.replace(/_/g, ' ')}</td>
                      <td className="p-4 text-[var(--c-electric)] max-w-[100px] truncate">{pr.domain?.replace(/_/g, ' ')}</td>
                      <td className="p-4 text-[var(--c-fg-soft)] max-w-[140px] truncate">{(pr.contributors || []).map(c => c.replace(/_/g, ' ')).join(', ')}</td>
                      <td className="p-4 text-[var(--c-fg-soft)] max-w-[140px] truncate">{(pr.technology || []).map(t => t.replace(/_/g, ' ')).join(', ')}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/admin/projects/edit/${pr._id}`)}
                            className="p-1.5 rounded hover:bg-[var(--c-border)] text-[var(--c-electric)]"
                            title="Edit project"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(pr._id, pr.title)}
                            className="p-1.5 rounded hover:bg-[var(--c-border)] text-red-400"
                            title="Delete project"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(!!localStorage.getItem(TOKEN_KEY));

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  return <Dashboard onLogout={logout} />;
}
