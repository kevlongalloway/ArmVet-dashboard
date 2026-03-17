import { useState, useEffect } from "react";

// ─── Dummy Data ───
const DUMMY_BOOKINGS = [
  {
    id: 1,
    name: "Col. James Richardson",
    email: "j.richardson@army.mil",
    phone: "703-555-0142",
    org: "Army National Guard",
    service: "Leadership Development",
    category: "Military",
    date: "2026-03-20",
    time: "10:00 AM",
    status: "pending",
    message: "Interested in a 2-day leadership workshop for our battalion leadership team (approx 18 people). Looking at Q2 timeframe.",
    submittedAt: "2026-03-15",
  },
  {
    id: 2,
    name: "Dr. Patricia Owens",
    email: "p.owens@nasa.gov",
    phone: "202-555-0198",
    org: "NASA Goddard",
    service: "Executive Coaching",
    category: "Federal",
    date: "2026-03-22",
    time: "2:00 PM",
    status: "approved",
    message: "Need executive coaching for 3 newly promoted GS-15 division chiefs. Want to discuss scope and timeline.",
    submittedAt: "2026-03-12",
  },
  {
    id: 3,
    name: "Mark Thompson",
    email: "mthompson@vertexcorp.com",
    phone: "571-555-0267",
    org: "Vertex Corporation",
    service: "Organizational Culture Training",
    category: "Corporate",
    date: "2026-03-25",
    time: "11:00 AM",
    status: "pending",
    message: "Our engineering division (120 people) has had significant turnover. Looking for culture assessment and training program.",
    submittedAt: "2026-03-16",
  },
  {
    id: 4,
    name: "SGM Angela Davis",
    email: "angela.davis@tradoc.army.mil",
    phone: "757-555-0311",
    org: "TRADOC",
    service: "Speaking Engagements",
    category: "Military",
    date: "2026-03-18",
    time: "9:00 AM",
    status: "approved",
    message: "Requesting Mr. Smith as keynote speaker for our annual Senior Leader Development Course. 200+ attendees expected.",
    submittedAt: "2026-03-10",
  },
  {
    id: 5,
    name: "Robert Chen",
    email: "rchen@dhsconsulting.com",
    phone: "301-555-0455",
    org: "DHS Consulting Group",
    service: "Federal HR Consulting",
    category: "Federal",
    date: "2026-04-01",
    time: "3:00 PM",
    status: "pending",
    message: "Need help with workforce planning for a new DHS sub-agency. Looking for a comprehensive HR modernization roadmap.",
    submittedAt: "2026-03-17",
  },
  {
    id: 6,
    name: "Lisa Morales",
    email: "lmorales@techforward.io",
    phone: "404-555-0523",
    org: "TechForward Inc.",
    service: "Small Group Workshops",
    category: "Corporate",
    date: "2026-03-28",
    time: "1:00 PM",
    status: "declined",
    message: "Half-day workshop for our leadership team of 12. Focus on psychological safety and accountability.",
    submittedAt: "2026-03-08",
  },
];

const DUMMY_CONTACTS = [
  {
    id: 101,
    name: "SSG Kevin Brooks",
    email: "kbrooks@guard.mil",
    phone: "540-555-0678",
    category: "Military",
    subject: "Unit Leadership Training Inquiry",
    message: "I'm an NCO looking into leadership training options for our company-level leaders. Can you send info on available programs?",
    status: "new",
    submittedAt: "2026-03-17",
  },
  {
    id: 102,
    name: "Jennifer Walsh",
    email: "jwalsh@fedscope.gov",
    phone: "202-555-0891",
    category: "Federal",
    subject: "Workforce Planning RFI",
    message: "Our agency is issuing an RFI for workforce planning services. Would Armvet be interested in responding? Deadline is April 15.",
    status: "new",
    submittedAt: "2026-03-16",
  },
  {
    id: 103,
    name: "David Park",
    email: "dpark@innovatehr.com",
    phone: "703-555-0134",
    category: "Corporate",
    subject: "Partnership Opportunity",
    message: "We're an HR tech company and would love to explore a partnership with Armvet for our federal clients. Open to a call?",
    status: "replied",
    submittedAt: "2026-03-14",
  },
  {
    id: 104,
    name: "CW3 Maria Santos",
    email: "msantos@usar.army.mil",
    phone: "910-555-0456",
    category: "Military",
    subject: "DEOMI Follow-up",
    message: "Attended Mr. Smith's keynote at DEOMI last year. Our brigade commander wants to discuss bringing him in for a leadership offsite.",
    status: "new",
    submittedAt: "2026-03-15",
  },
];

const SERVICES = [
  "Leadership Development",
  "Executive Coaching",
  "Small Group Workshops",
  "Individual Development",
  "Organizational Culture Training",
  "Federal HR Consulting",
  "Workforce Planning",
  "HR Modernization",
  "Speaking Engagements",
];

const CATEGORIES = ["Military", "Federal", "Corporate"];

// ─── Icons (inline SVG) ───
const Icons = {
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  calendar: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  bookings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  inbox: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-6l-2 3H10l-2-3H2" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  clock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  chevronRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  back: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  menu: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  star: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  phone: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  mail: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  calendarPlus: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="12" y1="14" x2="12" y2="20" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  ),
  filter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
};

// ─── Styles ───
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');

:root {
  --bg-primary: #0C0F14;
  --bg-secondary: #141820;
  --bg-card: #1A1F2B;
  --bg-card-hover: #1F2537;
  --bg-input: #141820;
  --border: #262D3D;
  --border-light: #1E2433;
  --text-primary: #F0F2F5;
  --text-secondary: #8A94A6;
  --text-muted: #5A6478;
  --accent: #C8A84E;
  --accent-dim: rgba(200, 168, 78, 0.12);
  --accent-glow: rgba(200, 168, 78, 0.25);
  --green: #34D399;
  --green-dim: rgba(52, 211, 153, 0.12);
  --red: #F87171;
  --red-dim: rgba(248, 113, 113, 0.12);
  --blue: #60A5FA;
  --blue-dim: rgba(96, 165, 250, 0.12);
  --orange: #FBBF24;
  --orange-dim: rgba(251, 191, 36, 0.12);
  --purple: #A78BFA;
  --purple-dim: rgba(167, 139, 250, 0.12);
  --radius: 10px;
  --radius-lg: 14px;
  --shadow: 0 2px 12px rgba(0,0,0,0.3);
  --transition: 0.2s ease;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'DM Sans', sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-primary);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(ellipse at 30% 20%, rgba(200,168,78,0.04) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(200,168,78,0.03) 0%, transparent 50%);
  pointer-events: none;
}

.login-box {
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
}

.login-logo {
  text-align: center;
  margin-bottom: 40px;
}

.login-logo h1 {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 28px;
  letter-spacing: 3px;
  color: var(--text-primary);
  text-transform: uppercase;
}

.login-logo p {
  color: var(--accent);
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-top: 6px;
  font-weight: 600;
}

.login-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 32px;
}

.login-card h2 {
  font-family: 'DM Sans', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.login-card .subtitle {
  color: var(--text-secondary);
  font-size: 13px;
  margin-bottom: 28px;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
  font-size: 14px;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  transition: border-color var(--transition);
  outline: none;
}

.form-group input:focus, .form-group select:focus, .form-group textarea:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-dim);
}

.form-group input::placeholder {
  color: var(--text-muted);
}

.btn-primary {
  width: 100%;
  padding: 13px;
  background: var(--accent);
  color: #0C0F14;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all var(--transition);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary:hover {
  background: #D4B65E;
  box-shadow: 0 4px 20px var(--accent-glow);
}

.btn-secondary {
  padding: 8px 16px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all var(--transition);
}

.btn-secondary:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all var(--transition);
}

.btn-approve {
  background: var(--green-dim);
  color: var(--green);
}
.btn-approve:hover { background: rgba(52, 211, 153, 0.2); }

.btn-decline {
  background: var(--red-dim);
  color: var(--red);
}
.btn-decline:hover { background: rgba(248, 113, 113, 0.2); }

.btn-calendar {
  background: var(--blue-dim);
  color: var(--blue);
}
.btn-calendar:hover { background: rgba(96, 165, 250, 0.2); }

.login-error {
  background: var(--red-dim);
  color: var(--red);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 18px;
  text-align: center;
}

.login-hint {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: var(--text-muted);
}

.login-hint code {
  background: var(--bg-input);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--text-secondary);
  font-size: 11px;
}

/* ─── Layout ─── */
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-logo {
  padding: 0 24px;
  margin-bottom: 8px;
}

.sidebar-logo h1 {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 20px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.sidebar-logo p {
  font-size: 10px;
  color: var(--accent);
  letter-spacing: 3px;
  text-transform: uppercase;
  font-weight: 600;
  margin-top: 2px;
}

.sidebar-label {
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 20px 24px 8px;
}

.sidebar-nav {
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition);
  border-left: 3px solid transparent;
  position: relative;
}

.nav-item:hover {
  color: var(--text-primary);
  background: rgba(255,255,255,0.03);
}

.nav-item.active {
  color: var(--accent);
  background: var(--accent-dim);
  border-left-color: var(--accent);
}

.nav-badge {
  position: absolute;
  right: 20px;
  background: var(--accent);
  color: #0C0F14;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 10px;
  min-width: 20px;
  text-align: center;
}

.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border);
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: var(--text-muted);
  cursor: pointer;
  transition: color var(--transition);
  background: none;
  border: none;
  font-family: inherit;
  padding: 0;
}

.logout-btn:hover { color: var(--red); }

.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 28px;
  min-height: 100vh;
}

.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  padding: 12px 16px;
  z-index: 90;
  align-items: center;
  justify-content: space-between;
}

.mobile-header h1 {
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.mobile-menu-btn {
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  padding: 4px;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 99;
}

/* ─── Page Header ─── */
.page-header {
  margin-bottom: 28px;
}

.page-header h2 {
  font-family: 'Syne', sans-serif;
  font-size: 24px;
  font-weight: 700;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 4px;
}

/* ─── Stats Row ─── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  transition: border-color var(--transition);
}

.stat-card:hover {
  border-color: var(--border-light);
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.stat-value {
  font-family: 'Syne', sans-serif;
  font-size: 28px;
  font-weight: 700;
}

.stat-sub {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* ─── Card List ─── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 700;
}

.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text-secondary);
  font-family: 'DM Sans', sans-serif;
  transition: all var(--transition);
  white-space: nowrap;
}

.filter-chip:hover {
  border-color: var(--text-secondary);
}

.filter-chip.active {
  background: var(--accent-dim);
  border-color: var(--accent);
  color: var(--accent);
}

.card-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px 20px;
  cursor: pointer;
  transition: all var(--transition);
  display: flex;
  align-items: center;
  gap: 16px;
}

.list-card:hover {
  background: var(--bg-card-hover);
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent-dim);
}

.card-status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.card-name {
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-date {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}

.card-preview {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-tags {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.tag {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tag-military { background: rgba(52,211,153,0.12); color: #34D399; }
.tag-federal { background: rgba(96,165,250,0.12); color: #60A5FA; }
.tag-corporate { background: rgba(167,139,250,0.12); color: #A78BFA; }

.status-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-pending { background: var(--orange-dim); color: var(--orange); }
.status-approved { background: var(--green-dim); color: var(--green); }
.status-declined { background: var(--red-dim); color: var(--red); }
.status-new { background: var(--blue-dim); color: var(--blue); }
.status-replied { background: var(--green-dim); color: var(--green); }
.status-archived { background: rgba(90,100,120,0.2); color: var(--text-muted); }
.status-on-calendar { background: var(--purple-dim); color: var(--purple); }

.card-chevron {
  color: var(--text-muted);
  flex-shrink: 0;
}

/* ─── Detail View ─── */
.detail-view {
  max-width: 640px;
}

.detail-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 20px;
  background: none;
  border: none;
  font-family: inherit;
  padding: 0;
  transition: color var(--transition);
}

.detail-back:hover { color: var(--accent); }

.detail-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 28px;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.detail-name {
  font-family: 'Syne', sans-serif;
  font-size: 22px;
  font-weight: 700;
}

.detail-org {
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 2px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.detail-field label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.detail-field span {
  font-size: 14px;
  color: var(--text-primary);
}

.detail-field a {
  font-size: 14px;
  color: var(--accent);
  text-decoration: none;
}

.detail-field a:hover { text-decoration: underline; }

.detail-message {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.detail-message label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.detail-message p {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.detail-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.detail-status-select {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
}

.detail-status-select label {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.detail-status-select select {
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
  color: var(--text-primary);
  font-family: 'DM Sans', sans-serif;
  outline: none;
  cursor: pointer;
}

.detail-status-select select:focus {
  border-color: var(--accent);
}

/* ─── Calendar View ─── */
.cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 24px;
}

.cal-header-cell {
  background: var(--bg-secondary);
  padding: 10px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cal-cell {
  background: var(--bg-card);
  padding: 8px;
  min-height: 90px;
  font-size: 12px;
  position: relative;
}

.cal-cell.other-month {
  background: var(--bg-secondary);
  opacity: 0.4;
}

.cal-cell.today {
  background: var(--accent-dim);
}

.cal-day-num {
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 4px;
  font-size: 13px;
}

.cal-cell.today .cal-day-num {
  color: var(--accent);
}

.cal-event {
  background: var(--accent-dim);
  color: var(--accent);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}

.cal-event:hover {
  background: var(--accent-glow);
}

.cal-event.approved {
  background: var(--green-dim);
  color: var(--green);
}

.cal-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.cal-month {
  font-family: 'Syne', sans-serif;
  font-size: 20px;
  font-weight: 700;
}

.cal-nav-btns {
  display: flex;
  gap: 8px;
}

.cal-nav-btn {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 14px;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  font-family: inherit;
  transition: all var(--transition);
}

.cal-nav-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.cal-legend {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.cal-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary);
}

.cal-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* ─── Toast ─── */
.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 20px;
  font-size: 13px;
  box-shadow: var(--shadow);
  animation: slideUp 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 360px;
}

.toast-success { border-left: 3px solid var(--green); }
.toast-info { border-left: 3px solid var(--blue); }
.toast-error { border-left: 3px solid var(--red); }

@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ─── Search ─── */
.search-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 14px;
  margin-bottom: 16px;
  transition: border-color var(--transition);
}

.search-bar:focus-within {
  border-color: var(--accent);
}

.search-bar input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-size: 14px;
  font-family: inherit;
}

.search-bar input::placeholder { color: var(--text-muted); }

.search-icon { color: var(--text-muted); flex-shrink: 0; }

/* ─── Empty State ─── */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--text-muted);
}

.empty-state p {
  font-size: 14px;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
    box-shadow: 4px 0 24px rgba(0,0,0,0.5);
  }
  .sidebar-overlay.show {
    display: block;
  }
  .mobile-header {
    display: flex;
  }
  .main-content {
    margin-left: 0;
    padding: 72px 16px 24px;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .stat-value { font-size: 22px; }
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .cal-grid { display: none; }
  .cal-mobile-list { display: block !important; }
  .page-header h2 { font-size: 20px; }
  .toast-container {
    left: 16px;
    right: 16px;
    bottom: 16px;
  }
  .toast { max-width: 100%; }
}

@media (max-width: 480px) {
  .stats-grid { grid-template-columns: 1fr 1fr; }
  .detail-card { padding: 20px; }
  .detail-name { font-size: 18px; }
}
`;

// ─── Helpers ───
function statusColor(s) {
  const map = { pending: "var(--orange)", approved: "var(--green)", declined: "var(--red)", new: "var(--blue)", replied: "var(--green)", archived: "var(--text-muted)", "on-calendar": "var(--purple)" };
  return map[s] || "var(--text-muted)";
}

function formatDate(d) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Components ───
function Toast({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type || "success"}`}>
          {t.type === "success" && <span style={{ color: "var(--green)" }}>{Icons.check}</span>}
          {t.type === "info" && <span style={{ color: "var(--blue)" }}>{Icons.calendarPlus}</span>}
          {t.message}
        </div>
      ))}
    </div>
  );
}

function Sidebar({ page, setPage, bookings, contacts, isOpen, onClose }) {
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const newCount = contacts.filter((c) => c.status === "new").length;

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? "show" : ""}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-logo">
          <h1>Armvet</h1>
          <p>Admin Portal</p>
        </div>
        <div className="sidebar-label">Manage</div>
        <nav className="sidebar-nav">
          {[
            { id: "dashboard", icon: Icons.dashboard, label: "Dashboard" },
            { id: "bookings", icon: Icons.bookings, label: "Bookings", badge: pendingCount },
            { id: "contacts", icon: Icons.inbox, label: "Inbox", badge: newCount },
            { id: "calendar", icon: Icons.calendar, label: "Calendar" },
          ].map((item) => (
            <div
              key={item.id}
              className={`nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => { setPage(item.id); onClose(); }}
            >
              {item.icon}
              {item.label}
              {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn" onClick={() => window.location.reload()}>
            {Icons.logout}
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

function StatCard({ label, value, sub, color }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={color ? { color } : {}}>
        {value}
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function DashboardPage({ bookings, contacts, setPage, setSelectedBooking, setSelectedContact }) {
  const pending = bookings.filter((b) => b.status === "pending");
  const approved = bookings.filter((b) => b.status === "approved" || b.status === "on-calendar");
  const newContacts = contacts.filter((c) => c.status === "new");

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of your consultation bookings and inquiries</p>
      </div>

      <div className="stats-grid">
        <StatCard label="Pending Bookings" value={pending.length} sub="Need your review" color="var(--orange)" />
        <StatCard label="Approved" value={approved.length} sub="Confirmed consultations" color="var(--green)" />
        <StatCard label="New Messages" value={newContacts.length} sub="Unread inquiries" color="var(--blue)" />
        <StatCard label="Total Leads" value={bookings.length + contacts.length} sub="All time" />
      </div>

      {pending.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div className="section-header">
            <span className="section-title">Needs Your Attention</span>
            <button className="btn-secondary" onClick={() => setPage("bookings")}>
              View All Bookings
            </button>
          </div>
          <div className="card-list">
            {pending.slice(0, 3).map((b) => (
              <div key={b.id} className="list-card" onClick={() => { setSelectedBooking(b.id); setPage("booking-detail"); }}>
                <div className="card-status-dot" style={{ background: statusColor(b.status) }} />
                <div className="card-body">
                  <div className="card-top-row">
                    <span className="card-name">{b.name}</span>
                    <span className="card-date">{formatDate(b.date)}</span>
                  </div>
                  <div className="card-preview">{b.service} — {b.org}</div>
                  <div className="card-tags">
                    <span className={`tag tag-${b.category.toLowerCase()}`}>{b.category}</span>
                    <span className={`status-badge status-${b.status}`}>{b.status}</span>
                  </div>
                </div>
                <span className="card-chevron">{Icons.chevronRight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {newContacts.length > 0 && (
        <div>
          <div className="section-header">
            <span className="section-title">New Inquiries</span>
            <button className="btn-secondary" onClick={() => setPage("contacts")}>
              View Inbox
            </button>
          </div>
          <div className="card-list">
            {newContacts.slice(0, 3).map((c) => (
              <div key={c.id} className="list-card" onClick={() => { setSelectedContact(c.id); setPage("contact-detail"); }}>
                <div className="card-status-dot" style={{ background: statusColor(c.status) }} />
                <div className="card-body">
                  <div className="card-top-row">
                    <span className="card-name">{c.name}</span>
                    <span className="card-date">{formatDate(c.submittedAt)}</span>
                  </div>
                  <div className="card-preview">{c.subject}</div>
                  <div className="card-tags">
                    <span className={`tag tag-${c.category.toLowerCase()}`}>{c.category}</span>
                  </div>
                </div>
                <span className="card-chevron">{Icons.chevronRight}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BookingsPage({ bookings, setPage, setSelectedBooking, searchTerm, setSearchTerm, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter }) {
  const filtered = bookings.filter((b) => {
    const matchSearch = !searchTerm || b.name.toLowerCase().includes(searchTerm.toLowerCase()) || b.org.toLowerCase().includes(searchTerm.toLowerCase()) || b.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchCat = categoryFilter === "all" || b.category === categoryFilter;
    return matchSearch && matchStatus && matchCat;
  });

  return (
    <div>
      <div className="page-header">
        <h2>Consultation Bookings</h2>
        <p>Manage requests for proposals and consultation appointments</p>
      </div>

      <div className="search-bar">
        <span className="search-icon">{Icons.search}</span>
        <input placeholder="Search by name, organization, or service..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="section-header">
        <div className="filters">
          {["all", "pending", "approved", "on-calendar", "declined"].map((s) => (
            <button key={s} className={`filter-chip ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>
              {s === "all" ? "All" : s === "on-calendar" ? "On Calendar" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <div className="filters">
          {["all", ...CATEGORIES].map((c) => (
            <button key={c} className={`filter-chip ${categoryFilter === c ? "active" : ""}`} onClick={() => setCategoryFilter(c)}>
              {c === "all" ? "All Sectors" : c}
            </button>
          ))}
        </div>
      </div>

      <div className="card-list">
        {filtered.length === 0 ? (
          <div className="empty-state"><p>No bookings match your filters.</p></div>
        ) : (
          filtered.map((b) => (
            <div key={b.id} className="list-card" onClick={() => { setSelectedBooking(b.id); setPage("booking-detail"); }}>
              <div className="card-status-dot" style={{ background: statusColor(b.status) }} />
              <div className="card-body">
                <div className="card-top-row">
                  <span className="card-name">{b.name}</span>
                  <span className="card-date">{b.time} · {formatDate(b.date)}</span>
                </div>
                <div className="card-preview">{b.service} — {b.org}</div>
                <div className="card-tags">
                  <span className={`tag tag-${b.category.toLowerCase()}`}>{b.category}</span>
                  <span className={`status-badge status-${b.status}`}>{b.status === "on-calendar" ? "On Calendar" : b.status}</span>
                </div>
              </div>
              <span className="card-chevron">{Icons.chevronRight}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function BookingDetail({ booking, onBack, onUpdateStatus, onAddToCalendar, addToast }) {
  if (!booking) return null;

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(booking.id, newStatus);
    addToast({ message: `Booking ${newStatus === "approved" ? "approved" : newStatus === "declined" ? "declined" : "updated"} — ${booking.name}`, type: "success" });
  };

  return (
    <div className="detail-view">
      <button className="detail-back" onClick={onBack}>{Icons.back} Back to Bookings</button>
      <div className="detail-card">
        <div className="detail-header">
          <div>
            <div className="detail-name">{booking.name}</div>
            <div className="detail-org">{booking.org}</div>
          </div>
          <span className={`status-badge status-${booking.status}`}>{booking.status === "on-calendar" ? "On Calendar" : booking.status}</span>
        </div>

        <div className="detail-grid">
          <div className="detail-field">
            <label>Service Requested</label>
            <span>{booking.service}</span>
          </div>
          <div className="detail-field">
            <label>Sector</label>
            <span className={`tag tag-${booking.category.toLowerCase()}`}>{booking.category}</span>
          </div>
          <div className="detail-field">
            <label>Consultation Date</label>
            <span>{formatDate(booking.date)} at {booking.time}</span>
          </div>
          <div className="detail-field">
            <label>Submitted</label>
            <span>{formatDate(booking.submittedAt)}</span>
          </div>
          <div className="detail-field">
            <label>Email</label>
            <a href={`mailto:${booking.email}`}>{booking.email}</a>
          </div>
          <div className="detail-field">
            <label>Phone</label>
            <a href={`tel:${booking.phone}`}>{booking.phone}</a>
          </div>
        </div>

        <div className="detail-message">
          <label>Message</label>
          <p>{booking.message}</p>
        </div>

        <div className="detail-status-select">
          <label>Status:</label>
          <select value={booking.status} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="on-calendar">On Calendar</option>
          </select>
        </div>

        <div className="detail-actions">
          {booking.status === "pending" && (
            <>
              <button className="btn-action btn-approve" onClick={() => handleStatusChange("approved")}>
                {Icons.check} Approve
              </button>
              <button className="btn-action btn-decline" onClick={() => handleStatusChange("declined")}>
                {Icons.x} Decline
              </button>
            </>
          )}
          {(booking.status === "approved") && (
            <button className="btn-action btn-calendar" onClick={() => { onAddToCalendar(booking.id); addToast({ message: `Added to calendar — ${booking.name}, ${formatDate(booking.date)}`, type: "info" }); }}>
              {Icons.calendarPlus} Add to Calendar
            </button>
          )}
          {booking.status === "on-calendar" && (
            <span style={{ fontSize: 13, color: "var(--purple)", display: "flex", alignItems: "center", gap: 6 }}>
              {Icons.check} On your calendar
            </span>
          )}
          <a href={`mailto:${booking.email}`} className="btn-action" style={{ background: "var(--accent-dim)", color: "var(--accent)", textDecoration: "none" }}>
            {Icons.mail} Email Client
          </a>
          <a href={`tel:${booking.phone}`} className="btn-action" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", textDecoration: "none" }}>
            {Icons.phone} Call
          </a>
        </div>
      </div>
    </div>
  );
}

function ContactsPage({ contacts, setPage, setSelectedContact, searchTerm, setSearchTerm, contactStatusFilter, setContactStatusFilter }) {
  const filtered = contacts.filter((c) => {
    const matchSearch = !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = contactStatusFilter === "all" || c.status === contactStatusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="page-header">
        <h2>Contact Inbox</h2>
        <p>Messages from the website contact form</p>
      </div>

      <div className="search-bar">
        <span className="search-icon">{Icons.search}</span>
        <input placeholder="Search by name or subject..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="section-header">
        <div className="filters">
          {["all", "new", "replied", "archived"].map((s) => (
            <button key={s} className={`filter-chip ${contactStatusFilter === s ? "active" : ""}`} onClick={() => setContactStatusFilter(s)}>
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="card-list">
        {filtered.length === 0 ? (
          <div className="empty-state"><p>No messages match your filters.</p></div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="list-card" onClick={() => { setSelectedContact(c.id); setPage("contact-detail"); }}>
              <div className="card-status-dot" style={{ background: statusColor(c.status) }} />
              <div className="card-body">
                <div className="card-top-row">
                  <span className="card-name">{c.name}</span>
                  <span className="card-date">{formatDate(c.submittedAt)}</span>
                </div>
                <div className="card-preview">{c.subject}</div>
                <div className="card-tags">
                  <span className={`tag tag-${c.category.toLowerCase()}`}>{c.category}</span>
                  <span className={`status-badge status-${c.status}`}>{c.status}</span>
                </div>
              </div>
              <span className="card-chevron">{Icons.chevronRight}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ContactDetail({ contact, onBack, onUpdateStatus, addToast }) {
  if (!contact) return null;

  const handleStatusChange = (newStatus) => {
    onUpdateStatus(contact.id, newStatus);
    addToast({ message: `Marked as ${newStatus} — ${contact.name}`, type: "success" });
  };

  return (
    <div className="detail-view">
      <button className="detail-back" onClick={onBack}>{Icons.back} Back to Inbox</button>
      <div className="detail-card">
        <div className="detail-header">
          <div>
            <div className="detail-name">{contact.name}</div>
            <div className="detail-org">{contact.subject}</div>
          </div>
          <span className={`status-badge status-${contact.status}`}>{contact.status}</span>
        </div>

        <div className="detail-grid">
          <div className="detail-field">
            <label>Sector</label>
            <span className={`tag tag-${contact.category.toLowerCase()}`}>{contact.category}</span>
          </div>
          <div className="detail-field">
            <label>Received</label>
            <span>{formatDate(contact.submittedAt)}</span>
          </div>
          <div className="detail-field">
            <label>Email</label>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </div>
          <div className="detail-field">
            <label>Phone</label>
            <a href={`tel:${contact.phone}`}>{contact.phone}</a>
          </div>
        </div>

        <div className="detail-message">
          <label>Message</label>
          <p>{contact.message}</p>
        </div>

        <div className="detail-status-select">
          <label>Status:</label>
          <select value={contact.status} onChange={(e) => handleStatusChange(e.target.value)}>
            <option value="new">New</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="detail-actions">
          {contact.status === "new" && (
            <button className="btn-action btn-approve" onClick={() => handleStatusChange("replied")}>
              {Icons.check} Mark as Replied
            </button>
          )}
          <a href={`mailto:${contact.email}`} className="btn-action" style={{ background: "var(--accent-dim)", color: "var(--accent)", textDecoration: "none" }}>
            {Icons.mail} Email Client
          </a>
          <a href={`tel:${contact.phone}`} className="btn-action" style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-secondary)", textDecoration: "none" }}>
            {Icons.phone} Call
          </a>
          {contact.status !== "archived" && (
            <button className="btn-action" style={{ background: "rgba(90,100,120,0.15)", color: "var(--text-muted)" }} onClick={() => handleStatusChange("archived")}>
              Archive
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function CalendarPage({ bookings, setPage, setSelectedBooking }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const today = new Date(2026, 2, 17); // March 17, 2026
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthName = viewDate.toLocaleString("en-US", { month: "long", year: "numeric" });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrev - i, otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push({ day: i, otherMonth: true });
  }

  const calBookings = bookings.filter((b) => b.status === "approved" || b.status === "on-calendar");

  function eventsForDay(day) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return calBookings.filter((b) => b.date === dateStr);
  }

  const isToday = (day) => !day.otherMonth && day.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  // Mobile: list of upcoming events
  const upcoming = calBookings
    .filter((b) => new Date(b.date + "T00:00:00") >= new Date(today.toDateString()))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div>
      <div className="page-header">
        <h2>Calendar</h2>
        <p>View approved consultations and scheduled appointments</p>
      </div>

      <div className="cal-legend">
        <div className="cal-legend-item">
          <div className="cal-legend-dot" style={{ background: "var(--accent)" }} />
          Approved
        </div>
        <div className="cal-legend-item">
          <div className="cal-legend-dot" style={{ background: "var(--purple)" }} />
          On Calendar
        </div>
      </div>

      <div className="cal-nav">
        <span className="cal-month">{monthName}</span>
        <div className="cal-nav-btns">
          <button className="cal-nav-btn" onClick={() => setMonthOffset((m) => m - 1)}>← Prev</button>
          <button className="cal-nav-btn" onClick={() => setMonthOffset(0)}>Today</button>
          <button className="cal-nav-btn" onClick={() => setMonthOffset((m) => m + 1)}>Next →</button>
        </div>
      </div>

      <div className="cal-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="cal-header-cell">{d}</div>
        ))}
        {cells.map((cell, i) => {
          const events = cell.otherMonth ? [] : eventsForDay(cell.day);
          return (
            <div key={i} className={`cal-cell ${cell.otherMonth ? "other-month" : ""} ${isToday(cell) ? "today" : ""}`}>
              <div className="cal-day-num">{cell.day}</div>
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className={`cal-event ${ev.status === "on-calendar" ? "" : "approved"}`}
                  style={ev.status === "on-calendar" ? { background: "var(--purple-dim)", color: "var(--purple)" } : {}}
                  onClick={() => { setSelectedBooking(ev.id); setPage("booking-detail"); }}
                  title={`${ev.name} — ${ev.service}`}
                >
                  {ev.time} {ev.name.split(" ")[1] || ev.name}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Mobile list fallback */}
      <div className="cal-mobile-list" style={{ display: "none" }}>
        <div className="section-title" style={{ marginBottom: 12 }}>Upcoming Consultations</div>
        {upcoming.length === 0 ? (
          <div className="empty-state"><p>No upcoming approved consultations.</p></div>
        ) : (
          <div className="card-list">
            {upcoming.map((b) => (
              <div key={b.id} className="list-card" onClick={() => { setSelectedBooking(b.id); setPage("booking-detail"); }}>
                <div className="card-status-dot" style={{ background: b.status === "on-calendar" ? "var(--purple)" : "var(--green)" }} />
                <div className="card-body">
                  <div className="card-top-row">
                    <span className="card-name">{b.name}</span>
                    <span className="card-date">{b.time}</span>
                  </div>
                  <div className="card-preview">{b.service} — {formatDate(b.date)}</div>
                  <div className="card-tags">
                    <span className={`status-badge status-${b.status}`}>{b.status === "on-calendar" ? "On Calendar" : "Approved"}</span>
                  </div>
                </div>
                <span className="card-chevron">{Icons.chevronRight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Login Screen ───
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (username === "admin" && password === "armvet2026") {
      onLogin();
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">
          <h1>Armvet</h1>
          <p>Admin Portal</p>
        </div>
        <div className="login-card">
          <h2>Sign In</h2>
          <p className="subtitle">Access your consultation management dashboard</p>
          {error && <div className="login-error">{error}</div>}
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter username" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />
          </div>
          <button className="btn-primary" onClick={handleSubmit}>Sign In</button>
          <div className="login-hint">
            Demo: <code>admin</code> / <code>armvet2026</code>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function ArmvetDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage] = useState("dashboard");
  const [bookings, setBookings] = useState(DUMMY_BOOKINGS);
  const [contacts, setContacts] = useState(DUMMY_CONTACTS);
  const [selectedBookingId, setSelectedBooking] = useState(null);
  const [selectedContactId, setSelectedContact] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [contactSearchTerm, setContactSearchTerm] = useState("");
  const [contactStatusFilter, setContactStatusFilter] = useState("all");

  const addToast = ({ message, type = "success" }) => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  };

  const updateBookingStatus = (id, status) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const addToCalendar = (id) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: "on-calendar" } : b)));
  };

  const updateContactStatus = (id, status) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);
  const selectedContact = contacts.find((c) => c.id === selectedContactId);

  if (!loggedIn) {
    return (
      <>
        <style>{CSS}</style>
        <LoginScreen onLogin={() => setLoggedIn(true)} />
      </>
    );
  }

  let content;
  if (page === "dashboard") {
    content = <DashboardPage bookings={bookings} contacts={contacts} setPage={setPage} setSelectedBooking={setSelectedBooking} setSelectedContact={setSelectedContact} />;
  } else if (page === "bookings") {
    content = <BookingsPage bookings={bookings} setPage={setPage} setSelectedBooking={setSelectedBooking} searchTerm={searchTerm} setSearchTerm={setSearchTerm} statusFilter={statusFilter} setStatusFilter={setStatusFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />;
  } else if (page === "booking-detail") {
    content = <BookingDetail booking={selectedBooking} onBack={() => setPage("bookings")} onUpdateStatus={updateBookingStatus} onAddToCalendar={addToCalendar} addToast={addToast} />;
  } else if (page === "contacts") {
    content = <ContactsPage contacts={contacts} setPage={setPage} setSelectedContact={setSelectedContact} searchTerm={contactSearchTerm} setSearchTerm={setContactSearchTerm} contactStatusFilter={contactStatusFilter} setContactStatusFilter={setContactStatusFilter} />;
  } else if (page === "contact-detail") {
    content = <ContactDetail contact={selectedContact} onBack={() => setPage("contacts")} onUpdateStatus={updateContactStatus} addToast={addToast} />;
  } else if (page === "calendar") {
    content = <CalendarPage bookings={bookings} setPage={setPage} setSelectedBooking={setSelectedBooking} />;
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app-layout">
        <div className="mobile-header">
          <h1>Armvet</h1>
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>{Icons.menu}</button>
        </div>
        <Sidebar page={page} setPage={setPage} bookings={bookings} contacts={contacts} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          {content}
        </main>
        <Toast toasts={toasts} />
      </div>
    </>
  );
}
