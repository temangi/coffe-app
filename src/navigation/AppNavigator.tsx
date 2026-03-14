import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Coffee, Home, List, User2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';

import { AuthScreen } from '../screens/AuthScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { ProductCustomizationScreen } from '../screens/ProductCustomizationScreen';
import { CartScreen } from '../screens/CartScreen';
import { DeliveryLocationScreen } from '../screens/DeliveryLocationScreen';
import { PaymentSelectionScreen } from '../screens/PaymentSelectionScreen';
import { OrderConfirmationScreen } from '../screens/OrderConfirmationScreen';
import { OrderTrackingScreen } from '../screens/OrderTrackingScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useI18n } from '../i18n/useI18n';
import { fontFamily } from '../theme/typography';

type RootStackParamList = {
  Tabs: undefined;
  Customize: undefined;
  Cart: undefined;
  Delivery: undefined;
  Payment: undefined;
  Confirmation: undefined;
  Tracking: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator<RootStackParamList>();

const MainTabs: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'rgba(42,28,28,0.45)',
        tabBarStyle: [styles.tabBar, { marginBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 10) : 12 }],
        tabBarLabelStyle: styles.label,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('nav.home'), tabBarIcon: ({ color }) => <Home color={color} size={20} /> }} />
      <Tab.Screen name="Menu" component={MenuScreen} options={{ title: t('nav.menu'), tabBarIcon: ({ color }) => <Coffee color={color} size={20} /> }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: t('nav.orders'), tabBarIcon: ({ color }) => <List color={color} size={20} /> }} />
      <Tab.Screen name="Profile" options={{ title: t('nav.profile'), tabBarIcon: ({ color }) => <User2 color={color} size={20} /> }}>
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading, error, loginWithPhone, logout } = useAuth();

  if (!isAuthenticated) {
    return <AuthScreen onSubmit={loginWithPhone} isLoading={isLoading} error={error} />;
  }

  return (
    <View style={styles.wrapper}>
      <Stack.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
          animation: 'simple_push',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      >
        <Stack.Screen name="Tabs">{() => <MainTabs onLogout={logout} />}</Stack.Screen>
        <Stack.Screen name="Customize" component={ProductCustomizationScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Cart" component={CartScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen
          name="Delivery"
          component={DeliveryLocationScreen}
          options={{
            presentation: 'containedModal',
            animation: 'slide_from_bottom',
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentSelectionScreen}
          options={{
            presentation: 'containedModal',
            animation: 'slide_from_bottom',
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name="Confirmation"
          component={OrderConfirmationScreen}
          options={{
            presentation: 'containedModal',
            animation: 'fade_from_bottom',
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen name="Tracking" component={OrderTrackingScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: colors.background },
  tabBar: {
    height: 68,
    marginHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,251,247,0.98)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(179,35,43,0.18)',
  },
  // Use system font here because tab labels are localized (ru/kg/en),
  // and system fonts guarantee Cyrillic/Kyrgyz glyph coverage.
  label: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.95)',
  },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: '900', letterSpacing: 0.2 },
});
