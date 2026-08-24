import { NextResponse } from "next/server";
import { db, mapArtwork } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const description = String(form.get("description") || "").trim();
  const price = Number(form.get("price"));
  const featured = String(form.get("featured")) === "true";
  const file = form.get("image");
  const supabase = db();
  const { data: current, error: currentError } = await supabase.from("artworks").select("*").eq("id", id).maybeSingle();
  if (currentError) return NextResponse.json({ error: currentError.message }, { status: 500 });
  if (!current) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (!title || !Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "Title and valid price are required" }, { status: 400 });

  let imageUrl = current.image_url;
  let imagePath = current.image_path;
  if (file instanceof File) {
    const path = `artworks/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const upload = await supabase.storage.from("artworks").upload(path, Buffer.from(await file.arrayBuffer()), { contentType: file.type || "image/jpeg", upsert: false });
    if (upload.error) return NextResponse.json({ error: upload.error.message }, { status: 500 });
    imagePath = path;
    imageUrl = supabase.storage.from("artworks").getPublicUrl(path).data.publicUrl;
  }
  const { data, error } = await supabase.from("artworks").update({ title, description, price: Math.round(price * 100), featured, image_url: imageUrl, image_path: imagePath, updated_at: new Date().toISOString() }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(mapArtwork(data));
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  const supabase = db();
  const { data: current } = await supabase.from("artworks").select("image_path").eq("id", id).maybeSingle();
  const { error } = await supabase.from("artworks").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (current?.image_path) await supabase.storage.from("artworks").remove([current.image_path]);
  return NextResponse.json({ ok: true });
}
