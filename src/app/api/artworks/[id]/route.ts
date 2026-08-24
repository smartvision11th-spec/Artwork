import { NextResponse } from "next/server";
import { db, mapArtwork } from "@/lib/db";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const { data, error } = await db().from("artworks").select("*").eq("id", id).maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ? mapArtwork(data) : null);
}
