import { env } from '../lib/env';

export function StagingBanner() {
  if (env.isProduction) return null;

  const label = env.environment === 'staging' ? 'STAGING' : 'LOCAL';
  return (
    <div
      role="status"
      className="w-full bg-[var(--color-warning)] text-[var(--color-bg)] text-center text-xs font-semibold py-1 tracking-wide"
    >
      {label} — not for real payments
    </div>
  );
}
