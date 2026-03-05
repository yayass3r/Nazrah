import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const providers = [
  {
    id: 1,
    name: 'أحمد المصور',
    latitude: 24.7136,
    longitude: 46.6753,
    service: 'تصوير حفلات',
    price: 100,
  },
  {
    id: 2,
    name: 'محمد فيديو',
    latitude: 24.7236,
    longitude: 46.6853,
    service: 'تصوير زواج',
    price: 500,
  },
  {
    id: 3,
    name: 'خالد التصوير',
    latitude: 24.7036,
    longitude: 46.6653,
    service: 'تصوير مناسبات',
    price: 200,
  },
];

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('تم رفض إذن الوصول للموقع');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      } catch (error) {
        setErrorMsg('فشل في تحديد الموقع');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const initialRegion = {
    latitude: location?.coords.latitude || 24.7136,
    longitude: location?.coords.longitude || 46.6753,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>جاري تحديد الموقع...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
      >
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            coordinate={{
              latitude: provider.latitude,
              longitude: provider.longitude,
            }}
            title={provider.name}
            description={`${provider.service} - ${provider.price} ريال`}
            onPress={() => setSelectedProvider(provider)}
          />
        ))}
      </MapView>

      <LinearGradient
        colors={['rgba(30,58,95,0.9)', 'transparent']}
        style={styles.headerOverlay}
      >
        <Text style={styles.headerTitle}>الخريطة</Text>
        <Text style={styles.headerSubtext}>
          {providers.length} مقدم خدمة قريب منك
        </Text>
      </LinearGradient>

      {selectedProvider && (
        <View style={styles.providerCard}>
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{selectedProvider.name}</Text>
            <Text style={styles.providerService}>{selectedProvider.service}</Text>
            <Text style={styles.providerPrice}>{selectedProvider.price} ريال</Text>
          </View>
          <View style={styles.providerActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>طلب خدمة</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedProvider(null)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {errorMsg && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E3A5F',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'right',
  },
  headerSubtext: {
    fontSize: 14,
    color: '#B8D4E8',
    marginTop: 4,
    textAlign: 'right',
  },
  providerCard: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A5F',
    textAlign: 'right',
  },
  providerService: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  providerPrice: {
    fontSize: 16,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'right',
  },
  providerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  errorBanner: {
    position: 'absolute',
    top: 120,
    left: 20,
    right: 20,
    backgroundColor: '#ff4444',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: '#fff',
    textAlign: 'center',
  },
});
