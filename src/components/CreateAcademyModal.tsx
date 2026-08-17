import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from './Modal';
import { Button } from './Button';
import { ErrorMessage } from './ErrorMessage';
import { api, ApiError } from '../lib/api';
import type { AcademySummary } from '../lib/academies';
import { TIMEZONE_SUGGESTIONS } from '../lib/timezones';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (academy: AcademySummary) => void;
}

const CURRENCY_SUGGESTIONS = ['LKR', 'AUD', 'USD', 'GBP', 'INR'];

export function CreateAcademyModal({ open, onClose, onCreated }: Props) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await api<AcademySummary>('POST', '/api/academies', {
        name: String(form.get('name') ?? '').trim(),
        sport: String(form.get('sport') ?? '').trim() || undefined,
        timezone: String(form.get('timezone') ?? '').trim(),
        currency: String(form.get('currency') ?? '').trim().toUpperCase(),
      });
      onCreated?.(created);
      onClose();
      navigate(`/app/a/${created.id}/overview`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : 'Failed to create academy',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Create a new academy"
      description="You'll be the primary owner and can invite coaches, athletes, and co-owners after."
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Name" name="name" placeholder="Zovio Cricket Academy" required />
        <Field
          label="Sport or focus"
          name="sport"
          placeholder="Cricket, tuition, music…"
        />
        <Field
          label="Timezone"
          name="timezone"
          placeholder="Asia/Colombo"
          defaultValue="Asia/Colombo"
          required
          list="tz-suggestions"
        />
        <datalist id="tz-suggestions">
          {TIMEZONE_SUGGESTIONS.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
        <Field
          label="Currency"
          name="currency"
          placeholder="LKR"
          defaultValue="LKR"
          required
          list="cc-suggestions"
        />
        <datalist id="cc-suggestions">
          {CURRENCY_SUGGESTIONS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        {error && <ErrorMessage message={error} />}

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create academy'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface FieldProps {
  label: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  list?: string;
}

function Field({ label, name, placeholder, defaultValue, required, list }: FieldProps) {
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
      <input
        type="text"
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
        list={list}
        className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
      />
    </label>
  );
}
