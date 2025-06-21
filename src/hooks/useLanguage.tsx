
import { useState, useCallback } from 'react';

export const useLanguage = () => {
  const [language, setLanguageState] = useState<string>('en');

  const setLanguage = useCallback((lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('villageeye-language', lang);
  }, []);

  const initializeLanguage = useCallback(() => {
    const savedLanguage = localStorage.getItem('villageeye-language');
    if (savedLanguage) {
      setLanguageState(savedLanguage);
    }
  }, []);

  return {
    language,
    setLanguage,
    initializeLanguage
  };
};
