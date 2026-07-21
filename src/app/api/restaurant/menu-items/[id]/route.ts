import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { supabase, accountId } = await getCurrentAccount();

    const { id } = await params;

    const { data, error } = await supabase
      .from("menu_items")
      .select(`
        *,
        menu_categories(name)
      `)
      .eq("id", id)
      .eq("account_id", accountId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
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

export async function PATCH(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { supabase, accountId } = await getCurrentAccount();

    const { id } = await params;

    const body = await req.json();

    const {
  name,
  category_id,
  description,
  price,
  is_veg,
  is_available,
} = body;

    const { data, error } = await supabase
      .from("menu_items")
      .update({
  name,
  category_id,
  description,
  price,
  is_veg,
  is_available,
  updated_at: new Date().toISOString(),
})
      .eq("id", id)
      .eq("account_id", accountId)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Failed to update menu item" },
        { status: 400 }
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

export async function DELETE(
  req: Request,
  { params }: RouteContext
) {
  try {
    const { supabase, accountId } = await getCurrentAccount();

    const { id } = await params;

    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id)
      .eq("account_id", accountId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
    });

  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}