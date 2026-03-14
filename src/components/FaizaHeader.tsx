import React from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { colors } from '../theme/colors';
import { useAppUiStore } from '../store/appUiStore';
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
}

export const FaizaHeader: React.FC<FaizaHeaderProps> = ({ title, subtitle }) => {
  const { width } = useWindowDimensions();
  const language = useAppUiStore((s) => s.language);
  const setLanguage = useAppUiStore((s) => s.setLanguage);
  const horizontal = width >= 768 ? 28 : 16;

  return (
    <View style={[styles.wrapper, { paddingHorizontal: horizontal }]}>
      <View style={styles.topRow}>
        <View style={styles.logoWrap}>
          <SvgUri uri="https://faiza.kg/logo-top.svg" width={150} height={40} />
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
  logoWrap: {
    height: 44,
    justifyContent: 'center',
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
