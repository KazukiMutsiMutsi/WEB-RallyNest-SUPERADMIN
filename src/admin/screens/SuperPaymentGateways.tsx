import React, { useState } from 'react';
import { PAYMENT_GATEWAYS } from '../data/mock';
import type { PaymentGateway } from '../types';

const A = '#6366f1';
const STATUS_CFG: Record<PaymentGateway['status'], { bg:string; color:string; label:string }> = {
  active:   { bg:'#dcfce7', color:'#15803d', label:'Active'   },
  inactive: { bg:'#f1f5f9', color:'#64748b', label:'Inactive' },
  testing:  { bg:'#fef3c7', color:'#b45309', label:'Testing'  },
};

export default function SuperPaymentGateways() {
  const [gateways, setGateways] = useState<PaymentGateway[]>(PAYMENT_GATEWAYS);
  const [testing, setTesting]   = useState<string | null>(null);

  const toggleStatus = (id: string) => {
    setGateways(prev => prev.map(g =>
      g.id === id ? { ...g, status: g.status === 'active' ? 'inactive' : 'active' } : g
    ));
  };

  const runTest = (id: string) => {
    setTesting(id);
    setTimeout(() => {
      setGateways(prev => prev.map(g =>
        g.id === id ? { ...g, lastTested: new Date().toISOString().slice(0,10) } : g
      ));
      setTesting(null);
    }, 1500);
  };

  const activeGateways = gateways.filter(g => g.status === 'active').length;

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Payment Gateway Management</h2>
          <p style={s.pageSub}>{gateways.length} gateways configured &nbsp;·&nbsp; {activeGateways} active</p>
        </div>
      </div>

      <div style={s.kpiRow}>
        {[
          { label:'Active Gateways', val:activeGateways,                                   color:'#16a34a', bg:'#f0fdf4' },
          { label:'In Testing',      val:gateways.filter(g=>g.status==='testing').length,   color:'#d97706', bg:'#fffbeb' },
          { label:'Inactive',        val:gateways.filter(g=>g.status==='inactive').length,  color:'#64748b', bg:'#f1f5f9' },
          { label:'Avg. Fee',        val:`${(gateways.reduce((s,g)=>s+g.transactionFee,0)/gateways.length).toFixed(1)}%`, color:'#6366f1', bg:'#eef2ff' },
        ].map(k => (
          <div key={k.label} style={{ ...s.kpi, background: k.bg }}>
            <div style={{ ...s.kpiVal, color: k.color }}>{k.val}</div>
            <div style={s.kpiLbl}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={s.grid}>
        {gateways.map(g => {
          const sc = STATUS_CFG[g.status];
          const isTesting = testing === g.id;
          return (
            <div key={g.id} style={s.card}>
              <div style={{ ...s.cardTop, borderLeft:`4px solid ${sc.color}` }}>
                <div style={{ flex:1 }}>
                  <div style={s.gwName}>{g.name}</div>
                  <div style={s.gwProvider}>{g.provider}</div>
                </div>
                <span style={{ ...s.badge, background:sc.bg, color:sc.color }}>{sc.label}</span>
              </div>
              <div style={s.cardBody}>
                <div style={s.row}>
                  <span style={s.rowLabel}>Transaction Fee</span>
                  <span style={s.rowVal}>{g.transactionFee === 0 ? 'Free' : `${g.transactionFee}%`}</span>
                </div>
                <div style={s.row}>
                  <span style={s.rowLabel}>Currency</span>
                  <span style={s.rowVal}>{g.currency}</span>
                </div>
                <div style={s.row}>
                  <span style={s.rowLabel}>Last Tested</span>
                  <span style={{ ...s.rowVal, color:'#64748b' }}>{g.lastTested}</span>
                </div>
              </div>
              <div style={s.cardActions}>
                <button onClick={() => runTest(g.id)} disabled={isTesting} style={{ ...s.btnTest, opacity: isTesting ? 0.7 : 1 }}>
                  {isTesting ? 'Testing…' : 'Run Test'}
                </button>
                <button onClick={() => toggleStatus(g.id)} style={{ ...s.btnToggle, background: g.status === 'active' ? '#fef3c7' : '#f0fdf4', color: g.status === 'active' ? '#b45309' : '#15803d', border:`1px solid ${g.status === 'active' ? '#fde68a' : '#bbf7d0'}` }}>
                  {g.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:        { display:'flex', flexDirection:'column', gap:20 },
  pageHead:    { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle:   { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:     { fontSize:13, color:'#64748b', marginTop:4 },
  kpiRow:      { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 },
  kpi:         { borderRadius:12, padding:'16px 20px', border:'1px solid #e2e8f0' },
  kpiVal:      { fontSize:28, fontWeight:900, marginBottom:4 },
  kpiLbl:      { fontSize:12, fontWeight:700, color:'#64748b' },
  grid:        { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 },
  card:        { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' },
  cardTop:     { display:'flex', alignItems:'center', gap:12, padding:'16px 20px', borderBottom:'1px solid #f1f5f9' },
  gwName:      { fontSize:15, fontWeight:800, color:'#0f172a' },
  gwProvider:  { fontSize:12, color:'#64748b', marginTop:2 },
  badge:       { display:'inline-block', padding:'3px 10px', borderRadius:99, fontSize:11, fontWeight:700, flexShrink:0 },
  cardBody:    { padding:'16px 20px', display:'flex', flexDirection:'column', gap:10 },
  row:         { display:'flex', justifyContent:'space-between', alignItems:'center' },
  rowLabel:    { fontSize:12, color:'#94a3b8', fontWeight:600 },
  rowVal:      { fontSize:13, fontWeight:700, color:'#0f172a' },
  cardActions: { display:'flex', gap:8, padding:'12px 20px', borderTop:'1px solid #f8fafc' },
  btnTest:     { flex:1, padding:'8px', borderRadius:8, border:'1.5px solid #e2e8f0', background:'#fff', color:'#374151', fontSize:12, fontWeight:700, cursor:'pointer' },
  btnToggle:   { flex:1, padding:'8px', borderRadius:8, fontSize:12, fontWeight:700, cursor:'pointer' },
};
