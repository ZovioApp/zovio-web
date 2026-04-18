import { useParams } from 'react-router-dom';

export default function Invite() {
  const { code } = useParams<{ code: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-[440px] w-full">
        <div className="text-center mb-6">
          <span className="wordmark text-xl">Zovio</span>
        </div>

        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-sm)] p-8">
          <h1 className="text-xl font-semibold text-[var(--color-text)] mb-2 text-center">
            You've been invited
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] text-center mb-7">
            Follow these steps to join the academy on Zovio.
          </p>

          <ol className="space-y-4 mb-6">
            {[
              {
                n: 1,
                text: (
                  <>
                    Download the{' '}
                    <strong className="text-[var(--color-text)]">
                      Zovio app
                    </strong>{' '}
                    from the App Store or Play Store.
                  </>
                ),
              },
              {
                n: 2,
                text: (
                  <>
                    Open Zovio and{' '}
                    <strong className="text-[var(--color-text)]">
                      sign up with the email
                    </strong>{' '}
                    this invitation was sent to.
                  </>
                ),
              },
              {
                n: 3,
                text: (
                  <>
                    You'll automatically join the academy once registered.
                  </>
                ),
              },
            ].map((step) => (
              <li key={step.n} className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary-subtle-bg)] text-[var(--color-primary-hover)] text-xs font-semibold flex items-center justify-center">
                  {step.n}
                </span>
                <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed pt-0.5">
                  {step.text}
                </span>
              </li>
            ))}
          </ol>

          {code && (
            <p className="text-center text-xs text-[var(--color-text-muted)] pt-4 border-t border-[var(--color-border-subtle)]">
              Invite code{' '}
              <code className="text-[var(--color-text-secondary)] font-mono bg-[var(--color-bg-subtle)] px-1.5 py-0.5 rounded">
                {code}
              </code>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-5">
          &copy; 2026 Zovio
        </p>
      </div>
    </div>
  );
}
