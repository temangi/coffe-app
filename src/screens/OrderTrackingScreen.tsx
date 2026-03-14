import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useOrderFlowStore } from '../store/orderFlowStore';
import { colors } from '../theme/colors';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';

export const OrderTrackingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const order = useOrderFlowStore((s) => s.activeOrder);
  const [step, setStep] = useState(1);
  const [pushEnabled, setPushEnabled] = useState(true);
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const { t } = useI18n();
  const statuses = [t('tracking.orderReceived'), t('tracking.preparing'), t('tracking.out'), t('tracking.done')];

  const eta = useMemo(() => Math.max(5, 22 - step * 5), [step]);

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={t('tracking.title')} subtitle={`#${order?.id.slice(-6) ?? 'CFA-2041'}`} />

      <View style={[styles.content, { paddingHorizontal: horizontal }]}>
        <View style={styles.progressCard}>
          {statuses.map((status, index) => {
            const active = index <= step;
            return (
              <View key={status} style={styles.timelineRow}>
                <View style={[styles.timelineDot, active && styles.timelineDotActive]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.statusText, active && styles.statusTextActive]}>{status}</Text>
                  <Text style={styles.timeText}>{active ? `${8 + index * 3}:0${index}` : '--:--'}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.metaCard}>
          <Text style={styles.metaTitle}>Осталось примерно: {eta} мин</Text>
          <Text style={styles.metaText}>Время приготовления: {order?.estimatedPrepMinutes ?? 12} мин</Text>
          <Text style={styles.metaText}>Карта курьера появится при начале доставки.</Text>
          <View style={styles.pushRow}>
            <Text style={styles.metaText}>Push-уведомления о готовности</Text>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: colors.primary }} />
          </View>
        </View>
      </View>

      <View style={[styles.bottomActions, { paddingHorizontal: horizontal }]}>
        <Pressable style={withPressFeedback(styles.secondaryBtn)} onPress={() => navigation.navigate('Orders')}>
          <Text style={styles.secondaryText}>{t('tracking.history')}</Text>
        </Pressable>
        <Pressable style={withPressFeedback(styles.primaryBtn)} onPress={() => setStep((prev) => (prev >= statuses.length - 1 ? prev : prev + 1))}>
          <Text style={styles.primaryText}>{t('tracking.update')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { marginTop: 6 },
  progressCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
    padding: 14,
    gap: 10,
  },
  timelineRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  timelineDot: { width: 12, height: 12, borderRadius: 999, backgroundColor: '#DCCFC3', marginTop: 3 },
  timelineDotActive: { backgroundColor: colors.success },
  statusText: { color: colors.textMuted, fontWeight: '600' },
  statusTextActive: { color: colors.text, fontWeight: '800' },
  timeText: { marginTop: 2, color: colors.textMuted, fontSize: 11 },
  metaCard: {
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
    padding: 14,
    gap: 8,
  },
  metaTitle: { color: colors.text, fontSize: 16, fontWeight: '800' },
  metaText: { color: colors.textMuted, fontSize: 12 },
  pushRow: { marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  bottomActions: { marginTop: 'auto', gap: 10, paddingBottom: 14 },
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
