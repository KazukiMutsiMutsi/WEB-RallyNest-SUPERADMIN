import React, { useState } from 'react';
import { REVIEWS } from '../data/mock';
import type { Review } from '../types';

const A = '#6366f1';
const STATUS_CFG: Record<Review['status'], { bg:string; color:string; label:string }> = {
  published: { bg:'#dcfce7', color:'#15803d', label:'Published' },
  flagged:   { bg:'#fee2e2', color:'#dc2626', label:'Flagged'   },
  removed:   { bg:'#f1f5f9', color:'#64748b', label:'Removed'   },
};

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ color:'#f59e0b', fontSize:14 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  );
}

export default function SuperReviews() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const [statusF, setStatusF] = useState<'all' | Review['status']>('all');

  const filtered = statusF === 'all' ? reviews : reviews.filter(r => r.status === statusF);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s,r) => s+r.rating, 0) / reviews.length).toFixed(1) : '0';

  const updateStatus = (id: string, status: Review['status']) =>
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Reviews & Ratings</h2>
          <p style={s.pageSub}>{reviews.length} total reviews &nbsp;·&nbsp; {avgRating} avg rating</p>
        </div>
      </div>

      <div style={s.kpiRow}>
        {[
          { label:'Total Reviews',  val:reviews.length,                                       color:'#6366f1', bg:'#eef2ff' },
          { label:'Avg Rating',     val:`${avgRating} ★`,                                     color:'#d97706', bg:'#fffbeb' },
          { label:'Flagged',        val:reviews.filter(r=>r.status==='flagged').length,        color:'#dc2626', bg:'#fef2f2' },
          { label:'5-Star Reviews', val:reviews.filter(r=>r.rating===5).length,               color:'#16a34a', bg:'#f0fdf4' },
        ].map(k => (
          <div key={k.label} style={{ ...s.kpi, background: k.bg }}>
            <div style={{ ...s.kpiVal, color: k.color }}>{k.val}</div>
            <div style={s.kpiLbl}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Rating distribution */}
      <div style={s.distCard}>
        {[5,4,3,2,1].map(star => {
          const count = reviews.filter(r => r.rating === star).length;
          const pct   = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          return (
            <div key={star} style={s.distRow}>
              <span style={s.starLabel}>{star} ★</span>
              <div style={s.barTrack}>
                <div style={{ ...s.barFill, width:`${pct}%`, background: star >= 4 ? '#16a34a' : star === 3 ? '#d97706' : '#dc2626' }} />
              </div>
              <span style={s.distCount}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div style={{ display:'flex', gap:6 }}>
        {(['all','published','flagged','removed'] as const).map(st => (
          <button key={st} onClick={() => setStatusF(st)} style={{ ...s.filterBtn, ...(statusF===st ? s.filterBtnActive : {}) }}>
            {st === 'all' ? 'All' : STATUS_CFG[st].label}
          </button>
        ))}
      </div>

      <div style={s.list}>
        {filtered.map(r => {
          const sc = STATUS_CFG[r.status];
          return (
            <div key={r.id} style={s.card}>
              <div style={s.cardTop}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <div style={s.avatar}>{r.reviewerName[0]}</div>
                    <div>
                      <div style={s.reviewerName}>{r.reviewerName}</div>
                      <div style={s.facilityName}>{r.facilityName}</div>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                  <span style={{ ...s.badge, background:sc.bg, color:sc.color }}>{sc.label}</span>
                  <span style={s.date}>{r.createdAt}</span>
                </div>
              </div>
              <p style={s.comment}>{r.comment}</p>
              <div style={s.cardActions}>
                {r.status === 'published' && <button onClick={() => updateStatus(r.id,'flagged')} style={s.btnFlag}>Flag</button>}
                {r.status === 'flagged'   && <button onClick={() => updateStatus(r.id,'removed')} style={s.btnRemove}>Remove</button>}
                {r.status === 'flagged'   && <button onClick={() => updateStatus(r.id,'published')} style={s.btnRestore}>Restore</button>}
                {r.status === 'removed'   && <button onClick={() => updateStatus(r.id,'published')} style={s.btnRestore}>Restore</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:         { display:'flex', flexDirection:'column', gap:20 },
  pageHead:     { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle:    { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:      { fontSize:13, color:'#64748b', marginTop:4 },
  kpiRow:       { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 },
  kpi:          { borderRadius:12, padding:'16px 20px', border:'1px solid #e2e8f0' },
  kpiVal:       { fontSize:28, fontWeight:900, marginBottom:4 },
  kpiLbl:       { fontSize:12, fontWeight:700, color:'#64748b' },
  distCard:     { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'20px', display:'flex', flexDirection:'column', gap:10 },
  distRow:      { display:'flex', alignItems:'center', gap:12 },
  starLabel:    { fontSize:12, fontWeight:700, color:'#374151', minWidth:30 },
  barTrack:     { flex:1, background:'#f1f5f9', borderRadius:99, height:8, overflow:'hidden' },
  barFill:      { height:'100%', borderRadius:99, transition:'width 400ms' },
  distCount:    { fontSize:12, fontWeight:700, color:'#64748b', minWidth:20, textAlign:'right' as const },
  filterBtn:    { padding:'6px 14px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer' },
  filterBtnActive:{ background:'#6366f1', color:'#fff', border:'1px solid #6366f1' },
  list:         { display:'flex', flexDirection:'column', gap:14 },
  card:         { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardTop:      { display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 },
  avatar:       { width:32, height:32, borderRadius:'50%', background:'#6366f118', color:'#6366f1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, flexShrink:0 },
  reviewerName: { fontSize:13, fontWeight:700, color:'#0f172a' },
  facilityName: { fontSize:11, color:'#94a3b8' },
  badge:        { display:'inline-block', padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:700 },
  date:         { fontSize:11, color:'#94a3b8' },
  comment:      { fontSize:13, color:'#374151', lineHeight:1.6, margin:'0 0 12px' },
  cardActions:  { display:'flex', gap:8 },
  btnFlag:      { padding:'5px 12px', borderRadius:7, border:'1px solid #fde68a', background:'#fffbeb', color:'#b45309', fontSize:12, fontWeight:700, cursor:'pointer' },
  btnRemove:    { padding:'5px 12px', borderRadius:7, border:'1px solid #fecaca', background:'#fff5f5', color:'#dc2626', fontSize:12, fontWeight:700, cursor:'pointer' },
  btnRestore:   { padding:'5px 12px', borderRadius:7, border:'1px solid #bbf7d0', background:'#f0fdf4', color:'#15803d', fontSize:12, fontWeight:700, cursor:'pointer' },
};
