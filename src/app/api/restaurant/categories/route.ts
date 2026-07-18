import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET Categories
export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("account_id")
      .eq("user_id", user.id)
      .single();

    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("account_id", profile!.account_id)
      .order("display_order");

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
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

// POST Category
export async function POST(req: Request) {

  try {

    const supabase = await createClient();

    const { name, description } = await req.json();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("id,account_id")
      .eq("user_id", user.id)
      .single();

    const { data, error } = await supabase
      .from("menu_categories")
      .insert({
        account_id: profile!.account_id,
        created_by: profile!.id,
        name,
        description,
        display_order: 1,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
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