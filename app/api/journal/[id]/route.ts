import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";

function getDemoUserId() {
  return "u1";
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const userId = getDemoUserId();
  const { id } = await ctx.params;

  const entry = await prisma.journalEntry.findFirst({
    where: { id, userId },
  });

  if (!entry) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const userId = getDemoUserId();
  const { id } = await ctx.params;

  const exists = await prisma.journalEntry.findFirst({
    where: { id, userId },
  });

  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data: {
    title?: string;
    content?: string;
    mood?: Mood;
    tags?: string[];
  } = {};

  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.content === "string") data.content = body.content.trim();

  if (typeof body.mood === "string") {
    const mood = body.mood as Mood;
    if (!(mood in Mood)) {
      return NextResponse.json({ error: "Invalid mood" }, { status: 400 });
    }
    data.mood = mood;
  }

  if (Array.isArray(body.tags)) {
    data.tags = body.tags
      .filter((t: unknown) => typeof t === "string")
      .map((t: string) => t.trim())
      .filter(Boolean)
      .slice(0, 20);
  }

  const updated = await prisma.journalEntry.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const userId = getDemoUserId();
  const { id } = await ctx.params;

  const exists = await prisma.journalEntry.findFirst({
    where: { id, userId },
  });

  if (!exists) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.journalEntry.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
