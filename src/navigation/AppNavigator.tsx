import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Home, List, ShoppingCart, User2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { CartScreen } from '../screens/CartScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { useAuth } from '../hooks/useAuth';
import { CartModal } from '../components/CartModal';
import { useCartStore } from '../store/cartStore';
import { useCartUIStore } from '../store/cartUIStore';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, error, loginWithPhone, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const openCart = useCartUIStore((s) => s.openCart);
  const cartCount = useCartStore((s) => s.items.reduce((sum, it) => sum + it.quantity, 0));

  if (!isAuthenticated) {
    return <AuthScreen onSubmit={loginWithPhone} isLoading={isLoading} error={error} />;
  }

  return (
    <View style={[styles.mainWrapper, { paddingTop: insets.top }]}>
      <Tab.Navigator
        initialRouteName="Menu"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: 'rgba(43, 33, 29, 0.45)',
          tabBarStyle: [
            styles.tabBar,
            { marginBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 14) : 18 },
          ],
          tabBarLabelStyle: styles.label,
        }}
      >
        <Tab.Screen
          name="Menu"
          component={HomeScreen}
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => <Home color={color} size={20} />,
          }}
        />

        <Tab.Screen
          name="Cart"
          component={CartScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              openCart();
            },
          }}
          options={{
            title: 'Cart',
            tabBarIcon: ({ color }) => (
              <View style={styles.cartIconWrap}>
                <ShoppingCart color={color} size={20} />
                {cartCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                  </View>
                )}
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="Orders"
          component={OrdersScreen}
          options={{
            title: 'Orders',
            tabBarIcon: ({ color }) => <List color={color} size={20} />,
          }}
        />

        <Tab.Screen name="Profile" options={{ title: 'Profile', tabBarIcon: ({ color }) => <User2 color={color} size={20} /> }}>
          {(props) => <ProfileScreen {...props} onLogout={logout} />}
        </Tab.Screen>
      </Tab.Navigator>

      <CartModal />
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabBar: {
    height: 74,
    marginHorizontal: 18,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.10)',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'none',
    margin: 0,
    padding: 0,
    marginBottom: 2,
  },
  cartIconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});