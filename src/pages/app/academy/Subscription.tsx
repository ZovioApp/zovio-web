import { useCallback, useEffect, useState } from 'react';
import { subscriptionApi, type Subscription } from '../../../lib/subscription';
import { LoadingScreen } from '../../../components/LoadingScreen';
import { ErrorMessage } from '../../../components/ErrorMessage';
import { ErrorState } from '../../../components/ErrorState';
import { Button } from '../../../components/Button';

const PLAN_LABEL: Record<string, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
};

export default function SubscriptionPage() {
  const [sub, setSub] = useState<Subscription | null | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const load = useCallback(() => {
    setLoadError(null);
    subscriptionApi
      .get()
      .then(setSub)
      .catch((err) =>
        setLoadError(err instanceof Error ? err.message : 'Failed to load'),
      );
  }, []);

  useEffect(load, [load]);

  if (loadError) return <ErrorState message={loadError} onRetry={load} />;
  if (sub === undefined) return <LoadingScreen />;

  const plan = sub?.plan ?? 'free';
  const isPaid = plan !== 'free';

  const cancel = async () => {
    if (
      !window.confirm(
        'Cancel your Zovio subscription? Card payments from students will stop working the moment this takes effect, and every academy you own drops to Free-plan limits.',
      )
    ) {
      return;
    }
    setActionError(null);
    setIsWorking(true);
    try {
      await subscriptionApi.cancel();
      load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Cancel failed');
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">
          Subscription
        </h1>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Your Zovio plan. To upgrade or change plans, use the Zovio mobile
          app — web doesn't support checkout.
        </p>
      </header>

      <section className="bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-lg p-6 max-w-[560px] space-y-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider font-medium text-[var(--color-text-muted)] mb-1">
            Current plan
          </div>
          <div className="text-xl font-semibold text-[var(--color-text)]">
            {sub?.planConfig?.displayName ?? PLAN_LABEL[plan] ?? plan}
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <Stat label="Academies" value={sub?.maxAcademies} />
          <Stat label="Coaches / academy" value={sub?.maxCoachesPerAcademy} />
          <Stat label="Athletes / academy" value={sub?.maxAthletesPerAcademy} />
          <Stat
            label="Card payments"
            value={sub?.cardPaymentsEnabled ? 'Enabled' : 'Disabled'}
          />
        </dl>

        {sub?.expiresAt && (
          <p className="text-xs text-[var(--color-text-muted)]">
            {isPaid ? 'Renews' : 'Expires'} on{' '}
            {new Date(sub.expiresAt).toLocaleDateString()}.
          </p>
        )}

        {actionError && <ErrorMessage message={actionError} />}

        {isPaid && (
          <div className="pt-2">
            <Button
              variant="danger"
              size="md"
              onClick={() => void cancel()}
              disabled={isWorking}
            >
              {isWorking ? 'Working…' : 'Cancel subscription'}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number | undefined;
}) {
  return (
    <div>
      <dt className="text-xs text-[var(--color-text-muted)]">{label}</dt>
      <dd className="text-[var(--color-text)] font-medium tnum">
        {value ?? '—'}
      </dd>
    </div>
  );
}
