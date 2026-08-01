import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import type { ManagedAdmin } from '../types';

export default function SuperAdmins() {
  const { getAdmins, createAdmin, suspendAdmin, deleteAdmin } = useAdminAuth();
  const admins = getAdmins();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', facilityName: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = () => {
    setError(''); setSuccess('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (!form.password) { setError('Password is required.'); return; }
    if (!form.facilityName.trim()) { setError('Facility name is required.'); return; }
    const err = createAdmin(form);
    if (err) { setError(err); return; }
    setSuccess('Admin account created.');
    setForm({ name: '', email: '', password: '', facilityName: '' });
    setShowForm(false);
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Admin Accounts</h2>
          <p style={s.sub}>Create and manage facility admin accounts.</p>
        </div>
        <button style={s.addBtn} onClick={() => { setShowForm(v => !v); setError(''); setSuccess(''); }}>
          {showForm ? 'Cancel' : '+ New Admin'}
        </button>
      </div>

      {success && <div style={s.successBox}>{success}</div>}

      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>Create Admin Account</h3>
          {error && <div style={s.errBox}>{error}</div>}
          <div style={s.grid}>
            <Field label="Full Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Maria Santos" />
            <Field label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} placeholder="e.g. maria@facility.com" type="email" />
            <Field label="Password" value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} placeholder="Temporary password" type="password" />
            <Field label="Facility Name" value={form.facilityName} onChange={v => setForm(f => ({ ...f, facilityName: v }))} placeholder="e.g. Smash Arena Cebu" />
          </div>
          <div style={s.formActions}>
            <button style={s.createBtn} onClick={handleCreate}>Create Account</button>
          </div>
        </div>
      )}

      <div style={s.table}>
        <div style={s.tableHead}>
          <span style={{ flex: 2 }}>Name / Email</span>
          <span style={{ flex: 2 }}>Facility</span>
          <span style={{ flex: 1 }}>Created</span>
          <span style={{ flex: 1 }}>Status</span>
          <span style={{ flex: 1.5, textAlign: 'right' }}>Actions</span>
        </div>
        {admins.length === 0 && <div style={s.empty}>No admin accounts yet.</div>}
        {admins.map((a: ManagedAdmin) => (
          <div key={a.id} style={s.row}>
            <div style={{ flex: 2, minWidth: 0 }}>
              <div style={s.name}>{a.name}</div>
              <div style={s.email}>{a.email}</div>
            </div>
            <div style={{ flex: 2, fontSize: 13, color: '#334155' }}>{a.facilityName}</div>
            <div style={{ flex: 1, fontSize: 12, color: '#64748b' }}>{a.createdAt}</div>
            <div style={{ flex: 1 }}>
              <span style={{ ...s.badge, ...(a.status === 'active' ? s.badgeGreen : s.badgeRed) }}>
                {a.status}
              </span>
            </div>
            <div style={{ flex: 1.5, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button style={s.actionBtn} onClick={() => suspendAdmin(a.id)}>
                {a.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              <button style={{ ...s.actionBtn, ...s.deleteBtn }} onClick={() => deleteAdmin(a.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>{label}</label>
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none' }}
      />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:       { display: 'flex', flexDirection: 'column', gap: 20 },
  header:     { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  title:      { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 },
  sub:        { fontSize: 13, color: '#64748b', margin: '4px 0 0' },
  addBtn:     { padding: '9px 18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  successBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  formCard:   { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 },
  formTitle:  { fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 },
  errBox:     { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 },
  formActions:{ display: 'flex', justifyContent: 'flex-end' },
  createBtn:  { padding: '10px 22px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  table:      { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' },
  tableHead:  { display: 'flex', gap: 8, padding: '10px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.6 },
  empty:      { padding: '32px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 14 },
  row:        { display: 'flex', gap: 8, padding: '14px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center' },
  name:       { fontSize: 13, fontWeight: 700, color: '#0f172a' },
  email:      { fontSize: 11, color: '#64748b', marginTop: 2 },
  badge:      { fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: 0.5 },
  badgeGreen: { background: '#dcfce7', color: '#16a34a' },
  badgeRed:   { background: '#fee2e2', color: '#dc2626' },
  actionBtn:  { padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#334155' },
  deleteBtn:  { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' },
};
