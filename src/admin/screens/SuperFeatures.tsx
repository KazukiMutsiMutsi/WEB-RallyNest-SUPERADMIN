import React, { useState } from 'react';
import { PLATFORM_FEATURES } from '../data/mock';
import type { PlatformFeature } from '../types';

const A = '#6366f1';

const PLAN_CFG = {
  all:        { bg:'#f1f5f9', color:'#475569', label:'All Plans'  },
  pro:        { bg:'#eff6ff', color:'#2563eb', label:'Pro+'       },
  enterprise: { bg:'#faf5ff', color:'#7c3aed', label:'Enterprise' },
};
const CAT_COLORS: Record<PlatformFeature['category'], string> = {
  booking:'#6366f1', payment:'#16a34a', analytics:'#0284c7', communication:'#d97706', security:'#dc2626',
};

export default function SuperFeatures() {
  const [features, setFeatures] = useState<PlatformFeature[]>(PLATFORM_FEATURES);
  const [catF, setCatF] = useState<'all' | PlatformFeature['category']>('all');

  const toggle = (id: string) => setFeatures((prev: PlatformFeature[]) => prev.map((f: PlatformFeature) => f.id === id ? { ...f, enabled: !f.enabled } : f));
  const filtered = catF === 'all' ? features : features.filter((f: PlatformFeature) => f.category === catF);
  const enabledCount = features.filter((f: PlatformFeature) => f.enabled).length;

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Feature Management</h2>
          <p style={s.pageSub}>{enabledCount} of {features.length} features enabled</p>
        </div>
      </div>

      <div style={s.kpiRow}>
        {(['booking','payment','analytics','communication','security'] as PlatformFeature['category'][]).map(cat => {
          const total   = features.filter(f => f.category === cat).length;
          const enabled = features.filter(f => f.category === cat && f.enabled).length;
          return (
            <div key={cat} style={{ ...s.kpi, borderTop:`3px solid ${CAT_COLORS[cat]}` }} onClick={() => setCatF(cat)}>
              <div style={{ ...s.kpiVal, color:CAT_COLORS[cat] }}>{enabled}/{total}</div>
              <div style={s.kpiLbl}>{cat.charAt(0).toUpperCase()+cat.slice(1)}</div>
            </div>
          );
        })}
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:6 }}>
        {(['all','booking','payment','analytics','communication','security'] as const).map(cat => (
          <button key={cat} onClick={() => setCatF(cat)} style={{ ...s.filterBtn, ...(catF===cat ? { ...s.filterBtnActive, background: cat==='all' ? A : CAT_COLORS[cat], borderColor: cat==='all' ? A : CAT_COLORS[cat] } : {}) }}>
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div style={s.grid}>
        {filtered.map((f: PlatformFeature) => {
          const pc = PLAN_CFG[f.plan];
          return (
            <div key={f.id} style={{ ...s.card, borderLeft:`4px solid ${f.enabled ? CAT_COLORS[f.category] : '#e2e8f0'}`, opacity: f.enabled ? 1 : 0.7 }}>
              <div style={s.cardTop}>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={s.featureName}>{f.name}</span>
                    <span style={{ fontSize:10, fontWeight:700, padding:'1px 7px', borderRadius:99, background:CAT_COLORS[f.category]+'18', color:CAT_COLORS[f.category] }}>{f.category}</span>
                  </div>
                  <p style={s.featureDesc}>{f.description}</p>
                  <span style={{ ...s.badge, background:pc.bg, color:pc.color }}>{pc.label}</span>
                </div>
                <button
                  onClick={() => toggle(f.id)}
                  style={{ ...s.toggle, background: f.enabled ? CAT_COLORS[f.category] : '#e2e8f0' }}
                  aria-label={f.enabled ? 'Disable feature' : 'Enable feature'}
                >
                  <div style={{ ...s.toggleThumb, transform: f.enabled ? 'translateX(18px)' : 'translateX(2px)' }} />
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
  page:          { display:'flex', flexDirection:'column', gap:20 },
  pageHead:      { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle:     { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:       { fontSize:13, color:'#64748b', marginTop:4 },
  kpiRow:        { display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14 },
  kpi:           { background:'#fff', borderRadius:12, padding:'14px 16px', border:'1px solid #e2e8f0', cursor:'pointer' },
  kpiVal:        { fontSize:22, fontWeight:900, marginBottom:3 },
  kpiLbl:        { fontSize:11, fontWeight:700, color:'#64748b', textTransform:'capitalize' },
  filterBtn:     { padding:'6px 14px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer', textTransform:'capitalize' },
  filterBtnActive:{ color:'#fff', border:'none' },
  grid:          { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 },
  card:          { background:'#fff', border:'1px solid #e2e8f0', borderRadius:12, padding:'18px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardTop:       { display:'flex', alignItems:'flex-start', gap:14 },
  featureName:   { fontSize:14, fontWeight:800, color:'#0f172a' },
  featureDesc:   { fontSize:12, color:'#64748b', margin:'4px 0 8px', lineHeight:1.5 },
  badge:         { display:'inline-block', padding:'2px 8px', borderRadius:99, fontSize:10, fontWeight:700 },
  toggle:        { width:40, height:22, borderRadius:99, border:'none', cursor:'pointer', position:'relative', flexShrink:0, transition:'background 200ms', marginTop:4 },
  toggleThumb:   { position:'absolute', top:2, width:18, height:18, borderRadius:'50%', background:'#fff', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'transform 200ms' },
};
