import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MENU_ITEMS } from '../menu';
import type { DrinkCustomization, PortionOption } from '../types';
import { useCartStore } from '../store/cartStore';
import { colors } from '../theme/colors';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';

const sizes: Array<'S' | 'M' | 'L'> = ['S', 'M', 'L'];
const milkTypes: Array<'Whole' | 'Oat' | 'Almond' | 'Soy' | 'No milk'> = ['Whole', 'Oat', 'Almond', 'Soy', 'No milk'];
const sugarOptions: Array<'0' | '1' | '2' | 'custom'> = ['0', '1', '2', 'custom'];
const temperatures: Array<'Hot' | 'Iced'> = ['Hot', 'Iced'];
const extras = ['Доп. порция', 'Ванильный сироп', 'Карамельный сироп', 'Сливки', 'Корица'];
const extraPrice = 30;

export const ProductCustomizationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const addToCart = useCartStore((s) => s.addToCart);
  const { t } = useI18n();

  const product = MENU_ITEMS.find((item) => item.id === route.params?.productId) ?? MENU_ITEMS[0];

  const [customization, setCustomization] = useState<DrinkCustomization>({
    size: 'M',
    milkType: 'Whole',
    sugar: '1',
    extras: [],
    temperature: 'Hot',
    notes: '',
  });

  const baseOption = useMemo(() => {
    const fallback = product.options?.[0] ?? { id: 'M', grams: 300, price: product.price };
    return product.options?.find((option) => option.id === customization.size) ?? fallback;
  }, [customization.size, product.options, product.price]);

  const finalPrice = baseOption.price + customization.extras.length * extraPrice;

  const finalOption: PortionOption = {
    id: [baseOption.id, customization.temperature, customization.milkType, customization.sugar, customization.extras.join('-')].join('-'),
    grams: baseOption.grams,
    price: finalPrice,
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={product.name} subtitle={t('customize.subtitle')} />

      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: horizontal }]}> 
        <Text style={styles.subtitle}>{product.description}</Text>

        <Section title={t('customize.size')}>
          <RowOptions options={sizes} value={customization.size} onSelect={(size) => setCustomization((prev) => ({ ...prev, size }))} />
        </Section>

        <Section title={t('customize.milk')}>
          <RowOptions options={milkTypes} value={customization.milkType} onSelect={(milkType) => setCustomization((prev) => ({ ...prev, milkType }))} />
        </Section>

        <Section title={t('customize.sugar')}>
          <RowOptions options={sugarOptions} value={customization.sugar} onSelect={(sugar) => setCustomization((prev) => ({ ...prev, sugar }))} />
        </Section>

        <Section title={t('customize.temperature')}>
          <RowOptions options={temperatures} value={customization.temperature} onSelect={(temperature) => setCustomization((prev) => ({ ...prev, temperature }))} />
        </Section>

        <Section title={t('customize.extras')}>
          <View style={styles.wrapOptions}>
            {extras.map((extra) => {
              const selected = customization.extras.includes(extra);
              return (
                <Pressable
                  key={extra}
                  style={withPressFeedback([styles.wrapChip, selected && styles.wrapChipActive])}
                  onPress={() =>
                    setCustomization((prev) => ({
                      ...prev,
                      extras: selected ? prev.extras.filter((item) => item !== extra) : [...prev.extras, extra],
                    }))
                  }
                >
                  <Text style={[styles.wrapChipText, selected && styles.wrapChipTextActive]}>{extra}</Text>
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title={t('customize.comment')}>
          <TextInput
            value={customization.notes}
            onChangeText={(notes) => setCustomization((prev) => ({ ...prev, notes }))}
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
          <Text style={styles.calories}>~{170 + customization.extras.length * 20} {t('customize.kcal')}</Text>
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
  content: { paddingBottom: 140 },
  subtitle: { marginTop: 8, color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  section: { marginTop: 16, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF' },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: colors.primary, marginBottom: 10 },
  rowOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rowChip: { backgroundColor: '#F2E9E1', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: colors.border },
  rowChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  rowChipText: { color: colors.primary, fontWeight: '700', fontSize: 12 },
  rowChipTextActive: { color: '#FFF' },
  wrapOptions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  wrapChip: { borderRadius: 10, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8 },
  wrapChipActive: { borderColor: colors.primary, backgroundColor: '#F9ECEC' },
  wrapChipText: { color: colors.text, fontWeight: '600', fontSize: 12 },
  wrapChipTextActive: { color: colors.primary, fontWeight: '800' },
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
