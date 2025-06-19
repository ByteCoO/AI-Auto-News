import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Re-export the SupabaseClient type for convenience
export type { SupabaseClient };

// --- Client-side (Browser) Supabase Client ---
// This client uses the public 'anon' key and is safe to expose in the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase public URL or anon key is missing. Check your .env.local file.');
}

// Export the browser-safe client directly
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// --- Server-side Supabase Client ---
// This factory function creates a new client for each server-side request.
// It uses the secret 'service_role' key, which must NEVER be exposed to the client.
// This approach avoids issues with shared clients in serverless environments.

let serverSupabase: SupabaseClient | undefined;

export function getSupabaseServerClient(): SupabaseClient {
  // Return the existing instance if it's already created (optional optimization)
  if (serverSupabase) {
    return serverSupabase;
  }
  
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Supabase service role key is missing. Check your environment variables.');
  }

  // Create a new client with the service role key
  // This client has elevated privileges and should only be used on the server.
  serverSupabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      // It's recommended to disable auto-refreshing tokens on the server
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return serverSupabase;
}