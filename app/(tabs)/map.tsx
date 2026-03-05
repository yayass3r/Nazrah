import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  Linking,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Riyadh coordinates
const RIYADH_REGION: Region = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

// Sample providers
const providers = [
  { id: 1, name: 'أحمد المصور', latitude: 24.7146, longitude: 46.6763, service: 'تصوير حفلات', price: 100, rating: 4.8, distance: '1.2 كم', phone: '+966501234567' },
  { id: 2, name: 'محمد فيديو', latitude: 24.7206, longitude: 46.6823, service: 'تصوير زواج', price: 500, rating: 4.9, distance: '2.5 كم', phone: '+966502345678' },
  { id: 3, name: 'خالد التصوير', latitude: 24.7086, longitude: 46.6683, service: 'تصوير مناسبات', price: 200, rating: 4.7, distance: '0.8 كم', phone: '+966503456789' },
  { id: 4, name: 'سارة للتصوير', latitude: 24.7166, longitude: 46.6793, service: 'تصوير حفلات', price: 150, rating: 4.6, distance: '1.5 كم', phone: '+966504567890' },
  { id: 5, name: 'فهد ميديا', latitude: 24.7106, longitude: 46.6723, service: 'تصوير شركات', price: 300, rating: 4.9, distance: '2.0 كم', phone: '+966505678901' },
];

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showProviders, setShowProviders] = useState(true);
  const [region, setRegion] = useState<Region>(RIYADH_REGION);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = async () => {
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setErrorMsg('تم رفض إذن الموقع - يعرض موقع الرياض');
        setRegion(RIYADH_REGION);
        setLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(loc);
      setRegion({ latitude: loc.coords.latitude, longitude: loc.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 });
    } catch (error) {
      setErrorMsg('فشل تحديد الموقع - يعرض موقع الرياض');
      setRegion(RIYADH_REGION);
    } finally {
      setLoading(false);
    }
  };

  const goToMyLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({ latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 1000);
    } else {
      Alert.alert('تنبيه', 'لم يتم تحديد موقعك');
    }
  };

  const focusOnProvider = (provider: any) => {
    const newRegion = { latitude: provider.latitude, longitude: provider.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500);
    setSelectedProvider(provider);
  };

  const handleCall = (phone: string) => Linking.openURL(`tel:${phone}`).catch(() => Alert.alert('خطأ', 'لا يمكن إجراء المكالمة'));
  const handleMessage = (phone: string) => Linking.openURL(`sms:${phone}`).catch(() => Alert.alert('خطأ', 'لا يمكن إرسال الرسالة'));

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
      <MapView ref={mapRef} style={styles.map} region={region} onRegionChangeComplete={setRegion} showsUserLocation={!!location} showsMyLocationButton={false} showsCompass showsScale>
        {providers.map((provider) => (
          <Marker key={provider.id} coordinate={{ latitude: provider.latitude, longitude: provider.longitude }} onPress={() => setSelectedProvider(provider)}>
            <View style={styles.markerContainer}>
              <View style={styles.markerPin}><Text style={styles.markerPrice}>{provider.price}</Text></View>
              <View style={styles.markerDot} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <LinearGradient colors={['rgba(30,58,95,0.98)', 'transparent']} style={styles.headerOverlay}>
        <View><Text style={styles.headerTitle}>الخريطة</Text><Text style={styles.headerSubtext}>{providers.length} مقدم خدمة</Text></View>
        <TouchableOpacity style={styles.myLocationButton} onPress={goToMyLocation}><Text style={styles.myLocationIcon}>MY</Text></TouchableOpacity>
      </LinearGradient>

      {/* Toggle */}
      <TouchableOpacity style={styles.listToggle} onPress={() => setShowProviders(!showProviders)}>
        <Text style={styles.listToggleText}>{showProviders ? 'X' : '='}</Text>
      </TouchableOpacity>

      {/* Providers List */}
      {showProviders && (
        <View style={styles.providersList}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {providers.map((provider) => (
              <TouchableOpacity key={provider.id} style={[styles.providerItem, selectedProvider?.id === provider.id && styles.providerItemSelected]} onPress={() => focusOnProvider(provider)}>
                <Text style={styles.providerItemName}>{provider.name}</Text>
                <Text style={styles.providerItemPrice}>{provider.price} ر.س</Text>
                <Text style={styles.providerItemDistance}>{provider.distance}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Selected Provider Card */}
      {selectedProvider && (
        <View style={styles.providerCard}>
          <TouchableOpacity style={styles.closeCard} onPress={() => setSelectedProvider(null)}><Text style={styles.closeCardText}>X</Text></TouchableOpacity>
          <View style={styles.providerCardContent}>
            <View style={styles.providerCardHeader}>
              <View style={styles.providerAvatar}><Text style={styles.providerAvatarText}>{selectedProvider.name.charAt(0)}</Text></View>
              <View style={styles.providerCardInfo}>
                <Text style={styles.providerName}>{selectedProvider.name}</Text>
                <Text style={styles.providerService}>{selectedProvider.service}</Text>
                <Text style={styles.providerRating}>★ {selectedProvider.rating} • {selectedProvider.distance}</Text>
              </View>
              <View><Text style={styles.providerPriceValue}>{selectedProvider.price}</Text><Text style={styles.providerPriceUnit}>ريال</Text></View>
            </View>
            <View style={styles.providerCardActions}>
              <TouchableOpacity style={styles.callButton} onPress={() => handleCall(selectedProvider.phone)}><Text style={styles.callButtonText}>اتصال</Text></TouchableOpacity>
              <TouchableOpacity style={styles.messageButton} onPress={() => handleMessage(selectedProvider.phone)}><Text style={styles.messageButtonText}>رسالة</Text></TouchableOpacity>
              <TouchableOpacity style={styles.bookButton}><Text style={styles.bookButtonText}>احجز</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {errorMsg && <View style={styles.errorBanner}><Text style={styles.errorText}>{errorMsg}</Text><TouchableOpacity onPress={requestLocation}><Text style={styles.retryText}>إعادة</Text></TouchableOpacity></View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E3A5F' },
  map: { width, height },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E3A5F' },
  loadingText: { color: '#fff', marginTop: 16, fontSize: 18 },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingTop: 50, paddingBottom: 25, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between' },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff' },
  headerSubtext: { fontSize: 14, color: '#B8D4E8', marginTop: 4 },
  myLocationButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  myLocationIcon: { fontSize: 12, fontWeight: 'bold', color: '#1E3A5F' },
  listToggle: { position: 'absolute', bottom: 280, right: 16, width: 48, height: 48, borderRadius: 24, backgroundColor: '#1E3A5F', justifyContent: 'center', alignItems: 'center' },
  listToggleText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  providersList: { position: 'absolute', bottom: 200, left: 0, right: 0 },
  providerItem: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginLeft: 6, marginRight: 6, width: 140 },
  providerItemSelected: { borderWidth: 2, borderColor: '#4CAF50' },
  providerItemName: { fontSize: 14, fontWeight: 'bold', color: '#1E3A5F', textAlign: 'right' },
  providerItemPrice: { fontSize: 14, fontWeight: 'bold', color: '#4CAF50', marginTop: 4, textAlign: 'right' },
  providerItemDistance: { fontSize: 11, color: '#888', marginTop: 2, textAlign: 'right' },
  markerContainer: { alignItems: 'center' },
  markerPin: { backgroundColor: '#4CAF50', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 2, borderColor: '#fff' },
  markerPrice: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  markerDot: { width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: '#4CAF50', marginTop: -2 },
  providerCard: { position: 'absolute', bottom: 20, left: 16, right: 16, backgroundColor: '#fff', borderRadius: 20, overflow: 'hidden' },
  closeCard: { position: 'absolute', top: 10, right: 10, width: 28, height: 28, borderRadius: 14, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  closeCardText: { fontSize: 14, color: '#666', fontWeight: 'bold' },
  providerCardContent: { padding: 16 },
  providerCardHeader: { flexDirection: 'row', alignItems: 'center' },
  providerAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  providerAvatarText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  providerCardInfo: { flex: 1, marginLeft: 12, marginRight: 12 },
  providerName: { fontSize: 18, fontWeight: 'bold', color: '#1E3A5F', textAlign: 'right' },
  providerService: { fontSize: 14, color: '#666', textAlign: 'right' },
  providerRating: { fontSize: 12, color: '#FFD700', textAlign: 'right', marginTop: 4 },
  providerPriceValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', textAlign: 'center' },
  providerPriceUnit: { fontSize: 12, color: '#888', textAlign: 'center' },
  providerCardActions: { flexDirection: 'row', marginTop: 16, justifyContent: 'space-between' },
  callButton: { width: 70, height: 44, borderRadius: 12, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  callButtonText: { fontSize: 14, color: '#4CAF50', fontWeight: '600' },
  messageButton: { width: 70, height: 44, borderRadius: 12, backgroundColor: '#E3F2FD', justifyContent: 'center', alignItems: 'center' },
  messageButtonText: { fontSize: 14, color: '#2196F3', fontWeight: '600' },
  bookButton: { flex: 1, marginLeft: 12, height: 44, borderRadius: 12, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorBanner: { position: 'absolute', top: 115, left: 16, right: 80, backgroundColor: '#FF9800', borderRadius: 10, padding: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  errorText: { color: '#fff', flex: 1, fontSize: 12 },
  retryText: { color: '#fff', fontWeight: 'bold', marginLeft: 10, fontSize: 12 },
});
