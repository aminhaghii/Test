import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from '@/translations/en.json';
import faTranslations from '@/translations/fa.json';
import arTranslations from '@/translations/ar.json';
import esTranslations from '@/translations/es.json';
import itTranslations from '@/translations/it.json';

type Language = 'en' | 'fa' | 'ar' | 'es' | 'it';

interface Translations {
  [key: string]: string | Translations;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  en: enTranslations,
  fa: faTranslations,
  ar: arTranslations,
  es: esTranslations,
  it: itTranslations,
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  const isRTL = currentLanguage === 'fa' || currentLanguage === 'ar';

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage, isRTL]);

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: string | Translations = translations[currentLanguage];

    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        let fallback: string | Translations = translations.en;
        for (const fk of keys) {
          if (typeof fallback === 'object' && fallback !== null && fk in fallback) {
            fallback = fallback[fk];
          } else {
            return key; // Return key if not found
          }
        }
        return typeof fallback === 'string' ? fallback : key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
