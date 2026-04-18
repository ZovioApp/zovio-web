import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

const features = [
  {
    title: 'Academy management',
    description:
      'Invite coaches, athletes, and co-owners with role-based access. One login, many academies.',
  },
  {
    title: 'Session scheduling',
    description:
      'Plan recurring classes with capacity limits, pricing, and per-session visibility.',
  },
  {
    title: 'Attendance & charging',
    description:
      'Mark attendance in one tap. Paid sessions auto-charge saved cards on attendance.',
  },
  {
    title: 'Payouts via Stripe',
    description:
      'Each academy sets its own payout destination. Ready for multi-currency expansion.',
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="max-w-[1120px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="wordmark text-lg">Zovio</span>
          <Link to="/login">
            <Button variant="secondary" size="sm">
              Sign in
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="max-w-[960px] mx-auto px-6 pt-20 pb-16 text-center">
          <span className="inline-flex items-center text-[11px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--color-primary-subtle-bg)] text-[var(--color-primary-hover)] border border-[var(--color-primary-subtle-border)] mb-6">
            Coming soon
          </span>

          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--color-text)] leading-tight mb-5">
            Run your academy
            <br />
            <span className="text-[var(--color-primary)]">like a pro</span>
          </h1>

          <p className="text-base sm:text-lg text-[var(--color-text-secondary)] leading-relaxed max-w-[640px] mx-auto mb-10">
            Sports coaching, tuition classes, music schools — Zovio handles the
            schedule, the roster, the attendance, and the payments in one place.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link to="/login">
              <Button variant="primary" size="md">
                Sign in
              </Button>
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors px-3 py-2"
            >
              See features →
            </a>
          </div>
        </section>

        <section
          id="features"
          className="max-w-[1120px] mx-auto px-6 pb-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg p-6"
              >
                <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="max-w-[1120px] mx-auto px-6 h-14 flex items-center justify-between text-xs text-[var(--color-text-muted)]">
          <span>&copy; 2026 Zovio</span>
          <Link
            to="/login"
            className="hover:text-[var(--color-text)] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
