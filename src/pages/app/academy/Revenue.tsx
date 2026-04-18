import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { academiesApi, type RevenueReport } from '../../../lib/academies';
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
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Revenue
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Paid enrolments only. Refunded and pending amounts are excluded.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Total income" value={fmt(report.totalIncome)} />
        <StatCard label="From sessions" value={fmt(report.sessionIncome)} />
        <StatCard label="From events" value={fmt(report.eventIncome)} />
      </section>

      <section className="space-y-3">
        <SectionHeader
          title="By coach"
          caption="Aggregated from sessions each coach conducted."
        />
        {report.coachBreakdown.length === 0 ? (
          <EmptyRow label="No coach-led sessions have generated income yet." />
        ) : (
          <DataTable
            columns={[
              { label: 'Coach', align: 'left' },
              { label: 'Sessions', align: 'right' },
              { label: 'Paid enrolments', align: 'right' },
              { label: 'Income', align: 'right' },
            ]}
          >
            {report.coachBreakdown.map((c) => (
              <tr
                key={c.coachId}
                className="border-t border-[var(--color-border-subtle)]"
              >
                <td className="py-2.5 px-4 text-sm text-[var(--color-text)]">
                  {c.coachName}
                </td>
                <td className="py-2.5 px-4 text-sm text-right tnum text-[var(--color-text-secondary)]">
                  {c.sessionCount}
                </td>
                <td className="py-2.5 px-4 text-sm text-right tnum text-[var(--color-text-secondary)]">
                  {c.paidEnrollmentCount}
                </td>
                <td className="py-2.5 px-4 text-sm text-right tnum font-medium text-[var(--color-text)]">
                  {fmt(c.income)}
                </td>
              </tr>
            ))}
          </DataTable>
        )}

        <div className="rounded-md bg-[var(--color-info-subtle-bg)] border border-[var(--color-info-subtle-border)] px-3 py-2.5 text-xs text-[var(--color-info)]">
          Coach payouts through Zovio are coming soon. These figures are an
          audit view — settle off-platform for now.
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeader title="By session" />
        {report.sessionBreakdown.length === 0 ? (
          <EmptyRow label="No sessions yet." />
        ) : (
          <DataTable
            columns={[
              { label: 'Date', align: 'left' },
              { label: 'Session', align: 'left' },
              { label: 'Coach', align: 'left' },
              { label: 'Paid / enrolled', align: 'right' },
              { label: 'Income', align: 'right' },
            ]}
          >
            {report.sessionBreakdown.map((s) => (
              <tr
                key={s.sessionId}
                className="border-t border-[var(--color-border-subtle)]"
              >
                <td className="py-2.5 px-4 text-sm tnum text-[var(--color-text-secondary)] whitespace-nowrap">
                  {s.date}
                </td>
                <td className="py-2.5 px-4 text-sm text-[var(--color-text)]">
                  {s.title}
                </td>
                <td className="py-2.5 px-4 text-sm text-[var(--color-text-secondary)]">
                  {s.coachName ?? '—'}
                </td>
                <td className="py-2.5 px-4 text-sm text-right tnum text-[var(--color-text-secondary)]">
                  {s.paidCount} / {s.enrolledCount}
                </td>
                <td className="py-2.5 px-4 text-sm text-right tnum font-medium text-[var(--color-text)]">
                  {fmt(s.income)}
                </td>
              </tr>
            ))}
          </DataTable>
        )}
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  caption,
}: {
  title: string;
  caption?: string;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold text-[var(--color-text)]">
        {title}
      </h2>
      {caption && (
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          {caption}
        </p>
      )}
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
    <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-3.5">
      <div className="text-[11px] uppercase tracking-wider font-medium text-[var(--color-text-muted)] mb-1.5">
        {label}
      </div>
      <div className="text-xl font-semibold tnum text-[var(--color-text)]">
        {value}
      </div>
    </div>
  );
}

function DataTable({
  columns,
  children,
}: {
  columns: { label: string; align: 'left' | 'right' }[];
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg overflow-x-auto">
      <table className="w-full min-w-[520px]">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.label}
                className={`text-[11px] uppercase tracking-wider font-medium text-[var(--color-text-muted)] px-4 py-2.5 ${
                  c.align === 'right' ? 'text-right' : 'text-left'
                }`}
              >
                {c.label}
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
    <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-8 text-sm text-[var(--color-text-muted)] text-center">
      {label}
    </div>
  );
}
