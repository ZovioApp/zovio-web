export function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-[rgba(255,107,107,0.35)] bg-[rgba(255,107,107,0.08)] text-[var(--color-error)] px-4 py-3 text-sm"
    >
      {message}
    </div>
  );
}
