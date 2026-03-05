import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DEMO_SESSION_KEY = '@nazrah_demo_session';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    Alert.alert(
      'تنبيه',
      'للاستخدام التجريبي، يرجى الضغط على "تجربة التطبيق"',
      [{ text: 'حسناً' }]
    );
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await AsyncStorage.setItem(DEMO_SESSION_KEY, 'true');
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('خطأ', 'فشل تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#1E3A5F', '#0D1F3C']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>نظرة</Text>
            <Text style={styles.tagline}>خدمات الفيديو بين يديك</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</Text>

            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="الاسم الكامل"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
                textAlign="right"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="البريد الإلكتروني"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              textAlign="right"
            />

            <TextInput
              style={styles.input}
              placeholder="كلمة المرور"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textAlign="right"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'دخول' : 'تسجيل'}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.demoSection}>
              <Text style={styles.demoHint}>أو جرب التطبيق بدون تسجيل</Text>
              <TouchableOpacity
                style={styles.demoButton}
                onPress={handleDemoLogin}
                disabled={loading}
              >
                <Text style={styles.demoButtonText}>تجربة التطبيق</Text>
              </TouchableOpacity>
              <Text style={styles.demoNote}>يعمل بدون إنترنت</Text>
            </View>

            <TouchableOpacity
              style={styles.toggle}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.toggleText}>
                {isLogin ? 'ليس لديك حساب؟ سجل الآن' : 'لديك حساب؟ سجل دخولك'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 48, fontWeight: 'bold', color: '#fff' },
  tagline: { fontSize: 16, color: '#B8D4E8', marginTop: 8 },
  formContainer: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20, padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 16, fontSize: 16, color: '#fff', marginBottom: 16, textAlign: 'right' },
  button: { backgroundColor: '#4CAF50', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  demoSection: { alignItems: 'center', marginTop: 24, paddingTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  demoHint: { color: '#B8D4E8', fontSize: 14, marginBottom: 12 },
  demoButton: { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#FFD700', borderRadius: 12, padding: 16, paddingHorizontal: 40 },
  demoButtonText: { color: '#FFD700', fontSize: 16, fontWeight: 'bold' },
  demoNote: { color: '#888', fontSize: 12, marginTop: 8 },
  toggle: { marginTop: 24, alignItems: 'center' },
  toggleText: { color: '#B8D4E8', fontSize: 14 },
});
