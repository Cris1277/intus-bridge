"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Lightbulb, Sparkles, Trash2 } from "lucide-react";
import { getMoodInfo } from "@/components/mood-picker";
import type { JournalEntry } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/confirm-dialog";

// Mock insights
const mockInsights = {
  summary:
    "Estás mostrando mayor conciencia de tus emociones. Reconocer lo que sientes es el primer paso para procesarlo.",
  patterns: [
    "El trabajo sigue siendo una fuente de estrés recurrente",
    "Cuando pones límites, aunque sea difícil, te sientes mejor después",
    "Escribir te ayuda a organizar lo que sientes",
  ],
  nextStep:
    "Podrías probar la técnica de reencuadre cognitivo antes de la próxima reunión que te genere ansiedad.",
};

export default function JournalEntryPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const router = useRouter();
  const { entryId } = use(params);

  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal delete
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Carga entry
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const res = await fetch(`/api/journal/${entryId}`, {
          cache: "no-store",
        });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error ?? `HTTP ${res.status}`);
        }

        if (!cancelled) setEntry(data);
      } catch {
        if (!cancelled) setEntry(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [entryId]);

  async function confirmDelete() {
    try {
      setDeleting(true);
      setDeleteError(null);

      const res = await fetch(`/api/journal/${entryId}`, { method: "DELETE" });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }

      // Nos vamos al listado
      router.push("/app/journal");
      router.refresh();
    } catch (e: any) {
      setDeleteError(e?.message ?? "No se pudo eliminar la entrada");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="text-sm text-muted-foreground">Cargando…</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          href="/app/journal"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al diario
        </Link>
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            Entrada no encontrada
          </p>
        </div>
      </div>
    );
  }

  const moodInfo = getMoodInfo(entry.mood);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href="/app/journal"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al diario
        </Link>

        <button
          onClick={() => {
            setDeleteError(null);
            setConfirmOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          disabled={deleting}
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </button>
      </div>

      {/* Entry */}
      <article className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-card-foreground font-serif">
              {entry.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {new Date(entry.createdAt).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${moodInfo.color}`}
          >
            <span>{moodInfo.icon}</span>
            {moodInfo.label}
          </div>
        </div>

        <div className="mt-6 text-sm text-card-foreground leading-relaxed whitespace-pre-line">
          {entry.content}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {entry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>

      {/* Insights (mock) */}
      <div className="mt-6 rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold text-card-foreground">
            Insights
          </h2>
          <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
            IA
          </span>
        </div>
        <p className="mb-1 text-xs text-muted-foreground">
          Respuestas generadas por IA. Úsalas como apoyo, no como diagnóstico.
        </p>

        <p className="mt-3 text-sm text-card-foreground leading-relaxed">
          {mockInsights.summary}
        </p>

        <div className="mt-4">
          <h3 className="text-sm font-medium text-card-foreground">
            Patrones detectados
          </h3>
          <ul className="mt-2 flex flex-col gap-2">
            {mockInsights.patterns.map((p, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 rounded-lg bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-medium text-card-foreground">
              Próximo paso sugerido
            </h3>
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {mockInsights.nextStep}
          </p>
        </div>

        <button className="mt-4 w-full rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
          Crear plan de calma
        </button>
      </div>

      {/* ✅ Modal bonito de borrado */}
      <ConfirmDialog
        open={confirmOpen}
        title="¿Eliminar esta entrada?"
        description="Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
        loading={deleting}
        error={deleteError}
        onClose={() => !deleting && setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
