import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
export default function HeroSection() {
 return <section className="bg-gallery-gradient"><div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28"><div>
 <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary">ArtSell Gallery</p>
 <h1 className="mt-5 font-display text-4xl font-medium leading-tight text-balance sm:text-5xl lg:text-6xl">Curated contemporary art, collected with care.</h1>
 <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">Discover original works from emerging and established artists. Every piece is authenticated, priced transparently, and shipped to your door.</p>
 <div className="mt-8 flex flex-wrap gap-4"><Button asChild size="lg"><Link href="/shop">Explore the Collection<ArrowRight className="size-4"/></Link></Button><Button asChild variant="outline" size="lg"><Link href="/#about">Our Story</Link></Button></div>
 </div><div className="relative"><div className="overflow-hidden rounded-none border bg-card shadow-lg"><img src="/assets/generated/hero-artwork.dim_800x1000.jpg" alt="Featured original artwork displayed in a gallery setting" className="aspect-[4/5] w-full object-cover"/></div><div className="absolute -bottom-6 -left-6 hidden border bg-card px-6 py-4 shadow-lg md:block"><p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Featured</p><p className="mt-1 font-display text-lg font-medium">Original works, one of a kind</p></div></div></div></section>;
}
