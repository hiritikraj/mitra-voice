import { getDb, ensureSchema } from './_db.js';

const allowed = ['anonymous', 'formal'];
const clean = (v, max=3000) => typeof v === 'string' ? v.trim().slice(0, max) : '';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const b = req.body || {};
    const trust = clean(b.trustLevel, 20);
    const category = clean(b.category, 80);
    const description = clean(b.description, 3000);
    if (!allowed.includes(trust)) return res.status(400).json({ error: 'Only anonymous or formal reports can be submitted to the server. Private logs stay on your device.' });
    if (!category || !description) return res.status(400).json({ error: 'Category and description are required.' });
    if (trust === 'anonymous' && (b.contactName || b.contactPhone)) {
      return res.status(400).json({ error: 'Anonymous reports cannot include contact fields.' });
    }
    const db = getDb();
    await ensureSchema(db);
    const name = trust === 'formal' ? clean(b.contactName, 120) || null : null;
    const phone = trust === 'formal' ? clean(b.contactPhone, 40) || null : null;
    const rows = await db`
      INSERT INTO incidents (category, description, incident_date, place, factory_code, trust_level, contact_name, contact_phone)
      VALUES (${category}, ${description}, ${b.date || null}, ${clean(b.place,100) || null}, ${clean(b.factoryCode,80) || null}, ${trust}, ${name}, ${phone})
      RETURNING id, trust_level, created_at
    `;
    return res.status(201).json({ ok: true, incident: rows[0], message: 'Saved to the MitraVoice demo database. No NGO or employer has been notified.' });
  } catch (e) {
    console.error('Incident API error:', e.message);
    return res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Could not save the report. Check server configuration and try again.' });
  }
}
