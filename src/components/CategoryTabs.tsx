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
              activeOpacity={0.85}
              onPress={() => onSelect(cat)}
              style={[
                styles.chip,
                isActive ? styles.chipActive : styles.chipInactive
              ]}
            >
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
    marginTop: 6,
    marginBottom: 8,
  },
  container: {
    paddingHorizontal: 18,
    paddingVertical: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginRight: 10,
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: 'rgba(224, 122, 47, 0.10)',
    borderColor: 'rgba(224, 122, 47, 0.45)',
  },
  chipInactive: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderColor: 'rgba(43, 33, 29, 0.10)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  chipTextActive: {
    color: colors.text,
  },
  chipTextInactive: {
    color: colors.textMuted,
  },
});