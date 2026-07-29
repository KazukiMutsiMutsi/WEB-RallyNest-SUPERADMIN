import React, { useState } from 'react';
import { ADMIN_STAFF, AUDIT_LOG } from '../data/mock';
import type { AdminStaffMember } from '../types';

const A = '#6366f1';

export default function AdminStaff() {
  const [staff, setStaff] = useState<AdminStaffMember[]>(ADMIN_STAFF);
  const [tab,   setTab]   = useState<'members' | 'audit'>('members');

  const toggle = (id: string) =>
    setStaff(prev => prev.map(s => s.id === id
      ? { ...s, status: s.status === 'active' ? 'suspended' : 'active' } : s));

  const active    = staff.filter(s => s.status === 'active').length;
  const suspended = staff.filter(s => s.status === 'suspended').length;

  return (
    <div style={s.page}>
      {/* Summary + tabs row */}
      <div style={s.topRow}>
        <div style={s.summary}>
          <SummaryChip val={staff.length}  label="Total staff" color="#0f172a" />
          <SummaryChip val={active}        label="Active"      color="#15803d" />
          <SummaryChip val={suspended}     label="Suspended"   color="#dc2626" />
        </div>
        <div style={s.tabs}>
          <button style={{ ...s.tab, ...(tab === 'members' ? s.tabActive : {}) }} onClick={() => setTab('members')}>
            Staff Members
          </button>
          <button style={{ ...s.tab, ...(tab === 'audit' ? s.tabActive : {}) }} onClick={() => setTab('audit')}>
            Audit Log
            {AUDIT_LOG.length > 0 && <span style={s.auditCount}>{AUDIT_LOG.length}</span>}
          </button>
        </div>
      </div>

      {tab === 'members' && (
        <div style={s.card}>
          <div style={{ overflowX:'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>{['Staff Member','Contact','Joined','Last Login','Actions','Status',''].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {staff.map((m, i) => (
                  <tr key={m.id} style={{ ...s.tr, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={s.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ ...s.avatar, background: m.status === 'suspended' ? '#f1f5f9' : A+'18', color: m.status === 'suspended' ? '#94a3b8' : A }}>
                          {m.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                        </div>
                        <div>
                          <div style={s.name}>{m.name}</div>
                          <div style={s.role}>Staff Member</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ fontSize:13, color:'#0f172a' }}>{m.email}</div>
                      <div style={{ fontSize:11, color:'#94a3b8', marginTop:1 }}>{m.phone}</div>
                    </td>
                    <td style={{ ...s.td, color:'#64748b' }}>{m.joinedDate}</td>
                    <td style={{ ...s.td, color:'#64748b' }}>{m.lastLogin}</td>
                    <td style={{ ...s.td, fontWeight:700, textAlign:'center' as const }}>
                      <span style={{ ...s.actionPill }}>{m.totalActions}</span>
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
                      <button
                        onClick={() => toggle(m.id)}
                        style={{ ...s.toggleBtn, ...(m.status === 'active' ? s.suspendBtn : s.restoreBtn) }}>
                        {m.status === 'active' ? 'Suspend' : 'Restore'}
                      </button>
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
                    <td style={s.td}>
                      <span style={s.actionLabel}>{a.action}</span>
                    </td>
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
  card:        { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  table:       { width:'100%', borderCollapse:'collapse' as const, minWidth:760 },
  th:          { padding:'11px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8, whiteSpace:'nowrap' as const },
  tr:          { borderBottom:'1px solid #f8fafc' },
  td:          { padding:'12px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
  avatar:      { width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 },
  name:        { fontWeight:700, fontSize:13 },
  role:        { fontSize:11, color:'#94a3b8', marginTop:1 },
  actionPill:  { background:A+'12', color:A, borderRadius:99, padding:'2px 10px', fontSize:12, fontWeight:700 },
  statusDot:   { width:7, height:7, borderRadius:'50%', flexShrink:0 },
  toggleBtn:   { padding:'6px 14px', borderRadius:7, border:'none', fontSize:12, fontWeight:700, cursor:'pointer' },
  suspendBtn:  { background:'#fef3c7', color:'#b45309' },
  restoreBtn:  { background:'#dcfce7', color:'#15803d' },
  actionLabel: { fontSize:13, color:'#0f172a' },
};
