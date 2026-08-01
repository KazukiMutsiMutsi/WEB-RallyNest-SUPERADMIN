import React, { useState } from 'react';
import { ANNOUNCEMENTS } from '../data/mock';
import type { Announcement } from '../types';

const A = '#6366f1';
const STATUS_CFG: Record<Announcement['status'], { bg:string; color:string; label:string }> = {
  published: { bg:'#dcfce7', color:'#15803d', label:'Published' },
  draft:     { bg:'#f1f5f9', color:'#64748b', label:'Draft'     },
  scheduled: { bg:'#fef3c7', color:'#b45309', label:'Scheduled' },
};
const TARGET_CFG: Record<Announcement['target'], { label:string; color:string }> = {
  all:    { label:'Everyone',   color:'#6366f1' },
  owners: { label:'Owners',     color:'#0284c7' },
  users:  { label:'Users',      color:'#16a34a' },
  staff:  { label:'Staff',      color:'#d97706' },
};

const EMPTY: Partial<Announcement> = { title:'', message:'', target:'all', status:'draft' };

export default function SuperAnnouncements() {
  const [items, setItems]   = useState<Announcement[]>(ANNOUNCEMENTS);
  const [adding, setAdding] = useState(false);
  const [form, setForm]     = useState<Partial<Announcement>>({ ...EMPTY });

  const handleAdd = () => {
    if (!form.title?.trim() || !form.message?.trim()) return;
    const now = new Date().toISOString().slice(0, 10);
    setItems(prev => [{
      id: `an${Date.now()}`,
      title: form.title!,
      message: form.message!,
      target: form.target ?? 'all',
      status: form.status ?? 'draft',
      createdAt: now,
      publishedAt: form.status === 'published' ? now : undefined,
    }, ...prev]);
    setAdding(false);
    setForm({ ...EMPTY });
  };

  const remove = (id: string) => setItems(prev => prev.filter(a => a.id !== id));
  const publish = (id: string) => setItems(prev => prev.map(a =>
    a.id === id ? { ...a, status:'published', publishedAt: new Date().toISOString().slice(0,10) } : a
  ));

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Announcement Center</h2>
          <p style={s.pageSub}>{items.length} announcements &nbsp;·&nbsp; {items.filter(a=>a.status==='published').length} published</p>
        </div>
        <button style={s.btnAdd} onClick={() => setAdding(true)}>+ New Announcement</button>
      </div>

      <div style={s.list}>
        {items.map(a => {
          const sc = STATUS_CFG[a.status];
          const tc = TARGET_CFG[a.target];
          return (
            <div key={a.id} style={s.card}>
              <div style={s.cardTop}>
                <div style={{ flex:1 }}>
                  <div style={s.aTitle}>{a.title}</div>
                  <div style={s.aMeta}>
                    <span style={{ ...s.badge, background:sc.bg, color:sc.color }}>{sc.label}</span>
                    <span style={{ ...s.badge, background:'#f1f5f9', color:tc.color }}>→ {tc.label}</span>
                    <span style={s.metaText}>{a.createdAt}</span>
                    {a.publishedAt && <span style={s.metaText}>Published: {a.publishedAt}</span>}
                  </div>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  {a.status !== 'published' && (
                    <button onClick={() => publish(a.id)} style={s.btnPublish}>Publish</button>
                  )}
                  <button onClick={() => remove(a.id)} style={s.btnRemove}>Remove</button>
                </div>
              </div>
              <p style={s.aMsg}>{a.message}</p>
            </div>
          );
        })}
      </div>

      {adding && (
        <div style={m.backdrop} onClick={() => { setAdding(false); setForm({ ...EMPTY }); }}>
          <div style={m.panel} onClick={e => e.stopPropagation()}>
            <div style={m.head}>
              <h2 style={m.title}>New Announcement</h2>
              <button onClick={() => { setAdding(false); setForm({ ...EMPTY }); }} style={m.close}>&#x2715;</button>
            </div>
            <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:14 }}>
              <div style={m.field}>
                <label style={m.label}>Title</label>
                <input style={m.input} placeholder="Announcement title" value={form.title ?? ''} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} />
              </div>
              <div style={m.field}>
                <label style={m.label}>Message</label>
                <textarea style={{ ...m.input, height:90, resize:'vertical' }} placeholder="Write your announcement…" value={form.message ?? ''} onChange={e => setForm(f => ({ ...f, message:e.target.value }))} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div style={m.field}>
                  <label style={m.label}>Target Audience</label>
                  <select style={m.input} value={form.target ?? 'all'} onChange={e => setForm(f => ({ ...f, target:e.target.value as any }))}>
                    <option value="all">Everyone</option>
                    <option value="owners">Owners</option>
                    <option value="users">Users</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div style={m.field}>
                  <label style={m.label}>Status</label>
                  <select style={m.input} value={form.status ?? 'draft'} onChange={e => setForm(f => ({ ...f, status:e.target.value as any }))}>
                    <option value="draft">Draft</option>
                    <option value="published">Publish Now</option>
                    <option value="scheduled">Scheduled</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={m.footer}>
              <button style={m.btnCancel} onClick={() => { setAdding(false); setForm({ ...EMPTY }); }}>Cancel</button>
              <button style={m.btnConfirm} onClick={handleAdd}>Create</button>
            </div>
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
  btnAdd:    { padding:'10px 18px', borderRadius:9, border:'none', background:A, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', boxShadow:`0 2px 8px ${A}40` },
  list:      { display:'flex', flexDirection:'column', gap:14 },
  card:      { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardTop:   { display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 },
  aTitle:    { fontSize:15, fontWeight:700, color:'#0f172a', marginBottom:6 },
  aMeta:     { display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' },
  aMsg:      { fontSize:13, color:'#64748b', lineHeight:1.6, margin:0 },
  badge:     { display:'inline-block', padding:'2px 8px', borderRadius:99, fontSize:11, fontWeight:700 },
  metaText:  { fontSize:11, color:'#94a3b8' },
  btnPublish:{ padding:'5px 12px', borderRadius:7, border:'1px solid #bbf7d0', background:'#f0fdf4', color:'#15803d', fontSize:12, fontWeight:700, cursor:'pointer' },
  btnRemove: { padding:'5px 12px', borderRadius:7, border:'1px solid #fecaca', background:'#fff5f5', color:'#dc2626', fontSize:12, fontWeight:700, cursor:'pointer' },
};
const m: Record<string, React.CSSProperties> = {
  backdrop: { position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, backdropFilter:'blur(3px)' },
  panel:    { background:'#fff', borderRadius:16, width:'100%', maxWidth:500, boxShadow:'0 24px 64px rgba(0,0,0,.2)', overflow:'hidden' },
  head:     { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid #f1f5f9' },
  title:    { fontSize:16, fontWeight:800, margin:0, color:'#0f172a' },
  close:    { background:'none', border:'none', cursor:'pointer', fontSize:16, color:'#94a3b8', padding:4, lineHeight:1 },
  field:    { display:'flex', flexDirection:'column', gap:5 },
  label:    { fontSize:12, fontWeight:700, color:'#374151' },
  input:    { padding:'9px 12px', border:'1.5px solid #e2e8f0', borderRadius:8, fontSize:13, color:'#0f172a', outline:'none', width:'100%', boxSizing:'border-box', fontFamily:'system-ui' } as React.CSSProperties,
  footer:   { display:'flex', gap:8, justifyContent:'flex-end', padding:'16px 24px', borderTop:'1px solid #f1f5f9' },
  btnCancel:{ padding:'9px 18px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', color:'#64748b', fontSize:13, cursor:'pointer' },
  btnConfirm:{ padding:'9px 20px', borderRadius:8, border:'none', background:A, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' },
};
