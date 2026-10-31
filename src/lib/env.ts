export function getPublicEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  };
}

export function isSupabaseConfigured() {
  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();
  return Boolean(supabaseUrl && supabaseAnonKey);
}
