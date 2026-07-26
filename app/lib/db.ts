import { neon } from "@neondatabase/serverless";

/**
 * Returns a Neon SQL tagged-template function bound to DATABASE_URL.
 *
 * Usage:
 *   const sql = getSQL();
 *   const rows = await sql`SELECT * FROM participants`;
 *
 * Every call reuses the same stateless HTTP driver — no pool needed in
 * Vercel Serverless. Queries are always parameterized automatically by
 * the tagged-template syntax, preventing SQL injection.
 */

let _sql: ReturnType<typeof neon> | null = null;

export function getSQL() {
  if (_sql) return _sql;

  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "[DB] DATABASE_URL is not set. Add it to your Vercel environment variables."
    );
  }

  _sql = neon(url);
  return _sql;
}

/**
 * Auto-migration: creates all required tables if they do not exist.
 * Called once on first query. Safe to run repeatedly (IF NOT EXISTS).
 */
let _migrated = false;

export async function ensureSchema() {
  if (_migrated) return;

  const sql = getSQL();

  await sql`
    CREATE TABLE IF NOT EXISTS participants (
      id          SERIAL PRIMARY KEY,
      email       TEXT NOT NULL,
      name        TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS participants_email_idx ON participants (email)`;

  await sql`
    CREATE TABLE IF NOT EXISTS exercise_answers (
      id                 SERIAL PRIMARY KEY,
      participant_email  TEXT NOT NULL,
      exercise_id        TEXT NOT NULL,
      answer             TEXT NOT NULL,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS exercise_answers_participant_exercise_idx ON exercise_answers (participant_email, exercise_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS assessment_answers (
      id                 SERIAL PRIMARY KEY,
      participant_email  TEXT NOT NULL,
      assessment_id      TEXT NOT NULL,
      payload            TEXT NOT NULL,
      score              DOUBLE PRECISION,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS assessment_answers_participant_assessment_idx ON assessment_answers (participant_email, assessment_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS progress (
      id                 SERIAL PRIMARY KEY,
      participant_email  TEXT NOT NULL,
      item_type          TEXT NOT NULL,
      item_id            TEXT NOT NULL,
      status             TEXT NOT NULL,
      updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS progress_participant_item_idx ON progress (participant_email, item_type, item_id)`;

  await sql`
    CREATE TABLE IF NOT EXISTS participant_profiles (
      id                        SERIAL PRIMARY KEY,
      participant_email         TEXT NOT NULL,
      name                      TEXT NOT NULL,
      country                   TEXT NOT NULL DEFAULT '',
      professional_background   TEXT NOT NULL DEFAULT '',
      ai_interests              TEXT NOT NULL DEFAULT '',
      ai_model                  TEXT NOT NULL DEFAULT '',
      course_goals              TEXT NOT NULL DEFAULT '',
      fun_fact                  TEXT NOT NULL DEFAULT '',
      created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS participant_profiles_email_idx ON participant_profiles (participant_email)`;

  _migrated = true;
}
