import { useMemo } from 'react';
import { useAppUiStore } from '../store/appUiStore';
import { translate } from './dictionary';

export const useI18n = () => {
  const language = useAppUiStore((s) => s.language);

  const t = useMemo(() => {
    return (key: string) => translate(language, key);
  }, [language]);

  return { t, language };
};
