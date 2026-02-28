import React from 'react';
import { NavigationContainer } from '@react-navigation/native'; // 1. Импортируем контейнер
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator'; // Проверьте путь к файлу

export default function App() {
  return (
    <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
    </SafeAreaProvider>
  );
}