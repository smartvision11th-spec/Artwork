import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
export async function POST(req: Request) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) return new NextResponse("Stripe webhook not configured", { status: 503 });
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return new NextResponse("Missing signature", { status: 400 });
  let event: any;
  try { event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET); } catch { return new NextResponse("Invalid signature", { status: 400 }); }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid" && session.id) {
      const requested = session.metadata?.items ? JSON.parse(session.metadata.items) : [];
      const ids = requested.map((x: any) => Number(x.artworkId));
      const supabase = db();
      const { data: artworks } = await supabase.from("artworks").select("*").in("id", ids);
      const map = new Map((artworks ?? []).map(a => [a.id, a]));
      const items = requested.flatMap((x: any) => { const a = map.get(Number(x.artworkId)); if (!a) return []; return [{ artwork_id: a.id, title: a.title, price: a.price, quantity: Math.max(1, Number(x.quantity)) }]; });
      const total = items.reduce((s: number, x: any) => s + x.price * x.quantity, 0);
      const orderPayload = { stripe_session_id: session.id, status: "PAID", total, email: session.customer_details?.email ?? null, customer_name: session.customer_details?.name ?? null };
      const { data: existing } = await supabase.from("orders").select("id").eq("stripe_session_id", session.id).maybeSingle();
      let orderId: number;
      if (existing) { const { data } = await supabase.from("orders").update(orderPayload).eq("id", existing.id).select("id").single(); orderId = data!.id; }
      else { const { data } = await supabase.from("orders").insert(orderPayload).select("id").single(); orderId = data!.id; await supabase.from("order_items").insert(items.map((i: any) => ({ ...i, order_id: orderId }))); }
      await supabase.from("analytics_events").insert({ type: "purchase", path: "/cart" });
    }
  }
  return NextResponse.json({ received: true });
}
