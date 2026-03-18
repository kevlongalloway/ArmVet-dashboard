const { pool } = require('./index');
const bcrypt = require('bcryptjs');

const bookings = [
  { name: 'COL Marcus Webb', email: 'marcus.webb@army.mil', phone: '(703) 555-0142', org: '101st Airborne Division', service: 'Leadership Development', category: 'Military', date: '2026-03-22', time: '09:00', status: 'pending', message: 'Looking to develop a comprehensive leadership program for transitioning NCOs.' },
  { name: 'Sarah Mitchell', email: 'sarah.mitchell@gsa.gov', phone: '(202) 555-0198', org: 'General Services Administration', service: 'Federal HR Consulting', category: 'Federal', date: '2026-03-25', time: '14:00', status: 'approved', message: 'Need guidance on implementing new federal HR modernization policies.' },
  { name: 'James Rodriguez', email: 'j.rodriguez@techcorp.com', phone: '(415) 555-0167', org: 'TechCorp Industries', service: 'Executive Coaching', category: 'Corporate', date: '2026-03-28', time: '10:30', status: 'pending', message: 'Interested in executive coaching for our C-suite team of 5.' },
  { name: 'LTC Diana Foster', email: 'diana.foster@navy.mil', phone: '(619) 555-0134', org: 'Naval Station San Diego', service: 'Organizational Culture Training', category: 'Military', date: '2026-04-02', time: '13:00', status: 'approved', message: 'Preparing unit for cultural transformation initiative.' },
  { name: 'Robert Kim', email: 'rkim@innovatesolutions.com', phone: '(312) 555-0156', org: 'Innovate Solutions LLC', service: 'Small Group Workshops', category: 'Corporate', date: '2026-04-05', time: '11:00', status: 'declined', message: 'Would like to explore workshop options for our management team.' },
  { name: 'Patricia Gonzalez', email: 'p.gonzalez@opm.gov', phone: '(202) 555-0178', org: 'Office of Personnel Management', service: 'Workforce Planning', category: 'Federal', date: '2026-04-10', time: '15:30', status: 'pending', message: 'Seeking workforce planning consultation for upcoming fiscal year.' },
];

const contacts = [
  { name: 'Michael Torres', email: 'mtorres@veterans.org', phone: '(804) 555-0123', category: 'Military', subject: 'Partnership Inquiry', message: 'We are a veteran-focused nonprofit interested in partnering with ArmVet for upcoming leadership workshops.', status: 'new' },
  { name: 'Dr. Lisa Chang', email: 'lchang@university.edu', phone: '(617) 555-0145', category: 'Corporate', subject: 'Speaking Engagement Request', message: 'Would love to have someone from ArmVet speak at our annual leadership conference in May.', status: 'replied' },
  { name: 'Amanda Brooks', email: 'abrooks@dod.gov', phone: '(703) 555-0189', category: 'Federal', subject: 'HR Modernization Question', message: 'Quick question about your HR modernization services and how they align with recent OPM directives.', status: 'new' },
  { name: 'David Washington', email: 'dwashington@startup.io', phone: '(512) 555-0167', category: 'Corporate', subject: 'Group Rate Inquiry', message: 'Interested in group coaching rates for our growing startup team of 15 managers.', status: 'archived' },
];

const events = [
  { title: 'Leadership Workshop - Fort Bragg', date: '2026-03-20', time: '09:00', type: 'consultation', description: 'On-site leadership development workshop for 101st Airborne NCOs.' },
  { title: 'Federal HR Policy Review', date: '2026-03-22', time: '14:00', type: 'internal', description: 'Internal review of updated federal HR policies and consulting approach.' },
  { title: 'Client Call - TechCorp', date: '2026-03-25', time: '10:30', type: 'call', description: 'Follow-up call with James Rodriguez regarding executive coaching proposal.' },
  { title: 'Quarterly Business Review', date: '2026-03-28', time: '13:00', type: 'internal', description: 'Q1 review of consulting engagements, revenue, and pipeline.' },
  { title: 'Proposal Deadline - GSA Contract', date: '2026-04-01', time: '17:00', type: 'deadline', description: 'Final submission for GSA federal consulting services contract.' },
  { title: 'Veterans Leadership Summit', date: '2026-04-05', time: '08:00', type: 'consultation', description: 'Annual veterans leadership summit keynote and breakout sessions.' },
  { title: 'New Client Onboarding - OPM', date: '2026-04-08', time: '11:00', type: 'consultation', description: 'Kickoff meeting for Office of Personnel Management engagement.' },
];

async function seed() {
  try {
    // Create admin user from env vars
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is required to seed the database');
    }
    const hash = await bcrypt.hash(adminPassword, 10);
    await pool.query('DELETE FROM users');
    await pool.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3)',
      [adminUsername, hash, 'admin']
    );
    console.log(`Admin user "${adminUsername}" created`);

    // Clear existing data
    await pool.query('DELETE FROM events');
    await pool.query('DELETE FROM contacts');
    await pool.query('DELETE FROM bookings');

    for (const b of bookings) {
      await pool.query(
        `INSERT INTO bookings (name, email, phone, org, service, category, date, time, status, message)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [b.name, b.email, b.phone, b.org, b.service, b.category, b.date, b.time, b.status, b.message]
      );
    }

    for (const c of contacts) {
      await pool.query(
        `INSERT INTO contacts (name, email, phone, category, subject, message, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [c.name, c.email, c.phone, c.category, c.subject, c.message, c.status]
      );
    }

    for (const e of events) {
      await pool.query(
        `INSERT INTO events (title, date, time, type, description)
         VALUES ($1,$2,$3,$4,$5)`,
        [e.title, e.date, e.time, e.type, e.description]
      );
    }

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Seed error:', err.message);
    throw err;
  }
}

// Run directly if called as script
if (require.main === module) {
  require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
  const { initDB } = require('./index');
  initDB().then(() => seed()).then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = { seed };
