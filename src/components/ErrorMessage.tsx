export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-md border border-[var(--color-error-subtle-border)] bg-[var(--color-error-subtle-bg)] text-[var(--color-error)] px-3 py-2 text-sm"
    >
      {message}
    </div>
  );
}
