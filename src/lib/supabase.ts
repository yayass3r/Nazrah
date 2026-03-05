import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const supabaseUrl = 'https://pzixmpqemignqmgslovx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aXhtcHFlbWlnbnFtZ3Nsb3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyOTY0NzIsImV4cCI6MjA4Nzg3MjQ3Mn0.s1kEAXbAB48FI2X7swSdmh2k8cOgYnazNRG-_HmxH5c';

// Custom fetch with timeout and better error handling
const customFetch = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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
      throw new Error('Request timeout - please check your internet connection');
    }
    throw new Error('Network request failed - please check your internet connection');
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: customFetch as any,
    headers: {
      'X-Client-Info': `nazrah-app/${Platform.OS}`,
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

// Demo user credentials
export const DEMO_USER = {
  email: 'demo@nazrah.sa',
  password: 'demo123456'
};

// Check if we're online
let isOnline = true;

// Demo mode fallback - works without network
export async function signInWithDemo() {
  // First try to connect to Supabase
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    });

    if (error) {
      // If network error, use demo mode
      if (error.message.includes('Network') || error.message.includes('fetch') || error.message.includes('timeout')) {
        console.log('Network error, using demo mode');
        isOnline = false;
        return {
          data: {
            user: {
              id: 'demo-user-id',
              email: DEMO_USER.email,
              user_metadata: { name: 'مستخدم تجريبي' },
            },
            session: null,
          },
          error: null,
        };
      }
      return { data, error };
    }

    isOnline = true;
    return { data, error };
  } catch (error: any) {
    console.log('Sign in error:', error.message);
    // Fallback to demo mode on any error
    isOnline = false;
    return {
      data: {
        user: {
          id: 'demo-user-id',
          email: DEMO_USER.email,
          user_metadata: { name: 'مستخدم تجريبي' },
        },
        session: null,
      },
      error: null,
    };
  }
}

// Safe auth operations with fallback
export async function safeSignIn(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (error: any) {
    return {
      data: null,
      error: { message: 'Network error - please check your internet connection' }
    };
  }
}

export async function safeSignUp(email: string, password: string, name: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    return { data, error };
  } catch (error: any) {
    return {
      data: null,
      error: { message: 'Network error - please check your internet connection' }
    };
  }
}

export async function safeSignOut() {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.log('Sign out error:', error);
  }
}

// Check network status
export function getNetworkStatus() {
  return isOnline;
}
