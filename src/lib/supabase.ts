import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://pzixmpqemigbnqmgslovx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6aXhtcHFlbWlnYm5xbWdzbG92eCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzM4NTY1NTEyLCJleHAiOjIwNTQxNDE1MTJ9.bKPHVFBq-HVQyvlH0KJL5rDfLh8nCMjSMQPX6XaJN0I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Demo user credentials
export const DEMO_USER = {
  email: 'demo@nazrah.sa',
  password: 'demo123456'
};

// Helper function to sign in with demo account
export async function signInWithDemo() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: DEMO_USER.email,
    password: DEMO_USER.password,
  });
  return { data, error };
}
