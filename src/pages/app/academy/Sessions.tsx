import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { academiesApi, type SessionSummary } from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';

export default function Sessions() {
  const { academyId } = useParams<{ academyId: string }>();
  const [sessions, setSessions] = useState<SessionSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!academyId) return;
    academiesApi
      .sessions(academyId)
      .then(setSessions)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load'),
      );
  }, [academyId]);

  if (error) return <ErrorMessage message={error} />;
  if (!sessions) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Sessions
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Read-only. Create and edit sessions from the Zovio mobile app.
        </p>
      </header>

      {sessions.length === 0 ? (
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg px-4 py-10 text-center text-sm text-[var(--color-text-muted)]">
          No sessions yet.
        </div>
      ) : (
        <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr>
                {['Date', 'Time', 'Title', 'Mode', 'Fee', 'Status'].map((c) => (
                  <th
                    key={c}
                    className="text-left text-[11px] uppercase tracking-wider font-medium text-[var(--color-text-muted)] px-4 py-2.5"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-[var(--color-border-subtle)]"
                >
                  <td className="py-2.5 px-4 text-sm tnum text-[var(--color-text-secondary)] whitespace-nowrap">
                    {s.date}
                  </td>
                  <td className="py-2.5 px-4 text-sm tnum text-[var(--color-text-secondary)] whitespace-nowrap">
                    {s.startTime} – {s.endTime}
                  </td>
                  <td className="py-2.5 px-4 text-sm text-[var(--color-text)]">
                    {s.title}
                  </td>
                  <td className="py-2.5 px-4">
                    <ModeBadge mode={s.paymentMode} />
                  </td>
                  <td className="py-2.5 px-4 text-sm tnum text-[var(--color-text-secondary)]">
                    {parseFloat(s.fee) === 0
                      ? 'Free'
                      : `${s.fee} ${s.currency}`}
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ModeBadge({ mode }: { mode: SessionSummary['paymentMode'] }) {
  const label =
    mode === 'card' ? 'Card' : mode === 'manual' ? 'Manual' : 'Free';
  const colour =
    mode === 'card'
      ? 'bg-[var(--color-primary-subtle-bg)] text-[var(--color-primary-hover)] border-[var(--color-primary-subtle-border)]'
      : mode === 'manual'
        ? 'bg-[var(--color-warning-subtle-bg)] text-[var(--color-warning)] border-[var(--color-warning-subtle-border)]'
        : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]';
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border ${colour}`}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: SessionSummary['status'] }) {
  const colour =
    status === 'scheduled'
      ? 'bg-[var(--color-info-subtle-bg)] text-[var(--color-info)] border-[var(--color-info-subtle-border)]'
      : status === 'completed'
        ? 'bg-[var(--color-success-subtle-bg)] text-[var(--color-success)] border-[var(--color-success-subtle-border)]'
        : 'bg-[var(--color-error-subtle-bg)] text-[var(--color-error)] border-[var(--color-error-subtle-border)]';
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border ${colour}`}
    >
      {status}
    </span>
  );
}
