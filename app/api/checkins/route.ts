import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

async function requireUserId() {
  const session = await getServerSession(authOptions);

  const userId = (session?.user as { id?: string })?.id;
  if (!userId) return null;

  return userId;
}

export async function GET(req: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const daysRaw = Number(searchParams.get("days") ?? "7");
  const days = Number.isFinite(daysRaw)
    ? Math.max(1, Math.min(daysRaw, 365))
    : 7;

  const from = new Date();
  from.setDate(from.getDate() - days);

  const checkIns = await prisma.checkIn.findMany({
    where: { userId, createdAt: { gte: from } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(checkIns);
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const mood = body.mood as Mood;
  const stressLevel = Number(body.stressLevel);
  const energyLevel = Number(body.energyLevel);

  const note =
    typeof body.note === "string" && body.note.trim().length > 0
      ? body.note.trim().slice(0, 1000)
      : undefined;

  // mood validation (robusta)
  if (!mood || !Object.values(Mood).includes(mood)) {
    return NextResponse.json({ error: "Invalid mood" }, { status: 400 });
  }

  if (!Number.isFinite(stressLevel) || stressLevel < 0 || stressLevel > 10) {
    return NextResponse.json(
      { error: "stressLevel must be 0-10" },
      { status: 400 },
    );
  }

  if (!Number.isFinite(energyLevel) || energyLevel < 0 || energyLevel > 10) {
    return NextResponse.json(
      { error: "energyLevel must be 0-10" },
      { status: 400 },
    );
  }

  const created = await prisma.checkIn.create({
    data: {
      userId,
      mood,
      stressLevel,
      energyLevel,
      note,
    },
  });

  return NextResponse.json(created, { status: 201 });
}
