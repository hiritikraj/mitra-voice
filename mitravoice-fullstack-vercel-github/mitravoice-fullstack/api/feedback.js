import { getDb, ensureSchema } from './_db.js';
const clean = (v, max=3000) => typeof v === 'string' ? v.trim().slice(0, max) : '';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const category = clean(req.body?.category, 80);
    const description = clean(req.body?.description, 3000);
    const factoryCode = clean(req.body?.factoryCode, 80) || null;
    if (!category || !description) return res.status(400).json({ error: 'Category and description are required.' });
    const db = getDb();
    await ensureSchema(db);
    const rows = await db`
      INSERT INTO anonymous_feedback (category, description, factory_code)
      VALUES (${category}, ${description}, ${factoryCode})
      RETURNING id, created_at
    `;
    return res.status(201).json({ ok: true, feedback: rows[0], message: 'Feedback saved. Do not include names or phone numbers in anonymous feedback.' });
  } catch (e) {
    console.error('Feedback API error:', e.message);
    return res.status(e.statusCode || 500).json({ error: e.statusCode ? e.message : 'Could not save feedback. Check server configuration and try again.' });
  }
}
