import { useParams } from 'react-router-dom';

export default function Invite() {
  const { code } = useParams<{ code: string }>();

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="max-w-[440px] w-full text-center">
        <h1 className="brand-gradient text-4xl font-bold mb-2">Zovio</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-8">
          Academy &amp; Class Management
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-8 mb-6">
          <div className="text-5xl mb-4">{'\u{1F3C3}'}</div>
          <h2 className="text-2xl font-bold mb-3">You've been invited!</h2>
          <p className="text-[var(--color-text-secondary)] text-[15px] leading-relaxed mb-7">
            You've been invited to join an academy on Zovio. Follow these steps
            to get started.
          </p>

          <ol className="text-left mb-7 space-y-[18px]">
            {[
              {
                n: 1,
                text: (
                  <>
                    Download the <strong className="text-white">Zovio app</strong>{' '}
                    from the App Store or Play Store
                  </>
                ),
              },
              {
                n: 2,
                text: (
                  <>
                    Open Zovio and{' '}
                    <strong className="text-white">
                      sign up with the email
                    </strong>{' '}
                    this invitation was sent to
                  </>
                ),
              },
              {
                n: 3,
                text: <>You'll automatically join the academy once registered</>,
              },
            ].map((step) => (
              <li key={step.n} className="flex items-start gap-3.5">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[rgba(0,212,170,0.15)] text-[var(--color-primary)] text-[13px] font-bold flex items-center justify-center">
                  {step.n}
                </span>
                <span className="text-sm text-[var(--color-text-secondary)] leading-snug pt-0.5">
                  {step.text}
                </span>
              </li>
            ))}
          </ol>

          {code && (
            <p className="text-xs text-[var(--color-text-muted)] mb-4">
              Invite code:{' '}
              <code className="text-[var(--color-primary)] font-mono">
                {code}
              </code>
            </p>
          )}
        </div>

        <p className="text-xs text-[var(--color-text-muted)]">
          &copy; 2026 Zovio. All rights reserved.
        </p>
      </div>
    </div>
  );
}
