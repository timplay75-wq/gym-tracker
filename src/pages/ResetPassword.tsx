import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '@/i18n';
import { authApi } from '@/services/api';

export const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirm) {
      setError(t.auth.passwordsMismatch);
      return;
    }

    if (!token) {
      setError(t.auth.invalidToken);
      return;
    }

    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.auth.invalidToken);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Лого */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9d6fff] to-[#7C4DFF] flex items-center justify-center mb-3">
            <span className="text-white text-2xl">🔒</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t.auth.resetTitle}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.auth.resetSubtitle}</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-sm text-green-700 dark:text-green-300 text-center">
              ✅ {t.auth.resetSuccess}
            </div>
            <Link
              to="/login"
              className="block w-full py-3 text-center bg-[#7C4DFF] text-white rounded-xl font-semibold text-sm hover:bg-[#6a3de8] transition-colors"
            >
              {t.auth.backToLogin}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.auth.newPassword}
              </label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16213e] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent text-sm"
                placeholder={t.auth.passwordPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.auth.confirmPassword}
              </label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16213e] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent text-sm"
                placeholder={t.auth.confirmPlaceholder}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#7C4DFF] text-white rounded-xl font-semibold text-sm hover:bg-[#6a3de8] disabled:opacity-60 transition-colors"
            >
              {loading ? t.common.loading : t.auth.resetBtn}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              <Link to="/login" className="text-[#7C4DFF] font-medium">
                {t.auth.backToLogin}
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
