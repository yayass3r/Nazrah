import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Supabase Configuration
const supabaseUrl = 'https://pzixmpqemignqmgslovx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aXhtcHFlbWlnbnFtZ3Nsb3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTY0NzIsImV4cCI6MjA4Nzg3MjQ3Mn0.s1kEAXbAB48FI2X7swSdmh2k8cOgYnazNRG-_HmxH5c';

// Custom fetch with timeout
const createCustomFetch = () => {
  return async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - يرجى التحقق من الاتصال بالإنترنت');
      }
      throw new Error('Network request failed - فشل الاتصال بالخادم');
    }
  };
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: createCustomFetch() as any,
    headers: {
      'X-Client-Info': `nazrah/${Platform.OS}/${Platform.Version}`,
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Demo credentials
export const DEMO_USER = {
  email: 'demo@nazrah.sa',
  password: 'demo123456'
};

// Network status
let isOnline = true;

// Demo user object
const createDemoUser = () => ({
  id: 'demo-user-' + Date.now(),
  email: DEMO_USER.email,
  user_metadata: { 
    name: 'مستخدم تجريبي',
    avatar: null,
    phone: '+966500000000',
    created_at: new Date().toISOString()
  },
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Sign in with demo account
export async function signInWithDemo() {
  try {
    // Try real auth first
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    });

    if (error) {
      const errorMsg = error.message?.toLowerCase() || '';
      if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('timeout')) {
        isOnline = false;
        return {
          data: { user: createDemoUser(), session: null },
          error: null,
        };
      }
      return { data, error };
    }

    isOnline = true;
    return { data, error };
  } catch (error: any) {
    isOnline = false;
    return {
      data: { user: createDemoUser(), session: null },
      error: null,
    };
  }
}

// Safe sign in
export async function safeSignIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data.session) {
      isOnline = true;
    }
    
    return { data, error };
  } catch (error: any) {
    return {
      data: null,
      error: { message: 'فشل الاتصال - يرجى التحقق من الإنترنت' }
    };
  }
}

// Safe sign up
export async function safeSignUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          name,
          avatar: null,
          created_at: new Date().toISOString()
        }
      }
    });
    
    return { data, error };
  } catch (error: any) {
    return {
      data: null,
      error: { message: 'فشل الاتصال - يرجى التحقق من الإنترنت' }
    };
  }
}

// Safe sign out
export async function safeSignOut() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.log('Sign out error:', error);
  }
}

// Get network status
export function getNetworkStatus() {
  return isOnline;
}

// Check if user exists
export async function checkUserExists(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('check_email_exists', { 
      email_input: email 
    });
    return !error && data;
  } catch {
    return false;
  }
}

// Get user profile
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  } catch (error: any) {
    return { data: null, error };
  }
}

// Update user profile
export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    return { data, error };
  } catch (error: any) {
    return { data: null, error };
  }
}
