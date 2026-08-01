import React, { useState } from 'react';
import { BACKUP_ENTRIES } from '../data/mock';
import type { BackupEntry } from '../types';

const A = '#6366f1';
const STATUS_CFG: Record<BackupEntry['status'], { bg:string; color:string; label:string }> = {
  completed:   { bg:'#dcfce7', color:'#15803d', label:'Completed'   },
  failed:      { bg:'#fee2e2', color:'#dc2626', label:'Failed'      },
  in_progress: { bg:'#fef3c7', color:'#b45309', label:'In Progress' },
};

export default function SuperBackup() {
  const [entries, setEntries] = useState<BackupEntry[]>(BACKUP_ENTRIES);
  const [backing, setBacking] = useState(false);
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const lastSuccess = entries.find(e => e.status === 'completed');

  const triggerBackup = () => {
    setBacking(true);
    const tempId = `bk${Date.now()}`;
    setEntries((prev: BackupEntry[]) => [{
      id: tempId,
      label: `Manual Backup – ${new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' })}`,
      type: 'manual',
      size: '—',
      status: 'in_progress',
      createdAt: new Date().toLocaleString(),
    }, ...prev]);
    setTimeout(() => {
      setEntries((prev: BackupEntry[]) => prev.map((e: BackupEntry) => e.id === tempId ? { ...e, status:'completed' as const, size:'48.9 MB' } : e));
      setBacking(false);
    }, 2500);
  };

  const handleRestore = () => {
    setConfirmed(true);
    setTimeout(() => {
      setRestoreId(null);
      setConfirmed(false);
    }, 2000);
  };

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Backup & Restore</h2>
          <p style={s.pageSub}>
            {lastSuccess ? `Last successful backup: ${lastSuccess.createdAt}` : 'No completed backups found'}
          </p>
        </div>
        <button onClick={triggerBackup} disabled={backing} style={{ ...s.btnBackup, opacity: backing ? 0.7 : 1 }}>
          {backing ? '⏳ Backing up…' : '+ Create Backup'}
        </button>
      </div>

      {/* Info cards */}
      <div style={s.infoRow}>
        <div style={s.infoCard}>
          <div style={{ fontSize:13, fontWeight:700, color:'#0f172a', marginBottom:6 }}>Auto Backup Schedule</div>
          <div style={{ fontSize:12, color:'#64748b', lineHeight:1.6 }}>Daily at 2:00 AM (Asia/Manila)<br />Retention: 30 days<br />Storage: Platform Cloud</div>
        </div>
        <div style={s.infoCard}>
          <div style={{ fontSize:13, fontWeight:700, color:'#0f172a', marginBottom:6 }}>Storage Used</div>
          <div style={{ fontSize:28, fontWeight:900, color:A }}>240 MB</div>
          <div style={{ fontSize:11, color:'#94a3b8' }}>of 10 GB allocated</div>
          <div style={{ marginTop:8, background:'#f1f5f9', borderRadius:99, height:6, overflow:'hidden' }}>
            <div style={{ background:A, height:'100%', borderRadius:99, width:'2.4%' }} />
          </div>
        </div>
        <div style={s.infoCard}>
          <div style={{ fontSize:13, fontWeight:700, color:'#0f172a', marginBottom:6 }}>Backup Health</div>
          <div style={{ fontSize:28, fontWeight:900, color:'#16a34a' }}>{entries.filter(e=>e.status==='completed').length}/{entries.length}</div>
          <div style={{ fontSize:11, color:'#94a3b8' }}>backups successful</div>
        </div>
      </div>

      {/* Backup list */}
      <div style={s.card}>
        <div style={s.cardHead}>Backup History</div>
        <table style={s.table}>
          <thead>
            <tr>{['Label','Type','Size','Status','Created','Actions'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {entries.map((e: BackupEntry, i: number) => {
              const sc = STATUS_CFG[e.status];
              return (
                <tr key={e.id} style={{ ...s.tr, background: i%2===0 ? '#fff' : '#fafafa' }}>
                  <td style={{ ...s.td, fontWeight:600 }}>{e.label}</td>
                  <td style={s.td}><span style={{ fontSize:11, fontWeight:700, padding:'2px 8px', borderRadius:99, background: e.type==='auto' ? '#eef2ff' : '#f0fdf4', color: e.type==='auto' ? '#6366f1' : '#16a34a' }}>{e.type}</span></td>
                  <td style={{ ...s.td, color:'#64748b' }}>{e.size}</td>
                  <td style={s.td}><span style={{ ...s.badge, background:sc.bg, color:sc.color }}>{sc.label}</span></td>
                  <td style={{ ...s.td, color:'#64748b', fontSize:12 }}>{e.createdAt}</td>
                  <td style={s.td}>
                    {e.status === 'completed' && (
                      <button onClick={() => setRestoreId(e.id)} style={s.btnRestore}>Restore</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Restore confirmation modal */}
      {restoreId && (
        <div style={m.backdrop} onClick={() => { if (!confirmed) setRestoreId(null); }}>
          <div style={m.panel} onClick={e => e.stopPropagation()}>
            <div style={m.head}>
              <h2 style={m.title}>Confirm Restore</h2>
              {!confirmed && <button onClick={() => setRestoreId(null)} style={m.close}>&#x2715;</button>}
            </div>
            <div style={{ padding:'20px 24px' }}>
              {confirmed ? (
                <div style={{ textAlign:'center', padding:'20px 0' }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>✅</div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#15803d' }}>Restore initiated successfully</div>
                </div>
              ) : (
                <p style={{ fontSize:14, color:'#374151', lineHeight:1.7, margin:0 }}>
                  You are about to restore the platform to the backup:<br />
                  <strong>{entries.find(e => e.id === restoreId)?.label}</strong>.<br /><br />
                  This will overwrite current data and cannot be undone. Are you sure?
                </p>
              )}
            </div>
            {!confirmed && (
              <div style={m.footer}>
                <button style={m.btnCancel} onClick={() => setRestoreId(null)}>Cancel</button>
                <button style={m.btnConfirm} onClick={handleRestore}>Restore Now</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:      { display:'flex', flexDirection:'column', gap:20 },
  pageHead:  { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle: { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:   { fontSize:13, color:'#64748b', marginTop:4 },
  btnBackup: { padding:'10px 18px', borderRadius:9, border:'none', background:A, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' },
  infoRow:   { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 },
  infoCard:  { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'18px 20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  card:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardHead:  { padding:'14px 20px', fontSize:14, fontWeight:800, color:'#374151', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', textTransform:'uppercase', letterSpacing:.6 },
  table:     { width:'100%', borderCollapse:'collapse' as const },
  th:        { padding:'11px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8 },
  tr:        { borderBottom:'1px solid #f8fafc' },
  td:        { padding:'12px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
  badge:     { display:'inline-block', padding:'2px 9px', borderRadius:99, fontSize:11, fontWeight:700 },
  btnRestore:{ padding:'5px 12px', borderRadius:7, border:'1px solid #c7d2fe', background:'#eef2ff', color:'#6366f1', fontSize:12, fontWeight:700, cursor:'pointer' },
};
const m: Record<string, React.CSSProperties> = {
  backdrop:  { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(3px)' },
  panel:     { background:'#fff', borderRadius:16, width:'100%', maxWidth:440, boxShadow:'0 24px 64px rgba(0,0,0,.2)', overflow:'hidden' },
  head:      { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid #f1f5f9' },
  title:     { fontSize:16, fontWeight:800, margin:0, color:'#0f172a' },
  close:     { background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#94a3b8', padding:4, lineHeight:1 },
  footer:    { display:'flex', gap:8, justifyContent:'flex-end', padding:'16px 24px', borderTop:'1px solid #f1f5f9' },
  btnCancel: { padding:'9px 18px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', color:'#64748b', fontSize:13, cursor:'pointer' },
  btnConfirm:{ padding:'9px 20px', borderRadius:8, border:'none', background:'#dc2626', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' },
};
