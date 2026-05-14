export function PointsBadge({ points }: { points: 0 | 1 | 3 | null }) {
  if (points === null) return null;
  if (points === 3) {
    return (
      <span className="pill border border-[var(--color-primary)]/40 bg-[var(--color-primary)]/12 text-[var(--color-primary)]">
        +3 PTS
      </span>
    );
  }
  if (points === 1) {
    return (
      <span className="pill border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10 text-[var(--color-gold)]">
        +1 PT
      </span>
    );
  }
  return (
    <span className="pill border border-dashed border-[var(--color-border)] text-[var(--color-muted)]">
      0 PTS
    </span>
  );
}
