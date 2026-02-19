import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  const sessionUser = session?.user as
    | { id?: string; email?: string | null }
    | undefined;

  if (!sessionUser?.id && !sessionUser?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name =
    typeof body.name === "string" ? body.name.trim().slice(0, 100) : undefined;

  const email =
    typeof body.email === "string"
      ? body.email.trim().toLowerCase()
      : undefined;

  if (name === undefined && email === undefined) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  // 1) Preferimos SIEMPRE id (no cambia aunque cambies el email)
  const where = sessionUser.id
    ? { id: sessionUser.id }
    : { email: (sessionUser.email ?? "").toLowerCase() };

  // Verificamos que existe
  const exists = await prisma.user.findUnique({
    where: where as any,
    select: { id: true },
  });

  if (!exists) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const updated = await prisma.user.update({
      where: where as any,
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    const msg = typeof e?.message === "string" ? e.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
