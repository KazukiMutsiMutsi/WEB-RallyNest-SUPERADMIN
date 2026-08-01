import React, { useState } from 'react';
import { TENANTS, SUBSCRIPTIONS, SUPPORT_TICKETS, REVIEWS } from '../data/mock';

const A = '#6366f1';

interface ReportRow {
  label: string;
  value: string | number;
  note?: string;
}

const REPORT_SECTIONS: { title: string; rows: ReportRow[] }[] = [
  {
    title: 'Platform Overview',
    rows: [
      { label:'Total Tenants',         value: TENANTS.length },
      { label:'Active Tenants',        value: TENANTS.filter(t=>t.status==='active').length },
      { label:'Suspended Tenants',     value: TENANTS.filter(t=>t.status==='suspended').length },
      { label:'Pending Tenants',       value: TENANTS.filter(t=>t.status==='pending').length },
      { label:'Total Courts (est.)',   value: TENANTS.reduce((s,t)=>s+t.courtsCount,0) },
    ],
  },
  {
    title: 'Revenue Summary',
    rows: [
      { label:'Monthly Recurring Revenue (MRR)', value: `₱${SUBSCRIPTIONS.filter(s=>s.status==='active').reduce((sum,s)=>sum+s.amount,0).toLocaleString()}` },
      { label:'ARR Projection',                  value: `₱${(SUBSCRIPTIONS.filter(s=>s.status==='active').reduce((sum,s)=>sum+s.amount,0)*12).toLocaleString()}` },
      { label:'Facility Revenue (monthly)',       value: `₱${TENANTS.reduce((s,t)=>s+t.monthlyRevenue,0).toLocaleString()}` },
      { label:'Past Due Subscriptions',           value: SUBSCRIPTIONS.filter(s=>s.status==='past_due').length, note:'Revenue at risk' },
    ],
  },
  {
    title: 'Subscriptions',
    rows: [
      { label:'Active Subscriptions',   value: SUBSCRIPTIONS.filter(s=>s.status==='active').length    },
      { label:'Trialing',               value: SUBSCRIPTIONS.filter(s=>s.status==='trialing').length  },
      { label:'Past Due',               value: SUBSCRIPTIONS.filter(s=>s.status==='past_due').length  },
      { label:'Cancelled',              value: SUBSCRIPTIONS.filter(s=>s.status==='cancelled').length },
      { label:'Starter Plan Tenants',   value: TENANTS.filter(t=>t.plan==='starter').length           },
      { label:'Pro Plan Tenants',       value: TENANTS.filter(t=>t.plan==='pro').length               },
      { label:'Enterprise Tenants',     value: TENANTS.filter(t=>t.plan==='enterprise').length        },
    ],
  },
  {
    title: 'Support',
    rows: [
      { label:'Open Tickets',           value: SUPPORT_TICKETS.filter(t=>t.status==='open').length           },
      { label:'In Progress',            value: SUPPORT_TICKETS.filter(t=>t.status==='in_progress').length    },
      { label:'Resolved',               value: SUPPORT_TICKETS.filter(t=>t.status==='resolved').length       },
      { label:'Closed',                 value: SUPPORT_TICKETS.filter(t=>t.status==='closed').length         },
      { label:'Urgent Tickets',         value: SUPPORT_TICKETS.filter(t=>t.priority==='urgent').length, note:'Needs immediate attention' },
    ],
  },
  {
    title: 'Reviews & Ratings',
    rows: [
      { label:'Total Reviews',          value: REVIEWS.length },
      { label:'Published',              value: REVIEWS.filter(r=>r.status==='published').length },
      { label:'Flagged',                value: REVIEWS.filter(r=>r.status==='flagged').length, note:'Requires moderation' },
      { label:'Average Rating',         value: REVIEWS.length > 0 ? (REVIEWS.reduce((s,r)=>s+r.rating,0)/REVIEWS.length).toFixed(1)+' / 5.0' : '—' },
    ],
  },
];

export default function SuperPlatformReports() {
  const [activeSection, setActiveSection] = useState<string>('all');
  const sections = activeSection === 'all' ? REPORT_SECTIONS : REPORT_SECTIONS.filter(s => s.title === activeSection);

  return (
    <div style={s.page}>
      <div style={s.pageHead}>
        <div>
          <h2 style={s.pageTitle}>Platform Reports</h2>
          <p style={s.pageSub}>Comprehensive platform-wide report — generated {new Date().toLocaleDateString('en-US', { month:'long', day:'numeric', year:'numeric' })}</p>
        </div>
        <button style={s.btnExport} onClick={() => alert('Export functionality would generate a PDF/CSV report.')}>
          Export Report
        </button>
      </div>

      {/* Section filter */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {['all', ...REPORT_SECTIONS.map(s => s.title)].map(title => (
          <button key={title} onClick={() => setActiveSection(title)} style={{ ...s.filterBtn, ...(activeSection===title ? s.filterBtnActive : {}) }}>
            {title === 'all' ? 'All Sections' : title}
          </button>
        ))}
      </div>

      {sections.map(section => (
        <div key={section.title} style={s.card}>
          <div style={s.cardHead}>{section.title}</div>
          <table style={s.table}>
            <tbody>
              {section.rows.map((row, i) => (
                <tr key={row.label} style={{ background: i%2===0 ? '#fff' : '#fafafa' }}>
                  <td style={s.tdLabel}>{row.label}</td>
                  <td style={s.tdVal}>{row.value}</td>
                  <td style={s.tdNote}>{row.note && <span style={s.noteBadge}>{row.note}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page:          { display:'flex', flexDirection:'column', gap:20 },
  pageHead:      { display:'flex', alignItems:'flex-start', justifyContent:'space-between' },
  pageTitle:     { fontSize:20, fontWeight:800, color:'#0f172a', margin:0 },
  pageSub:       { fontSize:13, color:'#64748b', marginTop:4 },
  btnExport:     { padding:'10px 18px', borderRadius:9, border:'none', background:A, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' },
  filterBtn:     { padding:'6px 14px', borderRadius:8, border:'1px solid #e2e8f0', background:'#fff', fontSize:12, fontWeight:600, color:'#64748b', cursor:'pointer' },
  filterBtnActive:{ background:A, color:'#fff', border:`1px solid ${A}` },
  card:          { background:'#fff', border:'1px solid #e2e8f0', borderRadius:14, overflow:'hidden', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' },
  cardHead:      { padding:'14px 20px', fontSize:14, fontWeight:800, color:'#374151', background:'#f8fafc', borderBottom:'1px solid #f1f5f9', textTransform:'uppercase', letterSpacing:.6 },
  table:         { width:'100%', borderCollapse:'collapse' as const },
  tdLabel:       { padding:'12px 20px', fontSize:13, color:'#374151', fontWeight:500, borderBottom:'1px solid #f8fafc', width:'50%' },
  tdVal:         { padding:'12px 16px', fontSize:13, fontWeight:800, color:'#0f172a', borderBottom:'1px solid #f8fafc' },
  tdNote:        { padding:'12px 16px', borderBottom:'1px solid #f8fafc', textAlign:'right' as const },
  noteBadge:     { fontSize:11, fontWeight:700, color:'#d97706', background:'#fef3c7', padding:'2px 8px', borderRadius:99 },
};
