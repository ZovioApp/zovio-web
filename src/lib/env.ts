export type Environment = 'local' | 'staging' | 'production';

interface AppEnv {
  apiUrl: string;
  stripePublishableKey: string;
  environment: Environment;
  isProduction: boolean;
}

function resolveEnvironment(raw: string | undefined): Environment {
  if (raw === 'production' || raw === 'staging') return raw;
  return 'local';
}

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const environment = resolveEnvironment(import.meta.env.VITE_ENVIRONMENT);

export const env: AppEnv = {
  apiUrl: required('VITE_API_URL', import.meta.env.VITE_API_URL),
  // Optional: nothing in the web app loads Stripe.js today, so a missing
  // key must not white-screen the whole site at boot. Re-tighten to
  // required() if client-side Stripe is ever added.
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? '',
  environment,
  isProduction: environment === 'production',
};
