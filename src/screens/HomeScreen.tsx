import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, Product } from '../types';
import { CategoryTabs } from '../components/CategoryTabs';
import { ProductCard } from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';
import { colors } from '../theme/colors';

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Капучино',
    description: 'Эспрессо с молочной пенкой, мягкий вкус.',
    price: 180,
    category: 'Coffee',
  },
  {
    id: '2',
    name: 'Латте',
    description: 'Много молока, мягкий кофейный вкус.',
    price: 200,
    category: 'Coffee',
  },
  {
    id: '3',
    name: 'Матча латте',
    description: 'Зелёный чай матча с молоком.',
    price: 220,
    category: 'Tea',
  },
  {
    id: '4',
    name: 'Чизкейк Нью-Йорк',
    description: 'Нежный сырный десерт.',
    price: 250,
    category: 'Desserts',
  },
  {
    id: '5',
    name: 'Флэт уайт',
    description: 'Кофе для тех, кто любит насыщенный вкус.',
    price: 210,
    category: 'Coffee',
  },
];

const CATEGORIES: Category[] = ['Coffee', 'Tea', 'Desserts'];

export const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Coffee');
  const addToCart = useCartStore((state) => state.addToCart);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((p) => p.category === selectedCategory),
    [selectedCategory],
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.subtitle}>Добро пожаловать</Text>
            <Text style={styles.title}>CoffeePoint</Text>
          </View>
          <View style={styles.cartSummary}>
            <Text style={styles.cartSummaryText}>
              В корзине: {cartItemsCount}
            </Text>
            <Text style={styles.cartSummaryPrice}>
              {totalPrice} ₽
            </Text>
          </View>
        </View>

        <CategoryTabs
          categories={CATEGORIES}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onAddToCart={() => addToCart(item)}
            />
          )}
        />
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
  header: {
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.text,
  },
  cartSummary: {
    alignItems: 'flex-end',
  },
  cartSummaryText: {
    fontSize: 13,
    color: colors.textMuted,
  },
  cartSummaryPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 24,
  },
});

