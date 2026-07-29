import React, { useState } from 'react';
import StatusBadge from '../components/StatusBadge';
import { getAllBookings, getAllCourts, updateBooking } from '@/src/booking/bookingStore';
import { TODAY } from '../data/mock';
import { fmt12 } from '../utils/time';
import type { BookingStatus, StaffBooking } from '../types';

const E = '#10b981'; // emerald accent

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── SVG icons ─────────────────────────────────────────────────────────────────
const ic = (d: string, size = 18, color = 'currentColor') => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

export default function StaffDashboard() {
  const [bookings, setBookings] = useState<StaffBooking[]>(getAllBookings());
  const courts = getAllCourts();

  const todayB    = bookings.filter(b => b.date === TODAY);
  const total     = todayB.length;
  const checkedIn = todayB.filter(b => b.status === 'checked_in').length;
  const pending   = todayB.filter(b => b.status === 'pending').length;
  const completed = todayB.filter(b => b.status === 'completed').length;
  const reschedules = todayB.filter(b => b.status === 'reschedule_requested').length;
  const activeCourts = courts.filter(c => c.active).length;
  const todayRev  = todayB.filter(b => b.paid).reduce((s, b) => s + b.amount, 0);

  const upcoming = [...todayB]
    .filter(b => b.status === 'confirmed' || b.status === 'pending' || b.status === 'reschedule_requested')
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 6);

  const doAction = (id: string, status: BookingStatus) => {
    updateBooking(id, { status });
    setBookings(getAllBookings());
  };

  const stats = [
    { label:"Today's Bookings", val:total,        sub:`${completed} completed`,         accent:'#2563eb', bg:'#eff6ff', icon: ic('M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z') },
    { label:'On Court Now',      val:checkedIn,    sub:`${total-checkedIn} remaining`,   accent:'#16a34a', bg:'#f0fdf4', icon: ic('M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01l-3-3') },
    { label:'Pending Approval',  val:pending,      sub:'Awaiting confirmation',          accent:'#d97706', bg:'#fffbeb', icon: ic('M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2') },
    { label:'Reschedule Req.',   val:reschedules,  sub:'Customer requests',              accent:'#7c3aed', bg:'#faf5ff', icon: ic('M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15') },
    { label:'Active Courts',     val:activeCourts, sub:`of ${courts.length} total`,      accent:'#0284c7', bg:'#f0f9ff', icon: ic('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5') },
  ];

  return (
    <div style={s.page}>
      {/* ── Banner ── */}
      <div style={s.banner}>
        <div style={s.bannerLeft}>
          <div style={s.eyebrow}>PicklePro · Staff Portal</div>
          <div style={s.bannerTitle}>{getGreeting()}, Alex</div>
          <div style={s.bannerSub}>
            {pending > 0 || reschedules > 0
              ? `${pending} pending · ${reschedules} reschedule${reschedules !== 1 ? 's' : ''} · ${total - completed} remaining`
              : `All caught up · ${total} bookings today`}
          </div>
        </div>
        <div style={s.bannerRight}>
          <div style={s.bannerMetrics}>
            <Metric val={`₱${todayRev.toLocaleString()}`} label="Revenue today" />
            <div style={s.mDivider} />
            <Metric val={String(total)} label="Bookings today" />
            <div style={s.mDivider} />
            <Metric val={String(checkedIn)} label="On court" />
          </div>
        </div>
      </div>

      {/* ── KPI grid ── */}
      <div style={s.kpiGrid}>
        {stats.map(st => (
          <div key={st.label} style={s.kpiCard}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ ...s.kpiIcon, background: st.bg }}>{st.icon}</div>
            </div>
            <div style={{ ...s.kpiVal, color: st.accent }}>{st.val}</div>
            <div style={s.kpiLabel}>{st.label}</div>
            <div style={s.kpiSub}>{st.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Two-column ── */}
      <div style={s.twoCol}>
        {/* Upcoming bookings */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div>
              <div style={s.cardTitle}>Upcoming Bookings</div>
              <div style={s.cardSub}>{upcoming.length} need action</div>
            </div>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>{['Player','Court','Time','Payment','Status','Action'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {upcoming.length === 0 ? (
                  <tr><td colSpan={6} style={s.empty}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                      {ic('M20 6L9 17l-5-5', 28, '#cbd5e1')}
                      <span>No pending bookings</span>
                    </div>
                  </td></tr>
                ) : upcoming.map((b, i) => (
                  <tr key={b.id} style={{ ...s.tr, background: i%2===0?'#fff':'#fafafa', ...(b.status==='reschedule_requested'?{background:'#fdf4ff'}:{}) }}>
                    <td style={s.td}>
                      <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                        <div style={{ ...s.avatar, background: E+'18', color: E }}>{b.playerName[0]}</div>
                        <div>
                          <div style={s.playerName}>{b.playerName}</div>
                          <div style={s.playerPhone}>{b.playerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>{b.courtName}</td>
                    <td style={{ ...s.td, whiteSpace:'nowrap' as const, color:'#64748b' }}>{fmt12(b.startTime)} – {fmt12(b.endTime)}</td>
                    <td style={s.td}>
                      <span style={b.paid ? s.paid : s.unpaid}>{b.paid ? 'Paid' : 'Unpaid'}</span>
                    </td>
                    <td style={s.td}><StatusBadge status={b.status} size="sm" /></td>
                    <td style={s.td}>
                      <div style={{ display:'flex', gap:5 }}>
                        {b.status === 'pending' && (
                          <>
                            <Btn color={E} onClick={() => doAction(b.id, 'confirmed')}>Approve</Btn>
                            <Btn color="#dc2626" onClick={() => doAction(b.id, 'cancelled')}>Decline</Btn>
                          </>
                        )}
                        {b.status === 'confirmed' && (
                          <Btn color="#2563eb" onClick={() => doAction(b.id, 'checked_in')}>On Court</Btn>
                        )}
                        {b.status === 'reschedule_requested' && (
                          <span style={{ fontSize:11, color:'#7c3aed', fontWeight:600 }}>See Schedule</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Court overview */}
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardTitle}>Court Overview</div>
          </div>
          {courts.map(c => {
            const count = todayB.filter(b => b.courtId === c.id && b.status !== 'cancelled').length;
            return (
              <div key={c.id} style={s.courtRow}>
                <div style={{ ...s.courtDot, background: c.active ? '#16a34a' : '#94a3b8', boxShadow: c.active ? '0 0 0 3px #bbf7d0' : 'none' }} />
                <div style={{ flex:1 }}>
                  <div style={s.courtName}>{c.name}</div>
                  <div style={s.courtMeta}>{c.type} · {count} bookings today</div>
                </div>
                <span style={{ ...s.statusPill, background: c.active ? '#dcfce7' : '#f1f5f9', color: c.active ? '#15803d' : '#64748b' }}>
                  {c.active ? 'Open' : 'Closed'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Metric({ val, label }: { val: string; label: string }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'14px 22px' }}>
      <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>{val}</div>
      <div style={{ fontSize:11, color:'#6ee7b7', fontWeight:600, whiteSpace:'nowrap' }}>{label}</div>
    </div>
  );
}

function Btn({ color, onClick, children }: { color:string; onClick:()=>void; children:React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ padding:'4px 10px', borderRadius:6, border:'none', background:color, color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' as const }}>
      {children}
    </button>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:      { display:'flex', flexDirection:'column', gap:24 },
  banner:    { background:'linear-gradient(120deg,#064e3b,#065f46,#047857)', borderRadius:16, padding:'24px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, boxShadow:'0 8px 28px rgba(16,185,129,.2)' },
  bannerLeft:{ display:'flex', flexDirection:'column', gap:6 },
  eyebrow:   { fontSize:11, fontWeight:700, color:'#6ee7b7', letterSpacing:1.5, textTransform:'uppercase' },
  bannerTitle:{ fontSize:22, fontWeight:900, color:'#fff' },
  bannerSub: { fontSize:13, color:'#a7f3d0' },
  bannerRight:{},
  bannerMetrics:{ display:'flex', background:'rgba(255,255,255,.1)', borderRadius:12, border:'1px solid rgba(255,255,255,.15)', overflow:'hidden' },
  mDivider:  { width:1, background:'rgba(255,255,255,.15)' },
  kpiGrid:   { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16 },
  kpiCard:   { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'18px 20px', boxShadow:'0 1px 4px rgba(0,0,0,.04)' },
  kpiIcon:   { width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center' },
  kpiVal:    { fontSize:26, fontWeight:900, marginBottom:3 },
  kpiLabel:  { fontSize:12, fontWeight:700, color:'#0f172a' },
  kpiSub:    { fontSize:11, color:'#94a3b8', marginTop:2 },
  twoCol:    { display:'grid', gridTemplateColumns:'1fr 300px', gap:20, alignItems:'start' },
  card:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.04)' },
  cardHead:  { padding:'16px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  cardTitle: { fontSize:15, fontWeight:700, color:'#0f172a' },
  cardSub:   { fontSize:12, color:'#94a3b8', marginTop:3 },
  table:     { width:'100%', borderCollapse:'collapse' as const, minWidth:480 },
  th:        { padding:'10px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8, whiteSpace:'nowrap' as const },
  tr:        { borderBottom:'1px solid #f8fafc' },
  td:        { padding:'11px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
  avatar:    { width:30, height:30, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 },
  playerName:{ fontWeight:700, fontSize:13 },
  playerPhone:{ fontSize:11, color:'#94a3b8' },
  paid:      { display:'inline-block', padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:700, background:'#dcfce7', color:'#15803d' },
  unpaid:    { display:'inline-block', padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:700, background:'#fef3c7', color:'#b45309' },
  empty:     { padding:40, textAlign:'center' as const, color:'#94a3b8', fontSize:13 },
  courtRow:  { display:'flex', alignItems:'center', gap:12, padding:'13px 20px', borderBottom:'1px solid #f8fafc' },
  courtDot:  { width:10, height:10, borderRadius:'50%', flexShrink:0, transition:'box-shadow 200ms' },
  courtName: { fontSize:13, fontWeight:700, color:'#0f172a' },
  courtMeta: { fontSize:11, color:'#94a3b8', marginTop:1 },
  statusPill:{ fontSize:11, fontWeight:700, padding:'2px 9px', borderRadius:99 },
};
