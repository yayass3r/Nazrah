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
import { useRouter } from 'expo-router';
import { useAuth } from '../src/hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInDemo } = useAuth();
  const router = useRouter();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          Alert.alert('خطأ في تسجيل الدخول', error.message);
        } else {
          router.replace('/(tabs)');
        }
      } else {
        if (!name) {
          Alert.alert('خطأ', 'يرجى إدخال الاسم');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, name);
        if (error) {
          Alert.alert('خطأ في التسجيل', error.message);
        } else {
          Alert.alert('نجاح', 'تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول');
          setIsLogin(true);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      const { error } = await signInDemo();
      if (error) {
        Alert.alert('خطأ', 'فشل تسجيل الدخول التجريبي');
      } else {
        router.replace('/(tabs)');
      }
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

            <TouchableOpacity
              style={styles.demoButton}
              onPress={handleDemoLogin}
              disabled={loading}
            >
              <Text style={styles.demoButtonText}>تجربة التطبيق</Text>
            </TouchableOpacity>

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
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagline: {
    fontSize: 16,
    color: '#B8D4E8',
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    direction: 'rtl',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  demoButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggle: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    color: '#B8D4E8',
    fontSize: 14,
  },
});
