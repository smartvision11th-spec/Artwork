import type { Artwork, Order } from "./types";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, headers: { "Content-Type": "application/json", ...(options?.headers || {}) } });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || "Request failed");
  return body;
}

export const api = {
  artworks: () => request<Artwork[]>("/api/artworks"),
  artwork: (id: number) => request<Artwork | null>(`/api/artworks/${id}`),
  createCheckout: (items: { artworkId: number; quantity: number }[]) =>
    request<{ url: string }>("/api/checkout", { method: "POST", body: JSON.stringify({ items }) }),
  adminMe: () => request<{ isAdmin: boolean }>("/api/admin/me"),
  adminLogin: (password: string) => request<{ ok: true }>("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) }),
  adminLogout: () => request<{ ok: true }>("/api/admin/logout", { method: "POST" }),
  adminOrders: () => request<Order[]>("/api/admin/orders"),
  adminAnalytics: () => request<{ visitors: number; orders: number; revenue: number; artworks: number; topArtworks: { title: string; sales: number }[] }>("/api/admin/analytics"),
  deleteArtwork: (id: number) => request<{ ok: true }>(`/api/admin/artworks/${id}`, { method: "DELETE" }),
};
