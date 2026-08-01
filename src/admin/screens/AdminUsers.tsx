import React, { useState } from "react";
import { useTenant } from "../context/TenantContext";
import type { AdminCustomer } from "../types";

const A = "#6366f1";
const STATUS_CFG: Record<AdminCustomer["status"], { bg: string; color: string; label: string }> = {
  active:  { bg: "#dcfce7", color: "#15803d", label: "Active"  },
  flagged: { bg: "#fef3c7", color: "#b45309", label: "Flagged" },
  banned:  { bg: "#fee2e2", color: "#dc2626", label: "Banned"  },
};

export default function AdminUsers() {
  const { customers, updateCustomer } = useTenant();
  const [search,  setSearch]  = useState("");
  const [statusF, setStatusF] = useState<"all" | AdminCustomer["status"]>("all");

  const filtered = customers.filter(u => {
    if (statusF !== "all" && u.status !== statusF) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
  });

  const counts = {
    active:  customers.filter(u => u.status === "active").length,
    flagged: customers.filter(u => u.status === "flagged").length,
    banned:  customers.filter(u => u.status === "banned").length,
  };

  return (
    <div style={s.page}>
      <div style={s.strip}>
        {(["all", "active", "flagged", "banned"] as const).map(st => (
          <button key={st} onClick={() => setStatusF(st)}
            style={{ ...s.stripBtn, ...(statusF === st ? s.stripBtnActive : {}) }}>
            <span style={{ fontWeight: 700 }}>
              {st === "all" ? customers.length : counts[st as keyof typeof counts]}
            </span>
            &nbsp;{st.charAt(0).toUpperCase() + st.slice(1)}
          </button>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 9, padding: "0 14px", height: 38 }}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
          <input style={s.search} placeholder="Search name, email or phone..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {customers.length === 0 && (
        <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: 14, background: "#fff", border: "1px dashed #e2e8f0", borderRadius: 14 }}>
          No customers yet for this facility.
        </div>
      )}

      {customers.length > 0 && (
        <div style={s.card}>
          <div style={{ overflowX: "auto" }}>
            <table style={s.table}>
              <thead>
                <tr>{["Customer", "Email", "Phone", "Joined", "Bookings", "Total Spent", "Status", "Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} style={s.empty}>No customers match your filters.</td></tr>
                ) : filtered.map((u, i) => {
                  const cfg = STATUS_CFG[u.status];
                  return (
                    <tr key={u.id} style={{ ...s.tr, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={s.td}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ ...s.avatar, background: u.status === "banned" ? "#fee2e2" : u.status === "flagged" ? "#fef3c7" : A + "18", color: u.status === "banned" ? "#dc2626" : u.status === "flagged" ? "#b45309" : A }}>
                            {u.name[0]}
                          </div>
                          <div>
                            <div style={s.userName}>{u.name}</div>
                            <div style={s.userId}>{u.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ ...s.td, color: "#64748b" }}>{u.email}</td>
                      <td style={{ ...s.td, color: "#64748b" }}>{u.phone}</td>
                      <td style={{ ...s.td, color: "#64748b" }}>{u.joinedDate}</td>
                      <td style={{ ...s.td, fontWeight: 700, textAlign: "center" }}>{u.totalBookings}</td>
                      <td style={{ ...s.td, fontWeight: 700, color: "#16a34a" }}>&#8369;{u.totalSpent.toLocaleString()}</td>
                      <td style={s.td}><span style={{ ...s.badge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span></td>
                      <td style={s.td}>
                        <div style={{ display: "flex", gap: 6 }}>
                          {u.status !== "flagged" && <ActionBtn label="Flag"    color="#b45309" bg="#fffbeb" border="#fde68a" onClick={() => updateCustomer(u.id, { status: "flagged" })} />}
                          {u.status !== "banned"  && <ActionBtn label="Ban"     color="#dc2626" bg="#fff5f5" border="#fecaca" onClick={() => updateCustomer(u.id, { status: "banned"  })} />}
                          {u.status !== "active"  && <ActionBtn label="Restore" color="#15803d" bg="#f0fdf4" border="#bbf7d0" onClick={() => updateCustomer(u.id, { status: "active"  })} />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ label, color, bg, border, onClick }: { label: string; color: string; bg: string; border: string; onClick: () => void }) {
  return <button onClick={onClick} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: bg, color, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{label}</button>;
}

const s: Record<string, React.CSSProperties> = {
  page:          { display: "flex", flexDirection: "column", gap: 16 },
  strip:         { display: "flex", alignItems: "center", gap: 4, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "10px 12px", flexWrap: "wrap" },
  stripBtn:      { padding: "6px 14px", borderRadius: 8, border: "none", background: "transparent", fontSize: 13, fontWeight: 500, color: "#64748b", cursor: "pointer" },
  stripBtnActive:{ background: A, color: "#fff", fontWeight: 700 },
  search:        { border: "none", outline: "none", fontSize: 13, color: "#0f172a", background: "transparent", minWidth: 220 },
  card:          { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" },
  table:         { width: "100%", borderCollapse: "collapse", minWidth: 860 },
  th:            { padding: "11px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#94a3b8", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", textTransform: "uppercase", letterSpacing: .8 },
  tr:            { borderBottom: "1px solid #f8fafc" },
  td:            { padding: "12px 16px", fontSize: 13, color: "#0f172a", verticalAlign: "middle" },
  avatar:        { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, flexShrink: 0 },
  userName:      { fontWeight: 700, fontSize: 13 },
  userId:        { fontSize: 10, color: "#94a3b8", fontFamily: "monospace", marginTop: 1 },
  badge:         { display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 },
  empty:         { padding: 48, textAlign: "center", color: "#94a3b8", fontSize: 13 },
};