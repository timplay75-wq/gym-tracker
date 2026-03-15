import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/services/apiClient', () => ({
  apiFetch: vi.fn(),
}));

import { apiFetch } from '@/services/apiClient';
import { shopApi } from '../services/shopApi';

const mockFetch = apiFetch as ReturnType<typeof vi.fn>;

describe('shopApi', () => {
  beforeEach(() => vi.clearAllMocks());

  it('getPacks fetches /shop/packs', async () => {
    mockFetch.mockResolvedValue({ packs: [], coins: 100 });
    const result = await shopApi.getPacks();
    expect(mockFetch).toHaveBeenCalledWith('/shop/packs');
    expect(result.coins).toBe(100);
  });

  it('purchase sends POST with packId', async () => {
    mockFetch.mockResolvedValue({ message: 'ok', coins: 50 });
    await shopApi.purchase('pack1');
    expect(mockFetch).toHaveBeenCalledWith('/shop/purchase/pack1', { method: 'POST' });
  });

  it('getMyPurchases fetches /shop/my-purchases', async () => {
    mockFetch.mockResolvedValue({ coins: 100, purchasedPacks: [] });
    await shopApi.getMyPurchases();
    expect(mockFetch).toHaveBeenCalledWith('/shop/my-purchases');
  });

  it('getCoins fetches /shop/coins', async () => {
    mockFetch.mockResolvedValue({ coins: 200 });
    const result = await shopApi.getCoins();
    expect(mockFetch).toHaveBeenCalledWith('/shop/coins');
    expect(result.coins).toBe(200);
  });
});
