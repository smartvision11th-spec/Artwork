import { NextResponse } from "next/server";
import { db, mapArtwork } from "@/lib/db";

export async function GET() {
  const { data, error } = await db().from("artworks").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json((data ?? []).map(mapArtwork));
}
