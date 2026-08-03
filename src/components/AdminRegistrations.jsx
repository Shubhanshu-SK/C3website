import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, Search, Download, Trash2, AlertCircle, X, ClipboardList, Loader2,
} from 'lucide-react';
import {
  getRegistrationsForEvent,
  downloadRegistrationsCSV,
  deleteEventRegistrations,
  deleteRegistration,
} from '../services/registrationService';

/* ── colour tokens (dark, data-dense theme) ────────────────── */
const T = {
  bg: '#0f1117',
  surface: '#1a1d27',
  border: '#2a2d3e',
  accent: '#6366f1',
  fg: '#e2e8f0',
  muted: '#64748b',
  danger: '#ef4444',
  success: '#22c55e',
};

/* ── Typed Confirmation Modal ─────────────────────────────────── */
function DeleteAllModal({ eventTitle, onCancel, onConfirm, loading }) {
  const [typed, setTyped] = useState('');
  const matches = typed === eventTitle;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md rounded-xl border p-6 z-10"
        style={{ background: T.surface, borderColor: T.border }}
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded border transition-colors hover:opacity-80"
          style={{ borderColor: T.border, color: T.muted }}
        ><X size={14} /></button>

        <div className="flex items-start gap-3 mb-5">
          <div className="p-2 rounded mt-0.5" style={{ background: 'rgba(239,68,68,0.12)', color: T.danger }}>
            <AlertCircle size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-1" style={{ color: T.fg }}>Delete All Registrations</h3>
            <p className="text-xs leading-relaxed" style={{ color: T.muted }}>
              This permanently removes all registration data for this event from MongoDB.
              The event itself is not deleted. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="mb-5">
          <label className="block font-mono text-[9px] uppercase tracking-wider mb-2" style={{ color: T.muted }}>
            Type the event title to confirm:&nbsp;
            <span className="font-semibold" style={{ color: T.danger }}>{eventTitle}</span>
          </label>
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder="Type exact event title…"
            className="w-full px-3 py-2.5 rounded-lg text-sm font-mono outline-none transition-colors"
            style={{
              background: T.bg,
              border: `1px solid ${typed ? (matches ? T.success : 'rgba(239,68,68,0.5)') : T.border}`,
              color: T.fg,
            }}
            autoFocus
          />
        </div>

        <div className="flex gap-3 justify-end border-t pt-4" style={{ borderColor: T.border }}>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-xs border transition-colors hover:opacity-80"
            style={{ borderColor: T.border, color: T.muted }}
          >Cancel</button>
          <button
            onClick={onConfirm}
            disabled={!matches || loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider disabled:opacity-40 transition-all"
            style={{ background: T.danger, color: '#fff' }}
          >
            {loading && <Loader2 size={12} className="animate-spin" />}
            {loading ? 'Deleting…' : 'Delete All'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Registrations Table ─────────────────────────────────────── */
function RegTable({ rows, onDeleteRow, deleting }) {
  if (rows.length === 0) {
    return (
      <div className="p-12 text-center">
        <ClipboardList size={28} className="mx-auto mb-3" style={{ color: T.muted }} />
        <p className="font-mono text-xs" style={{ color: T.muted }}>No registrations found.</p>
      </div>
    );
  }

  const cols = ['#', 'Name', 'Email', 'Enroll No', 'Phone', 'Institute', 'Branch', 'Source', 'Registered', ''];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse" style={{ fontFamily: 'monospace', fontSize: '11px' }}>
        <thead>
          <tr style={{ background: T.bg, borderBottom: `1px solid ${T.border}` }}>
            {cols.map((h) => (
              <th key={h} className="px-3 py-2.5 whitespace-nowrap" style={{ color: T.muted }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r._id}
              style={{ borderBottom: `1px solid ${T.border}` }}
              className="transition-colors"
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <td className="px-3 py-2" style={{ color: T.muted }}>{i + 1}</td>
              <td className="px-3 py-2 max-w-[130px] truncate font-semibold" style={{ color: T.fg }}>{r.fullName}</td>
              <td className="px-3 py-2 max-w-[160px] truncate" style={{ color: T.muted }}>{r.email}</td>
              <td className="px-3 py-2 whitespace-nowrap font-semibold" style={{ color: T.accent }}>{r.enrollmentNo}</td>
              <td className="px-3 py-2 whitespace-nowrap" style={{ color: T.muted }}>{r.phone || '—'}</td>
              <td className="px-3 py-2" style={{ color: T.muted }}>{r.institute}</td>
              <td className="px-3 py-2" style={{ color: T.muted }}>{r.branch}</td>
              <td className="px-3 py-2 max-w-[100px] truncate" style={{ color: T.muted }}>{r.source || '—'}</td>
              <td className="px-3 py-2 whitespace-nowrap" style={{ color: T.muted }}>
                {r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : '—'}
              </td>
              <td className="px-3 py-2">
                <button
                  onClick={() => onDeleteRow(r._id)}
                  disabled={deleting === r._id}
                  className="p-1.5 rounded transition-colors hover:opacity-80 disabled:opacity-40"
                  style={{ color: T.danger }}
                  title="Delete registration"
                >
                  {deleting === r._id
                    ? <Loader2 size={12} className="animate-spin" />
                    : <Trash2 size={12} />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ── Main AdminRegistrations Component ─────────────────────────── */
export default function AdminRegistrations({ events, notify }) {
  const [selectedEventId, setSelectedEventId] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);
  const [deletingRow, setDeletingRow] = useState(null);
  const [csvLoading, setCsvLoading] = useState(false);
  const [fetchErr, setFetchErr] = useState('');

  const selectedEvent = events.find((e) => e._id === selectedEventId);

  // Load registrations when event changes
  useEffect(() => {
    if (!selectedEventId) {
      setRegistrations([]);
      setFetchErr('');
      return;
    }
    setLoadingRegs(true);
    setFetchErr('');
    getRegistrationsForEvent(selectedEventId)
      .then((data) => setRegistrations(data.registrations || []))
      .catch((err) => setFetchErr(err.message))
      .finally(() => setLoadingRegs(false));
  }, [selectedEventId]);

  // Client-side search filter
  const filtered = useMemo(() => {
    if (!search.trim()) return registrations;
    const q = search.trim().toLowerCase();
    return registrations.filter((r) => (r.fullName || '').toLowerCase().includes(q));
  }, [registrations, search]);

  const handleDeleteRow = async (registrationId) => {
    if (!window.confirm('Remove this registration? This cannot be undone.')) return;
    setDeletingRow(registrationId);
    try {
      await deleteRegistration(registrationId);
      setRegistrations((prev) => prev.filter((r) => r._id !== registrationId));
      notify('Registration deleted.');
    } catch (ex) {
      notify(`Error: ${ex.message}`);
    } finally {
      setDeletingRow(null);
    }
  };

  const handleConfirmDeleteAll = async () => {
    setDeletingAll(true);
    try {
      await deleteEventRegistrations(selectedEventId);
      setRegistrations([]);
      notify(`All registrations for "${selectedEvent?.title}" deleted.`);
      setShowDeleteModal(false);
    } catch (ex) {
      notify(`Error: ${ex.message}`);
    } finally {
      setDeletingAll(false);
    }
  };

  const handleDownloadCSV = () => {
    if (!selectedEventId) return;
    setCsvLoading(true);
    try {
      downloadRegistrationsCSV(selectedEventId);
    } finally {
      setTimeout(() => setCsvLoading(false), 1500);
    }
  };

  const eventTitle = selectedEvent?.title?.replace(/_/g, ' ') || '';

  return (
    <div className="flex flex-col gap-5" style={{ color: T.fg }}>

      {/* ── Event Selector & Actions ────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 items-start sm:items-center p-4 rounded-xl border"
        style={{ background: T.surface, borderColor: T.border }}
      >
        {/* Dropdown */}
        <div className="relative flex-1 max-w-xs">
          <select
            value={selectedEventId}
            onChange={(e) => { setSelectedEventId(e.target.value); setSearch(''); }}
            className="w-full appearance-none px-3 py-2 pr-8 rounded-lg text-xs font-mono border outline-none transition-colors"
            style={{ background: T.bg, borderColor: T.border, color: selectedEventId ? T.fg : T.muted }}
          >
            <option value="">— Select an event —</option>
            {events.map((ev) => (
              <option key={ev._id} value={ev._id}>
                {ev.title?.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: T.muted }} />
        </div>

        {/* Action Buttons */}
        {selectedEventId && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleDownloadCSV}
              disabled={csvLoading || registrations.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:opacity-80 disabled:opacity-40"
              style={{ borderColor: T.accent, color: T.accent, background: 'rgba(99,102,241,0.08)' }}
            >
              {csvLoading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
              Download CSV
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={registrations.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:opacity-80 disabled:opacity-40"
              style={{ borderColor: 'rgba(239,68,68,0.4)', color: T.danger, background: 'rgba(239,68,68,0.08)' }}
            >
              <Trash2 size={12} />
              Delete All
            </button>
          </div>
        )}
      </div>

      {/* ── Search + Count ──────────────────────────────── */}
      {selectedEventId && !loadingRegs && !fetchErr && (
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-xs">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.muted }} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name…"
              className="w-full pl-8 pr-3 py-2 rounded-lg text-xs font-mono border outline-none transition-colors"
              style={{ background: T.surface, borderColor: T.border, color: T.fg }}
            />
          </div>
          <span className="font-mono text-[10px] px-3 py-1.5 rounded-full border" style={{ color: T.accent, borderColor: T.accent, background: 'rgba(99,102,241,0.08)' }}>
            {filtered.length} registration{filtered.length !== 1 ? 's' : ''}{search ? ' found' : ' total'}
          </span>
        </div>
      )}

      {/* ── Table ──────────────────────────────────────── */}
      <div className="rounded-xl border overflow-hidden" style={{ background: T.surface, borderColor: T.border }}>
        {!selectedEventId ? (
          <div className="p-16 text-center">
            <ClipboardList size={32} className="mx-auto mb-3" style={{ color: T.muted }} />
            <p className="font-mono text-xs" style={{ color: T.muted }}>Select an event to view registrations.</p>
          </div>
        ) : loadingRegs ? (
          <div className="p-12 text-center">
            <Loader2 size={24} className="mx-auto mb-3 animate-spin" style={{ color: T.accent }} />
            <p className="font-mono text-xs" style={{ color: T.muted }}>Loading registrations…</p>
          </div>
        ) : fetchErr ? (
          <div className="p-12 text-center">
            <AlertCircle size={24} className="mx-auto mb-3" style={{ color: T.danger }} />
            <p className="font-mono text-xs" style={{ color: T.danger }}>{fetchErr}</p>
          </div>
        ) : (
          <RegTable rows={filtered} onDeleteRow={handleDeleteRow} deleting={deletingRow} />
        )}
      </div>

      {/* ── Delete-All Modal ────────────────────────────── */}
      <AnimatePresence>
        {showDeleteModal && selectedEvent && (
          <DeleteAllModal
            eventTitle={eventTitle}
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDeleteAll}
            loading={deletingAll}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
