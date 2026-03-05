import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEMO_SESSION_KEY = '@nazrah_demo_session';

const menuItems = [
  { id: 'orders', icon: '📋', title: 'طلباتي', badge: '3 جديد' },
  { id: 'favorites', icon: '❤️', title: 'المفضلة' },
  { id: 'notifications', icon: '🔔', title: 'الإشعارات', badge: '5' },
  { id: 'messages', icon: '💬', title: 'الرسائل', badge: '2' },
  { id: 'wallet', icon: '💳', title: 'المحفظة' },
  { id: 'settings', icon: '⚙️', title: 'الإعدادات' },
  { id: 'support', icon: '📞', title: 'الدعم الفني' },
  { id: 'about', icon: 'ℹ️', title: 'عن نظرة' },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const handleSignOut = async () => {
    Alert.alert('تسجيل الخروج', 'هل أنت متأكد من تسجيل الخروج؟', [
      { text: 'إلغاء', style: 'cancel' },
      { text: 'خروج', style: 'destructive', onPress: async () => { await AsyncStorage.removeItem(DEMO_SESSION_KEY); router.replace('/auth'); } },
    ]);
  };

  const handleMenuPress = (id: string) => {
    if (id === 'wallet') { router.push('/(tabs)/wallet'); }
    else { Alert.alert('قريباً', 'هذه الميزة قيد التطوير'); }
  };

  return (
    <LinearGradient colors={['#1E3A5F', '#0D1F3C']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}><Text style={styles.avatarText}>م</Text></View>
            <TouchableOpacity style={styles.editAvatarButton}><Text style={styles.editAvatarText}>✏️</Text></TouchableOpacity>
          </View>
          <Text style={styles.userName}>مستخدم تجريبي</Text>
          <Text style={styles.userEmail}>demo@nazrah.sa</Text>
          <TouchableOpacity style={styles.editButton}><Text style={styles.editButtonText}>تعديل الملف الشخصي</Text></TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>طلب</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statValue}>500</Text><Text style={styles.statLabel}>رصيد</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statValue}>4.8</Text><Text style={styles.statLabel}>تقييم</Text></View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>الحساب</Text>
          {menuItems.slice(0, 4).map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuPress(item.id)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              {item.badge && <View style={styles.menuBadge}><Text style={styles.menuBadgeText}>{item.badge}</Text></View>}
              <Text style={styles.menuArrow}>←</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>الإعدادات</Text>
          <View style={styles.menuItem}>
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuTitle}>الإشعارات</Text>
            <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} trackColor={{ false: '#333', true: '#4CAF50' }} thumbColor="#fff" />
          </View>
          {menuItems.slice(4).map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuPress(item.id)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <Text style={styles.menuArrow}>←</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>تسجيل الخروج</Text>
        </TouchableOpacity>

        <View style={styles.appInfo}>
          <Text style={styles.appName}>نظرة</Text>
          <Text style={styles.version}>الإصدار 1.0.0</Text>
          <Text style={styles.copyright}>© 2024 جميع الحقوق محفوظة</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', paddingTop: 30, paddingBottom: 20, paddingHorizontal: 20 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 48, color: '#fff', fontWeight: 'bold' },
  editAvatarButton: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  editAvatarText: { fontSize: 16 },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  userEmail: { fontSize: 14, color: '#B8D4E8', marginTop: 4 },
  editButton: { marginTop: 12, paddingHorizontal: 20, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
  editButtonText: { color: '#fff', fontSize: 14 },
  statsCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', marginHorizontal: 20, borderRadius: 16, padding: 20, marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 12, color: '#B8D4E8', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  menuSection: { paddingHorizontal: 20, marginBottom: 8 },
  menuSectionTitle: { fontSize: 14, color: '#B8D4E8', marginBottom: 8, textAlign: 'left', fontWeight: '500' },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 14, marginBottom: 6 },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuTitle: { flex: 1, fontSize: 16, color: '#fff', textAlign: 'left' },
  menuBadge: { backgroundColor: '#4CAF50', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4, marginRight: 8 },
  menuBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  menuArrow: { fontSize: 16, color: '#888' },
  signOutButton: { margin: 20, marginTop: 24, padding: 16, backgroundColor: 'rgba(255,107,107,0.15)', borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#ff6b6b' },
  signOutText: { color: '#ff6b6b', fontSize: 16, fontWeight: 'bold' },
  appInfo: { alignItems: 'center', paddingBottom: 40, paddingTop: 10 },
  appName: { fontSize: 18, fontWeight: 'bold', color: '#4CAF50' },
  version: { fontSize: 12, color: '#888', marginTop: 4 },
  copyright: { fontSize: 10, color: '#666', marginTop: 4 },
});
