import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = Number((await params).id);
  const { status } = await req.json().catch(() => ({}));
  if (!["PENDING", "PAID", "FAILED"].includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  const { data, error } = await db().from("orders").update({ status }).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
