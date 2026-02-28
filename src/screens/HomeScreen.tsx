import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Category, Product } from '../types';
import { CategoryTabs } from '../components/CategoryTabs';
import { ProductCard } from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

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

export const HomeScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Coffee');
  const addToCart = useCartStore((state) => state.addToCart);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const cartItemsCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );

  const filteredProducts = useMemo(
    () => PRODUCTS.filter((p) => p.category === selectedCategory),
    [selectedCategory],
  );

  const Header = () => (
    <View style={styles.headerContainer}>
      <View>
        <Text style={styles.welcomeText}>Доброе утро ☕️</Text>
        <Text style={styles.brandTitle}>CoffeePoint</Text>
      </View>
      <TouchableOpacity style={styles.cartBadge}>
        <View style={styles.cartInfo}>
          <Text style={styles.cartCount}>{cartItemsCount} товара</Text>
          <Text style={styles.cartPrice}>{totalPrice} ⃀</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ListHeaderComponent={
          <>
            <Header />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Популярное</Text>
            </View>
            <FlatList
              data={PRODUCTS.slice(0, 3)}
              keyExtractor={(item) => `popular-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.popularList}
              renderItem={({ item }) => (
                <View style={styles.popularCardWrapper}>
                  <ProductCard
                    product={item}
                    onAddToCart={() => addToCart(item)}
                    variant="horizontal" 
                  />
                </View>
              )}
            />
            <View style={styles.categoryWrapper}>
              <CategoryTabs
                categories={['Coffee', 'Tea', 'Desserts']}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />
            </View>
          </>
        }
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridRow}
        contentContainerStyle={styles.mainListContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.gridItem}>
            <ProductCard
              product={item}
              onAddToCart={() => addToCart(item)}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Светлый нейтральный фон
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  cartBadge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    // Тень для эффекта "плавающей" кнопки
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cartInfo: {
    alignItems: 'flex-end',
  },
  cartCount: {
    fontSize: 10,
    color: '#8E8E93',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  cartPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary || '#D17842',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  popularList: {
    paddingLeft: 20,
    paddingBottom: 20,
  },
  popularCardWrapper: {
    width: width * 0.7, // Карточка на 70% ширины экрана
    marginRight: 16,
  },
  categoryWrapper: {
    paddingVertical: 10,
  },
  mainListContent: {
    paddingHorizontal: 15,
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  gridItem: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 15,
  },
});