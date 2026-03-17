import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Fetch data from Supabase or fallback to local data
export async function fetchPortfolioData(table, fallbackData) {
  if (!supabase) return fallbackData;

  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data && data.length > 0 ? data : fallbackData;
  } catch (err) {
    console.warn(`Supabase fetch failed for ${table}, using fallback:`, err.message);
    return fallbackData;
  }
}

// Admin: upsert data
export async function upsertData(table, record) {
  if (!supabase) return { error: "Supabase not configured" };
  const { data, error } = await supabase.from(table).upsert(record).select();
  return { data, error };
}

// Admin: delete data
export async function deleteData(table, id) {
  if (!supabase) return { error: "Supabase not configured" };
  const { error } = await supabase.from(table).delete().eq("id", id);
  return { error };
}

// Admin: sign in
export async function signIn(email, password) {
  if (!supabase) return { error: "Supabase not configured" };
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

// Admin: sign out
export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}

// Admin: get session
export async function getSession() {
  if (!supabase) return null;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
