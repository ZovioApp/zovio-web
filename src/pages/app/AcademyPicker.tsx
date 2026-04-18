import { Link } from 'react-router-dom';
import type { AcademySummary } from '../../lib/academies';
import { useAuth } from '../../hooks/useAuth';

interface Props {
  academies: AcademySummary[];
}

export default function AcademyPicker({ academies }: Props) {
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

      <main className="flex-1 px-6 py-12 max-w-[720px] mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Pick an academy</h1>
        <p className="text-[var(--color-text-secondary)] mb-8">
          You have admin rights in more than one academy. Choose which one to
          manage.
        </p>

        <ul className="space-y-3">
          {academies.map((a) => (
            <li key={a.id}>
              <Link
                to={`/app/a/${a.id}/overview`}
                className="block bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-primary)] transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-white truncate">
                      {a.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">
                      {a.role.replace('_', ' ')} · {a.memberCount} members ·{' '}
                      {a.currency}
                    </div>
                  </div>
                  <span className="text-[var(--color-primary)] text-sm shrink-0">
                    Open →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
