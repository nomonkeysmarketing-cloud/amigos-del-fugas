import { NextResponse } from 'next/server';
import { leaderboard } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const rows = await leaderboard();
  return NextResponse.json(
    { rows, updated_at: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } },
  );
}
