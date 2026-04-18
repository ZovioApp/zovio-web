import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../lib/api';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/app', { replace: true });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Unable to sign in';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-10">
      <div className="max-w-[420px] w-full">
        <div className="text-center mb-10">
          <Link to="/" className="brand-gradient text-4xl font-bold inline-block">
            Zovio
          </Link>
          <p className="text-[var(--color-text-muted)] text-sm mt-2">
            Sign in to manage your academy
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 space-y-5"
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

          {error && (
            <p
              role="alert"
              className="text-[var(--color-error)] text-sm bg-[rgba(255,107,107,0.1)] border border-[rgba(255,107,107,0.3)] rounded-[10px] px-3 py-2"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-[10px] bg-[var(--color-primary)] text-[var(--color-bg)] py-3.5 text-[15px] font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-default"
          >
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-[var(--color-text-muted)] mt-6">
          Coaches and athletes — please use the Zovio mobile app.
        </p>
      </div>
    </div>
  );
}

const inputClasses =
  'w-full rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[var(--color-primary)] disabled:opacity-60';

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
        className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2 tracking-wide uppercase"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
