import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { colors } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { CartScreen } from '../screens/CartScreen';
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { useAuth } from '../hooks/useAuth';
import { Home, MapPin, ShoppingCart, User2 } from 'lucide-react-native';
import { View, ActivityIndicator } from 'react-native';

type RootTabParamList = {
  Home: undefined;
  Map: undefined;
  Cart: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, error, loginWithPhone, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <AuthScreen
        onSubmit={loginWithPhone}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Home':
              return <Home color={color} size={size} />;
            case 'Map':
              return <MapPin color={color} size={size} />;
            case 'Cart':
              return <ShoppingCart color={color} size={size} />;
            case 'Profile':
              return <User2 color={color} size={size} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Меню' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Карта' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Корзина' }} />
      <Tab.Screen
        name="Profile"
        options={{ title: 'Профиль' }}
      >
        {() => <ProfileScreen onLogout={logout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

