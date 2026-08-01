import React, { useState } from 'react';
import { TENANTS } from '../data/mock';
import type { Tenant } from '../types';

const A = '#6366f1';
const PLAN_CFG = {
  starter:    { bg:'#f1f5f9', color:'#475569', label:'Starter'    },
  pro:        { bg:'#eff6ff', color:'#2563eb', label:'Pro'        },
  enterprise: { bg:'#faf5ff', color:'#7c3aed', label:'Enterprise' },
};
const STATUS_CFG: Record<Tenant['status'], { bg:string; color:string; label:string }> = {
  active:    { bg:'#dcfce7', color:'#15803d', label:'Active'    },
  suspended: { bg:'#fee2e2', color:'#dc2626', label:'Suspended' },
  pending:   { bg:'#fef3c7', color:'#b45309', label:'Pending'   },
};

const ic = (d: string, size = 14) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

export default function SuperTenants() {
  const [tenants, setTenants] = useState<Tenant[]>(TENANTS);
  const [search, setSearch] = useState('');
  const [planF, setPlanF] = useState<'all' | Tenant['plan']>('all');
  const [statusF, setStatusF] = useState<'all' | Tenant['status']>('all');
  const [selected, setSelected] = useState<Tenant | null>(null);

  const filtered = tenants.filter(t => {
    if (planF !== 'all' && t.plan !== planF) return false;
    if (statusF !== 'all' && t.status !== statusF) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.facilityName.toLowerCase().includes(q) || t.ownerName.toLowerCase().includes(q) || t.location.toLowerCase().includes(q);
    }
    return true;
  });

  const updateStatus = (id: string, status: Tenant['status']) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    setSelected(null);
  };

  const totalRevenue = tenants.reduce((s, t) => s + t.monthlyRevenue, 0);
  const activeTenants = tenants.filter(t => t.status === 'active').length;

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Tenant Management</h2>
          <p style={s.pageSub}>{tenants.length} facilities &nbsp;·&nbsp; {activeTenants} active &nbsp;·&nbsp; ₱{totalRevenue.toLocaleString()}/mo platform revenue</p>
        </div>
      </div>

      {/* KPIs */}
      <div style={s.kpiRow}>
        {[
          { label:'Total Tenants', val:tenants.length, color:'#6366f1', bg:'#eef2ff' },
          { label:'Active',        val:activeTenants,  color:'#16a34a', bg:'#f0fdf4' },
          { label:'Suspended',     val:tenants.filter(t=>t.status==='suspended').length, color:'#dc2626', bg:'#fef2f2' },
          { label:'Pending',       val:tenants.filter(t=>t.status==='pending').length,   color:'#d97706', bg:'#fffbeb' },
        ].map(k => (
          <div key={k.label} style={{ ...s.kpi, background: k.bg }}>
            <div style={{ ...s.kpiVal, color: k.color }}>{k.val}</div>
            <div style={s.kpiLbl}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={s.strip}>
        <div style={s.searchBox}>
          {ic('M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z')}
          <input style={s.search} placeholder="Search facility, owner, location…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={s.filterGroup}>
          {(['all','starter','pro','enterprise'] as const).map(p => (
            <button key={p} onClick={() => setPlanF(p)} style={{ ...s.filterBtn, ...(planF===p ? s.filterBtnActive : {}) }}>
              {p === 'all' ? 'All Plans' : PLAN_CFG[p].label}
            </button>
          ))}
        </div>
        <div style={s.filterGroup}>
          {(['all','active','suspended','pending'] as const).map(st => (
            <button key={st} onClick={() => setStatusF(st)} style={{ ...s.filterBtn, ...(statusF===st ? s.filterBtnActive : {}) }}>
              {st === 'all' ? 'All Status' : STATUS_CFG[st].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={s.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>{['Facility','Owner','Location','Plan','Courts','Monthly Revenue','Status','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const pc = PLAN_CFG[t.plan];
                const sc = STATUS_CFG[t.status];
                return (
                  <tr key={t.id} style={{ ...s.tr, background: i%2===0 ? '#fff' : '#fafafa' }}>
                    <td style={s.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ ...s.avatar, background: A+'18', color: A }}>{t.facilityName[0]}</div>
                        <div>
                          <div style={s.name}>{t.facilityName}</div>
                          <div style={s.sub}>{t.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>{t.ownerName}</td>
                    <td style={{ ...s.td, color:'#64748b' }}>{t.location}</td>
                    <td style={s.td}><span style={{ ...s.badge, background:pc.bg, color:pc.color }}>{pc.label}</span></td>
                    <td style={{ ...s.td, textAlign:'center', fontWeight:700 }}>{t.courtsCount}</td>
                    <td style={{ ...s.td, fontWeight:700, color:'#16a34a' }}>{t.monthlyRevenue > 0 ? `₱${t.monthlyRevenue.toLocaleString()}` : '—'}</td>
                    <td style={s.td}><span style={{ ...s.badge, background:sc.bg, color:sc.color }}>{sc.label}</span></td>
                    <td style={s.td}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={() => setSelected(t)} style={s.btnView}>View</button>
                        {t.status !== 'active'    && <ActionBtn label="Activate"  color="#15803d" bg="#f0fdf4" border="#bbf7d0" onClick={() => updateStatus(t.id,'active')} />}
                        {t.status === 'active'    && <ActionBtn label="Suspend"   color="#dc2626" bg="#fff5f5" border="#fecaca" onClick={() => updateStatus(t.id,'suspended')} />}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={m.backdrop} onClick={() => setSelected(null)}>
          <div style={m.panel} onClick={e => e.stopPropagation()}>
            <div style={m.head}>
              <div>
                <h2 style={m.title}>{selected.facilityName}</h2>
                <p style={{ margin:0, fontSize:12, color:'#64748b' }}>{selected.location}</p>
              </div>
              <button onClick={() => setSelected(null)} style={m.close}>&#x2715;</button>
            </div>
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:12 }}>
              {[
                ['Owner',         selected.ownerName],
                ['Email',         selected.email],
                ['Phone',         selected.phone],
                ['Plan',          PLAN_CFG[selected.plan].label],
                ['Courts',        String(selected.courtsCount)],
                ['Joined',        selected.joinedDate],
                ['Monthly Rev.',  selected.monthlyRevenue > 0 ? `₱${selected.monthlyRevenue.toLocaleString()}` : '—'],
                ['Status',        STATUS_CFG[selected.status].label],
              ].map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                  <span style={{ color:'#64748b', fontWeight:600 }}>{k}</span>
                  <span style={{ fontWeight:700, color:'#0f172a' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
  strip:     { display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' },
  searchBox: { display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:9, padding:'0 14px', height:38, flex:1, minWidth:220 },
  search:    { border:'none', outline:'none', fontSize:13, color:'#0f172a', background:'transparent', flex:1 },
  filterGroup:{ display:'flex', gap:4 },
  filterBtn: { padding:'6px 12px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer' },
  filterBtnActive: { background:A, color:'#fff', border:`1px solid ${A}` },
  card:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  table:     { width:'100%', borderCollapse:'collapse' as const, minWidth:900 },
  th:        { padding:'11px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8 },
  tr:        { borderBottom:'1px solid #f8fafc' },
  td:        { padding:'12px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
  avatar:    { width:32, height:32, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, flexShrink:0 },
  name:      { fontWeight:700, fontSize:13 },
  sub:       { fontSize:10, color:'#94a3b8', fontFamily:'monospace', marginTop:1 },
  badge:     { display:'inline-block', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700 },
  btnView:   { padding:'4px 10px', borderRadius:6, border:'1.5px solid #e2e8f0', background:'#fff', color:'#374151', fontSize:11, fontWeight:700, cursor:'pointer' },
};
const m: Record<string, React.CSSProperties> = {
  backdrop: { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(3px)' },
  panel:    { background:'#fff', borderRadius:16, width:'100%', maxWidth:440, boxShadow:'0 24px 64px rgba(0,0,0,.2)', overflow:'hidden' },
  head:     { display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid #f1f5f9' },
  title:    { fontSize:16, fontWeight:800, margin:0, color:'#0f172a' },
  close:    { background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#94a3b8', padding:4, lineHeight:1 },
};
