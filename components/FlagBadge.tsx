import { flagUrl } from '@/lib/flags';

type Props = {
  code: string;
  name: string;
  size?: 32 | 40 | 56 | 72;
  showCode?: boolean;
};

export function FlagBadge({ code, name, size = 40, showCode = false }: Props) {
  const url = flagUrl(code, size <= 40 ? 'w80' : 'w160');
  const px = `${size}px`;
  return (
    <div className="flex items-center gap-2">
      <div
        className="relative shrink-0 overflow-hidden rounded-full ring-1 ring-white/12"
        style={{ width: px, height: px }}
        aria-label={name}
      >
        {url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={name}
            width={size}
            height={size}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[var(--color-surface-2)] text-[10px] font-bold text-[var(--color-muted)]">
            {code}
          </div>
        )}
      </div>
      {showCode && (
        <span className="mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {code}
        </span>
      )}
    </div>
  );
}
