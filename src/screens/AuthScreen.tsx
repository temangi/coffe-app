import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

interface AuthScreenProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
  error: string | null;
}

const formatKGPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 0) return '+996 ';

  let cleanDigits = digits;
  if (digits.startsWith('0')) {
    cleanDigits = '996' + digits.substring(1);
  } else if (!digits.startsWith('996')) {
    cleanDigits = '996' + digits;
  }

  let result = '+996';
  const mainPart = cleanDigits.substring(3);

  if (mainPart.length > 0) result += ' (' + mainPart.substring(0, 3);
  if (mainPart.length >= 3) result += ') ' + mainPart.substring(3, 5);
  if (mainPart.length >= 5) result += '-' + mainPart.substring(5, 7);
  if (mainPart.length >= 7) result += '-' + mainPart.substring(7, 9);

  return result;
};

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSubmit,
  isLoading,
  error,
}) => {
  const [phone, setPhone] = useState('+996 ');

  const handleChangePhone = useCallback((text: string) => {
    if (text.length < 5 && phone.includes('+996')) {
      setPhone('+996 ');
      return;
    }
    setPhone(formatKGPhone(text));
  }, [phone]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>CoffeePoint KG</Text>
            <Text style={styles.subtitle}>
              Введите ваш номер телефона, чтобы заказать лучший кофе в Бишкеке.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Номер телефона</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={handleChangePhone}
              placeholder="+996 (700) 00-00-00"
              placeholderTextColor={colors.textMuted}
              maxLength={19}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={() => onSubmit(phone)}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Проверка...' : 'Войти'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.helper}>
              Используйте любой номер KG (О!, Mega, Beeline). Код подтверждения придет в SMS (имитация).
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.textMuted,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    fontSize: 18,
    color: colors.text,
    // Легкая тень для iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  button: {
    marginTop: 24,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3, // Тень для Android
  },
  buttonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  helper: {
    marginTop: 20,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    color: colors.textMuted,
    paddingHorizontal: 10,
  },
  error: {
    marginTop: 10,
    fontSize: 14,
    color: '#E53935',
    fontWeight: '500',
    marginLeft: 4,
  },
});