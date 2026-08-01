import React, { useState } from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import type { TenantRecord } from "../types";

const A = "#6366f1";
const PLAN_CFG = {
  starter:    { bg: "#f1f5f9", color: "#475569", label: "Starter",    price: "Free / Trial" },
  pro:        { bg: "#eff6ff", color: "#2563eb", label: "Pro",        price: "PHP 2,999/mo"  },
  enterprise: { bg: "#faf5ff", color: "#7c3aed", label: "Enterprise", price: "PHP 7,999/mo"  },
};
const STATUS_CFG: Record<TenantRecord["status"], { bg: string; color: string; label: string }> = {
  active:    { bg: "#dcfce7", color: "#15803d", label: "Active"    },
  suspended: { bg: "#fee2e2", color: "#dc2626", label: "Suspended" },
  pending:   { bg: "#fef3c7", color: "#b45309", label: "Pending"   },
};

const EMPTY_FORM = {
  businessName: "", ownerName: "", ownerEmail: "", ownerPassword: "",
  phone: "", address: "", courtsCount: 1,
  plan: "starter" as TenantRecord["plan"],
  trialExpiration: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
};

export default function SuperTenants() {
  const { getTenants, createTenant, updateTenantStatus, deleteTenant } = useAdminAuth();
  const tenants = getTenants();

  const [showForm, setShowForm]   = useState(false);
  const [form,     setForm]       = useState({ ...EMPTY_FORM });
  const [error,    setError]      = useState("");
  const [created,  setCreated]    = useState<TenantRecord | null>(null);
  const [search,   setSearch]     = useState("");
  const [statusF,  setStatusF]    = useState<"all" | TenantRecord["status"]>("all");
  const [planF,    setPlanF]      = useState<"all" | TenantRecord["plan"]>("all");
  const [viewing,  setViewing]    = useState<TenantRecord | null>(null);

  const filtered = tenants.filter(t => {
    if (statusF !== "all" && t.status !== statusF) return false;
    if (planF   !== "all" && t.plan   !== planF)   return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return t.businessName.toLowerCase().includes(q) || t.ownerName.toLowerCase().includes(q) || t.address.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCreate = () => {
    setError("");
    if (!form.businessName.trim()) { setError("Business name is required."); return; }
    if (!form.ownerName.trim())    { setError("Owner name is required."); return; }
    if (!form.ownerEmail.trim())   { setError("Owner email is required."); return; }
    if (!form.ownerPassword)       { setError("Password is required."); return; }
    if (!form.phone.trim())        { setError("Phone is required."); return; }
    if (!form.address.trim())      { setError("Address is required."); return; }
    const err = createTenant(form);
    if (err) { setError(err); return; }
    // Show the new tenant's credentials
    const newTenant = getTenants().find(t => t.ownerEmail === form.ownerEmail.trim().toLowerCase());
    setCreated(newTenant ?? null);
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
  };

  const activeCount    = tenants.filter(t => t.status === "active").length;
  const suspendedCount = tenants.filter(t => t.status === "suspended").length;
  const pendingCount   = tenants.filter(t => t.status === "pending").length;

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Tenant Management</h2>
          <p style={s.pageSub}>{tenants.length} tenants &nbsp;·&nbsp; {activeCount} active</p>
        </div>
        <button style={s.addBtn} onClick={() => { setShowForm(v => !v); setError(""); setCreated(null); }}>
          {showForm ? "Cancel" : "+ Add Tenant"}
        </button>
      </div>

      {/* KPIs */}
      <div style={s.kpiRow}>
        {[
          { label: "Total",     val: tenants.length,  color: A,         bg: "#eef2ff" },
          { label: "Active",    val: activeCount,     color: "#16a34a", bg: "#f0fdf4" },
          { label: "Suspended", val: suspendedCount,  color: "#dc2626", bg: "#fef2f2" },
          { label: "Pending",   val: pendingCount,    color: "#d97706", bg: "#fffbeb" },
        ].map(k => (
          <div key={k.label} style={{ ...s.kpi, background: k.bg }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: k.color }}>{k.val}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Credentials card after creation */}
      {created && (
        <div style={s.credCard}>
          <div style={s.credTitle}>Tenant Created — Share these credentials with the owner</div>
          <div style={s.credGrid}>
            <CredRow label="Tenant ID"     value={created.tenantId} />
            <CredRow label="Business"      value={created.businessName} />
            <CredRow label="Login Email"   value={created.ownerEmail} mono />
            <CredRow label="Password"      value={created.ownerPassword} mono />
          </div>
          <button style={s.credDismiss} onClick={() => setCreated(null)}>Dismiss</button>
        </div>
      )}

      {/* Onboarding form */}
      {showForm && (
        <div style={s.formCard}>
          <h3 style={s.formTitle}>New Tenant Onboarding</h3>
          {error && <div style={s.errBox}>{error}</div>}

          <div style={s.formSection}>
            <div style={s.sectionLabel}>Business Information</div>
            <div style={s.grid2}>
              <Field label="Business Name"    value={form.businessName} onChange={v => setForm(f => ({ ...f, businessName: v }))} placeholder="e.g. Ace Pickleball Center" />
              <Field label="Business Address" value={form.address}      onChange={v => setForm(f => ({ ...f, address: v }))}      placeholder="e.g. Cebu City" />
              <Field label="Phone"            value={form.phone}        onChange={v => setForm(f => ({ ...f, phone: v }))}        placeholder="+63 917 123 4567" />
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label style={s.fieldLabel}>Number of Courts</label>
                <input type="number" min={1} max={50} value={form.courtsCount}
                  onChange={e => setForm(f => ({ ...f, courtsCount: Number(e.target.value) }))}
                  style={s.input} />
              </div>
            </div>
          </div>

          <div style={s.formSection}>
            <div style={s.sectionLabel}>Owner / Admin Account</div>
            <div style={s.grid2}>
              <Field label="Owner Full Name" value={form.ownerName}     onChange={v => setForm(f => ({ ...f, ownerName: v }))}     placeholder="e.g. John Cruz" />
              <Field label="Email"           value={form.ownerEmail}    onChange={v => setForm(f => ({ ...f, ownerEmail: v }))}    placeholder="owner@facility.com" type="email" />
              <Field label="Temp Password"   value={form.ownerPassword} onChange={v => setForm(f => ({ ...f, ownerPassword: v }))} placeholder="Set a temporary password" type="password" />
            </div>
          </div>

          <div style={s.formSection}>
            <div style={s.sectionLabel}>Subscription Plan</div>
            <div style={s.planGrid}>
              {(["starter", "pro", "enterprise"] as const).map(p => {
                const cfg = PLAN_CFG[p];
                const active = form.plan === p;
                return (
                  <button key={p} onClick={() => setForm(f => ({ ...f, plan: p }))}
                    style={{ ...s.planCard, ...(active ? { ...s.planCardActive, borderColor: A } : {}) }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: active ? A : "#0f172a" }}>{cfg.label}</div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{cfg.price}</div>
                    {active && <div style={s.planCheck}>&#10003;</div>}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={s.formSection}>
            <div style={s.sectionLabel}>Trial Expiration</div>
            <input type="date" value={form.trialExpiration}
              onChange={e => setForm(f => ({ ...f, trialExpiration: e.target.value }))}
              style={{ ...s.input, maxWidth: 220 }} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
            <button style={s.cancelBtn} onClick={() => { setShowForm(false); setError(""); }}>Cancel</button>
            <button style={s.createBtn} onClick={handleCreate}>Create Tenant</button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={s.strip}>
        <div style={s.searchBox}>
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" /></svg>
          <input style={s.searchInput} placeholder="Search facility, owner, address..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={s.filterGroup}>
          {(["all", "active", "suspended", "pending"] as const).map(st => (
            <button key={st} onClick={() => setStatusF(st)} style={{ ...s.filterBtn, ...(statusF === st ? s.filterBtnActive : {}) }}>
              {st === "all" ? "All" : STATUS_CFG[st].label}
            </button>
          ))}
        </div>
        <div style={s.filterGroup}>
          {(["all", "starter", "pro", "enterprise"] as const).map(p => (
            <button key={p} onClick={() => setPlanF(p)} style={{ ...s.filterBtn, ...(planF === p ? s.filterBtnActive : {}) }}>
              {p === "all" ? "All Plans" : PLAN_CFG[p].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={s.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>{["Tenant ID", "Business", "Owner", "Plan", "Courts", "Trial Expires", "Status", "Actions"].map(h => <th key={h} style={s.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No tenants found.</td></tr>
              ) : filtered.map((t, i) => {
                const pc = PLAN_CFG[t.plan];
                const sc = STATUS_CFG[t.status];
                return (
                  <tr key={t.tenantId} style={{ ...s.tr, background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ ...s.td, fontFamily: "monospace", fontSize: 12, color: A, fontWeight: 700 }}>{t.tenantId}</td>
                    <td style={s.td}>
                      <div style={{ fontWeight: 700 }}>{t.businessName}</div>
                      <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{t.address}</div>
                    </td>
                    <td style={s.td}>
                      <div style={{ fontWeight: 600 }}>{t.ownerName}</div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>{t.ownerEmail}</div>
                    </td>
                    <td style={s.td}><span style={{ ...s.badge, background: pc.bg, color: pc.color }}>{pc.label}</span></td>
                    <td style={{ ...s.td, textAlign: "center", fontWeight: 700 }}>{t.courtsCount}</td>
                    <td style={{ ...s.td, color: "#64748b", fontSize: 12 }}>{t.trialExpiration}</td>
                    <td style={s.td}><span style={{ ...s.badge, background: sc.bg, color: sc.color }}>{sc.label}</span></td>
                    <td style={s.td}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <button style={s.viewBtn} onClick={() => setViewing(t)}>View</button>
                        {t.status !== "active"    && <TinyBtn label="Activate" color="#15803d" bg="#f0fdf4" border="#bbf7d0" onClick={() => updateTenantStatus(t.tenantId, "active")} />}
                        {t.status === "active"    && <TinyBtn label="Suspend"  color="#dc2626" bg="#fff5f5" border="#fecaca" onClick={() => updateTenantStatus(t.tenantId, "suspended")} />}
                        <TinyBtn label="Delete" color="#dc2626" bg="#fff5f5" border="#fecaca" onClick={() => { if (window.confirm("Delete this tenant and their admin account?")) deleteTenant(t.tenantId); }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {viewing && (
        <div style={m.backdrop} onClick={() => setViewing(null)}>
          <div style={m.panel} onClick={e => e.stopPropagation()}>
            <div style={m.head}>
              <div>
                <h2 style={m.title}>{viewing.businessName}</h2>
                <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{viewing.tenantId} &nbsp;·&nbsp; {PLAN_CFG[viewing.plan].label}</p>
              </div>
              <button onClick={() => setViewing(null)} style={m.close}>&#x2715;</button>
            </div>
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                ["Owner",           viewing.ownerName],
                ["Email",           viewing.ownerEmail],
                ["Phone",           viewing.phone],
                ["Address",         viewing.address],
                ["Courts",          String(viewing.courtsCount)],
                ["Plan",            PLAN_CFG[viewing.plan].label],
                ["Trial Expires",   viewing.trialExpiration],
                ["Created",         viewing.createdAt],
                ["Status",          STATUS_CFG[viewing.status].label],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#64748b", fontWeight: 600 }}>{k}</span>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{label}</label>
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
        style={{ padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#0f172a", outline: "none" }} />
    </div>
  );
}

function CredRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", fontFamily: mono ? "monospace" : "inherit" }}>{value}</span>
    </div>
  );
}

function TinyBtn({ label, color, bg, border, onClick }: { label: string; color: string; bg: string; border: string; onClick: () => void }) {
  return <button onClick={onClick} style={{ padding: "4px 10px", borderRadius: 6, border: `1px solid ${border}`, background: bg, color, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>{label}</button>;
}

const s: Record<string, React.CSSProperties> = {
  page:          { display: "flex", flexDirection: "column", gap: 20 },
  pageHead:      { display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 },
  pageTitle:     { fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 },
  pageSub:       { fontSize: 13, color: "#64748b", marginTop: 4 },
  addBtn:        { padding: "9px 18px", background: A, color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: "pointer" },
  kpiRow:        { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 },
  kpi:           { borderRadius: 12, padding: "16px 20px", border: "1px solid #e2e8f0" },
  credCard:      { background: "#f0fdf4", border: "2px solid #bbf7d0", borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", gap: 12 },
  credTitle:     { fontSize: 14, fontWeight: 700, color: "#15803d" },
  credGrid:      { display: "flex", flexDirection: "column" },
  credDismiss:   { alignSelf: "flex-end", padding: "7px 16px", background: "#fff", border: "1px solid #bbf7d0", borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#15803d", cursor: "pointer" },
  formCard:      { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 28, display: "flex", flexDirection: "column", gap: 24 },
  formTitle:     { fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 },
  errBox:        { background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", borderRadius: 8, padding: "10px 14px", fontSize: 13 },
  formSection:   { display: "flex", flexDirection: "column", gap: 12 },
  sectionLabel:  { fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1 },
  grid2:         { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 },
  fieldLabel:    { fontSize: 12, fontWeight: 600, color: "#64748b" },
  input:         { padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, color: "#0f172a", outline: "none" },
  planGrid:      { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 },
  planCard:      { padding: "14px 16px", border: "2px solid #e2e8f0", borderRadius: 10, background: "#fff", cursor: "pointer", textAlign: "left", position: "relative" },
  planCardActive:{ background: "#eef2ff", border: "2px solid" },
  planCheck:     { position: "absolute", top: 10, right: 10, width: 18, height: 18, borderRadius: "50%", background: A, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900 },
  cancelBtn:     { padding: "10px 22px", background: "#f1f5f9", color: "#334155", border: "1px solid #e2e8f0", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" },
  createBtn:     { padding: "10px 22px", background: A, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" },
  strip:         { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
  searchBox:     { display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 9, padding: "0 14px", height: 38, flex: 1, minWidth: 220 },
  searchInput:   { border: "none", outline: "none", fontSize: 13, color: "#0f172a", background: "transparent", flex: 1 },
  filterGroup:   { display: "flex", gap: 4 },
  filterBtn:     { padding: "6px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", fontSize: 12, fontWeight: 600, color: "#64748b", cursor: "pointer" },
  filterBtnActive: { background: A, color: "#fff", border: `1px solid ${A}` },
  card:          { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden" },
  table:         { width: "100%", borderCollapse: "collapse", minWidth: 900 },
  th:            { padding: "11px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#94a3b8", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", textTransform: "uppercase", letterSpacing: .8 },
  tr:            { borderBottom: "1px solid #f8fafc" },
  td:            { padding: "12px 16px", fontSize: 13, color: "#0f172a", verticalAlign: "middle" },
  badge:         { display: "inline-block", padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700 },
  viewBtn:       { padding: "4px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 11, fontWeight: 700, cursor: "pointer" },
};
const m: Record<string, React.CSSProperties> = {
  backdrop: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  panel:    { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, overflow: "hidden", maxHeight: "90vh", overflowY: "auto" },
  head:     { display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" },
  title:    { fontSize: 16, fontWeight: 800, margin: 0, color: "#0f172a" },
  close:    { background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8", padding: 4 },
};