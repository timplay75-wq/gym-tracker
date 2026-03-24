import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/i18n';
import { OAuthButtons } from '@/components/OAuthButtons';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, lang, setLang } = useLanguage();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.name.trim().length < 2) return setError(lang === 'en' ? 'Name must be at least 2 characters' : 'Имя минимум 2 символа');
    if (form.password.length < 6) return setError(lang === 'en' ? 'Password must be at least 6 characters' : 'Пароль минимум 6 символов');
    if (form.password !== form.confirm) return setError(lang === 'en' ? 'Passwords do not match' : 'Пароли не совпадают');

    setLoading(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      navigate('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.auth.register);
    } finally {
      setLoading(false);
    }
  };

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-[#f5f5f5] dark:bg-[#1a1a2e] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[400px]">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            className="text-sm text-[#7C4DFF] font-medium border border-[#7C4DFF] px-3 py-1 rounded-full hover:bg-purple-50 transition-colors"
          >
            {lang === 'ru' ? '🇬🇧 EN' : '🇷🇺 RU'}
          </button>
        </div>

        {/* Лого */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9d6fff] to-[#7C4DFF] flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 8v8M18 8v8M4 10v4M20 10v4M8 12h8" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gym Tracker</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.auth.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.auth.name}</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={set('name')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16213e] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent text-sm"
              placeholder={t.auth.namePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={set('email')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16213e] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.auth.password}</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={set('password')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16213e] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent text-sm"
              placeholder={t.auth.passwordPlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.auth.confirmPassword}</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={form.confirm}
              onChange={set('confirm')}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#16213e] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#7C4DFF] focus:border-transparent text-sm"
              placeholder={t.auth.confirmPlaceholder}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7C4DFF] text-white rounded-xl font-semibold text-sm hover:bg-[#6a3de8] disabled:opacity-60 transition-colors"
          >
            {loading ? t.common.loading : t.auth.registerBtn}
          </button>
        </form>

        <OAuthButtons />

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          {t.auth.haveAccount}{' '}
          <Link to="/login" className="text-[#7C4DFF] font-medium">
            {t.auth.signIn}
          </Link>
        </p>
      </div>
    </div>
  );
};
