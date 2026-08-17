import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';

/**
 * Landing page for the password-reset email. The API's reset emails link to
 * `${PASSWORD_RESET_URL_BASE}?token=…`, which points at this route — this
 * page is the only place that token can be redeemed.
 */
export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await api('POST', '/api/auth/reset-password', {
        token,
        newPassword: password,
      });
      setDone(true);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Unable to reset password';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-[400px] w-full">
        <div className="text-center mb-8">
          <Link to="/" className="wordmark text-xl">
            Zovio
          </Link>
          <p className="text-sm text-[var(--color-text-muted)] mt-1.5">
            Choose a new password
          </p>
        </div>

        {!token ? (
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-6 text-center">
            <h1 className="text-base font-semibold text-[var(--color-text)]">
              Invalid link
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              This reset link is missing its token. Request a new one and use
              the link from the most recent email.
            </p>
            <p className="text-sm mt-4">
              <Link
                to="/forgot-password"
                className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] underline underline-offset-2"
              >
                Request a new reset link
              </Link>
            </p>
          </div>
        ) : done ? (
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-6 text-center">
            <h1 className="text-base font-semibold text-[var(--color-text)]">
              Password updated
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              Your password has been changed. Sign in with your new password —
              on the web here, or in the Zovio mobile app.
            </p>
            <div className="mt-4">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-md font-medium transition-colors text-sm px-4 py-2 bg-[var(--color-primary)] text-[var(--color-primary-contrast)] hover:bg-[var(--color-primary-hover)] active:bg-[var(--color-primary-active)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30"
              >
                Sign in
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-6 space-y-4"
            noValidate
          >
            <Field label="New password" htmlFor="password">
              <input
                id="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClasses}
                disabled={isSubmitting}
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                At least 6 characters.
              </p>
            </Field>

            <Field label="Confirm new password" htmlFor="confirm-password">
              <input
                id="confirm-password"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClasses}
                disabled={isSubmitting}
              />
            </Field>

            {error && (
              <div>
                <ErrorMessage message={error} />
                <p className="text-sm mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] underline underline-offset-2"
                  >
                    Link expired? Request a new one
                  </Link>
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Saving…' : 'Set new password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

const inputClasses =
  'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-60';

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
