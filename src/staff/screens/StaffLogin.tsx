import React, { useState } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';

const A = '#10b981'; // accent — emerald

export default function StaffLogin() {
  const { login } = useStaffAuth();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim())    { setError('Email is required.');    return; }
    if (!password.trim()) { setError('Password is required.'); return; }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={{ ...s.blob, top: -140, right: -100, background: 'radial-gradient(circle,rgba(16,185,129,.2) 0%,transparent 70%)' }} aria-hidden="true" />
      <div style={{ ...s.blob, bottom: -120, left: -80, background: 'radial-gradient(circle,rgba(5,150,105,.15) 0%,transparent 70%)' }} aria-hidden="true" />

      <div style={s.wrap}>
        {/* Brand */}
        <div style={s.brand}>
          <div style={{ ...s.mark, background: A }}>
            <CourtIcon />
          </div>
          <span style={s.brandName}>PicklePro</span>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} noValidate style={s.card}>
          <div style={s.cardHead}>
            <span style={{ ...s.portalTag, color: A, background: 'rgba(16,185,129,.12)', border: '1px solid rgba(16,185,129,.25)' }}>
              Staff Portal
            </span>
            <h1 style={s.title}>Sign in to your account</h1>
            <p style={s.sub}>Manage check-ins, courts and schedules</p>
          </div>

          {error && (
            <div style={s.errBox} role="alert">
              <AlertIcon />
              {error}
            </div>
          )}

          <div style={s.fields}>
            <div style={s.field}>
              <label style={s.label} htmlFor="st-email">Email address</label>
              <input
                id="st-email" type="email" value={email} autoComplete="email"
                onChange={e => { setEmail(e.target.value); setError(''); }}
                style={s.input} placeholder="staff@picklepro.com" disabled={loading}
              />
            </div>

            <div style={s.field}>
              <label style={s.label} htmlFor="st-pw">Password</label>
              <div style={s.pwRow}>
                <input
                  id="st-pw" type={showPw ? 'text' : 'password'} value={password} autoComplete="current-password"
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  style={{ ...s.input, paddingRight: 44 }} placeholder="Enter your password" disabled={loading}
                />
                <button type="button" onClick={() => setShowPw(v => !v)} style={s.eyeBtn} aria-label={showPw ? 'Hide' : 'Show'}>
                  {showPw ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{ ...s.btn, background: A, boxShadow: '0 4px 20px rgba(16,185,129,.35)', opacity: loading ? .75 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? <><Spin />Signing in…</> : 'Sign in'}
          </button>

          <div style={s.divRow}><span style={s.divLabel}>demo credentials</span></div>

          <div style={s.demoRow}>
            <div style={s.demoBox}>
              <span style={s.demoKey}>Email</span>
              <code style={s.demoVal}>staff@picklepro.com</code>
            </div>
            <div style={s.demoBox}>
              <span style={s.demoKey}>Password</span>
              <code style={s.demoVal}>staff123</code>
            </div>
          </div>
        </form>

        <p style={s.footer}>PicklePro &copy; {new Date().getFullYear()} &mdash; Staff access only</p>
      </div>
    </div>
  );
}

/* ── Tiny inline icons ─────────────────────────────────────────────────────── */
function CourtIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function EyeOffIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" />
    </svg>
  );
}
function Spin() {
  return (
    <>
      <style>{`@keyframes _spin{to{transform:rotate(360deg)}}`}</style>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"
        style={{ animation: '_spin .8s linear infinite', marginRight: 8, flexShrink: 0 }}>
        <path d="M21 12a9 9 0 11-6.22-8.56" />
      </svg>
    </>
  );
}

/* ── Styles ────────────────────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
  page:     { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #060a14 0%, #0a1020 50%, #070c1a 100%)', fontFamily: 'system-ui,sans-serif', padding: '24px 16px', position: 'relative', overflow: 'hidden' },
  blob:     { position: 'absolute', width: 520, height: 520, borderRadius: '50%', pointerEvents: 'none' },
  wrap:     { position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 },
  brand:    { display: 'flex', alignItems: 'center', gap: 10 },
  mark:     { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName:{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-.3px' },
  card:     { width: '100%', background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '36px 36px 32px', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', gap: 20, boxShadow: '0 24px 64px rgba(0,0,0,.5)' },
  cardHead: { display: 'flex', flexDirection: 'column', gap: 6 },
  portalTag:{ alignSelf: 'flex-start', fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', borderRadius: 99, padding: '3px 12px' },
  title:    { fontSize: 22, fontWeight: 800, color: '#f8fafc', margin: 0, lineHeight: 1.2 },
  sub:      { fontSize: 13, color: '#64748b', margin: 0 },
  errBox:   { display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(220,38,38,.1)', border: '1px solid rgba(220,38,38,.3)', color: '#fca5a5', borderRadius: 10, padding: '10px 14px', fontSize: 13 },
  fields:   { display: 'flex', flexDirection: 'column', gap: 14 },
  field:    { display: 'flex', flexDirection: 'column', gap: 6 },
  label:    { fontSize: 12, fontWeight: 600, color: '#94a3b8' },
  pwRow:    { position: 'relative' },
  input:    { width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  eyeBtn:   { position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 },
  btn:      { width: '100%', padding: '13px', border: 'none', borderRadius: 10, color: '#fff', fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 },
  divRow:   { display: 'flex', alignItems: 'center' },
  divLabel: { fontSize: 11, fontWeight: 600, color: '#334155', textTransform: 'uppercase', letterSpacing: 1 },
  demoRow:  { display: 'flex', gap: 12 },
  demoBox:  { flex: 1, display: 'flex', flexDirection: 'column', gap: 4, background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 9, padding: '10px 12px' },
  demoKey:  { fontSize: 10, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: .8 },
  demoVal:  { fontSize: 12, color: '#94a3b8', fontFamily: 'monospace', wordBreak: 'break-all' },
  footer:   { fontSize: 12, color: '#1e293b', textAlign: 'center' },
};
