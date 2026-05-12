import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native'; // 1. Импортируем контейнер
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { AppNavigator } from './src/navigation/AppNavigator'; // Проверьте путь к файлу
import { useMenuStore } from './src/store/menuStore';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });

  const fetchMenu = useMenuStore((s) => s.fetchMenu);
  useEffect(() => {
    if (fontsLoaded) {
      void fetchMenu();
    }
  }, [fontsLoaded, fetchMenu]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
    </SafeAreaProvider>
  );
}