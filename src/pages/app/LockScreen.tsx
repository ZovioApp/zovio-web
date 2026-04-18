import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/Button';
import { CreateAcademyModal } from '../../components/CreateAcademyModal';

interface Props {
  hasAnyMembership: boolean;
}

export default function LockScreen({ hasAnyMembership }: Props) {
  const { user, logout } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-[460px] w-full">
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] p-8 text-center">
          <h1 className="wordmark text-xl mb-5">Zovio</h1>

          {hasAnyMembership ? (
            <>
              <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
                Web is for academy owners today
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                You're signed in, but the dashboard is owner-only in this
                release. Coaches and athletes can run their full workflow in
                the Zovio mobile app.
              </p>
              <div className="space-y-2 mb-6">
                <AppStoreLink
                  href="https://apps.apple.com/app/zovio"
                  label="Download for iOS"
                />
                <AppStoreLink
                  href="https://play.google.com/store/apps/details?id=com.zovio.app"
                  label="Download for Android"
                />
              </div>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">
                Want to run your own academy?
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCreateOpen(true)}
              >
                Create an academy
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-base font-semibold text-[var(--color-text)] mb-2">
                Welcome to Zovio
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                You don't have any academies yet. Create your first one to
                start scheduling sessions, inviting coaches, and collecting
                fees.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setCreateOpen(true)}
              >
                Create your first academy
              </Button>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => void logout()}
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
          >
            Sign out {user?.email ? `(${user.email})` : ''}
          </button>
        </div>

        <CreateAcademyModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
        />
      </div>
    </div>
  );
}

function AppStoreLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text)] text-sm font-medium py-2 hover:bg-[var(--color-bg-subtle)] hover:border-[var(--color-border-strong)] transition-colors"
    >
      {label}
    </a>
  );
}
