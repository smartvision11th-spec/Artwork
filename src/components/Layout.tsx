"use client";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
export default function Layout({ children }: { children: React.ReactNode }) {
 const path=usePathname();
 useEffect(()=>{fetch("/api/analytics",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:"page_view",path})}).catch(()=>{});},[path]);
 return <div className="flex min-h-screen flex-col bg-background"><Header/><main className="flex-1">{children}</main><Footer/></div>;
}
