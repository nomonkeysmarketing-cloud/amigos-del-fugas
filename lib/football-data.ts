import 'server-only';

const API_BASE = 'https://api.football-data.org/v4';
const WORLD_CUP_CODE = 'WC'; // FD competition code para Mundial FIFA

// Football-Data usa códigos FIFA en su mayoría pero algunos divergen (ISO 3-letter).
// Mapeamos a NUESTROS códigos (los que sembramos en matches-data.ts).
const FD_TO_OUR: Record<string, string> = {
  // Confirmados o probables divergencias contra FIFA tla
  ZAF: 'RSA', // Sudáfrica (ISO ZAF / FIFA RSA)
  SAU: 'KSA', // Arabia Saudita
  DZA: 'ALG', // Argelia (algunos FD endpoints usan ALG, otros DZA)
  IRN: 'IRN', // Irán
  COD: 'COD', // RD Congo
  CIV: 'CIV', // Costa de Marfil
  KOR: 'KOR',
  PRK: 'PRK',
  TPE: 'TPE',
  // El resto que ya son iguales no necesita entrada.
};

export function normalizeCode(code: string | null | undefined): string {
  if (!code) return '';
  const upper = code.toUpperCase();
  return FD_TO_OUR[upper] ?? upper;
}

export type FdMatchStatus =
  | 'SCHEDULED'
  | 'TIMED'
  | 'IN_PLAY'
  | 'PAUSED'
  | 'FINISHED'
  | 'POSTPONED'
  | 'SUSPENDED'
  | 'CANCELLED';

export type FdMatch = {
  id: number;
  utcDate: string;
  status: FdMatchStatus;
  matchday: number | null;
  stage: string;
  group: string | null;
  homeTeam: { id: number | null; name: string; shortName: string | null; tla: string | null };
  awayTeam: { id: number | null; name: string; shortName: string | null; tla: string | null };
  score: {
    winner: 'HOME_TEAM' | 'AWAY_TEAM' | 'DRAW' | null;
    duration: string;
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
};

type FdMatchesResponse = {
  filters: Record<string, unknown>;
  resultSet: { count: number };
  matches: FdMatch[];
};

class FootballDataError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'FootballDataError';
  }
}

function token(): string | null {
  return process.env.FOOTBALL_DATA_TOKEN || null;
}

export function isConfigured(): boolean {
  return Boolean(token());
}

async function get<T>(path: string): Promise<T> {
  const t = token();
  if (!t) throw new FootballDataError(0, 'FOOTBALL_DATA_TOKEN no está configurado.');

  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'X-Auth-Token': t, Accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  });

  if (res.status === 429) {
    throw new FootballDataError(429, 'Rate limit excedido (10 req/min en free tier).');
  }
  if (res.status === 403) {
    throw new FootballDataError(403, 'Token inválido o sin acceso a esta competición.');
  }
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new FootballDataError(res.status, `Football-Data HTTP ${res.status}: ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

/** Devuelve TODOS los partidos del Mundial 2026 (cualquier status). */
export async function listWorldCupMatches(season = 2026): Promise<FdMatch[]> {
  const data = await get<FdMatchesResponse>(`/competitions/${WORLD_CUP_CODE}/matches?season=${season}`);
  return data.matches;
}

/** Subset: sólo los FINISHED. */
export async function listFinishedMatches(season = 2026): Promise<FdMatch[]> {
  const data = await get<FdMatchesResponse>(
    `/competitions/${WORLD_CUP_CODE}/matches?season=${season}&status=FINISHED`,
  );
  return data.matches;
}

export { FootballDataError };
