import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../store/cartStore';
import { useProfileStore } from '../store/profileStore';
import { colors } from '../theme/colors';
import { CreditCard, MessageSquare } from 'lucide-react-native';

type PaymentMethod = 'card' | 'cash';

export const CartScreen: React.FC = () => {
  const { items, increaseQuantity, decreaseQuantity, totalPrice, createOrderMock } = useCartStore();
  const addOrderToHistory = useProfileStore((s) => s.addOrderToHistory);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [comment, setComment] = useState('');
  const [successAnim] = useState(new Animated.Value(0));

  const handleCheckout = () => {
    if (!items.length) return;
    const order = createOrderMock({ paymentMethod, comment });
    addOrderToHistory(order);
    
    Animated.spring(successAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        Animated.timing(successAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }, 2000);
    });
    setComment('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Мой заказ</Text>
        <Text style={styles.countText}>{items.length} позиции</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛒</Text>
            <Text style={styles.emptyText}>Корзина пока пуста</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.product.name}</Text>
              <Text style={styles.itemCategory}>{item.product.category}</Text>
              <Text style={styles.itemPrice}>{item.product.price} ⃀</Text>
            </View>
            
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => decreaseQuantity(item.product.id)}
              >
                <Text style={styles.stepText}>—</Text>
              </TouchableOpacity>
              <Text style={styles.stepValue}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.stepButton}
                onPress={() => increaseQuantity(item.product.id)}
              >
                <Text style={styles.stepText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.optionsCard}>
          <View style={styles.paymentSection}>
            <View style={styles.sectionHeader}>
              <CreditCard size={16} color="#8E8E93" />
              <Text style={styles.sectionTitle}>Способ оплаты</Text>
            </View>
            <View style={styles.tabs}>
              <TouchableOpacity
                style={[styles.tab, paymentMethod === 'card' && styles.tabActive]}
                onPress={() => setPaymentMethod('card')}
              >
                <Text style={[styles.tabText, paymentMethod === 'card' && styles.tabTextActive]}>Картой</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, paymentMethod === 'cash' && styles.tabActive]}
                onPress={() => setPaymentMethod('cash')}
              >
                <Text style={[styles.tabText, paymentMethod === 'cash' && styles.tabTextActive]}>Наличные</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.commentSection}>
            <View style={styles.sectionHeader}>
              <MessageSquare size={16} color="#8E8E93" />
              <Text style={styles.sectionTitle}>Комментарий</Text>
            </View>
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={setComment}
              placeholder="Добавить пожелания..."
              placeholderTextColor="#AEA9A9"
              multiline
            />
          </View>
        </View>

        <View style={styles.checkoutContainer}>
          <View style={styles.priceBlock}>
            <Text style={styles.totalLabel}>К оплате</Text>
            <Text style={styles.totalValue}>{totalPrice()} ⃀</Text>
          </View>
          
          <TouchableOpacity
            style={[styles.payButton, !items.length && styles.payButtonDisabled]}
            onPress={handleCheckout}
            disabled={!items.length}
          >
            <Text style={styles.payButtonText}>Заказать</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={[styles.toast, { 
        opacity: successAnim,
        transform: [{ translateY: successAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0]
        })}] 
      }]}>
        <Text style={styles.toastText}>🎉 Заказ успешно принят!</Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingHorizontal: 24, 
    paddingVertical: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { fontSize: 28, fontWeight: '800', color: '#1C1C1E' },
  countText: { fontSize: 14, color: '#8E8E93', fontWeight: '600' },
  listContent: { paddingHorizontal: 24, paddingTop: 10, paddingBottom: 320 },
  
  itemCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8 },
      android: { elevation: 3 }
    })
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: '#1C1C1E' },
  itemCategory: { fontSize: 12, color: '#AEA9A9', marginTop: 2 },
  itemPrice: { fontSize: 16, fontWeight: '800', color: colors.primary, marginTop: 6 },
  
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
  },
  stepButton: { width: 32, height: 32, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 8 },
  stepText: { fontSize: 16, fontWeight: '600' },
  stepValue: { marginHorizontal: 12, fontSize: 16, fontWeight: '700' },

  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 24, 
    backgroundColor: 'rgba(248, 249, 250, 0.98)' 
  },
  optionsCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  paymentSection: { paddingBottom: 4 },
  commentSection: { paddingTop: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { 
    fontSize: 12, 
    fontWeight: '700', 
    color: '#8E8E93', 
    marginLeft: 8, 
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  
  tabs: { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#FFF', elevation: 2, shadowOpacity: 0.05 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#8E8E93' },
  tabTextActive: { color: '#1C1C1E' },
  
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 16 },
  input: { fontSize: 15, color: '#1C1C1E', paddingVertical: 4 },

  checkoutContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceBlock: { flex: 1 },
  totalLabel: { fontSize: 14, color: '#8E8E93', fontWeight: '500' },
  totalValue: { fontSize: 24, fontWeight: '800', color: '#1C1C1E' },
  payButton: { 
    backgroundColor: colors.primary, 
    paddingHorizontal: 32, 
    paddingVertical: 16, 
    borderRadius: 18,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  payButtonDisabled: { backgroundColor: '#E5E5EA', shadowOpacity: 0 },
  payButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },

  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyEmoji: { fontSize: 50, marginBottom: 16 },
  emptyText: { fontSize: 16, color: '#8E8E93', fontWeight: '500' },

  toast: { 
    position: 'absolute', 
    bottom: 120, 
    alignSelf: 'center', 
    backgroundColor: '#1C1C1E', 
    paddingHorizontal: 24, 
    paddingVertical: 14, 
    borderRadius: 30 
  },
  toastText: { color: '#FFF', fontWeight: '700' }
});