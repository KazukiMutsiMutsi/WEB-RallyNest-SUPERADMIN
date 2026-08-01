import React from 'react';
import { TENANTS, OWNER_ACCOUNTS, SUBSCRIPTIONS, SUPPORT_TICKETS, REVIEWS } from '../data/mock';

const A = '#6366f1';

const ic = (d: string, size = 20, color = 'currentColor') => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const WEEKLY_SIGNUPS = [
  { week:'W1 Jun', tenants:0, owners:0 },
  { week:'W2 Jun', tenants:1, owners:1 },
  { week:'W3 Jun', tenants:0, owners:0 },
  { week:'W4 Jun', tenants:1, owners:1 },
  { week:'W1 Jul', tenants:1, owners:1 },
  { week:'W2 Jul', tenants:0, owners:0 },
  { week:'W3 Jul', tenants:0, owners:0 },
  { week:'W4 Jul', tenants:1, owners:1 },
];

export default function SuperPlatformAnalytics() {
  const avgRating = REVIEWS.length > 0 ? (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1) : '0.0';
  const resolvedTickets = SUPPORT_TICKETS.filter(t => t.status === 'resolved' || t.status === 'closed').length;
  const resolutionRate = SUPPORT_TICKETS.length > 0 ? Math.round((resolvedTickets / SUPPORT_TICKETS.length) * 100) : 0;
  const maxWeekly = Math.max(...WEEKLY_SIGNUPS.map(w => w.tenants + w.owners), 1);

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <h2 style={s.pageTitle}>Platform Analytics</h2>
        <p style={s.pageSub}>Key performance indicators across the entire platform</p>
      </div>

      <div style={s.kpiGrid}>
        {[
          { label:'Total Tenants',        val:TENANTS.length,                                                         sub:`${TENANTS.filter(t=>t.status==='active').length} active`,   accent:'#6366f1', bg:'#eef2ff', icon:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z' },
          { label:'Total Owners',         val:OWNER_ACCOUNTS.length,                                                  sub:`${OWNER_ACCOUNTS.filter(o=>o.status==='active').length} active`, accent:'#0284c7', bg:'#f0f9ff', icon:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z' },
          { label:'Active Subscriptions', val:SUBSCRIPTIONS.filter(s=>s.status==='active').length,                    sub:`${SUBSCRIPTIONS.filter(s=>s.status==='trialing').length} on trial`, accent:'#16a34a', bg:'#f0fdf4', icon:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
          { label:'Avg Platform Rating',  val:avgRating + ' ★',                                                       sub:`${REVIEWS.length} total reviews`,                           accent:'#d97706', bg:'#fffbeb', icon:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
          { label:'Support Resolution',   val:`${resolutionRate}%`,                                                   sub:`${resolvedTickets} of ${SUPPORT_TICKETS.length} tickets`,   accent:'#7c3aed', bg:'#faf5ff', icon:'M20 6L9 17l-5-5' },
        ].map(stat => (
          <div key={stat.label} style={s.kpiCard}>
            <div style={{ ...s.kpiIcon, background:stat.bg, color:stat.accent }}>{ic(stat.icon, 18, stat.accent)}</div>
            <div style={{ ...s.kpiVal, color:stat.accent }}>{stat.val}</div>
            <div style={s.kpiLabel}>{stat.label}</div>
            <div style={s.kpiSub}>{stat.sub}</div>
          </div>
        ))}
      </div>

      <div style={s.twoCol}>
        {/* Signup trends */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Weekly Signups</div>
            <div style={s.cardSub}>Tenants & owners</div>
          </div>
          <div style={{ padding:'24px', display:'flex', alignItems:'flex-end', gap:10, height:180 }}>
            {WEEKLY_SIGNUPS.map(w => {
              const total = w.tenants + w.owners;
              return (
                <div key={w.week} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end' }}>
                  <span style={{ fontSize:10, fontWeight:700, color:'#374151' }}>{total || ''}</span>
                  <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:2, flex:1, justifyContent:'flex-end' }}>
                    {total > 0 && <div style={{ background:A, borderRadius:'3px 3px 0 0', height:`${(total/maxWeekly)*100}%`, minHeight:4 }} />}
                  </div>
                  <span style={{ fontSize:9, color:'#94a3b8', fontWeight:600, whiteSpace:'nowrap' }}>{w.week}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subscription mix */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Subscription Mix</div>
            <div style={s.cardSub}>By plan type</div>
          </div>
          <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>
            {(['starter','pro','enterprise'] as const).map(plan => {
              const count = SUBSCRIPTIONS.filter(s => s.plan === plan).length;
              const pct = SUBSCRIPTIONS.length > 0 ? (count / SUBSCRIPTIONS.length) * 100 : 0;
              const colors = { starter:'#64748b', pro:'#2563eb', enterprise:'#7c3aed' };
              const bgs    = { starter:'#f1f5f9', pro:'#eff6ff', enterprise:'#faf5ff' };
              return (
                <div key={plan}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:700, color:'#0f172a', textTransform:'capitalize' }}>{plan}</span>
                    <span style={{ fontSize:13, fontWeight:700, color:colors[plan] }}>{count} ({pct.toFixed(0)}%)</span>
                  </div>
                  <div style={s.barTrack}>
                    <div style={{ ...s.barFill, width:`${pct}%`, background:colors[plan] }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding:'16px 20px', borderTop:'1px solid #f1f5f9' }}>
            <div style={s.cardTitle}>Ticket Categories</div>
            {(['billing','technical','account','general'] as const).map(cat => {
              const count = SUPPORT_TICKETS.filter(t => t.category === cat).length;
              return (
                <div key={cat} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px solid #f8fafc', fontSize:13 }}>
                  <span style={{ color:'#64748b', textTransform:'capitalize' }}>{cat}</span>
                  <span style={{ fontWeight:700 }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:      { display:'flex', flexDirection:'column', gap:24 },
  pageHead:  {},
  pageTitle: { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:   { fontSize:13, color:'#64748b', marginTop:4 },
  kpiGrid:   { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 },
  kpiCard:   { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'18px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  kpiIcon:   { width:36, height:36, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 },
  kpiVal:    { fontSize:26, fontWeight:900, marginBottom:3 },
  kpiLabel:  { fontSize:12, fontWeight:700, color:'#0f172a' },
  kpiSub:    { fontSize:11, color:'#94a3b8', marginTop:2 },
  twoCol:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 },
  card:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardHead:  { padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  cardTitle: { fontSize:15, fontWeight:700, color:'#0f172a' },
  cardSub:   { fontSize:12, color:'#94a3b8' },
  barTrack:  { background:'#f1f5f9', borderRadius:99, height:7, overflow:'hidden' },
  barFill:   { height:'100%', borderRadius:99 },
};
