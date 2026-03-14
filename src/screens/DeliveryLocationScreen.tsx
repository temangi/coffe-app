import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import type { DeliveryMethod } from '../types';
import { useOrderFlowStore } from '../store/orderFlowStore';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';

const methods: Array<{ key: DeliveryMethod }> = [{ key: 'gps' }, { key: 'map' }, { key: 'manual' }];

export const DeliveryLocationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const setDeliveryLocation = useOrderFlowStore((s) => s.setDeliveryLocation);
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);

  const [method, setMethod] = useState<DeliveryMethod>('gps');
  const [address, setAddress] = useState('');
  const [coordsLabel, setCoordsLabel] = useState(t('delivery.pointNotSelected'));

  const selectCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const location = await Location.getCurrentPositionAsync({});
    const label = `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`;
    setCoordsLabel(label);
  };

  const onConfirm = () => {
    if (method === 'manual' && !address.trim()) return;

    const addressLine =
      method === 'gps'
        ? `Геолокация: ${coordsLabel}`
        : method === 'map'
          ? `Пин на карте: ${coordsLabel}`
          : address.trim();

    setDeliveryLocation({
      method,
      label: method === 'gps' ? t('delivery.gps') : method === 'map' ? t('delivery.map') : t('delivery.manual'),
      addressLine,
    });

    navigation.navigate('Payment');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={t('delivery.title')} subtitle={t('delivery.subtitle')} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: horizontal, paddingBottom: 130 }}>
        <View style={styles.segmentWrap}>
          {methods.map((item) => {
            const selected = method === item.key;
            return (
              <Pressable key={item.key} style={withPressFeedback([styles.segment, selected && styles.segmentActive])} onPress={() => setMethod(item.key)}>
                <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>{item.key === 'gps' ? t('delivery.gps') : item.key === 'map' ? t('delivery.map') : t('delivery.manual')}</Text>
              </Pressable>
            );
          })}
        </View>

        {method === 'gps' && (
          <View style={styles.card}>
            <Text style={styles.label}>Использовать текущее местоположение</Text>
            <Pressable style={withPressFeedback(styles.secondaryBtn)} onPress={selectCurrentLocation}>
              <Text style={styles.secondaryBtnText}>{t('delivery.detect')}</Text>
            </Pressable>
            <Text style={styles.helper}>{coordsLabel}</Text>
          </View>
        )}

        {method === 'map' && (
          <View style={styles.card}>
            <Text style={styles.label}>Выбор на карте</Text>
            <Text style={styles.helper}>Нажмите ниже, чтобы поставить пин и подтвердить точку.</Text>
            <Pressable style={withPressFeedback(styles.mapPlaceholder)} onPress={() => setCoordsLabel('42.8760, 74.6020')}>
              <Text style={styles.mapPlaceholderText}>Поставить пин</Text>
            </Pressable>
            <Text style={styles.helper}>{coordsLabel}</Text>
          </View>
        )}

        {method === 'manual' && (
          <View style={styles.card}>
            <Text style={styles.label}>Адрес вручную</Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Улица, дом, квартира, комментарий"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
            />
            <Text style={styles.helper}>Сохраненные адреса: Дом / Работа можно добавить в профиле.</Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingHorizontal: horizontal }]}> 
        <Text style={styles.validation}>Перед оплатой проверяется зона доставки. Вне зоны доступен самовывоз.</Text>
        <Pressable style={withPressFeedback(styles.cta)} onPress={onConfirm}>
          <Text style={styles.ctaText}>{t('delivery.confirm')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  segmentWrap: { marginTop: 4, gap: 8 },
  segment: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  segmentActive: { borderColor: colors.primary, backgroundColor: '#F9ECEC' },
  segmentText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  segmentTextActive: { color: colors.primary, fontWeight: '800' },
  card: { marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF', padding: 14 },
  label: { fontSize: 14, color: colors.text, fontWeight: '800' },
  helper: { marginTop: 8, color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  secondaryBtn: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  secondaryBtnText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  mapPlaceholder: {
    marginTop: 10,
    height: 130,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#F4ECE4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mapPlaceholderText: { color: colors.primary, fontWeight: '700', textAlign: 'center' },
  input: {
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text,
  },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 14, gap: 10 },
  validation: { color: colors.textMuted, fontSize: 11, textAlign: 'center' },
  cta: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});
