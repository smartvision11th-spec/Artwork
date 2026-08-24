import { NextResponse } from "next/server";
import { db, mapArtwork } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim();
  const price = Number(form.get("price"));
  const featured = String(form.get("featured")) === "true";
  const file = form.get("image");
  if (!title || !Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "Title and valid price are required" }, { status: 400 });
  if (!(file instanceof File)) return NextResponse.json({ error: "Artwork image is required" }, { status: 400 });

  const path = `artworks/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const supabase = db();
  const upload = await supabase.storage.from("artworks").upload(path, buffer, { contentType: file.type || "image/jpeg", upsert: false });
  if (upload.error) return NextResponse.json({ error: upload.error.message }, { status: 500 });
  const imageUrl = supabase.storage.from("artworks").getPublicUrl(path).data.publicUrl;
  const { data, error } = await supabase.from("artworks").insert({ title, description, price: Math.round(price * 100), featured, image_url: imageUrl, image_path: path }).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapArtwork(data), { status: 201 });
}
