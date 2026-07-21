import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("account_id")
      .eq("user_id", user.id)
      .single();

    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        menu_categories(name)
      `)
      .eq("account_id", profile!.account_id)
      .order("display_order");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {

  try {

    const supabase = await createClient();

    const body = await req.json();

    const {
      name,
      category_id,
      description,
      price,
      is_veg,
    } = body;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id,account_id")
      .eq("user_id", user.id)
      .single();

    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        account_id: profile!.account_id,
        created_by: profile!.id,

        category_id,

        item_code: `ITEM-${Date.now()}`,

        name,
        description,

        price,

        is_veg,

        is_available: true,

        display_order: 1,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err) {

    console.error(err);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );

  }

}