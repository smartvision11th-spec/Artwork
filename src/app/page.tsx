"use client";
import ArtistSection from "@/components/ArtistSection";
import ArtworkCard from "@/components/ArtworkCard";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { useArtworks } from "@/hooks/useQueries";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function HomePage() {
 const {data:artworks=[],isLoading,isError}=useArtworks(); const featured=artworks.filter(a=>a.featured).slice(0,3);
 return <><HeroSection/><section className="mx-auto max-w-6xl px-6 py-20"><div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">Featured Works</p><h2 className="mt-3 font-display text-3xl font-medium sm:text-4xl">Pieces we love right now</h2></div><Button asChild variant="outline"><Link href="/shop">View All<ArrowRight className="size-4"/></Link></Button></div>
 {isLoading&&<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{["a","b","c"].map(k=><div key={k} className="aspect-[4/5] animate-pulse bg-muted"/>)}</div>}
 {isError&&<div className="mt-10 border bg-card p-10 text-center"><p className="font-display text-xl">We couldn't load the collection.</p><p className="mt-2 text-muted-foreground">Please try again in a moment.</p></div>}
 {!isLoading&&!isError&&featured.length===0&&<div className="mt-10 border bg-card p-10 text-center"><p className="font-display text-xl">New works are on the way.</p><p className="mt-2 text-muted-foreground">Check back soon for featured pieces.</p></div>}
 {!isLoading&&!isError&&featured.length>0&&<div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{featured.map((a,i)=><ArtworkCard key={a.id} artwork={a} index={i}/>)}</div>}
 </section><ArtistSection/></>;
}
