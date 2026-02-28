import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import type { Category } from '../types';
import { colors } from '../theme/colors';

interface Props {
  categories: Category[];
  selected: Category;
  onSelect: (category: Category) => void;
}

export const CategoryTabs: React.FC<Props> = ({ categories, selected, onSelect }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {categories.map((cat) => {
          const isActive = cat === selected;
          return (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.7}
              onPress={() => onSelect(cat)}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive
              ]}
            >
              {isActive && <View style={styles.dot} />}
              <Text style={[
                styles.chipText, 
                isActive ? styles.chipTextActive : styles.chipTextInactive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 10,
  },
  container: {
    paddingHorizontal: 20, // Совпадает с отступами заголовка в HomeScreen
    paddingVertical: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chipActive: {
    backgroundColor: '#1C1C1E', // Темный акцент или colors.primary
  },
  chipInactive: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary || '#D17842',
    marginRight: 8,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  chipTextInactive: {
    color: '#8E8E93',
  },
});