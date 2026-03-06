import React, { memo, useMemo } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Apple, Banknote, CreditCard, Smartphone } from 'lucide-react-native';
import type { PaymentMethod } from '../types';
import { colors } from '../theme/colors';

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif' });

type Props = {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  onPay: () => void;
  disabled?: boolean;
};

export const PaymentScreen = memo<Props>(({ value, onChange, onPay, disabled }) => {
  const methods = useMemo(
    () =>
      [
        { id: 'apple_pay' as const, title: 'Apple Pay', icon: Apple },
        { id: 'google_pay' as const, title: 'Google Pay', icon: Smartphone },
        { id: 'card' as const, title: 'Card payment', icon: CreditCard },
        { id: 'cash' as const, title: 'Cash', icon: Banknote },
      ] as const,
    [],
  );

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Payment</Text>
      <Text style={styles.subtitle}>Choose your preferred method</Text>

      <View style={styles.list}>
        {methods.map((m) => {
          const active = m.id === value;
          const Icon = m.icon;
          return (
            <Pressable
              key={m.id}
              onPress={() => onChange(m.id)}
              style={({ pressed }) => [
                styles.method,
                active && styles.methodActive,
                pressed && styles.methodPressed,
              ]}
            >
              <View style={[styles.iconBox, active && styles.iconBoxActive]}>
                <Icon size={18} color={active ? colors.primary : colors.textMuted} />
              </View>
              <Text style={[styles.methodText, active && styles.methodTextActive]}>{m.title}</Text>
              <View style={[styles.radio, active && styles.radioActive]}>
                {active && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={onPay}
        disabled={disabled}
        style={({ pressed }) => [
          styles.payBtn,
          (pressed && !disabled) && styles.payBtnPressed,
          disabled && styles.payBtnDisabled,
        ]}
      >
        <Text style={styles.payBtnText}>CONFIRM & PAY</Text>
      </Pressable>
    </View>
  );
});

PaymentScreen.displayName = 'PaymentScreen';

const styles = StyleSheet.create({
  wrap: {
    paddingTop: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    fontFamily: SERIF,
    letterSpacing: 0.2,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textMuted,
  },
  list: {
    marginTop: 14,
    gap: 10,
  },
  method: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.10)',
  },
  methodActive: {
    borderColor: 'rgba(224, 122, 47, 0.45)',
    backgroundColor: 'rgba(224, 122, 47, 0.08)',
  },
  methodPressed: {
    opacity: 0.92,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.08)',
  },
  iconBoxActive: {
    borderColor: 'rgba(224, 122, 47, 0.25)',
  },
  methodText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 0.2,
  },
  methodTextActive: {
    color: colors.text,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: 'rgba(43, 33, 29, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  radioActive: {
    borderColor: 'rgba(224, 122, 47, 0.55)',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  payBtn: {
    marginTop: 16,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  payBtnPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  payBtnDisabled: {
    backgroundColor: 'rgba(43, 33, 29, 0.22)',
    shadowOpacity: 0,
    elevation: 0,
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
});

