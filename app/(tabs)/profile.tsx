import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/hooks/useAuth';
import { useRouter } from 'expo-router';

const menuItems = [
  { id: 'orders', icon: '[#]', title: 'طلباتي' },
  { id: 'favorites', icon: '[*]', title: 'المفضلة' },
  { id: 'notifications', icon: '[!]', title: 'الإشعارات' },
  { id: 'settings', icon: '[@]', title: 'الإعدادات' },
  { id: 'support', icon: '[?]', title: 'الدعم الفني' },
  { id: 'about', icon: '[i]', title: 'عن التطبيق' },
];

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'خروج',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  const handleMenuPress = (id: string) => {
    Alert.alert('قريباً', 'هذه الميزة قيد التطوير');
  };

  return (
    <LinearGradient colors={['#1E3A5F', '#0D1F3C']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.user_metadata?.name?.charAt(0) || 'م'}
            </Text>
          </View>
          <Text style={styles.userName}>
            {user?.user_metadata?.name || 'المستخدم'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'demo@nazrah.sa'}
          </Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>تعديل الملف</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>طلب</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>450</Text>
            <Text style={styles.statLabel}>رصيد</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>تقييم</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.id)}
            >
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuArrow}>{'<'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>تسجيل الخروج</Text>
        </TouchableOpacity>

        <Text style={styles.version}>الإصدار 1.0.0</Text>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 14,
    color: '#B8D4E8',
    marginTop: 4,
  },
  editButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  stats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#B8D4E8',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  menu: {
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 16,
    color: '#fff',
  },
  menuTitle: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'right',
  },
  menuArrow: {
    fontSize: 18,
    color: '#888',
  },
  signOutButton: {
    margin: 20,
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255,107,107,0.2)',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff6b6b',
  },
  signOutText: {
    color: '#ff6b6b',
    fontSize: 16,
    fontWeight: 'bold',
  },
  version: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
    marginBottom: 40,
  },
});
