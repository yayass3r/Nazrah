import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const services = [
  { id: 1, name: 'تصوير حفلات', icon: '🎉', price: 'من 100 ريال', count: 45 },
  { id: 2, name: 'تصوير زواج', icon: '💒', price: 'من 500 ريال', count: 32 },
  { id: 3, name: 'تصوير مناسبات', icon: '🎊', price: 'من 200 ريال', count: 28 },
  { id: 4, name: 'تصوير شركات', icon: '🏢', price: 'من 300 ريال', count: 15 },
  { id: 5, name: 'تصوير رياضي', icon: '⚽', price: 'من 150 ريال', count: 22 },
  { id: 6, name: 'تصوير طبيعة', icon: '🌿', price: 'من 80 ريال', count: 18 },
];

const providers = [
  { id: 1, name: 'أحمد المصور', rating: 4.8, jobs: 120, service: 'تصوير حفلات', price: 100 },
  { id: 2, name: 'محمد فيديو', rating: 4.9, jobs: 85, service: 'تصوير زواج', price: 500 },
  { id: 3, name: 'خالد التصوير', rating: 4.7, jobs: 200, service: 'تصوير مناسبات', price: 200 },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <LinearGradient colors={['#1E3A5F', '#0D1F3C']} style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4CAF50" />}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeGreeting}>مرحباً 👋</Text>
          <Text style={styles.welcomeName}>المستخدم</Text>
          
          {/* Quick Stats */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>500</Text>
              <Text style={styles.statLabel}>رصيدك</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>طلب</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>تقييمك</Text>
            </View>
          </View>
        </View>

        {/* Services Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الخدمات المتاحة</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
                <View style={styles.serviceCount}>
                  <Text style={styles.serviceCountText}>{service.count} مقدم</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top Providers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أفضل مقدمي الخدمة</Text>
          {providers.map((provider) => (
            <View key={provider.id} style={styles.providerCard}>
              <View style={styles.providerAvatar}>
                <Text style={styles.avatarText}>{provider.name.charAt(0)}</Text>
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <Text style={styles.providerService}>{provider.service}</Text>
                <View style={styles.providerStats}>
                  <Text style={styles.rating}>★ {provider.rating}</Text>
                  <Text style={styles.jobs}>• {provider.jobs} مهمة</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>احجز</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  welcomeSection: { padding: 20, paddingTop: 10 },
  welcomeGreeting: { fontSize: 16, color: '#B8D4E8', textAlign: 'left' },
  welcomeName: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'left', marginTop: 4 },
  statsCard: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginTop: 16 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  statLabel: { fontSize: 12, color: '#B8D4E8', marginTop: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 16, textAlign: 'right' },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  serviceCard: { width: '48%', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 12, alignItems: 'center' },
  serviceIcon: { fontSize: 36, marginBottom: 8 },
  serviceName: { fontSize: 14, color: '#fff', fontWeight: '600', textAlign: 'center' },
  servicePrice: { fontSize: 12, color: '#4CAF50', marginTop: 4, textAlign: 'center' },
  serviceCount: { backgroundColor: 'rgba(76,175,80,0.2)', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginTop: 8 },
  serviceCountText: { fontSize: 10, color: '#4CAF50' },
  providerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, padding: 16, marginBottom: 12 },
  providerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  providerInfo: { flex: 1, marginLeft: 12, marginRight: 12 },
  providerName: { fontSize: 16, color: '#fff', fontWeight: '600', textAlign: 'right' },
  providerService: { fontSize: 12, color: '#B8D4E8', marginTop: 2, textAlign: 'right' },
  providerStats: { flexDirection: 'row', marginTop: 4 },
  rating: { fontSize: 12, color: '#FFD700' },
  jobs: { fontSize: 12, color: '#888', marginLeft: 8 },
  bookButton: { backgroundColor: '#4CAF50', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  bookButtonText: { color: '#fff', fontWeight: 'bold' },
});
