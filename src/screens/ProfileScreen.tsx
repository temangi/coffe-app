import React, { useCallback, useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Bell, Camera, LogOut, Mail, ShoppingBag, User } from 'lucide-react-native';
import { useProfileStore } from '../store/profileStore';
import { colors } from '../theme/colors';
import { FaizaHeader } from '../components/FaizaHeader';
import { useI18n } from '../i18n/useI18n';
import { withPressFeedback } from '../theme/interaction';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { width } = useWindowDimensions();
  const horizontal = useMemo(() => (width >= 768 ? 28 : 16), [width]);
  const { t } = useI18n();

  const { name, phone, email, avatarUri, notificationsEnabled, orders, setProfile, setNotificationsEnabled } = useProfileStore();

  const [localName, setLocalName] = useState(name || '');
  const [localEmail, setLocalEmail] = useState(email || '');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handlePickAvatar = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled && result.assets[0]?.uri) {
      setProfile({ avatarUri: result.assets[0].uri });
    }
  }, [setProfile]);

  const validateEmail = useCallback((value: string) => {
    if (!value) {
      setEmailError(null);
      return true;
    }
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    setEmailError(isValid ? null : t('profile.invalidEmail'));
    return isValid;
  }, []);

  const handleSaveProfile = useCallback(() => {
    if (!validateEmail(localEmail)) return;
    setProfile({ name: localName.trim() || 'Гость Faiza', email: localEmail.trim() });
  }, [localEmail, localName, setProfile, validateEmail]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FaizaHeader title={t('profile.title')} subtitle={t('profile.subtitle')} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.content, { paddingHorizontal: horizontal }]}> 
          <View style={styles.profileCard}>
            <View style={styles.avatarWrap}>
              {avatarUri ? <Image source={{ uri: avatarUri }} style={styles.avatarImage} /> : <User color="#FFF" size={34} />}
              <Pressable style={styles.cameraBtn} onPress={handlePickAvatar}>
                <Camera size={14} color="#FFF" />
              </Pressable>
            </View>
            <Text style={styles.name}>{name || 'Гость Faiza'}</Text>
            <Text style={styles.phone}>{phone || t('profile.noPhone')}</Text>
          </View>

          <View style={styles.card}>
            <InputRow label={t('profile.name')} icon={<User size={18} color={colors.primary} />}>
              <TextInput value={localName} onChangeText={setLocalName} placeholder="Ваше имя" placeholderTextColor={colors.textMuted} style={styles.input} />
            </InputRow>

            <View style={styles.divider} />

            <InputRow label={t('profile.email')} icon={<Mail size={18} color={colors.primary} />}>
              <TextInput
                value={localEmail}
                onChangeText={(val) => {
                  setLocalEmail(val);
                  if (emailError) validateEmail(val);
                }}
                placeholder="example@faiza.kg"
                autoCapitalize="none"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
              />
            </InputRow>
          </View>

          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          <Pressable style={withPressFeedback(styles.saveBtn)} onPress={handleSaveProfile}>
            <Text style={styles.saveText}>{t('profile.save')}</Text>
          </Pressable>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <View style={styles.iconCircle}>
                  <Bell size={18} color={colors.primary} />
                </View>
                <Text style={styles.settingTitle}>{t('profile.notifications')}</Text>
              </View>
              <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: '#D6CFCA', true: colors.primary }} thumbColor={Platform.OS === 'android' ? '#FFF' : undefined} />
            </View>
          </View>

          <Text style={styles.sectionTitle}>{t('profile.history')}</Text>
          <View style={styles.card}>
            {orders.length > 0 ? (
              orders.slice(0, 4).map((order) => (
                <View key={order.id} style={styles.orderRow}>
                  <View style={styles.orderIcon}>
                    <ShoppingBag size={15} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderTitle}>Заказ #{order.id.slice(-4)}</Text>
                    <Text style={styles.orderMeta}>{new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</Text>
                  </View>
                  <Text style={styles.orderAmount}>{order.total} сом</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>{t('profile.historyEmpty')}</Text>
            )}
          </View>

          <Pressable style={withPressFeedback(styles.logoutBtn)} onPress={onLogout}>
            <LogOut size={18} color="#FFF" />
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const InputRow: React.FC<{ label: string; icon: React.ReactNode; children: React.ReactNode }> = ({ label, icon, children }) => (
  <View style={styles.row}>
    <View style={styles.rowIcon}>{icon}</View>
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>{label}</Text>
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: { paddingTop: 8, paddingBottom: 120 },
  profileCard: { alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF' },
  avatarWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  avatarImage: { width: 88, height: 88, borderRadius: 44 },
  cameraBtn: { position: 'absolute', right: -2, bottom: -2, width: 30, height: 30, borderRadius: 999, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFF' },
  name: { marginTop: 12, fontSize: 20, fontWeight: '800', color: colors.text },
  phone: { marginTop: 4, fontSize: 13, color: colors.textMuted },
  card: { marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFF', padding: 14 },
  row: { flexDirection: 'row', gap: 10 },
  rowIcon: { paddingTop: 6 },
  rowLabel: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { marginTop: 3, color: colors.text, fontSize: 15, fontWeight: '600', paddingVertical: 3 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 12 },
  error: { marginTop: 8, color: '#B00020', fontSize: 12 },
  saveBtn: { marginTop: 10, minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  saveText: { color: colors.primary, fontWeight: '800' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingInfo: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconCircle: { width: 34, height: 34, borderRadius: 9, backgroundColor: '#F7ECE3', alignItems: 'center', justifyContent: 'center' },
  settingTitle: { color: colors.text, fontWeight: '700' },
  sectionTitle: { marginTop: 18, color: colors.text, fontSize: 18, fontWeight: '900' },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 },
  orderIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: '#F7ECE3', alignItems: 'center', justifyContent: 'center' },
  orderTitle: { color: colors.text, fontWeight: '700', fontSize: 14 },
  orderMeta: { color: colors.textMuted, marginTop: 2, fontSize: 12 },
  orderAmount: { color: colors.primary, fontWeight: '800' },
  emptyText: { color: colors.textMuted, textAlign: 'center' },
  logoutBtn: { marginTop: 16, minHeight: 50, borderRadius: 12, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  logoutText: { color: '#FFF', fontWeight: '800' },
});
