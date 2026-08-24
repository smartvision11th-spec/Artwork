import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const artworkId = Number(body.artworkId);
  const { error } = await db().from("analytics_events").insert({ type: String(body.type || "page_view"), path: String(body.path || "").slice(0, 500), artwork_id: Number.isInteger(artworkId) ? artworkId : null });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
