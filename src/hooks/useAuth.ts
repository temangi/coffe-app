import { useState, useCallback } from 'react';
import { useProfileStore } from '../store/profileStore';
import { useAppUiStore } from '../store/appUiStore';
import { translate } from '../i18n/dictionary';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setProfile = useProfileStore((s) => s.setProfile);
  const logoutProfile = useProfileStore((s) => s.logout);
  const language = useAppUiStore((s) => s.language);

  const loginWithPhone = useCallback(
    async (phone: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const digits = phone.replace(/\D/g, '');
        const normalized = digits.startsWith('996')
          ? digits
          : digits.startsWith('0')
            ? `996${digits.slice(1)}`
            : digits;

        // KG format: 996 + 9 digits
        const isValidKg = /^996\d{9}$/.test(normalized);
        if (!isValidKg) {
          throw new Error(translate(language, 'auth.invalidPhone'));
        }

        await new Promise((resolve) => setTimeout(resolve, 1500));

        setIsAuthenticated(true);
        setProfile({ 
          name: 'Гость Faiza',
          phone: `+${normalized}`,
        });

      } catch (e: any) {
        setError(e.message ?? translate(language, 'auth.genericError'));
      } finally {
        setIsLoading(false);
      }
    },
    [language, setProfile],
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    logoutProfile();
  }, [logoutProfile]);

  return { isAuthenticated, isLoading, error, loginWithPhone, logout };
};