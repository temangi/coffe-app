import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '../store/profileStore';
import { colors } from '../theme/colors';
import { User, Camera, Bell, LogOut, ChevronRight, Mail, Phone, ShoppingBag } from 'lucide-react-native';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const {
    name,
    phone,
    email,
    avatarUri,
    notificationsEnabled,
    orders,
    setProfile,
    setNotificationsEnabled,
  } = useProfileStore();

  const [localName, setLocalName] = useState(name || '');
  const [localEmail, setLocalEmail] = useState(email || '');
  const [emailError, setEmailError] = useState<string | null>(null);

  const handlePickAvatar = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

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
    setEmailError(isValid ? null : 'Введите корректный email');
    return isValid;
  }, []);

  const handleSaveProfile = useCallback(() => {
    if (!validateEmail(localEmail)) return;
    setProfile({
      name: localName.trim() || 'Местный бариста',
      email: localEmail.trim(),
    });
  }, [localEmail, localName, setProfile, validateEmail]);

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarCircle}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
                ) : (
                  <User color="#FFFFFF" size={40} />
                )}
              </View>
              <TouchableOpacity style={styles.cameraButton} onPress={handlePickAvatar}>
                <Camera color="#FFF" size={16} />
              </TouchableOpacity>
            </View>
            <Text style={styles.userName}>{name || 'Местный бариста'}</Text>
            <Text style={styles.userPhone}>{phone || 'Номер не указан'}</Text>
          </View>

          {/* Main Info Card */}
          <View style={styles.card}>
            <View style={styles.inputRow}>
              <User size={20} color={colors.primary} style={styles.inputIcon} />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Имя</Text>
                <TextInput
                  style={styles.textInput}
                  value={localName}
                  onChangeText={setLocalName}
                  placeholder="Ваше имя"
                />
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.inputRow}>
              <Mail size={20} color={colors.primary} style={styles.inputIcon} />
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  value={localEmail}
                  onChangeText={(val) => {
                    setLocalEmail(val);
                    if (emailError) validateEmail(val);
                  }}
                  placeholder="example@coffee.kg"
                  autoCapitalize="none"
                />
              </View>
            </View>
          </View>
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <TouchableOpacity style={styles.saveAction} onPress={handleSaveProfile}>
            <Text style={styles.saveActionText}>Обновить профиль</Text>
          </TouchableOpacity>

          {/* Settings Section */}
          <Text style={styles.sectionHeader}>Настройки</Text>
          <View style={styles.card}>
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <View style={[styles.iconBox, { backgroundColor: '#F0F7FF' }]}>
                  <Bell size={20} color="#007AFF" />
                </View>
                <Text style={styles.preferenceTitle}>Уведомления</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D1D6', true: colors.primary }}
                thumbColor={Platform.OS === 'android' ? '#FFF' : undefined}
              />
            </View>
          </View>

          {/* Orders Section */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>История заказов</Text>
            <ShoppingBag size={18} color={colors.textMuted} />
          </View>
          
          <View style={styles.ordersList}>
            {orders.length > 0 ? (
              orders.map((order) => (
                <TouchableOpacity key={order.id} style={styles.orderItem}>
                  <View style={styles.orderIconBox}>
                    <Text style={{ fontSize: 18 }}>☕️</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderIdText}>Заказ #{order.id.slice(-4)}</Text>
                    <Text style={styles.orderDateText}>
                      {new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.orderAmount}>{order.total} ⃀</Text>
                    <ChevronRight size={16} color="#C7C7CC" />
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyOrders}>Здесь будет ваша история кофе</Text>
            )}
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
            <LogOut size={20} color="#FF3B30" />
            <Text style={styles.logoutBtnText}>Выйти из аккаунта</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  
  header: { alignItems: 'center', marginBottom: 30 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.15, shadowRadius: 20 },
      android: { elevation: 8 }
    })
  },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1C1C1E',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#F8F9FA'
  },
  userName: { fontSize: 24, fontWeight: '800', color: '#1C1C1E' },
  userPhone: { fontSize: 14, color: '#8E8E93', marginTop: 4, fontWeight: '500' },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  inputIcon: { marginRight: 16 },
  inputWrapper: { flex: 1 },
  inputLabel: { fontSize: 11, fontWeight: '700', color: '#AEA9A9', textTransform: 'uppercase', letterSpacing: 0.5 },
  textInput: { fontSize: 16, color: '#1C1C1E', fontWeight: '600', paddingVertical: 4 },
  divider: { height: 1, backgroundColor: '#F2F2F7', marginLeft: 36, marginVertical: 8 },
  
  errorText: { color: '#FF3B30', fontSize: 12, marginLeft: 16, marginBottom: 8 },
  
  saveAction: {
    backgroundColor: '#FFF',
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 30
  },
  saveActionText: { color: colors.primary, fontWeight: '700', fontSize: 15 },

  sectionHeader: { fontSize: 18, fontWeight: '800', color: '#1C1C1E', marginBottom: 16, marginLeft: 4 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },

  preferenceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  preferenceInfo: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  preferenceTitle: { fontSize: 16, fontWeight: '600', color: '#1C1C1E' },

  ordersList: { marginBottom: 30 },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F2F2F7'
  },
  orderIconBox: { width: 48, height: 48, backgroundColor: '#F8F9FA', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  orderIdText: { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  orderDateText: { fontSize: 12, color: '#AEA9A9', marginTop: 2 },
  orderAmount: { fontSize: 16, fontWeight: '800', color: colors.primary, marginBottom: 2 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  logoutBtnText: { color: '#FF3B30', fontSize: 16, fontWeight: '700', marginLeft: 10 },
  emptyOrders: { textAlign: 'center', color: '#AEA9A9', marginTop: 10, fontSize: 14 }
});