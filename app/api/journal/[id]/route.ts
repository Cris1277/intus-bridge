import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

async function getUserIdOrThrow() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) throw new Error("UNAUTHORIZED");
  return userId;
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserIdOrThrow();
    const { id } = await ctx.params;

    const entry = await prisma.journalEntry.findFirst({
      where: { id, userId },
    });

    if (!entry) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(entry);
  } catch (e: any) {
    if (e?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/journal/[id] error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserIdOrThrow();
    const { id } = await ctx.params;

    const exists = await prisma.journalEntry.findFirst({
      where: { id, userId },
      select: { id: true },
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

    if (typeof body.title === "string") {
      const title = body.title.trim();
      if (title) data.title = title.slice(0, 200);
    }

    if (typeof body.content === "string") {
      const content = body.content.trim();
      if (content) data.content = content.slice(0, 20000);
    }

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

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 },
      );
    }

    // Importante: garantizamos ownership en el update (id + userId)
    const updated = await prisma.journalEntry.updateMany({
      where: { id, userId },
      data,
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const fresh = await prisma.journalEntry.findFirst({
      where: { id, userId },
    });

    return NextResponse.json(fresh);
  } catch (e: any) {
    if (e?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("PATCH /api/journal/[id] error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await getUserIdOrThrow();
    const { id } = await ctx.params;

    // Importante: borramos solo si pertenece al usuario
    const deleted = await prisma.journalEntry.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("DELETE /api/journal/[id] error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
