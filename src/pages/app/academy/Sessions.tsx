import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  academiesApi,
  type SessionSummary,
} from '../../../lib/academies';
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
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Sessions</h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          Read-only view. Create and edit sessions from the Zovio mobile app.
        </p>
      </header>

      {sessions.length === 0 ? (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl px-4 py-10 text-center text-[var(--color-text-muted)] text-sm">
          No sessions yet.
        </div>
      ) : (
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr>
                {[
                  'Date',
                  'Time',
                  'Title',
                  'Mode',
                  'Fee',
                  'Status',
                ].map((c) => (
                  <th
                    key={c}
                    className="text-left text-xs uppercase tracking-wide text-[var(--color-text-muted)] font-semibold px-4 py-3"
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
                  className="border-t border-[var(--color-border)]"
                >
                  <td className="py-3 px-4 whitespace-nowrap">{s.date}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {s.startTime} – {s.endTime}
                  </td>
                  <td className="py-3 px-4">{s.title}</td>
                  <td className="py-3 px-4">
                    <ModeBadge mode={s.paymentMode} />
                  </td>
                  <td className="py-3 px-4">
                    {parseFloat(s.fee) === 0
                      ? 'Free'
                      : `${s.fee} ${s.currency}`}
                  </td>
                  <td className="py-3 px-4">
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
      ? 'text-[var(--color-primary)] bg-[rgba(0,212,170,0.12)] border-[rgba(0,212,170,0.3)]'
      : mode === 'manual'
        ? 'text-[var(--color-warning)] bg-[rgba(255,179,71,0.1)] border-[rgba(255,179,71,0.3)]'
        : 'text-[var(--color-text-secondary)] bg-white/5 border-white/10';
  return (
    <span
      className={`text-xs uppercase tracking-wide font-semibold px-2 py-0.5 rounded border ${colour}`}
    >
      {label}
    </span>
  );
}

function StatusBadge({ status }: { status: SessionSummary['status'] }) {
  const colour =
    status === 'scheduled'
      ? 'text-[var(--color-info)] bg-[rgba(69,183,209,0.12)] border-[rgba(69,183,209,0.3)]'
      : status === 'completed'
        ? 'text-[var(--color-primary)] bg-[rgba(0,212,170,0.12)] border-[rgba(0,212,170,0.3)]'
        : 'text-[var(--color-error)] bg-[rgba(255,107,107,0.1)] border-[rgba(255,107,107,0.3)]';
  return (
    <span
      className={`text-xs uppercase tracking-wide font-semibold px-2 py-0.5 rounded border ${colour}`}
    >
      {status}
    </span>
  );
}
