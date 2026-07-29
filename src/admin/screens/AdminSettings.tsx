import React, { useRef, useState } from 'react';

const ACCENT = '#6366f1';

/* ── Types ──────────────────────────────────────────────────────────────────── */
interface Settings {
  openHour: number;
  closeHour: number;
  pricePerHour: number;
  advanceBookingDays: number;
  sameDayBufferHours: number;
  promoEnabled: boolean;
  promoCode: string;
  promoDiscount: number;
  serviceFeePercent: number;
  cancellationHours: number;
  cancellationFeePercent: number;
  notifyOnBooking: boolean;
  notifyOnCancellation: boolean;
  notifyOnReschedule: boolean;
}

interface VenueImage {
  id: string;
  url: string;
  name: string;
  size: string;
  isPrimary: boolean;
}

const DEFAULT: Settings = {
  openHour: 9, closeHour: 24,
  pricePerHour: 210,
  advanceBookingDays: 30, sameDayBufferHours: 1,
  promoEnabled: true, promoCode: 'PICKLE10', promoDiscount: 10,
  serviceFeePercent: 5,
  cancellationHours: 24, cancellationFeePercent: 50,
  notifyOnBooking: true, notifyOnCancellation: true, notifyOnReschedule: false,
};

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function AdminSettings() {
  const [cfg,    setCfg]    = useState<Settings>(DEFAULT);
  const [saved,  setSaved]  = useState(false);
  const [dirty,  setDirty]  = useState(false);
  const [images, setImages] = useState<VenueImage[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof Settings, value: any) => {
    setCfg(p => ({ ...p, [key]: value }));
    setDirty(true);
    setSaved(false);
  };

  const save = () => {
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  };

  /* ── Image handlers ────────────────────────────────────────────────────── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const url = URL.createObjectURL(file);
      const kb  = (file.size / 1024).toFixed(0);
      const size = file.size >= 1024 * 1024
        ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
        : `${kb} KB`;
      setImages(prev => [...prev, {
        id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        url, name: file.name, size,
        isPrimary: prev.length === 0, // first uploaded becomes primary
      }]);
    });
    // reset input so same file can be re-uploaded
    e.target.value = '';
  };

  const setPrimary = (id: string) =>
    setImages(prev => prev.map(img => ({ ...img, isPrimary: img.id === id })));

  const removeImage = (id: string) => {
    setImages(prev => {
      const next = prev.filter(img => img.id !== id);
      // if removed was primary, promote first remaining
      const hadPrimary = prev.find(i => i.id === id)?.isPrimary;
      if (hadPrimary && next.length > 0) next[0].isPrimary = true;
      return next;
    });
    setConfirmDeleteId(null);
  };
  const reset = () => { setCfg(DEFAULT); setDirty(false); setSaved(false); };

  return (
    <div style={s.page}>
      {/* Page header */}
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Settings</h2>
          <p style={s.pageSub}>Configure your venue, pricing and booking rules</p>
        </div>
        {dirty && <span style={s.unsavedPill}>Unsaved changes</span>}
      </div>

      {/* Success toast */}
      {saved && (
        <div style={s.toast}>
          <CheckIcon />
          Settings saved successfully
        </div>
      )}

      <div style={s.grid}>
        {/* ── LEFT COLUMN ── */}
        <div style={s.col}>

          {/* Operating Hours */}
          <Card
            icon={<ClockIcon />}
            title="Operating Hours"
            desc="Set when your courts are open for bookings"
          >
            <Row label="Opening time" desc="Courts open at this hour">
              <TimeSelect value={cfg.openHour} min={0} max={23} onChange={v => set('openHour', v)} suffix="h" />
            </Row>
            <Row label="Closing time" desc="24 = midnight">
              <TimeSelect value={cfg.closeHour} min={1} max={24} onChange={v => set('closeHour', v)} suffix="h" />
            </Row>
            <div style={s.preview}>
              <span style={s.previewLabel}>Preview</span>
              <span style={s.previewVal}>
                {fmt(cfg.openHour)} &mdash; {cfg.closeHour === 24 ? 'Midnight' : fmt(cfg.closeHour)}
              </span>
            </div>
          </Card>

          {/* Booking Rules */}
          <Card
            icon={<CalendarIcon />}
            title="Booking Rules"
            desc="Control how far ahead customers can book"
          >
            <Row label="Advance booking limit" desc="Maximum days ahead a customer can book">
              <NumInput value={cfg.advanceBookingDays} min={1} max={365}
                onChange={v => set('advanceBookingDays', v)} suffix="days" />
            </Row>
            <Row label="Same-day buffer" desc="Minimum lead time for same-day bookings">
              <NumInput value={cfg.sameDayBufferHours} min={0} max={23}
                onChange={v => set('sameDayBufferHours', v)} suffix="hrs" />
            </Row>
          </Card>

          {/* Notifications */}
          <Card
            icon={<BellIcon />}
            title="Notifications"
            desc="Choose which events trigger admin notifications"
          >
            <Row label="New booking" desc="Notify when a customer makes a booking">
              <Toggle checked={cfg.notifyOnBooking} onChange={v => set('notifyOnBooking', v)} />
            </Row>
            <Row label="Cancellation" desc="Notify when a booking is cancelled">
              <Toggle checked={cfg.notifyOnCancellation} onChange={v => set('notifyOnCancellation', v)} />
            </Row>
            <Row label="Reschedule request" desc="Notify when a customer requests reschedule">
              <Toggle checked={cfg.notifyOnReschedule} onChange={v => set('notifyOnReschedule', v)} />
            </Row>
          </Card>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={s.col}>

          {/* Pricing */}
          <Card
            icon={<MoneyIcon />}
            title="Pricing"
            desc="Set default rates and fees applied at checkout"
          >
            <Row label="Default price per hour" desc="Applied to all courts unless individually overridden">
              <PesoInput value={cfg.pricePerHour}
                onChange={v => set('pricePerHour', v)} />
            </Row>
            <Row label="Service fee" desc="Added to booking total at checkout">
              <NumInput value={cfg.serviceFeePercent} min={0} max={100}
                onChange={v => set('serviceFeePercent', v)} suffix="%" />
            </Row>
            <div style={s.feePreview}>
              <span style={s.feeLabel}>Sample booking — 2 hrs</span>
              <div style={s.feeCalc}>
                <div style={s.feeRow}><span>Court fee</span><span>₱{(cfg.pricePerHour * 2).toLocaleString()}</span></div>
                <div style={s.feeRow}><span>Service fee ({cfg.serviceFeePercent}%)</span><span>₱{Math.round(cfg.pricePerHour * 2 * cfg.serviceFeePercent / 100).toLocaleString()}</span></div>
                <div style={{ ...s.feeRow, ...s.feeTotal }}>
                  <span>Total</span>
                  <span>₱{Math.round(cfg.pricePerHour * 2 * (1 + cfg.serviceFeePercent / 100)).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Promo Code */}
          <Card
            icon={<TagIcon />}
            title="Promo Code"
            desc="Offer discounts to customers with a code"
          >
            <Row label="Enable promo codes" desc="Allow customers to apply a promo at checkout">
              <Toggle checked={cfg.promoEnabled} onChange={v => set('promoEnabled', v)} />
            </Row>
            {cfg.promoEnabled && (
              <>
                <Row label="Promo code" desc="Case-insensitive, shown to customers">
                  <input
                    style={{ ...s.textInput, textTransform: 'uppercase', width: 140, letterSpacing: 1.5, fontFamily: 'monospace', fontWeight: 700 }}
                    type="text" value={cfg.promoCode} maxLength={16}
                    onChange={e => set('promoCode', e.target.value.toUpperCase())}
                  />
                </Row>
                <Row label="Discount" desc="Percentage off the court fee">
                  <NumInput value={cfg.promoDiscount} min={1} max={100}
                    onChange={v => set('promoDiscount', v)} suffix="%" />
                </Row>
                <div style={s.promoBadge}>
                  <span style={s.promoBadgeCode}>{cfg.promoCode}</span>
                  <span style={s.promoBadgeSave}>saves {cfg.promoDiscount}% on court fees</span>
                </div>
              </>
            )}
          </Card>

          {/* Cancellation Policy */}
          <Card
            icon={<ShieldIcon />}
            title="Cancellation Policy"
            desc="Define the free window and late fees"
          >
            <Row label="Free cancellation window" desc="Customers can cancel for free within this window">
              <NumInput value={cfg.cancellationHours} min={0} max={72}
                onChange={v => set('cancellationHours', v)} suffix="hrs before" />
            </Row>
            <Row label="Late cancellation fee" desc="Charged if cancelled outside the free window">
              <NumInput value={cfg.cancellationFeePercent} min={0} max={100}
                onChange={v => set('cancellationFeePercent', v)} suffix="%" />
            </Row>
            <div style={s.policyNote}>
              Customers who cancel within {cfg.cancellationHours}h of their booking will be charged {cfg.cancellationFeePercent}% of the booking amount.
            </div>
          </Card>
        </div>
      </div>

      {/* ── Venue Media ── */}
      <div style={media.section}>
        <div style={media.head}>
          <div style={media.headLeft}>
            <div style={media.iconWrap}><ImageIcon /></div>
            <div>
              <div style={media.title}>Venue Photos</div>
              <div style={media.desc}>Upload photos of your courts and facilities. The primary image appears on booking pages.</div>
            </div>
          </div>
          <button style={media.uploadBtn} onClick={() => fileInputRef.current?.click()}>
            <UploadIcon /> Upload Photos
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display:'none' }} onChange={handleFileChange} />
        </div>

        {images.length === 0 ? (
          /* Drop-zone placeholder */
          <div style={media.dropzone} onClick={() => fileInputRef.current?.click()}>
            <div style={media.dropIcon}><ImageIcon /></div>
            <div style={media.dropTitle}>No photos yet</div>
            <div style={media.dropSub}>Click to upload JPG, PNG or WebP — up to 10 MB each</div>
            <button style={media.dropBtn}>Choose files</button>
          </div>
        ) : (
          <div style={media.grid}>
            {images.map(img => (
              <div key={img.id} style={{ ...media.thumb, outline: img.isPrimary ? `2px solid ${ACCENT}` : '2px solid transparent' }}>
                <img src={img.url} alt={img.name} style={media.thumbImg} />

                {/* Primary badge */}
                {img.isPrimary && (
                  <div style={media.primaryBadge}>Primary</div>
                )}

                {/* Overlay actions */}
                <div style={media.overlay}>
                  {!img.isPrimary && (
                    <button style={media.overlayBtn} onClick={() => setPrimary(img.id)} title="Set as primary">
                      <StarIcon />
                    </button>
                  )}
                  <button style={{ ...media.overlayBtn, background:'rgba(220,38,38,.85)' }}
                    onClick={() => setConfirmDeleteId(img.id)} title="Remove">
                    <TrashIcon />
                  </button>
                </div>

                {/* File info */}
                <div style={media.thumbInfo}>
                  <span style={media.thumbName}>{img.name}</span>
                  <span style={media.thumbSize}>{img.size}</span>
                </div>
              </div>
            ))}

            {/* Add more tile */}
            <div style={media.addTile} onClick={() => fileInputRef.current?.click()}>
              <PlusIcon />
              <span style={{ fontSize:12, color:'#64748b', marginTop:6 }}>Add more</span>
            </div>
          </div>
        )}

        <div style={media.footer}>
          <span style={media.footerText}>{images.length} photo{images.length !== 1 ? 's' : ''} uploaded</span>
          {images.length > 0 && (
            <button style={media.clearAll} onClick={() => setImages([])}>Remove all</button>
          )}
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmDeleteId && (() => {
        const img = images.find(i => i.id === confirmDeleteId);
        return (
          <div style={modal.backdrop}>
            <div style={modal.panel}>
              <div style={modal.head}>
                <h3 style={modal.title}>Remove Photo</h3>
                <button onClick={() => setConfirmDeleteId(null)} style={modal.close}>&#x2715;</button>
              </div>
              <div style={modal.body}>
                {img && <img src={img.url} alt={img.name} style={{ width:'100%', height:160, objectFit:'cover', borderRadius:8, marginBottom:12 }} />}
                <p style={{ fontSize:14, color:'#374151', margin:0, lineHeight:1.6 }}>
                  Remove <strong>{img?.name}</strong>? This cannot be undone.
                </p>
              </div>
              <div style={modal.footer}>
                <button style={modal.btnCancel} onClick={() => setConfirmDeleteId(null)}>Cancel</button>
                <button style={modal.btnDelete} onClick={() => removeImage(confirmDeleteId)}>Remove Photo</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Sticky save bar */}
      <div style={{ ...s.saveBar, opacity: dirty ? 1 : 0.5, pointerEvents: dirty ? 'auto' : 'none' }}>
        <span style={s.saveBarMsg}>{dirty ? 'You have unsaved changes' : 'All changes saved'}</span>
        <div style={s.saveBarActions}>
          <button style={s.btnReset} onClick={reset}>Reset to defaults</button>
          <button style={s.btnSave} onClick={save}>
            <SaveIcon />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Helper: format hour ──────────────────────────────────────────────────── */
function fmt(h: number) {
  if (h === 0) return '12:00 AM';
  if (h < 12)  return `${h}:00 AM`;
  if (h === 12) return '12:00 PM';
  return `${h - 12}:00 PM`;
}

/* ── Sub-components ─────────────────────────────────────────────────────────── */
function Card({ icon, title, desc, children }: { icon: React.ReactNode; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div style={c.wrap}>
      <div style={c.head}>
        <div style={c.iconWrap}>{icon}</div>
        <div>
          <div style={c.title}>{title}</div>
          <div style={c.desc}>{desc}</div>
        </div>
      </div>
      <div style={c.body}>{children}</div>
    </div>
  );
}

function Row({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={r.row}>
      <div style={r.left}>
        <div style={r.label}>{label}</div>
        {desc && <div style={r.desc}>{desc}</div>}
      </div>
      <div style={r.right}>{children}</div>
    </div>
  );
}

function NumInput({ value, min, max, onChange, suffix }: { value: number; min: number; max: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div style={i.wrap}>
      <input style={i.num} type="number" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))} />
      {suffix && <span style={i.suffix}>{suffix}</span>}
    </div>
  );
}

function TimeSelect({ value, min, max, onChange, suffix }: { value: number; min: number; max: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div style={i.wrap}>
      <input style={i.num} type="number" min={min} max={max} value={value}
        onChange={e => onChange(Number(e.target.value))} />
      {suffix && <span style={i.suffix}>{suffix}</span>}
    </div>
  );
}

function PesoInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={i.pesoWrap}>
      <span style={i.pesoPre}>₱</span>
      <input style={i.pesoInput} type="text" inputMode="numeric"
        value={value === 0 ? '' : String(value)} placeholder="0"
        onChange={e => { const v = e.target.value.replace(/\D/g, ''); onChange(v === '' ? 0 : parseInt(v, 10)); }} />
      <span style={i.pesoSuf}>/hr</span>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch" aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{ ...i.toggle, background: checked ? ACCENT : '#e2e8f0' }}
    >
      <div style={{ ...i.thumb, transform: checked ? 'translateX(20px)' : 'translateX(2px)' }} />
    </button>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────────── */
const ic = (d: string) => () => (
  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const ClockIcon    = ic('M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2');
const CalendarIcon = ic('M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z');
const MoneyIcon    = ic('M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6');
const TagIcon      = ic('M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01');
const ShieldIcon   = ic('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z');
const BellIcon     = ic('M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0');
const SaveIcon     = ic('M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8');
const CheckIcon    = () => (
  <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ── Styles ─────────────────────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
  page:         { display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 80 },
  pageHead:     { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  pageTitle:    { fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 },
  pageSub:      { fontSize: 13, color: '#64748b', marginTop: 3 },
  unsavedPill:  { fontSize: 11, fontWeight: 700, color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 99, padding: '4px 12px', alignSelf: 'center' },
  toast:        { display: 'flex', alignItems: 'center', gap: 8, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: 10, padding: '12px 16px', fontSize: 13, fontWeight: 600 },
  grid:         { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' },
  col:          { display: 'flex', flexDirection: 'column', gap: 20 },
  preview:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', margin: '0 20px 16px', borderRadius: 8, padding: '10px 14px' },
  previewLabel: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  previewVal:   { fontSize: 13, fontWeight: 700, color: '#0f172a' },
  feePreview:   { background: '#f8fafc', margin: '0 20px 16px', borderRadius: 10, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 },
  feeLabel:     { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  feeCalc:      { display: 'flex', flexDirection: 'column', gap: 6 },
  feeRow:       { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#64748b' },
  feeTotal:     { borderTop: '1px solid #e2e8f0', paddingTop: 6, fontSize: 13, fontWeight: 700, color: '#0f172a' },
  promoBadge:   { display: 'flex', alignItems: 'center', gap: 10, background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 9, margin: '0 20px 16px', padding: '10px 14px' },
  promoBadgeCode:{ fontSize: 13, fontWeight: 800, color: ACCENT, fontFamily: 'monospace', letterSpacing: 1.5 },
  promoBadgeSave:{ fontSize: 12, color: '#6d28d9' },
  policyNote:   { fontSize: 12, color: '#64748b', background: '#f8fafc', margin: '0 20px 16px', borderRadius: 8, padding: '10px 14px', lineHeight: 1.6 },
  textInput:    { padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 13, color: '#0f172a', outline: 'none', boxSizing: 'border-box' as const },
  saveBar:      { position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #e2e8f0', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 50, boxShadow: '0 -4px 20px rgba(0,0,0,0.06)', transition: 'opacity 200ms' },
  saveBarMsg:   { fontSize: 13, color: '#64748b', fontWeight: 500 },
  saveBarActions:{ display: 'flex', gap: 10 },
  btnReset:     { padding: '9px 18px', borderRadius: 9, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnSave:      { display: 'flex', alignItems: 'center', gap: 7, padding: '9px 22px', borderRadius: 9, border: 'none', background: ACCENT, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 10px rgba(99,102,241,.3)' },
};

const c: Record<string, React.CSSProperties> = {
  wrap:    { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  head:    { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 20px', borderBottom: '1px solid #f1f5f9' },
  iconWrap:{ width: 34, height: 34, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexShrink: 0 },
  title:   { fontSize: 14, fontWeight: 700, color: '#0f172a' },
  desc:    { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  body:    { display: 'flex', flexDirection: 'column' },
};

const r: Record<string, React.CSSProperties> = {
  row:   { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 20px', borderBottom: '1px solid #f8fafc', gap: 16 },
  left:  { flex: 1 },
  label: { fontSize: 13, fontWeight: 600, color: '#0f172a' },
  desc:  { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  right: { display: 'flex', alignItems: 'center', flexShrink: 0 },
};

const i: Record<string, React.CSSProperties> = {
  wrap:      { display: 'flex', alignItems: 'center', gap: 6 },
  num:       { width: 72, padding: '7px 10px', border: '1.5px solid #e2e8f0', borderRadius: 7, fontSize: 13, fontWeight: 600, color: '#0f172a', outline: 'none', textAlign: 'right' as const, background: '#f8fafc' },
  suffix:    { fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' as const },
  pesoWrap:  { display: 'flex', alignItems: 'center', border: '1.5px solid #e2e8f0', borderRadius: 8, overflow: 'hidden', background: '#f8fafc' },
  pesoPre:   { padding: '7px 10px', fontSize: 13, fontWeight: 700, color: '#475569', background: '#f1f5f9', borderRight: '1px solid #e2e8f0' },
  pesoInput: { padding: '7px 8px', border: 'none', outline: 'none', fontSize: 14, fontWeight: 700, color: '#0f172a', background: 'transparent', width: 72, textAlign: 'right' as const },
  pesoSuf:   { padding: '7px 10px', fontSize: 12, color: '#94a3b8', background: '#f1f5f9', borderLeft: '1px solid #e2e8f0' },
  toggle:    { width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', position: 'relative' as const, transition: 'background 200ms', flexShrink: 0 },
  thumb:     { position: 'absolute' as const, top: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'transform 180ms' },
};

/* ── Media section styles ────────────────────────────────────────────────────── */
const media: Record<string, React.CSSProperties> = {
  section:     { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' },
  head:        { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, padding: '16px 20px', borderBottom: '1px solid #f1f5f9', flexWrap: 'wrap' },
  headLeft:    { display: 'flex', alignItems: 'flex-start', gap: 12, flex: 1 },
  iconWrap:    { width: 34, height: 34, borderRadius: 8, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', flexShrink: 0 },
  title:       { fontSize: 14, fontWeight: 700, color: '#0f172a' },
  desc:        { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  uploadBtn:   { display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8, border: `1.5px solid ${ACCENT}`, background: '#fff', color: ACCENT, fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 },
  dropzone:    { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '48px 20px', cursor: 'pointer', background: '#f8fafc', margin: 20, borderRadius: 12, border: '2px dashed #e2e8f0' },
  dropIcon:    { width: 48, height: 48, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' },
  dropTitle:   { fontSize: 15, fontWeight: 700, color: '#0f172a' },
  dropSub:     { fontSize: 13, color: '#94a3b8', textAlign: 'center' as const },
  dropBtn:     { padding: '8px 20px', borderRadius: 8, border: 'none', background: ACCENT, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 8 },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, padding: 20 },
  thumb:       { borderRadius: 10, overflow: 'hidden', position: 'relative' as const, background: '#f1f5f9', display: 'flex', flexDirection: 'column' as const, outlineOffset: 2 },
  thumbImg:    { width: '100%', height: 120, objectFit: 'cover' as const, display: 'block' },
  primaryBadge:{ position: 'absolute' as const, top: 8, left: 8, fontSize: 10, fontWeight: 700, color: '#fff', background: ACCENT, borderRadius: 99, padding: '2px 8px', letterSpacing: 0.5 },
  overlay:     { position: 'absolute' as const, top: 8, right: 8, display: 'flex', gap: 6 },
  overlayBtn:  { width: 28, height: 28, borderRadius: 7, background: 'rgba(0,0,0,.55)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' },
  thumbInfo:   { padding: '8px 10px', display: 'flex', flexDirection: 'column' as const, gap: 2 },
  thumbName:   { fontSize: 11, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  thumbSize:   { fontSize: 10, color: '#94a3b8' },
  addTile:     { borderRadius: 10, border: '2px dashed #e2e8f0', height: 160, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8', background: '#f8fafc' },
  footer:      { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderTop: '1px solid #f1f5f9', background: '#f8fafc' },
  footerText:  { fontSize: 12, color: '#94a3b8' },
  clearAll:    { fontSize: 12, fontWeight: 600, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6 },
};

const modal: Record<string, React.CSSProperties> = {
  backdrop: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(3px)' },
  panel:    { background: '#fff', borderRadius: 16, width: '100%', maxWidth: 400, boxShadow: '0 24px 64px rgba(0,0,0,.2)', overflow: 'hidden' },
  head:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #f1f5f9' },
  title:    { fontSize: 16, fontWeight: 800, margin: 0, color: '#0f172a' },
  close:    { background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, color: '#94a3b8', padding: 4 },
  body:     { padding: '16px 20px' },
  footer:   { display: 'flex', gap: 8, justifyContent: 'flex-end', padding: '14px 20px', borderTop: '1px solid #f1f5f9' },
  btnCancel:{ padding: '8px 16px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 13, cursor: 'pointer' },
  btnDelete:{ padding: '8px 18px', borderRadius: 8, border: 'none', background: '#dc2626', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' },
};

/* ── Additional icons for media ──────────────────────────────────────────────── */
function ImageIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
}
function UploadIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>;
}
function StarIcon() {
  return <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
}
function TrashIcon() {
  return <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>;
}
function PlusIcon() {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>;
}
