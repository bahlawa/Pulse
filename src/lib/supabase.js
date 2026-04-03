import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) console.error("DEBUG: VITE_SUPABASE_URL is missing!")
if (!supabaseKey) console.error("DEBUG: VITE_SUPABASE_ANON_KEY is missing!")

if (supabaseUrl && supabaseUrl.includes('placeholder')) {
  console.error("DEBUG: Using placeholder URL. Real keys are not being injected correctly.")
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseKey || 'placeholder_key'
)
