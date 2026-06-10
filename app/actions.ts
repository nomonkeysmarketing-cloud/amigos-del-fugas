'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  authUser,
  changeUserPin,
  getMatch,
  isMatchLocked,
  setMatchResult,
  upsertPrediction,
} from '@/lib/db';
import { SESSION_COOKIE, ADMIN_COOKIE, ADMIN_PIN, getCurrentUser, isAdmin } from '@/lib/auth';

export async function loginAction(_: unknown, formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const pin = String(formData.get('pin') ?? '').trim();
  if (!name || !pin) return { ok: false, error: 'Falta nombre o PIN' };
  const u = await authUser(name, pin);
  if (!u) return { ok: false, error: 'Nombre o PIN incorrecto. Intenta otra vez.' };
  const jar = await cookies();
  jar.set(SESSION_COOKIE, String(u.id), {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 90,
    path: '/',
  });
  redirect(u.pin_changed ? '/partidos' : '/cambiar-pin');
}

export async function changePinAction(_: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'No has iniciado sesión.' };

  const newPin = String(formData.get('new_pin') ?? '').trim();
  const confirmPin = String(formData.get('confirm_pin') ?? '').trim();

  if (!/^\d{4}$/.test(newPin)) {
    return { ok: false, error: 'El PIN debe ser de 4 dígitos.' };
  }
  if (newPin !== confirmPin) {
    return { ok: false, error: 'Los PINs no coinciden.' };
  }
  if (newPin === '0000' || newPin === '1234' || newPin === '1111') {
    return { ok: false, error: 'PIN muy obvio. Pícale más.' };
  }

  await changeUserPin(user.id, newPin);
  revalidatePath('/admin');
  redirect('/partidos');
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect('/');
}

export async function savePredictionAction(_: unknown, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: 'No has iniciado sesión.' };

  const matchId = String(formData.get('match_id') ?? '');
  const home = parseInt(String(formData.get('home_score') ?? ''), 10);
  const away = parseInt(String(formData.get('away_score') ?? ''), 10);

  if (!matchId) return { ok: false, error: 'Partido inválido.' };
  if (!Number.isFinite(home) || !Number.isFinite(away) || home < 0 || away < 0 || home > 20 || away > 20) {
    return { ok: false, error: 'Marcador inválido (0-20).' };
  }

  const match = await getMatch(matchId);
  if (!match) return { ok: false, error: 'Partido no encontrado.' };
  if (isMatchLocked(match)) {
    return { ok: false, error: 'Llegaste tarde. Este partido ya cerró.' };
  }

  await upsertPrediction(user.id, matchId, home, away);
  revalidatePath('/partidos');
  revalidatePath(`/partidos/${matchId}`);
  revalidatePath('/tablero');
  return { ok: true, message: '¡Pronóstico guardado! Que ruede el balón.' };
}

export async function adminLoginAction(_: unknown, formData: FormData) {
  const pin = String(formData.get('admin_pin') ?? '').trim();
  if (pin !== ADMIN_PIN) return { ok: false, error: 'PIN admin incorrecto.' };
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, pin, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 6, // 6 horas de sesión
    path: '/',
  });
  redirect('/admin');
}

export async function adminLogoutAction() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect('/admin');
}

/** Server-side admin action — corre el sync internamente con el secret sin exponerlo. */
export async function runSyncAction(): Promise<
  | { ok: true; matched: number; updated: number; mapped: number; skipped?: boolean; reason?: string }
  | { ok: false; error: string }
> {
  if (!(await isAdmin())) return { ok: false, error: 'Sesión admin requerida.' };

  // Import dinámico para evitar bundle del cliente
  const { GET } = await import('@/app/api/cron/sync-results/route');
  const key = process.env.CRON_SECRET ?? ADMIN_PIN;
  // Llamamos al handler directamente (in-process) en vez de fetch externo
  const fakeReq = new Request(`http://internal/api/cron/sync-results?key=${encodeURIComponent(key)}`);
  const res = await GET(fakeReq);
  const data = await res.json();

  if (data.skipped) {
    return { ok: true, matched: 0, updated: 0, mapped: 0, skipped: true, reason: data.reason };
  }
  if (!data.ok) return { ok: false, error: data.error ?? 'Error del sync' };

  revalidatePath('/admin');
  return {
    ok: true,
    matched: data.matched ?? 0,
    updated: data.updated ?? 0,
    mapped: data.mapped_now ?? 0,
  };
}

export async function setResultAction(_: unknown, formData: FormData) {
  if (!(await isAdmin())) return { ok: false, error: 'Sesión admin requerida.' };

  const matchId = String(formData.get('match_id') ?? '');
  const home = formData.get('home_score');
  const away = formData.get('away_score');

  if (!matchId) return { ok: false, error: 'Partido inválido.' };

  const homeNum = home === null || home === '' ? null : parseInt(String(home), 10);
  const awayNum = away === null || away === '' ? null : parseInt(String(away), 10);

  // Status se deriva del marcador: con ambos goles → final; sin marcador → reset a scheduled.
  const clearing = homeNum === null && awayNum === null;
  if (!clearing && (homeNum === null || awayNum === null)) {
    return { ok: false, error: 'Necesitas ambos marcadores (o deja los dos vacíos para borrar).' };
  }
  const status = clearing ? 'scheduled' : 'final';

  await setMatchResult(matchId, homeNum, awayNum, status);
  revalidatePath('/admin');
  revalidatePath('/partidos');
  revalidatePath('/tablero');
  return {
    ok: true,
    message: clearing ? 'Resultado borrado.' : '¡Resultado final guardado! Puntos al tablero.',
  };
}
