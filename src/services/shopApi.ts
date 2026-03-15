import { apiFetch } from './apiClient';

export interface ExercisePackItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: string;
  exercises: Array<{ name: string; category: string; type: string; equipment?: string }>;
  purchased: boolean;
}

export const shopApi = {
  getPacks: () => apiFetch<{ packs: ExercisePackItem[]; coins: number }>('/shop/packs'),

  purchase: (packId: string) =>
    apiFetch<{ message: string; coins: number; purchasedPacks: string[] }>(`/shop/purchase/${packId}`, { method: 'POST' }),

  getMyPurchases: () =>
    apiFetch<{ coins: number; purchasedPacks: ExercisePackItem[] }>('/shop/my-purchases'),

  getCoins: () => apiFetch<{ coins: number }>('/shop/coins'),
};
