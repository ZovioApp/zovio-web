import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  academiesApi,
  payoutsApi,
  type AcademySummary,
  type PayoutStatus,
} from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { ErrorState } from '../../../components/ErrorState';
import { Button } from '../../../components/Button';

export default function Payouts() {
  const { academyId } = useParams<{ academyId: string }>();
  const [academy, setAcademy] = useState<AcademySummary | null>(null);
  const [status, setStatus] = useState<PayoutStatus | null>(null);
  // Load failures replace the page (with retry); action failures render
  // inline so the page and its buttons stay usable.
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const load = useCallback(() => {
    if (!academyId) return;
    setLoadError(null);
    Promise.all([academiesApi.get(academyId), payoutsApi.status(academyId)])
      .then(([a, s]) => {
        setAcademy(a);
        setStatus(s);
      })
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : 'Failed to load'),
      );
  }, [academyId]);

  useEffect(load, [load]);

  if (loadError && !status) {
    return <ErrorState message={loadError} onRetry={load} />;
  }
  if (!status || !academy || !academyId) return <LoadingScreen />;

  const isPrimaryOwner = academy.role === 'primary_owner';

  const onboard = async () => {
    setActionError(null);
    setIsWorking(true);
    try {
      const res = await payoutsApi.onboard(academyId);
      window.location.assign(res.url);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Onboarding failed');
      setIsWorking(false);
    }
  };

  const unlink = async () => {
    // Destructive: turns off the academy's card-payment rail.
    if (
      !window.confirm(
        'Switch to manual settlement? Students will no longer pay through the platform until Stripe is reconnected.',
      )
    ) {
      return;
    }
    setActionError(null);
    setIsWorking(true);
    try {
      await payoutsApi.unlink(academyId);
      load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Unlink failed');
    } finally {
      setIsWorking(false);
    }
  };

  const activeConnect =
    status.payoutMode === 'stripe_connect' && status.onboardingComplete;
  const pendingConnect =
    status.payoutMode === 'stripe_connect' && !status.onboardingComplete;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Payouts
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Connect a Stripe account so Zovio can route paid session fees to you.
          Only the primary owner can change this.
        </p>
      </header>

      <section className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg p-6 max-w-[560px]">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider font-medium text-[var(--color-text-muted)] mb-1">
              Current mode
            </div>
            <div className="text-xl font-semibold text-[var(--color-text)]">
              {status.payoutMode === 'stripe_connect'
                ? 'Stripe Connect'
                : 'Manual settlement'}
            </div>
          </div>
          <StatusBadge
            activeConnect={activeConnect}
            pendingConnect={pendingConnect}
          />
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] mb-5">
          {activeConnect
            ? 'Card payments from students are routed to your connected Stripe account, net of Zovio platform fees.'
            : pendingConnect
              ? 'A Stripe account is linked, but onboarding is not complete. Finish it to enable card charges.'
              : 'This academy runs on manual settlement. Enrolments and attendance still work — students just don\u2019t pay through the platform.'}
        </p>

        {actionError && (
          <div className="mb-4">
            <ErrorMessage message={actionError} />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => void onboard()}
            disabled={isWorking || !isPrimaryOwner}
            title={
              isPrimaryOwner
                ? undefined
                : 'Only the primary owner can change this.'
            }
          >
            {isWorking
              ? 'Working…'
              : status.stripeConnectedAccountId
                ? activeConnect
                  ? 'Manage Stripe account'
                  : 'Finish Stripe onboarding'
                : 'Connect with Stripe'}
          </Button>

          {status.stripeConnectedAccountId && (
            <Button
              variant="secondary"
              size="md"
              onClick={() => void unlink()}
              disabled={isWorking || !isPrimaryOwner}
              title={
                isPrimaryOwner
                  ? undefined
                  : 'Only the primary owner can change this.'
              }
            >
              Switch to manual
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({
  activeConnect,
  pendingConnect,
}: {
  activeConnect: boolean;
  pendingConnect: boolean;
}) {
  const { label, colour } = activeConnect
    ? {
        label: 'Active',
        colour:
          'bg-[var(--color-success-subtle-bg)] text-[var(--color-success)] border-[var(--color-success-subtle-border)]',
      }
    : pendingConnect
      ? {
          label: 'Onboarding',
          colour:
            'bg-[var(--color-warning-subtle-bg)] text-[var(--color-warning)] border-[var(--color-warning-subtle-border)]',
        }
      : {
          label: 'Manual',
          colour:
            'bg-[var(--color-bg-subtle)] text-[var(--color-text-secondary)] border-[var(--color-border)]',
        };

  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border ${colour}`}
    >
      {label}
    </span>
  );
}
