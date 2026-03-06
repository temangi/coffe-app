import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Modal,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Minus, Plus, Trash2, X, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useCartStore } from '../store/cartStore';
import { useProfileStore } from '../store/profileStore';
import { useCartUIStore } from '../store/cartUIStore';
import type { PaymentMethod } from '../types';
import { PaymentScreen } from './PaymentScreen';

const { height: SCREEN_H, width: SCREEN_W } = Dimensions.get('window');
const SHEET_TOP_GAP = 80;
const SHEET_H = SCREEN_H - SHEET_TOP_GAP;

export const CartModal: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { isOpen, step, closeCart, goToPayment, backToCart } = useCartUIStore();
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, totalPrice, createOrderMock } =
    useCartStore();
  const addOrderToHistory = useProfileStore((s) => s.addOrderToHistory);

  const [modalVisible, setModalVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');

  const sheetY = useRef(new Animated.Value(SHEET_H)).current;
  const backdrop = useRef(new Animated.Value(0)).current;
  const stepAnim = useRef(new Animated.Value(0)).current;
  const toastAnim = useRef(new Animated.Value(0)).current;

  const itemCount = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity, 0),
    [items],
  );

  useEffect(() => {
    if (isOpen) {
      setModalVisible(true);
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.spring(sheetY, {
          toValue: 0,
          tension: 140,
          friction: 18,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (modalVisible) {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(sheetY, {
          toValue: SHEET_H,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setModalVisible(false);
      });
    }
  }, [backdrop, isOpen, modalVisible, sheetY]);

  useEffect(() => {
    Animated.timing(stepAnim, {
      toValue: step === 'payment' ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [step, stepAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => g.dy > 8 && Math.abs(g.vy) > 0.05,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) sheetY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        const shouldClose = g.dy > 140 || g.vy > 1.25;
        if (shouldClose) closeCart();
        else {
          Animated.spring(sheetY, {
            toValue: 0,
            tension: 160,
            friction: 20,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
  ).current;

  const bumpHaptic = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
  };

  const onCheckout = async () => {
    if (!items.length) return;
    await bumpHaptic();
    goToPayment();
  };

  const onPay = async () => {
    if (!items.length) return;
    await bumpHaptic();
    const order = createOrderMock({ paymentMethod });
    addOrderToHistory(order);

    Animated.sequence([
      Animated.spring(toastAnim, { toValue: 1, tension: 120, friction: 14, useNativeDriver: true }),
      Animated.delay(1400),
      Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    closeCart();
  };

  const closeOpacity = sheetY.interpolate({
    inputRange: [0, 120],
    outputRange: [1, 0.85],
    extrapolate: 'clamp',
  });

  if (!modalVisible) return null;

  return (
    <Modal visible={modalVisible} transparent animationType="none" onRequestClose={closeCart}>
      <Animated.View style={[styles.backdrop, { opacity: backdrop }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeCart} />
      </Animated.View>

      <Animated.View
        style={[
          styles.sheet,
          {
            height: SHEET_H + insets.bottom,
            paddingBottom: Math.max(insets.bottom, 12),
            transform: [{ translateY: sheetY }],
            opacity: closeOpacity,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.handle} />

        <View style={styles.sheetHeader}>
          {step === 'payment' ? (
            <Pressable onPress={backToCart} style={styles.headerIconBtn}>
              <ArrowLeft size={18} color={colors.text} />
            </Pressable>
          ) : (
            <View style={{ width: 40 }} />
          )}

          <View style={{ alignItems: 'center' }}>
            <Text style={styles.sheetTitle}>{step === 'payment' ? 'Payment' : 'Your order'}</Text>
            <Text style={styles.sheetSubtitle}>{itemCount} items • {totalPrice()} som</Text>
          </View>

          <Pressable onPress={closeCart} style={styles.headerIconBtn}>
            <X size={18} color={colors.text} />
          </Pressable>
        </View>

        <Animated.View
          style={{
            flex: 1,
            flexDirection: 'row',
            width: SCREEN_W * 2,
            transform: [
              {
                translateX: stepAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -SCREEN_W],
                }),
              },
            ],
          }}
        >
          {/* Cart step */}
          <View style={{ width: SCREEN_W, paddingHorizontal: 18 }}>
            <FlatList
              data={items}
              keyExtractor={(it) => `${it.product.id}:${it.option.id}`}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 120, paddingTop: 6 }}
              ListEmptyComponent={
                <View style={styles.empty}>
                  <Text style={styles.emptyIcon}>🛒</Text>
                  <Text style={styles.emptyTitle}>Cart is empty</Text>
                  <Text style={styles.emptySub}>Add dishes from the menu to begin.</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={styles.cartRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {item.product.name}
                    </Text>
                    <Text style={styles.itemMeta}>
                      {item.option.grams} g • {item.option.price} som
                    </Text>
                  </View>

                  <View style={styles.stepper}>
                    <Pressable
                      onPress={async () => {
                        await bumpHaptic();
                        decreaseQuantity({ productId: item.product.id, optionId: item.option.id });
                      }}
                      style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
                      hitSlop={10}
                    >
                      <Minus size={16} color={colors.text} />
                    </Pressable>
                    <Text style={styles.qty}>{item.quantity}</Text>
                    <Pressable
                      onPress={async () => {
                        await bumpHaptic();
                        increaseQuantity({ productId: item.product.id, optionId: item.option.id });
                      }}
                      style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
                      hitSlop={10}
                    >
                      <Plus size={16} color={colors.text} />
                    </Pressable>
                  </View>

                  <Pressable
                    onPress={async () => {
                      await bumpHaptic();
                      removeFromCart({ productId: item.product.id, optionId: item.option.id });
                    }}
                    style={({ pressed }) => [styles.removeBtn, pressed && styles.removeBtnPressed]}
                    hitSlop={10}
                  >
                    <Trash2 size={16} color={colors.textMuted} />
                  </Pressable>
                </View>
              )}
            />

            <View style={styles.footer}>
              <View style={styles.totalBlock}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{totalPrice()} som</Text>
              </View>
              <Pressable
                onPress={onCheckout}
                disabled={!items.length}
                style={({ pressed }) => [
                  styles.cta,
                  pressed && items.length ? styles.ctaPressed : null,
                  !items.length ? styles.ctaDisabled : null,
                ]}
              >
                <Text style={styles.ctaText}>CHECKOUT</Text>
              </Pressable>
            </View>
          </View>

          {/* Payment step */}
          <View style={{ width: SCREEN_W, paddingHorizontal: 18 }}>
            <View style={{ paddingTop: 6 }}>
              <PaymentScreen
                value={paymentMethod}
                onChange={setPaymentMethod}
                onPay={onPay}
                disabled={!items.length}
              />
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.toast,
          {
            opacity: toastAnim,
            transform: [
              {
                translateY: toastAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.toastText}>Order confirmed. Thank you!</Text>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.10)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -18 },
        shadowOpacity: 0.10,
        shadowRadius: 26,
      },
      android: { elevation: 14 },
    }),
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(43, 33, 29, 0.18)',
    marginTop: 10,
    marginBottom: 12,
  },
  sheetHeader: {
    paddingHorizontal: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: 0.4,
  },
  sheetSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.10)',
  },
  empty: {
    marginTop: 36,
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
  cartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.10)',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '900',
    color: colors.text,
  },
  itemMeta: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(247, 240, 230, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.08)',
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.10)',
  },
  stepBtnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  qty: {
    minWidth: 18,
    textAlign: 'center',
    fontWeight: '900',
    color: colors.text,
  },
  removeBtn: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.08)',
  },
  removeBtnPressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },

  footer: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 12,
    gap: 10,
  },
  totalBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.10)',
  },
  totalLabel: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  totalValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '900',
  },
  cta: {
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaPressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  ctaDisabled: { backgroundColor: 'rgba(43, 33, 29, 0.22)', shadowOpacity: 0, elevation: 0 },
  ctaText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },

  toast: {
    position: 'absolute',
    bottom: 110,
    alignSelf: 'center',
    backgroundColor: 'rgba(43, 33, 29, 0.92)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  toastText: {
    color: '#FFF',
    fontWeight: '900',
    letterSpacing: 0.2,
  },
});

