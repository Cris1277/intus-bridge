import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

/**
 * POST /api/user/purge
 * Body:
 *  - confirm: "BORRAR" (required)
 *  - wipeDataOnly?: boolean (optional) -> if true, keeps the account but deletes all user data
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const confirm = typeof body?.confirm === "string" ? body.confirm : "";
  const wipeDataOnly =
    typeof body?.wipeDataOnly === "boolean" ? body.wipeDataOnly : false;

  if (confirm !== "BORRAR") {
    return NextResponse.json(
      { error: 'Confirmation required: confirm must be "BORRAR"' },
      { status: 400 },
    );
  }

  try {
    // Con nuestro schema, cascades cubren:
    // User -> JournalEntry, CheckIn, Conversation
    // Conversation -> Message
    if (!wipeDataOnly) {
      // Borra TODO (datos + cuenta) vía cascada
      await prisma.user.delete({ where: { id: userId } });
      return NextResponse.json({ ok: true, deletedUser: true });
    }

    // Mantener cuenta pero borrar todos los datos
    await prisma.$transaction(async (tx) => {
      // Mensajes se borran por cascade al borrar conversations, pero lo dejamos explícito por seguridad:
      await tx.message.deleteMany({
        where: { conversation: { userId } },
      });

      await tx.conversation.deleteMany({ where: { userId } });
      await tx.journalEntry.deleteMany({ where: { userId } });
      await tx.checkIn.deleteMany({ where: { userId } });
    });

    return NextResponse.json({ ok: true, deletedUser: false });
  } catch (e: any) {
    // Errores típicos:
    // - record not found
    // - constraint/transaction issues
    return NextResponse.json({ error: "Purge failed" }, { status: 500 });
  }
}
