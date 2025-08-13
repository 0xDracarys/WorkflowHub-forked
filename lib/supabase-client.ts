import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Use a singleton pattern to ensure we only create one client instance.
let supabase: SupabaseClient | undefined

export function getSupabaseClient() {
  if (supabase) {
    return supabase
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL")
  }

  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey)
  return supabase
}
