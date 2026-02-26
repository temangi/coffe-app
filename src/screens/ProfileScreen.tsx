import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProfileStore } from '../store/profileStore';
import { colors } from '../theme/colors';

interface ProfileScreenProps {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onLogout }) => {
  const { name, phone, orders } = useProfileStore();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Профиль</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Имя</Text>
          <Text style={styles.value}>{name || 'Не указано'}</Text>
          <Text style={styles.label}>Телефон</Text>
          <Text style={styles.value}>{phone || 'Не указано'}</Text>
        </View>

        <Text style={styles.historyTitle}>История заказов</Text>
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              У вас ещё нет заказов. Сделайте первый в нашем меню.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.orderRow}>
              <View>
                <Text style={styles.orderId}>Заказ #{item.id}</Text>
                <Text style={styles.orderDate}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
              <Text style={styles.orderTotal}>{item.total} ₽</Text>
            </View>
          )}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textMuted,
    marginTop: 8,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: colors.textMuted,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  logoutButton: {
    marginTop: 16,
    marginBottom: 24,
    height: 48,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});

