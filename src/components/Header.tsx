"use client";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/store/cart";

const NAV_LINKS = [
  { label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: "About", href: "/#about" }, { label: "Cart", href: "/cart" }
];
export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const items = useCartStore(s => s.items);
  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  return <header className="sticky top-0 z-40 border-b bg-card shadow-subtle">
    <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
      <Link href="/" className="font-display text-2xl font-semibold tracking-tight text-foreground" data-ocid="header.brand_link">ArtSell</Link>
      <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
        {NAV_LINKS.map(link => <Link key={link.label} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" data-ocid={`header.nav_${link.label.toLowerCase()}`}>{link.label}</Link>)}
        <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-foreground" data-ocid="header.nav_admin">Admin</Link>
      </nav>
      <div className="flex items-center gap-2">
        <Link href="/cart" className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground hover:bg-muted" aria-label={`Cart, ${cartCount} items`} data-ocid="header.cart_link">
          <ShoppingBag className="size-5"/>{cartCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">{cartCount}</span>}
        </Link>
        <button type="button" className="inline-flex size-10 items-center justify-center rounded-full md:hidden" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(v => !v)}>{menuOpen ? <X className="size-5"/> : <Menu className="size-5"/>}</button>
      </div>
    </div>
    {menuOpen && <nav className="border-t bg-card px-6 py-4 md:hidden"><ul className="flex flex-col gap-1">{NAV_LINKS.map(link => <li key={link.label}><Link href={link.href} onClick={() => setMenuOpen(false)} className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">{link.label}</Link></li>)}<li><Link href="/admin" onClick={() => setMenuOpen(false)} className="block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted">Admin</Link></li></ul></nav>}
  </header>;
}
