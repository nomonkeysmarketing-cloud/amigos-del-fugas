import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
const get = (k: string) =>
  env
    .split('\n')
    .find((l) => l.startsWith(`${k}=`))
    ?.slice(k.length + 1)
    ?.trim() ?? '';

const name = process.argv[2];

async function main() {
  const url = get('TURSO_DATABASE_URL');
  const authToken = get('TURSO_AUTH_TOKEN');
  if (!url || !authToken) {
    console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
  }
  if (!name) {
    console.error('Usage: tsx scripts/reset-pin.ts "<player name>"');
    process.exit(1);
  }
  const c = createClient({ url, authToken });
  const found = await c.execute({
    sql: 'SELECT id, name FROM users WHERE name = ?',
    args: [name],
  });
  if (found.rows.length === 0) {
    console.log(`No user named "${name}".`);
    return;
  }
  const newPin = String(Math.floor(1000 + Math.random() * 9000));
  await c.execute({
    sql: 'UPDATE users SET pin = ?, pin_changed = 0 WHERE name = ?',
    args: [newPin, name],
  });
  console.log(`✓ ${name} reset.`);
  console.log(`   New PIN: ${newPin}`);
  console.log(`   pin_changed = 0 → on next login se le pedirá uno personal de nuevo.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
