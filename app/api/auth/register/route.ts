import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(pw: string) {
  // mínimo 8 chars, si quieres más: añade mayus/min/número/símbolo
  return pw.length >= 8;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body)
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const name = String(body.name || "").trim();
  const email = String(body.email || "")
    .toLowerCase()
    .trim();
  const password = String(body.password || "");

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!password || !isStrongPassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters" },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name: name || null,
      passwordHash,
    },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json(user, { status: 201 });
}
