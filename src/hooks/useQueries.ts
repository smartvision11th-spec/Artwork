"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Artwork } from "@/lib/types";

export function useArtworks() {
  return useQuery({ queryKey: ["artworks"], queryFn: api.artworks });
}
export function useArtwork(id: number) {
  return useQuery({ queryKey: ["artwork", id], queryFn: () => api.artwork(id), enabled: Number.isInteger(id) });
}
export function useOrders() {
  return useQuery({ queryKey: ["orders"], queryFn: api.adminOrders });
}
export function useIsCallerAdmin() {
  return useQuery({ queryKey: ["admin"], queryFn: api.adminMe });
}
export function useAddArtwork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { title: string; price: number; description: string; featured: boolean; file: File }) => {
      const form = new FormData();
      form.set("title", input.title); form.set("price", String(input.price)); form.set("description", input.description); form.set("featured", String(input.featured)); form.set("image", input.file);
      const res = await fetch("/api/admin/artworks", { method: "POST", body: form });
      const body = await res.json(); if (!res.ok) throw new Error(body.error || "Upload failed"); return body as Artwork;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["artworks"] })
  });
}
export function useUpdateArtwork() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: number; input: { title: string; price: number; description: string; featured: boolean; file?: File } }) => {
      const form = new FormData();
      form.set("title", input.title); form.set("price", String(input.price)); form.set("description", input.description); form.set("featured", String(input.featured)); if (input.file) form.set("image", input.file);
      const res = await fetch(`/api/admin/artworks/${id}`, { method: "PUT", body: form });
      const body = await res.json(); if (!res.ok) throw new Error(body.error || "Update failed"); return body as Artwork;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["artworks"] })
  });
}
export function useDeleteArtwork() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteArtwork, onSuccess: () => qc.invalidateQueries({ queryKey: ["artworks"] }) });
}
