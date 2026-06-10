import { createClient } from '@libsql/client';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const env = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
const get = (k: string) =>
  env.split('\n').find((l) => l.startsWith(`${k}=`))?.slice(k.length + 1)?.trim() ?? '';

async function main() {
  const c = createClient({ url: get('TURSO_DATABASE_URL'), authToken: get('TURSO_AUTH_TOKEN') });
  const r = await c.execute(`
    SELECT id, home_team, home_code, away_team, away_code, kickoff_utc
    FROM matches
    WHERE stage = 'group' AND remote_id IS NULL
    ORDER BY kickoff_utc
  `);
  console.log(`Sin mapear (${r.rows.length}):`);
  r.rows.forEach((row) =>
    console.log(`  ${row.id}: ${row.home_code} ${row.home_team} vs ${row.away_team} ${row.away_code} (${row.kickoff_utc})`),
  );

  const last = await c.execute('SELECT * FROM sync_log ORDER BY id DESC LIMIT 1');
  console.log('\nÚltima sync:');
  console.log(last.rows[0]);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
