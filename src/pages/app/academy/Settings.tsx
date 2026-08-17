import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import {
  academiesApi,
  type AcademySummary,
} from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { Button } from '../../../components/Button';

export default function Settings() {
  const { academyId } = useParams<{ academyId: string }>();
  const [academy, setAcademy] = useState<AcademySummary | null>(null);
  // Load and save errors are separate on purpose: a failed SAVE must render
  // inline and keep the form (and the user's input) mounted — only a failed
  // LOAD may replace the page.
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!academyId) return;
    academiesApi
      .get(academyId)
      .then(setAcademy)
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : 'Failed to load'),
      );
  }, [academyId]);

  useEffect(
    () => () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    },
    [],
  );

  if (loadError) return <ErrorMessage message={loadError} />;
  if (!academy || !academyId) return <LoadingScreen />;

  const save = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const form = new FormData(e.currentTarget);
      const updated = await academiesApi.update(academyId, {
        name: String(form.get('name') ?? '').trim(),
        description: String(form.get('description') ?? ''),
        sport: String(form.get('sport') ?? ''),
        timezone: String(form.get('timezone') ?? '').trim(),
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
        />
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
    'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20';
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
          className={cls}
        />
      )}
    </label>
  );
}
