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
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">{academy.name}</h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          {academy.sport ?? 'Academy'} · {academy.timezone} · {academy.currency}
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Today's sessions" value={stats.todaySessions} />
        <StatCard label="Upcoming sessions" value={stats.upcomingSessions} />
        <StatCard
          label="Attendance rate"
          value={`${stats.attendanceRate}%`}
        />
        <StatCard label="Members" value={stats.totalMembers} />
      </section>

      <section>
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-1">Payout mode</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-3">
            {academy.payoutMode === 'stripe_connect'
              ? 'Card payments enabled — charges land in your Stripe Connect account.'
              : 'Manual settlement. Switch to Stripe Connect in Settings → Payouts to take card payments.'}
          </p>
          <span
            className={`inline-block text-xs uppercase tracking-wide font-semibold px-3 py-1 rounded-full ${
              academy.payoutMode === 'stripe_connect'
                ? 'bg-[rgba(0,212,170,0.12)] text-[var(--color-primary)] border border-[rgba(0,212,170,0.3)]'
                : 'bg-[rgba(255,179,71,0.1)] text-[var(--color-warning)] border border-[rgba(255,179,71,0.3)]'
            }`}
          >
            {academy.payoutMode === 'stripe_connect'
              ? 'Stripe Connect'
              : 'Manual'}
          </span>
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1">
        {label}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}
