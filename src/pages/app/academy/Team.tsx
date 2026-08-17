import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  academiesApi,
  type AcademyMember,
  type AcademyRole,
} from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { ErrorState } from '../../../components/ErrorState';
import { Button } from '../../../components/Button';
import { api } from '../../../lib/api';

export default function Team() {
  const { academyId } = useParams<{ academyId: string }>();
  const [members, setMembers] = useState<AcademyMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!academyId) return;
    setError(null);
    academiesApi
      .members(academyId)
      .then(setMembers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load team'),
      );
  }, [academyId]);

  useEffect(load, [load]);

  if (error && !members) return <ErrorState message={error} onRetry={load} />;
  if (!members || !academyId) return <LoadingScreen />;

  const active = members.filter((m) => m.status === 'active');
  const pending = members.filter((m) => m.status === 'pending');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Team
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Co-owners, coaches, and athletes for this academy.
        </p>
      </header>

      <InviteCard academyId={academyId} onInvited={load} />

      <MemberSection
        title="Active members"
        count={active.length}
        members={active}
      />

      {pending.length > 0 && (
        <MemberSection
          title="Pending invitations"
          count={pending.length}
          members={pending}
        />
      )}
    </div>
  );
}

function InviteCard({
  academyId,
  onInvited,
}: {
  academyId: string;
  onInvited: () => void;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'owner' | 'coach' | 'athlete'>('athlete');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await api('POST', `/api/academies/${academyId}/invite`, { email, role });
      setSuccess(`Invited ${email}.`);
      setEmail('');
      onInvited();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invite failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg p-5">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-[var(--color-text)]">
          Invite a member
        </h2>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Co-owner invitations require primary-owner rights.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="flex flex-col sm:flex-row gap-3 sm:items-end"
      >
        <label className="flex-1">
          <span className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </label>
        <label>
          <span className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
            Role
          </span>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as 'owner' | 'coach' | 'athlete')
            }
            className="w-full sm:w-auto rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
          >
            <option value="athlete">Athlete</option>
            <option value="coach">Coach</option>
            <option value="owner">Co-owner</option>
          </select>
        </label>
        <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send invite'}
        </Button>
      </form>

      {error && (
        <div className="mt-3">
          <ErrorMessage message={error} />
        </div>
      )}
      {success && (
        <p className="mt-3 text-xs text-[var(--color-success)]">{success}</p>
      )}
    </section>
  );
}

function MemberSection({
  title,
  count,
  members,
}: {
  title: string;
  count: number;
  members: AcademyMember[];
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-2">
        <h2 className="text-base font-semibold text-[var(--color-text)]">
          {title}
        </h2>
        <span className="text-xs text-[var(--color-text-muted)] tnum">
          {count}
        </span>
      </div>
      <div className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg overflow-hidden">
        {members.length === 0 ? (
          <p className="px-4 py-6 text-sm text-[var(--color-text-muted)] text-center">
            No members.
          </p>
        ) : (
          <ul>
            {members.map((m) => (
              <li
                key={m.id}
                className="border-t border-[var(--color-border-subtle)] first:border-t-0 px-5 py-3.5 flex items-center gap-3"
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
                  style={{
                    backgroundColor:
                      m.user?.avatarColor ?? 'var(--color-primary)',
                  }}
                >
                  {(m.user?.name ?? m.invitedEmail ?? '?')
                    .charAt(0)
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--color-text)] truncate">
                    {m.user?.name ?? m.invitedEmail ?? 'Pending user'}
                  </div>
                  <div className="text-xs text-[var(--color-text-muted)] truncate">
                    {m.user?.email ?? m.invitedEmail}
                  </div>
                </div>
                <RoleBadge role={m.role} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function RoleBadge({ role }: { role: AcademyRole }) {
  const { label, colour } =
    role === 'primary_owner'
      ? {
          label: 'Primary owner',
          colour:
            'bg-[var(--color-primary-subtle-bg)] text-[var(--color-primary-hover)] border-[var(--color-primary-subtle-border)]',
        }
      : role === 'owner'
        ? {
            label: 'Co-owner',
            colour:
              'bg-[var(--color-info-subtle-bg)] text-[var(--color-info)] border-[var(--color-info-subtle-border)]',
          }
        : role === 'coach'
          ? {
              label: 'Coach',
              colour:
                'bg-[var(--color-warning-subtle-bg)] text-[var(--color-warning)] border-[var(--color-warning-subtle-border)]',
            }
          : {
              label: 'Athlete',
              colour:
                'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
            };
  return (
    <span
      className={`shrink-0 inline-flex items-center text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded border ${colour}`}
    >
      {label}
    </span>
  );
}
