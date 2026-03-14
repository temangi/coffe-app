import React, { useMemo } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Trash2 } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useCartStore } from '../store/cartStore';
import { useOrderFlowStore } from '../store/orderFlowStore';
import { colors } from '../theme/colors';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';

export const CartScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const { t } = useI18n();
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice } = useCartStore();
  const deliveryLocation = useOrderFlowStore((s) => s.deliveryLocation);

  const subtotal = totalPrice();
  const delivery = subtotal > 0 ? 120 : 0;
  const taxes = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + taxes;

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={t('cart.title')} subtitle={`${items.length} ${t('cart.subtitle')}`} />

      <FlatList
        data={items}
        keyExtractor={(item) => `${item.product.id}:${item.option.id}`}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: horizontal }]}
        ListEmptyComponent={<Text style={styles.empty}>{t('cart.empty')}</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.product.name}</Text>
              <Text style={styles.meta}>
                {item.option.grams} • {item.option.price} сом
              </Text>
              {item.customization?.extras.length ? (
                <Text style={styles.meta} numberOfLines={1}>
                  {t('cart.extras')}: {item.customization.extras.join(', ')}
                </Text>
              ) : null}
            </View>
            <View style={styles.controls}>
              <Pressable
                style={withPressFeedback(styles.iconBtn)}
                onPress={() => decreaseQuantity({ productId: item.product.id, optionId: item.option.id, customization: item.customization })}
              >
                <Minus size={15} color={colors.text} />
              </Pressable>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Pressable
                style={withPressFeedback(styles.iconBtn)}
                onPress={() => increaseQuantity({ productId: item.product.id, optionId: item.option.id, customization: item.customization })}
              >
                <Plus size={15} color={colors.text} />
              </Pressable>
            </View>
            <Pressable
              style={withPressFeedback(styles.deleteBtn)}
              onPress={() => removeFromCart({ productId: item.product.id, optionId: item.option.id, customization: item.customization })}
            >
              <Trash2 size={15} color={colors.textMuted} />
            </Pressable>
          </View>
        )}
      />

      <View style={[styles.summary, { left: horizontal, right: horizontal }]}> 
        <Line label={t('cart.subtotal')} value={`${subtotal} сом`} />
        <Line label={t('cart.delivery')} value={`${delivery} сом`} />
        <Line label={t('cart.service')} value={`${taxes} сом`} />
        <Line label={t('cart.total')} value={`${total} сом`} strong />

        <Pressable style={withPressFeedback([styles.cta, !items.length && styles.ctaDisabled])} disabled={!items.length} onPress={() => navigation.navigate('Delivery')}>
          <Text style={styles.ctaText}>{deliveryLocation ? t('common.continueToPayment') : t('common.setDeliveryAddress')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const Line: React.FC<{ label: string; value: string; strong?: boolean }> = ({ label, value, strong }) => (
  <View style={styles.line}>
    <Text style={[styles.lineLabel, strong && styles.lineStrong]}>{label}</Text>
    <Text style={[styles.lineValue, strong && styles.lineStrong]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  listContent: { paddingTop: 8, paddingBottom: 220, gap: 10 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 40 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  name: { color: colors.text, fontWeight: '800', fontSize: 15 },
  meta: { color: colors.textMuted, marginTop: 4, fontSize: 12 },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 30, height: 30, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8EFE7' },
  qty: { minWidth: 18, textAlign: 'center', fontWeight: '800', color: colors.text },
  deleteBtn: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6EEEA' },
  summary: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  line: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  lineLabel: { color: colors.textMuted, fontSize: 13 },
  lineValue: { color: colors.text, fontSize: 13, fontWeight: '700' },
  lineStrong: { fontWeight: '900', color: colors.text },
  cta: { marginTop: 10, backgroundColor: colors.primary, borderRadius: 12, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  ctaDisabled: { opacity: 0.5 },
  ctaText: { color: '#FFF', fontSize: 14, fontWeight: '800' },
});
