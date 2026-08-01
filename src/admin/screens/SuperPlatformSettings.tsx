import React, { useState } from 'react';

const A = '#6366f1';

interface SettingField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'toggle';
  value: string | number | boolean;
  options?: string[];
  description?: string;
  group: string;
}

const INITIAL_SETTINGS: SettingField[] = [
  { group:'General',     key:'platformName',   label:'Platform Name',      type:'text',   value:'RallyNest',   description:'Displayed across all tenant-facing interfaces.' },
  { group:'General',     key:'supportEmail',   label:'Support Email',      type:'text',   value:'support@rallynest.com' },
  { group:'General',     key:'timezone',       label:'Default Timezone',   type:'select', value:'Asia/Manila', options:['Asia/Manila','Asia/Singapore','UTC','America/New_York'] },
  { group:'General',     key:'currency',       label:'Default Currency',   type:'select', value:'PHP',         options:['PHP','USD','SGD','AUD'] },
  { group:'Billing',     key:'trialDays',      label:'Free Trial Days',    type:'number', value:30,            description:'Days new tenants can use the platform for free.' },
  { group:'Billing',     key:'gracePeriod',    label:'Grace Period (days)',type:'number', value:7,             description:'Days after due date before subscription suspension.' },
  { group:'Billing',     key:'autoInvoice',    label:'Auto Invoice',       type:'toggle', value:true,          description:'Automatically generate invoices on billing dates.' },
  { group:'Notifications',key:'emailAlerts',   label:'Email Alerts',       type:'toggle', value:true,          description:'Send system alerts to super admin via email.' },
  { group:'Notifications',key:'smsAlerts',     label:'SMS Alerts',         type:'toggle', value:false,         description:'Send critical alerts via SMS.' },
  { group:'Notifications',key:'digestReport',  label:'Weekly Digest',      type:'toggle', value:true,          description:'Receive a weekly summary report every Monday.' },
  { group:'Maintenance', key:'maintenanceMode',label:'Maintenance Mode',   type:'toggle', value:false,         description:'Puts the platform in read-only maintenance mode for all tenants.' },
  { group:'Maintenance', key:'maxTenantsPerOwner',label:'Max Tenants / Owner',type:'number',value:5,           description:'Maximum number of facilities one owner can register.' },
];

export default function SuperPlatformSettings() {
  const [settings, setSettings] = useState<SettingField[]>(INITIAL_SETTINGS);
  const [saved, setSaved] = useState(false);

  const update = (key: string, value: string | number | boolean) =>
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const groups = [...new Set(settings.map(s => s.group))];

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Platform Settings</h2>
          <p style={s.pageSub}>Global configuration for the RallyNest platform</p>
        </div>
        <button onClick={handleSave} style={{ ...s.btnSave, background: saved ? '#16a34a' : A }}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>

      {groups.map(group => (
        <div key={group} style={s.section}>
          <div style={s.sectionTitle}>{group}</div>
          <div style={s.sectionBody}>
            {settings.filter(f => f.group === group).map(field => (
              <div key={field.key} style={s.fieldRow}>
                <div style={s.fieldMeta}>
                  <div style={s.fieldLabel}>{field.label}</div>
                  {field.description && <div style={s.fieldDesc}>{field.description}</div>}
                </div>
                <div style={s.fieldControl}>
                  {field.type === 'toggle' ? (
                    <button
                      onClick={() => update(field.key, !field.value)}
                      style={{ ...s.toggle, background: field.value ? '#16a34a' : '#e2e8f0' }}
                      aria-label={String(field.value)}
                    >
                      <div style={{ ...s.toggleThumb, transform: field.value ? 'translateX(18px)' : 'translateX(2px)' }} />
                    </button>
                  ) : field.type === 'select' ? (
                    <select
                      style={s.input}
                      value={String(field.value)}
                      onChange={e => update(field.key, e.target.value)}
                    >
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input
                      style={s.input}
                      type={field.type}
                      value={String(field.value)}
                      onChange={e => update(field.key, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:         { display:'flex', flexDirection:'column', gap:24 },
  pageHead:     { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle:    { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:      { fontSize:13, color:'#64748b', marginTop:4 },
  btnSave:      { padding:'10px 22px', borderRadius:9, border:'none', color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', transition:'background 300ms', boxShadow:'0 2px 8px rgba(99,102,241,.3)' },
  section:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  sectionTitle: { padding:'14px 20px', fontSize:13, fontWeight:800, color:'#374151', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', textTransform:'uppercase', letterSpacing:.8 },
  sectionBody:  { display:'flex', flexDirection:'column' },
  fieldRow:     { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:'1px solid #f8fafc', gap:20 },
  fieldMeta:    { flex:1 },
  fieldLabel:   { fontSize:14, fontWeight:600, color:'#0f172a' },
  fieldDesc:    { fontSize:12, color:'#94a3b8', marginTop:3, lineHeight:1.4 },
  fieldControl: { flexShrink:0 },
  input:        { padding:'8px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:13, color:'#0f172a', outline:'none', minWidth:200, boxSizing:'border-box' } as React.CSSProperties,
  toggle:       { width:40, height:22, borderRadius:99, border:'none', cursor:'pointer', position:'relative', flexShrink:0, transition:'background 200ms' },
  toggleThumb:  { position:'absolute', top:2, width:18, height:18, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'transform 200ms' },
};
