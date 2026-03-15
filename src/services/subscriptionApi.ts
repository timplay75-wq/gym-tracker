import { apiFetch } from './apiClient';

export interface SubscriptionPlan {
  id: string;
  label: string;
  amount: number;
  currency: string;
  durationDays: number;
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  startsAt: string;
  expiresAt: string;
  paymentProvider: string | null;
}

export const subscriptionApi = {
  getPlans: () => apiFetch<{ plans: SubscriptionPlan[] }>('/subscriptions/plans'),

  getStatus: () => apiFetch<{ active: boolean; subscription: SubscriptionInfo | null }>('/subscriptions/status'),

  create: (plan: string, paymentProvider?: string, externalId?: string) =>
    apiFetch<{ message: string; subscription: { id: string; plan: string; status: string; startsAt: string; expiresAt: string } }>(
      '/subscriptions/create',
      { method: 'POST', body: JSON.stringify({ plan, paymentProvider, externalId }) }
    ),

  cancel: () =>
    apiFetch<{ message: string; subscription: SubscriptionInfo }>('/subscriptions/cancel', { method: 'POST' }),

  getHistory: () =>
    apiFetch<{ subscriptions: Array<SubscriptionInfo & { id: string; amount: number; currency: string; createdAt: string; cancelledAt: string | null }> }>(
      '/subscriptions/history'
    ),
};
