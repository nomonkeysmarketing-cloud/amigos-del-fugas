import { cookies } from 'next/headers';
import { getUser, type User } from './db';

export const SESSION_COOKIE = 'quiniela_uid';
export const ADMIN_COOKIE = 'amigos_admin';
export const ADMIN_PIN = process.env.ADMIN_PIN ?? '2026';

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const uid = jar.get(SESSION_COOKIE)?.value;
  if (!uid) return null;
  const id = parseInt(uid, 10);
  if (!Number.isFinite(id)) return null;
  return (await getUser(id)) ?? null;
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === ADMIN_PIN;
}
