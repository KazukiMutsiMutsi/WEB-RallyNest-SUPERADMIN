import React, { useState } from 'react';
import { getAllBookings, getAllCourts } from '@/src/booking/bookingStore';
import type { BookingStatus, StaffBooking } from '../types';
import { fmt12 } from '../utils/time';

const E = '#10b981';

const STATUS_CFG: Record<BookingStatus, { bg: string; color: string; label: string }> = {
  confirmed:            { bg:'#dbeafe', color:'#1d4ed8', label:'Confirmed'  },
  pending:              { bg:'#fef3c7', color:'#b45309', label:'Pending'    },
  checked_in:           { bg:'#dcfce7', color:'#15803d', label:'On Court'   },
  completed:            { bg:'#f1f5f9', color:'#475569', label:'Completed'  },
  cancelled:            { bg:'#fee2e2', color:'#dc2626', label:'Cancelled'  },
  no_show:              { bg:'#fee2e2', color:'#dc2626', label:'No Show'    },
  reschedule_requested: { bg:'#fdf4ff', color:'#7c3aed', label:'Reschedule'},
};

export default function StaffPlayers() {
  const courts   = getAllCourts();
  const bookings = getAllBookings() as StaffBooking[];
  const [search, setSearch] = useState('');

  const allPlayers = bookings.filter(b => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return b.playerName.toLowerCase().includes(q) || b.playerPhone.includes(q) || b.courtName.toLowerCase().includes(q);
  });

  const totalRevenue = bookings.filter(b => b.paid).reduce((s, b) => s + b.amount, 0);
  const totalPlayers = new Set(bookings.map(b => b.playerPhone)).size;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Players</h2>
          <p style={s.pageSub}>{totalPlayers} unique players · ₱{totalRevenue.toLocaleString()} total revenue</p>
        </div>
        <div style={s.searchWrap}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
          <input style={s.searchInput} placeholder="Search player or court..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Court columns */}
      <div style={s.columns}>
        {courts.map(court => {
          const players = allPlayers
            .filter(b => b.courtId === court.id)
            .sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.startTime.localeCompare(b.startTime));

          const rev = players.filter(b => b.paid).reduce((s, b) => s + b.amount, 0);

          return (
            <div key={court.id} style={s.col}>
              {/* Column header */}
              <div style={s.colHead}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ ...s.courtMark, background: court.active ? E+'18' : '#f1f5f9', color: court.active ? E : '#94a3b8' }}>
                    {court.name.replace('Court ', '')}
                  </div>
                  <div>
                    <div style={s.courtName}>{court.name}</div>
                    <div style={s.courtType}>{court.type}</div>
                  </div>
                </div>
                <span style={{ ...s.activePill, background: court.active ? '#dcfce7' : '#f1f5f9', color: court.active ? '#15803d' : '#64748b' }}>
                  {court.active ? 'Open' : 'Closed'}
                </span>
              </div>

              {/* Revenue sub-row */}
              <div style={s.revenueRow}>
                <span style={s.revLabel}>Revenue</span>
                <span style={s.revVal}>₱{rev.toLocaleString()}</span>
                <span style={s.revCount}>{players.length} booking{players.length !== 1 ? 's' : ''}</span>
              </div>

              {/* Player list */}
              <div style={s.colBody}>
                {players.length === 0 ? (
                  <div style={s.empty}>No bookings</div>
                ) : players.map(p => {
                  const st = STATUS_CFG[p.status];
                  return (
                    <div key={p.id} style={s.card}>
                      <div style={s.cardTop}>
                        <div style={{ ...s.avatar, background: E+'18', color: E }}>{p.playerName[0]}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={s.playerName}>{p.playerName}</div>
                          <div style={s.playerPhone}>{p.playerPhone}</div>
                        </div>
                        <span style={{ ...s.statusBadge, background: st.bg, color: st.color }}>{st.label}</span>
                      </div>

                      <div style={s.chips}>
                        <Chip label={p.date} />
                        <Chip label={`${fmt12(p.startTime)} – ${fmt12(p.endTime)}`} />
                        <Chip label={`${p.durationHrs}hr${p.durationHrs !== 1 ? 's' : ''}`} />
                        <Chip label={p.companions === 0 ? 'Solo' : `+${p.companions} companion${p.companions > 1 ? 's' : ''}`} />
                        <span style={{ ...s.chipBase, background: p.paid ? '#dcfce7' : '#fef3c7', color: p.paid ? '#15803d' : '#b45309', fontWeight:700 }}>
                          ₱{p.amount.toLocaleString()} · {p.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>

                      <div style={s.bookingId}>{p.id}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return <span style={s.chipBase}>{label}</span>;
}

const s: Record<string, React.CSSProperties> = {
  page:        { display:'flex', flexDirection:'column', gap:20 },
  pageHead:    { display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 },
  pageTitle:   { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:     { fontSize:13, color:'#64748b', marginTop:3 },
  searchWrap:  { display:'flex', alignItems:'center', gap:8, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:9, padding:'0 14px', height:38 },
  searchInput: { border:'none', outline:'none', fontSize:13, color:'#0f172a', background:'transparent', minWidth:200 },
  columns:     { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:20, alignItems:'start' },
  col:         { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.04)' },
  colHead:     { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid #f1f5f9', background:'#f8fafc' },
  courtMark:   { width:36, height:36, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, flexShrink:0 },
  courtName:   { fontSize:15, fontWeight:800, color:'#0f172a' },
  courtType:   { fontSize:11, color:'#94a3b8', marginTop:1 },
  activePill:  { fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:99 },
  revenueRow:  { display:'flex', alignItems:'center', gap:8, padding:'10px 20px', borderBottom:'1px solid #f1f5f9', background:'#f0fdf4' },
  revLabel:    { fontSize:11, fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:.5 },
  revVal:      { fontSize:14, fontWeight:800, color:'#15803d', flex:1 },
  revCount:    { fontSize:11, color:'#94a3b8' },
  colBody:     { display:'flex', flexDirection:'column', gap:12, padding:16 },
  empty:       { fontSize:13, color:'#94a3b8', textAlign:'center', padding:'28px 0' },
  card:        { border:'1px solid #e2e8f0', borderRadius:11, padding:'14px 16px', display:'flex', flexDirection:'column', gap:9 },
  cardTop:     { display:'flex', alignItems:'center', gap:10 },
  avatar:      { width:38, height:38, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:800, flexShrink:0 },
  playerName:  { fontSize:14, fontWeight:700, color:'#0f172a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  playerPhone: { fontSize:12, color:'#64748b', marginTop:1 },
  statusBadge: { fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:99, flexShrink:0 },
  chips:       { display:'flex', flexWrap:'wrap', gap:6 },
  chipBase:    { fontSize:11, color:'#475569', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'3px 9px', whiteSpace:'nowrap' },
  bookingId:   { fontSize:10, fontFamily:'monospace', color:'#94a3b8' },
};
