import { neon } from '@neondatabase/serverless';

let sql;
export function getDb() {
  if (!process.env.DATABASE_URL) {
    const error = new Error('DATABASE_URL is not configured. Add it in Vercel Environment Variables.');
    error.statusCode = 503;
    throw error;
  }
  if (!sql) sql = neon(process.env.DATABASE_URL);
  return sql;
}

export async function ensureSchema(db) {
  await db`
    CREATE TABLE IF NOT EXISTS incidents (
      id BIGSERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      incident_date DATE,
      place TEXT,
      factory_code TEXT,
      trust_level TEXT NOT NULL CHECK (trust_level IN ('anonymous','formal')),
      contact_name TEXT,
      contact_phone TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await db`
    CREATE TABLE IF NOT EXISTS anonymous_feedback (
      id BIGSERIAL PRIMARY KEY,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      factory_code TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}
