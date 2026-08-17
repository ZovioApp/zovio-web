import { useState, type ReactNode } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAcademies } from '../hooks/useAcademies';
import { isOwnerRole } from '../lib/academies';
import { AcademySwitcher } from './AcademySwitcher';
import { Button } from './Button';
import { CreateAcademyModal } from './CreateAcademyModal';

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { academies, reload } = useAcademies();
  const { academyId } = useParams<{ academyId: string }>();
  const [createOpen, setCreateOpen] = useState(false);

  const currentAcademy = academies.find((a) => a.id === academyId);
  const isOwner = currentAcademy ? isOwnerRole(currentAcademy.role) : false;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-elevated)]">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center gap-4">
          <NavLink to="/app" className="wordmark text-lg">
            Zovio
          </NavLink>

          {academies.length > 0 && (
            <>
              <div className="h-5 w-px bg-[var(--color-border)]" aria-hidden />
              <AcademySwitcher
                academies={academies}
                currentAcademyId={academyId}
              />
            </>
          )}

          <div className="flex-1" />

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setCreateOpen(true)}
          >
            + New academy
          </Button>

          <div className="h-5 w-px bg-[var(--color-border)]" aria-hidden />

          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-[var(--color-text-secondary)]">
              {user?.name}
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1280px] w-full mx-auto">
        {currentAcademy && isOwner && (
          <aside className="w-56 shrink-0 border-r border-[var(--color-border)] py-6 pr-3 hidden md:block">
            <nav className="flex flex-col gap-0.5">
              <SidebarLink to={`/app/a/${currentAcademy.id}/overview`}>
                Overview
              </SidebarLink>
              <SidebarLink to={`/app/a/${currentAcademy.id}/revenue`}>
                Revenue
              </SidebarLink>
              <SidebarLink to={`/app/a/${currentAcademy.id}/sessions`}>
                Sessions
              </SidebarLink>
              <div className="mt-5 mb-1.5 text-[11px] uppercase tracking-wider font-medium text-[var(--color-text-muted)] px-3">
                Settings
              </div>
              <SidebarLink to={`/app/a/${currentAcademy.id}/settings`}>
                Academy
              </SidebarLink>
              <SidebarLink to={`/app/a/${currentAcademy.id}/settings/team`}>
                Team
              </SidebarLink>
              <SidebarLink
                to={`/app/a/${currentAcademy.id}/settings/payouts`}
              >
                Payouts
              </SidebarLink>
              <SidebarLink
                to={`/app/a/${currentAcademy.id}/settings/subscription`}
              >
                Subscription
              </SidebarLink>
            </nav>
          </aside>
        )}

        <main className="flex-1 px-6 py-8 min-w-0">{children}</main>
      </div>

      <CreateAcademyModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => void reload()}
      />
    </div>
  );
}

function SidebarLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-1.5 rounded-md text-sm transition-colors ${
          isActive
            ? 'bg-[var(--color-primary-subtle-bg)] text-[var(--color-primary-hover)] font-medium'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text)]'
        }`
      }
    >
      {children}
    </NavLink>
  );
}
