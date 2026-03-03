import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Platform,
  ScrollView,
  TextInput,
  Modal,
  Animated,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enable RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const { width, height } = Dimensions.get('window');

// Demo User Account
const DEMO_USER = {
  email: 'demo@nazrah.sa',
  password: 'demo123',
  full_name: 'مستخدم نظرة التجريبي',
  phone: '0501234567',
};

// Theme Colors
const COLORS = {
  primary: '#1E88E5',
  primaryDark: '#1565C0',
  primaryLight: '#42A5F5',
  secondary: '#FF6F00',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
    light: '#FFFFFF',
  },
  border: '#E0E0E0',
};

const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const FONT_SIZE = { xs: 10, sm: 12, md: 14, lg: 16, xl: 18, xxl: 24, xxxl: 32 };
const BORDER_RADIUS = { sm: 4, md: 8, lg: 12, xl: 16, round: 999 };
const SHADOWS = {
  small: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.0, elevation: 1 },
  medium: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.22, shadowRadius: 2.22, elevation: 3 },
  large: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 6 },
};

// Riyadh default location
const RIYADH_LOCATION = {
  latitude: 24.7136,
  longitude: 46.6753,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

type ScreenType = 'login' | 'register' | 'main';
type TabType = 'home' | 'requests' | 'wallet' | 'profile';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  balance: number;
}

export default function App() {
  // Auth State
  const [screen, setScreen] = useState<ScreenType>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // App State
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [walletBalance, setWalletBalance] = useState(150.0);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Location State
  const [currentLocation, setCurrentLocation] = useState<string>('الرياض، المملكة العربية السعودية');
  const [locationCoords, setLocationCoords] = useState(RIYADH_LOCATION);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (screen === 'main') {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      getCurrentLocation();
    }
  }, [screen]);

  const checkAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('nazrah_user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setWalletBalance(userData.balance || 150);
        setScreen('main');
      }
    } catch (error) {
      console.log('Auth check error:', error);
    } finally {
      setAuthChecked(true);
    }
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocationCoords({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        });
        
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (address.length > 0) {
          const addr = address[0];
          setCurrentLocation(`${addr.city || addr.region || 'السعودية'}`);
        }
      }
    } catch (error) {
      console.log('Location error:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      const isDemo = email === DEMO_USER.email && password === DEMO_USER.password;
      
      const userData: User = {
        id: isDemo ? 'demo-user-001' : `user-${Date.now()}`,
        email: email,
        full_name: isDemo ? DEMO_USER.full_name : email.split('@')[0],
        phone: isDemo ? DEMO_USER.phone : '',
        balance: 150,
      };

      await AsyncStorage.setItem('nazrah_user', JSON.stringify(userData));
      setUser(userData);
      setScreen('main');
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const userData: User = {
        id: 'demo-user-001',
        email: DEMO_USER.email,
        full_name: DEMO_USER.full_name,
        phone: DEMO_USER.phone,
        balance: 150,
      };

      await AsyncStorage.setItem('nazrah_user', JSON.stringify(userData));
      setUser(userData);
      setScreen('main');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 6) {
      Alert.alert('خطأ', 'يجب أن تكون كلمة المرور 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    try {
      const userData: User = {
        id: `user-${Date.now()}`,
        email: email,
        full_name: fullName,
        phone: phone,
        balance: 0,
      };

      await AsyncStorage.setItem('nazrah_user', JSON.stringify(userData));
      setUser(userData);
      setScreen('main');
      Alert.alert('نجاح', 'تم إنشاء حسابك بنجاح!');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('nazrah_user');
      setUser(null);
      setScreen('login');
      setActiveTab('home');
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  // ============ LOGIN SCREEN ============
  const renderLoginScreen = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.authGradient}>
        <ScrollView contentContainerStyle={styles.authScrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="eye" size={48} color={COLORS.text.light} />
            </View>
            <Text style={styles.appName}>نظرة</Text>
            <Text style={styles.appTagline}>خدمة الفيديو الموقعي</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.authTitle}>تسجيل الدخول</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="البريد الإلكتروني"
                placeholderTextColor={COLORS.text.disabled}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign="right"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="كلمة المرور"
                placeholderTextColor={COLORS.text.disabled}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                textAlign="right"
              />
            </View>

            <TouchableOpacity style={styles.authButton} onPress={handleLogin} disabled={loading}>
              {loading ? <ActivityIndicator color={COLORS.text.light} /> : <Text style={styles.authButtonText}>دخول</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.demoButton} onPress={handleDemoLogin} disabled={loading}>
              <Ionicons name="play-circle" size={20} color={COLORS.primary} />
              <Text style={styles.demoButtonText}>تجربة التطبيق</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>أو</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen('register')}>
              <Text style={styles.secondaryButtonText}>إنشاء حساب جديد</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.demoInfo}>
            <Ionicons name="information-circle" size={16} color="rgba(255,255,255,0.8)" />
            <Text style={styles.demoInfoText}>للتجربة: {DEMO_USER.email} / {DEMO_USER.password}</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );

  // ============ REGISTER SCREEN ============
  const renderRegisterScreen = () => (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.authContainer}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.authGradient}>
        <ScrollView contentContainerStyle={styles.authScrollContent}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="person-add" size={48} color={COLORS.text.light} />
            </View>
            <Text style={styles.appName}>إنشاء حساب</Text>
            <Text style={styles.appTagline}>انضم إلى نظرة</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color={COLORS.text.secondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="الاسم الكامل *" placeholderTextColor={COLORS.text.disabled} value={fullName} onChangeText={setFullName} textAlign="right" />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color={COLORS.text.secondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="البريد الإلكتروني *" placeholderTextColor={COLORS.text.disabled} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" textAlign="right" />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color={COLORS.text.secondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="رقم الجوال" placeholderTextColor={COLORS.text.disabled} value={phone} onChangeText={setPhone} keyboardType="phone-pad" textAlign="right" />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.text.secondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="كلمة المرور *" placeholderTextColor={COLORS.text.disabled} value={password} onChangeText={setPassword} secureTextEntry textAlign="right" />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.text.secondary} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="تأكيد كلمة المرور *" placeholderTextColor={COLORS.text.disabled} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry textAlign="right" />
            </View>

            <TouchableOpacity style={styles.authButton} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color={COLORS.text.light} /> : <Text style={styles.authButtonText}>إنشاء حساب</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen('login')}>
              <Text style={styles.secondaryButtonText}>لديك حساب؟ سجل دخولك</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );

  // ============ MAIN APP SCREENS ============
  const renderHomeScreen = () => (
    <View style={styles.screenContainer}>
      {/* Map Placeholder - Shows location info */}
      <View style={styles.mapContainer}>
        <Ionicons name="map" size={80} color={COLORS.primary} />
        <Text style={styles.mapTitle}>نظرة</Text>
        <Text style={styles.mapLocation}>{currentLocation}</Text>
        
        <View style={styles.locationCard}>
          <View style={styles.locationCardRow}>
            <Ionicons name="location" size={24} color={COLORS.primary} />
            <View style={styles.locationCardInfo}>
              <Text style={styles.locationCardLabel}>موقعك الحالي</Text>
              <Text style={styles.locationCardValue}>{currentLocation}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Pay Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.fabGradient}>
          <View style={styles.fabContent}>
            <View style={styles.fabInfo}>
              <Text style={styles.fabLabel}>دفع سريع</Text>
              <View style={styles.fabPriceRow}>
                <Text style={styles.fabPrice}>25</Text>
                <Text style={styles.fabCurrency}>ر.س</Text>
              </View>
            </View>
            <View style={styles.fabButton}>
              <MaterialIcons name="videocam" size={24} color={COLORS.text.light} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderRequestsScreen = () => (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.listContent}>
      <Text style={styles.sectionTitle}>طلباتي</Text>
      {[
        { id: 1, status: 'مكتمل', location: 'الرياض، حي النخيل' },
        { id: 2, status: 'قيد التنفيذ', location: 'الرياض، حي العليا' },
        { id: 3, status: 'قيد الانتظار', location: 'الرياض، حي الملز' },
      ].map((item) => (
        <View key={item.id} style={styles.requestCard}>
          <View style={styles.requestThumbnail}>
            <Ionicons name="videocam" size={28} color={COLORS.text.disabled} />
          </View>
          <View style={styles.requestInfo}>
            <Text style={styles.requestTitle}>طلب معاينة #{item.id}</Text>
            <Text style={styles.requestLocation}>{item.location}</Text>
            <View style={styles.requestStatus}>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'مكتمل' ? COLORS.success + '20' : COLORS.warning + '20' }]}>
                <Text style={[styles.statusText, { color: item.status === 'مكتمل' ? COLORS.success : COLORS.warning }]}>{item.status}</Text>
              </View>
              <Text style={styles.requestPrice}>25 ر.س</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderWalletScreen = () => (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.listContent}>
      <Animated.View style={[styles.balanceCard, { opacity: fadeAnim }]}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.balanceGradient}>
          <Text style={styles.balanceLabel}>الرصيد المتاح</Text>
          <Text style={styles.balanceAmount}>{walletBalance.toFixed(2)} ر.س</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowDepositModal(true)}>
              <View style={styles.actionIcon}><Ionicons name="add" size={24} color={COLORS.primary} /></View>
              <Text style={styles.actionText}>إيداع</Text>
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}><Ionicons name="arrow-up" size={24} color={COLORS.primary} /></View>
              <Text style={styles.actionText}>سحب</Text>
            </TouchableOpacity>
            <View style={styles.actionDivider} />
            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIcon}><Ionicons name="send" size={24} color={COLORS.primary} /></View>
              <Text style={styles.actionText}>تحويل</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>

      <Text style={styles.sectionTitle}>طرق الدفع</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gatewaysScroll}>
        {[
          { name: 'STC Pay', color: '#4C1D95', icon: 'wallet' },
          { name: 'Urpay', color: '#00A3E0', icon: 'wallet' },
          { name: 'بطاقة ائتمان', color: '#1E88E5', icon: 'card' },
          { name: 'Apple Pay', color: '#000000', icon: 'logo-apple' },
        ].map((gateway) => (
          <TouchableOpacity key={gateway.name} style={styles.gatewayCard}>
            <View style={[styles.gatewayLogo, { backgroundColor: gateway.color }]}>
              <Ionicons name={gateway.icon as any} size={24} color={COLORS.text.light} />
            </View>
            <Text style={styles.gatewayName}>{gateway.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>سجل المعاملات</Text>
      {[
        { type: 'credit', amount: 50, desc: 'إيداع عبر STC Pay' },
        { type: 'debit', amount: 25, desc: 'طلب معاينة #1234' },
        { type: 'credit', amount: 100, desc: 'إيداع عبر Urpay' },
      ].map((tx, index) => (
        <View key={index} style={styles.transactionItem}>
          <View style={[styles.transactionIcon, { backgroundColor: tx.type === 'credit' ? COLORS.success + '20' : COLORS.error + '20' }]}>
            <MaterialIcons name={tx.type === 'credit' ? 'arrow-downward' : 'arrow-upward'} size={20} color={tx.type === 'credit' ? COLORS.success : COLORS.error} />
          </View>
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionDesc}>{tx.desc}</Text>
            <Text style={styles.transactionDate}>اليوم</Text>
          </View>
          <Text style={[styles.transactionAmount, { color: tx.type === 'credit' ? COLORS.success : COLORS.error }]}>
            {tx.type === 'credit' ? '+' : '-'}{tx.amount} ر.س
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  const renderProfileScreen = () => (
    <ScrollView style={styles.screenContainer} contentContainerStyle={styles.listContent}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Ionicons name="person" size={48} color={COLORS.text.disabled} />
        </View>
        <Text style={styles.profileName}>{user?.full_name || 'مستخدم نظرة'}</Text>
        <Text style={styles.profileEmail}>{user?.email}</Text>
        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>التقييم</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>25</Text>
            <Text style={styles.statLabel}>طلب</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{walletBalance}</Text>
            <Text style={styles.statLabel}>ر.س</Text>
          </View>
        </View>
      </View>

      {[
        { icon: 'person-outline', label: 'تعديل الملف الشخصي' },
        { icon: 'settings-outline', label: 'إعدادات الحساب' },
        { icon: 'notifications-outline', label: 'الإشعارات' },
        { icon: 'shield-checkmark-outline', label: 'الخصوصية' },
        { icon: 'help-circle-outline', label: 'المساعدة' },
      ].map((item) => (
        <TouchableOpacity key={item.label} style={styles.menuItem}>
          <View style={styles.menuItemLeft}>
            <Ionicons name={item.icon as any} size={22} color={COLORS.primary} />
            <Text style={styles.menuText}>{item.label}</Text>
          </View>
          <Ionicons name="chevron-back" size={20} color={COLORS.text.disabled} />
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={[styles.menuItem, { marginTop: SPACING.md }]} onPress={handleLogout}>
        <View style={styles.menuItemLeft}>
          <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
          <Text style={[styles.menuText, { color: COLORS.error }]}>تسجيل الخروج</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderMainScreen = () => (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar style="dark" />
          
          {activeTab !== 'home' && (
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {activeTab === 'requests' ? 'طلباتي' : activeTab === 'wallet' ? 'محفظتي' : 'حسابي'}
              </Text>
            </View>
          )}

          {activeTab === 'home' && renderHomeScreen()}
          {activeTab === 'requests' && renderRequestsScreen()}
          {activeTab === 'wallet' && renderWalletScreen()}
          {activeTab === 'profile' && renderProfileScreen()}

          {/* Bottom Tab Bar */}
          <View style={styles.tabBar}>
            {[
              { id: 'home' as TabType, icon: 'map', label: 'الرئيسية' },
              { id: 'requests' as TabType, icon: 'list', label: 'الطلبات' },
              { id: 'wallet' as TabType, icon: 'wallet', label: 'المحفظة' },
              { id: 'profile' as TabType, icon: 'person', label: 'حسابي' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={styles.tab}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveTab(tab.id);
                }}
              >
                <Ionicons name={tab.icon as any} size={24} color={activeTab === tab.id ? COLORS.primary : COLORS.text.disabled} />
                <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Deposit Modal */}
          <Modal visible={showDepositModal} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>إيداع رصيد</Text>
                  <TouchableOpacity onPress={() => setShowDepositModal(false)}>
                    <Ionicons name="close" size={24} color={COLORS.text.primary} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.amountInput}
                  value={depositAmount}
                  onChangeText={setDepositAmount}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={COLORS.text.disabled}
                  textAlign="center"
                />
                <View style={styles.quickAmounts}>
                  {[50, 100, 200, 500].map((amount) => (
                    <TouchableOpacity key={amount} style={styles.quickAmountButton} onPress={() => setDepositAmount(amount.toString())}>
                      <Text style={styles.quickAmountText}>{amount}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => {
                    if (depositAmount) {
                      setWalletBalance((prev) => prev + parseFloat(depositAmount));
                      setShowDepositModal(false);
                      setDepositAmount('');
                    }
                  }}
                >
                  <Text style={styles.submitButtonText}>إيداع</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  // Loading Screen
  if (!authChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>جارٍ التحميل...</Text>
      </View>
    );
  }

  // Render based on current screen
  if (screen === 'login') return renderLoginScreen();
  if (screen === 'register') return renderRegisterScreen();
  return renderMainScreen();
}

// ============ STYLES ============
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  loadingText: { marginTop: SPACING.md, fontSize: FONT_SIZE.md, color: COLORS.text.secondary },

  // Auth Styles
  authContainer: { flex: 1 },
  authGradient: { flex: 1 },
  authScrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: SPACING.lg },
  logoContainer: { alignItems: 'center', marginBottom: SPACING.xl },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  appName: { fontSize: FONT_SIZE.xxxl, fontWeight: '700', color: COLORS.text.light },
  appTagline: { fontSize: FONT_SIZE.md, color: 'rgba(255,255,255,0.8)', marginTop: SPACING.xs },
  formContainer: { backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, ...SHADOWS.large },
  authTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.text.primary, textAlign: 'center', marginBottom: SPACING.lg },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.md, paddingHorizontal: SPACING.md },
  inputIcon: { marginLeft: SPACING.sm },
  input: { flex: 1, fontSize: FONT_SIZE.md, color: COLORS.text.primary, paddingVertical: SPACING.md, textAlign: 'right' },
  authButton: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.md, alignItems: 'center', marginBottom: SPACING.md },
  authButtonText: { fontSize: FONT_SIZE.lg, color: COLORS.text.light, fontWeight: '700' },
  demoButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.md, borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed' },
  demoButtonText: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: '600', marginLeft: SPACING.sm },
  secondaryButton: { backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.lg, paddingVertical: SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary },
  secondaryButtonText: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: SPACING.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: COLORS.border },
  dividerText: { marginHorizontal: SPACING.md, color: COLORS.text.secondary, fontSize: FONT_SIZE.sm },
  demoInfo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: SPACING.lg, backgroundColor: 'rgba(255,255,255,0.15)', paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: BORDER_RADIUS.lg },
  demoInfoText: { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.9)', marginLeft: SPACING.xs },

  // Main App Styles
  header: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.md, backgroundColor: COLORS.surface },
  headerTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '700', color: COLORS.text.primary, textAlign: 'right' },
  screenContainer: { flex: 1 },
  mapContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8F5E9' },
  mapTitle: { fontSize: 48, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.lg },
  mapLocation: { fontSize: FONT_SIZE.lg, color: COLORS.text.secondary, marginTop: SPACING.sm },
  locationCard: { position: 'absolute', top: SPACING.lg, left: SPACING.md, right: SPACING.md, backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, ...SHADOWS.medium },
  locationCardRow: { flexDirection: 'row', alignItems: 'center' },
  locationCardInfo: { flex: 1, marginRight: SPACING.md },
  locationCardLabel: { fontSize: FONT_SIZE.xs, color: COLORS.text.secondary, textAlign: 'right' },
  locationCardValue: { fontSize: FONT_SIZE.md, color: COLORS.text.primary, fontWeight: '600', textAlign: 'right' },
  fab: { position: 'absolute', bottom: 100, left: SPACING.md, right: SPACING.md, borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', ...SHADOWS.large },
  fabGradient: { padding: SPACING.md },
  fabContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fabInfo: { flex: 1 },
  fabLabel: { fontSize: FONT_SIZE.md, color: COLORS.text.light, fontWeight: '600' },
  fabPriceRow: { flexDirection: 'row', alignItems: 'baseline' },
  fabPrice: { fontSize: FONT_SIZE.xxl, color: COLORS.text.light, fontWeight: '700' },
  fabCurrency: { fontSize: FONT_SIZE.sm, color: COLORS.text.light, marginLeft: 4 },
  fabButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text.primary, marginBottom: SPACING.md, textAlign: 'right' },
  requestCard: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  requestThumbnail: { width: 70, height: 70, borderRadius: BORDER_RADIUS.md, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  requestInfo: { flex: 1, marginLeft: SPACING.md, marginRight: SPACING.sm },
  requestTitle: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text.primary, textAlign: 'right' },
  requestLocation: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary, marginTop: 2, textAlign: 'right' },
  requestStatus: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.sm },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm },
  statusText: { fontSize: FONT_SIZE.xs, fontWeight: '500' },
  requestPrice: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: '700' },
  balanceCard: { borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', marginBottom: SPACING.lg, ...SHADOWS.large },
  balanceGradient: { padding: SPACING.lg },
  balanceLabel: { fontSize: FONT_SIZE.md, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  balanceAmount: { fontSize: 40, color: COLORS.text.light, fontWeight: '700', textAlign: 'center', marginVertical: SPACING.sm },
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginTop: SPACING.md },
  actionButton: { alignItems: 'center', flex: 1 },
  actionIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  actionText: { fontSize: FONT_SIZE.sm, color: COLORS.text.light, fontWeight: '500' },
  actionDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  gatewaysScroll: { marginBottom: SPACING.lg },
  gatewayCard: { width: 90, alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginLeft: SPACING.sm, ...SHADOWS.small },
  gatewayLogo: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xs },
  gatewayName: { fontSize: FONT_SIZE.xs, color: COLORS.text.primary, textAlign: 'center' },
  transactionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  transactionInfo: { flex: 1, marginLeft: SPACING.md, marginRight: SPACING.sm },
  transactionDesc: { fontSize: FONT_SIZE.md, color: COLORS.text.primary, textAlign: 'right' },
  transactionDate: { fontSize: FONT_SIZE.xs, color: COLORS.text.secondary, marginTop: 2, textAlign: 'right' },
  transactionAmount: { fontSize: FONT_SIZE.md, fontWeight: '600' },
  profileHeader: { alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: BORDER_RADIUS.xl, padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.small },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  profileName: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text.primary },
  profileEmail: { fontSize: FONT_SIZE.sm, color: COLORS.text.secondary, marginTop: 2 },
  profileStats: { flexDirection: 'row', marginTop: SPACING.lg, width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.text.secondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: COLORS.border },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.surface, padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm, ...SHADOWS.small },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuText: { fontSize: FONT_SIZE.md, color: COLORS.text.primary, textAlign: 'right', marginLeft: SPACING.md },
  tabBar: { flexDirection: 'row', backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border, paddingBottom: Platform.OS === 'ios' ? 28 : 10, paddingTop: 10 },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 11, color: COLORS.text.disabled, marginTop: 4 },
  tabLabelActive: { color: COLORS.primary, fontWeight: '600' },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: BORDER_RADIUS.xl, borderTopRightRadius: BORDER_RADIUS.xl, padding: SPACING.lg, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text.primary },
  amountInput: { fontSize: 36, fontWeight: '700', color: COLORS.text.primary, textAlign: 'center', borderBottomWidth: 2, borderBottomColor: COLORS.primary, paddingVertical: SPACING.md },
  quickAmounts: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: SPACING.lg },
  quickAmountButton: { flex: 1, backgroundColor: COLORS.background, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginHorizontal: SPACING.xs, alignItems: 'center' },
  quickAmountText: { fontSize: FONT_SIZE.md, color: COLORS.primary, fontWeight: '600' },
  submitButton: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.md, alignItems: 'center' },
  submitButtonText: { fontSize: FONT_SIZE.lg, color: COLORS.text.light, fontWeight: '700' },
});
