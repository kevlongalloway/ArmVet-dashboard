const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', '..', 'armvet-data.json');

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED = {
  nextId: { bookings: 10, contacts: 110, events: 10, users: 2 },
  users: [],
  bookings: [
    { id: 1, name: 'Col. James Richardson', email: 'j.richardson@army.mil', phone: '703-555-0142', org: 'Army National Guard', service: 'Leadership Development', category: 'Military', date: '2026-03-20', time: '10:00 AM', status: 'pending', message: 'Interested in a 2-day leadership workshop for our battalion leadership team (approx 18 people). Looking at Q2 timeframe.', submitted_at: '2026-03-15T00:00:00.000Z' },
    { id: 2, name: 'Dr. Patricia Owens', email: 'p.owens@nasa.gov', phone: '202-555-0198', org: 'NASA Goddard', service: 'Executive Coaching', category: 'Federal', date: '2026-03-22', time: '2:00 PM', status: 'approved', message: 'Need executive coaching for 3 newly promoted GS-15 division chiefs. Want to discuss scope and timeline.', submitted_at: '2026-03-12T00:00:00.000Z' },
    { id: 3, name: 'Mark Thompson', email: 'mthompson@vertexcorp.com', phone: '571-555-0267', org: 'Vertex Corporation', service: 'Organizational Culture Training', category: 'Corporate', date: '2026-03-25', time: '11:00 AM', status: 'pending', message: 'Our engineering division (120 people) has had significant turnover. Looking for culture assessment and training program.', submitted_at: '2026-03-16T00:00:00.000Z' },
    { id: 4, name: 'SGM Angela Davis', email: 'angela.davis@tradoc.army.mil', phone: '757-555-0311', org: 'TRADOC', service: 'Speaking Engagements', category: 'Military', date: '2026-03-18', time: '9:00 AM', status: 'approved', message: 'Requesting Mr. Smith as keynote speaker for our annual Senior Leader Development Course. 200+ attendees expected.', submitted_at: '2026-03-10T00:00:00.000Z' },
    { id: 5, name: 'Robert Chen', email: 'rchen@dhsconsulting.com', phone: '301-555-0455', org: 'DHS Consulting Group', service: 'Federal HR Consulting', category: 'Federal', date: '2026-04-01', time: '3:00 PM', status: 'pending', message: 'Need help with workforce planning for a new DHS sub-agency. Looking for a comprehensive HR modernization roadmap.', submitted_at: '2026-03-17T00:00:00.000Z' },
    { id: 6, name: 'Lisa Morales', email: 'lmorales@techforward.io', phone: '404-555-0523', org: 'TechForward Inc.', service: 'Small Group Workshops', category: 'Corporate', date: '2026-03-28', time: '1:00 PM', status: 'declined', message: 'Half-day workshop for our leadership team of 12. Focus on psychological safety and accountability.', submitted_at: '2026-03-08T00:00:00.000Z' },
  ],
  contacts: [
    { id: 101, name: 'SSG Kevin Brooks', email: 'kbrooks@guard.mil', phone: '540-555-0678', category: 'Military', subject: 'Unit Leadership Training Inquiry', message: "I'm an NCO looking into leadership training options for our company-level leaders. Can you send info on available programs?", status: 'new', submitted_at: '2026-03-17T00:00:00.000Z' },
    { id: 102, name: 'Jennifer Walsh', email: 'jwalsh@fedscope.gov', phone: '202-555-0891', category: 'Federal', subject: 'Workforce Planning RFI', message: 'Our agency is issuing an RFI for workforce planning services. Would Armvet be interested in responding? Deadline is April 15.', status: 'new', submitted_at: '2026-03-16T00:00:00.000Z' },
    { id: 103, name: 'David Park', email: 'dpark@innovatehr.com', phone: '703-555-0134', category: 'Corporate', subject: 'Partnership Opportunity', message: "We're an HR tech company and would love to explore a partnership with Armvet for our federal clients. Open to a call?", status: 'replied', submitted_at: '2026-03-14T00:00:00.000Z' },
    { id: 104, name: 'CW3 Maria Santos', email: 'msantos@usar.army.mil', phone: '910-555-0456', category: 'Military', subject: 'DEOMI Follow-up', message: "Attended Mr. Smith's keynote at DEOMI last year. Our brigade commander wants to discuss bringing him in for a leadership offsite.", status: 'new', submitted_at: '2026-03-15T00:00:00.000Z' },
  ],
  events: [
    { id: 1, title: 'Q1 Review & Pipeline Planning', date: '2026-03-17', time: '11:00 AM', type: 'internal', description: 'Internal Q1 performance review and Q2 pipeline strategy session.' },
    { id: 2, title: 'TRADOC Speaking Engagement', date: '2026-03-18', time: '9:00 AM', type: 'consultation', description: 'Keynote for TRADOC Senior Leader Development Course — 200+ attendees expected.' },
    { id: 3, title: 'Col. Richardson Discovery Call', date: '2026-03-20', time: '10:00 AM', type: 'call', description: 'Follow-up discovery call to scope the 2-day battalion leadership workshop for Army National Guard.' },
    { id: 4, title: 'NASA Executive Coaching Session', date: '2026-03-22', time: '2:00 PM', type: 'consultation', description: 'First coaching session with Dr. Owens and the 3 newly promoted GS-15 division chiefs.' },
    { id: 5, title: 'FedScope RFI Response Deadline', date: '2026-03-30', time: '5:00 PM', type: 'deadline', description: "Deadline to submit response to Jennifer Walsh's workforce planning RFI from FedScope." },
    { id: 6, title: 'DHS HR Modernization Kickoff', date: '2026-04-01', time: '3:00 PM', type: 'consultation', description: 'Initial scoping session with Robert Chen for DHS sub-agency HR modernization roadmap.' },
    { id: 7, title: 'Army National Guard Workshop', date: '2026-04-15', time: '8:00 AM', type: 'consultation', description: "2-day leadership workshop for Col. Richardson's battalion team — approx 18 attendees." },
  ],
};

// ─── Persistence ─────────────────────────────────────────────────────────────

function load() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('[store] Could not load data file, using seed data:', e.message);
  }
  return JSON.parse(JSON.stringify(SEED));
}

function save(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn('[store] Could not save data file:', e.message);
  }
}

let db = load();

function nextId(table) {
  db.nextId = db.nextId || {};
  db.nextId[table] = (db.nextId[table] || 0) + 1;
  return db.nextId[table];
}

// ─── Store API ────────────────────────────────────────────────────────────────

const bookings = {
  list({ status, category, search } = {}) {
    let rows = [...db.bookings];
    if (status && status !== 'all') rows = rows.filter(r => r.status === status);
    if (category && category !== 'all') rows = rows.filter(r => r.category === category);
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter(r =>
        (r.name && r.name.toLowerCase().includes(s)) ||
        (r.service && r.service.toLowerCase().includes(s)) ||
        (r.org && r.org.toLowerCase().includes(s))
      );
    }
    rows.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    return rows;
  },
  get(id) {
    return db.bookings.find(r => r.id === parseInt(id)) || null;
  },
  create(data) {
    const row = { id: nextId('bookings'), ...data, status: 'pending', submitted_at: new Date().toISOString() };
    db.bookings.push(row);
    save(db);
    return row;
  },
  updateStatus(id, status) {
    const row = db.bookings.find(r => r.id === parseInt(id));
    if (!row) return null;
    row.status = status;
    save(db);
    return row;
  },
  delete(id) {
    const idx = db.bookings.findIndex(r => r.id === parseInt(id));
    if (idx === -1) return false;
    db.bookings.splice(idx, 1);
    save(db);
    return true;
  },
  count() { return db.bookings.length; },
  countByStatus(status) { return db.bookings.filter(r => r.status === status).length; },
};

const contacts = {
  list({ status, search } = {}) {
    let rows = [...db.contacts];
    if (status && status !== 'all') rows = rows.filter(r => r.status === status);
    if (search) {
      const s = search.toLowerCase();
      rows = rows.filter(r =>
        (r.name && r.name.toLowerCase().includes(s)) ||
        (r.subject && r.subject.toLowerCase().includes(s))
      );
    }
    rows.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
    return rows;
  },
  get(id) {
    return db.contacts.find(r => r.id === parseInt(id)) || null;
  },
  create(data) {
    const row = { id: nextId('contacts'), ...data, status: 'new', submitted_at: new Date().toISOString() };
    db.contacts.push(row);
    save(db);
    return row;
  },
  updateStatus(id, status) {
    const row = db.contacts.find(r => r.id === parseInt(id));
    if (!row) return null;
    row.status = status;
    save(db);
    return row;
  },
  delete(id) {
    const idx = db.contacts.findIndex(r => r.id === parseInt(id));
    if (idx === -1) return false;
    db.contacts.splice(idx, 1);
    save(db);
    return true;
  },
  countByStatus(status) { return db.contacts.filter(r => r.status === status).length; },
};

const events = {
  list({ type } = {}) {
    let rows = [...db.events];
    if (type && type !== 'all') rows = rows.filter(r => r.type === type);
    rows.sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return (a.time || '').localeCompare(b.time || '');
    });
    return rows;
  },
  upcoming(limit = 5) {
    const today = new Date().toISOString().split('T')[0];
    return db.events
      .filter(e => e.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit);
  },
  get(id) {
    return db.events.find(r => r.id === parseInt(id)) || null;
  },
  create(data) {
    const row = { id: nextId('events'), ...data };
    db.events.push(row);
    save(db);
    return row;
  },
  delete(id) {
    const idx = db.events.findIndex(r => r.id === parseInt(id));
    if (idx === -1) return false;
    db.events.splice(idx, 1);
    save(db);
    return true;
  },
};

const users = {
  findByUsername(username) {
    return db.users.find(u => u.username === username) || null;
  },
  upsert(username, password_hash, role) {
    const existing = db.users.find(u => u.username === username);
    if (existing) {
      existing.password_hash = password_hash;
      existing.role = role;
    } else {
      db.users.push({ id: nextId('users'), username, password_hash, role });
    }
    save(db);
  },
};

function initDB() {
  // No-op for file store — data is loaded on require()
  console.log('Using file-based store (armvet-data.json)');
}

module.exports = { bookings, contacts, events, users, initDB };
