import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api, ApiError } from '../lib/api';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setError('Enter your email address');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await api('POST', '/api/auth/forgot-password', { email: trimmed });
      setSent(true);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Unable to send reset email';
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
            Reset your password
          </p>
        </div>

        {sent ? (
          <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-6 text-center">
            <h1 className="text-base font-semibold text-[var(--color-text)]">
              Check your email
            </h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-2">
              If an account exists for {email.trim()}, a reset link is on its
              way. The link expires in 1 hour.
            </p>
            <p className="text-sm mt-4">
              <Link
                to="/login"
                className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] underline underline-offset-2"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-6 space-y-4"
            noValidate
          >
            <p className="text-sm text-[var(--color-text-secondary)]">
              Enter the email you signed up with and we'll send you a link to
              choose a new password.
            </p>

            <Field label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClasses}
                disabled={isSubmitting}
              />
            </Field>

            {error && <ErrorMessage message={error} />}

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Sending…' : 'Send reset link'}
            </Button>

            <p className="text-center text-sm">
              <Link
                to="/login"
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] underline underline-offset-2"
              >
                Back to sign in
              </Link>
            </p>
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
