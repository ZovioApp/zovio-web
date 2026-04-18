import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  payoutsApi,
  type PayoutStatus,
} from '../../../lib/academies';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';

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

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Payouts</h1>
        <p className="text-[var(--color-text-muted)] text-sm">
          Connect a Stripe account so Zovio can route paid session fees to you.
          Only the primary owner can change this.
        </p>
      </header>

      <section className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-6 max-w-[560px]">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <div className="text-xs uppercase tracking-wide text-[var(--color-text-muted)] mb-1">
              Current mode
            </div>
            <div className="text-2xl font-bold">
              {status.payoutMode === 'stripe_connect'
                ? 'Stripe Connect'
                : 'Manual'}
            </div>
          </div>
          <StatusBadge
            mode={status.payoutMode}
            onboardingComplete={status.onboardingComplete}
          />
        </div>

        <p className="text-sm text-[var(--color-text-secondary)] mb-6">
          {status.payoutMode === 'stripe_connect' && status.onboardingComplete
            ? 'Card payments from students are routed to your connected Stripe account, net of Zovio platform fees.'
            : status.payoutMode === 'stripe_connect'
              ? 'A Stripe account is linked, but onboarding is not complete. Click below to finish it.'
              : 'This academy runs on manual settlement. Enrolments and attendance still work; students just don\u2019t pay through the platform.'}
        </p>

        {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => void onboard()}
            disabled={isWorking}
            className="rounded-[10px] bg-[var(--color-primary)] text-[var(--color-bg)] px-5 py-2.5 text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {status.stripeConnectedAccountId
              ? status.onboardingComplete
                ? 'Manage Stripe account'
                : 'Finish Stripe onboarding'
              : 'Connect with Stripe'}
          </button>

          {status.stripeConnectedAccountId && (
            <button
              type="button"
              onClick={() => void unlink()}
              disabled={isWorking}
              className="rounded-[10px] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-white hover:border-white/20 px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
            >
              Switch back to manual
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

function StatusBadge({
  mode,
  onboardingComplete,
}: {
  mode: PayoutStatus['payoutMode'];
  onboardingComplete: boolean;
}) {
  const { colour, label } =
    mode === 'stripe_connect' && onboardingComplete
      ? {
          colour:
            'text-[var(--color-primary)] bg-[rgba(0,212,170,0.12)] border-[rgba(0,212,170,0.3)]',
          label: 'Active',
        }
      : mode === 'stripe_connect'
        ? {
            colour:
              'text-[var(--color-warning)] bg-[rgba(255,179,71,0.1)] border-[rgba(255,179,71,0.3)]',
            label: 'Onboarding',
          }
        : {
            colour:
              'text-[var(--color-text-secondary)] bg-white/5 border-white/10',
            label: 'Manual',
          };

  return (
    <span
      className={`text-xs uppercase tracking-wide font-semibold px-3 py-1 rounded-full border ${colour}`}
    >
      {label}
    </span>
  );
}
