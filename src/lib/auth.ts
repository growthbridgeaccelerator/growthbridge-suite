import { createClient } from "@/lib/supabase/server";

export async function getCurrentAccount() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    throw new Error("Profile not found");
  }

  return {
    supabase,
    user,
    profile,
    accountId: profile.account_id,
  };
}