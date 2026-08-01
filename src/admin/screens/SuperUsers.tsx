import React, { useState } from 'react';
import { PLATFORM_USERS } from '../data/mock';
import { TENANTS } from '../data/mock';
import type { PlatformUser } from '../types';

const A = '#6366f1';

const STATUS_CFG: Record<PlatformUser['status'], { bg: string; color: string; label: string }> = {
  active:  { bg: '#dcfce7', color: '#15803d', label: 'Active'  },
  flagged: { bg: '#fef3c7', color: '#b45309', label: 'Flagged' },
  banned:  { bg: '#fee2e2', color: '#dc2626', label: 'Banned'  },
};

function SearchIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
    </svg>
  );
}

export default function SuperUsers() {
  const [users, setUsers] = useState<PlatformUser[]>(PLATFORM_USERS);
  const [search,   setSearch]   = useState('');
  const [statusF,  setStatusF]  = useState<'all' | PlatformUser['status']>('all');
  const [facilityF,setFacilityF]= useState<'all' | string>('all');

  const update = (id: string, status: PlatformUser['status']) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));

  const facilities = Array.from(new Set(users.map(u => u.facilityName))).sort();

  const filtered = users.filter(u => {
    if (statusF !== 'all' && u.status !== statusF) return false;
    if (facilityF !== 'all' && u.facilityName !== facilityF) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      u.facilityName.toLowerCase().includes(q)
    );
  });

  const totalUsers    = users.length;
  const activeCount   = users.filter(u => u.status === 'active').length;
  const flaggedCount  = users.filter(u => u.status === 'flagged').length;
  const bannedCount   = users.filter(u => u.status === 'banned').length;
  const totalSpent    = users.reduce((s, u) => s + u.totalSpent, 0);
  const totalBookings = users.reduce((s, u) => s + u.totalBookings, 0);

  return (
    <div style={s.page}>
      {/* Stats row */}
      <div style={s.stats}>
        <StatCard label="Total Users"     value={totalUsers}                  color="#6366f1" />
        <StatCard label="Active"          value={activeCount}                 color="#16a34a" />
        <StatCard label="Flagged"         value={flaggedCount}                color="#b45309" />
        <StatCard label="Banned"          value={bannedCount}                 color="#dc2626" />
        <StatCard label="Total Bookings"  value={totalBookings}               color="#0ea5e9" />
        <StatCard label="Total Revenue"   value={`₱${totalSpent.toLocaleString()}`} color="#7c3aed" isText />
      </div>

      {/* Filters */}
      <div style={s.filters}>
        <div style={s.filterGroup}>
          {(['all', 'active', 'flagged', 'banned'] as const).map(st => (
            <button key={st} onClick={() => setStatusF(st)}
              style={{ ...s.filterBtn, ...(statusF === st ? s.filterBtnActive : {}) }}>
              {st === 'all' ? `All (${totalUsers})` : `${st.charAt(0).toUpperCase() + st.slice(1)} (${st === 'active' ? activeCount : st === 'flagged' ? flaggedCount : bannedCount})`}
            </button>
          ))}
        </div>

        <div style={s.filterRight}>
          {/* Facility filter */}
          <select value={facilityF} onChange={e => setFacilityF(e.target.value)} style={s.select}>
            <option value="all">All Facilities ({TENANTS.length})</option>
            {facilities.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          {/* Search */}
          <div style={s.searchBox}>
            <SearchIcon />
            <input style={s.searchInput} placeholder="Search name, email, phone..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={s.card}>
        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {['User', 'Contact', 'Facility', 'Joined', 'Bookings', 'Spent', 'Status', 'Actions'].map(h => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={s.empty}>No users match your filters.</td></tr>
              ) : filtered.map((u, i) => {
                const cfg = STATUS_CFG[u.status];
                return (
                  <tr key={u.id} style={{ ...s.tr, background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          ...s.avatar,
                          background: u.status === 'banned' ? '#fee2e2' : u.status === 'flagged' ? '#fef3c7' : A + '18',
                          color: u.status === 'banned' ? '#dc2626' : u.status === 'flagged' ? '#b45309' : A,
                        }}>
                          {u.name[0]}
                        </div>
                        <div>
                          <div style={s.userName}>{u.name}</div>
                          <div style={s.userId}>{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}>
                      <div style={{ fontSize: 13, color: '#334155' }}>{u.email}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{u.phone}</div>
                    </td>
                    <td style={s.td}>
                      <span style={s.facilityChip}>{u.facilityName}</span>
                    </td>
                    <td style={{ ...s.td, color: '#64748b' }}>{u.joinedDate}</td>
                    <td style={{ ...s.td, fontWeight: 700, textAlign: 'center' as const }}>{u.totalBookings}</td>
                    <td style={{ ...s.td, fontWeight: 700, color: '#16a34a' }}>₱{u.totalSpent.toLocaleString()}</td>
                    <td style={s.td}>
                      <span style={{ ...s.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {u.status !== 'flagged' && (
                          <ActionBtn label="Flag"    color="#b45309" bg="#fffbeb" border="#fde68a" onClick={() => update(u.id, 'flagged')} />
                        )}
                        {u.status !== 'banned' && (
                          <ActionBtn label="Ban"     color="#dc2626" bg="#fff5f5" border="#fecaca" onClick={() => update(u.id, 'banned')} />
                        )}
                        {u.status !== 'active' && (
                          <ActionBtn label="Restore" color="#15803d" bg="#f0fdf4" border="#bbf7d0" onClick={() => update(u.id, 'active')} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div style={s.tableFooter}>
            Showing {filtered.length} of {users.length} users
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, isText }: { label: string; value: number | string; color: string; isText?: boolean }) {
  return (
    <div style={s.statCard}>
      <div style={{ fontSize: isText ? 20 : 26, fontWeight: 900, color }}>{value}</div>
      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ActionBtn({ label, color, bg, border, onClick }: { label: string; color: string; bg: string; border: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${border}`, background: bg, color, fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>
      {label}
    </button>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:         { display: 'flex', flexDirection: 'column', gap: 16 },
  stats:        { display: 'flex', gap: 12, flexWrap: 'wrap' },
  statCard:     { flex: '1 1 120px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 18px', display: 'flex', flexDirection: 'column' },
  filters:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '10px 14px', flexWrap: 'wrap' },
  filterGroup:  { display: 'flex', gap: 4, flexWrap: 'wrap' },
  filterBtn:    { padding: '6px 14px', borderRadius: 8, border: 'none', background: 'transparent', fontSize: 12, fontWeight: 600, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap' as const },
  filterBtnActive: { background: A, color: '#fff' },
  filterRight:  { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  select:       { padding: '7px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 12, color: '#334155', outline: 'none', background: '#f8fafc', cursor: 'pointer' },
  searchBox:    { display: 'flex', alignItems: 'center', gap: 8, background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 9, padding: '0 14px', height: 36 },
  searchInput:  { border: 'none', outline: 'none', fontSize: 13, color: '#0f172a', background: 'transparent', minWidth: 200 },
  card:         { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  table:        { width: '100%', borderCollapse: 'collapse' as const, minWidth: 900 },
  th:           { padding: '11px 16px', textAlign: 'left' as const, fontSize: 10, fontWeight: 700, color: '#94a3b8', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', textTransform: 'uppercase' as const, letterSpacing: .8, whiteSpace: 'nowrap' as const },
  tr:           { borderBottom: '1px solid #f8fafc' },
  td:           { padding: '12px 16px', fontSize: 13, color: '#0f172a', verticalAlign: 'middle' as const },
  avatar:       { width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, flexShrink: 0 },
  userName:     { fontWeight: 700, fontSize: 13 },
  userId:       { fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', marginTop: 1 },
  facilityChip: { fontSize: 11, fontWeight: 600, background: '#eef2ff', color: '#4338ca', padding: '3px 10px', borderRadius: 99, whiteSpace: 'nowrap' as const },
  badge:        { display: 'inline-block', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700 },
  empty:        { padding: 48, textAlign: 'center' as const, color: '#94a3b8', fontSize: 13 },
  tableFooter:  { padding: '10px 20px', fontSize: 12, color: '#94a3b8', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
};
