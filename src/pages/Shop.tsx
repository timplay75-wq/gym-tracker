import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopApi, type ExercisePackItem } from '@/services/api';
import { useToast } from '@/hooks/useToast';
import { useLanguage } from '@/i18n';

export const Shop = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { t } = useLanguage();
  const [packs, setPacks] = useState<ExercisePackItem[]>([]);
  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    shopApi.getPacks()
      .then(data => {
        setPacks(data.packs);
        setCoins(data.coins);
      })
      .catch(() => toast.error(t.common.error))
      .finally(() => setLoading(false));
  }, []);

  const handlePurchase = async (pack: ExercisePackItem) => {
    if (pack.purchased) return;
    if (coins < pack.price) {
      toast.warning(t.shop.notEnough);
      return;
    }
    setPurchasing(pack._id);
    try {
      const res = await shopApi.purchase(pack._id);
      setCoins(res.coins);
      setPacks(prev => prev.map(p =>
        p._id === pack._id ? { ...p, purchased: true } : p
      ));
      toast.success(t.shop.purchaseSuccess);
    } catch {
      toast.error(t.shop.purchaseError);
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-8">
      <div className="max-w-[480px] mx-auto px-4">
        {/* Header */}
        <header className="pt-6 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.shop.title}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t.shop.subtitle}</p>
          </div>
        </header>

        {/* Coins balance */}
        <div className="bg-gradient-to-r from-[#9333ea] to-[#7c3aed] rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-white/70 text-xs font-medium">{t.shop.balance}</p>
            <p className="text-white text-3xl font-bold">{coins} <span className="text-lg">🪙</span></p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-2">
            <p className="text-white text-xs font-medium">{t.shop.perWorkout}</p>
          </div>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#7c3aed] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          /* Packs grid */
          <div className="space-y-4">
            {packs.map(pack => (
              <div
                key={pack._id}
                className={`bg-white dark:bg-[#16213e] rounded-2xl border overflow-hidden transition-all ${
                  pack.purchased
                    ? 'border-green-200 dark:border-green-800'
                    : 'border-gray-100 dark:border-gray-800'
                }`}
              >
                {/* Pack header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-2xl shrink-0">
                      {pack.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{pack.name}</h3>
                        {pack.purchased && (
                          <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
                            ✓ {t.shop.purchased}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{pack.description}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{pack.exercises.length} {t.shop.exercises}</p>
                    </div>
                  </div>
                </div>

                {/* Exercise preview (collapsed) */}
                <div className="px-4 pb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {pack.exercises.slice(0, 5).map((ex, i) => (
                      <span key={i} className="text-[11px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                        {ex.name}
                      </span>
                    ))}
                    {pack.exercises.length > 5 && (
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 px-2 py-0.5">
                        +{pack.exercises.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Buy button */}
                {!pack.purchased && (
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => handlePurchase(pack)}
                      disabled={purchasing === pack._id || coins < pack.price}
                      className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
                        coins < pack.price
                          ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                          : 'bg-[#9333ea] text-white active:bg-[#7c3aed]'
                      } disabled:opacity-50`}
                    >
                      {purchasing === pack._id ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          🪙 {pack.price} — {t.shop.buy}
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Earn coins hint */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">{t.shop.earnCoins}</p>
        </div>
      </div>
    </div>
  );
};
