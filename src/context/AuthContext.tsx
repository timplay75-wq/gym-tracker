import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authApi } from '@/services/api';

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
}

interface OAuthData {
  token: string;
  _id: string;
  name: string;
  email: string;
  avatar?: string;
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
  handleOAuthCallback: (data: OAuthData) => void;
  logout: () => void;
  switchAccount: (id: string) => Promise<void>;
  removeAccount: (id: string) => void;
  updateUser: (data: Partial<User>) => void;
}

const ACCOUNTS_KEY = 'gym_accounts';
const ACTIVE_KEY = 'token';

function loadAccounts(): SavedAccount[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); } catch { return []; }
}
function saveAccounts(accounts: SavedAccount[]) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
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
    localStorage.setItem(ACTIVE_KEY, data.token);
    setToken(data.token);
    const u = { _id: data._id, name: data.name, email: data.email };
    setUser(u);
    persistAccount({ ...u, token: data.token });
  }, [persistAccount]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const data = await authApi.register(name, email, password);
    localStorage.setItem(ACTIVE_KEY, data.token);
    setToken(data.token);
    const u = { _id: data._id, name: data.name, email: data.email };
    setUser(u);
    persistAccount({ ...u, token: data.token });
  }, [persistAccount]);

  const logout = useCallback(() => {
    localStorage.removeItem(ACTIVE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const switchAccount = useCallback(async (id: string) => {
    const account = loadAccounts().find(a => a._id === id);
    if (!account) return;
    localStorage.setItem(ACTIVE_KEY, account.token);
    setToken(account.token);
    setIsLoading(true);
    try {
      const u = await authApi.getMe();
      setUser(u);
      // Обновить токен если изменился
      persistAccount({ _id: u._id, name: u.name, email: u.email, token: account.token });
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
    window.location.href = `${backendBase}/api/oauth/${provider}`;
  }, []);

  // Called from /oauth-callback page after redirect back from provider
  const handleOAuthCallback = useCallback((data: OAuthData) => {
    localStorage.setItem(ACTIVE_KEY, data.token);
    setToken(data.token);
    const u: User = { _id: data._id, name: data.name, email: data.email, avatar: data.avatar };
    setUser(u);
    persistAccount({ _id: data._id, name: data.name, email: data.email, token: data.token });
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
