import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/app/slack_analyzer/types/supabase';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
// Use service role key for server-side operations to bypass RLS
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
// Keep anon key for client-side operations
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a client with the service role key for server-side operations
// This client will bypass RLS policies
function createSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseUrl) {
    console.warn('Supabase URL is not defined in environment variables. Supabase features will be disabled.');
    // Return a placeholder client that will fail gracefully at runtime
    return createClient<Database>(
      'https://placeholder.supabase.co',
      'placeholder-key',
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }

  if (!supabaseServiceKey && !supabaseAnonKey) {
    console.warn('Supabase keys are not defined in environment variables. Supabase features will be disabled.');
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey || supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  );
}

export const supabase = createSupabaseClient();

// Helper function to handle errors
export function handleSupabaseError(error: any, operation: string): void {
  console.error(`Supabase error during ${operation}:`, error);
  throw new Error(`Error during ${operation}: ${error.message || 'Unknown error'}`);
} 