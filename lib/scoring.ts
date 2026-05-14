/**
 * Scoring rules:
 *   3 pts → marcador exacto
 *   1 pt  → acertaste el resultado (ganador o empate) pero no el marcador
 *   0 pts → fallaste
 */
export function calcPoints(
  predHome: number,
  predAway: number,
  finalHome: number,
  finalAway: number,
): 0 | 1 | 3 {
  if (predHome === finalHome && predAway === finalAway) return 3;
  const predDir = Math.sign(predHome - predAway);
  const finalDir = Math.sign(finalHome - finalAway);
  return predDir === finalDir ? 1 : 0;
}

export function pointsLabel(p: 0 | 1 | 3): string {
  if (p === 3) return '+3 PTS';
  if (p === 1) return '+1 PT';
  return '0 PTS';
}
