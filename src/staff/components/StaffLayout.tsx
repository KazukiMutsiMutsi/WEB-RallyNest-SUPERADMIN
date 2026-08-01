import React, { useState, useEffect } from 'react';
import { useStaffAuth } from '../context/StaffAuthContext';
import type { StaffPage } from '../types';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
type IP = { size?: number; color?: string };
const ic = (d: string) => ({ size = 16, color = 'currentColor' }: IP) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);
const IconDash    = ic('M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10');
const IconSched   = ic('M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z');
const IconCourts  = ic('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5');
const IconCheckin = ic('M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11');
const IconPlayers = ic('M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75');
const IconLogout  = ic('M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9');
const IconMenu    = ic('M3 12h18M3 6h18M3 18h18');
const IconX       = ic('M18 6L6 18M6 6l12 12');
const IconLeft    = ic('M15 18l-6-6 6-6');
const IconRight   = ic('M9 18l6-6-6-6');

const NAV: { id: StaffPage; label: string; Icon: React.FC<IP> }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: IconDash    },
  { id: 'schedule',  label: 'Schedule',  Icon: IconSched   },
  { id: 'courts',    label: 'Courts',    Icon: IconCourts  },
  { id: 'checkin',   label: 'Response',  Icon: IconCheckin },
  { id: 'players',   label: 'Players',   Icon: IconPlayers },
];

interface Props { page: StaffPage; onNavigate: (p: StaffPage) => void; children: React.ReactNode; }

function useWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => { const h = () => setW(window.innerWidth); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h); }, []);
  return w;
}

const SIDEBAR = '#0a0f1e';
const ACTIVE  = '#12172e';
const ACCENT  = '#10b981'; // emerald — differentiates staff from admin (indigo)
const BORDER  = '#1e2740';
const MUTED   = '#64748b';

export default function StaffLayout({ page, onNavigate, children }: Props) {
  const { user, logout, permissions } = useStaffAuth();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [now,        setNow]        = useState(new Date());
  const width = useWidth();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  // Filter nav items based on permissions
  const allowedNav = NAV.filter(item => {
    if (item.id === 'dashboard') return true;
    if (item.id === 'checkin')   return permissions.canCheckIn;
    if (item.id === 'courts')    return permissions.canManageCourts;
    if (item.id === 'schedule')  return permissions.canViewSchedule;
    if (item.id === 'players')   return permissions.canViewPlayers;
    return false;
  });

  useEffect(() => {
    if (isTablet) setCollapsed(true);
    else if (!isMobile) setCollapsed(false);
  }, [isMobile, isTablet]);

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const go = (p: StaffPage) => {
    // Block navigation to pages the staff doesn't have permission for
    const allowed = allowedNav.some(n => n.id === p);
    if (!allowed) return;
    onNavigate(p);
    setMobileOpen(false);
  };
  const current = allowedNav.find(n => n.id === page) ?? allowedNav[0];
  const initials = (user?.name ?? 'ST').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  // ── Mobile ─────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={m.root}>
        <header style={m.topbar}>
          <div style={m.brand}>
            <div style={{ ...m.brandMark, background: ACCENT }}>P</div>
            <span style={m.brandText}>PicklePro</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={m.timechip}>{now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })}</span>
            <button onClick={() => setMobileOpen(v => !v)} style={m.iconBtn} aria-label="Menu">
              {mobileOpen ? <IconX size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </header>

        {mobileOpen && (
          <div style={m.overlay} onClick={() => setMobileOpen(false)}>
            <nav style={m.drawer} onClick={e => e.stopPropagation()}>
              <div style={m.drawerUser}>
                <div style={{ ...m.avatar, background: ACCENT }}>{initials}</div>
                <div>
                  <div style={m.userName}>{user?.name}</div>
                  <div style={m.userRole}>Staff</div>
                </div>
              </div>
              <div style={m.divider} />
              {allowedNav.map(item => {
                const active = page === item.id;
                return (
                  <button key={item.id} onClick={() => go(item.id)}
                    style={{ ...m.drawerItem, ...(active ? m.drawerItemActive : {}) }}>
                    <item.Icon size={18} color={active ? ACCENT : MUTED} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div style={m.divider} />
              <button onClick={logout} style={m.drawerLogout}>
                <IconLogout size={16} color={MUTED} /><span>Sign out</span>
              </button>
            </nav>
          </div>
        )}

        <div style={m.breadcrumb}>
          {current && <current.Icon size={14} color={ACCENT} />}
          <span style={m.breadcrumbText}>{current?.label}</span>
          <span style={{ ...m.staffChip, color: ACCENT, background: '#ecfdf5', border: '1px solid #a7f3d0' }}>Staff</span>
        </div>

        <main style={m.content}>{children}</main>

        <nav style={m.bottomNav}>
          {allowedNav.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => go(item.id)}
                style={{ ...m.bottomBtn, ...(active ? { background: '#f0fdf4' } : {}) }}>
                <item.Icon size={20} color={active ? ACCENT : '#94a3b8'} />
                <span style={{ fontSize:9, fontWeight: active ? 700 : 500, color: active ? ACCENT : '#94a3b8' }}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // ── Desktop ────────────────────────────────────────────────────────────────
  const SW = collapsed ? 64 : 232;
  return (
    <div style={d.root}>
      <aside style={{ ...d.sidebar, width: SW }}>
        <div style={{ ...d.brand, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '20px 0' : '20px 20px' }}>
          <div style={{ ...d.brandMark, background: ACCENT }}>P</div>
          {!collapsed && (
            <div>
              <div style={d.brandName}>PicklePro</div>
              <div style={d.brandSub}>Staff Portal</div>
            </div>
          )}
        </div>
        <div style={d.divider} />
        <nav style={d.nav}>
          {allowedNav.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                style={{ ...d.navItem, ...(active ? d.navItemActive : {}), justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '10px 14px' }}>
                <item.Icon size={17} color={active ? ACCENT : MUTED} />
                {!collapsed && <span style={{ fontSize:13, fontWeight: active ? 700 : 500 }}>{item.label}</span>}
                {active && !collapsed && <div style={{ ...d.indicator, background: ACCENT }} />}
              </button>
            );
          })}
        </nav>
        <div style={d.footer}>
          <div style={d.divider} />
          {!collapsed && (
            <div style={d.userBlock}>
              <div style={{ ...d.avatar, background: ACCENT }}>{initials}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={d.userName}>{user?.name}</div>
                <div style={d.userRole}>Staff</div>
              </div>
            </div>
          )}
          <button onClick={logout} title="Sign out"
            style={{ ...d.logoutBtn, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '10px 14px' }}>
            <IconLogout size={16} color={MUTED} />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
        <button onClick={() => setCollapsed(v => !v)} style={d.collapseBtn} aria-label={collapsed ? 'Expand' : 'Collapse'}>
          {collapsed ? <IconRight size={14} /> : <IconLeft size={14} />}
        </button>
      </aside>

      <div style={d.body}>
        <header style={d.topbar}>
          <div style={d.topLeft}>
            {current && <current.Icon size={18} color={ACCENT} />}
            <h1 style={d.pageTitle}>{current?.label}</h1>
            {!isTablet && <span style={d.datechip}>{now.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' })}</span>}
          </div>
          <div style={d.topRight}>
            <span style={d.timechip}>{now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}</span>
            {!isTablet && <span style={{ ...d.shiftBadge, color: ACCENT, background:'#ecfdf5', border:`1px solid #a7f3d0` }}>On Shift</span>}
          </div>
        </header>
        <main style={d.content}>{children}</main>
      </div>
    </div>
  );
}

const m: Record<string, React.CSSProperties> = {
  root:           { display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui,sans-serif', fontSize:14, color:'#0f172a' },
  topbar:         { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'#fff', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:40 },
  brand:          { display:'flex', alignItems:'center', gap:8 },
  brandMark:      { width:28, height:28, borderRadius:7, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, flexShrink:0 },
  brandText:      { fontSize:15, fontWeight:800, color:'#0f172a' },
  timechip:       { fontSize:12, fontWeight:700, fontFamily:'monospace', background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:6, padding:'3px 8px', color:'#0f172a' },
  iconBtn:        { background:'none', border:'none', cursor:'pointer', color:'#0f172a', padding:4, display:'flex', alignItems:'center' },
  overlay:        { position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:50, display:'flex' },
  drawer:         { width:264, background:SIDEBAR, height:'100%', display:'flex', flexDirection:'column', paddingBottom:24 },
  drawerUser:     { display:'flex', alignItems:'center', gap:12, padding:'20px 16px 14px' },
  avatar:         { width:36, height:36, borderRadius:'50%', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, flexShrink:0 },
  userName:       { fontSize:13, fontWeight:700, color:'#fff' },
  userRole:       { fontSize:10, color:MUTED, textTransform:'uppercase', letterSpacing:0.8, marginTop:1 },
  divider:        { height:1, background:BORDER, margin:'4px 16px' },
  drawerItem:     { display:'flex', alignItems:'center', gap:12, padding:'11px 16px', border:'none', background:'transparent', color:MUTED, cursor:'pointer', fontSize:13, fontWeight:500, width:'100%', textAlign:'left' },
  drawerItemActive:{ background:ACTIVE, color:'#fff', fontWeight:700 },
  drawerLogout:   { display:'flex', alignItems:'center', gap:10, padding:'11px 16px', border:'none', background:'transparent', color:MUTED, cursor:'pointer', fontSize:13, width:'100%' },
  breadcrumb:     { display:'flex', alignItems:'center', gap:8, padding:'10px 16px', background:'#fff', borderBottom:'1px solid #f1f5f9', fontSize:13 },
  breadcrumbText: { fontWeight:700, color:'#0f172a' },
  staffChip:      { marginLeft:'auto', fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:99 },
  content:        { flex:1, padding:'16px', paddingBottom:80, overflowY:'auto' },
  bottomNav:      { position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTop:'1px solid #e2e8f0', display:'flex', zIndex:40, paddingBottom:'env(safe-area-inset-bottom)' },
  bottomBtn:      { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'8px 0', border:'none', background:'transparent', cursor:'pointer' },
};

const d: Record<string, React.CSSProperties> = {
  root:        { display:'flex', minHeight:'100vh', fontFamily:'system-ui,sans-serif', fontSize:14, color:'#0f172a', background:'#f1f5f9' },
  sidebar:     { background:SIDEBAR, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', overflowX:'hidden', flexShrink:0, transition:'width 180ms ease', zIndex:20 },
  brand:       { display:'flex', alignItems:'center', gap:10 },
  brandMark:   { width:34, height:34, borderRadius:9, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, flexShrink:0 },
  brandName:   { fontSize:15, fontWeight:800, color:'#fff', lineHeight:1.2 },
  brandSub:    { fontSize:9, color:MUTED, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase' },
  divider:     { height:1, background:BORDER, margin:'4px 12px' },
  nav:         { flex:1, padding:'8px', display:'flex', flexDirection:'column', gap:2 },
  navItem:     { display:'flex', alignItems:'center', gap:10, width:'100%', border:'none', borderRadius:8, background:'transparent', color:MUTED, cursor:'pointer', textAlign:'left', whiteSpace:'nowrap', transition:'background 120ms', position:'relative' },
  navItemActive:{ background:ACTIVE, color:'#fff' },
  indicator:   { position:'absolute', right:10, width:6, height:6, borderRadius:'50%' },
  footer:      { padding:'0 8px 20px', display:'flex', flexDirection:'column', gap:4 },
  userBlock:   { display:'flex', alignItems:'center', gap:10, padding:'12px 10px 8px' },
  avatar:      { width:32, height:32, borderRadius:'50%', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 },
  userName:    { fontSize:12, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  userRole:    { fontSize:9, color:MUTED, fontWeight:700, textTransform:'uppercase', letterSpacing:0.8 },
  logoutBtn:   { display:'flex', alignItems:'center', gap:8, border:'none', borderRadius:8, background:'transparent', color:MUTED, cursor:'pointer', width:'100%', fontSize:12, fontWeight:600 },
  collapseBtn: { position:'absolute', top:'50%', right:-12, transform:'translateY(-50%)', width:24, height:24, borderRadius:'50%', background:'#1e2740', color:'#94a3b8', border:`1px solid ${BORDER}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:30 },
  body:        { flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' },
  topbar:      { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', background:'#fff', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:10, gap:12 },
  topLeft:     { display:'flex', alignItems:'center', gap:10 },
  topRight:    { display:'flex', alignItems:'center', gap:10 },
  pageTitle:   { fontSize:18, fontWeight:800, color:'#0f172a', margin:0 },
  datechip:    { fontSize:12, color:'#64748b', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'3px 10px' },
  timechip:    { fontSize:12, fontWeight:700, fontFamily:'monospace', color:'#0f172a', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'3px 10px' },
  shiftBadge:  { fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:99 },
  content:     { flex:1, overflowY:'auto', padding:'28px 32px' },
};
