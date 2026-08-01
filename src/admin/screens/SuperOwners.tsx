import React, { useState } from 'react';
import { OWNER_ACCOUNTS } from '../data/mock';
import type { OwnerAccount } from '../types';

const A = '#6366f1';
const PLAN_CFG = {
  starter:    { bg:'#f1f5f9', color:'#475569', label:'Starter'    },
  pro:        { bg:'#eff6ff', color:'#2563eb', label:'Pro'        },
  enterprise: { bg:'#faf5ff', color:'#7c3aed', label:'Enterprise' },
};
const STATUS_CFG: Record<OwnerAccount['status'], { bg:string; color:string; label:string }> = {
  active:    { bg:'#dcfce7', color:'#15803d', label:'Active'    },
  suspended: { bg:'#fee2e2', color:'#dc2626', label:'Suspended' },
  pending:   { bg:'#fef3c7', color:'#b45309', label:'Pending'   },
};

export default function SuperOwners() {
  const [owners, setOwners] = useState<OwnerAccount[]>(OWNER_ACCOUNTS);
  const [search, setSearch] = useState('');

  const filtered = owners.filter(o => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q);
  });

  const updateStatus = (id: string, status: OwnerAccount['status']) =>
    setOwners(prev => prev.map(o => o.id === id ? { ...o, status } : o));

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Owner Account Management</h2>
          <p style={s.pageSub}>{owners.length} registered owners &nbsp;·&nbsp; {owners.filter(o => o.status === 'active').length} active</p>
        </div>
      </div>

      <div style={s.kpiRow}>
        {[
          { label:'Total Owners',    val:owners.length,                                         color:'#6366f1', bg:'#eef2ff' },
          { label:'Active',          val:owners.filter(o=>o.status==='active').length,           color:'#16a34a', bg:'#f0fdf4' },
          { label:'Total Revenue',   val:`₱${owners.reduce((s,o)=>s+o.totalRevenue,0).toLocaleString()}`, color:'#0284c7', bg:'#f0f9ff' },
          { label:'Total Facilities',val:owners.reduce((s,o)=>s+o.facilitiesCount,0),            color:'#7c3aed', bg:'#faf5ff' },
        ].map(k => (
          <div key={k.label} style={{ ...s.kpi, background: k.bg }}>
            <div style={{ ...s.kpiVal, color: k.color }}>{k.val}</div>
            <div style={s.kpiLbl}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={s.searchRow}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
        <input style={s.search} placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div style={s.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>{['Owner','Email','Phone','Facilities','Plan','Total Revenue','Joined','Status','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => {
                const pc = PLAN_CFG[o.plan];
                const sc = STATUS_CFG[o.status];
                return (
                  <tr key={o.id} style={{ ...s.tr, background: i%2===0 ? '#fff' : '#fafafa' }}>
                    <td style={s.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ ...s.avatar, background: A+'18', color: A }}>{o.name[0]}</div>
                        <div>
                          <div style={s.name}>{o.name}</div>
                          <div style={s.sub}>{o.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...s.td, color:'#64748b' }}>{o.email}</td>
                    <td style={{ ...s.td, color:'#64748b' }}>{o.phone}</td>
                    <td style={{ ...s.td, fontWeight:700, textAlign:'center' }}>{o.facilitiesCount}</td>
                    <td style={s.td}><span style={{ ...s.badge, background:pc.bg, color:pc.color }}>{pc.label}</span></td>
                    <td style={{ ...s.td, fontWeight:700, color:'#16a34a' }}>₱{o.totalRevenue.toLocaleString()}</td>
                    <td style={{ ...s.td, color:'#64748b' }}>{o.joinedDate}</td>
                    <td style={s.td}><span style={{ ...s.badge, background:sc.bg, color:sc.color }}>{sc.label}</span></td>
                    <td style={s.td}>
                      <div style={{ display:'flex', gap:6 }}>
                        {o.status === 'active'    && <ActionBtn label="Suspend"   color="#dc2626" bg="#fff5f5" border="#fecaca" onClick={() => updateStatus(o.id,'suspended')} />}
                        {o.status !== 'active'    && <ActionBtn label="Restore"   color="#15803d" bg="#f0fdf4" border="#bbf7d0" onClick={() => updateStatus(o.id,'active')} />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({ label, color, bg, border, onClick }: { label:string;color:string;bg:string;border:string;onClick:()=>void }) {
  return <button onClick={onClick} style={{ padding:'4px 10px', borderRadius:6, border:`1px solid ${border}`, background:bg, color, fontSize:11, fontWeight:700, cursor:'pointer' }}>{label}</button>;
}

const s: Record<string, React.CSSProperties> = {
  page:      { display:'flex', flexDirection:'column', gap:20 },
  pageHead:  { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle: { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:   { fontSize:13, color:'#64748b', marginTop:4 },
  kpiRow:    { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 },
  kpi:       { borderRadius:12, padding:'16px 20px', border:'1px solid #e2e8f0' },
  kpiVal:    { fontSize:28, fontWeight:900, marginBottom:4 },
  kpiLbl:    { fontSize:12, fontWeight:700, color:'#64748b' },
  searchRow: { display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:9, padding:'0 14px', height:40, maxWidth:360 },
  search:    { border:'none', outline:'none', fontSize:13, color:'#0f172a', background:'transparent', flex:1 },
  card:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  table:     { width:'100%', borderCollapse:'collapse' as const, minWidth:960 },
  th:        { padding:'11px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8 },
  tr:        { borderBottom:'1px solid #f8fafc' },
  td:        { padding:'12px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
  avatar:    { width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, flexShrink:0 },
  name:      { fontWeight:700, fontSize:13 },
  sub:       { fontSize:10, color:'#94a3b8', fontFamily:'monospace', marginTop:1 },
  badge:     { display:'inline-block', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700 },
};
