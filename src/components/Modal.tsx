import { useEffect, type ReactNode } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md';
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const width = size === 'sm' ? 'max-w-[420px]' : 'max-w-[520px]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${width} bg-[var(--color-bg-elevated)] rounded-lg shadow-[var(--shadow-lg)] border border-[var(--color-border)] overflow-hidden`}
      >
        <header className="px-5 pt-5 pb-3">
          <h2 className="text-base font-semibold text-[var(--color-text)]">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {description}
            </p>
          )}
        </header>
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}
