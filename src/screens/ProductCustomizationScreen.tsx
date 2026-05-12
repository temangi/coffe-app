import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMenuStore } from '../store/menuStore';
import type { DrinkCustomization, PortionOption } from '../types';
import { useCartStore } from '../store/cartStore';
import { colors } from '../theme/colors';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';

const sizes: Array<'S' | 'L'> = ['S', 'L'];

export const ProductCustomizationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const addToCart = useCartStore((s) => s.addToCart);
  const { t } = useI18n();
  const MENU_ITEMS = useMenuStore((s) => s.products);
  const menuLoading = useMenuStore((s) => s.loading);

  const product =
    MENU_ITEMS.find((item) => item.id === route.params?.productId) ?? MENU_ITEMS[0];

  const [size, setSize] = useState<'S' | 'L'>('S');
  const [notes, setNotes] = useState('');

  const portionBySize = useMemo(() => {
    if (!product) {
      const placeholder = { id: '—', grams: 0, price: 0 };
      return { S: placeholder, L: placeholder } as const;
    }
    const opts = product.options?.length
      ? product.options
      : [{ id: `${product.id}-portion`, grams: 300, price: product.price }];
    const small = opts[0];
    const large = opts.length > 1 ? opts[opts.length - 1] : opts[0];
    return { S: small, L: large } as const;
  }, [product]);

  const baseOption = portionBySize[size];

  const finalPrice = baseOption.price;

  const customization: DrinkCustomization = useMemo(
    () => ({
      size,
      milkType: 'Whole',
      sugar: '0',
      extras: [],
      temperature: 'Hot',
      notes: notes.trim() || undefined,
    }),
    [size, notes],
  );

  const finalOption: PortionOption = {
    id: [baseOption.id, size, notes.trim()].join('|'),
    grams: baseOption.grams,
    price: finalPrice,
  };

  if (menuLoading && !product) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={[styles.safe, styles.centered]}>
        <Text style={styles.errorText}>Блюдо не найдено</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={product.name} subtitle={t('customize.subtitle')} />

      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: horizontal }]}> 
        <Text style={styles.subtitle}>{product.description}</Text>

        <Section title={t('customize.size')}>
          <RowOptions options={sizes} value={size} onSelect={setSize} />
        </Section>

        <Section title={t('customize.comment')}>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            style={styles.notesInput}
            placeholder={t('customize.commentPlaceholder')}
            placeholderTextColor={colors.textMuted}
          />
        </Section>
      </ScrollView>

      <View style={[styles.footer, { left: horizontal, right: horizontal }]}> 
        <View>
          <Text style={styles.priceLabel}>{t('customize.finalPrice')}</Text>
          <Text style={styles.price}>{finalPrice} сом</Text>
          <Text style={styles.calories}>~170 {t('customize.kcal')}</Text>
        </View>
        <Pressable
          style={withPressFeedback(styles.cta)}
          onPress={() => {
            addToCart({ product, option: finalOption, customization });
            navigation.navigate('Cart');
          }}
        >
          <Text style={styles.ctaText}>{t('common.addToCart')}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const RowOptions = <T extends string>({ options, value, onSelect }: { options: T[]; value: T; onSelect: (v: T) => void }) => (
  <View style={styles.rowOptions}>
    {options.map((option) => {
      const selected = option === value;
      return (
        <Pressable key={option} onPress={() => onSelect(option)} style={withPressFeedback([styles.rowChip, selected && styles.rowChipActive])}>
          <Text style={[styles.rowChipText, selected && styles.rowChipTextActive]}>{option}</Text>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { alignItems: 'center', justifyContent: 'center' },
  errorText: { color: colors.textMuted, fontSize: 15 },
  content: { paddingBottom: 140 },
  subtitle: { marginTop: 8, color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  section: { marginTop: 16, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.primary, marginBottom: 10 },
  rowOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rowChip: { backgroundColor: '#F2E9E1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border },
  rowChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  rowChipText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  rowChipTextActive: { color: '#FFF' },
  notesInput: { minHeight: 80, textAlignVertical: 'top', borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 10, color: colors.text },
  footer: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: { color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', fontWeight: '700' },
  price: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 2 },
  calories: { color: colors.textMuted, fontSize: 11, marginTop: 2 },
  cta: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12 },
  ctaText: { color: '#FFF', fontWeight: '800' },
});
