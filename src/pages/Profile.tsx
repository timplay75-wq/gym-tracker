import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutsApi } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/i18n';
import { useTheme } from '@/contexts/ThemeContext';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, switchAccount, removeAccount, savedAccounts } = useAuth();
  const { t, lang, setLang } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    thisMonthWorkouts: 0,
    totalVolume: 0,
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const s = await workoutsApi.getStats();
        setStats({ totalWorkouts: s.totalWorkouts, thisMonthWorkouts: s.thisMonthWorkouts, totalVolume: s.totalVolume });
      } catch (err) { console.error(t.common.error, err); }
    })();
  }, []);

  const handleLogout = () => setShowLogoutModal(true);

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] pb-8">
      <div className="max-w-[480px] mx-auto px-4">
        {/* Back button */}
        <div className="pt-4 pb-2">
          <button onClick={() => navigate('/')} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
        </div>

        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#9d6fff] to-[#7c3aed] flex items-center justify-center mb-3">
            <span className="text-white text-2xl font-bold">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : '?'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{user?.name ?? t.profile.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email ?? ''}</p>
        </div>

        {/* ═══ Block 1: Statistics ═══ */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="bg-white dark:bg-[#16213e] rounded-2xl p-3 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalWorkouts}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{t.profile.workouts}</p>
          </div>
          <div className="bg-white dark:bg-[#16213e] rounded-2xl p-3 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{Math.round((stats.totalVolume || 0) / 1000)}т</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{t.profile.volume}</p>
          </div>
          <div className="bg-white dark:bg-[#16213e] rounded-2xl p-3 text-center shadow-sm border border-gray-100 dark:border-gray-800">
            <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.thisMonthWorkouts}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{t.profile.thisMonth}</p>
          </div>
        </div>

        {/* ═══ Block 2: Settings ═══ */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">{t.profile.settings}</h3>
          <div className="bg-white dark:bg-[#16213e] rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
            {/* Language */}
            <button
              onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
              className="w-full h-14 px-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-gray-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t.profile.language}</span>
              </div>
              <span className="text-sm font-semibold text-[#9333ea]">
                {lang === 'ru' ? 'EN' : 'RU'}
              </span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="w-full h-14 px-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  {isDark ? (
                    <svg className="w-4 h-4 text-[#9333ea]" fill="currentColor" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                  ) : (
                    <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path strokeLinecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  )}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t.profile.theme}</span>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${
                isDark ? 'bg-[#9333ea] text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {isDark ? 'ВКЛ' : 'ВЫКЛ'}
              </span>
            </button>

            {/* Notifications */}
            <div
              className="h-14 px-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              onClick={() => navigate('/notifications-settings')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t.profile.notifications}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>

            {/* Body Weight */}
            <div
              className="h-14 px-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-t border-gray-100 dark:border-gray-800"
              onClick={() => navigate('/body-metrics')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#9333ea]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{t.bodyMetrics.title}</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
        </div>

        {/* ═══ Accounts ═══ */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-1">{t.profile.accounts}</h3>
          <div className="bg-white dark:bg-[#16213e] rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            {savedAccounts.map(acc => (
              <div key={acc._id} className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#9d6fff] to-[#7c3aed] flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{acc.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{acc.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{acc.email}</p>
                </div>
                {acc._id === user?._id ? (
                  <span className="text-xs text-[#9333ea] font-semibold px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 rounded-full">{t.profile.active}</span>
                ) : (
                  <button onClick={() => switchAccount(acc._id)} className="text-xs text-[#9333ea] font-semibold px-2 py-0.5 border border-[#9333ea] rounded-full">
                    {t.profile.switchTo}
                  </button>
                )}
                {acc._id !== user?._id && (
                  <button onClick={() => removeAccount(acc._id)} className="text-gray-400 hover:text-red-500 ml-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#9333ea]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <span className="text-sm font-medium text-[#9333ea]">{t.profile.addAccount}</span>
            </button>
          </div>
        </div>

        {/* ═══ Logout ═══ */}
        <button
          onClick={handleLogout}
          className="w-full py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          {t.profile.logout}
        </button>
      </div>

      {/* ═══ Logout Confirm Modal ═══ */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowLogoutModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-[#16213e] rounded-2xl shadow-xl p-6 w-full max-w-[320px]" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
            </div>
            <h3 className="text-center font-bold text-gray-900 dark:text-white mb-1">{t.profile.logout}</h3>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-5">{t.profile.logoutConfirm}</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                {t.common.cancel}
              </button>
              <button onClick={confirmLogout} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors">
                {t.profile.logout}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
