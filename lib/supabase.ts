import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://clhgfcafhkbnxkimhyfr.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsaGdmY2FmaGtibnhraW1oeWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTQ3NjAsImV4cCI6MjA4OTc3MDc2MH0.IQPr9_jpKKdmoBj5X_BKVkyYAMBAciVqtQFv6j170jE";

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}
