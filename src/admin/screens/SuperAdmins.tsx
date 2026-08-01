import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import type { ManagedAdmin, AdminPermissions } from '../types';

const A = '#6366f1';

const PERM_LABELS: { key: keyof AdminPermissions; label: string; description: string }[] = [
  { key: 'canManageUsers',    label: 'Manage Users',    description: 'Access the Users screen and manage customer accounts' },
  { key: 'canManageCourts',   label: 'Manage Courts',   description: 'Access the Courts screen and update court availability' },
  { key: 'canManageStaff',    label: 'Manage Staff',    description: 'Access the Staff screen and create/suspend staff accounts' },
  { key: 'canViewReports',    label: 'View Reports',    description: 'Access the Reports screen and booking analytics' },
  { key: 'canManageSettings', label: 'Settings',        description: 'Access facility settings and configuration' },
  { key: 'canManagePayments', label: 'Manage Payments', description: 'View and manage payment records and refunds' },
  { key: 'canExportData',     label: 'Export Data',     description: 'Export bookings and reports as CSV/PDF' },
];

export default function SuperAdmins() {
  const { getAdmins, createAdmin, suspendAdmin, deleteAdmin, updateAdminPermissions } = useAdminAuth();
  const admins = getAdmins();

  const [showForm,  setShowForm]  = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPerms, setEditPerms] = useState<AdminPermissions | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', facilityName: '' });
  const [formPerms, setFormPerms] = useState<AdminPermissions>({
    canManageUsers: true, canManageCourts: true, canManageStaff: true,
    canViewReports: true, canManageSettings: true, canManagePayments: false, canExportData: false,
  });
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState('');

  const handleCreate = () => {
    setError(''); setSuccess('');
    if (!form.name.trim())         { setError('Name is required.'); return; }
    if (!form.email.trim())        { setError('Email is required.'); return; }
    if (!form.password)            { setError('Password is required.'); return; }
    if (!form.facilityName.trim()) { setError('Facility name is required.'); return; }
    const err = createAdmin({ ...form, permissions: formPerms });
    if (err) { setError(err); return; }
    setSuccess('Admin account created.');
    setForm({ name: '', email: '', password: '', facilityName: '' });
    setFormPerms({ canManageUsers: true, canManageCourts: true, canManageStaff: true, canViewReports: true, canManageSettings: true, canManagePayments: false, canExportData: false });
    setShowForm(false);
  };

  const openEdit = (admin: ManagedAdmin) => {
    setEditingId(admin.id);
    setEditPerms({ ...admin.permissions });
  };

  const savePermissions = () => {
    if (!editingId || !editPerms) return;
    updateAdminPermissions(editingId, editPerms);
    setEditingId(null);
    setEditPerms(null);
    setSuccess('Permissions updated.');
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h2 style={s.title}>Admin Accounts</h2>
          <p style={s.sub}>Create and manage facility admin accounts and their permissions.</p>
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
            <Field label="Full Name"     value={form.name}         onChange={v => setForm(f => ({ ...f, name: v }))}         placeholder="e.g. Maria Santos" />
            <Field label="Email"         value={form.email}        onChange={v => setForm(f => ({ ...f, email: v }))}        placeholder="e.g. maria@facility.com" type="email" />
            <Field label="Password"      value={form.password}     onChange={v => setForm(f => ({ ...f, password: v }))}     placeholder="Temporary password" type="password" />
            <Field label="Facility Name" value={form.facilityName} onChange={v => setForm(f => ({ ...f, facilityName: v }))} placeholder="e.g. Smash Arena Cebu" />
          </div>

          <div style={s.permSection}>
            <div style={s.permTitle}>Permissions</div>
            <div style={s.permGrid}>
              {PERM_LABELS.map(({ key, label, description }) => (
                <label key={key} style={s.permRow}>
                  <input type="checkbox" checked={formPerms[key]}
                    onChange={e => setFormPerms(p => ({ ...p, [key]: e.target.checked }))} />
                  <div>
                    <div style={s.permLabel}>{label}</div>
                    <div style={s.permDesc}>{description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div style={s.formActions}>
            <button style={s.createBtn} onClick={handleCreate}>Create Account</button>
          </div>
        </div>
      )}

      {/* Permission editor modal */}
      {editingId && editPerms && (
        <div style={s.modal} onClick={() => { setEditingId(null); setEditPerms(null); }}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={s.formTitle}>Edit Permissions — {admins.find(a => a.id === editingId)?.name}</h3>
            <div style={s.permGrid}>
              {PERM_LABELS.map(({ key, label, description }) => (
                <label key={key} style={s.permRow}>
                  <input type="checkbox" checked={editPerms[key]}
                    onChange={e => setEditPerms(p => p ? { ...p, [key]: e.target.checked } : p)} />
                  <div>
                    <div style={s.permLabel}>{label}</div>
                    <div style={s.permDesc}>{description}</div>
                  </div>
                </label>
              ))}
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end', marginTop:16 }}>
              <button style={s.cancelBtn} onClick={() => { setEditingId(null); setEditPerms(null); }}>Cancel</button>
              <button style={s.createBtn} onClick={savePermissions}>Save Permissions</button>
            </div>
          </div>
        </div>
      )}

      <div style={s.table}>
        <div style={s.tableHead}>
          <span style={{ flex: 2 }}>Name / Email</span>
          <span style={{ flex: 2 }}>Facility</span>
          <span style={{ flex: 2 }}>Permissions</span>
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
            <div style={{ flex: 2, display:'flex', flexWrap:'wrap', gap:4 }}>
              {PERM_LABELS.filter(p => a.permissions[p.key]).map(p => (
                <span key={p.key} style={s.permChip}>{p.label}</span>
              ))}
              {PERM_LABELS.filter(p => !a.permissions[p.key]).length === PERM_LABELS.length && (
                <span style={{ fontSize:11, color:'#94a3b8' }}>No permissions</span>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ ...s.badge, ...(a.status === 'active' ? s.badgeGreen : s.badgeRed) }}>
                {a.status}
              </span>
            </div>
            <div style={{ flex: 1.5, display: 'flex', gap: 6, justifyContent: 'flex-end', flexWrap:'wrap' }}>
              <button style={s.actionBtn} onClick={() => openEdit(a)}>Permissions</button>
              <button style={s.actionBtn} onClick={() => suspendAdmin(a.id)}>
                {a.status === 'active' ? 'Suspend' : 'Activate'}
              </button>
              <button style={{ ...s.actionBtn, ...s.deleteBtn }} onClick={() => deleteAdmin(a.id)}>Delete</button>
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
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none' }} />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:       { display: 'flex', flexDirection: 'column', gap: 20 },
  header:     { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  title:      { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 },
  sub:        { fontSize: 13, color: '#64748b', margin: '4px 0 0' },
  addBtn:     { padding: '9px 18px', background: A, color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  successBox: { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  formCard:   { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 },
  formTitle:  { fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 },
  errBox:     { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 8, padding: '10px 14px', fontSize: 13 },
  grid:       { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 },
  permSection:{ display:'flex', flexDirection:'column', gap:10 },
  permTitle:  { fontSize: 13, fontWeight: 700, color: '#0f172a' },
  permGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 },
  permRow:    { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer' },
  permLabel:  { fontSize: 13, fontWeight: 600, color: '#0f172a' },
  permDesc:   { fontSize: 11, color: '#64748b', marginTop: 2 },
  permChip:   { fontSize: 10, fontWeight: 700, background: A+'12', color: A, padding: '2px 8px', borderRadius: 99, whiteSpace: 'nowrap' as const },
  formActions:{ display: 'flex', justifyContent: 'flex-end' },
  createBtn:  { padding: '10px 22px', background: A, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  cancelBtn:  { padding: '10px 22px', background: '#f1f5f9', color: '#334155', border: '1px solid #e2e8f0', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' },
  modal:      { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modalCard:  { background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 600, display: 'flex', flexDirection: 'column', gap: 14, maxHeight: '90vh', overflowY: 'auto' },
  table:      { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' },
  tableHead:  { display: 'flex', gap: 8, padding: '10px 20px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: 0.6 },
  empty:      { padding: '32px 20px', textAlign: 'center' as const, color: '#94a3b8', fontSize: 14 },
  row:        { display: 'flex', gap: 8, padding: '14px 20px', borderBottom: '1px solid #f1f5f9', alignItems: 'center', flexWrap: 'wrap' },
  name:       { fontSize: 13, fontWeight: 700, color: '#0f172a' },
  email:      { fontSize: 11, color: '#64748b', marginTop: 2 },
  badge:      { fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  badgeGreen: { background: '#dcfce7', color: '#16a34a' },
  badgeRed:   { background: '#fee2e2', color: '#dc2626' },
  actionBtn:  { padding: '6px 12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', color: '#334155', whiteSpace: 'nowrap' as const },
  deleteBtn:  { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' },
};
