import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { registerForEvent } from '../services/registrationService';

// ── Branch options per institute ─────────────────────────────
const BRANCHES = {
  UIT: ['CSE', 'EX', 'EC', 'IT', 'MECH', 'AU'],
  SOIT: ['AI/ML', 'CS/BS', 'CS/DS'],
};

// ── Validators ────────────────────────────────────────────────
const NAME_RE = /^[A-Za-z\s]+$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ENROLL_RE = /^[A-Za-z0-9]+$/;
const PHONE_RE = /^[0-9+()#\s-]{7,15}$/;
const SOURCE_MAX = 40;

const validate = ({ fullName, email, enrollmentNo, phoneNumber, institute, branch, source }) => {
  if (!fullName.trim()) return 'Full Name is required.';
  if (!NAME_RE.test(fullName)) return 'Full Name must contain letters and spaces only.';
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_RE.test(email)) return 'Please enter a valid email address.';
  if (!enrollmentNo.trim()) return 'Enrollment Number is required.';
  if (!ENROLL_RE.test(enrollmentNo)) return 'Enrollment Number must be alphanumeric only.';
  if (!phoneNumber.trim()) return 'Phone Number is required.';
  if (!PHONE_RE.test(phoneNumber.trim())) return 'Please enter a valid phone number (7–15 digits).';
  if (!institute) return 'Please select your institute.';
  if (!branch) return 'Please select your branch.';
  if (!source.trim()) return 'Please tell us how you found out about C-Cell.';
  if (source.trim().length > SOURCE_MAX)
    return `Source must be ${SOURCE_MAX} characters or fewer (e.g. "Instagram", "Friend").`;
  return null;
};

// ── Reusable field wrapper ─────────────────────────────────────
const Field = ({ label, children }) => (
  <div>
    <label className="block font-mono text-[9px] uppercase tracking-wider mb-1"
      style={{ color: 'var(--c-fg-mute)' }}>
      {label}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-3 py-2.5 rounded-lg bg-[var(--c-surface-2)] border border-[var(--c-border)] text-sm font-mono focus:border-[var(--c-mint)] outline-none transition-colors";

// ── Main Component ────────────────────────────────────────────
export default function RegistrationModal({ event, onClose, inline = false }) {
  const [form, setForm] = useState({
    fullName: '', email: '', enrollmentNo: '',
    phoneNumber: '', institute: '', branch: '', source: '',
  });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  // Reset branch when institute changes
  useEffect(() => {
    setForm((p) => ({ ...p, branch: '' }));
  }, [form.institute]);

  // Close on Escape
  useEffect(() => {
    if (inline) return undefined;
    const handler = (e) => { if (e.key === 'Escape' && onClose) onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, inline]);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) { setStatus('error'); setMessage(err); return; }

    setStatus('loading');
    setMessage('');
    try {
      const eventId = event._id || event.id;
      await registerForEvent(eventId, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        enrollmentNo: form.enrollmentNo.trim().toUpperCase(),
        phoneNumber: form.phoneNumber.trim(),
        institute: form.institute,
        branch: form.branch,
        source: form.source.trim(),
      });
      setStatus('success');
      setMessage('Registration successful! See you at the event 🎉');
      // setMessage('"Check your email for the registration confirmation (also check spam/promotions)."');
    } catch (ex) {
      setStatus('error');
      setMessage(ex.message || 'Registration failed. Please try again.');
    }
  }

  const eventTitle = event?.title ? event.title.replace(/_/g, ' ') : 'Event';

  const content = (
    <>
      {!inline && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg border border-[var(--c-border)] hover:bg-[var(--c-surface-2)] transition-colors"
          style={{ color: 'var(--c-fg-mute)' }}
          aria-label="Close registration modal"
        >
          <X size={14} />
        </button>
      )}

      {/* Header */}
      <div className="mb-6 border-b border-[var(--c-border)] pb-4">
        <span className="font-mono text-[9px] uppercase tracking-widest block mb-1"
          style={{ color: 'var(--c-mint)' }}>
          Event Registration
        </span>
        <h3 className="font-display font-semibold text-lg leading-tight"
          style={{ color: 'var(--c-fg)' }}>
          {eventTitle}
        </h3>
      </div>

      {/* ── Success State ── */}
      {status === 'success' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-4 py-8"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(74,240,160,0.12)', border: '1px solid rgba(74,240,160,0.3)' }}>
            <CheckCircle size={32} style={{ color: 'var(--c-mint)' }} />
          </div>
          <div>
            <p className="font-display font-semibold text-lg mb-1" style={{ color: 'var(--c-fg)' }}>
              You're Registered!
            </p>
            <p className="font-grotesk text-sm" style={{ color: 'var(--c-fg-soft)' }}>
              {message}
            </p>
          </div>
          {!inline && (
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider hover:scale-105 transition-all"
              style={{ background: 'var(--c-mint)', color: 'var(--c-ink)' }}
            >
              Done
            </button>
          )}
        </motion.div>
      ) : (
        /* ── Form State ── */
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

          {/* Full Name */}
          <Field label="Full Name *">
            <input
              id="reg-fullName"
              type="text" required
              placeholder="e.g. Shubhanshu"
              value={form.fullName} onChange={set('fullName')}
              className={inputCls}
              style={{ color: 'var(--c-fg)' }}
            />
          </Field>

          {/* Email */}
          <Field label="Email ID *">
            <input
              id="reg-email"
              type="email" required
              placeholder="e.g. you@example.com"
              value={form.email} onChange={set('email')}
              className={inputCls}
              style={{ color: 'var(--c-fg)' }}
            />
          </Field>

          {/* Enrollment No + Phone — 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Enrollment Number *">
              <input
                id="reg-enrollment"
                type="text" required
                placeholder="e.g. 0101CS241001"
                value={form.enrollmentNo} onChange={set('enrollmentNo')}
                className={inputCls}
                style={{ color: 'var(--c-fg)' }}
              />
            </Field>
            <Field label="Phone Number *">
              <input
                id="reg-phone"
                type="tel" required
                placeholder="e.g. 9876543210"
                value={form.phoneNumber} onChange={set('phoneNumber')}
                className={inputCls}
                style={{ color: 'var(--c-fg)' }}
              />
            </Field>
          </div>

          {/* Institute */}
          <Field label="Institute *">
            <select
              id="reg-institute"
              required value={form.institute} onChange={set('institute')}
              className={inputCls}
              style={{ color: 'white', background: 'var(--c-mint-hard)' }}
            >
              <option value="" disabled>Select Institute</option>
              <option value="UIT">UIT</option>
              <option value="SOIT">SOIT</option>
            </select>
          </Field>

          {/* Branch — conditional on institute */}
          <Field label="Branch *">
            <select
              id="reg-branch"
              required value={form.branch} onChange={set('branch')}
              disabled={!form.institute}
              className={inputCls}
              style={{ color: 'white', background: 'var(--c-mint-hard)', opacity: form.institute ? 1 : 0.5 }}
            >
              <option value="" disabled>
                {form.institute ? 'Select Branch' : 'Select institute first'}
              </option>
              {(BRANCHES[form.institute] || []).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </Field>

          {/* Source — free text */}
          <Field label="How did you know about C-Cell? *">
            <input
              id="reg-source"
              type="text" required
              placeholder='e.g. Instagram, Friend, College (max 40 chars)'
              maxLength={40}
              value={form.source} onChange={set('source')}
              className={inputCls}
              style={{ color: 'var(--c-fg)' }}
            />
          </Field>

          {/* Error message */}
          <AnimatePresence>
            {status === 'error' && message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex items-start gap-2 px-3 py-2.5 rounded-lg border"
                style={{ background: 'rgba(248,113,113,0.08)', borderColor: 'rgba(248,113,113,0.3)', color: '#f87171' }}
              >
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span className="font-mono text-[10px]">{message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex gap-3 justify-end border-t border-[var(--c-border)] pt-4 mt-1">
            {!inline && (
              <button
                type="button" onClick={onClose}
                className="px-4 py-2 rounded-xl font-grotesk text-xs border border-[var(--c-border)] hover:bg-[var(--c-surface-2)] transition-colors"
                style={{ color: 'var(--c-fg-soft)' }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-grotesk font-bold text-xs uppercase tracking-wider transition-all hover:scale-105 disabled:opacity-60 disabled:scale-100"
              style={{ background: 'var(--c-mint)', color: 'var(--c-ink)' }}
            >
              {status === 'loading' ? (
                <>
                  <Loader size={12} className="animate-spin" />
                  Submitting...
                </>
              ) : 'Register Now'}
            </button>
          </div>

        </form>
      )}
    </>
  );

  if (inline) {
    return (
      <div className="w-full rounded-2xl border border-[var(--c-border)] p-4 sm:p-6" style={{ background: 'var(--c-surface)' }}>
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative w-full max-w-lg rounded-2xl border border-[var(--c-border)] p-6 z-10 my-auto max-h-[calc(100vh-3rem)] overflow-y-auto"
        style={{ background: 'var(--c-surface)' }}
      >
        {content}
      </motion.div>
    </div>
  );
}
