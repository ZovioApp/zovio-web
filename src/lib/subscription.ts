import { api } from './api';

export type SubscriptionPlanName = 'free' | 'pro' | 'enterprise';

export interface SubscriptionPlanConfig {
  id: string;
  name: SubscriptionPlanName;
  displayName: string;
  maxAcademies: number;
  maxAthletesPerAcademy: number;
  maxCoachesPerAcademy: number;
  cardPaymentsEnabled: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlanName;
  maxAcademies: number;
  maxAthletesPerAcademy: number;
  maxCoachesPerAcademy: number;
  cardPaymentsEnabled: boolean;
  stripeSubscriptionId: string | null;
  expiresAt: string | null;
  planConfig?: SubscriptionPlanConfig;
}

export const subscriptionApi = {
  // The backend returns an empty body (no subscription row) for accounts
  // that somehow never got one — defensive, since every owner should have
  // one from the free-trial-on-register flow.
  get: () => api<Subscription | null | undefined>('GET', '/api/subscription'),
  cancel: () =>
    api<{ message: string }>('POST', '/api/subscription/cancel'),
};
