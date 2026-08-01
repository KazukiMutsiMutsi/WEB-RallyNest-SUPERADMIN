import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import type { AdminPage } from '../types';
import {
  IconDashboard, IconBookings, IconCourts, IconUsers,
  IconStaff, IconReports, IconSettings, IconLogout,
  IconMenu, IconX, IconChevronLeft, IconChevronRight,
  IconBuilding, IconOwner, IconCreditCard, IconGlobe,
  IconTrending, IconAnnounce, IconHeadset, IconActivity,
  IconShield, IconGateway, IconStar, IconToggle, IconDatabase,
} from './AdminIcons';

const NAV_FACILITY: { id: AdminPage; label: string; Icon: React.FC<any> }[] = [
  { id: 'dashboard', label: 'Dashboard', Icon: IconDashboard },
  { id: 'bookings',  label: 'Bookings',  Icon: IconBookings  },
  { id: 'courts',    label: 'Courts',    Icon: IconCourts    },
  { id: 'users',     label: 'Users',     Icon: IconUsers     },
  { id: 'staff',     label: 'Staff',     Icon: IconStaff     },
  { id: 'reports',   label: 'Reports',   Icon: IconReports   },
  { id: 'settings',  label: 'Settings',  Icon: IconSettings  },
];

const NAV_SUPER: { id: AdminPage; label: string; Icon: React.FC<any> }[] = [
  { id: 'global-dashboard',   label: 'Global Dashboard',   Icon: IconGlobe      },
  { id: 'admins',             label: 'Admins',              Icon: IconStaff      },
  { id: 'super-users',        label: 'Users',               Icon: IconUsers      },
  { id: 'tenants',            label: 'Tenants',             Icon: IconBuilding   },
  { id: 'owners',             label: 'Owners',              Icon: IconOwner      },
  { id: 'subscriptions',      label: 'Subscriptions',       Icon: IconCreditCard },
  { id: 'revenue',            label: 'Revenue',             Icon: IconTrending   },
  { id: 'platform-analytics', label: 'Analytics',           Icon: IconActivity   },
  { id: 'announcements',      label: 'Announcements',       Icon: IconAnnounce   },
  { id: 'support',            label: 'Support Center',      Icon: IconHeadset    },
  { id: 'security',           label: 'Security',            Icon: IconShield     },
  { id: 'payment-gateways',   label: 'Payment Gateways',    Icon: IconGateway    },
  { id: 'features',           label: 'Feature Mgmt',        Icon: IconToggle     },
  { id: 'reviews',            label: 'Reviews',             Icon: IconStar       },
  { id: 'platform-reports',   label: 'Platform Reports',    Icon: IconReports    },
  { id: 'platform-settings',  label: 'Platform Settings',   Icon: IconSettings   },
  { id: 'backup',             label: 'Backup & Restore',    Icon: IconDatabase   },
];

const SUPER_PAGES: AdminPage[] = NAV_SUPER.map(n => n.id);

const NAV = NAV_FACILITY;

interface Props {
  page: AdminPage;
  onNavigate: (p: AdminPage) => void;
  children: React.ReactNode;
}

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return w;
}

export default function AdminLayout({ page, onNavigate, children }: Props) {
  const { user, logout } = useAdminAuth();
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [now,        setNow]        = useState(new Date());
  const width = useWindowWidth();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;
  const isSuperAdmin = user?.role === 'superadmin';
  const roleLabel = isSuperAdmin ? 'Super Admin' : 'Admin';

  useEffect(() => {
    if (isTablet) setCollapsed(true);
    else if (!isMobile) setCollapsed(false);
  }, [isMobile, isTablet]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const go = (p: AdminPage) => { onNavigate(p); setMobileOpen(false); };
  const isSuperPage = SUPER_PAGES.includes(page);
  const activeNav   = isSuperPage ? NAV_SUPER : NAV_FACILITY;
  const current     = [...NAV_FACILITY, ...NAV_SUPER].find(n => n.id === page);
  const initials = (user?.name ?? 'AD').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  // ── Mobile ─────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={m.root}>
        <header style={m.topbar}>
          <div style={m.topbarBrand}>
            <div style={m.brandMark}>P</div>
            <span style={m.brandText}>PicklePro</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span style={m.timechip}>{timeStr}</span>
            <button onClick={() => setMobileOpen(v => !v)} style={m.iconBtn} aria-label="Menu">
              {mobileOpen ? <IconX size={20} /> : <IconMenu size={20} />}
            </button>
          </div>
        </header>

        {mobileOpen && (
          <div style={m.overlay} onClick={() => setMobileOpen(false)}>
            <nav style={m.drawer} onClick={e => e.stopPropagation()}>
              <div style={m.drawerUser}>
                <div style={m.avatar}>{initials}</div>
                <div>
                  <div style={m.userName}>{user?.name}</div>
                  <div style={m.userRole}>{roleLabel}</div>
                </div>
              </div>
              <div style={m.divider} />
              {!isSuperAdmin && NAV_FACILITY.map(item => {
                const active = page === item.id;
                return (
                  <button key={item.id} onClick={() => go(item.id)}
                    style={{ ...m.drawerItem, ...(active ? m.drawerItemActive : {}) }}>
                    <item.Icon size={18} color={active ? '#6366f1' : '#64748b'} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              {isSuperAdmin && (
                <>
                  <div style={m.divider} />
                  <div style={{ padding:'6px 16px 2px', fontSize:9, fontWeight:700, color:'#475569', letterSpacing:1.2, textTransform:'uppercase' }}>Super Admin</div>
                  {NAV_SUPER.map(item => {
                    const active = page === item.id;
                    return (
                      <button key={item.id} onClick={() => go(item.id)}
                        style={{ ...m.drawerItem, ...(active ? m.drawerItemActive : {}) }}>
                        <item.Icon size={18} color={active ? '#6366f1' : '#64748b'} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </>
              )}
              <div style={m.divider} />
              <button onClick={logout} style={m.drawerLogout}>
                <IconLogout size={16} color="#64748b" />
                <span>Sign out</span>
              </button>
            </nav>
          </div>
        )}

        <div style={m.breadcrumb}>
          {current && <current.Icon size={14} color="#6366f1" />}
          <span style={m.breadcrumbText}>{current?.label}</span>
          <span style={m.adminChip}>{roleLabel}</span>
        </div>

        <main style={m.content}>{children}</main>

        <nav style={m.bottomNav}>
          {(isSuperAdmin ? NAV_SUPER : NAV_FACILITY).slice(0, 5).map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => go(item.id)}
                style={{ ...m.bottomBtn, ...(active ? m.bottomBtnActive : {}) }}>
                <item.Icon size={20} color={active ? '#6366f1' : '#94a3b8'} />
                <span style={{ fontSize:9, fontWeight: active ? 700 : 500, color: active ? '#6366f1' : '#94a3b8' }}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  // ── Tablet / Desktop ───────────────────────────────────────────────────────
  const SW = collapsed ? 64 : 232;

  return (
    <div style={d.root}>
      <aside style={{ ...d.sidebar, width: SW }}>
        <div style={{ ...d.brand, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '20px 0' : '20px 20px' }}>
          <div style={d.brandMark}>P</div>
          {!collapsed && (
            <div>
              <div style={d.brandName}>PicklePro</div>
              <div style={d.brandSub}>Admin Portal</div>
            </div>
          )}
        </div>

        <div style={d.divider} />

        <nav style={d.nav}>
          {!isSuperAdmin && NAV_FACILITY.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                style={{ ...d.navItem, ...(active ? d.navItemActive : {}), justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '10px 14px' }}>
                <item.Icon size={17} color={active ? '#6366f1' : '#64748b'} />
                {!collapsed && <span style={{ fontSize:13, fontWeight: active ? 700 : 500 }}>{item.label}</span>}
                {active && !collapsed && <div style={d.activeIndicator} />}
              </button>
            );
          })}
          {isSuperAdmin && !collapsed && <div style={{ ...d.divider, margin:'8px 0' }} />}
          {isSuperAdmin && !collapsed && <div style={{ padding:'4px 6px 4px', fontSize:9, fontWeight:700, color:'#475569', letterSpacing:1.2, textTransform:'uppercase' }}>Super Admin</div>}
          {isSuperAdmin && collapsed && <div style={{ ...d.divider, margin:'8px 0' }} />}
          {isSuperAdmin && NAV_SUPER.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => onNavigate(item.id)}
                title={collapsed ? item.label : undefined}
                aria-current={active ? 'page' : undefined}
                style={{ ...d.navItem, ...(active ? d.navItemActive : {}), justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '10px 14px' }}>
                <item.Icon size={17} color={active ? '#6366f1' : '#64748b'} />
                {!collapsed && <span style={{ fontSize:13, fontWeight: active ? 700 : 500 }}>{item.label}</span>}
                {active && !collapsed && <div style={d.activeIndicator} />}
              </button>
            );
          })}
        </nav>

        <div style={d.sidebarFooter}>
          <div style={d.divider} />
          {!collapsed && (
            <div style={d.userBlock}>
              <div style={d.avatar}>{initials}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={d.userName}>{user?.name}</div>
                <div style={d.userRole}>{roleLabel}</div>
              </div>
            </div>
          )}
          <button onClick={logout} title="Sign out"
            style={{ ...d.logoutBtn, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px 0' : '10px 14px' }}>
            <IconLogout size={16} color="#64748b" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>

        <button onClick={() => setCollapsed(v => !v)} style={d.collapseBtn} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          {collapsed ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
        </button>
      </aside>

      <div style={d.body}>
        <header style={d.topbar}>
          <div style={d.topLeft}>
            {current && <current.Icon size={18} color="#6366f1" />}
            <h1 style={d.pageTitle}>{current?.label}</h1>
            {!isTablet && <span style={d.datechip}>{dateStr}</span>}
          </div>
          <div style={d.topRight}>
            <span style={d.timechip}>{now.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit' })}</span>
            {!isTablet && <span style={d.adminChip}>{roleLabel}</span>}
          </div>
        </header>
        <main style={d.content}>{children}</main>
      </div>
    </div>
  );
}

/* ── Shared tokens ─────────────────────────────────────────────────────────── */
const SIDEBAR_BG  = '#0a0f1e';
const SIDEBAR_ACT = '#12172e';
const ACCENT      = '#6366f1';
const BORDER      = '#1e2740';
const TEXT_MUTED  = '#64748b';

/* ── Mobile styles ─────────────────────────────────────────────────────────── */
const m: Record<string, React.CSSProperties> = {
  root:           { display:'flex', flexDirection:'column', minHeight:'100vh', background:'#f8fafc', fontFamily:'system-ui,sans-serif', fontSize:14, color:'#0f172a' },
  topbar:         { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', background:'#fff', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:40 },
  topbarBrand:    { display:'flex', alignItems:'center', gap:8 },
  brandMark:      { width:28, height:28, borderRadius:7, background:ACCENT, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:900, flexShrink:0 },
  brandText:      { fontSize:15, fontWeight:800, color:'#0f172a' },
  timechip:       { fontSize:12, fontWeight:700, fontFamily:'monospace', background:'#f1f5f9', border:'1px solid #e2e8f0', borderRadius:6, padding:'3px 8px', color:'#0f172a' },
  iconBtn:        { background:'none', border:'none', cursor:'pointer', color:'#0f172a', padding:4, display:'flex', alignItems:'center', justifyContent:'center' },
  overlay:        { position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:50, display:'flex' },
  drawer:         { width:264, background:SIDEBAR_BG, height:'100%', display:'flex', flexDirection:'column', paddingBottom:24 },
  drawerUser:     { display:'flex', alignItems:'center', gap:12, padding:'20px 16px 14px' },
  avatar:         { width:36, height:36, borderRadius:'50%', background:ACCENT, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, flexShrink:0 },
  userName:       { fontSize:13, fontWeight:700, color:'#fff' },
  userRole:       { fontSize:10, color:TEXT_MUTED, textTransform:'uppercase', letterSpacing:0.8, marginTop:1 },
  divider:        { height:1, background:BORDER, margin:'4px 16px' },
  drawerItem:     { display:'flex', alignItems:'center', gap:12, padding:'11px 16px', border:'none', background:'transparent', color:TEXT_MUTED, cursor:'pointer', fontSize:13, fontWeight:500, width:'100%', textAlign:'left' },
  drawerItemActive:{ background:SIDEBAR_ACT, color:'#fff', fontWeight:700 },
  drawerLogout:   { display:'flex', alignItems:'center', gap:10, padding:'11px 16px', border:'none', background:'transparent', color:TEXT_MUTED, cursor:'pointer', fontSize:13, fontWeight:500, width:'100%' },
  breadcrumb:     { display:'flex', alignItems:'center', gap:8, padding:'10px 16px', background:'#fff', borderBottom:'1px solid #f1f5f9', fontSize:13 },
  breadcrumbText: { fontWeight:700, color:'#0f172a' },
  adminChip:      { marginLeft:'auto', fontSize:10, fontWeight:700, color:ACCENT, background:'#eef2ff', padding:'2px 8px', borderRadius:99 },
  content:        { flex:1, padding:'16px', paddingBottom:80, overflowY:'auto' },
  bottomNav:      { position:'fixed', bottom:0, left:0, right:0, background:'#fff', borderTop:'1px solid #e2e8f0', display:'flex', zIndex:40, paddingBottom:'env(safe-area-inset-bottom)' },
  bottomBtn:      { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, padding:'8px 0', border:'none', background:'transparent', cursor:'pointer' },
  bottomBtnActive:{ background:'#f5f3ff' },
};

/* ── Desktop styles ────────────────────────────────────────────────────────── */
const d: Record<string, React.CSSProperties> = {
  root:            { display:'flex', minHeight:'100vh', fontFamily:'system-ui,sans-serif', fontSize:14, color:'#0f172a', background:'#f1f5f9' },
  sidebar:         { background:SIDEBAR_BG, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh', overflowY:'auto', overflowX:'hidden', flexShrink:0, transition:'width 180ms ease', zIndex:20 },
  brand:           { display:'flex', alignItems:'center', gap:10 },
  brandMark:       { width:34, height:34, borderRadius:9, background:ACCENT, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, flexShrink:0 },
  brandName:       { fontSize:15, fontWeight:800, color:'#fff', lineHeight:1.2 },
  brandSub:        { fontSize:9, color:TEXT_MUTED, fontWeight:700, letterSpacing:1.2, textTransform:'uppercase' },
  divider:         { height:1, background:BORDER, margin:'4px 12px' },
  nav:             { flex:1, padding:'8px 8px', display:'flex', flexDirection:'column', gap:2 },
  navItem:         { display:'flex', alignItems:'center', gap:10, width:'100%', border:'none', borderRadius:8, background:'transparent', color:TEXT_MUTED, cursor:'pointer', fontSize:13, textAlign:'left', whiteSpace:'nowrap', transition:'background 120ms, color 120ms', position:'relative' },
  navItemActive:   { background:SIDEBAR_ACT, color:'#fff' },
  activeIndicator: { position:'absolute', right:10, width:6, height:6, borderRadius:'50%', background:ACCENT },
  sidebarFooter:   { padding:'0 8px 20px', display:'flex', flexDirection:'column', gap:4 },
  userBlock:       { display:'flex', alignItems:'center', gap:10, padding:'12px 10px 8px' },
  avatar:          { width:32, height:32, borderRadius:'50%', background:ACCENT, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, flexShrink:0 },
  userName:        { fontSize:12, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  userRole:        { fontSize:9, color:TEXT_MUTED, fontWeight:700, textTransform:'uppercase', letterSpacing:0.8 },
  logoutBtn:       { display:'flex', alignItems:'center', gap:8, border:'none', borderRadius:8, background:'transparent', color:TEXT_MUTED, cursor:'pointer', width:'100%', fontSize:12, fontWeight:600, transition:'background 120ms' },
  collapseBtn:     { position:'absolute', top:'50%', right:-12, transform:'translateY(-50%)', width:24, height:24, borderRadius:'50%', background:'#1e2740', color:'#94a3b8', border:`1px solid ${BORDER}`, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', zIndex:30 },
  body:            { flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' },
  topbar:          { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', background:'#fff', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:10, gap:12 },
  topLeft:         { display:'flex', alignItems:'center', gap:10 },
  topRight:        { display:'flex', alignItems:'center', gap:10 },
  pageTitle:       { fontSize:18, fontWeight:800, color:'#0f172a', margin:0 },
  datechip:        { fontSize:12, color:'#64748b', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'3px 10px' },
  timechip:        { fontSize:12, fontWeight:700, fontFamily:'monospace', color:'#0f172a', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:6, padding:'3px 10px' },
  adminChip:       { fontSize:11, fontWeight:700, color:ACCENT, background:'#eef2ff', border:`1px solid #c7d2fe`, padding:'4px 12px', borderRadius:99 },
  content:         { flex:1, overflowY:'auto', padding:'28px 32px' },
};
