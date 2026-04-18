import { useAuth } from '../../hooks/useAuth';

export default function AppHome() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
        <span className="brand-gradient text-xl font-bold">Zovio</span>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[var(--color-text-secondary)]">
            {user?.name}
          </span>
          <button
            type="button"
            onClick={() => void logout()}
            className="text-[var(--color-text-muted)] hover:text-white transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-[520px] text-center">
          <h1 className="text-3xl font-bold mb-3">
            Welcome, {user?.name?.split(' ')[0] ?? 'there'}
          </h1>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">
            Your owner dashboard is coming together. Revenue breakdowns,
            per-academy payouts, and team management land in the next release.
          </p>
          <p className="text-[var(--color-text-muted)] text-sm mt-6">
            In the meantime, use the Zovio mobile app to run your sessions.
          </p>
        </div>
      </main>
    </div>
  );
}
