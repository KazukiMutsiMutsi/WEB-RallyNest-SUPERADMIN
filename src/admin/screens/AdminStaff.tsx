import React, { useState } from 'react';
import { AUDIT_LOG } from '../data/mock';
import { useAdminAuth } from '../context/AdminAuthContext';
import type { ManagedStaff, StaffPermissions } from '../types';

const A = '#6366f1';

const PERM_LABELS: { key: keyof StaffPermissions; label: string; description: string }[] = [
  { key: 'canCheckIn',      label: 'Check-In',      description: 'Access the Check-In screen and verify bookings' },
  { key: 'canManageCourts', label: 'Manage Courts',  description: 'Access the Courts screen and update court status' },
  { key: 'canViewSchedule', label: 'View Schedule',  description: 'Access the Schedule screen and view all bookings' },
  { key: 'canViewPlayers',  label: 'View Players',   description: 'Access the Players screen and view player profiles' },
];

export default function AdminStaff() {
  const { getStaff, createStaff, suspendStaff, deleteStaff, updateStaffPermissions } = useAdminAuth();
  const staff = getStaff();
  const [tab, setTab] = useState<'members' | 'add' | 'audit'>('members');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [formPerms, setFormPerms] = useState<StaffPermissions>({
    canCheckIn: true, canManageCourts: false, canViewSchedule: true, canViewPlayers: false,
  });
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPerms, setEditPerms] = useState<StaffPermissions | null>(null);

  const active    = staff.filter(s => s.status === 'active').length;
  const suspended = staff.filter(s => s.status === 'suspended').length;

  const handleCreate = () => {
    setError(''); setSuccess('');
    if (!form.name.trim())  { setError('Name is required.'); return; }
    if (!form.email.trim()) { setError('Email is required.'); return; }
    if (!form.password)     { setError('Password is required.'); return; }
    const err = createStaff({ ...form, permissions: formPerms });
    if (err) { setError(err); return; }
    setSuccess('Staff account created.');
    setForm({ name: '', email: '', password: '' });
    setFormPerms({ canCheckIn: true, canManageCourts: false, canViewSchedule: true, canViewPlayers: false });
    setTab('members');
  };

  const openEdit = (member: ManagedStaff) => {
    setEditingId(member.id);
    setEditPerms({ ...member.permissions });
  };

  const savePermissions = () => {
    if (!editingId || !editPerms) return;
    updateStaffPermissions(editingId, editPerms);
    setEditingId(null);
    setEditPerms(null);
    setSuccess('Permissions updated.');
  };

  return (
    <div style={s.page}>
      <div style={s.topRow}>
        <div style={s.summary}>
          <SummaryChip val={staff.length} label="Total staff" color="#0f172a" />
          <SummaryChip val={active}       label="Active"      color="#15803d" />
          <SummaryChip val={suspended}    label="Suspended"   color="#dc2626" />
        </div>
        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(tab === 'members' ? s.tabActive : {}) }} onClick={() => setTab('members')}>Staff Members</button>
          <button style={{ ...s.tab, ...(tab === 'add'     ? s.tabActive : {}) }} onClick={() => setTab('add')}>+ Add Staff</button>
          <button style={{ ...s.tab, ...(tab === 'audit'   ? s.tabActive : {}) }} onClick={() => setTab('audit')}>
            Audit Log
            {AUDIT_LOG.length > 0 && <span style={s.auditCount}>{AUDIT_LOG.length}</span>}
          </button>
        </div>
      </div>

      {success && tab !== 'add' && <div style={s.successBox}>{success}</div>}

      {/* Permission editor modal */}
      {editingId && editPerms && (
        <div style={s.modal} onClick={() => { setEditingId(null); setEditPerms(null); }}>
          <div style={s.modalCard} onClick={e => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Edit Permissions — {staff.find(m => m.id === editingId)?.name}</h3>
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
              <button style={s.saveBtn} onClick={savePermissions}>Save Permissions</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'add' && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>Create Staff Account</h3>
          {error && <div style={s.errBox}>{error}</div>}
          {success && <div style={s.successBox}>{success}</div>}
          <div style={s.formGrid}>
            <Field label="Full Name"  value={form.name}     onChange={v => setForm(f => ({ ...f, name: v }))}     placeholder="e.g. Alex Reyes" />
            <Field label="Email"      value={form.email}    onChange={v => setForm(f => ({ ...f, email: v }))}    placeholder="e.g. staff@facility.com" type="email" />
            <Field label="Password"   value={form.password} onChange={v => setForm(f => ({ ...f, password: v }))} placeholder="Temporary password" type="password" />
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
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:4 }}>
            <button style={s.createBtn} onClick={handleCreate}>Create Staff Account</button>
          </div>
        </div>
      )}

      {tab === 'members' && (
        <div style={s.card}>
          <div style={{ overflowX:'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>{['Staff Member','Email','Joined','Permissions','Status','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {staff.length === 0 && (
                  <tr><td colSpan={6} style={{ padding:32, textAlign:'center', color:'#94a3b8' }}>No staff accounts yet. Use "+ Add Staff" to create one.</td></tr>
                )}
                {staff.map((m: ManagedStaff, i: number) => (
                  <tr key={m.id} style={{ ...s.tr, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={s.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ ...s.avatar, background: m.status === 'suspended' ? '#f1f5f9' : A+'18', color: m.status === 'suspended' ? '#94a3b8' : A }}>
                          {m.name.split(' ').map((n: string) => n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <div style={s.name}>{m.name}</div>
                          <div style={s.role}>Staff Member</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...s.td, color:'#64748b' }}>{m.email}</td>
                    <td style={{ ...s.td, color:'#64748b' }}>{m.createdAt}</td>
                    <td style={s.td}>
                      <div style={{ display:'flex', flexWrap:'wrap', gap:4 }}>
                        {PERM_LABELS.filter(p => m.permissions[p.key]).map(p => (
                          <span key={p.key} style={s.permChip}>{p.label}</span>
                        ))}
                        {PERM_LABELS.every(p => !m.permissions[p.key]) && (
                          <span style={{ fontSize:11, color:'#94a3b8' }}>None</span>
                        )}
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                        <div style={{ ...s.statusDot, background: m.status === 'active' ? '#16a34a' : '#dc2626' }} />
                        <span style={{ fontSize:13, fontWeight:600, color: m.status === 'active' ? '#15803d' : '#dc2626' }}>
                          {m.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                        <button style={s.permBtn} onClick={() => openEdit(m)}>Permissions</button>
                        <button onClick={() => suspendStaff(m.id)}
                          style={{ ...s.toggleBtn, ...(m.status === 'active' ? s.suspendBtn : s.restoreBtn) }}>
                          {m.status === 'active' ? 'Suspend' : 'Activate'}
                        </button>
                        <button onClick={() => deleteStaff(m.id)} style={{ ...s.toggleBtn, ...s.deleteBtn }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'audit' && (
        <div style={s.card}>
          <div style={{ overflowX:'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>{['Timestamp','Staff Member','Action','Target'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {AUDIT_LOG.map((a, i) => (
                  <tr key={a.id} style={{ ...s.tr, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={{ ...s.td, fontFamily:'monospace', fontSize:11, color:'#94a3b8', whiteSpace:'nowrap' as const }}>{a.timestamp}</td>
                    <td style={{ ...s.td, fontWeight:700 }}>{a.staffName}</td>
                    <td style={s.td}><span style={s.actionLabel}>{a.action}</span></td>
                    <td style={{ ...s.td, color:'#475569' }}>{a.target}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
      <label style={{ fontSize:12, fontWeight:600, color:'#64748b' }}>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:13, color:'#0f172a', outline:'none' }} />
    </div>
  );
}

function SummaryChip({ val, label, color }: { val:number; label:string; color:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <span style={{ fontSize:20, fontWeight:900, color }}>{val}</span>
      <span style={{ fontSize:12, color:'#94a3b8' }}>{label}</span>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:        { display:'flex', flexDirection:'column', gap:16 },
  topRow:      { display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 },
  summary:     { display:'flex', alignItems:'center', gap:20, background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'12px 20px' },
  tabs:        { display:'flex', background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, overflow:'hidden' },
  tab:         { display:'flex', alignItems:'center', gap:6, padding:'9px 20px', border:'none', background:'transparent', fontSize:13, fontWeight:600, color:'#64748b', cursor:'pointer' },
  tabActive:   { background:A, color:'#fff' },
  auditCount:  { fontSize:10, fontWeight:800, background:'rgba(255,255,255,.25)', borderRadius:99, padding:'1px 7px', marginLeft:2 },
  successBox:  { background:'#f0fdf4', border:'1px solid #bbf7d0', color:'#16a34a', borderRadius:8, padding:'10px 14px', fontSize:13 },
  formCard:    { background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:24, display:'flex', flexDirection:'column', gap:14 },
  formTitle:   { fontSize:15, fontWeight:700, color:'#0f172a', margin:0 },
  errBox:      { background:'#fef2f2', border:'1px solid #fecaca', color:'#dc2626', borderRadius:8, padding:'10px 14px', fontSize:13 },
  formGrid:    { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:14 },
  permSection: { display:'flex', flexDirection:'column', gap:8 },
  permTitle:   { fontSize:13, fontWeight:700, color:'#0f172a' },
  permGrid:    { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:8 },
  permRow:     { display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:8, cursor:'pointer' },
  permLabel:   { fontSize:13, fontWeight:600, color:'#0f172a' },
  permDesc:    { fontSize:11, color:'#64748b', marginTop:2 },
  permChip:    { fontSize:10, fontWeight:700, background:A+'12', color:A, padding:'2px 8px', borderRadius:99, whiteSpace:'nowrap' as const },
  createBtn:   { padding:'10px 22px', background:A, color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer' },
  modal:       { position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:24 },
  modalCard:   { background:'#fff', borderRadius:16, padding:28, width:'100%', maxWidth:520, display:'flex', flexDirection:'column', gap:14 },
  modalTitle:  { fontSize:15, fontWeight:700, color:'#0f172a', margin:0 },
  cancelBtn:   { padding:'9px 18px', background:'#f1f5f9', color:'#334155', border:'1px solid #e2e8f0', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer' },
  saveBtn:     { padding:'9px 18px', background:A, color:'#fff', border:'none', borderRadius:8, fontWeight:700, fontSize:13, cursor:'pointer' },
  card:        { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  table:       { width:'100%', borderCollapse:'collapse' as const, minWidth:700 },
  th:          { padding:'11px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8, whiteSpace:'nowrap' as const },
  tr:          { borderBottom:'1px solid #f8fafc' },
  td:          { padding:'12px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
  avatar:      { width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 },
  name:        { fontWeight:700, fontSize:13 },
  role:        { fontSize:11, color:'#94a3b8', marginTop:1 },
  statusDot:   { width:7, height:7, borderRadius:'50%', flexShrink:0 },
  permBtn:     { padding:'6px 12px', background:'#eef2ff', border:'1px solid #c7d2fe', borderRadius:7, fontSize:12, fontWeight:600, cursor:'pointer', color:A },
  toggleBtn:   { padding:'6px 12px', borderRadius:7, border:'none', fontSize:12, fontWeight:700, cursor:'pointer' },
  suspendBtn:  { background:'#fef3c7', color:'#b45309' },
  restoreBtn:  { background:'#dcfce7', color:'#15803d' },
  deleteBtn:   { background:'#fef2f2', color:'#dc2626' },
  actionLabel: { fontSize:13, color:'#0f172a' },
};
