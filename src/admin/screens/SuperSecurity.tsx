import React, { useState } from 'react';

const A = '#6366f1';

interface SecurityRule {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  category: 'auth' | 'access' | 'data' | 'monitoring';
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'permission_change' | 'data_export' | 'suspicious';
  description: string;
  actor: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

const INITIAL_RULES: SecurityRule[] = [
  { id:'sr1', label:'Two-Factor Authentication',    description:'Require 2FA for all admin and owner accounts.',      enabled:true,  category:'auth'       },
  { id:'sr2', label:'Session Timeout (30 min)',      description:'Auto-logout inactive sessions after 30 minutes.',   enabled:true,  category:'auth'       },
  { id:'sr3', label:'Failed Login Lockout',          description:'Lock account after 5 consecutive failed logins.',   enabled:true,  category:'auth'       },
  { id:'sr4', label:'IP Whitelist for Super Admin',  description:'Restrict super admin access to approved IPs only.', enabled:false, category:'access'     },
  { id:'sr5', label:'Role-Based Access Control',     description:'Enforce strict RBAC across all platform modules.',  enabled:true,  category:'access'     },
  { id:'sr6', label:'Data Encryption at Rest',       description:'Encrypt all sensitive data stored in the database.',enabled:true,  category:'data'       },
  { id:'sr7', label:'Audit Log Retention (90 days)', description:'Retain full audit logs for 90 days.',               enabled:true,  category:'data'       },
  { id:'sr8', label:'Anomaly Detection Alerts',      description:'Send alerts for unusual activity patterns.',        enabled:false, category:'monitoring' },
  { id:'sr9', label:'API Rate Limiting',             description:'Limit API calls per tenant to prevent abuse.',      enabled:true,  category:'monitoring' },
];

const EVENTS: SecurityEvent[] = [
  { id:'se1', type:'login',            description:'Super admin logged in',                actor:'admin@rallynest.com',     timestamp:'2026-08-01 09:15', severity:'low'    },
  { id:'se2', type:'failed_login',     description:'5 failed login attempts',              actor:'unknown@gmail.com',       timestamp:'2026-08-01 08:44', severity:'high'   },
  { id:'se3', type:'permission_change',description:'Staff role updated to Manager',        actor:'admin@rallynest.com',     timestamp:'2026-07-31 16:30', severity:'medium' },
  { id:'se4', type:'data_export',      description:'Bulk booking export (CSV)',            actor:'carlos@picklepro.com',    timestamp:'2026-07-31 14:10', severity:'low'    },
  { id:'se5', type:'suspicious',       description:'Unusual login from new device/IP',     actor:'diana@smasharena.com',    timestamp:'2026-07-30 22:05', severity:'high'   },
];

const CAT_COLORS: Record<SecurityRule['category'], string> = {
  auth:'#6366f1', access:'#0284c7', data:'#16a34a', monitoring:'#d97706',
};
const SEV_CFG: Record<SecurityEvent['severity'], { bg:string; color:string }> = {
  low:    { bg:'#f1f5f9', color:'#64748b' },
  medium: { bg:'#fef3c7', color:'#b45309' },
  high:   { bg:'#fee2e2', color:'#dc2626' },
};

export default function SuperSecurity() {
  const [rules, setRules] = useState<SecurityRule[]>(INITIAL_RULES);
  const [catF, setCatF]   = useState<'all' | SecurityRule['category']>('all');

  const toggle = (id: string) => setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
  const filtered = catF === 'all' ? rules : rules.filter(r => r.category === catF);
  const enabledCount = rules.filter(r => r.enabled).length;

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>System Security</h2>
          <p style={s.pageSub}>{enabledCount} of {rules.length} security rules active</p>
        </div>
        <div style={{ ...s.secScore, borderColor: enabledCount >= 7 ? '#16a34a' : '#d97706' }}>
          <div style={{ fontSize:22, fontWeight:900, color: enabledCount >= 7 ? '#16a34a' : '#d97706' }}>{Math.round((enabledCount/rules.length)*100)}%</div>
          <div style={{ fontSize:10, fontWeight:700, color:'#64748b' }}>Security Score</div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:6 }}>
        {(['all','auth','access','data','monitoring'] as const).map(cat => (
          <button key={cat} onClick={() => setCatF(cat)} style={{ ...s.filterBtn, ...(catF===cat ? { ...s.filterBtnActive, borderColor: cat==='all' ? A : CAT_COLORS[cat as keyof typeof CAT_COLORS], background: cat==='all' ? A : CAT_COLORS[cat as keyof typeof CAT_COLORS] } : {}) }}>
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Rules */}
      <div style={s.rulesList}>
        {filtered.map(rule => (
          <div key={rule.id} style={s.ruleCard}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                <span style={s.ruleName}>{rule.label}</span>
                <span style={{ fontSize:10, fontWeight:700, padding:'1px 8px', borderRadius:99, background:CAT_COLORS[rule.category]+'18', color:CAT_COLORS[rule.category] }}>{rule.category}</span>
              </div>
              <p style={s.ruleDesc}>{rule.description}</p>
            </div>
            <button
              onClick={() => toggle(rule.id)}
              style={{ ...s.toggle, background: rule.enabled ? '#16a34a' : '#e2e8f0' }}
              aria-label={rule.enabled ? 'Disable' : 'Enable'}
            >
              <div style={{ ...s.toggleThumb, transform: rule.enabled ? 'translateX(18px)' : 'translateX(2px)' }} />
            </button>
          </div>
        ))}
      </div>

      {/* Security events */}
      <div style={s.card}>
        <div style={s.cardHead}>
          <div style={s.cardTitle}>Recent Security Events</div>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>{['Type','Description','Actor','Time','Severity'].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {EVENTS.map((e, i) => {
                const sc = SEV_CFG[e.severity];
                return (
                  <tr key={e.id} style={{ ...s.tr, background: i%2===0 ? '#fff' : '#fafafa' }}>
                    <td style={{ ...s.td, color:'#64748b', fontSize:12, textTransform:'capitalize' }}>{e.type.replace('_',' ')}</td>
                    <td style={{ ...s.td, fontWeight:600 }}>{e.description}</td>
                    <td style={{ ...s.td, color:'#64748b', fontFamily:'monospace', fontSize:12 }}>{e.actor}</td>
                    <td style={{ ...s.td, color:'#64748b', fontSize:12 }}>{e.timestamp}</td>
                    <td style={s.td}><span style={{ ...s.badge, background:sc.bg, color:sc.color }}>{e.severity}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:          { display:'flex', flexDirection:'column', gap:20 },
  pageHead:      { display:'flex', alignItems:'center', justifyContent:'space-between' },
  pageTitle:     { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:       { fontSize:13, color:'#64748b', marginTop:4 },
  secScore:      { border:'2.5px solid', borderRadius:14, padding:'12px 20px', textAlign:'center', minWidth:100 },
  filterBtn:     { padding:'6px 14px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer' },
  filterBtnActive:{ color:'#fff', border:'none' },
  rulesList:     { display:'flex', flexDirection:'column', gap:10 },
  ruleCard:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, boxShadow:'0 1px 3px rgba(0,0,0,0.04)' },
  ruleName:      { fontSize:14, fontWeight:700, color:'#0f172a' },
  ruleDesc:      { fontSize:12, color:'#64748b', margin:0, lineHeight:1.5 },
  toggle:        { width:40, height:22, borderRadius:99, border:'none', cursor:'pointer', position:'relative', flexShrink:0, transition:'background 200ms' },
  toggleThumb:   { position:'absolute', top:2, width:18, height:18, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'transform 200ms' },
  card:          { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardHead:      { padding:'16px 20px', borderBottom:'1px solid #f1f5f9' },
  cardTitle:     { fontSize:15, fontWeight:700, color:'#0f172a' },
  table:         { width:'100%', borderCollapse:'collapse' as const, minWidth:700 },
  th:            { padding:'11px 16px', textAlign:'left' as const, fontSize:10, fontWeight:700, color:'#94a3b8', borderBottom:'1px solid #f1f5f9', background:'#f8fafc', textTransform:'uppercase' as const, letterSpacing:.8 },
  tr:            { borderBottom:'1px solid #f8fafc' },
  td:            { padding:'12px 16px', fontSize:13, color:'#0f172a', verticalAlign:'middle' as const },
  badge:         { display:'inline-block', padding:'2px 9px', borderRadius:99, fontSize:11, fontWeight:700, textTransform:'capitalize' },
};
