
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://viljlppbfrxtfcgofczp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpbGpscHBiZnJ4dGZjZ29mY3pwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NzMzMDYsImV4cCI6MjA2MjE0OTMwNn0.mBRNbseBC6l2XOEBPt0tvdII4d4ykeSdHefDviP9GIw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Function to sign in with Google
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });
  
  return { data, error };
};

// Function to sign out
export const signOut = async () => {
  return await supabase.auth.signOut();
};

// Function to get the current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
};

// Function to get session
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session, error };
};
