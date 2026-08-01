import React, { useState } from "react";
import { useTenant } from "../context/TenantContext";
import type { AdminCourt } from "../types";

const TODAY = new Date().toISOString().slice(0, 10);
const A = "#6366f1";
const EMPTY: Partial<AdminCourt> = { name: "", location: "", type: "Indoor", pricePerHour: 210, active: true };

const ic = (d: string, size = 14, color = "currentColor") => (
  React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round" },
    React.createElement("path", { d }))
);

export default function AdminCourts() {
  const { courts, bookings, addCourt, updateCourt, deleteCourt } = useTenant();
  const [editing,   setEditing]   = useState<AdminCourt | null>(null);
  const [form,      setForm]      = useState<Partial<AdminCourt>>({});
  const [adding,    setAdding]    = useState(false);
  const [addForm,   setAddForm]   = useState<Partial<AdminCourt>>({ ...EMPTY });
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [prices,    setPrices]    = useState<Record<string, string>>(() =>
    Object.fromEntries(courts.map(c => [c.id, String(c.pricePerHour)]))
  );

  const openEdit  = (c: AdminCourt) => { setEditing(c); setForm({ ...c }); };
  const closeEdit = () => { setEditing(null); setForm({}); };

  const saveEdit = () => {
    if (!editing) return;
    updateCourt(editing.id, form as Partial<AdminCourt>);
    closeEdit();
  };

  const toggleActive = (id: string) => {
    const c = courts.find(c => c.id === id);
    if (c) updateCourt(id, { active: !c.active });
  };

  const handlePriceChange = (id: string, raw: string) => {
    if (raw !== "" && !/^\d+$/.test(raw)) return;
    setPrices(p => ({ ...p, [id]: raw }));
    const val = Number(raw);
    if (val > 0) updateCourt(id, { pricePerHour: val });
  };

  const handleAdd = () => {
    if (!addForm.name?.trim()) return;
    const newId = `c${Date.now()}`;
    addCourt({ id: newId, name: addForm.name.trim(), location: addForm.location?.trim() || "", type: addForm.type ?? "Indoor", pricePerHour: Number(addForm.pricePerHour) || 210, active: true });
    setPrices(p => ({ ...p, [newId]: String(addForm.pricePerHour || 210) }));
    setAdding(false);
    setAddForm({ ...EMPTY });
  };

  const handleDelete = (id: string) => {
    deleteCourt(id);
    setPrices(p => { const c = { ...p }; delete c[id]; return c; });
    setConfirmId(null);
  };

  const openCourts   = courts.filter(c => c.active).length;
  const totalRevenue = bookings.filter(b => b.paid).reduce((s, b) => s + b.amount, 0);

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Courts</h2>
          <p style={s.pageSub}>{courts.length} courts &nbsp;·&nbsp; {openCourts} open &nbsp;·&nbsp; &#8369;{totalRevenue.toLocaleString()} total revenue</p>
        </div>
        <button style={s.btnAdd} onClick={() => setAdding(true)}>+ Add Court</button>
      </div>

      {courts.length === 0 && !adding && (
        <div style={s.empty}>No courts yet. Click "Add Court" to create your first court.</div>
      )}

      <div style={s.grid}>
        {courts.map(c => {
          const todayB = bookings.filter(b => b.courtId === c.id && b.date === TODAY).length;
          const totalB = bookings.filter(b => b.courtId === c.id).length;
          const rev    = bookings.filter(b => b.courtId === c.id && b.paid).reduce((s, b) => s + b.amount, 0);
          return (
            <div key={c.id} style={{ ...s.card, opacity: c.active ? 1 : 0.65 }}>
              <div style={{ ...s.statusBar, background: c.active ? "#16a34a" : "#94a3b8" }} />
              <div style={s.cardBody}>
                <div>
                  <div style={s.courtName}>{c.name}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <span style={s.typePill}>{c.type}</span>
                    <span style={{ ...s.statusPill, background: c.active ? "#dcfce7" : "#f1f5f9", color: c.active ? "#15803d" : "#64748b" }}>
                      {c.active ? "Open" : "Closed"}
                    </span>
                  </div>
                </div>
                <div style={s.metaBlock}>
                  <div style={s.metaRow}><span style={s.metaText}>{c.location || "No location set"}</span></div>
                  <div style={s.metaRow}>
                    <span style={s.priceLabel}>Rate</span>
                    <div style={s.priceWrap}>
                      <span style={s.pesoSign}>&#8369;</span>
                      <input type="text" inputMode="numeric"
                        value={prices[c.id] ?? String(c.pricePerHour)}
                        onChange={e => handlePriceChange(c.id, e.target.value)}
                        style={s.priceInput} />
                      <span style={s.perHr}>/hr</span>
                    </div>
                  </div>
                </div>
                <div style={s.statsRow}>
                  <div style={s.stat}><div style={s.statNum}>{todayB}</div><div style={s.statLbl}>Today</div></div>
                  <div style={s.statLine} />
                  <div style={s.stat}><div style={s.statNum}>{totalB}</div><div style={s.statLbl}>All-time</div></div>
                  <div style={s.statLine} />
                  <div style={s.stat}><div style={{ ...s.statNum, color: "#16a34a" }}>&#8369;{rev.toLocaleString()}</div><div style={s.statLbl}>Revenue</div></div>
                </div>
                <div style={s.actions}>
                  <button style={s.btnEdit} onClick={() => openEdit(c)}>Edit</button>
                  <button style={{ ...s.btnToggle, ...(c.active ? s.btnClose : s.btnOpen) }} onClick={() => toggleActive(c.id)}>
                    {c.active ? "Close" : "Open"}
                  </button>
                  <button style={s.btnRemove} onClick={() => setConfirmId(c.id)}>Remove</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {adding && (
        <Modal title="Add New Court" onClose={() => { setAdding(false); setAddForm({ ...EMPTY }); }}>
          <CourtForm form={addForm} setForm={setAddForm} />
          <ModalFooter onCancel={() => { setAdding(false); setAddForm({ ...EMPTY }); }} onConfirm={handleAdd} confirmLabel="Add Court" />
        </Modal>
      )}
      {editing && (
        <Modal title={`Edit - ${editing.name}`} onClose={closeEdit}>
          <CourtForm form={form} setForm={setForm} />
          <ModalFooter onCancel={closeEdit} onConfirm={saveEdit} confirmLabel="Save Changes" />
        </Modal>
      )}
      {confirmId && (
        <Modal title="Remove Court" onClose={() => setConfirmId(null)}>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: 0 }}>
            Permanently remove <strong>{courts.find(c => c.id === confirmId)?.name}</strong>? This cannot be undone.
          </p>
          <ModalFooter onCancel={() => setConfirmId(null)} onConfirm={() => handleDelete(confirmId!)} confirmLabel="Remove" danger />
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={m.backdrop}>
      <div style={m.panel}>
        <div style={m.head}><h2 style={m.title}>{title}</h2><button onClick={onClose} style={m.close}>&#x2715;</button></div>
        <div style={m.body}>{children}</div>
      </div>
    </div>
  );
}

function ModalFooter({ onCancel, onConfirm, confirmLabel, danger }: { onCancel: () => void; onConfirm: () => void; confirmLabel: string; danger?: boolean }) {
  return (
    <div style={m.footer}>
      <button style={m.btnCancel} onClick={onCancel}>Cancel</button>
      <button style={{ ...m.btnConfirm, background: danger ? "#dc2626" : A }} onClick={onConfirm}>{confirmLabel}</button>
    </div>
  );
}

function CourtForm({ form, setForm }: { form: Partial<AdminCourt>; setForm: React.Dispatch<React.SetStateAction<Partial<AdminCourt>>> }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {([ { label: "Court Name", key: "name", type: "text", placeholder: "e.g. Court A" },
           { label: "Location",   key: "location", type: "text", placeholder: "e.g. Pajo, Lapu-Lapu City" },
           { label: "Price/hr (PHP)", key: "pricePerHour", type: "number", placeholder: "210" },
      ] as const).map(({ label, key, type, placeholder }) => (
        <div key={key} style={m.field}>
          <label style={m.label}>{label}</label>
          <input style={m.input} type={type} placeholder={placeholder} value={(form as any)[key] ?? ""}
            onChange={e => setForm(f => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))} />
        </div>
      ))}
      <div style={m.field}>
        <label style={m.label}>Type</label>
        <select style={m.input} value={form.type ?? "Indoor"} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}>
          <option>Indoor</option><option>Outdoor</option><option>Covered</option>
        </select>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:      { display: "flex", flexDirection: "column", gap: 24 },
  pageHead:  { display: "flex", alignItems: "flex-start", justifyContent: "space-between" },
  pageTitle: { fontSize: 20, fontWeight: 800, color: "#0f172a", margin: 0 },
  pageSub:   { fontSize: 13, color: "#64748b", marginTop: 4 },
  btnAdd:    { padding: "10px 18px", borderRadius: 9, border: "none", background: A, color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  empty:     { padding: "40px", textAlign: "center", color: "#94a3b8", fontSize: 14, background: "#fff", border: "1px dashed #e2e8f0", borderRadius: 14 },
  grid:      { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 },
  card:      { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column" },
  statusBar: { height: 4, flexShrink: 0 },
  cardBody:  { padding: 20, display: "flex", flexDirection: "column", gap: 14, flex: 1 },
  courtName: { fontSize: 16, fontWeight: 800, color: "#0f172a" },
  typePill:  { fontSize: 10, fontWeight: 700, background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: 99, textTransform: "uppercase" },
  statusPill:{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99 },
  metaBlock: { display: "flex", flexDirection: "column", gap: 7 },
  metaRow:   { display: "flex", alignItems: "center", gap: 7 },
  metaText:  { color: "#64748b", fontSize: 13 },
  priceLabel:{ fontSize: 12, fontWeight: 700, color: "#94a3b8", width: 28, flexShrink: 0 },
  priceWrap: { display: "flex", alignItems: "center", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 7, overflow: "hidden" },
  pesoSign:  { padding: "5px 7px", fontSize: 12, fontWeight: 700, color: "#475569", background: "#f1f5f9", borderRight: "1px solid #e2e8f0" },
  priceInput:{ width: 62, padding: "5px 6px", border: "none", outline: "none", fontSize: 13, fontWeight: 700, background: "transparent", textAlign: "right" },
  perHr:     { padding: "5px 7px", fontSize: 11, color: "#94a3b8", background: "#f1f5f9", borderLeft: "1px solid #e2e8f0" },
  statsRow:  { display: "flex", alignItems: "center", background: "#f8fafc", borderRadius: 10, padding: "12px 0" },
  stat:      { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  statLine:  { width: 1, height: 30, background: "#e2e8f0" },
  statNum:   { fontSize: 18, fontWeight: 900, color: "#0f172a" },
  statLbl:   { fontSize: 9, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase" },
  actions:   { display: "flex", gap: 8 },
  btnEdit:   { flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#0f172a", fontSize: 12, fontWeight: 600, cursor: "pointer" },
  btnToggle: { flex: 1, padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", border: "none" },
  btnClose:  { background: "#fef3c7", color: "#b45309" },
  btnOpen:   { background: "#dcfce7", color: "#15803d" },
  btnRemove: { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #fecaca", background: "#fff", color: "#dc2626", fontSize: 12, fontWeight: 600, cursor: "pointer" },
};

const m: Record<string, React.CSSProperties> = {
  backdrop:  { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  panel:     { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, overflow: "hidden" },
  head:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #f1f5f9" },
  title:     { fontSize: 16, fontWeight: 800, margin: 0, color: "#0f172a" },
  close:     { background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94a3b8", padding: 4 },
  body:      { padding: "20px 24px" },
  footer:    { display: "flex", gap: 8, justifyContent: "flex-end", padding: "16px 24px", borderTop: "1px solid #f1f5f9" },
  btnCancel: { padding: "9px 18px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontSize: 13, cursor: "pointer" },
  btnConfirm:{ padding: "9px 20px", borderRadius: 8, border: "none", color: "#fff", fontSize: 13, fontWeight: 700, cursor: "pointer" },
  field:     { display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 },
  label:     { fontSize: 12, fontWeight: 700, color: "#374151" },
  input:     { padding: "9px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box" },
};