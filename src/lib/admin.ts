import { supabase } from "@/lib/supabase";

export async function signInAdmin(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function signUpAdmin(email: string, password: string): Promise<boolean> {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return Boolean(data.session);
}

export async function signOutAdmin(): Promise<void> {
  await supabase.auth.signOut();
}

export async function checkIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_admin");
  if (error) return false;
  return Boolean(data);
}

export async function getAdminsCount(): Promise<number> {
  const { data, error } = await supabase.rpc("admins_count");
  if (error) return -1;
  return Number(data ?? 0);
}

export async function claimAdminAccess(userId: string): Promise<void> {
  const { error } = await supabase.from("admins").insert({ user_id: userId });
  if (error) throw error;
}

export async function getCurrentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id ?? null;
}