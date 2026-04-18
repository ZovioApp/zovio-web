import { api } from './api';

export type AcademyRole = 'primary_owner' | 'owner' | 'coach' | 'athlete';

export const OWNER_ROLES: readonly AcademyRole[] = ['primary_owner', 'owner'];

export function isOwnerRole(role: AcademyRole): boolean {
  return OWNER_ROLES.includes(role);
}

export interface AcademySummary {
  id: string;
  name: string;
  description: string | null;
  sport: string | null;
  timezone: string;
  currency: string;
  payoutMode: 'manual' | 'stripe_connect';
  stripeConnectedAccountId: string | null;
  ownerId: string;
  createdAt: string;
  role: AcademyRole;
  memberCount: number;
}

export interface AcademyMember {
  id: string;
  academyId: string;
  userId: string | null;
  invitedEmail: string | null;
  role: AcademyRole;
  status: 'pending' | 'active' | 'removed';
  joinedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatarColor: string | null;
  };
}

export interface DashboardStats {
  todaySessions: number;
  upcomingSessions: number;
  attendanceRate: number;
  totalMembers: number;
}

export interface CoachBreakdownEntry {
  coachId: string;
  coachName: string;
  sessionCount: number;
  paidEnrollmentCount: number;
  income: number;
}

export interface SessionBreakdownEntry {
  sessionId: string;
  title: string;
  date: string;
  fee: string;
  income: number;
  attendedCount: number;
  paidCount: number;
  enrolledCount: number;
  coachId: string | null;
  coachName: string | null;
}

export interface RevenueReport {
  currency: string;
  totalIncome: number;
  sessionIncome: number;
  eventIncome: number;
  monthlyBreakdown: {
    month: string;
    income: number;
    sessionCount: number;
    eventCount: number;
  }[];
  sessionBreakdown: SessionBreakdownEntry[];
  coachBreakdown: CoachBreakdownEntry[];
  eventBreakdown: {
    eventId: string;
    title: string;
    type: string;
    income: number;
    paidCount: number;
  }[];
}

export interface PayoutStatus {
  payoutMode: 'manual' | 'stripe_connect';
  stripeConnectedAccountId: string | null;
  onboardingComplete: boolean;
}

export interface SessionSummary {
  id: string;
  academyId: string;
  title: string;
  description: string | null;
  date: string;
  startTime: string;
  endTime: string;
  maxAthletes: number;
  fee: string;
  currency: string;
  paymentMode: 'card' | 'manual' | 'free';
  recurrence: string;
  visibility: 'public' | 'private';
  status: 'scheduled' | 'completed' | 'cancelled';
  createdBy: string;
}

export const academiesApi = {
  list: () => api<AcademySummary[]>('GET', '/api/academies'),
  get: (id: string) => api<AcademySummary>('GET', `/api/academies/${id}`),
  stats: (id: string) =>
    api<DashboardStats>('GET', `/api/academies/${id}/stats`),
  revenue: (id: string) =>
    api<RevenueReport>('GET', `/api/academies/${id}/revenue`),
  members: (id: string) =>
    api<AcademyMember[]>('GET', `/api/academies/${id}/members`),
  update: (
    id: string,
    body: Partial<
      Pick<
        AcademySummary,
        'name' | 'description' | 'sport' | 'timezone' | 'currency'
      >
    >,
  ) => api<AcademySummary>('PUT', `/api/academies/${id}`, body),
  sessions: (id: string) =>
    api<SessionSummary[]>('GET', `/api/academies/${id}/sessions`),
};

export const payoutsApi = {
  status: (academyId: string) =>
    api<PayoutStatus>('GET', `/api/academies/${academyId}/payouts`),
  onboard: (academyId: string) =>
    api<{ url: string; accountId: string; onboardingComplete: boolean }>(
      'POST',
      `/api/academies/${academyId}/payouts/onboard`,
    ),
  unlink: (academyId: string) =>
    api<{ message: string }>(
      'POST',
      `/api/academies/${academyId}/payouts/unlink`,
    ),
};
