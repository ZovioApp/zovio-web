import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, ApiError } from '../lib/api';

type State =
  | { status: 'loading' }
  | { status: 'verified' }
  | { status: 'already_verified' }
  | { status: 'error'; message: string }
  | { status: 'missing_token' };

interface VerifyResponse {
  status: 'verified' | 'already_verified';
}

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<State>(
    token ? { status: 'loading' } : { status: 'missing_token' },
  );

  useEffect(() => {
    if (!token) return;

    api<VerifyResponse>('GET', `/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((data) => {
        setState({ status: data.status });
      })
      .catch((err: unknown) => {
        const message =
          err instanceof ApiError
            ? err.message
            : 'Something went wrong. Please try again.';
        setState({ status: 'error', message });
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-[420px] w-full text-center space-y-6">
        <Link to="/" className="wordmark text-xl block">
          Zovio
        </Link>

        {state.status === 'loading' && (
          <div className="space-y-2">
            <p className="text-sm text-[var(--color-text-muted)]">
              Verifying your email…
            </p>
          </div>
        )}

        {(state.status === 'verified' || state.status === 'already_verified') && (
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-8 space-y-4">
            <div className="text-4xl">✓</div>
            <h1 className="text-lg font-semibold text-[var(--color-text)]">
              Email verified
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              {state.status === 'already_verified'
                ? 'Your email was already verified.'
                : 'Your email address has been confirmed.'}
              {' '}You can now sign in.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 rounded-md bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Sign in
            </Link>
          </div>
        )}

        {state.status === 'error' && (
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-8 space-y-4">
            <h1 className="text-lg font-semibold text-[var(--color-text)]">
              Verification failed
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              {state.message}
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 text-sm font-medium text-[var(--color-primary)] underline underline-offset-2 hover:no-underline"
            >
              Back to sign in
            </Link>
          </div>
        )}

        {state.status === 'missing_token' && (
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-8 space-y-4">
            <h1 className="text-lg font-semibold text-[var(--color-text)]">
              Invalid link
            </h1>
            <p className="text-sm text-[var(--color-text-muted)]">
              This verification link is incomplete. Please use the link sent to
              your email, or request a new one from the sign-in page.
            </p>
            <Link
              to="/login"
              className="inline-block mt-2 text-sm font-medium text-[var(--color-primary)] underline underline-offset-2 hover:no-underline"
            >
              Back to sign in
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
