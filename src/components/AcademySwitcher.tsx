import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  type AcademySummary,
  isOwnerRole,
} from '../lib/academies';

interface Props {
  academies: AcademySummary[];
  currentAcademyId: string | undefined;
}

export function AcademySwitcher({ academies, currentAcademyId }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const current =
    academies.find((a) => a.id === currentAcademyId) ?? academies[0];

  if (!current) return null;

  const selectable = academies.filter((a) => isOwnerRole(a.role));

  const pick = (academy: AcademySummary) => {
    setOpen(false);
    if (isOwnerRole(academy.role)) {
      navigate(`/app/a/${academy.id}/overview`);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg bg-[var(--color-card)] px-3 py-1.5 text-sm text-white border border-[var(--color-border)] hover:border-white/20 transition-colors"
      >
        <span className="font-medium truncate max-w-[160px]">
          {current.name}
        </span>
        <span className="text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
          {current.role.replace('_', ' ')}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className="text-[var(--color-text-muted)]"
          aria-hidden
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-72 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-light)] shadow-2xl overflow-hidden z-50">
          <ul className="max-h-[320px] overflow-y-auto py-1">
            {academies.map((a) => {
              const owner = isOwnerRole(a.role);
              const isCurrent = a.id === current.id;
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => pick(a)}
                    disabled={!owner}
                    className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                      owner
                        ? 'hover:bg-[var(--color-card)] cursor-pointer'
                        : 'opacity-50 cursor-not-allowed'
                    } ${isCurrent ? 'bg-[var(--color-card)]' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {a.name}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                        {a.role.replace('_', ' ')}
                        {!owner && ' · mobile only'}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          {selectable.length === 0 && (
            <p className="px-4 py-3 text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)]">
              Web access is owner-only in v1.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
