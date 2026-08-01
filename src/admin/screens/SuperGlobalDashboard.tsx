import React from 'react';
import { TENANTS, OWNER_ACCOUNTS, SUBSCRIPTIONS, SUPPORT_TICKETS } from '../data/mock';

const A = '#6366f1';

const ic = (d: string, size = 20, color = 'currentColor') => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

export default function SuperGlobalDashboard() {
  const totalMRR   = SUBSCRIPTIONS.filter(s => s.status === 'active').reduce((sum, s) => sum + s.amount, 0);
  const totalRev   = TENANTS.reduce((s, t) => s + t.monthlyRevenue, 0);
  const activeTen  = TENANTS.filter(t => t.status === 'active').length;
  const openTix    = SUPPORT_TICKETS.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  const stats = [
    { label:'Platform MRR',       val:`₱${totalMRR.toLocaleString()}`,    sub:'Active subscriptions',       accent:'#16a34a', bg:'#f0fdf4', icon:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6' },
    { label:'Active Tenants',     val:String(activeTen),                   sub:`of ${TENANTS.length} total`, accent:'#6366f1', bg:'#eef2ff', icon:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10' },
    { label:'Owner Accounts',     val:String(OWNER_ACCOUNTS.length),       sub:`${OWNER_ACCOUNTS.filter(o=>o.status==='active').length} active`, accent:'#0284c7', bg:'#f0f9ff', icon:'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8z' },
    { label:'Monthly Facility Rev',val:`₱${totalRev.toLocaleString()}`,    sub:'Across all facilities',      accent:'#d97706', bg:'#fffbeb', icon:'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6' },
    { label:'Open Tickets',       val:String(openTix),                     sub:'Needs attention',            accent:'#dc2626', bg:'#fef2f2', icon:'M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z' },
  ];

  const planDist = (['starter','pro','enterprise'] as const).map(plan => ({
    plan,
    count: TENANTS.filter(t => t.plan === plan).length,
    color: plan==='enterprise' ? '#7c3aed' : plan==='pro' ? '#2563eb' : '#64748b',
    label: plan.charAt(0).toUpperCase() + plan.slice(1),
  }));

  const statusDist = (['active','suspended','pending'] as const).map(st => ({
    status: st,
    count: TENANTS.filter(t => t.status === st).length,
    color: st==='active' ? '#16a34a' : st==='suspended' ? '#dc2626' : '#d97706',
  }));

  return (
    <div style={s.page}>
      {/* Banner */}
      <div style={s.banner}>
        <div>
          <div style={s.eyebrow}>Super Admin · Platform Overview</div>
          <div style={s.bannerTitle}>Global Dashboard</div>
          <div style={s.bannerSub}>Full visibility across all tenants, owners, and platform activity</div>
        </div>
        <div style={s.bannerMetrics}>
          <div style={s.bm}><div style={s.bmVal}>{TENANTS.length}</div><div style={s.bmLbl}>Tenants</div></div>
          <div style={s.bmDiv} />
          <div style={s.bm}><div style={s.bmVal}>{OWNER_ACCOUNTS.length}</div><div style={s.bmLbl}>Owners</div></div>
          <div style={s.bmDiv} />
          <div style={s.bm}><div style={s.bmVal}>₱{totalMRR.toLocaleString()}</div><div style={s.bmLbl}>MRR</div></div>
        </div>
      </div>

      {/* KPIs */}
      <div style={s.kpiGrid}>
        {stats.map(st => (
          <div key={st.label} style={s.kpiCard}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ ...s.kpiIcon, background:st.bg, color:st.accent }}>{ic(st.icon, 18, st.accent)}</div>
            </div>
            <div style={{ ...s.kpiVal, color:st.accent }}>{st.val}</div>
            <div style={s.kpiLabel}>{st.label}</div>
            <div style={s.kpiSub}>{st.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-col */}
      <div style={s.twoCol}>
        {/* Tenant by plan */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Tenants by Plan</div>
          </div>
          <div style={{ padding:'20px' }}>
            {planDist.map(p => (
              <div key={p.plan} style={{ marginBottom:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:13, fontWeight:700, color:'#0f172a' }}>{p.label}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:p.color }}>{p.count} tenants</span>
                </div>
                <div style={s.barTrack}>
                  <div style={{ ...s.barFill, width:`${(p.count / TENANTS.length) * 100}%`, background:p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tenant by status */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Tenant Status Distribution</div>
          </div>
          <div style={{ padding:'20px', display:'flex', flexDirection:'column', gap:14 }}>
            {statusDist.map(sd => (
              <div key={sd.status} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:sd.color, flexShrink:0 }} />
                <span style={{ fontSize:13, flex:1, textTransform:'capitalize', color:'#374151' }}>{sd.status}</span>
                <span style={{ fontSize:18, fontWeight:900, color:sd.color }}>{sd.count}</span>
              </div>
            ))}
          </div>
          <div style={{ padding:'16px 20px', borderTop:'1px solid #f1f5f9' }}>
            <div style={s.cardTitle}>Recent Support Tickets</div>
            {SUPPORT_TICKETS.slice(0, 3).map(t => (
              <div key={t.id} style={{ display:'flex', alignItems:'center', gap:10, marginTop:12 }}>
                <span style={{ fontSize:10, fontFamily:'monospace', color:'#94a3b8', minWidth:60 }}>{t.id}</span>
                <span style={{ fontSize:12, flex:1, color:'#374151', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{t.subject}</span>
                <span style={{ fontSize:11, fontWeight:700, color: t.priority==='urgent' ? '#dc2626' : t.priority==='high' ? '#d97706' : '#64748b', background: t.priority==='urgent' ? '#fee2e2' : t.priority==='high' ? '#fef3c7' : '#f1f5f9', padding:'2px 8px', borderRadius:99 }}>{t.priority}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:      { display:'flex', flexDirection:'column', gap:24 },
  banner:    { background:'linear-gradient(120deg,#0f0c29,#1a1060,#24243e)', borderRadius:16, padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20, color:'#fff', boxShadow:'0 8px 32px rgba(99,102,241,.2)' },
  eyebrow:   { fontSize:11, fontWeight:700, color:'#a5b4fc', letterSpacing:1.5, textTransform:'uppercase' },
  bannerTitle:{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1 },
  bannerSub: { fontSize:13, color:'#818cf8', marginTop:6 },
  bannerMetrics:{ display:'flex', alignItems:'center', background:'rgba(255,255,255,.08)', borderRadius:12, border:'1px solid rgba(255,255,255,.12)', overflow:'hidden' },
  bm:        { padding:'14px 22px', display:'flex', flexDirection:'column', alignItems:'center', gap:3 },
  bmVal:     { fontSize:22, fontWeight:900, color:'#fff' },
  bmLbl:     { fontSize:11, color:'#a5b4fc', fontWeight:600, whiteSpace:'nowrap' },
  bmDiv:     { width:1, height:48, background:'rgba(255,255,255,.12)' },
  kpiGrid:   { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 },
  kpiCard:   { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'18px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  kpiIcon:   { width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' },
  kpiVal:    { fontSize:26, fontWeight:900, marginBottom:3 },
  kpiLabel:  { fontSize:12, fontWeight:700, color:'#0f172a' },
  kpiSub:    { fontSize:11, color:'#94a3b8', marginTop:2 },
  twoCol:    { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 },
  card:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardHead:  { padding:'16px 20px', borderBottom:'1px solid #f1f5f9' },
  cardTitle: { fontSize:15, fontWeight:700, color:'#0f172a' },
  barTrack:  { background:'#f1f5f9', borderRadius:99, height:7, overflow:'hidden' },
  barFill:   { height:'100%', borderRadius:99 },
};
