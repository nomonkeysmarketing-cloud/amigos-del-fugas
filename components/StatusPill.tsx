type Status = 'scheduled' | 'live' | 'locked' | 'final';

const STYLES: Record<Status, { bg: string; text: string; border: string; label: string; dot: boolean }> = {
  scheduled: {
    bg: 'bg-[var(--color-surface-2)]',
    text: 'text-[var(--color-secondary-text)]',
    border: 'border border-[var(--color-border)]',
    label: 'Próximo',
    dot: false,
  },
  live: {
    bg: 'bg-[var(--color-primary)]/15',
    text: 'text-[var(--color-primary)]',
    border: 'border border-[var(--color-primary)]/40',
    label: 'En vivo',
    dot: true,
  },
  locked: {
    bg: 'bg-[var(--color-gold)]/12',
    text: 'text-[var(--color-gold)]',
    border: 'border border-[var(--color-gold)]/30',
    label: 'Cerrado',
    dot: false,
  },
  final: {
    bg: 'bg-transparent',
    text: 'text-[var(--color-muted)]',
    border: 'border border-[var(--color-border)]',
    label: 'Final',
    dot: false,
  },
};

export function StatusPill({ status }: { status: Status }) {
  const s = STYLES[status];
  return (
    <span className={`pill ${s.bg} ${s.text} ${s.border}`}>
      {s.dot && (
        <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
      )}
      {s.label}
    </span>
  );
}
