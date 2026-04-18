import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type AcademySummary, isOwnerRole } from '../lib/academies';

interface Props {
  academies: AcademySummary[];
  currentAcademyId: string | undefined;
}

export function AcademySwitcher({ academies, currentAcademyId }: Props) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClickAway = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickAway);
    return () => document.removeEventListener('mousedown', onClickAway);
  }, [open]);

  const current =
    academies.find((a) => a.id === currentAcademyId) ?? academies[0];
  if (!current) return null;

  const pick = (academy: AcademySummary) => {
    setOpen(false);
    if (isOwnerRole(academy.role)) {
      navigate(`/app/a/${academy.id}/overview`);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] transition-colors"
      >
        <span className="font-medium truncate max-w-[180px]">
          {current.name}
        </span>
        <span className="text-[11px] uppercase tracking-wider text-[var(--color-text-muted)]">
          {humanRole(current.role)}
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className="text-[var(--color-text-muted)]"
          aria-hidden
        >
          <path
            d="M2.5 3.75L5 6.25L7.5 3.75"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 w-[300px] rounded-md border border-[var(--color-border)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-lg)] overflow-hidden z-50">
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
                    className={`w-full text-left px-3 py-2 flex items-center gap-3 transition-colors ${
                      owner
                        ? 'hover:bg-[var(--color-bg-subtle)] cursor-pointer'
                        : 'opacity-60 cursor-not-allowed'
                    } ${isCurrent ? 'bg-[var(--color-bg-subtle)]' : ''}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[var(--color-text)] truncate">
                        {a.name}
                      </div>
                      <div className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                        {humanRole(a.role)}
                        {!owner && ' · mobile only'}
                      </div>
                    </div>
                    {isCurrent && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="text-[var(--color-primary)]"
                        aria-hidden
                      >
                        <path
                          d="M11.5 4L5.5 10L2.5 7"
                          stroke="currentColor"
                          strokeWidth="1.75"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function humanRole(r: AcademySummary['role']): string {
  switch (r) {
    case 'primary_owner':
      return 'Primary owner';
    case 'owner':
      return 'Co-owner';
    case 'coach':
      return 'Coach';
    case 'athlete':
      return 'Athlete';
  }
}
