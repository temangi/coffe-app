import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '../theme/colors';
import { Navigation, MapPin, Phone, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Координаты центра Бишкека (Чуй/Эркиндик)
const BISHKEK_REGION = {
  latitude: 42.8746,
  longitude: 74.6122,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export const MapScreen: React.FC = () => {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Доступ к локации ограничен');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation(location);
    })();
  }, []);

  const centerToUser = () => {
    if (userLocation) {
      mapRef.current?.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={BISHKEK_REGION}
        customMapStyle={silverMapStyle} // Чистая карта без лишнего мусора
        showsUserLocation
        showsMyLocationButton={false}
      >
        <Marker
          coordinate={{ latitude: 42.8746, longitude: 74.6122 }}
          title="CoffeePoint Central"
        >
          <View style={styles.customMarker}>
            <View style={styles.markerInner}>
              <Text style={{ fontSize: 16 }}>☕️</Text>
            </View>
            <View style={styles.markerArrow} />
          </View>
        </Marker>
      </MapView>

      {/* Верхний заголовок поверх карты */}
      <SafeAreaView style={styles.headerOverlay}>
        <View style={styles.glassHeader}>
          <Text style={styles.headerTitle}>Найти нас</Text>
          <Text style={styles.headerSubtitle}>Бишкек, Кыргызстан</Text>
        </View>
      </SafeAreaView>

      {/* Плавающая карточка кофейни */}
      <View style={styles.bottomCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.shopName}>CoffeePoint Central</Text>
            <View style={styles.infoRow}>
              <Clock size={14} color="#8E8E93" />
              <Text style={styles.infoText}>08:00 - 22:00</Text>
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>Открыто</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.addressRow}>
          <MapPin size={18} color={colors.primary} />
          <Text style={styles.addressText}>пр. Чуй, 114 (напротив ЦУМа)</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryBtn}>
            <Navigation size={20} color="#FFF" />
            <Text style={styles.primaryBtnText}>Маршрут</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} onPress={centerToUser}>
             <Text style={{fontSize: 20}}>📍</Text>
          </TouchableOpacity>
        </View>
      </View>

      {errorMsg && (
        <View style={styles.errorToast}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
};

// Минималистичный стиль карты (Silver)
const silverMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }] }
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  map: { flex: 1 },
  
  // Header Overlay
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0 },
  glassHeader: {
    margin: 20,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 },
      android: { elevation: 5 }
    })
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1C1C1E' },
  headerSubtitle: { fontSize: 13, color: '#8E8E93', marginTop: 2 },

  // Custom Marker
  customMarker: { alignItems: 'center', justifyContent: 'center' },
  markerInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowOpacity: 0.2
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    marginTop: -2
  },

  // Bottom Floating Card
  bottomCard: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 28,
    padding: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.15, shadowRadius: 20 },
      android: { elevation: 10 }
    })
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  shopName: { fontSize: 20, fontWeight: '800', color: '#1C1C1E' },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  infoText: { fontSize: 13, color: '#8E8E93', marginLeft: 6 },
  statusBadge: { backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { color: '#2E7D32', fontSize: 12, fontWeight: '700' },
  
  divider: { height: 1, backgroundColor: '#F2F2F7', marginBottom: 16 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  addressText: { fontSize: 15, color: '#1C1C1E', marginLeft: 10, fontWeight: '500' },

  actionButtons: { flexDirection: 'row', gap: 12 },
  primaryBtn: { 
    flex: 1, 
    backgroundColor: colors.primary, 
    height: 56, 
    borderRadius: 18, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    gap: 8
  },
  primaryBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  secondaryBtn: { 
    width: 56, 
    height: 56, 
    backgroundColor: '#F2F2F7', 
    borderRadius: 18, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },

  errorToast: { position: 'absolute', top: 100, alignSelf: 'center', backgroundColor: '#FF3B30', padding: 12, borderRadius: 20 },
  errorText: { color: '#FFF', fontWeight: '600' }
});