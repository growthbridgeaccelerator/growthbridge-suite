import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function PATCH(request: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !serviceKey) {
      return NextResponse.json(
        { error: "Server configuration missing" },
        { status: 500 },
      );
    }

    const authHeader = request.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const token = authHeader.slice(7);

    const admin = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await admin.auth.getUser(token);

    if (userError || !user) {
      console.error("[currency] token verification failed:", userError);
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401 },
      );
    }

    const body = await request.json().catch(() => null);
    const currency = body?.currency;

    if (
      typeof currency !== "string" ||
      !/^[A-Z]{3}$/.test(currency)
    ) {
      return NextResponse.json(
        { error: "Invalid currency code" },
        { status: 400 },
      );
    }

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("account_id, account_role")
      .eq("user_id", user.id)
      .single();

    if (
      profileError ||
      !profile?.account_id ||
      !["owner", "admin"].includes(profile.account_role)
    ) {
      console.error("[currency] profile permission error:", profileError);
      return NextResponse.json(
        { error: "Admin permission required" },
        { status: 403 },
      );
    }

    const { data, error } = await admin
      .from("accounts")
      .update({ default_currency: currency })
      .eq("id", profile.account_id)
      .select("id, default_currency")
      .single();

    if (error) {
      console.error("[currency] DB update failed:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    console.log("[currency] updated:", data);

    return NextResponse.json({
      success: true,
      account: data,
    });
  } catch (error) {
    console.error("[currency] unexpected error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
