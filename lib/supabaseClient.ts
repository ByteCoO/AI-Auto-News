import { createClient } from '@supabase/supabase-js'

// IMPORTANT: These environment variables must be set in your .env.local file.
// NEXT_PUBLIC_SUPABASE_URL should be the 'Project URL' from your Supabase project settings.
// NEXT_PUBLIC_SUPABASE_ANON_KEY should be the 'anon' 'public' key.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL 
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or anon key is missing from environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);