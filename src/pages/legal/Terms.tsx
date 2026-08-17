import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <LegalPage title="Terms of Service" updated="17 August 2026">
      <h2>1. The service</h2>
      <p>
        Zovio provides software for sports academies and training
        organisations: scheduling, attendance, member management, event
        registration, and payment collection. The service is offered by
        Zovio (&ldquo;we&rdquo;, &ldquo;us&rdquo;) to account holders
        (&ldquo;you&rdquo;) under these terms.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You must provide accurate information when creating an account and
        keep your credentials secure. You are responsible for activity under
        your account. Accounts are created in the Zovio mobile app; the web
        dashboard is available to organisation owners.
      </p>

      <h2>3. Organisations, coaches, and athletes</h2>
      <p>
        Organisation owners control their organisation&rsquo;s data, members,
        pricing, and payout configuration. Coaches and athletes participate
        in organisations at the invitation of their owners. Fees charged for
        sessions and events are set by the organisation, not by Zovio.
      </p>

      <h2>4. Payments</h2>
      <p>
        Card payments are processed by Stripe. By saving a card you authorise
        the organisations you train with to charge fees for sessions you
        attend and events you register for, under the payment terms shown at
        the time of enrolment. Subscription fees for paid Zovio plans renew
        monthly until cancelled. Refunds for session and event fees are
        issued by the organisation that charged them.
      </p>

      <h2>5. Acceptable use</h2>
      <p>
        You may not misuse the service: no unlawful content, no attempts to
        breach security or access other users&rsquo; data, no interference
        with the service&rsquo;s operation.
      </p>

      <h2>6. Termination</h2>
      <p>
        You can delete your account at any time from the mobile app
        (Profile &rarr; Delete Account). We may suspend accounts that breach
        these terms. On deletion, personal data is handled as described in
        the <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>7. Disclaimers and liability</h2>
      <p>
        The service is provided &ldquo;as is&rdquo;. To the maximum extent
        permitted by law, we are not liable for indirect or consequential
        loss, or for the conduct of organisations, coaches, or athletes
        using the platform. Nothing in these terms excludes liability that
        cannot be excluded by law.
      </p>

      <h2>8. Changes</h2>
      <p>
        We may update these terms; material changes will be announced in the
        app or by email. Continued use after a change takes effect
        constitutes acceptance.
      </p>

      <h2>9. Contact</h2>
      <p>
        Questions about these terms: <strong>support@zovio.app</strong>.
      </p>
    </LegalPage>
  );
}

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-[720px] mx-auto px-6 h-14 flex items-center justify-between">
          <Link to="/" className="wordmark text-lg">
            Zovio
          </Link>
          <Link
            to="/login"
            className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
          >
            Sign in
          </Link>
        </div>
      </header>
      <main className="max-w-[720px] mx-auto px-6 py-12 legal-prose">
        <h1 className="text-3xl font-semibold text-[var(--color-text)]">
          {title}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-2 mb-8">
          Last updated: {updated}
        </p>
        {children}
      </main>
      <footer className="max-w-[720px] mx-auto px-6 pb-12 text-xs text-[var(--color-text-muted)] flex gap-4">
        <Link to="/terms" className="hover:text-[var(--color-text)]">
          Terms of Service
        </Link>
        <Link to="/privacy" className="hover:text-[var(--color-text)]">
          Privacy Policy
        </Link>
      </footer>
    </div>
  );
}
