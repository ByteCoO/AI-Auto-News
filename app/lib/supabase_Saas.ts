import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SAAS_NEXT_PUBLIC_SUPABASE_URL || 'https://zaqjmdsjuzxuxssnuzet.supabase.co'
const supabaseAnonKey = process.env.SAAS_NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphcWptZHNqdXp4dXhzc251emV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3MjIwMzYsImV4cCI6MjA2MzI5ODAzNn0.de88OWh5BFtsCIJ5ENw99dOsDF-68U0EnJiyq1fXxNg'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)