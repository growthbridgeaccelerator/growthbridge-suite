import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("restaurant_settings")
      .select("*")
      .eq("account_id", profile.account_id)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data ?? {});
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      restaurant_name,
      email,
      whatsapp_number,
      address,
    } = await req.json();

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

    const { data: existing } = await supabase
      .from("restaurant_settings")
      .select("id")
      .eq("account_id", profile!.account_id)
      .maybeSingle();

    let response;

    if (existing) {
      response = await supabase
        .from("restaurant_settings")
        .update({
          restaurant_name,
          email,
          whatsapp_number,
          address,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      response = await supabase
        .from("restaurant_settings")
        .insert({
          account_id: profile!.account_id,
          created_by: profile!.id,
          restaurant_name,
          email,
          whatsapp_number,
          address,
          is_active: true,
        })
        .select()
        .single();
    }

    if (response.error) {
      return NextResponse.json(
        { error: response.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}