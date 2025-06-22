
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useTranslation, Language } from '@/utils/i18n';

interface BackButtonProps {
  to?: string;
  className?: string;
}

const BackButton = ({ to = '/', className = '' }: BackButtonProps) => {
  const navigate = useNavigate();
  const { language } = useApp();
  const { t } = useTranslation(language as Language);

  const handleBack = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleBack}
      className={`flex items-center gap-2 mb-4 ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      {t('goBack')}
    </Button>
  );
};

export default BackButton;
