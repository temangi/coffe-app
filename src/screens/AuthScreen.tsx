import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface AuthScreenProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSubmit, isLoading, error }) => {
  const [phone, setPhone] = useState('+996 ');

  // Рефы для анимаций
  const keyboardAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoSlide = useRef(new Animated.Value(30)).current;
  const formSlide = useRef(new Animated.Value(50)).current;
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Каскадное появление элементов (Stagger)
    Animated.stagger(100, [
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.spring(logoSlide, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
      ]),
      Animated.spring(formSlide, { toValue: 0, tension: 15, friction: 8, useNativeDriver: true }),
    ]).start();

    // Синхронизация с клавиатурой
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: -e.endCoordinates.height * 0.35,
        duration: Platform.OS === 'ios' ? e.duration : 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(keyboardAnim, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration : 300,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const handleFocus = () => {
    Animated.spring(focusAnim, {
      toValue: 1,
      tension: 40,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.spring(focusAnim, {
      toValue: 0,
      tension: 40,
      friction: 7,
      useNativeDriver: false,
    }).start();
  };

  const inputScale = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const inputBorder = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F2F2F7', colors.primary || '#D17842'],
  });

  // Логика форматирования (KG)
  const handleChangePhone = useCallback((text: string) => {
    const digits = text.replace(/\D/g, '');
    if (text.length < 5 && phone.includes('+996')) {
      setPhone('+996 ');
      return;
    }
    // Простая маска внутри
    let res = '+996';
    const main = digits.startsWith('996') ? digits.substring(3) : digits;
    if (main.length > 0) res += ' (' + main.substring(0, 3);
    if (main.length >= 3) res += ') ' + main.substring(3, 5);
    if (main.length >= 5) res += '-' + main.substring(5, 7);
    if (main.length >= 7) res += '-' + main.substring(7, 9);
    setPhone(res);
  }, [phone]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.flex}>
        <SafeAreaView style={styles.safe}>
          <Animated.View style={[styles.bgBlob, { opacity: fadeAnim }]} />
          <Animated.View style={[styles.container, { transform: [{ translateY: keyboardAnim }] }]}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: logoSlide }] }}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoEmoji}>☕️</Text>
              </View>
              <Text style={styles.title}>CoffeePoint</Text>
              <Text style={styles.subtitle}>Бишкек • Твой любимый кофе</Text>
            </Animated.View>
            <Animated.View style={[
              styles.form,
              { opacity: fadeAnim, transform: [{ translateY: formSlide }] }
            ]}>
              <Text style={styles.label}>Телефон</Text>

              <Animated.View style={{ transform: [{ scale: inputScale }] }}>
                <AnimatedTextInput
                  style={[styles.input, { borderColor: inputBorder }]}
                  keyboardType="phone-pad"
                  value={phone}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChangeText={handleChangePhone}
                  placeholder="+996 (___) __-__-__"
                  placeholderTextColor="#AEA9A9"
                  maxLength={19}
                />
              </Animated.View>

              {error && <Text style={styles.errorText}>{error}</Text>}

              <TouchableOpacity
                style={[styles.button, (phone.length < 19 || isLoading) && styles.buttonDisabled]}
                onPress={() => onSubmit(phone)}
                disabled={phone.length < 19 || isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Войти</Text>}
              </TouchableOpacity>

              <Text style={styles.footerText}>Твой кофе уже готовится!</Text>
            </Animated.View>
          </Animated.View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#FFF' },
  safe: { flex: 1 },
  bgBlob: {
    position: 'absolute',
    width: width * 1.3,
    height: width * 1.3,
    borderRadius: width,
    backgroundColor: '#FDF7F2',
    top: -width * 0.7,
    right: -width * 0.3,
  },
  container: { flex: 1, paddingHorizontal: 35, justifyContent: 'center' },
  logoBadge: {
    width: 60, height: 60, borderRadius: 20,
    backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center',
    marginBottom: 20, elevation: 4, shadowColor: '#000',
    shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }
  },
  logoEmoji: { fontSize: 30 },
  title: { fontSize: 36, fontWeight: '900', color: '#1C1C1E', letterSpacing: -1 },
  subtitle: { fontSize: 16, color: '#8E8E93', marginTop: 5 },
  form: { marginTop: 40 },
  label: { fontSize: 11, fontWeight: '800', color: '#BCBABB', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 },
  input: {
    height: 65, borderRadius: 20, paddingHorizontal: 20,
    fontSize: 20, fontWeight: '700', color: '#1C1C1E',
    borderWidth: 2, backgroundColor: '#F9F9F9'
  },
  button: {
    height: 65, borderRadius: 20, backgroundColor: colors.primary || '#D17842',
    justifyContent: 'center', alignItems: 'center', marginTop: 25,
    shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }
  },
  buttonDisabled: { backgroundColor: '#E5E5EA', shadowOpacity: 0 },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: '800' },
  errorText: { color: '#FF3B30', fontSize: 14, marginTop: 10, textAlign: 'center', fontWeight: '600' },
  footerText: { textAlign: 'center', color: '#AEA9A9', fontSize: 12, marginTop: 25 }
});