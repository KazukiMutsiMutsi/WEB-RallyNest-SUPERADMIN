import React, { useState } from 'react';
import { SUPPORT_TICKETS } from '../data/mock';
import type { SupportTicket } from '../types';

const A = '#6366f1';

const PRIORITY_CFG: Record<SupportTicket['priority'], { bg:string; color:string }> = {
  low:    { bg:'#f1f5f9', color:'#64748b' },
  medium: { bg:'#fef3c7', color:'#b45309' },
  high:   { bg:'#ffedd5', color:'#c2410c' },
  urgent: { bg:'#fee2e2', color:'#dc2626' },
};
const STATUS_CFG: Record<SupportTicket['status'], { bg:string; color:string; label:string }> = {
  open:        { bg:'#eff6ff', color:'#2563eb', label:'Open'        },
  in_progress: { bg:'#fef3c7', color:'#b45309', label:'In Progress' },
  resolved:    { bg:'#dcfce7', color:'#15803d', label:'Resolved'    },
  closed:      { bg:'#f1f5f9', color:'#64748b', label:'Closed'      },
};

export default function SuperSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>(SUPPORT_TICKETS);
  const [statusF, setStatusF] = useState<'all' | SupportTicket['status']>('all');
  const [selected, setSelected] = useState<SupportTicket | null>(null);

  const filtered = statusF === 'all' ? tickets : tickets.filter(t => t.status === statusF);

  const updateStatus = (id: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status, updatedAt: new Date().toISOString().slice(0,10) } : t));
    setSelected(null);
  };

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Support Center</h2>
          <p style={s.pageSub}>{tickets.filter(t=>t.status==='open').length} open &nbsp;·&nbsp; {tickets.filter(t=>t.status==='in_progress').length} in progress &nbsp;·&nbsp; {tickets.length} total</p>
        </div>
      </div>

      <div style={s.kpiRow}>
        {(['open','in_progress','resolved','closed'] as const).map(st => {
          const sc = STATUS_CFG[st];
          return (
            <div key={st} style={{ ...s.kpi, background:sc.bg+'80', cursor:'pointer' }} onClick={() => setStatusF(st)}>
              <div style={{ ...s.kpiVal, color:sc.color }}>{tickets.filter(t=>t.status===st).length}</div>
              <div style={s.kpiLbl}>{sc.label}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display:'flex', gap:6 }}>
        {(['all','open','in_progress','resolved','closed'] as const).map(st => (
          <button key={st} onClick={() => setStatusF(st)} style={{ ...s.filterBtn, ...(statusF===st ? s.filterBtnActive : {}) }}>
            {st === 'all' ? 'All' : STATUS_CFG[st].label}
          </button>
        ))}
      </div>

      <div style={s.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>{['Ticket','Subject','Requester','Category','Priority','Status','Updated','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => {
                const pc = PRIORITY_CFG[t.priority];
                const sc = STATUS_CFG[t.status];
                return (
                  <tr key={t.id} style={{ ...s.tr, background: i%2===0 ? '#fff' : '#fafafa' }}>
                    <td style={{ ...s.td, fontFamily:'monospace', fontSize:11, color:'#94a3b8' }}>{t.id}</td>
                    <td style={{ ...s.td, fontWeight:600, maxWidth:200 }}>{t.subject}</td>
                    <td style={s.td}>
                      <div style={{ fontWeight:700, fontSize:12 }}>{t.requesterName}</div>
                      <div style={{ fontSize:11, color:'#94a3b8' }}>{t.requesterEmail}</div>
                    </td>
                    <td style={{ ...s.td, color:'#64748b', textTransform:'capitalize' }}>{t.category}</td>
                    <td style={s.td}><span style={{ ...s.badge, background:pc.bg, color:pc.color }}>{t.priority}</span></td>
                    <td style={s.td}><span style={{ ...s.badge, background:sc.bg, color:sc.color }}>{sc.label}</span></td>
                    <td style={{ ...s.td, color:'#64748b', fontSize:12 }}>{t.updatedAt}</td>
                    <td style={s.td}>
                      <button onClick={() => setSelected(t)} style={s.btnView}>View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={m.backdrop} onClick={() => setSelected(null)}>
          <div style={m.panel} onClick={e => e.stopPropagation()}>
            <div style={m.head}>
              <div>
                <h2 style={m.title}>{selected.subject}</h2>
                <p style={{ margin:0, fontSize:11, color:'#94a3b8', fontFamily:'monospace' }}>{selected.id}</p>
              </div>
              <button onClick={() => setSelected(null)} style={m.close}>&#x2715;</button>
            </div>
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:10 }}>
              {([
                ['Requester', selected.requesterName],
                ['Email',     selected.requesterEmail],
                ['Category',  selected.category],
                ['Priority',  selected.priority],
                ['Status',    STATUS_CFG[selected.status].label],
                ['Created',   selected.createdAt],
                ['Updated',   selected.updatedAt],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                  <span style={{ color:'#64748b', fontWeight:600 }}>{k}</span>
                  <span style={{ fontWeight:700, color:'#0f172a', textTransform:'capitalize' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={m.footer}>
              {selected.status === 'open'        && <button style={{ ...m.btnAction, background:'#fef3c7', color:'#b45309', border:'1px solid #fde68a' }} onClick={() => updateStatus(selected.id,'in_progress')}>Mark In Progress</button>}
              {selected.status === 'in_progress' && <button style={{ ...m.btnAction, background:'#dcfce7', color:'#15803d', border:'1px solid #bbf7d0' }} onClick={() => updateStatus(selected.id,'resolved')}>Mark Resolved</button>}
              {selected.status === 'resolved'    && <button style={{ ...m.btnAction, background:'#f1f5f9', color:'#64748b', border:'1px solid #e2e8f0' }} onClick={() => updateStatus(selected.id,'closed')}>Close Ticket</button>}
            </div>
          </div>
        </div>
      )}
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
  filterBtn:     { padding:'6px 14px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer' },
  filterBtnActive:{ background:A, color:'#fff', border:`1px solid ${A}` },
  card:          { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  table:         { width:'100%', borderCollapse:'collapse' as const, minWidth:860 },
  th:            { padding:'11px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8 },
  tr:            { borderBottom:'1px solid #f8fafc' },
  td:            { padding:'12px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
  badge:         { display:'inline-block', padding:'2px 9px', borderRadius:99, fontSize:11, fontWeight:700, textTransform:'capitalize' },
  btnView:       { padding:'4px 10px', borderRadius:6, border:'1.5px solid #e2e8f0', background:'#fff', color:'#374151', fontSize:11, fontWeight:700, cursor:'pointer' },
};
const m: Record<string, React.CSSProperties> = {
  backdrop:  { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(3px)' },
  panel:     { background:'#fff', borderRadius:16, width:'100%', maxWidth:440, boxShadow:'0 24px 64px rgba(0,0,0,.2)', overflow:'hidden' },
  head:      { display:'flex', alignItems:'flex-start', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid #f1f5f9' },
  title:     { fontSize:16, fontWeight:800, margin:0, color:'#0f172a' },
  close:     { background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#94a3b8', padding:4, lineHeight:1 },
  footer:    { padding:'16px 24px', borderTop:'1px solid #f1f5f9', display:'flex', justifyContent:'flex-end' },
  btnAction: { padding:'9px 18px', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer' },
};
