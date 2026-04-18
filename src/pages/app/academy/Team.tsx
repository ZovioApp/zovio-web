import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  academiesApi,
  type AcademyMember,
  type AcademyRole,
} from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { api } from '../../../lib/api';

export default function Team() {
  const { academyId } = useParams<{ academyId: string }>();
  const [members, setMembers] = useState<AcademyMember[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!academyId) return;
    academiesApi
      .members(academyId)
      .then(setMembers)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load team'),
      );
  }, [academyId]);

  useEffect(load, [load]);

  if (error) return <ErrorMessage message={error} />;
  if (!members || !academyId) return <LoadingScreen />;

  const active = members.filter((m) => m.status === 'active');
  const pending = members.filter((m) => m.status === 'pending');

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold mb-1">Team</h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          Co-owners, coaches, and athletes for this academy.
        </p>
      </header>

      <InviteCard academyId={academyId} onInvited={load} />

      <MemberSection
        title={`Active members (${active.length})`}
        members={active}
      />

      {pending.length > 0 && (
        <MemberSection
          title={`Pending invitations (${pending.length})`}
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

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      await api('POST', `/api/academies/${academyId}/invite`, { email, role });
      setSuccess(`Invited ${email} as ${role.replace('_', ' ')}.`);
      setEmail('');
      onInvited();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invite failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-1">Invite a member</h2>
      <p className="text-sm text-[var(--color-text-muted)] mb-5">
        Co-owner invitations can only be sent by the primary owner.
      </p>

      <form
        onSubmit={submit}
        className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
      >
        <label className="flex-1">
          <span className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2 tracking-wide uppercase">
            Email
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white outline-none focus:border-[var(--color-primary)]"
          />
        </label>
        <label>
          <span className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2 tracking-wide uppercase">
            Role
          </span>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as 'owner' | 'coach' | 'athlete')
            }
            className="w-full sm:w-auto rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white outline-none"
          >
            <option value="athlete">Athlete</option>
            <option value="coach">Coach</option>
            <option value="owner">Co-owner</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-[10px] bg-[var(--color-primary)] text-[var(--color-bg)] px-5 py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending…' : 'Send invite'}
        </button>
      </form>

      {error && <div className="mt-3"><ErrorMessage message={error} /></div>}
      {success && (
        <p className="mt-3 text-sm text-[var(--color-primary)]">{success}</p>
      )}
    </section>
  );
}

function MemberSection({
  title,
  members,
}: {
  title: string;
  members: AcademyMember[];
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden">
        {members.length === 0 ? (
          <p className="px-4 py-6 text-sm text-[var(--color-text-muted)] text-center">
            No members.
          </p>
        ) : (
          <ul>
            {members.map((m) => (
              <li
                key={m.id}
                className="border-t border-[var(--color-border)] first:border-t-0 px-5 py-4 flex items-center gap-4"
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-[var(--color-bg)]"
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
                  <div className="text-sm font-medium truncate">
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
  const label = role.replace('_', ' ');
  const colour =
    role === 'primary_owner'
      ? 'text-[var(--color-primary)] bg-[rgba(0,212,170,0.12)] border-[rgba(0,212,170,0.3)]'
      : role === 'owner'
        ? 'text-[var(--color-info)] bg-[rgba(69,183,209,0.12)] border-[rgba(69,183,209,0.3)]'
        : role === 'coach'
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
