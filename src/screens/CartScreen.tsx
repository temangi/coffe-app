import React, { useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useCartUIStore } from '../store/cartUIStore';
import { colors } from '../theme/colors';

export const CartScreen: React.FC = () => {
  const openCart = useCartUIStore((s) => s.openCart);

  useFocusEffect(
    useCallback(() => {
      openCart();
    }, [openCart]),
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <Text style={styles.title}>Cart</Text>
        <Text style={styles.subtitle}>Your cart opens as a slide-up sheet.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  title: { fontSize: 20, fontWeight: '900', color: colors.text },
  subtitle: { marginTop: 8, fontSize: 13, color: colors.textMuted, textAlign: 'center' },
});