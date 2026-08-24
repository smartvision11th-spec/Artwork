import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function db() {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

export function mapArtwork(row: any) {
  return { id: row.id, title: row.title, price: row.price, description: row.description ?? "", imageUrl: row.image_url, imagePath: row.image_path ?? null, featured: !!row.featured, createdAt: row.created_at, updatedAt: row.updated_at };
}

export function mapOrder(row: any, items: any[] = []) {
  return { id: row.id, stripeSessionId: row.stripe_session_id ?? null, email: row.email ?? null, customerName: row.customer_name ?? null, total: row.total, currency: row.currency ?? "usd", status: row.status, createdAt: row.created_at, items: items.map(i => ({ id: i.id, artworkId: i.artwork_id, title: i.title, price: i.price, quantity: i.quantity })) };
}
