import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../store/cartStore';
import { useProfileStore } from '../store/profileStore';
import { colors } from '../theme/colors';

type PaymentMethod = 'card' | 'cash';

export const CartScreen: React.FC = () => {
  const { items, increaseQuantity, decreaseQuantity, totalPrice, createOrderMock } =
    useCartStore();
  const addOrderToHistory = useProfileStore((s) => s.addOrderToHistory);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [comment, setComment] = useState('');
  const [successAnim] = useState(new Animated.Value(0));

  const handleCheckout = () => {
    if (!items.length) return;
    const order = createOrderMock({ paymentMethod, comment });
    addOrderToHistory(order);
    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(successAnim, {
        toValue: 0,
        delay: 900,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setComment('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Корзина</Text>

        <FlatList
          data={items}
          keyExtractor={(item) => item.product.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Ваша корзина пуста.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.product.name}</Text>
                <Text style={styles.itemPrice}>
                  {item.product.price} ₽ x {item.quantity}
                </Text>
              </View>
              <View style={styles.counter}>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => decreaseQuantity(item.product.id)}
                >
                  <Text style={styles.counterText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.counterValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={styles.counterButton}
                  onPress={() => increaseQuantity(item.product.id)}
                >
                  <Text style={styles.counterText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />

        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Итого:</Text>
            <Text style={styles.totalValue}>{totalPrice()} ₽</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.sectionLabel}>Способ оплаты</Text>
            <View style={styles.paymentChips}>
              <TouchableOpacity
                style={[
                  styles.paymentChip,
                  paymentMethod === 'card' && styles.paymentChipActive,
                ]}
                onPress={() => setPaymentMethod('card')}
              >
                <Text
                  style={[
                    styles.paymentChipText,
                    paymentMethod === 'card' && styles.paymentChipTextActive,
                  ]}
                >
                  Карта
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.paymentChip,
                  paymentMethod === 'cash' && styles.paymentChipActive,
                ]}
                onPress={() => setPaymentMethod('cash')}
              >
                <Text
                  style={[
                    styles.paymentChipText,
                    paymentMethod === 'cash' && styles.paymentChipTextActive,
                  ]}
                >
                  Наличные
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.commentBlock}>
            <Text style={styles.sectionLabel}>Комментарий к заказу</Text>
            <TextInput
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
              placeholder="Например: без сахара, позвонить при доставке..."
              placeholderTextColor={colors.textMuted}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[
              styles.checkoutButton,
              !items.length && styles.checkoutButtonDisabled,
            ]}
            onPress={handleCheckout}
            disabled={!items.length}
          >
            <Text style={styles.checkoutButtonText}>Оформить заказ</Text>
          </TouchableOpacity>

          <Animated.View
            style={[
              styles.successToast,
              {
                opacity: successAnim,
                transform: [
                  {
                    translateY: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                  {
                    scale: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.successText}>Заказ оформлен!</Text>
          </Animated.View>
        </View>
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  listContent: {
    paddingVertical: 16,
    paddingBottom: 120,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: colors.textMuted,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  itemPrice: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textMuted,
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterButton: {
    width: 28,
    height: 28,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 18,
    color: colors.text,
  },
  counterValue: {
    marginHorizontal: 8,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: colors.textMuted,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  paymentRow: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: 6,
  },
  paymentChips: {
    flexDirection: 'row',
  },
  paymentChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  paymentChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  paymentChipText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  paymentChipTextActive: {
    color: '#fff',
  },
  commentBlock: {
    marginBottom: 12,
  },
  commentInput: {
    minHeight: 60,
    maxHeight: 100,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    fontSize: 14,
    color: colors.text,
  },
  checkoutButton: {
    height: 52,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  checkoutButtonDisabled: {
    backgroundColor: colors.border,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  successToast: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 80,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  successText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

