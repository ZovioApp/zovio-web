import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: '\u{1F3C3}',
    title: 'Academy Management',
    description:
      'Create academies for sports, tuition, or any coaching — invite staff and students with role-based access.',
  },
  {
    icon: '\u{1F4C5}',
    title: 'Session Scheduling',
    description:
      'Schedule recurring classes and sessions with capacity limits and flexible fees.',
  },
  {
    icon: '\u{2705}',
    title: 'Attendance Tracking',
    description:
      'Mark attendance, auto-charge fees for attended sessions, refund absences.',
  },
  {
    icon: '\u{1F4B0}',
    title: 'Payments & Payouts',
    description:
      'Collect session fees with built-in Stripe Connect payouts — per-academy, per-currency.',
  },
];

export default function Landing() {
  const [submitted, setSubmitted] = useState(false);

  const handleNotify = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-5 py-10 overflow-hidden">
      <div className="absolute top-[-200px] left-[-100px] w-[600px] h-[600px] rounded-full bg-[var(--color-primary)] opacity-15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-100px] w-[600px] h-[600px] rounded-full bg-[var(--color-accent)] opacity-15 blur-[120px] pointer-events-none" />

      <main className="relative z-10 max-w-[640px] w-full text-center">
        <h1 className="brand-gradient text-5xl font-bold tracking-tight mb-2">
          Zovio
        </h1>
        <p className="text-[var(--color-text-secondary)] text-lg mb-12">
          Academy &amp; Class Management
        </p>

        <span className="inline-block text-xs font-semibold tracking-[0.5px] uppercase text-[var(--color-primary)] bg-[rgba(0,212,170,0.1)] border border-[rgba(0,212,170,0.3)] rounded-full px-4 py-1.5 mb-8">
          Coming Soon
        </span>

        <h2 className="text-4xl font-bold leading-tight mb-5">
          Run your academy<br />
          <span className="text-[var(--color-primary)]">like a pro</span>
        </h2>

        <p className="text-[var(--color-text-secondary)] text-[17px] leading-relaxed mb-10">
          Whether it's sports coaching, tuition classes, or any training academy —
          schedule sessions, track attendance, and handle payments, all in one app.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left mb-12">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white/5 border border-white/10 rounded-xl p-5"
            >
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-[15px] font-semibold mb-1">{f.title}</div>
              <div className="text-[13px] text-[var(--color-text-muted)] leading-snug">
                {f.description}
              </div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <p className="text-[15px] text-[var(--color-text-muted)] mb-4">
            Get notified when we launch
          </p>
          <form
            onSubmit={handleNotify}
            className="flex flex-col sm:flex-row gap-2 max-w-[400px] mx-auto"
          >
            <input
              type="email"
              required
              disabled={submitted}
              placeholder="you@email.com"
              className="flex-1 rounded-[10px] border border-white/10 bg-white/5 px-[18px] py-[14px] text-[15px] outline-none transition-colors focus:border-[var(--color-primary)] disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={submitted}
              className="rounded-[10px] bg-[var(--color-primary)] text-[var(--color-bg)] px-6 py-[14px] text-[15px] font-semibold whitespace-nowrap hover:opacity-90 disabled:opacity-50 disabled:cursor-default"
            >
              {submitted ? 'Done!' : 'Notify Me'}
            </button>
          </form>
          {submitted && (
            <p className="text-[var(--color-primary)] text-sm mt-3">
              We'll let you know when Zovio launches!
            </p>
          )}
        </div>

        <p className="text-xs text-[var(--color-text-muted)]">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-[var(--color-primary)] hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="text-xs text-[var(--color-text-muted)] mt-12">
          &copy; 2026 Zovio. All rights reserved.
        </p>
      </main>
    </div>
  );
}
