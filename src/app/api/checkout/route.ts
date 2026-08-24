import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
export async function POST(req: Request) {
  if (!stripe) return NextResponse.json({ error: "Stripe is not configured. Add STRIPE_SECRET_KEY in Vercel." }, { status: 503 });
  const { items } = await req.json().catch(() => ({}));
  if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  const ids = items.map((x: any) => Number(x.artworkId)).filter(Number.isInteger);
  const { data: artworks, error } = await db().from("artworks").select("*").in("id", ids);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const byId = new Map((artworks ?? []).map(a => [a.id, a]));
  const lineItems: any[] = [];
  const cleanItems: any[] = [];
  for (const item of items) {
    const a = byId.get(Number(item.artworkId));
    const quantity = Math.max(1, Math.min(20, Number(item.quantity)));
    if (!a) continue;
    cleanItems.push({ artworkId: a.id, quantity });
    lineItems.push({ quantity, price_data: { currency: "usd", unit_amount: a.price, product_data: { name: a.title, description: (a.description || "").slice(0,500), images: a.image_url?.startsWith("http") ? [a.image_url] : undefined } } });
  }
  if (!lineItems.length) return NextResponse.json({ error: "No valid artworks in cart" }, { status: 400 });
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({ mode: "payment", line_items: lineItems, success_url: `${origin}/cart?session_id={CHECKOUT_SESSION_ID}`, cancel_url: `${origin}/cart`, metadata: { items: JSON.stringify(cleanItems) } });
  await db().from("analytics_events").insert({ type: "checkout_started", path: "/cart" });
  return NextResponse.json({ url: session.url });
}
