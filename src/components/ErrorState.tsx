import { Button } from './Button';

/**
 * Page-level load failure with a retry action. Use ErrorMessage for small
 * inline action errors; use this when a fetch failure would otherwise
 * blank the page — a dead end with no retry is never acceptable.
 */
export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-6 py-10 text-center max-w-[560px]"
    >
      <h2 className="text-base font-semibold text-[var(--color-text)]">
        Couldn&rsquo;t load this page
      </h2>
      <p className="text-sm text-[var(--color-text-secondary)] mt-1.5">
        {message ?? 'The request failed. Check your connection and try again.'}
      </p>
      {onRetry && (
        <div className="mt-4">
          <Button type="button" variant="secondary" size="md" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
