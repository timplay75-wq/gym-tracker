import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '@/services/api';
import { requestCache } from '@/services/requestCache';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  goal?: string;
  weight?: number;
  height?: number;
}

export interface SavedAccount {
  _id: string;
  name: string;
  email: string;
  token: string;
  /** Момент истечения JWT в миллисекундах; протухшие записи не храним. */
  expiresAt: number | null;
}

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  savedAccounts: SavedAccount[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  oauthLogin: (provider: 'google' | 'github') => void;
  handleOAuthCallback: (code: string) => Promise<void>;
  logout: () => void;
  switchAccount: (id: string) => Promise<void>;
  removeAccount: (id: string) => void;
  updateUser: (data: Partial<User>) => void;
}

const ACCOUNTS_KEY = 'gym_accounts';
const ACTIVE_KEY = 'token';
export const OAUTH_NONCE_KEY = 'gym_oauth_nonce';

/** Читает exp из JWT, чтобы не держать в localStorage заведомо мёртвые токены. */
function tokenExpiry(token: string): number | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    const exp = JSON.parse(json)?.exp;
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch {
    return null;
  }
}

function isAlive(account: SavedAccount): boolean {
  return !account.expiresAt || account.expiresAt > Date.now();
}

function loadAccounts(): SavedAccount[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    // Протухшие токены выбрасываем при каждом чтении: раньше JWT всех
    // аккаунтов, куда пользователь когда-либо входил, лежали здесь вечно.
    const alive = parsed.filter((a: SavedAccount) => a?.token && isAlive(a));
    if (alive.length !== parsed.length) saveAccounts(alive);
    return alive;
  } catch {
    return [];
  }
}

function saveAccounts(accounts: SavedAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function makeAccount(user: { _id: string; name: string; email: string }, token: string): SavedAccount {
  return { _id: user._id, name: user.name, email: user.email, token, expiresAt: tokenExpiry(token) };
}

/** Случайный hex-nonce; сервер принимает /^[a-f\d]{16,64}$/. */
function createNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ACTIVE_KEY));
  const [isLoading, setIsLoading] = useState(true);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>(loadAccounts);

  // Загрузить профиль при наличии токена
  useEffect(() => {
    const stored = localStorage.getItem(ACTIVE_KEY);
    if (!stored) { setIsLoading(false); return; }

    authApi.getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(ACTIVE_KEY);
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // Сохранить аккаунт в список после входа
  const persistAccount = useCallback((account: SavedAccount) => {
    setSavedAccounts(prev => {
      const filtered = prev.filter(a => a._id !== account._id);
      const updated = [account, ...filtered];
      saveAccounts(updated);
      return updated;
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    // Кэш ответов общий на весь модуль: без сброса новый аккаунт увидит
    // данные предыдущего.
    requestCache.clear();
    localStorage.setItem(ACTIVE_KEY, data.token);
    setToken(data.token);
    const u = { _id: data._id, name: data.name, email: data.email };
    setUser(u);
    persistAccount(makeAccount(u, data.token));
  }, [persistAccount]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await authApi.register(name, email, password);
    requestCache.clear();
    localStorage.setItem(ACTIVE_KEY, data.token);
    setToken(data.token);
    const u = { _id: data._id, name: data.name, email: data.email };
    setUser(u);
    persistAccount(makeAccount(u, data.token));
  }, [persistAccount]);

  const logout = useCallback(() => {
    requestCache.clear();
    localStorage.removeItem(ACTIVE_KEY);
    // Выход должен убирать и сохранённый JWT этого аккаунта, иначе он
    // остаётся в localStorage до самого истечения срока.
    setSavedAccounts(prev => {
      const updated = prev.filter(a => a._id !== user?._id);
      saveAccounts(updated);
      return updated;
    });
    setToken(null);
    setUser(null);
  }, [user]);

  const switchAccount = useCallback(async (id: string) => {
    const account = loadAccounts().find(a => a._id === id);
    if (!account) return;
    requestCache.clear();
    localStorage.setItem(ACTIVE_KEY, account.token);
    setToken(account.token);
    setIsLoading(true);
    try {
      const u = await authApi.getMe();
      setUser(u);
      // Обновить токен если изменился
      persistAccount(makeAccount(u, account.token));
    } catch {
      // Токен устарел — убрать аккаунт
      setSavedAccounts(prev => {
        const updated = prev.filter(a => a._id !== id);
        saveAccounts(updated);
        return updated;
      });
      localStorage.removeItem(ACTIVE_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [persistAccount]);

  const removeAccount = useCallback((id: string) => {
    setSavedAccounts(prev => {
      const updated = prev.filter(a => a._id !== id);
      saveAccounts(updated);
      return updated;
    });
    // Если удаляем активный — выходим
    if (user?._id === id) {
      requestCache.clear();
      localStorage.removeItem(ACTIVE_KEY);
      setToken(null);
      setUser(null);
    }
  }, [user]);

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  }, []);

  // OAuth: redirect to provider (full-page, not popup)
  const oauthLogin = useCallback((provider: 'google' | 'github') => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const backendBase = apiUrl.replace(/\/api\/?$/, '');
    // nonce остаётся в этой вкладке и предъявляется при обмене кода. Без него
    // ссылка /oauth-callback?code=<чужой код> залогинила бы в чужой аккаунт.
    const nonce = createNonce();
    sessionStorage.setItem(OAUTH_NONCE_KEY, nonce);
    window.location.href = `${backendBase}/api/oauth/${provider}?nonce=${nonce}`;
  }, []);

  // Called from /oauth-callback page after redirect back from provider
  const handleOAuthCallback = useCallback(async (code: string) => {
    const nonce = sessionStorage.getItem(OAUTH_NONCE_KEY) || '';
    sessionStorage.removeItem(OAUTH_NONCE_KEY);

    // Токен приходит из тела ответа, а не из query-строки редиректа:
    // URL оседает в истории браузера, в Referer и в логах прокси.
    const data = await authApi.oauthExchange(code, nonce);

    requestCache.clear();
    localStorage.setItem(ACTIVE_KEY, data.token);
    setToken(data.token);
    const u: User = {
      _id: data.user._id,
      name: data.user.name,
      email: data.user.email,
      avatar: data.user.avatar || undefined,
    };
    setUser(u);
    persistAccount(makeAccount(u, data.token));
  }, [persistAccount]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!user,
      savedAccounts,
      login,
      register,
      oauthLogin,
      handleOAuthCallback,
      logout,
      switchAccount,
      removeAccount,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
