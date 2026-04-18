import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  academiesApi,
  type AcademySummary,
  type DashboardStats,
} from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';

export default function Overview() {
  const { academyId } = useParams<{ academyId: string }>();
  const [academy, setAcademy] = useState<AcademySummary | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!academyId) return;
    Promise.all([academiesApi.get(academyId), academiesApi.stats(academyId)])
      .then(([a, s]) => {
        setAcademy(a);
        setStats(s);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load'),
      );
  }, [academyId]);

  if (error) return <ErrorMessage message={error} />;
  if (!academy || !stats) return <LoadingScreen />;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          {academy.name}
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 tnum">
          {academy.sport ?? 'Academy'} · {academy.timezone} · {academy.currency}
        </p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Today" value={stats.todaySessions} suffix="sessions" />
        <StatCard
          label="Upcoming"
          value={stats.upcomingSessions}
          suffix="sessions"
        />
        <StatCard
          label="Attendance"
          value={`${stats.attendanceRate}%`}
        />
        <StatCard label="Members" value={stats.totalMembers} />
      </section>

      <section>
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg p-5 max-w-[560px]">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <div className="text-[11px] uppercase tracking-wider font-medium text-[var(--color-text-muted)] mb-1">
                Payout mode
              </div>
              <h2 className="text-base font-semibold text-[var(--color-text)]">
                {academy.payoutMode === 'stripe_connect'
                  ? 'Stripe Connect'
                  : 'Manual settlement'}
              </h2>
            </div>
            <PayoutBadge mode={academy.payoutMode} />
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {academy.payoutMode === 'stripe_connect'
              ? 'Card payments from athletes are routed to your connected Stripe account.'
              : 'Platform tracks enrolments and attendance; you collect fees off-platform. Switch in Settings → Payouts.'}
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-3.5">
      <div className="text-[11px] uppercase tracking-wider font-medium text-[var(--color-text-muted)] mb-1.5">
        {label}
      </div>
      <div className="text-2xl font-semibold tnum text-[var(--color-text)]">
        {value}
        {suffix && (
          <span className="text-xs font-normal text-[var(--color-text-muted)] ml-1">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function PayoutBadge({ mode }: { mode: 'manual' | 'stripe_connect' }) {
  if (mode === 'stripe_connect') {
    return (
      <span className="inline-flex items-center text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-success-subtle-bg)] text-[var(--color-success)] border border-[var(--color-success-subtle-border)]">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
      Manual
    </span>
  );
}
