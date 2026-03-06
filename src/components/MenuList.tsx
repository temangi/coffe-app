import React, { memo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import type { PortionOption, Product } from '../types';
import { FoodCard } from './FoodCard';

type Props = {
  items: Product[];
  onAddToCart: (payload: { product: Product; option: PortionOption }) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
};

export const MenuList = memo<Props>(({ items, onAddToCart, ListHeaderComponent }) => {
  return (
    <FlatList
      data={items}
      keyExtractor={(it) => it.id}
      renderItem={({ item }) => <FoodCard item={item} onAddToCart={onAddToCart} />}
      ListHeaderComponent={ListHeaderComponent}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      removeClippedSubviews
      initialNumToRender={4}
      maxToRenderPerBatch={6}
      updateCellsBatchingPeriod={16}
      windowSize={8}
    />
  );
});

MenuList.displayName = 'MenuList';

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 18,
    paddingBottom: 140,
  },
  separator: {
    height: 0,
  },
});

