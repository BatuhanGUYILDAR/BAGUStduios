import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { LanguageContext, translations, type Language } from './LanguageContext';

const STORAGE_KEY = 'bagu-studio-language';

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return storedLanguage === 'tr' || storedLanguage === 'en' ? storedLanguage : 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
