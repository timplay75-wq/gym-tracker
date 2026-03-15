import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ru } from './ru';
import { en } from './en';
import type { Translations } from './ru';

export type Language = 'ru' | 'en';

interface LanguageContextValue {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const LANG_KEY = 'gym_lang';

const translations: Record<Language, Translations> = { ru, en };

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(
    () => (localStorage.getItem(LANG_KEY) as Language) || 'ru'
  );

  const setLang = useCallback((l: Language) => {
    localStorage.setItem(LANG_KEY, l);
    setLangState(l);
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, t: translations[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback for tests or usage outside provider
    return { lang: 'ru', t: ru, setLang: () => {} };
  }
  return ctx;
}
