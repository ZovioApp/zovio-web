import { NavLink, useParams } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useAcademies } from '../hooks/useAcademies';
import { isOwnerRole } from '../lib/academies';
import { AcademySwitcher } from './AcademySwitcher';

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { academies } = useAcademies();
  const { academyId } = useParams<{ academyId: string }>();

  const currentAcademy = academies.find((a) => a.id === academyId);
  const isOwner = currentAcademy
    ? isOwnerRole(currentAcademy.role)
    : false;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg-light)]">
        <div className="max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-4">
          <NavLink to="/app" className="brand-gradient text-xl font-bold">
            Zovio
          </NavLink>

          {academies.length > 0 && (
            <AcademySwitcher
              academies={academies}
              currentAcademyId={academyId}
            />
          )}

          <div className="flex-1" />

          <div className="flex items-center gap-4 text-sm">
            <span className="hidden sm:inline text-[var(--color-text-secondary)]">
              {user?.name}
            </span>
            <button
              type="button"
              onClick={() => void logout()}
              className="text-[var(--color-text-muted)] hover:text-white transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-[1200px] w-full mx-auto">
        {currentAcademy && isOwner && (
          <aside className="w-56 shrink-0 border-r border-[var(--color-border)] py-6 pr-4 hidden md:block">
            <nav className="flex flex-col gap-1">
              <SidebarLink to={`/app/a/${currentAcademy.id}/overview`}>
                Overview
              </SidebarLink>
              <SidebarLink to={`/app/a/${currentAcademy.id}/revenue`}>
                Revenue
              </SidebarLink>
              <SidebarLink to={`/app/a/${currentAcademy.id}/sessions`}>
                Sessions
              </SidebarLink>
              <div className="mt-4 mb-2 text-xs uppercase tracking-wide text-[var(--color-text-muted)] px-3">
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
            </nav>
          </aside>
        )}

        <main className="flex-1 px-6 py-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-[var(--color-card)] text-white'
            : 'text-[var(--color-text-secondary)] hover:text-white hover:bg-[var(--color-card)]/50'
        }`
      }
    >
      {children}
    </NavLink>
  );
}
