import 'server-only';
import { createClient, type Client, type InValue } from '@libsql/client';
import { MATCHES, PLAYERS } from './matches-data';

let _client: Client | null = null;
let _initPromise: Promise<void> | null = null;

function getClient(): Client {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url) throw new Error('Missing TURSO_DATABASE_URL in env');
  _client = createClient({ url, authToken });
  return _client;
}

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    name         TEXT NOT NULL UNIQUE,
    pin          TEXT NOT NULL,
    avatar_seed  TEXT NOT NULL,
    pin_changed  INTEGER NOT NULL DEFAULT 0,
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS matches (
    id           TEXT PRIMARY KEY,
    stage        TEXT NOT NULL,
    grp          TEXT,
    home_team    TEXT NOT NULL,
    home_code    TEXT NOT NULL,
    away_team    TEXT NOT NULL,
    away_code    TEXT NOT NULL,
    venue        TEXT NOT NULL,
    kickoff_utc  TEXT NOT NULL,
    home_score   INTEGER,
    away_score   INTEGER,
    status       TEXT NOT NULL DEFAULT 'scheduled'
  );
  CREATE TABLE IF NOT EXISTS predictions (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_id    TEXT NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
    home_score  INTEGER NOT NULL,
    away_score  INTEGER NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, match_id)
  );
  CREATE INDEX IF NOT EXISTS idx_predictions_match ON predictions(match_id);
  CREATE INDEX IF NOT EXISTS idx_matches_kickoff   ON matches(kickoff_utc);
`;

async function ensureInit(): Promise<Client> {
  const c = getClient();
  if (_initPromise) {
    await _initPromise;
    return c;
  }
  _initPromise = (async () => {
    // libSQL supports multi-statement via executeMultiple (no params)
    await c.executeMultiple(SCHEMA);

    // Migration: add pin_changed for users tables created before that column existed.
    // Safe to ignore "duplicate column" errors.
    try {
      await c.execute("ALTER TABLE users ADD COLUMN pin_changed INTEGER NOT NULL DEFAULT 0");
    } catch {
      // column already exists — ignore
    }

    // Seed players if empty
    const usr = await c.execute('SELECT COUNT(*) AS c FROM users');
    if (toNum(usr.rows[0].c) === 0) {
      await c.batch(
        PLAYERS.map((name) => ({
          sql: 'INSERT INTO users (name, pin, avatar_seed) VALUES (?, ?, ?)',
          args: [
            name,
            String(Math.floor(1000 + Math.random() * 9000)),
            name.toLowerCase().replace(/\s+/g, '-'),
          ],
        })),
        'write',
      );
    }

    // Seed matches if empty
    const mc = await c.execute('SELECT COUNT(*) AS c FROM matches');
    if (toNum(mc.rows[0].c) === 0) {
      await c.batch(
        MATCHES.map((m) => ({
          sql: `INSERT INTO matches (id, stage, grp, home_team, home_code, away_team, away_code, venue, kickoff_utc)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [m.id, m.stage, m.group, m.home_team, m.home_code, m.away_team, m.away_code, m.venue, m.kickoff_utc],
        })),
        'write',
      );
    }
  })().catch((err) => {
    _initPromise = null; // allow retry on next call
    throw err;
  });

  await _initPromise;
  return c;
}

function toNum(v: unknown): number {
  if (typeof v === 'bigint') return Number(v);
  if (typeof v === 'number') return v;
  if (typeof v === 'string') return parseInt(v, 10);
  return 0;
}

function toNumOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  return toNum(v);
}

function toStr(v: unknown): string {
  return v === null || v === undefined ? '' : String(v);
}

function toStrOrNull(v: unknown): string | null {
  return v === null || v === undefined ? null : String(v);
}

// ============================== Types ==============================

export type User = {
  id: number;
  name: string;
  pin: string;
  avatar_seed: string;
  pin_changed: boolean;
};

export type Match = {
  id: string;
  stage: string;
  grp: string | null;
  home_team: string;
  home_code: string;
  away_team: string;
  away_code: string;
  venue: string;
  kickoff_utc: string;
  home_score: number | null;
  away_score: number | null;
  status: 'scheduled' | 'live' | 'final';
};

export type Prediction = {
  id: number;
  user_id: number;
  match_id: string;
  home_score: number;
  away_score: number;
  created_at: string;
  updated_at: string;
};

// ============================== Row mappers ==============================

function mapUser(row: Record<string, unknown>): User {
  return {
    id: toNum(row.id),
    name: toStr(row.name),
    pin: toStr(row.pin),
    avatar_seed: toStr(row.avatar_seed),
    pin_changed: toNum(row.pin_changed) === 1,
  };
}

function mapMatch(row: Record<string, unknown>): Match {
  return {
    id: toStr(row.id),
    stage: toStr(row.stage),
    grp: toStrOrNull(row.grp),
    home_team: toStr(row.home_team),
    home_code: toStr(row.home_code),
    away_team: toStr(row.away_team),
    away_code: toStr(row.away_code),
    venue: toStr(row.venue),
    kickoff_utc: toStr(row.kickoff_utc),
    home_score: toNumOrNull(row.home_score),
    away_score: toNumOrNull(row.away_score),
    status: toStr(row.status) as Match['status'],
  };
}

function mapPrediction(row: Record<string, unknown>): Prediction {
  return {
    id: toNum(row.id),
    user_id: toNum(row.user_id),
    match_id: toStr(row.match_id),
    home_score: toNum(row.home_score),
    away_score: toNum(row.away_score),
    created_at: toStr(row.created_at),
    updated_at: toStr(row.updated_at),
  };
}

// ============================== Queries ==============================

export async function listUsers(): Promise<User[]> {
  const c = await ensureInit();
  const r = await c.execute('SELECT * FROM users ORDER BY id ASC');
  return r.rows.map((row) => mapUser(row as Record<string, unknown>));
}

export async function getUser(id: number): Promise<User | undefined> {
  const c = await ensureInit();
  const r = await c.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [id] });
  return r.rows[0] ? mapUser(r.rows[0] as Record<string, unknown>) : undefined;
}

export async function authUser(name: string, pin: string): Promise<User | null> {
  const c = await ensureInit();
  const r = await c.execute({
    sql: 'SELECT * FROM users WHERE name = ? AND pin = ?',
    args: [name, pin],
  });
  return r.rows[0] ? mapUser(r.rows[0] as Record<string, unknown>) : null;
}

export async function listMatches(): Promise<Match[]> {
  const c = await ensureInit();
  const r = await c.execute('SELECT * FROM matches ORDER BY kickoff_utc ASC, id ASC');
  return r.rows.map((row) => mapMatch(row as Record<string, unknown>));
}

export async function getMatch(id: string): Promise<Match | undefined> {
  const c = await ensureInit();
  const r = await c.execute({ sql: 'SELECT * FROM matches WHERE id = ?', args: [id] });
  return r.rows[0] ? mapMatch(r.rows[0] as Record<string, unknown>) : undefined;
}

export async function getPrediction(
  userId: number,
  matchId: string,
): Promise<Prediction | undefined> {
  const c = await ensureInit();
  const r = await c.execute({
    sql: 'SELECT * FROM predictions WHERE user_id = ? AND match_id = ?',
    args: [userId, matchId],
  });
  return r.rows[0] ? mapPrediction(r.rows[0] as Record<string, unknown>) : undefined;
}

export async function getPredictionsForUser(userId: number): Promise<Map<string, Prediction>> {
  const c = await ensureInit();
  const r = await c.execute({
    sql: 'SELECT * FROM predictions WHERE user_id = ?',
    args: [userId],
  });
  const map = new Map<string, Prediction>();
  for (const row of r.rows) {
    const p = mapPrediction(row as Record<string, unknown>);
    map.set(p.match_id, p);
  }
  return map;
}

export async function getPredictionsForMatch(matchId: string): Promise<Prediction[]> {
  const c = await ensureInit();
  const r = await c.execute({
    sql: 'SELECT * FROM predictions WHERE match_id = ?',
    args: [matchId],
  });
  return r.rows.map((row) => mapPrediction(row as Record<string, unknown>));
}

export async function upsertPrediction(
  userId: number,
  matchId: string,
  homeScore: number,
  awayScore: number,
): Promise<void> {
  const c = await ensureInit();
  await c.execute({
    sql: `
      INSERT INTO predictions (user_id, match_id, home_score, away_score)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, match_id) DO UPDATE SET
        home_score = excluded.home_score,
        away_score = excluded.away_score,
        updated_at = datetime('now')
    `,
    args: [userId, matchId, homeScore, awayScore],
  });
}

export async function setMatchResult(
  matchId: string,
  homeScore: number | null,
  awayScore: number | null,
  status: 'scheduled' | 'live' | 'final',
): Promise<void> {
  const c = await ensureInit();
  await c.execute({
    sql: `UPDATE matches SET home_score = ?, away_score = ?, status = ? WHERE id = ?`,
    args: [
      homeScore as InValue,
      awayScore as InValue,
      status,
      matchId,
    ],
  });
}

/** Predictions close 60 seconds before kickoff. Pure function — sync. */
export function isMatchLocked(match: Match, now = new Date()): boolean {
  const kickoff = new Date(match.kickoff_utc).getTime();
  return now.getTime() >= kickoff - 60_000;
}

export async function changeUserPin(userId: number, newPin: string): Promise<void> {
  const c = await ensureInit();
  await c.execute({
    sql: `UPDATE users SET pin = ?, pin_changed = 1 WHERE id = ?`,
    args: [newPin, userId],
  });
}

export type LeaderboardRow = {
  user_id: number;
  name: string;
  avatar_seed: string;
  total: number;
  exact_count: number;
  result_count: number;
  predicted: number;
};

export async function leaderboard(): Promise<LeaderboardRow[]> {
  const c = await ensureInit();
  const r = await c.execute(`
    SELECT
      u.id   AS user_id,
      u.name AS name,
      u.avatar_seed AS avatar_seed,
      COALESCE(SUM(
        CASE
          WHEN m.status = 'final' AND p.home_score = m.home_score AND p.away_score = m.away_score THEN 3
          WHEN m.status = 'final' AND (
            (p.home_score >  p.away_score AND m.home_score >  m.away_score) OR
            (p.home_score <  p.away_score AND m.home_score <  m.away_score) OR
            (p.home_score =  p.away_score AND m.home_score =  m.away_score)
          ) THEN 1
          ELSE 0
        END
      ), 0) AS total,
      COALESCE(SUM(
        CASE WHEN m.status = 'final' AND p.home_score = m.home_score AND p.away_score = m.away_score THEN 1 ELSE 0 END
      ), 0) AS exact_count,
      COALESCE(SUM(
        CASE
          WHEN m.status = 'final' AND NOT (p.home_score = m.home_score AND p.away_score = m.away_score) AND (
            (p.home_score >  p.away_score AND m.home_score >  m.away_score) OR
            (p.home_score <  p.away_score AND m.home_score <  m.away_score) OR
            (p.home_score =  p.away_score AND m.home_score =  m.away_score)
          ) THEN 1 ELSE 0 END
      ), 0) AS result_count,
      COALESCE(SUM(CASE WHEN p.id IS NOT NULL THEN 1 ELSE 0 END), 0) AS predicted
    FROM users u
    LEFT JOIN predictions p ON p.user_id = u.id
    LEFT JOIN matches m     ON m.id      = p.match_id
    GROUP BY u.id
    ORDER BY total DESC, exact_count DESC, predicted DESC, u.id ASC
  `);
  return r.rows.map((row) => {
    const o = row as Record<string, unknown>;
    return {
      user_id: toNum(o.user_id),
      name: toStr(o.name),
      avatar_seed: toStr(o.avatar_seed),
      total: toNum(o.total),
      exact_count: toNum(o.exact_count),
      result_count: toNum(o.result_count),
      predicted: toNum(o.predicted),
    };
  });
}
