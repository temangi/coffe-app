import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Image, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { SlidersHorizontal } from 'lucide-react-native';
import { MENU_CATEGORIES, MENU_ITEMS } from '../menu';
import type { Category } from '../types';
import { colors } from '../theme/colors';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';
import { fontFamily } from '../theme/typography';

export const MenuScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const { t } = useI18n();

  const [query, setQuery] = useState('');
  const normalizeText = useCallback((value: unknown) => String(value ?? '').trim().toLowerCase(), []);

  const resolveCategory = useCallback(
    (raw: unknown): Category => {
      const extracted =
        typeof raw === 'string'
          ? raw
          : typeof raw === 'object' && raw !== null
            ? ((raw as { name?: string; title?: string; category?: string }).name ??
              (raw as { title?: string }).title ??
              (raw as { category?: string }).category ??
              '')
            : '';

      const found = MENU_CATEGORIES.find((item) => normalizeText(item) === normalizeText(extracted));
      return (found ?? MENU_CATEGORIES[0]) as Category;
    },
    [normalizeText],
  );

  const incomingCategory = route.params?.category;
  const [category, setCategory] = useState<Category>(resolveCategory(incomingCategory));
  const listAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setCategory(resolveCategory(incomingCategory));
  }, [incomingCategory, resolveCategory]);

  useFocusEffect(
    useCallback(() => {
      if (incomingCategory !== undefined) {
        setCategory(resolveCategory(incomingCategory));
      }
    }, [incomingCategory, resolveCategory]),
  );

  useEffect(() => {
    listAnim.setValue(0);
    Animated.timing(listAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [category, listAnim]);

  const data = useMemo(() => {
    const normalizedCategory = normalizeText(category);
    return MENU_ITEMS.filter((item) => {
      if (normalizeText(item.category) !== normalizedCategory) return false;
      const normalized = query.trim().toLowerCase();
      if (!normalized) return true;
      return item.name.toLowerCase().includes(normalized) || item.description.toLowerCase().includes(normalized);
    });
  }, [category, normalizeText, query]);

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={t('menu.title')} subtitle={t('menu.subtitle')} />

      <View style={[styles.searchRow, { paddingHorizontal: horizontal }]}>
        <TextInput value={query} onChangeText={setQuery} placeholder={t('menu.search')} placeholderTextColor={colors.textMuted} style={styles.searchInput} />
        <Pressable style={withPressFeedback(styles.filterButton)}>
          <SlidersHorizontal size={16} color={colors.text} />
        </Pressable>
      </View>

      <View>
        <FlatList
          horizontal
          data={MENU_CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={[styles.chipsRow, { paddingHorizontal: horizontal }]}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: chip }) => {
            const active = chip === category;
            return (
              <Pressable style={withPressFeedback([styles.chip, active && styles.chipActive])} onPress={() => setCategory(chip)}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{chip}</Text>
              </Pressable>
            );
          }}
        />
      </View>

      <Animated.View
        style={[
          styles.listAnimatedWrap,
          {
            opacity: listAnim,
            transform: [
              {
                translateY: listAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [8, 0],
                }),
              },
            ],
          },
        ]}
      >
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: horizontal }]}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.photo} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.note} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.meta}>{t('menu.from')} {item.price} сом • ~{item.prepTimeMin ?? 12} {t('menu.min')}</Text>
                <View style={styles.actions}>
                  <Pressable style={withPressFeedback(styles.ghostButton)} onPress={() => navigation.navigate('Customize', { productId: item.id })}>
                    <Text style={styles.ghostButtonText}>{t('menu.details')}</Text>
                  </Pressable>
                  <Pressable style={withPressFeedback(styles.addButton)} onPress={() => navigation.navigate('Customize', { productId: item.id })}>
                    <Text style={styles.addButtonText}>{t('menu.toCart')}</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  searchRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  searchInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    height: 46,
    color: colors.text,
    fontSize: 14,
  },
  filterButton: {
    width: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
  },
  chipsRow: { gap: 8, marginTop: 10, paddingBottom: 2 },
  listAnimatedWrap: { flex: 1 },
  chip: { backgroundColor: '#F2E9E1', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.primary, fontFamily: fontFamily.semibold, fontSize: 12 },
  chipTextActive: { color: '#FFF' },
  listContent: { paddingTop: 10, paddingBottom: 120, gap: 10 },
  card: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card },
  photo: { width: 86, height: 86, borderRadius: 10 },
  name: { color: colors.text, fontSize: 16, fontFamily: fontFamily.bold },
  note: { color: colors.textMuted, marginTop: 4, fontSize: 12, lineHeight: 17, fontFamily: fontFamily.regular },
  meta: { color: colors.primary, marginTop: 8, fontSize: 12, fontFamily: fontFamily.semibold },
  actions: { marginTop: 10, flexDirection: 'row', gap: 8 },
  ghostButton: { borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFF' },
  ghostButtonText: { color: colors.primary, fontFamily: fontFamily.semibold, fontSize: 12 },
  addButton: { borderRadius: 10, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8 },
  addButtonText: { color: '#FFF', fontFamily: fontFamily.bold, fontSize: 12 },
});
