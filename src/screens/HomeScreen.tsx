import React, { useMemo } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Clock3, QrCode, Repeat, Star } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useCartStore } from '../store/cartStore';
import { MENU_CATEGORIES } from '../menu';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';
import { fontFamily } from '../theme/typography';

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);

  return (
    <SafeAreaView style={styles.safe}>
      <FaizaHeader title={t('home.title')} subtitle={t('home.subtitle')} />

      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: horizontal }]} showsVerticalScrollIndicator={false}>
        <ImageBackground
          source={{
            uri: 'https://faiza.kg/dish2.jpg',
          }}
          style={styles.hero}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.greeting}>{t('home.heroKicker')}</Text>
            <Text style={styles.heroTitle}>{t('home.heroTitle')}</Text>
            <Text style={styles.heroSubtitle}>{t('home.heroSubtitle')}</Text>
            <Pressable style={withPressFeedback(styles.heroCta)} onPress={() => navigation.navigate('Menu')}>
              <Text style={styles.heroCtaText}>{t('common.openMenu')}</Text>
            </Pressable>
          </View>
        </ImageBackground>

        <View style={styles.quickActions}>
          <QuickAction icon={<Repeat size={18} color={colors.primary} />} title={t('home.reorder')} subtitle="Last order" onPress={() => navigation.navigate('Orders')} />
          <QuickAction icon={<Star size={18} color={colors.primary} />} title={t('home.favorites')} subtitle="Saved" />
          <QuickAction icon={<QrCode size={18} color={colors.primary} />} title={t('home.qrPay')} subtitle="Fast" onPress={() => navigation.navigate('Payment')} />
        </View>

        <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
        <View style={styles.chipsRow}>
          {MENU_CATEGORIES.map((category) => (
            <Pressable key={category} style={withPressFeedback(styles.chip)} onPress={() => navigation.navigate('Menu', { category })}>
              <Text style={styles.chipText}>{category}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t('home.popular')}</Text>
        <View style={styles.popularCard}>
          <View>
            <Text style={styles.popularTitle}>Босо Лагман</Text>
            <Text style={styles.popularMeta}>Хит Faiza • Горячие блюда</Text>
          </View>
          <View style={styles.prepPill}>
            <Clock3 size={14} color={colors.success} />
            <Text style={styles.prepText}>~12 мин</Text>
          </View>
        </View>
      </ScrollView>

      {cartCount > 0 && (
        <Pressable style={withPressFeedback([styles.miniCart, { left: horizontal, right: horizontal }])} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.miniCartText}>В корзине: {cartCount}</Text>
          <Text style={styles.miniCartLink}>Перейти</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const QuickAction: React.FC<{ icon: React.ReactNode; title: string; subtitle: string; onPress?: () => void }> = ({ icon, title, subtitle, onPress }) => (
  <Pressable style={styles.actionCard} onPress={onPress}>
    <View style={styles.actionIconWrap}>{icon}</View>
    <Text style={styles.actionTitle}>{title}</Text>
    <Text style={styles.actionSubtitle}>{subtitle}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 130 },
  hero: { height: 230, borderRadius: 18, overflow: 'hidden' },
  heroImage: { borderRadius: 18 },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(44,20,20,0.40)', padding: 18, justifyContent: 'space-between' },
  greeting: { color: '#F7E6CC', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
  heroTitle: { color: '#FFF', fontSize: 28, fontWeight: '900', maxWidth: '90%' },
  heroSubtitle: { color: '#F9EFE2', fontSize: 13, lineHeight: 18, marginTop: 4, maxWidth: '85%' },
  heroCta: { marginTop: 6, alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  heroCtaText: { color: '#FFF', fontWeight: '800' },
  quickActions: { marginTop: 14, flexDirection: 'row', gap: 10 },
  actionCard: { flex: 1, backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 12 },
  actionIconWrap: { width: 34, height: 34, borderRadius: 10, backgroundColor: '#F7ECE1', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  actionTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 13 },
  actionSubtitle: { color: colors.textMuted, marginTop: 3, fontSize: 11, fontFamily: fontFamily.regular },
  sectionTitle: { marginTop: 18, marginBottom: 10, color: colors.text, fontSize: 18, fontFamily: fontFamily.bold },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F1E7DF', borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  chipText: { color: colors.primary, fontFamily: fontFamily.semibold, fontSize: 12 },
  popularCard: { padding: 14, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  popularTitle: { color: colors.text, fontFamily: fontFamily.bold, fontSize: 15 },
  popularMeta: { marginTop: 4, color: colors.textMuted, fontSize: 12, fontFamily: fontFamily.regular },
  prepPill: { flexDirection: 'row', gap: 5, backgroundColor: '#EBF6EE', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  prepText: { color: colors.success, fontSize: 11, fontWeight: '700' },
  miniCart: { position: 'absolute', bottom: 20, backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  miniCartText: { color: '#FBEFE6', fontFamily: fontFamily.semibold, fontSize: 13 },
  miniCartLink: { color: '#FFF', fontFamily: fontFamily.bold, fontSize: 13 },
});
