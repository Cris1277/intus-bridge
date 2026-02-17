import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Mood } from "@prisma/client";

function getDemoUserId() {
  // TODO: reemplazar por auth (session.user.id)
  return "u1";
}

export async function GET(req: Request) {
  const userId = getDemoUserId();

  const { searchParams } = new URL(req.url);
  const days = Number(searchParams.get("days") ?? "7");

  const from = new Date();
  from.setDate(from.getDate() - Math.max(1, Math.min(days, 365)));

  const checkIns = await prisma.checkIn.findMany({
    where: {
      userId,
      createdAt: { gte: from },
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(checkIns);
}

export async function POST(req: Request) {
  const userId = getDemoUserId();

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

  if (!mood || !(mood in Mood)) {
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
      note, // guarda la nota (requiere note String? en schema + migración)
    },
  });

  return NextResponse.json(created, { status: 201 });
}
