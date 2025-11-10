import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 
  | 'en' // English
  | 'hi' // Hindi
  | 'mr' // Marathi
  | 'bn' // Bengali
  | 'ta' // Tamil
  | 'pa' // Punjabi
  | 'gu' // Gujarati
  | 'ml' // Malayalam
  | 'kn' // Kannada
  | 'te' // Telugu
  | 'or' // Odia
  | 'as' // Assamese
  | 'ur'; // Urdu

export const languageNames: Record<Language, { native: string; english: string }> = {
  en: { native: 'English', english: 'English' },
  hi: { native: 'हिंदी', english: 'Hindi' },
  mr: { native: 'मराठी', english: 'Marathi' },
  bn: { native: 'বাংলা', english: 'Bengali' },
  ta: { native: 'தமிழ்', english: 'Tamil' },
  pa: { native: 'ਪੰਜਾਬੀ', english: 'Punjabi' },
  gu: { native: 'ગુજરાતી', english: 'Gujarati' },
  ml: { native: 'മലയാളം', english: 'Malayalam' },
  kn: { native: 'ಕನ್ನಡ', english: 'Kannada' },
  te: { native: 'తెలుగు', english: 'Telugu' },
  or: { native: 'ଓଡ଼ିଆ', english: 'Odia' },
  as: { native: 'অসমীয়া', english: 'Assamese' },
  ur: { native: 'اردو', english: 'Urdu' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  bhashiniEnabled: boolean;
  setBhashiniEnabled: (enabled: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: React.PropsWithChildren) {
  const [language, setLanguage] = useState<Language>('en');
  const [bhashiniEnabled, setBhashiniEnabled] = useState(false);

  useEffect(() => {
    // Load saved language preference
    const saved = localStorage.getItem('preferred-language') as Language;
    if (saved && languageNames[saved]) {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    // Save language preference
    localStorage.setItem('preferred-language', language);
    
    // Set HTML lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    // Import translations dynamically based on language
    const translations = getTranslations(language);
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, bhashiniEnabled, setBhashiniEnabled }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Import all translations
import enTranslations from '../translations/en';
import hiTranslations from '../translations/hi';
import mrTranslations from '../translations/mr';
import bnTranslations from '../translations/bn';
import taTranslations from '../translations/ta';
import paTranslations from '../translations/pa';
import guTranslations from '../translations/gu';
import mlTranslations from '../translations/ml';
import knTranslations from '../translations/kn';
import teTranslations from '../translations/te';
import orTranslations from '../translations/or';
import asTranslations from '../translations/as';
import urTranslations from '../translations/ur';

// Translation getter function
function getTranslations(lang: Language): Record<string, string> {
  const translations: Record<Language, Record<string, string>> = {
    en: enTranslations,
    hi: hiTranslations,
    mr: mrTranslations,
    bn: bnTranslations,
    ta: taTranslations,
    pa: paTranslations,
    gu: guTranslations,
    ml: mlTranslations,
    kn: knTranslations,
    te: teTranslations,
    or: orTranslations,
    as: asTranslations,
    ur: urTranslations,
  };

  return translations[lang] || translations.en;
}
