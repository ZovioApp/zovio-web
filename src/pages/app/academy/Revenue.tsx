import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  academiesApi,
  type RevenueReport,
} from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';

export default function Revenue() {
  const { academyId } = useParams<{ academyId: string }>();
  const [report, setReport] = useState<RevenueReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!academyId) return;
    academiesApi
      .revenue(academyId)
      .then(setReport)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load revenue'),
      );
  }, [academyId]);

  if (error) return <ErrorMessage message={error} />;
  if (!report) return <LoadingScreen />;

  const fmt = (n: number) =>
    `${n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${report.currency}`;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Revenue</h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          Paid enrolments only. Refunded and pending amounts are excluded.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="Total income" value={fmt(report.totalIncome)} />
        <StatCard
          label="From sessions"
          value={fmt(report.sessionIncome)}
        />
        <StatCard label="From events" value={fmt(report.eventIncome)} />
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">By coach</h2>
        {report.coachBreakdown.length === 0 ? (
          <EmptyRow label="No coach-led sessions have generated income yet." />
        ) : (
          <Table
            columns={['Coach', 'Sessions', 'Paid enrolments', 'Income']}
          >
            {report.coachBreakdown.map((c) => (
              <tr
                key={c.coachId}
                className="border-t border-[var(--color-border)]"
              >
                <td className="py-3 px-4">{c.coachName}</td>
                <td className="py-3 px-4">{c.sessionCount}</td>
                <td className="py-3 px-4">{c.paidEnrollmentCount}</td>
                <td className="py-3 px-4 font-semibold">{fmt(c.income)}</td>
              </tr>
            ))}
          </Table>
        )}

        <div className="mt-4 bg-[rgba(69,183,209,0.08)] border border-[rgba(69,183,209,0.3)] rounded-xl px-4 py-3 text-sm text-[var(--color-info)]">
          Coach payouts through Zovio are coming soon. Today these figures are
          an audit view — settle with your coaches outside the platform.
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">By session</h2>
        {report.sessionBreakdown.length === 0 ? (
          <EmptyRow label="No sessions yet." />
        ) : (
          <Table
            columns={['Date', 'Session', 'Coach', 'Paid / enrolled', 'Income']}
          >
            {report.sessionBreakdown.map((s) => (
              <tr
                key={s.sessionId}
                className="border-t border-[var(--color-border)]"
              >
                <td className="py-3 px-4 whitespace-nowrap">{s.date}</td>
                <td className="py-3 px-4">{s.title}</td>
                <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                  {s.coachName ?? '—'}
                </td>
                <td className="py-3 px-4">
                  {s.paidCount} / {s.enrolledCount}
                </td>
                <td className="py-3 px-4 font-semibold">{fmt(s.income)}</td>
              </tr>
            ))}
          </Table>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1">
        {label}
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function Table({
  columns,
  children,
}: {
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-x-auto">
      <table className="w-full text-sm min-w-[480px]">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                className="text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-semibold px-4 py-3"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return (
    <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl px-4 py-6 text-sm text-[var(--color-text-muted)] text-center">
      {label}
    </div>
  );
}
