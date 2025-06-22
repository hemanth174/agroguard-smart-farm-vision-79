
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language, getLanguageDetails } from '@/utils/i18n';

const LanguageIndicator = () => {
  const { language } = useApp();
  const { t } = useTranslation(language as Language);
  const languageInfo = getLanguageDetails(language as Language);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <span>🌐 {t('showingIn')}:</span>
      <Badge variant="outline" className="flex items-center gap-1">
        <span>{languageInfo.flag}</span>
        <span>{languageInfo.nativeName}</span>
      </Badge>
      <span className="text-blue-600 cursor-pointer hover:underline">
        {t('changeLanguage')}
      </span>
    </div>
  );
};

export default LanguageIndicator;
