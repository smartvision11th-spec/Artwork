"use client";
import ArtworkCard from "@/components/ArtworkCard";
import { useArtworks } from "@/hooks/useQueries";
export default function ShopPage(){const{data:artworks=[],isLoading,isError}=useArtworks();return <div className="mx-auto max-w-6xl px-6 py-16"><header><p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">The Collection</p><h1 className="mt-3 font-display text-4xl font-medium sm:text-5xl">Shop all artworks</h1><p className="mt-4 max-w-xl text-lg text-muted-foreground">Browse the full collection of original works, each authenticated and ready to ship.</p></header>
{isLoading&&<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{["a","b","c","d","e","f"].map(k=><div key={k} className="aspect-[4/5] animate-pulse bg-muted"/>)}</div>}
{isError&&<div className="mt-12 border bg-card p-10 text-center">We couldn't load the collection.</div>}
{!isLoading&&!isError&&artworks.length===0&&<div className="mt-12 border bg-card p-10 text-center"><p className="font-display text-xl">The collection is being curated.</p><p className="mt-2 text-muted-foreground">New works will appear here soon.</p></div>}
{!isLoading&&!isError&&artworks.length>0&&<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{artworks.map((a,i)=><ArtworkCard key={a.id} artwork={a} index={i}/>)}</div>}
</div>}
