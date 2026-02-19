import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

async function getUserIdOrThrow() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }
  return userId;
}

export async function GET(req: Request) {
  try {
    const userId = await getUserIdOrThrow();

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") ?? "").trim();
    const tag = (searchParams.get("tag") ?? "").trim();
    const takeRaw = Number(searchParams.get("take") ?? "50");
    const take = Math.min(Math.max(1, takeRaw), 100);

    const entries = await prisma.journalEntry.findMany({
      where: {
        userId,
        ...(q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(tag ? { tags: { has: tag } } : {}),
      },
      orderBy: { createdAt: "desc" },
      take,
    });

    return NextResponse.json(entries);
  } catch (e: any) {
    if (e?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("GET /api/journal error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdOrThrow();

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const title = typeof body.title === "string" ? body.title.trim() : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const mood = body.mood as Mood | undefined;

    const tags = Array.isArray(body.tags)
      ? body.tags
          .filter((t: unknown) => typeof t === "string")
          .map((t: string) => t.trim())
          .filter(Boolean)
          .slice(0, 20)
      : [];

    if (!title) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    if (!mood || !(mood in Mood)) {
      return NextResponse.json({ error: "Invalid mood" }, { status: 400 });
    }

    const created = await prisma.journalEntry.create({
      data: {
        userId,
        title: title.slice(0, 200),
        content: content.slice(0, 20000),
        mood,
        tags,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    if (e?.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("POST /api/journal error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
