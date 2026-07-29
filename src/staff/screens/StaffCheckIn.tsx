import React, { useState } from 'react';
import RescheduleModal from '../components/RescheduleModal';
import StatusBadge from '../components/StatusBadge';
import { getAllBookings, updateBooking } from '@/src/booking/bookingStore';
import { TODAY } from '../data/mock';
import type { BookingStatus, StaffBooking } from '../types';
import { fmt12 } from '../utils/time';

const E = '#10b981';

export default function StaffCheckIn() {
  const [bookings, setBookings]     = useState<StaffBooking[]>(getAllBookings());
  const [search,   setSearch]       = useState('');
  const [rescheduleTarget, setRT]   = useState<StaffBooking | null>(null);

  const updateStatus = (id: string, status: BookingStatus) => {
    updateBooking(id, { status });
    setBookings(getAllBookings());
  };

  const handleAcceptReschedule = (b: StaffBooking) => setRT(b);
  const handleDeclineReschedule = (id: string)     => updateStatus(id, 'confirmed');

  const handleRescheduleConfirm = (updated: Pick<StaffBooking,'date'|'startTime'|'endTime'|'durationHrs'|'courtId'|'courtName'>) => {
    if (!rescheduleTarget) return;
    updateBooking(rescheduleTarget.id, { ...updated, status:'confirmed', rescheduleNote:undefined });
    setBookings(getAllBookings());
    setRT(null);
  };

  const todayAll    = bookings.filter(b => b.date === TODAY);
  const todayActive = todayAll
    .filter(b => ['confirmed','pending','checked_in','reschedule_requested'].includes(b.status))
    .filter(b => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return b.playerName.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.courtName.toLowerCase().includes(q);
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const counts = {
    confirmed:  todayAll.filter(b => b.status === 'confirmed').length,
    checked_in: todayAll.filter(b => b.status === 'checked_in').length,
    pending:    todayAll.filter(b => b.status === 'pending').length,
    reschedule: todayAll.filter(b => b.status === 'reschedule_requested').length,
    completed:  todayAll.filter(b => b.status === 'completed').length,
    no_show:    todayAll.filter(b => b.status === 'no_show').length,
    cancelled:  todayAll.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div style={s.page}>
      {/* Summary strip */}
      <div style={s.strip}>
        <SChip val={counts.confirmed}  label="Awaiting check-in" color="#2563eb" bg="#eff6ff" />
        <SChip val={counts.checked_in} label="On court"          color="#15803d" bg="#f0fdf4" />
        <SChip val={counts.pending}    label="Pending approval"  color="#b45309" bg="#fffbeb" />
      </div>

      {/* Search */}
      <div style={s.searchWrap}>
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
        <input style={s.searchInput} type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search player, booking ID, or court..." />
        {search && <button onClick={() => setSearch('')} style={s.clearBtn}>&#x2715;</button>}
      </div>

      {/* Cards or empty */}
      {todayActive.length === 0 ? (
        <div style={s.empty}>
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          <div style={s.emptyTitle}>All clear</div>
          <div style={s.emptySub}>No active bookings match your search.</div>
        </div>
      ) : (
        <div style={s.grid}>
          {todayActive.map(b => {
            const accent = b.status === 'reschedule_requested' ? '#7c3aed'
              : b.status === 'checked_in' ? '#16a34a'
              : b.status === 'pending'    ? '#d97706'
              : '#2563eb';
            return (
              <div key={b.id} style={{ ...s.card, borderTop:`3px solid ${accent}` }}>
                {/* Header */}
                <div style={s.cardTop}>
                  <div style={{ ...s.avatar, background: accent+'18', color: accent }}>{b.playerName[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={s.name}>{b.playerName}</div>
                    <div style={s.phone}>{b.playerPhone}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>

                {/* Reschedule request box */}
                {b.status === 'reschedule_requested' && (
                  <div style={s.reschedBox}>
                    <div style={{ fontSize:12, fontWeight:700, color:'#4c1d95', marginBottom:6 }}>Customer wants to rebook</div>
                    {b.rescheduleNote && (
                      <div style={{ fontSize:12, color:'#6d28d9', fontStyle:'italic', lineHeight:1.5, marginBottom:8 }}>
                        "{b.rescheduleNote}"
                      </div>
                    )}
                    <div style={{ display:'flex', gap:8 }}>
                      <button style={s.btnAccept} onClick={() => handleAcceptReschedule(b)}>Accept &amp; Rebook</button>
                      <button style={s.btnKeep}   onClick={() => handleDeclineReschedule(b.id)}>Keep Original</button>
                    </div>
                  </div>
                )}

                {/* Details */}
                <div style={s.details}>
                  <Detail label="Date"   val={new Date(b.date).toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })} />
                  <Detail label="Court"  val={b.courtName} />
                  <Detail label="Time"   val={`${fmt12(b.startTime)} – ${fmt12(b.endTime)} · ${b.durationHrs}h`} />
                  <Detail label="Amount" val={`₱${b.amount.toLocaleString()}`} extra={
                    <span style={{ ...s.payTag, background: b.paid ? '#dcfce7' : '#fef3c7', color: b.paid ? '#15803d' : '#b45309' }}>
                      {b.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  } />
                </div>

                <div style={s.bookingId}>{b.id}</div>

                {/* Actions */}
                {b.status !== 'reschedule_requested' && (
                  <div style={s.actions}>
                    {b.status === 'pending' && (
                      <>
                        <ActionBtn label="Approve"  color={E}        onClick={() => updateStatus(b.id, 'confirmed')} />
                        <ActionBtn label="Decline"  color="#dc2626"  onClick={() => updateStatus(b.id, 'cancelled')} />
                      </>
                    )}
                    {b.status === 'confirmed' && (
                      <>
                        <ActionBtn label="On Court" color={E}        onClick={() => updateStatus(b.id, 'checked_in')} />
                        <ActionBtn label="No Show"  color="#64748b" ghost onClick={() => updateStatus(b.id, 'no_show')} />
                      </>
                    )}
                    {b.status === 'checked_in' && (
                      <ActionBtn label="Mark Complete" color="#2563eb" onClick={() => updateStatus(b.id, 'completed')} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* End-of-shift report */}
      <div style={s.reportCard}>
        <div style={s.reportHead}>
          <div style={s.reportTitle}>Today's Report</div>
          <div style={s.reportSub}>End-of-shift summary</div>
        </div>
        <div style={s.reportGrid}>
          {[
            { label:'Completed', val:counts.completed, color:'#15803d', bg:'#f0fdf4' },
            { label:'Pending',   val:counts.pending,   color:'#b45309', bg:'#fffbeb' },
            { label:'No Show',   val:counts.no_show,   color:'#dc2626', bg:'#fef2f2' },
            { label:'Cancelled', val:counts.cancelled, color:'#64748b', bg:'#f8fafc' },
          ].map(r => (
            <div key={r.label} style={{ ...s.reportItem, background: r.bg }}>
              <div style={{ fontSize:28, fontWeight:900, color:r.color }}>{r.val}</div>
              <div style={{ fontSize:11, fontWeight:700, color:r.color, textTransform:'uppercase', letterSpacing:.5 }}>{r.label}</div>
            </div>
          ))}
        </div>
      </div>

      {rescheduleTarget && (
        <RescheduleModal booking={rescheduleTarget}
          onConfirm={handleRescheduleConfirm}
          onDecline={() => { updateBooking(rescheduleTarget.id, {status:'confirmed'}); setBookings(getAllBookings()); setRT(null); }}
          onClose={() => setRT(null)} />
      )}
    </div>
  );
}

function SChip({ val, label, color, bg }: { val:number; label:string; color:string; bg:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, background:bg, border:`1px solid ${color}22`, borderRadius:10, padding:'12px 16px', flex:1 }}>
      <span style={{ fontSize:28, fontWeight:900, color }}>{val}</span>
      <span style={{ fontSize:12, fontWeight:600, color, lineHeight:1.3 }}>{label}</span>
    </div>
  );
}

function Detail({ label, val, extra }: { label:string; val:string; extra?: React.ReactNode }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
      <span style={{ fontSize:11, fontWeight:700, color:'#94a3b8', width:48, flexShrink:0, textTransform:'uppercase', letterSpacing:.5 }}>{label}</span>
      <span style={{ color:'#334155' }}>{val}</span>
      {extra}
    </div>
  );
}

function ActionBtn({ label, color, ghost, onClick }: { label:string; color:string; ghost?:boolean; onClick:()=>void }) {
  return (
    <button onClick={onClick} style={{
      flex:1, padding:'8px 12px', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer',
      border: ghost ? '1px solid #e2e8f0' : 'none',
      background: ghost ? '#fff' : color,
      color: ghost ? '#64748b' : '#fff',
    }}>{label}</button>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:       { display:'flex', flexDirection:'column', gap:20 },
  strip:      { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 },
  searchWrap: { display:'flex', alignItems:'center', gap:10, background:'#fff', border:'1.5px solid #e2e8f0', borderRadius:10, padding:'0 16px', height:44 },
  searchInput:{ flex:1, border:'none', outline:'none', fontSize:14, color:'#0f172a', background:'transparent' },
  clearBtn:   { background:'none', border:'none', cursor:'pointer', color:'#94a3b8', fontSize:14, padding:4 },
  empty:      { display:'flex', flexDirection:'column', alignItems:'center', gap:8, padding:'60px 0', color:'#94a3b8' },
  emptyTitle: { fontSize:18, fontWeight:800, color:'#0f172a' },
  emptySub:   { fontSize:13 },
  grid:       { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16 },
  card:       { background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'18px 20px', display:'flex', flexDirection:'column', gap:12, boxShadow:'0 1px 4px rgba(0,0,0,.04)' },
  cardTop:    { display:'flex', alignItems:'center', gap:12 },
  avatar:     { width:40, height:40, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:800, flexShrink:0 },
  name:       { fontSize:15, fontWeight:800, color:'#0f172a' },
  phone:      { fontSize:12, color:'#64748b', marginTop:1 },
  reschedBox: { background:'#f5f3ff', border:'1px solid #ddd6fe', borderRadius:10, padding:'12px 14px' },
  btnAccept:  { flex:1, padding:'7px 12px', borderRadius:8, border:'none', background:'#7c3aed', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' },
  btnKeep:    { flex:1, padding:'7px 12px', borderRadius:8, border:'1px solid #ddd6fe', background:'#fff', color:'#7c3aed', fontSize:12, fontWeight:600, cursor:'pointer' },
  details:    { display:'flex', flexDirection:'column', gap:6, padding:'10px 0', borderTop:'1px solid #f1f5f9', borderBottom:'1px solid #f1f5f9' },
  payTag:     { marginLeft:6, padding:'1px 8px', borderRadius:99, fontSize:10, fontWeight:700 },
  bookingId:  { fontSize:11, fontFamily:'monospace', color:'#94a3b8' },
  actions:    { display:'flex', gap:8 },
  reportCard: { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,.04)' },
  reportHead: { display:'flex', alignItems:'baseline', gap:10, padding:'16px 20px', borderBottom:'1px solid #f1f5f9' },
  reportTitle:{ fontSize:15, fontWeight:700, color:'#0f172a' },
  reportSub:  { fontSize:12, color:'#94a3b8' },
  reportGrid: { display:'grid', gridTemplateColumns:'repeat(4,1fr)' },
  reportItem: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px 16px', gap:4, borderRight:'1px solid #f1f5f9' },
};
