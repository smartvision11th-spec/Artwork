import { NextResponse } from "next/server";
import { db, mapOrder } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = db();
  const { data: orders, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const ids = (orders ?? []).map(o => o.id);
  const { data: items, error: itemError } = ids.length ? await supabase.from("order_items").select("*").in("order_id", ids) : { data: [], error: null };
  if (itemError) return NextResponse.json({ error: itemError.message }, { status: 500 });
  return NextResponse.json((orders ?? []).map(o => mapOrder(o, (items ?? []).filter(i => i.order_id === o.id))));
}
