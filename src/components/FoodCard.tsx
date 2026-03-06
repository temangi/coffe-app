import React, { memo, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import type { PortionOption, Product } from '../types';
import { colors } from '../theme/colors';

type Props = {
  item: Product;
  onAddToCart: (payload: { product: Product; option: PortionOption }) => void;
};

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif' });

export const FoodCard = memo<Props>(({ item, onAddToCart }) => {
  const options = item.options?.length
    ? item.options
    : [
        { id: '250', grams: 250, price: item.price },
        { id: '160', grams: 160, price: Math.max(0, Math.round(item.price * 0.7)) },
      ];

  const defaultOptionId = options[0]!.id;
  const [selectedId, setSelectedId] = useState(defaultOptionId);

  const selectedOption = useMemo(
    () => options.find((o) => o.id === selectedId) ?? options[0]!,
    [options, selectedId],
  );

  const pressAnim = useRef(new Animated.Value(1)).current;
  const cardAnim = useRef(new Animated.Value(1)).current;

  const onCardPressIn = () => {
    Animated.spring(cardAnim, {
      toValue: 0.99,
      tension: 180,
      friction: 18,
      useNativeDriver: true,
    }).start();
  };

  const onCardPressOut = () => {
    Animated.spring(cardAnim, {
      toValue: 1,
      tension: 180,
      friction: 18,
      useNativeDriver: true,
    }).start();
  };

  const onButtonPressIn = () => {
    Animated.spring(pressAnim, {
      toValue: 0.98,
      tension: 220,
      friction: 16,
      useNativeDriver: true,
    }).start();
  };

  const onButtonPressOut = () => {
    Animated.spring(pressAnim, {
      toValue: 1,
      tension: 220,
      friction: 16,
      useNativeDriver: true,
    }).start();
  };

  const handleAdd = async () => {
    onAddToCart({ product: item, option: selectedOption });
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: cardAnim }] }]}>
      <Pressable onPressIn={onCardPressIn} onPressOut={onCardPressOut} style={styles.cardPress}>
        <View style={styles.ornamentBorder} pointerEvents="none">
          <View style={[styles.corner, styles.cornerTL]} />
          <View style={[styles.corner, styles.cornerTR]} />
          <View style={[styles.corner, styles.cornerBL]} />
          <View style={[styles.corner, styles.cornerBR]} />
        </View>

        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.iconBadge}>
            <Text style={styles.iconText}>✦</Text>
          </View>
        </View>

        <View style={styles.imageWrap}>
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={item.name}
            />
          ) : (
            <View style={styles.imageFallback}>
              <Text style={styles.imageFallbackText}>{item.name.slice(0, 1).toUpperCase()}</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.priceBlock}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{options[0]!.grams} g</Text>
            <Text style={styles.priceValue}>{options[0]!.price} som</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{options[1]!.grams} g</Text>
            <Text style={styles.priceValue}>{options[1]!.price} som</Text>
          </View>
        </View>

        <View style={styles.selector}>
          {options.slice(0, 2).map((opt) => {
            const active = opt.id === selectedId;
            return (
              <Pressable
                key={opt.id}
                onPress={() => setSelectedId(opt.id)}
                style={[styles.selectorPill, active && styles.selectorPillActive]}
              >
                <Text style={[styles.selectorText, active && styles.selectorTextActive]}>
                  {opt.grams} g
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Animated.View style={{ transform: [{ scale: pressAnim }] }}>
          <Pressable
            onPress={handleAdd}
            onPressIn={onButtonPressIn}
            onPressOut={onButtonPressOut}
            style={({ pressed }) => [
              styles.addBtn,
              pressed && styles.addBtnPressed,
            ]}
          >
            <Text style={styles.addBtnText}>ADD TO ORDER</Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});

FoodCard.displayName = 'FoodCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 18,
      },
      android: { elevation: 4 },
    }),
  },
  cardPress: {
    gap: 12,
  },
  ornamentBorder: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(224, 122, 47, 0.18)',
    borderRadius: 16,
  },
  corner: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderColor: 'rgba(224, 122, 47, 0.35)',
  },
  cornerTL: { top: 8, left: 8, borderTopWidth: 1, borderLeftWidth: 1, borderTopLeftRadius: 4 },
  cornerTR: { top: 8, right: 8, borderTopWidth: 1, borderRightWidth: 1, borderTopRightRadius: 4 },
  cornerBL: { bottom: 8, left: 8, borderBottomWidth: 1, borderLeftWidth: 1, borderBottomLeftRadius: 4 },
  cornerBR: { bottom: 8, right: 8, borderBottomWidth: 1, borderRightWidth: 1, borderBottomRightRadius: 4 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
    fontFamily: SERIF,
    letterSpacing: 0.2,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(224, 122, 47, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  iconText: {
    fontSize: 14,
    color: colors.primary,
  },

  imageWrap: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.08)',
  },
  image: {
    width: '100%',
    height: 210,
  },
  imageFallback: {
    height: 210,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  imageFallbackText: {
    fontSize: 44,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: SERIF,
    opacity: 0.45,
  },

  description: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },

  priceBlock: {
    borderWidth: 1,
    borderColor: 'rgba(224, 122, 47, 0.22)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
    gap: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  priceValue: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  selector: {
    flexDirection: 'row',
    gap: 10,
  },
  selectorPill: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.10)',
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorPillActive: {
    borderColor: 'rgba(224, 122, 47, 0.45)',
    backgroundColor: 'rgba(224, 122, 47, 0.10)',
  },
  selectorText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
  selectorTextActive: {
    color: colors.text,
  },

  addBtn: {
    width: '100%',
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 16,
      },
      android: { elevation: 6 },
    }),
  },
  addBtnPressed: {
    opacity: 0.92,
  },
  addBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

