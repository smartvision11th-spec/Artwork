import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const supabase = db();
  const [events, ordersRes, artworksRes, itemsRes, artRes] = await Promise.all([
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).eq("type", "page_view"),
    supabase.from("orders").select("total").eq("status", "PAID"),
    supabase.from("artworks").select("id", { count: "exact", head: true }),
    supabase.from("order_items").select("artwork_id,quantity"),
    supabase.from("artworks").select("id,title")
  ]);
  const paid = ordersRes.data ?? [];
  const items = itemsRes.data ?? [];
  const titleMap = new Map((artRes.data ?? []).map(a => [a.id, a.title]));
  const sales = new Map<number, number>();
  for (const item of items) sales.set(item.artwork_id, (sales.get(item.artwork_id) ?? 0) + item.quantity);
  const topArtworks = [...sales.entries()].sort((a,b) => b[1]-a[1]).slice(0,5).map(([id,sales]) => ({ title: titleMap.get(id) ?? "Unknown", sales }));
  return NextResponse.json({ visitors: events.count ?? 0, orders: paid.length, revenue: paid.reduce((s,o) => s + Number(o.total || 0), 0), artworks: artworksRes.count ?? 0, topArtworks });
}
