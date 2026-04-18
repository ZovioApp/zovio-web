import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { payoutsApi, type PayoutStatus } from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { Button } from '../../../components/Button';

export default function Payouts() {
  const { academyId } = useParams<{ academyId: string }>();
  const [status, setStatus] = useState<PayoutStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const load = useCallback(() => {
    if (!academyId) return;
    payoutsApi
      .status(academyId)
      .then(setStatus)
      .catch((err) =>
        setError(err instanceof Error ? err.message : 'Failed to load'),
      );
  }, [academyId]);

  useEffect(load, [load]);

  if (error) return <ErrorMessage message={error} />;
  if (!status || !academyId) return <LoadingScreen />;

  const onboard = async () => {
    setError(null);
    setIsWorking(true);
    try {
      const res = await payoutsApi.onboard(academyId);
      window.location.assign(res.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Onboarding failed');
      setIsWorking(false);
    }
  };

  const unlink = async () => {
    setError(null);
    setIsWorking(true);
    try {
      await payoutsApi.unlink(academyId);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unlink failed');
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

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => void onboard()}
            disabled={isWorking}
          >
            {status.stripeConnectedAccountId
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
              disabled={isWorking}
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
