import React, { useState } from 'react';
import { getAllBookings, getAllCourts } from '@/src/booking/bookingStore';

const A = '#6366f1';
type Period = 'daily' | 'weekly' | 'monthly';

const SC: Record<string,string> = {
  confirmed:'#2563eb', pending:'#d97706', checked_in:'#16a34a',
  completed:'#475569', cancelled:'#dc2626', no_show:'#dc2626', reschedule_requested:'#7c3aed',
};
const SL: Record<string,string> = {
  confirmed:'Confirmed', pending:'Pending', checked_in:'On Court',
  completed:'Completed', cancelled:'Cancelled', no_show:'No Show', reschedule_requested:'Reschedule',
};

/* ── Small SVG icons ─────────────────────────────────────────────────────── */
const ic = (d: string, color = 'currentColor') => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

export default function AdminReports() {
  const [period, setPeriod] = useState<Period>('monthly');
  const bookings = getAllBookings();
  const courts   = getAllCourts();

  const paid          = bookings.filter(b => b.paid);
  const totalRevenue  = paid.reduce((s, b) => s + b.amount, 0);
  const totalBookings = bookings.length;
  const avgPerBooking = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;
  const paidRate      = totalBookings > 0 ? Math.round((paid.length / totalBookings) * 100) : 0;
  const completedRate = totalBookings > 0 ? Math.round((bookings.filter(b=>b.status==='completed').length / totalBookings) * 100) : 0;

  const courtStats = courts.map(c => ({
    name:      c.name,
    revenue:   bookings.filter(b => b.courtId === c.id && b.paid).reduce((s, b) => s + b.amount, 0),
    bookings:  bookings.filter(b => b.courtId === c.id).length,
    completed: bookings.filter(b => b.courtId === c.id && b.status === 'completed').length,
    noShow:    bookings.filter(b => b.courtId === c.id && b.status === 'no_show').length,
    utilPct:   0,
  }));
  const maxRev = Math.max(...courtStats.map(c => c.revenue), 1);
  courtStats.forEach(c => { c.utilPct = Math.round((c.revenue / maxRev) * 100); });

  const statusCounts: Record<string,number> = {};
  bookings.forEach(b => { statusCounts[b.status] = (statusCounts[b.status] || 0) + 1; });
  const sortedStatuses = Object.entries(statusCounts).sort((a,b) => b[1] - a[1]);

  const kpis = [
    { label:'Total Revenue',    val:`₱${totalRevenue.toLocaleString()}`, accent:'#16a34a', bg:'#f0fdf4', icon: ic('M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', '#16a34a') },
    { label:'Total Bookings',   val:String(totalBookings),               accent:'#2563eb', bg:'#eff6ff', icon: ic('M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z', '#2563eb') },
    { label:'Avg per Booking',  val:`₱${avgPerBooking.toLocaleString()}`,accent:'#7c3aed', bg:'#faf5ff', icon: ic('M18 20V10M12 20V4M6 20v-6', '#7c3aed') },
    { label:'Payment Rate',     val:`${paidRate}%`,                      accent:'#0284c7', bg:'#f0f9ff', icon: ic('M20 6L9 17l-5-5', '#0284c7') },
    { label:'Completion Rate',  val:`${completedRate}%`,                 accent:'#d97706', bg:'#fffbeb', icon: ic('M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3', '#d97706') },
  ];

  return (
    <div style={s.page}>
      {/* Header + period toggle */}
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Reports</h2>
          <p style={s.pageSub}>Venue performance and booking analytics</p>
        </div>
        <div style={s.periodRow}>
          {(['daily','weekly','monthly'] as Period[]).map(p => (
            <button key={p} style={{ ...s.periodBtn, ...(period === p ? s.periodActive : {}) }} onClick={() => setPeriod(p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div style={s.kpiGrid}>
        {kpis.map(k => (
          <div key={k.label} style={s.kpiCard}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
              <div style={{ ...s.kpiIcon, background: k.bg }}>{k.icon}</div>
              <span style={{ fontSize:11, color:'#94a3b8' }}>{period}</span>
            </div>
            <div style={{ ...s.kpiVal, color: k.accent }}>{k.val}</div>
            <div style={s.kpiLabel}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column */}
      <div style={s.twoCol}>
        {/* Revenue by court */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Revenue by Court</div>
            <div style={s.cardSub}>Total: ₱{totalRevenue.toLocaleString()}</div>
          </div>
          <div style={s.courtList}>
            {courtStats.map(c => (
              <div key={c.name} style={s.courtRow}>
                <div style={s.courtMeta}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'#0f172a' }}>{c.name}</div>
                    <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>
                      {c.bookings} bookings &nbsp;·&nbsp; {c.completed} completed &nbsp;·&nbsp; {c.noShow} no-show
                    </div>
                  </div>
                  <div style={{ textAlign:'right' as const }}>
                    <div style={{ fontSize:15, fontWeight:800, color:'#16a34a' }}>₱{c.revenue.toLocaleString()}</div>
                    <div style={{ fontSize:11, color:'#94a3b8', marginTop:1 }}>{c.utilPct}% share</div>
                  </div>
                </div>
                <div style={s.barTrack}>
                  <div style={{ ...s.barFill, width:`${c.utilPct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status breakdown */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Booking Status Breakdown</div>
            <div style={s.cardSub}>{totalBookings} total</div>
          </div>
          <div style={s.statusList}>
            {sortedStatuses.map(([status, count]) => {
              const pct = Math.round((count / totalBookings) * 100);
              return (
                <div key={status} style={s.statusRow}>
                  <div style={{ ...s.statusDot, background: SC[status] ?? '#94a3b8' }} />
                  <span style={s.statusLabel}>{SL[status] ?? status}</span>
                  <div style={s.statusRight}>
                    <span style={s.statusCount}>{count}</span>
                    <span style={s.statusPct}>{pct}%</span>
                  </div>
                  <div style={s.miniBar}>
                    <div style={{ ...s.miniFill, width:`${pct}%`, background: SC[status] ?? '#94a3b8' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pie-like legend */}
          <div style={s.legend}>
            {sortedStatuses.slice(0,4).map(([status]) => (
              <div key={status} style={s.legendItem}>
                <div style={{ width:8, height:8, borderRadius:2, background: SC[status] ?? '#94a3b8', flexShrink:0 }} />
                <span style={{ fontSize:11, color:'#64748b' }}>{SL[status]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:        { display:'flex', flexDirection:'column', gap:24 },
  pageHead:    { display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 },
  pageTitle:   { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:     { fontSize:13, color:'#64748b', marginTop:3 },
  periodRow:   { display:'flex', background:'#fff', border:'1px solid #e2e8f0', borderRadius:10, overflow:'hidden' },
  periodBtn:   { padding:'8px 20px', border:'none', background:'transparent', fontSize:13, fontWeight:600, color:'#64748b', cursor:'pointer' },
  periodActive:{ background:A, color:'#fff' },
  kpiGrid:     { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 },
  kpiCard:     { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'18px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  kpiIcon:     { width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' },
  kpiVal:      { fontSize:26, fontWeight:900, marginBottom:3 },
  kpiLabel:    { fontSize:12, fontWeight:700, color:'#64748b' },
  twoCol:      { display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, alignItems:'start' },
  card:        { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardHead:    { padding:'16px 20px', borderBottom:'1px solid #f1f5f9' },
  cardTitle:   { fontSize:15, fontWeight:700, color:'#0f172a' },
  cardSub:     { fontSize:12, color:'#94a3b8', marginTop:2 },
  courtList:   { padding:'16px 20px', display:'flex', flexDirection:'column', gap:20 },
  courtRow:    { display:'flex', flexDirection:'column', gap:8 },
  courtMeta:   { display:'flex', justifyContent:'space-between', alignItems:'flex-start' },
  barTrack:    { background:'#f1f5f9', borderRadius:99, height:6, overflow:'hidden' },
  barFill:     { background:A, height:'100%', borderRadius:99 },
  statusList:  { padding:'16px 20px', display:'flex', flexDirection:'column', gap:14 },
  statusRow:   { display:'flex', alignItems:'center', gap:10 },
  statusDot:   { width:10, height:10, borderRadius:3, flexShrink:0 },
  statusLabel: { flex:1, fontSize:13, color:'#0f172a' },
  statusRight: { display:'flex', gap:8, alignItems:'center' },
  statusCount: { fontSize:13, fontWeight:700, color:'#0f172a', minWidth:24, textAlign:'right' as const },
  statusPct:   { fontSize:11, color:'#94a3b8', minWidth:30, textAlign:'right' as const },
  miniBar:     { width:72, background:'#f1f5f9', borderRadius:99, height:5, overflow:'hidden', flexShrink:0 },
  miniFill:    { height:'100%', borderRadius:99 },
  legend:      { display:'flex', gap:12, flexWrap:'wrap', padding:'12px 20px', borderTop:'1px solid #f1f5f9', background:'#f8fafc' },
  legendItem:  { display:'flex', alignItems:'center', gap:5 },
};
