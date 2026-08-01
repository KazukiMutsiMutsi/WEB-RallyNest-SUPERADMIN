import React, { useState } from 'react';
import { SUBSCRIPTIONS } from '../data/mock';
import type { Subscription } from '../types';

const A = '#6366f1';
const PLAN_CFG = {
  starter:    { bg:'#f1f5f9', color:'#475569', label:'Starter',    price:'Free'   },
  pro:        { bg:'#eff6ff', color:'#2563eb', label:'Pro',        price:'₱2,999' },
  enterprise: { bg:'#faf5ff', color:'#7c3aed', label:'Enterprise', price:'₱7,999' },
};
const STATUS_CFG: Record<Subscription['status'], { bg:string; color:string; label:string }> = {
  active:    { bg:'#dcfce7', color:'#15803d', label:'Active'    },
  cancelled: { bg:'#f1f5f9', color:'#64748b', label:'Cancelled' },
  past_due:  { bg:'#fee2e2', color:'#dc2626', label:'Past Due'  },
  trialing:  { bg:'#fef3c7', color:'#b45309', label:'Trial'     },
};

export default function SuperSubscriptions() {
  const [subs] = useState<Subscription[]>(SUBSCRIPTIONS);
  const [statusF, setStatusF] = useState<'all' | Subscription['status']>('all');

  const filtered = statusF === 'all' ? subs : subs.filter(s => s.status === statusF);
  const mrr = subs.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0);

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Subscription Management</h2>
          <p style={s.pageSub}>{subs.length} subscriptions &nbsp;·&nbsp; MRR: ₱{mrr.toLocaleString()}</p>
        </div>
      </div>

      <div style={s.kpiRow}>
        {[
          { label:'MRR',         val:`₱${mrr.toLocaleString()}`,                              color:'#16a34a', bg:'#f0fdf4' },
          { label:'Active',      val:subs.filter(s=>s.status==='active').length,              color:'#6366f1', bg:'#eef2ff' },
          { label:'Past Due',    val:subs.filter(s=>s.status==='past_due').length,            color:'#dc2626', bg:'#fef2f2' },
          { label:'On Trial',    val:subs.filter(s=>s.status==='trialing').length,            color:'#d97706', bg:'#fffbeb' },
        ].map(k => (
          <div key={k.label} style={{ ...s.kpi, background: k.bg }}>
            <div style={{ ...s.kpiVal, color: k.color }}>{k.val}</div>
            <div style={s.kpiLbl}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div style={s.planRow}>
        {(['starter','pro','enterprise'] as const).map(plan => {
          const pc = PLAN_CFG[plan];
          const count = subs.filter(s => s.plan === plan).length;
          return (
            <div key={plan} style={{ ...s.planCard, borderTop:`3px solid ${pc.color}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{pc.label}</div>
              <div style={{ fontSize:11, color:'#64748b', marginTop:2 }}>{pc.price}/mo</div>
              <div style={{ fontSize:28, fontWeight:900, color:pc.color, marginTop:10 }}>{count}</div>
              <div style={{ fontSize:11, color:'#94a3b8' }}>tenants</div>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:6 }}>
        {(['all','active','trialing','past_due','cancelled'] as const).map(st => (
          <button key={st} onClick={() => setStatusF(st)} style={{ ...s.filterBtn, ...(statusF===st ? s.filterBtnActive : {}) }}>
            {st === 'all' ? 'All' : STATUS_CFG[st].label}
          </button>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>{['Tenant','Plan','Billing','Amount','Status','Start Date','Next Billing'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((sub, i) => {
                const pc = PLAN_CFG[sub.plan];
                const sc = STATUS_CFG[sub.status];
                return (
                  <tr key={sub.id} style={{ ...s.tr, background: i%2===0 ? '#fff' : '#fafafa' }}>
                    <td style={s.td}><span style={{ fontWeight:700 }}>{sub.tenantName}</span></td>
                    <td style={s.td}><span style={{ ...s.badge, background:pc.bg, color:pc.color }}>{pc.label}</span></td>
                    <td style={{ ...s.td, color:'#64748b', textTransform:'capitalize' }}>{sub.billingCycle}</td>
                    <td style={{ ...s.td, fontWeight:700, color: sub.amount > 0 ? '#16a34a' : '#64748b' }}>
                      {sub.amount > 0 ? `₱${sub.amount.toLocaleString()}` : 'Free'}
                    </td>
                    <td style={s.td}><span style={{ ...s.badge, background:sc.bg, color:sc.color }}>{sc.label}</span></td>
                    <td style={{ ...s.td, color:'#64748b' }}>{sub.startDate}</td>
                    <td style={{ ...s.td, color: sub.status==='past_due' ? '#dc2626' : '#64748b', fontWeight: sub.status==='past_due' ? 700 : 400 }}>{sub.nextBillingDate}</td>
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

const s: Record<string, React.CSSProperties> = {
  page:          { display:'flex', flexDirection:'column', gap:20 },
  pageHead:      { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle:     { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:       { fontSize:13, color:'#64748b', marginTop:4 },
  kpiRow:        { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 },
  kpi:           { borderRadius:12, padding:'16px 20px', border:'1px solid #e2e8f0' },
  kpiVal:        { fontSize:28, fontWeight:900, marginBottom:4 },
  kpiLbl:        { fontSize:12, fontWeight:700, color:'#64748b' },
  planRow:       { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 },
  planCard:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'16px 20px' },
  filterBtn:     { padding:'6px 14px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer' },
  filterBtnActive:{ background:A, color:'#fff', border:`1px solid ${A}` },
  card:          { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  table:         { width:'100%', borderCollapse:'collapse' as const, minWidth:700 },
  th:            { padding:'11px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8 },
  tr:            { borderBottom:'1px solid #f8fafc' },
  td:            { padding:'12px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
  badge:         { display:'inline-block', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700 },
};
