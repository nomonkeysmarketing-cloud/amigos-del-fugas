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

const url = get('TURSO_DATABASE_URL');
const authToken = get('TURSO_AUTH_TOKEN');
const name = process.argv[2];

async function main() {
  if (!url || !authToken) {
    console.error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
    process.exit(1);
  }
  if (!name) {
    console.error('Usage: tsx scripts/delete-user.ts "<player name>"');
    process.exit(1);
  }
  const c = createClient({ url, authToken });
  const before = await c.execute({
    sql: 'SELECT id, name, pin FROM users WHERE name = ?',
    args: [name],
  });
  if (before.rows.length === 0) {
    console.log(`No user named "${name}".`);
    return;
  }
  console.log('Found:', before.rows[0]);
  const res = await c.execute({ sql: 'DELETE FROM users WHERE name = ?', args: [name] });
  console.log(`Deleted ${res.rowsAffected} row(s).`);
  const remaining = await c.execute('SELECT name FROM users ORDER BY id');
  console.log('Remaining players:', remaining.rows.map((r) => r.name).join(', '));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
