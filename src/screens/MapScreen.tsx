import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '../theme/colors';

const COFFEE_SHOP_REGION: Region = {
  latitude: 55.7558,
  longitude: 37.6173,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

export const MapScreen: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Нет доступа к геолокации');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Наши кофейни</Text>
        <MapView
          style={styles.map}
          initialRegion={COFFEE_SHOP_REGION}
        >
          <Marker
            coordinate={{
              latitude: COFFEE_SHOP_REGION.latitude,
              longitude: COFFEE_SHOP_REGION.longitude,
            }}
            title="CoffeePoint"
            description="Главная кофейня"
          />
          {userLocation && (
            <Marker
              coordinate={{
                latitude: userLocation.coords.latitude,
                longitude: userLocation.coords.longitude,
              }}
              pinColor="#2E86DE"
              title="Вы здесь"
            />
          )}
        </MapView>
        {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  map: {
    flex: 1,
  },
  error: {
    textAlign: 'center',
    padding: 8,
    color: '#D64545',
    backgroundColor: '#FFF0F0',
  },
});

