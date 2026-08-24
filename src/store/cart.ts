"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine { artworkId: number; quantity: number; }
interface CartState {
  items: CartLine[];
  addItem: (artworkId: number, quantity?: number) => void;
  updateItem: (artworkId: number, quantity: number) => void;
  removeItem: (artworkId: number) => void;
  clear: () => void;
  totalCount: () => number;
}
export const useCartStore = create<CartState>()(persist((set, get) => ({
  items: [],
  addItem: (artworkId, quantity = 1) => set(s => {
    const found = s.items.find(i => i.artworkId === artworkId);
    return { items: found ? s.items.map(i => i.artworkId === artworkId ? { ...i, quantity: i.quantity + quantity } : i) : [...s.items, { artworkId, quantity }] };
  }),
  updateItem: (artworkId, quantity) => set(s => ({ items: quantity <= 0 ? s.items.filter(i => i.artworkId !== artworkId) : s.items.map(i => i.artworkId === artworkId ? { ...i, quantity } : i) })),
  removeItem: artworkId => set(s => ({ items: s.items.filter(i => i.artworkId !== artworkId) })),
  clear: () => set({ items: [] }),
  totalCount: () => get().items.reduce((s, i) => s + i.quantity, 0)
}), { name: "artsell-cart" }));
