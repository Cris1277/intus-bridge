"use client";

import Link from "next/link";
import type { JournalEntry } from "@/lib/types";
import { getMoodInfo } from "@/components/mood-picker";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function JournalCard({
  entry,
  onDeleted,
}: {
  entry: JournalEntry;
  onDeleted?: (id: string) => void;
}) {
  const moodInfo = getMoodInfo(entry.mood);
  const router = useRouter();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEdit(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/app/journal/${entry.id}/edit`);
  }

  function openDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setError(null);
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    try {
      setDeleting(true);
      setError(null);

      const res = await fetch(`/api/journal/${entry.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? "No se pudo eliminar la entrada");
      }

      // update: la quitamos de la lista sin refrescar manual
      onDeleted?.(entry.id);

      setConfirmOpen(false);
    } catch (e: any) {
      setError(e?.message ?? "Error eliminando la entrada");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <Link
        href={`/app/journal/${entry.id}`}
        className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
            {entry.title}
          </h3>
          <span className="shrink-0 text-lg" aria-label={moodInfo.label}>
            {moodInfo.icon}
          </span>
        </div>

        {/* Content preview */}
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {entry.content}
        </p>

        {/* Tags */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {new Date(entry.createdAt).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>

          {/* Actions bottom-right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEdit}
              aria-label="Editar entrada"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Pencil className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={openDelete}
              aria-label="Eliminar entrada"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Link>

      {/* ✅ Modal confirm (sin window.confirm) */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => !deleting && setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-xl border border-border bg-card p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-base font-semibold text-foreground">
              ¿Eliminar esta entrada?
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>

            {error && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
              >
                {deleting ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
