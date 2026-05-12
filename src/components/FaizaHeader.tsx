import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useAppUiStore } from '../store/appUiStore';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';
import { fontFamily } from '../theme/typography';

const languages: Array<{ code: 'ru' | 'kg' | 'en'; label: string }> = [
  { code: 'ru', label: 'Ру' },
  { code: 'kg', label: 'Кг' },
  { code: 'en', label: 'En' },
];

interface FaizaHeaderProps {
  title?: string;
  subtitle?: string;
  /** Показать кнопку «Назад» (например, в модальных шагах чекаута). */
  onBack?: () => void;
}

export const FaizaHeader: React.FC<FaizaHeaderProps> = ({ title, subtitle, onBack }) => {
  const { width } = useWindowDimensions();
  const language = useAppUiStore((s) => s.language);
  const setLanguage = useAppUiStore((s) => s.setLanguage);
  const { t } = useI18n();
  const horizontal = width >= 768 ? 28 : 16;

  return (
    <View style={[styles.wrapper, { paddingHorizontal: horizontal }]}>
      <View style={styles.topRow}>
        <View style={styles.leftCluster}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
              accessibilityRole="button"
              accessibilityLabel={t('common.back')}
              hitSlop={10}
            >
              <ArrowLeft size={22} color={colors.text} strokeWidth={2.2} />
            </Pressable>
          ) : null}
          <View style={styles.logoWrap}>
            <Text style={styles.brandTitle}>FAIZA</Text>
            <Text style={styles.brandSub}>restaurant</Text>
          </View>
        </View>

        <View style={styles.langWrap}>
          {languages.map((item) => {
            const active = item.code === language;
            return (
              <Pressable
                key={item.code}
                style={withPressFeedback([styles.langChip, active && styles.langChipActive])}
                onPress={() => setLanguage(item.code)}
              >
                <Text style={[styles.langText, active && styles.langTextActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {!!title && <Text style={styles.title}>{title}</Text>}
      {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { paddingTop: 8, paddingBottom: 6 },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftCluster: { flex: 1, flexDirection: 'row', alignItems: 'center', minWidth: 0, gap: 4 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
  },
  backBtnPressed: { opacity: 0.85 },
  logoWrap: {
    height: 46,
    justifyContent: 'center',
    flexShrink: 1,
  },
  brandTitle: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 23,
    letterSpacing: 1.2,
  },
  brandSub: {
    marginTop: -2,
    color: colors.textMuted,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  langWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
    padding: 2,
    gap: 2,
  },
  langChip: {
    minWidth: 34,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langChipActive: {
    backgroundColor: colors.primary,
  },
  langText: {
    fontSize: 12,
    fontFamily: fontFamily.semibold,
    color: colors.textMuted,
  },
  langTextActive: {
    color: '#FFF',
  },
  title: {
    fontSize: 28,
    fontFamily: fontFamily.bold,
    color: colors.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fontFamily.semibold,
  },
});
