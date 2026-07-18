import { createClient } from "@/lib/supabase/server";

export async function getRestaurantSettings(accountId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("restaurant_settings")
    .select("*")
    .eq("account_id", accountId)
    .single();

  if (error) {
    console.error("Restaurant Settings Load Error:", error);
    return null;
  }

  return data;
}