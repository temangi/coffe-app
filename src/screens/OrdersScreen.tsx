import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useProfileStore } from '../store/profileStore';
import { useCartStore } from '../store/cartStore';
import { colors } from '../theme/colors';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';

export const OrdersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const { t } = useI18n();
  const orders = useProfileStore((s) => s.orders);
  const addToCart = useCartStore((s) => s.addToCart);

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={t('orders.title')} subtitle={t('orders.subtitle')} />

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingHorizontal: horizontal }]}
        ListEmptyComponent={<Text style={styles.empty}>{t('orders.empty')}</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderTitle}>Заказ #{item.id.slice(-6)}</Text>
              <Text style={styles.orderMeta}>{new Date(item.createdAt).toLocaleString()}</Text>
              <Text style={styles.orderMeta}>{item.items.reduce((sum, line) => sum + line.quantity, 0)} {t('orders.items')} • {item.total} сом</Text>
            </View>
            <View style={styles.actions}>
              <Pressable style={withPressFeedback(styles.secondaryBtn)} onPress={() => navigation.navigate('Tracking')}>
                <Text style={styles.secondaryBtnText}>{t('orders.track')}</Text>
              </Pressable>
              <Pressable
                style={withPressFeedback(styles.primaryBtn)}
                onPress={() => {
                  item.items.forEach((line) => addToCart({ product: line.product, option: line.option, customization: line.customization }));
                  navigation.navigate('Cart');
                }}
              >
                <Text style={styles.primaryBtnText}>{t('orders.reorder')}</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 8, paddingBottom: 120, gap: 10 },
  empty: { marginTop: 40, textAlign: 'center', color: colors.textMuted, fontSize: 13 },
  card: { padding: 14, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  orderTitle: { color: colors.text, fontWeight: '800', fontSize: 15 },
  orderMeta: { marginTop: 4, color: colors.textMuted, fontSize: 12 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  secondaryBtn: { flex: 1, minHeight: 40, borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },
  secondaryBtnText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  primaryBtn: { flex: 1, minHeight: 40, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText: { color: '#FFF', fontWeight: '800', fontSize: 12 },
});
