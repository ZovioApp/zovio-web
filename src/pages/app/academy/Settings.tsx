import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  academiesApi,
  type AcademyMember,
  type AcademySummary,
} from '../../../lib/academies';
import { TIMEZONE_SUGGESTIONS, isValidTimezone } from '../../../lib/timezones';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { ErrorState } from '../../../components/ErrorState';
import { Button } from '../../../components/Button';

export default function Settings() {
  const { academyId } = useParams<{ academyId: string }>();
  const navigate = useNavigate();
  const [academy, setAcademy] = useState<AcademySummary | null>(null);
  const [members, setMembers] = useState<AcademyMember[] | null>(null);
  // Load and save errors are separate on purpose: a failed SAVE must render
  // inline and keep the form (and the user's input) mounted — only a failed
  // LOAD may replace the page.
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [tzError, setTzError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  // Danger-zone actions (leave / transfer / delete) render their own inline
  // error, separate from the settings form's save error.
  const [dangerError, setDangerError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    if (!academyId) return;
    setLoadError(null);
    Promise.all([academiesApi.get(academyId), academiesApi.members(academyId)])
      .then(([a, m]) => {
        setAcademy(a);
        setMembers(m);
      })
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : 'Failed to load'),
      );
  }, [academyId]);

  useEffect(load, [load]);

  useEffect(
    () => () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    },
    [],
  );

  if (loadError) return <ErrorState message={loadError} onRetry={load} />;
  if (!academy || !members || !academyId) return <LoadingScreen />;

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const timezone = String(form.get('timezone') ?? '').trim();

    setTzError(null);
    if (!isValidTimezone(timezone)) {
      setTzError('Enter a valid IANA timezone, e.g. Asia/Colombo.');
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const updated = await academiesApi.update(academyId, {
        name: String(form.get('name') ?? '').trim(),
        description: String(form.get('description') ?? ''),
        sport: String(form.get('sport') ?? ''),
        timezone,
        currency: String(form.get('currency') ?? '').trim().toUpperCase(),
      });
      setAcademy(updated);
      setSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const leave = async () => {
    if (
      !window.confirm(
        `Leave ${academy.name}? You'll lose access unless you're invited back.`,
      )
    ) {
      return;
    }
    setDangerError(null);
    setIsWorking(true);
    try {
      await academiesApi.leave(academyId);
      navigate('/app');
    } catch (err) {
      setDangerError(err instanceof Error ? err.message : 'Failed to leave');
      setIsWorking(false);
    }
  };

  const deleteOrg = async () => {
    if (
      !window.confirm(
        `Delete ${academy.name}? This cannot be undone. Every member loses access; sessions and payment history are kept for records.`,
      )
    ) {
      return;
    }
    setDangerError(null);
    setIsWorking(true);
    try {
      await academiesApi.remove(academyId);
      navigate('/app');
    } catch (err) {
      setDangerError(err instanceof Error ? err.message : 'Failed to delete');
      setIsWorking(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Academy settings
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Name, locale, and the default currency for new sessions.
        </p>
      </header>

      <form
        onSubmit={save}
        className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg p-6 space-y-4 max-w-[560px]"
      >
        <Field label="Name" name="name" defaultValue={academy.name} required />
        <Field
          label="Sport or focus"
          name="sport"
          defaultValue={academy.sport ?? ''}
        />
        <Field
          label="Description"
          name="description"
          defaultValue={academy.description ?? ''}
          textarea
        />
        <Field
          label="Timezone (IANA)"
          name="timezone"
          defaultValue={academy.timezone}
          required
          list="settings-tz-suggestions"
          error={tzError}
        />
        <datalist id="settings-tz-suggestions">
          {TIMEZONE_SUGGESTIONS.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
        <Field
          label="Currency (ISO 4217)"
          name="currency"
          defaultValue={academy.currency}
          required
        />

        {saveError && <ErrorMessage message={saveError} />}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" variant="primary" size="md" disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Save changes'}
          </Button>
          {saved && !isSaving && (
            <span className="text-xs text-[var(--color-success)]" role="status">
              Changes saved
            </span>
          )}
        </div>
      </form>

      <section className="bg-[var(--color-bg-elevated)] border border-[var(--color-error-subtle-border)] rounded-lg p-6 max-w-[560px] space-y-5">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-text)]">
            Danger zone
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {academy.role === 'primary_owner'
              ? 'Transferring or deleting this organization cannot be undone.'
              : 'Leaving this organization cannot be undone from here — you would need a fresh invitation to rejoin.'}
          </p>
        </div>

        {dangerError && <ErrorMessage message={dangerError} />}

        {academy.role === 'primary_owner' ? (
          <>
            <TransferOwnership
              academyId={academyId}
              members={members}
              isWorking={isWorking}
              setIsWorking={setIsWorking}
              setDangerError={setDangerError}
              onTransferred={load}
            />

            <div className="border-t border-[var(--color-border-subtle)] pt-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-[var(--color-text)]">
                  Delete organization
                </div>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  Requires every scheduled session to be cancelled or
                  completed first.
                </p>
              </div>
              <Button
                variant="danger"
                size="md"
                onClick={() => void deleteOrg()}
                disabled={isWorking}
              >
                Delete
              </Button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between gap-4">
            <div className="text-sm font-medium text-[var(--color-text)]">
              Leave organization
            </div>
            <Button
              variant="danger"
              size="md"
              onClick={() => void leave()}
              disabled={isWorking}
            >
              Leave
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function TransferOwnership({
  academyId,
  members,
  isWorking,
  setIsWorking,
  setDangerError,
  onTransferred,
}: {
  academyId: string;
  members: AcademyMember[];
  isWorking: boolean;
  setIsWorking: (v: boolean) => void;
  setDangerError: (v: string | null) => void;
  onTransferred: () => void;
}) {
  const eligible = members.filter(
    (m) => m.status === 'active' && m.userId && m.role !== 'primary_owner',
  );
  const [targetId, setTargetId] = useState(eligible[0]?.userId ?? '');

  const transfer = async () => {
    const target = eligible.find((m) => m.userId === targetId);
    if (!target) return;
    const name = target.user?.name ?? target.user?.email ?? 'this member';
    if (
      !window.confirm(
        `Make ${name} the primary owner? You'll be demoted to co-owner.`,
      )
    ) {
      return;
    }
    setDangerError(null);
    setIsWorking(true);
    try {
      await academiesApi.transferOwnership(academyId, targetId);
      onTransferred();
    } catch (err) {
      setDangerError(
        err instanceof Error ? err.message : 'Failed to transfer ownership',
      );
    } finally {
      setIsWorking(false);
    }
  };

  if (eligible.length === 0) {
    return (
      <div>
        <div className="text-sm font-medium text-[var(--color-text)]">
          Transfer ownership
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
          Invite a co-owner, coach, or athlete first — ownership can only
          transfer to an existing active member.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-sm font-medium text-[var(--color-text)] mb-1.5">
        Transfer ownership
      </div>
      <p className="text-xs text-[var(--color-text-muted)] mb-3">
        Hand primary ownership to another active member. You'll keep access
        as a co-owner.
      </p>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <select
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          className="flex-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
        >
          {eligible.map((m) => (
            <option key={m.id} value={m.userId ?? ''}>
              {m.user?.name ?? m.user?.email ?? 'Member'} ({roleLabel(m.role)})
            </option>
          ))}
        </select>
        <Button
          variant="secondary"
          size="md"
          onClick={() => void transfer()}
          disabled={isWorking}
        >
          Transfer
        </Button>
      </div>
    </div>
  );
}

function roleLabel(role: AcademyMember['role']): string {
  switch (role) {
    case 'owner':
      return 'Co-owner';
    case 'coach':
      return 'Coach';
    default:
      return 'Athlete';
  }
}

function Field({
  label,
  name,
  defaultValue,
  required,
  textarea,
  list,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  textarea?: boolean;
  list?: string;
  error?: string | null;
}) {
  const cls = `w-full rounded-md border ${error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'} bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20`;
  return (
    <label className="block">
      <span className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1.5">
        {label}
        {required && (
          <span className="text-[var(--color-error)] ml-0.5" aria-hidden>
            *
          </span>
        )}
      </span>
      {textarea ? (
        <textarea
          name={name}
          defaultValue={defaultValue}
          required={required}
          rows={3}
          className={`${cls} resize-none`}
        />
      ) : (
        <input
          type="text"
          name={name}
          defaultValue={defaultValue}
          required={required}
          list={list}
          className={cls}
        />
      )}
      {error && (
        <span className="block text-xs text-[var(--color-error)] mt-1">
          {error}
        </span>
      )}
    </label>
  );
}
