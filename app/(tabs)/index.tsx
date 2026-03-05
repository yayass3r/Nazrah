import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../src/hooks/useAuth';

const services = [
  { id: 1, name: 'تصوير حفلات', icon: '*', price: '100 ريال' },
  { id: 2, name: 'تصوير زواج', icon: '+', price: '500 ريال' },
  { id: 3, name: 'تصوير مناسبات', icon: '!', price: '200 ريال' },
  { id: 4, name: 'تصوير شركات', icon: '#', price: '300 ريال' },
  { id: 5, name: 'تصوير رياضي', icon: '@', price: '150 ريال' },
  { id: 6, name: 'تصوير طبيعة', icon: '$', price: '80 ريال' },
];

const providers = [
  { id: 1, name: 'أحمد المصور', rating: 4.8, jobs: 120 },
  { id: 2, name: 'محمد فيديو', rating: 4.9, jobs: 85 },
  { id: 3, name: 'خالد التصوير', rating: 4.7, jobs: 200 },
];

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <LinearGradient colors={['#1E3A5F', '#0D1F3C']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>
            مرحباً، {user?.user_metadata?.name || 'المستخدم'}
          </Text>
          <Text style={styles.welcomeSubtext}>
            ما الخدمة التي تبحث عنها اليوم؟
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>الخدمات المتاحة</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity key={service.id} style={styles.serviceCard}>
                <Text style={styles.serviceIcon}>{service.icon}</Text>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>أفضل مقدمي الخدمة</Text>
          {providers.map((provider) => (
            <View key={provider.id} style={styles.providerCard}>
              <View style={styles.providerAvatar}>
                <Text style={styles.avatarText}>
                  {provider.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>{provider.name}</Text>
                <View style={styles.providerStats}>
                  <Text style={styles.rating}>* {provider.rating}</Text>
                  <Text style={styles.jobs}>{provider.jobs} مهمة</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>احجز</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>*</Text>
            <Text style={styles.quickActionText}>البحث بالخريطة</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Text style={styles.quickActionIcon}>+</Text>
            <Text style={styles.quickActionText}>تسجيل فيديو</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeSection: {
    padding: 20,
    paddingTop: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
  welcomeSubtext: {
    fontSize: 16,
    color: '#B8D4E8',
    marginTop: 8,
    textAlign: 'right',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'right',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  serviceIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  servicePrice: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  providerInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  providerName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'right',
  },
  providerStats: {
    flexDirection: 'row',
    marginTop: 4,
  },
  rating: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 12,
  },
  jobs: {
    fontSize: 12,
    color: '#888',
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  quickAction: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
