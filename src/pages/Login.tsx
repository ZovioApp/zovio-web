import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api, ApiError } from '../lib/api';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setUnverifiedEmail(null);
    setResendSent(false);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/app', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(email);
      } else {
        const message =
          err instanceof ApiError ? err.message : 'Unable to sign in';
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!unverifiedEmail || isResending) return;
    setIsResending(true);
    try {
      await api('POST', '/api/auth/resend-verification', {
        email: unverifiedEmail,
      });
      setResendSent(true);
    } catch {
      setResendSent(true);
    } finally {
      setIsResending(false);
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
            Sign in to manage your academy
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg shadow-[var(--shadow-sm)] p-6 space-y-4"
          noValidate
        >
          <Field label="Email" htmlFor="email">
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
            />
          </Field>

          {error && <ErrorMessage message={error} />}

          {unverifiedEmail && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-medium">Email not verified</p>
              <p className="mt-0.5 text-amber-700">
                Check your inbox for a verification link, or request a new one.
              </p>
              {resendSent ? (
                <p className="mt-2 font-medium text-amber-900">
                  Verification email sent — check your inbox.
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="mt-2 font-medium underline underline-offset-2 hover:no-underline disabled:opacity-60"
                >
                  {isResending ? 'Sending…' : 'Resend verification email'}
                </button>
              )}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-5">
          Coaches and athletes — please use the Zovio mobile app.
        </p>
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
