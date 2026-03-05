import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, signInWithDemo, safeSignIn, safeSignUp, safeSignOut, getNetworkStatus } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isOnline: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInDemo: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for offline mode
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      // Try to get session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.log('Session error:', error.message);
        // Check for demo session in local storage
        const demoSession = await getDemoSession();
        if (demoSession) {
          setUser(DEMO_USER);
          setIsOnline(false);
        }
      } else if (session) {
        setSession(session);
        setUser(session.user);
        setIsOnline(true);
      }
    } catch (error) {
      console.log('Init auth error:', error);
      // Check for demo session
      const demoSession = await getDemoSession();
      if (demoSession) {
        setUser(DEMO_USER);
        setIsOnline(false);
      }
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
          }
          setLoading(false);
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.log('Auth state change error:', error);
    }
  };

  // Store demo session locally
  const saveDemoSession = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.setItem('demo_session', 'true');
    } catch (e) {
      console.log('Save demo session error:', e);
    }
  };

  const getDemoSession = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const demo = await AsyncStorage.getItem('demo_session');
      return demo === 'true';
    } catch (e) {
      return false;
    }
  };

  const clearDemoSession = async () => {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      await AsyncStorage.removeItem('demo_session');
    } catch (e) {
      console.log('Clear demo session error:', e);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await safeSignIn(email, password);
      
      if (error) {
        return { error };
      }
      
      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
        setIsOnline(true);
        await clearDemoSession();
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Network error' } };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await safeSignUp(email, password, name);
      
      if (error) {
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Network error' } };
    }
  };

  const signOut = async () => {
    try {
      await safeSignOut();
      await clearDemoSession();
      setSession(null);
      setUser(null);
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
        await saveDemoSession();
        setIsOnline(getNetworkStatus());
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Demo sign in failed' } };
    }
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      loading,
      isOnline,
      signIn,
      signUp,
      signOut,
      signInDemo: handleSignInDemo,
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
