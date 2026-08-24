"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import type { Artwork } from "@/lib/types";
import { Plus } from "lucide-react";
import { toast } from "sonner";
export default function ArtworkCard({ artwork, index }: { artwork: Artwork; index: number }) {
 const addItem=useCartStore(s=>s.addItem);
 return <article className="group flex flex-col overflow-hidden rounded-none border bg-card transition-shadow hover:shadow-lg">
  <Link href={`/artwork/${artwork.id}`} className="block aspect-[4/5] overflow-hidden bg-muted"><img src={artwork.imageUrl} alt={artwork.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105"/></Link>
  <div className="flex flex-1 flex-col gap-3 p-5"><div className="flex items-start justify-between gap-3"><h3 className="font-display text-lg font-medium leading-snug"><Link href={`/artwork/${artwork.id}`} className="hover:text-primary">{artwork.title}</Link></h3><p className="shrink-0 text-sm font-semibold">{formatPrice(artwork.price)}</p></div><p className="line-clamp-2 text-sm text-muted-foreground">{artwork.description}</p><Button onClick={()=>{addItem(artwork.id);toast.success(`Added "${artwork.title}" to your cart`);}} className="mt-auto w-full"><Plus className="size-4"/>Add to Cart</Button></div>
 </article>;
}
function formatPrice(cents:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format(cents/100)}
