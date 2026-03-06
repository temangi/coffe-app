import React, { useMemo } from 'react';
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useProfileStore } from '../store/profileStore';

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif' });

export const OrdersScreen: React.FC = () => {
  const orders = useProfileStore((s) => s.orders);

  const data = useMemo(() => orders, [orders]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Orders</Text>
        <Text style={styles.subtitle}>{data.length} total</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(o) => o.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🧾</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySub}>When you place an order, it will appear here.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderTitle}>Order #{item.id.slice(-4)}</Text>
              <Text style={styles.orderMeta}>
                {new Date(item.createdAt).toLocaleString()}
              </Text>
              <Text style={styles.orderMeta}>
                {item.items.reduce((sum, it) => sum + it.quantity, 0)} items • {item.total} som
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.paymentMethod.replace('_', ' ')}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    fontFamily: SERIF,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '800',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 120,
  },
  empty: {
    marginTop: 70,
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  emptyIcon: { fontSize: 44, marginBottom: 10 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: colors.text,
  },
  emptySub: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    marginBottom: 12,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.10)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
      },
      android: { elevation: 3 },
    }),
  },
  cardPressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
  orderTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
  },
  orderMeta: {
    marginTop: 6,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(224, 122, 47, 0.10)',
    borderWidth: 1,
    borderColor: 'rgba(224, 122, 47, 0.30)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});

