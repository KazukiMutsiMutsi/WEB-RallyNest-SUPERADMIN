import React, { useState } from 'react';
import { TENANTS, SUBSCRIPTIONS } from '../data/mock';

const A = '#6366f1';

const MONTHLY = [
  { month:'Feb', revenue:52000, subs:8000  },
  { month:'Mar', revenue:68000, subs:11000 },
  { month:'Apr', revenue:75000, subs:14000 },
  { month:'May', revenue:82000, subs:16999 },
  { month:'Jun', revenue:90000, subs:18997 },
  { month:'Jul', revenue:98000, subs:21996 },
  { month:'Aug', revenue:115400, subs:25995},
];

export default function SuperRevenue() {
  const [tab, setTab] = useState<'overview'|'breakdown'>('overview');
  const mrr    = SUBSCRIPTIONS.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0);
  const facRev = TENANTS.reduce((s, t) => s + t.monthlyRevenue, 0);
  const total  = mrr + facRev;
  const maxRev = Math.max(...MONTHLY.map(m => m.revenue));

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Revenue Analytics</h2>
          <p style={s.pageSub}>Platform-wide revenue overview</p>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {(['overview','breakdown'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.tabBtn, ...(tab===t ? s.tabBtnActive : {}) }}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={s.kpiRow}>
        {[
          { label:'Total Revenue (Aug)',   val:`₱${total.toLocaleString()}`,   color:'#16a34a', bg:'#f0fdf4' },
          { label:'MRR (Subscriptions)',   val:`₱${mrr.toLocaleString()}`,     color:'#6366f1', bg:'#eef2ff' },
          { label:'Facility Revenue',      val:`₱${facRev.toLocaleString()}`,  color:'#0284c7', bg:'#f0f9ff' },
          { label:'ARR Projection',        val:`₱${(mrr*12).toLocaleString()}`,color:'#7c3aed', bg:'#faf5ff' },
        ].map(k => (
          <div key={k.label} style={{ ...s.kpi, background: k.bg }}>
            <div style={{ ...s.kpiVal, color: k.color }}>{k.val}</div>
            <div style={s.kpiLbl}>{k.label}</div>
          </div>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Monthly Revenue Trend</div>
            <div style={s.cardSub}>Platform total · last 7 months</div>
          </div>
          <div style={{ padding:'24px', display:'flex', alignItems:'flex-end', gap:12, height:220 }}>
            {MONTHLY.map(m => (
              <div key={m.month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6, height:'100%', justifyContent:'flex-end' }}>
                <span style={{ fontSize:11, fontWeight:700, color:'#374151' }}>₱{(m.revenue/1000).toFixed(0)}k</span>
                <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:2, justifyContent:'flex-end', flex:1 }}>
                  <div style={{ background:A, borderRadius:'4px 4px 0 0', height:`${(m.revenue/maxRev)*100}%`, minHeight:4, transition:'height 400ms' }} />
                </div>
                <span style={{ fontSize:11, color:'#94a3b8', fontWeight:600 }}>{m.month}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'breakdown' && (
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Revenue by Tenant</div>
            <div style={s.cardSub}>Monthly facility revenue</div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>{['Facility','Plan','Status','Monthly Revenue','Share'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {[...TENANTS].sort((a,b) => b.monthlyRevenue - a.monthlyRevenue).map((t, i) => (
                  <tr key={t.id} style={{ ...s.tr, background: i%2===0 ? '#fff' : '#fafafa' }}>
                    <td style={{ ...s.td, fontWeight:700 }}>{t.facilityName}</td>
                    <td style={s.td}><span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:99, background: t.plan==='enterprise' ? '#faf5ff' : t.plan==='pro' ? '#eff6ff' : '#f1f5f9', color: t.plan==='enterprise' ? '#7c3aed' : t.plan==='pro' ? '#2563eb' : '#475569' }}>{t.plan}</span></td>
                    <td style={s.td}><span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:99, background: t.status==='active' ? '#dcfce7' : '#fee2e2', color: t.status==='active' ? '#15803d' : '#dc2626' }}>{t.status}</span></td>
                    <td style={{ ...s.td, fontWeight:700, color: t.monthlyRevenue > 0 ? '#16a34a' : '#94a3b8' }}>{t.monthlyRevenue > 0 ? `₱${t.monthlyRevenue.toLocaleString()}` : '—'}</td>
                    <td style={s.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                        <div style={{ flex:1, background:'#f1f5f9', borderRadius:99, height:6, overflow:'hidden' }}>
                          <div style={{ background:A, height:'100%', borderRadius:99, width:`${facRev > 0 ? (t.monthlyRevenue/facRev)*100 : 0}%` }} />
                        </div>
                        <span style={{ fontSize:12, fontWeight:700, color:'#64748b', minWidth:36 }}>{facRev > 0 ? `${((t.monthlyRevenue/facRev)*100).toFixed(0)}%` : '0%'}</span>
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
  );
}

const facRev = TENANTS.reduce((s, t) => s + t.monthlyRevenue, 0);

const s: Record<string, React.CSSProperties> = {
  page:      { display:'flex', flexDirection:'column', gap:20 },
  pageHead:  { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle: { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:   { fontSize:13, color:'#64748b', marginTop:4 },
  kpiRow:    { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 },
  kpi:       { borderRadius:12, padding:'16px 20px', border:'1px solid #e2e8f0' },
  kpiVal:    { fontSize:26, fontWeight:900, marginBottom:4 },
  kpiLbl:    { fontSize:12, fontWeight:700, color:'#64748b' },
  tabBtn:    { padding:'7px 16px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', fontSize:13, fontWeight:600, color:'#64748b', cursor:'pointer' },
  tabBtnActive:{ background:A, color:'#fff', border:`1px solid ${A}` },
  card:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardHead:  { padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  cardTitle: { fontSize:15, fontWeight:700, color:'#0f172a' },
  cardSub:   { fontSize:12, color:'#94a3b8' },
  table:     { width:'100%', borderCollapse:'collapse' as const },
  th:        { padding:'11px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8 },
  tr:        { borderBottom:'1px solid #f8fafc' },
  td:        { padding:'12px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
};
