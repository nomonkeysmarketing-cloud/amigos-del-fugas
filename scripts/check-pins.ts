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

async function main() {
  const c = createClient({ url: get('TURSO_DATABASE_URL'), authToken: get('TURSO_AUTH_TOKEN') });
  const cols = await c.execute("PRAGMA table_info('users')");
  console.log('Columns:');
  cols.rows.forEach((r) => console.log(`  - ${r.name} (${r.type}) default=${r.dflt_value ?? '-'}`));
  console.log('\nPlayers:');
  const rows = await c.execute('SELECT id, name, pin, pin_changed FROM users ORDER BY id');
  rows.rows.forEach((r) => console.log(`  ${r.id}. ${r.name} · pin=${r.pin} · changed=${r.pin_changed}`));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
