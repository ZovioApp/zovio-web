import { env } from '../lib/env';

export function StagingBanner() {
  if (env.isProduction) return null;

  const label = env.environment === 'staging' ? 'Staging' : 'Local';
  return (
    <div
      role="status"
      className="w-full bg-[var(--color-warning-subtle-bg)] border-b border-[var(--color-warning-subtle-border)] text-[var(--color-warning)] text-center text-[11px] font-medium py-1 tracking-wide"
    >
      {label} environment — not for real payments
    </div>
  );
}
