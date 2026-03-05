import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signInWithDemo, safeSignIn, safeSignUp, safeSignOut, getNetworkStatus } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  balance: number;
  rating: number;
  total_orders: number;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isOnline: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  signInDemo: () => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'demo-user-id',
  app_metadata: {},
  user_metadata: { name: 'مستخدم تجريبي' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@nazrah.sa',
  email_confirmed_at: new Date().toISOString(),
  role: 'authenticated',
  updated_at: new Date().toISOString(),
} as User;

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user-id',
  name: 'مستخدم تجريبي',
  email: 'demo@nazrah.sa',
  phone: '+966500000000',
  balance: 500,
  rating: 4.8,
  total_orders: 12,
};

const DEMO_SESSION_KEY = '@nazrah_demo_session';
const USER_PROFILE_KEY = '@nazrah_user_profile';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      // Check for demo session first
      const demoSession = await AsyncStorage.getItem(DEMO_SESSION_KEY);
      if (demoSession === 'true') {
        setUser(DEMO_USER);
        setProfile(DEMO_PROFILE);
        setIsOnline(false);
        setLoading(false);
        return;
      }

      // Try Supabase session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!error && session) {
        setSession(session);
        setUser(session.user);
        setIsOnline(true);
        await loadProfile(session.user.id);
      }
    } catch (error) {
      console.log('Init auth error:', error);
    } finally {
      setLoading(false);
    }

    // Listen for auth changes
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            setSession(session);
            setUser(session.user);
            setIsOnline(true);
            await loadProfile(session.user.id);
          } else if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        }
      );

      return () => subscription.unsubscribe();
    } catch (error) {
      console.log('Auth state change error:', error);
    }
  };

  const loadProfile = async (userId: string) => {
    try {
      // Try to load from cache first
      const cachedProfile = await AsyncStorage.getItem(`${USER_PROFILE_KEY}_${userId}`);
      if (cachedProfile) {
        setProfile(JSON.parse(cachedProfile));
      }

      // Fetch from server
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        setProfile(data);
        await AsyncStorage.setItem(`${USER_PROFILE_KEY}_${userId}`, JSON.stringify(data));
      }
    } catch (error) {
      console.log('Load profile error:', error);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await loadProfile(user.id);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clear demo session
      await AsyncStorage.removeItem(DEMO_SESSION_KEY);
      
      const { data, error } = await safeSignIn(email, password);
      
      if (error) {
        return { error };
      }
      
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsOnline(true);
        await loadProfile(data.session.user.id);
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'خطأ في الاتصال' } };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await safeSignUp(email, password, name);
      return { data, error };
    } catch (error: any) {
      return { 
        data: null, 
        error: { message: error.message || 'خطأ في الاتصال' } 
      };
    }
  };

  const signOut = async () => {
    try {
      await safeSignOut();
      await AsyncStorage.removeItem(DEMO_SESSION_KEY);
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsOnline(true);
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  const handleSignInDemo = async () => {
    try {
      const { data, error } = await signInWithDemo();
      
      if (error) {
        return { error };
      }
      
      if (data?.user) {
        setUser(data.user as User);
        setProfile(DEMO_PROFILE);
        await AsyncStorage.setItem(DEMO_SESSION_KEY, 'true');
        setIsOnline(getNetworkStatus());
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'فشل الدخول التجريبي' } };
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      profile,
      loading,
      isOnline,
      signIn,
      signUp,
      signOut,
      signInDemo: handleSignInDemo,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
