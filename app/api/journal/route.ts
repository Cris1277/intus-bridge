import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";

function getDemoUserId() {
  return "u1";
}

export async function GET(req: Request) {
  const userId = getDemoUserId();

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const tag = (searchParams.get("tag") ?? "").trim();
  const take = Math.min(Number(searchParams.get("take") ?? "50"), 100);

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
}

export async function POST(req: Request) {
  const userId = getDemoUserId();

  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";
  const mood = body.mood as Mood | undefined;

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t: unknown) => typeof t === "string")
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
      title,
      content,
      mood,
      tags,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
