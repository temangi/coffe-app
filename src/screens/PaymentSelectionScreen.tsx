import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CreditCard, QrCode, Wallet } from 'lucide-react-native';
import { useCartStore } from '../store/cartStore';
import { useOrderFlowStore } from '../store/orderFlowStore';
import { useProfileStore } from '../store/profileStore';
import type { PaymentMethod } from '../types';
import { colors } from '../theme/colors';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';

const options: Array<{ key: PaymentMethod; subtitle: string; icon: React.ReactNode }> = [
  { key: 'qr', subtitle: 'Сгенерировать или сканировать QR', icon: <QrCode size={18} color={colors.primary} /> },
  { key: 'card', subtitle: 'Кредитная / дебетовая карта', icon: <CreditCard size={18} color={colors.primary} /> },
  { key: 'cash', subtitle: 'Оплата при получении', icon: <Wallet size={18} color={colors.primary} /> },
];

export const PaymentSelectionScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const { t } = useI18n();
  const { items, createOrderMock } = useCartStore();
  const addOrderToHistory = useProfileStore((s) => s.addOrderToHistory);
  const { paymentMethod, setPaymentMethod, deliveryLocation, setActiveOrder, clearDeliveryLocation } = useOrderFlowStore();

  const onPlaceOrder = () => {
    if (!items.length || !deliveryLocation) return;

    const order = createOrderMock({
      paymentMethod,
      deliveryLocation,
      comment: `Оплата: ${paymentMethod}`,
    });

    addOrderToHistory(order);
    setActiveOrder(order);
    clearDeliveryLocation();
    navigation.navigate('Confirmation');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={t('payment.title')} subtitle={t('payment.subtitle')} onBack={() => navigation.goBack()} />

      <View style={[styles.content, { paddingHorizontal: horizontal }]}>
        {options.map((item) => {
          const selected = item.key === paymentMethod;
          return (
            <Pressable key={item.key} style={withPressFeedback([styles.optionCard, selected && styles.optionCardSelected])} onPress={() => setPaymentMethod(item.key)}>
              <View style={styles.optionIcon}>{item.icon}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.optionTitle}>{item.key === 'qr' ? t('payment.qr') : item.key === 'card' ? t('payment.card') : t('payment.cash')}</Text>
                <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={[styles.radio, selected && styles.radioSelected]} />
            </Pressable>
          );
        })}
      </View>

      <View style={[styles.bottomBar, { paddingHorizontal: horizontal }]}>
        <Text style={styles.locationText}>{deliveryLocation?.addressLine ?? t('payment.locationFirst')}</Text>
        <Pressable
          style={withPressFeedback([styles.cta, (!items.length || !deliveryLocation) && styles.ctaDisabled])}
          disabled={!items.length || !deliveryLocation}
          onPress={onPlaceOrder}
        >
          <Text style={styles.ctaText}>{t('common.placeOrder')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { marginTop: 6, gap: 10 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  optionCardSelected: { borderColor: colors.primary, backgroundColor: '#F9ECEC' },
  optionIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F7ECE3', alignItems: 'center', justifyContent: 'center' },
  optionTitle: { color: colors.text, fontWeight: '800', fontSize: 14 },
  optionSubtitle: { color: colors.textMuted, marginTop: 3, fontSize: 12 },
  radio: { width: 18, height: 18, borderRadius: 999, borderWidth: 2, borderColor: colors.border },
  radioSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  bottomBar: { marginTop: 'auto', paddingBottom: 16 },
  locationText: { color: colors.textMuted, fontSize: 12, marginBottom: 10 },
  cta: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: { opacity: 0.45 },
  ctaText: { color: '#FFF', fontWeight: '800', fontSize: 14 },
});
