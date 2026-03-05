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
} from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// OpenStreetMap tile URL (FREE - no API key needed)
const OSM_TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

// Alternative free tile servers:
// CartoDB: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png'
// MapBox Style (free tier): 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png'

const providers = [
  {
    id: 1,
    name: 'أحمد المصور',
    latitude: 24.7136,
    longitude: 46.6753,
    service: 'تصوير حفلات',
    price: 100,
    rating: 4.8,
    distance: '1.2 كم',
  },
  {
    id: 2,
    name: 'محمد فيديو',
    latitude: 24.7236,
    longitude: 46.6853,
    service: 'تصوير زواج',
    price: 500,
    rating: 4.9,
    distance: '2.5 كم',
  },
  {
    id: 3,
    name: 'خالد التصوير',
    latitude: 24.7036,
    longitude: 46.6653,
    service: 'تصوير مناسبات',
    price: 200,
    rating: 4.7,
    distance: '0.8 كم',
  },
  {
    id: 4,
    name: 'سارة للتصوير',
    latitude: 24.7176,
    longitude: 46.6803,
    service: 'تصوير حفلات',
    price: 150,
    rating: 4.6,
    distance: '1.5 كم',
  },
  {
    id: 5,
    name: 'فهد ميديا',
    latitude: 24.7086,
    longitude: 46.6703,
    service: 'تصوير شركات',
    price: 300,
    rating: 4.9,
    distance: '2.0 كم',
  },
];

// Custom Marker Component
function CustomMarker({ provider, onPress }: { provider: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.customMarker} onPress={onPress}>
      <View style={styles.markerCircle}>
        <Text style={styles.markerIcon}>[M]</Text>
      </View>
      <View style={styles.markerLabel}>
        <Text style={styles.markerText} numberOfLines={1}>{provider.name.split(' ')[0]}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [showProviders, setShowProviders] = useState(true);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('تم رفض إذن الوصول للموقع');
          setLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(location);
      } catch (error) {
        setErrorMsg('فشل في تحديد الموقع');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const goToMyLocation = async () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }, 1000);
    }
  };

  const focusOnProvider = (provider: any) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: provider.latitude,
        longitude: provider.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 500);
    }
    setSelectedProvider(provider);
  };

  const initialRegion = {
    latitude: location?.coords.latitude || 24.7136, // الرياض
    longitude: location?.coords.longitude || 46.6753,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>جاري تحديد الموقع...</Text>
        <Text style={styles.loadingSubtext}>يستخدم OpenStreetMap المجاني</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
        provider={PROVIDER_DEFAULT}
        mapType={Platform.OS === 'android' ? 'none' : 'standard'}
      >
        {/* OpenStreetMap Tile Layer - FREE */}
        <UrlTile
          urlTemplate={OSM_TILE_URL}
          maximumZ={19}
          flipY={false}
          tileSize={256}
        />
        
        {/* Provider Markers */}
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            coordinate={{
              latitude: provider.latitude,
              longitude: provider.longitude,
            }}
            onPress={() => setSelectedProvider(provider)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.markerPin}>
                <Text style={styles.markerPrice}>{provider.price}</Text>
              </View>
              <View style={styles.markerDot} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Header */}
      <LinearGradient
        colors={['rgba(30,58,95,0.95)', 'rgba(30,58,95,0.7)', 'transparent']}
        style={styles.headerOverlay}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>الخريطة</Text>
          <Text style={styles.headerSubtext}>
            {providers.length} مقدم خدمة في منطقتك
          </Text>
        </View>
        <TouchableOpacity style={styles.myLocationButton} onPress={goToMyLocation}>
          <Text style={styles.myLocationIcon}>[MY]</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Map Type Badge */}
      <View style={styles.mapBadge}>
        <Text style={styles.mapBadgeText}>OpenStreetMap</Text>
        <Text style={styles.mapBadgeSub}>مجاني 100%</Text>
      </View>

      {/* Providers List Toggle */}
      <TouchableOpacity 
        style={styles.listToggle}
        onPress={() => setShowProviders(!showProviders)}
      >
        <Text style={styles.listToggleText}>
          {showProviders ? '[Hide]' : '[List]'}
        </Text>
      </TouchableOpacity>

      {/* Providers Quick List */}
      {showProviders && (
        <View style={styles.providersList}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {providers.map((provider) => (
              <TouchableOpacity
                key={provider.id}
                style={[
                  styles.providerItem,
                  selectedProvider?.id === provider.id && styles.providerItemSelected
                ]}
                onPress={() => focusOnProvider(provider)}
              >
                <Text style={styles.providerItemName} numberOfLines={1}>
                  {provider.name}
                </Text>
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
          <TouchableOpacity 
            style={styles.closeCard}
            onPress={() => setSelectedProvider(null)}
          >
            <Text style={styles.closeCardText}>X</Text>
          </TouchableOpacity>
          
          <View style={styles.providerCardContent}>
            <View style={styles.providerCardHeader}>
              <View style={styles.providerAvatar}>
                <Text style={styles.providerAvatarText}>
                  {selectedProvider.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.providerCardInfo}>
                <Text style={styles.providerName}>{selectedProvider.name}</Text>
                <Text style={styles.providerService}>{selectedProvider.service}</Text>
                <View style={styles.providerStats}>
                  <Text style={styles.providerRating}>* {selectedProvider.rating}</Text>
                  <Text style={styles.providerDistance}>{selectedProvider.distance}</Text>
                </View>
              </View>
              <View style={styles.providerPriceContainer}>
                <Text style={styles.providerPriceValue}>{selectedProvider.price}</Text>
                <Text style={styles.providerPriceUnit}>ريال</Text>
              </View>
            </View>
            
            <View style={styles.providerCardActions}>
              <TouchableOpacity style={styles.callButton}>
                <Text style={styles.callButtonText}>[Call]</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton}>
                <Text style={styles.messageButtonText}>[MSG]</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>اطلب الآن</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Error Banner */}
      {errorMsg && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity onPress={() => setLoading(true)}>
            <Text style={styles.retryText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Import ScrollView for horizontal list
import { ScrollView } from 'react-native';

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
    fontSize: 18,
  },
  loadingSubtext: {
    color: '#B8D4E8',
    marginTop: 8,
    fontSize: 14,
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'left',
  },
  headerSubtext: {
    fontSize: 14,
    color: '#B8D4E8',
    marginTop: 4,
    textAlign: 'left',
  },
  myLocationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  myLocationIcon: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E3A5F',
  },
  mapBadge: {
    position: 'absolute',
    top: 110,
    right: 16,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  mapBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  mapBadgeSub: {
    fontSize: 8,
    color: '#666',
  },
  listToggle: {
    position: 'absolute',
    bottom: 250,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  listToggleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  providersList: {
    position: 'absolute',
    bottom: 180,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  providerItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  providerItemSelected: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  providerItemName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E3A5F',
    textAlign: 'right',
  },
  providerItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 4,
    textAlign: 'right',
  },
  providerItemDistance: {
    fontSize: 10,
    color: '#888',
    marginTop: 2,
    textAlign: 'right',
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerPin: {
    backgroundColor: '#1E3A5F',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  markerPrice: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markerDot: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#1E3A5F',
    marginTop: -2,
  },
  customMarker: {
    alignItems: 'center',
  },
  markerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  markerIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markerLabel: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  markerText: {
    color: '#fff',
    fontSize: 10,
  },
  providerCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  closeCard: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeCardText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  providerCardContent: {
    padding: 16,
    paddingTop: 12,
  },
  providerCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  providerAvatarText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  providerCardInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
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
    marginTop: 2,
    textAlign: 'right',
  },
  providerStats: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  providerRating: {
    fontSize: 12,
    color: '#FFD700',
    marginLeft: 12,
  },
  providerDistance: {
    fontSize: 12,
    color: '#888',
  },
  providerPriceContainer: {
    alignItems: 'center',
  },
  providerPriceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  providerPriceUnit: {
    fontSize: 12,
    color: '#888',
  },
  providerCardActions: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  callButton: {
    width: 50,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 14,
    color: '#4CAF50',
  },
  messageButton: {
    width: 50,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButtonText: {
    fontSize: 14,
    color: '#2196F3',
  },
  bookButton: {
    flex: 1,
    marginLeft: 12,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorBanner: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: '#ff4444',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    flex: 1,
  },
  retryText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 12,
  },
});
