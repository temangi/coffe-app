import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CheckCircle2 } from 'lucide-react-native';
import { useOrderFlowStore } from '../store/orderFlowStore';
import { colors } from '../theme/colors';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';

export const OrderConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const order = useOrderFlowStore((s) => s.activeOrder);
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const { t } = useI18n();

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={t('confirmation.title')} subtitle={`#${order?.id.slice(-6) ?? 'CFA-2041'}`} />

      <View style={[styles.content, { paddingHorizontal: horizontal }]}>
        <View style={styles.centered}>
          <CheckCircle2 size={66} color={colors.success} />
          <Text style={styles.title}>{t('confirmation.thanks')}</Text>
          <Text style={styles.subtitle}>Мы уже начали готовить. Уведомим, когда заказ будет готов.</Text>
        </View>

        <View style={styles.card}>
          <Line label="Время приготовления" value={`${order?.estimatedPrepMinutes ?? 12} мин`} />
          <Line label="Ожидаемая доставка" value="20-30 мин" />
          <Line label="Оплата" value={(order?.paymentMethod ?? 'card').replace('_', ' ')} />
          <Line label="Адрес" value={order?.deliveryLocation?.addressLine ?? '-'} />
        </View>
      </View>

      <View style={[styles.actions, { paddingHorizontal: horizontal }]}> 
        <Pressable
          style={withPressFeedback(styles.secondaryBtn)}
          onPress={() => navigation.navigate('Tabs', { screen: 'Menu' })}
        >
          <Text style={styles.secondaryText}>{t('confirmation.reorderLater')}</Text>
        </Pressable>
        <Pressable style={withPressFeedback(styles.primaryBtn)} onPress={() => navigation.navigate('Tracking')}>
          <Text style={styles.primaryText}>{t('confirmation.track')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const Line: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.line}>
    <Text style={styles.lineLabel}>{label}</Text>
    <Text style={styles.lineValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { marginTop: 8 },
  centered: { alignItems: 'center', marginTop: 10 },
  title: { marginTop: 14, fontSize: 24, fontWeight: '900', color: colors.text, textAlign: 'center' },
  subtitle: { marginTop: 8, fontSize: 13, color: colors.textMuted, textAlign: 'center', lineHeight: 18 },
  card: {
    marginTop: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
    padding: 14,
    gap: 10,
  },
  line: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  lineLabel: { color: colors.textMuted, fontSize: 12 },
  lineValue: { color: colors.text, fontSize: 12, fontWeight: '700', flex: 1, textAlign: 'right' },
  actions: { marginTop: 'auto', gap: 10, paddingBottom: 14 },
  secondaryBtn: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  secondaryText: { color: colors.primary, fontWeight: '700' },
  primaryBtn: {
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { color: '#FFF', fontWeight: '800' },
});
