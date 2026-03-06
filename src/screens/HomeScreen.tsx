import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category } from '../types';
import { CategoryTabs } from '../components/CategoryTabs';
import { MenuList } from '../components/MenuList';
import { useCartStore } from '../store/cartStore';
import { useCartUIStore } from '../store/cartUIStore';
import { colors } from '../theme/colors';
import { MENU_CATEGORIES, MENU_ITEMS } from '../menu';

export const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Coffee');
  const addToCart = useCartStore((state) => state.addToCart);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const openCart = useCartUIStore((s) => s.openCart);
  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const filteredProducts = useMemo(
    () => MENU_ITEMS.filter((p) => p.category === selectedCategory),
    [selectedCategory],
  );

  useEffect(() => {
    filteredProducts.slice(0, 4).forEach((p) => {
      if (p.imageUrl) Image.prefetch(p.imageUrl);
    });
  }, [filteredProducts]);

  const Header = () => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.welcomeText}>Restaurant Menu</Text>
        <Text style={styles.brandTitle}>CoffeePoint</Text>
      </View>
      <TouchableOpacity style={styles.cartBadge} activeOpacity={0.85} onPress={openCart}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartCount}>{cartItemsCount} items</Text>
          <Text style={styles.cartPrice}>{totalPrice} som</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <MenuList
        items={filteredProducts}
        onAddToCart={({ product, option }) => addToCart({ product, option })}
        ListHeaderComponent={
          <>
            <Header />
            <View style={styles.categoryWrapper}>
              <CategoryTabs
                categories={MENU_CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </View>
          </>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerContainer: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  brandTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.4,
  },
  cartBadge: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartInfo: {
    alignItems: 'flex-end',
  },
  cartCount: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '800',
    letterSpacing: 0.7,
  },
  cartPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: colors.primary,
  },
  categoryWrapper: {
    paddingBottom: 8,
  },
});