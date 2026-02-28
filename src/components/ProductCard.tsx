import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import type { Product } from '../types';
import { colors } from '../theme/colors';
import { Plus } from 'lucide-react-native';

interface Props {
  product: Product;
  onAddToCart: () => void;
  variant?: 'vertical' | 'horizontal'; 
}

export const ProductCard: React.FC<Props> = ({ 
  product, 
  onAddToCart, 
  variant = 'vertical' 
}) => {
  const isHorizontal = variant === 'horizontal';

  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      style={[styles.card, isHorizontal ? styles.cardHorizontal : styles.cardVertical]}
    >
      <View style={[styles.imageContainer, isHorizontal && styles.imageContainerHorizontal]}>
        {/* В будущем здесь будет <Image />, пока используем стильный плейсхолдер */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderText}>
            {product.name.charAt(0)}
          </Text>
        </View>
        
        {!isHorizontal && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>⭐ 4.8</Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <View>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <Text style={styles.description} numberOfLines={isHorizontal ? 1 : 2}>
            {product.description}
          </Text>
        </View>

        <View style={styles.footer}>
          <View>
            <Text style={styles.priceLabel}>Цена</Text>
            <Text style={styles.price}>{product.price} ⃀</Text>
          </View>
          <TouchableOpacity 
            style={styles.button} 
            onPress={onAddToCart}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Plus color="#FFFFFF" size={20} strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cardVertical: {
    flexDirection: 'column',
    padding: 12,
    width: '100%',
  },
  cardHorizontal: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  imageContainerHorizontal: {
    marginRight: 12,
  },
  imagePlaceholder: {
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // Адаптивный размер для разных вариантов
    width: '100%',
    aspectRatio: 1,
    minWidth: 80,
  },
  // Специальный размер для горизонтальной версии
  cardHorizontal_image: {
    width: 90,
    height: 90,
  },
  imagePlaceholderText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    opacity: 0.5,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
  },
  info: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 4,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  priceLabel: {
    fontSize: 10,
    color: '#AEA9A9',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary || '#D17842',
  },
  button: {
    backgroundColor: colors.primary || '#D17842',
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});