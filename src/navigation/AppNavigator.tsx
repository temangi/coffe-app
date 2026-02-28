import React from 'react';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from '@react-navigation/material-top-tabs';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { Home, MapPin, ShoppingCart, User2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { CartScreen } from '../screens/CartScreen';
import { MapScreen } from '../screens/MapScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AuthScreen } from '../screens/AuthScreen';
import { useAuth } from '../hooks/useAuth';

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

export const AppNavigator = () => {
  const { isAuthenticated, isLoading, error, loginWithPhone, logout } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isAuthenticated) {
    return <AuthScreen onSubmit={loginWithPhone} isLoading={isLoading} error={error} />;
  }

  return (
    <View style={[styles.mainWrapper, { paddingTop: insets.top }]}>
      <Tab.Navigator
        tabBarPosition="bottom"
        initialRouteName="Home"
        screenOptions={({ route }): MaterialTopTabNavigationOptions => ({
          tabBarActiveTintColor: colors.primary || '#D17842',
          tabBarInactiveTintColor: '#AEA9A9',
          tabBarPressColor: 'transparent',
          tabBarShowLabel: true,
          tabBarShowIcon: true,
          tabBarLabelStyle: styles.label,
          tabBarIndicatorStyle: styles.indicator,
          tabBarStyle: [
            styles.tabBar,
            { marginBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 15) : 20 }
          ],
          swipeEnabled: true,
          tabBarIcon: ({ color }): React.ReactElement => {
            const size = 20;
            switch (route.name) {
              case 'Home': return <Home color={color} size={size} />;
              case 'Map': return <MapPin color={color} size={size} />;
              case 'Cart': return <ShoppingCart color={color} size={size} />;
              case 'Profile': return <User2 color={color} size={size} />;
              default: return <View />;
            }
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Меню' }} />
        <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Где мы' }} />
        <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Заказ' }} />
        <Tab.Screen name="Profile" options={{ title: 'Я' }}>
          {(props) => <ProfileScreen {...props} onLogout={logout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabBar: {
    height: 70,
    marginHorizontal: 20,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'none',
    margin: 0,
    padding: 0,
    marginBottom: 2,
  },
  indicator: {
    backgroundColor: colors.primary || '#D17842',
    height: 3,
    width: 40,
    borderRadius: 10,
    left: ((width - 40) / 4 - 40) / 20, 
    top: 0, 
  },
});