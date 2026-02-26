import { useState, useCallback } from 'react';
import { useProfileStore } from '../store/profileStore';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const setProfile = useProfileStore((s) => s.setProfile);
  const logoutProfile = useProfileStore((s) => s.logout);

  const loginWithPhone = useCallback(
    async (phone: string) => {
      setIsLoading(true);
      setError(null);

      try {
        // Очищаем номер от всего, кроме цифр
        const digits = phone.replace(/\D/g, '');

        // Валидация для Кыргызстана: 
        // Должно быть либо 996XXXXXXXXX (12 цифр), либо 0XXXXXXXXX (10 цифр)
        if (digits.length === 12 && !digits.startsWith('996')) {
           throw new Error('Код страны должен быть 996');
        }
        
        if (digits.length < 10) {
          throw new Error('Номер слишком короткий');
        }

        // Имитируем запрос к серверу (например, проверку OTP кода)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // В реальности здесь был бы запрос к Firebase/Supabase
        // Сейчас просто пускаем пользователя
        setIsAuthenticated(true);
        setProfile({ 
          name: 'Местный бариста', 
          phone: `+${digits.startsWith('996') ? digits : '996' + digits.slice(1)}` 
        });

      } catch (e: any) {
        setError(e.message ?? 'Ошибка входа');
      } finally {
        setIsLoading(false);
      }
    },
    [setProfile],
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    logoutProfile();
  }, [logoutProfile]);

  return { isAuthenticated, isLoading, error, loginWithPhone, logout };
};