import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';
import { fontFamily } from '../theme/typography';
import { FaizaHeader } from '../components/FaizaHeader';

interface AuthScreenProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
  error: string | null;
}

const formatKgPhone = (text: string) => {
  const digits = text.replace(/\D/g, '');
  const core = digits.startsWith('996') ? digits.slice(3, 12) : digits.startsWith('0') ? digits.slice(1, 10) : digits.slice(0, 9);

  let out = '+996';
  if (core.length > 0) out += ` (${core.slice(0, 3)}`;
  if (core.length >= 3) out += `) ${core.slice(3, 5)}`;
  if (core.length >= 5) out += `-${core.slice(5, 7)}`;
  if (core.length >= 7) out += `-${core.slice(7, 9)}`;
  return out;
};

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSubmit, isLoading, error }) => {
  const { t } = useI18n();
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const [phone, setPhone] = useState('+996');

  const isComplete = phone.replace(/\D/g, '').length === 12;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FaizaHeader title={t('auth.title')} subtitle={t('auth.subtitle')} />

          <View style={[styles.formWrap, { paddingHorizontal: horizontal }]}>
            <View style={styles.card}>
              <Text style={styles.label}>{t('auth.phoneLabel')}</Text>

              <TextInput
                value={phone}
                onChangeText={(text) => setPhone(formatKgPhone(text))}
                keyboardType="phone-pad"
                placeholder={t('auth.phonePlaceholder')}
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                maxLength={19}
                autoFocus
              />

              {!!error && <Text style={styles.errorText}>{error}</Text>}

              <Pressable
                style={withPressFeedback([styles.button, (!isComplete || isLoading) && styles.buttonDisabled])}
                onPress={() => onSubmit(phone)}
                disabled={!isComplete || isLoading}
              >
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>{t('auth.submit')}</Text>}
              </Pressable>

              <Text style={styles.helper}>{isLoading ? t('auth.loading') : t('auth.helper')}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  formWrap: { flex: 1, justifyContent: 'center', paddingBottom: 70 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontFamily: fontFamily.semibold,
  },
  input: {
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FFF',
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 18,
    fontFamily: fontFamily.semibold,
  },
  button: {
    marginTop: 14,
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: { color: '#FFF', fontSize: 15, fontFamily: fontFamily.bold },
  helper: {
    marginTop: 12,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  errorText: {
    marginTop: 10,
    color: '#B00020',
    textAlign: 'center',
    fontSize: 12,
    fontFamily: fontFamily.semibold,
  },
});
