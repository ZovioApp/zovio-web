import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { AcademySummary } from '../../lib/academies';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { CreateAcademyModal } from '../../components/CreateAcademyModal';

interface Props {
  academies: AcademySummary[];
}

export default function AcademyPicker({ academies }: Props) {
  const { user, logout } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="max-w-[720px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="wordmark text-lg">Zovio</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[var(--color-text-secondary)]">
              {user?.name}
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-12 max-w-[720px] mx-auto w-full">
        <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-1">
          Choose an academy
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mb-8">
          You have admin rights in more than one. Pick which one to manage.
        </p>

        <ul className="space-y-2">
          {academies.map((a) => (
            <li key={a.id}>
              <Link
                to={`/app/a/${a.id}/overview`}
                className="group block bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-5 py-4 hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-sm)] transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[var(--color-text)] truncate">
                      {a.name}
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1 tnum">
                      {a.role === 'primary_owner' ? 'Primary owner' : 'Co-owner'}
                      {' · '}
                      {a.memberCount} {a.memberCount === 1 ? 'member' : 'members'}
                      {' · '}
                      {a.currency}
                    </div>
                  </div>
                  <span className="text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-colors">
                    Open →
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button variant="secondary" size="md" onClick={() => setCreateOpen(true)}>
            + Create new academy
          </Button>
        </div>

        <CreateAcademyModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      </main>
    </div>
  );
}
