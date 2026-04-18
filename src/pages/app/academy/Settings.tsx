import { useEffect, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  academiesApi,
  type AcademySummary,
} from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';

export default function Settings() {
  const { academyId } = useParams<{ academyId: string }>();
  const [academy, setAcademy] = useState<AcademySummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!academyId) return;
    academiesApi
      .get(academyId)
      .then(setAcademy)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load'),
      );
  }, [academyId]);

  if (error) return <ErrorMessage message={error} />;
  if (!academy || !academyId) return <LoadingScreen />;

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!academy) return;
    setIsSaving(true);
    setError(null);
    try {
      const form = new FormData(e.currentTarget);
      const updated = await academiesApi.update(academyId, {
        name: String(form.get('name') ?? '').trim(),
        description: String(form.get('description') ?? ''),
        sport: String(form.get('sport') ?? ''),
        timezone: String(form.get('timezone') ?? ''),
        currency: String(form.get('currency') ?? ''),
      });
      setAcademy(updated);
      setSavedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Academy settings</h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          Name, locale, and default currency for new sessions.
        </p>
      </header>

      <form
        onSubmit={save}
        className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 space-y-5 max-w-[560px]"
      >
        <Field label="Name" name="name" defaultValue={academy.name} required />
        <Field
          label="Sport / focus"
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
          label="Timezone (IANA, e.g. Asia/Colombo or Australia/Sydney)"
          name="timezone"
          defaultValue={academy.timezone}
          required
        />
        <Field
          label="Currency (3-letter ISO, e.g. LKR, AUD)"
          name="currency"
          defaultValue={academy.currency}
          required
        />

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-[10px] bg-[var(--color-primary)] text-[var(--color-bg)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
          {savedAt && !isSaving && (
            <span className="text-xs text-[var(--color-primary)]">Saved</span>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  textarea,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  const cls =
    'w-full rounded-[10px] border border-white/10 bg-white/5 px-4 py-3 text-[15px] text-white outline-none transition-colors focus:border-[var(--color-primary)]';
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-[var(--color-text-secondary)] mb-2 tracking-wide uppercase">
        {label}
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
          className={cls}
        />
      )}
    </label>
  );
}
