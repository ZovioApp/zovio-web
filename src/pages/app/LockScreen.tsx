import { useAuth } from '../../hooks/useAuth';

interface Props {
  hasAnyMembership: boolean;
}

export default function LockScreen({ hasAnyMembership }: Props) {
  const { user, logout } = useAuth();

  const headline = hasAnyMembership
    ? 'Web access for coaches and athletes is coming soon'
    : 'No academies yet';

  const message = hasAnyMembership
    ? "You're signed in, but the Zovio web dashboard is for academy owners today. Manage sessions, mark attendance, and pay fees in the Zovio mobile app."
    : "You're not a member of any academy yet. Once you're invited or create your own, you'll see it here.";

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-[480px] w-full text-center">
        <h1 className="brand-gradient text-4xl font-bold mb-6">Zovio</h1>

        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8">
          <div className="text-5xl mb-4" aria-hidden>
            {'\u{1F4F1}'}
          </div>
          <h2 className="text-xl font-semibold mb-3">{headline}</h2>
          <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed mb-6">
            {message}
          </p>

          {hasAnyMembership && (
            <div className="space-y-3 mb-6">
              <AppStoreButton
                href="https://apps.apple.com/app/zovio"
                label="Download for iOS"
              />
              <AppStoreButton
                href="https://play.google.com/store/apps/details?id=com.zovio.app"
                label="Download for Android"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => void logout()}
            className="text-[var(--color-text-muted)] hover:text-white text-sm"
          >
            Sign out {user?.email ? `(${user.email})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

function AppStoreButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full rounded-[10px] bg-[var(--color-primary)] text-[var(--color-bg)] py-3 text-[15px] font-semibold hover:opacity-90"
    >
      {label}
    </a>
  );
}
