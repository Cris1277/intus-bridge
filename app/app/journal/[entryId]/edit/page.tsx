"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { MoodPicker } from "@/components/mood-picker";
import type { Mood, JournalEntry } from "@/lib/types";

const suggestedTags = [
  "trabajo",
  "ansiedad",
  "bullying",
  "estrés",
  "límites",
  "logro",
  "emociones",
  "calma",
  "reflexión",
  "bienestar",
];

export default function EditJournalEntryPage({
  params,
}: {
  params: Promise<{ entryId: string }>;
}) {
  const { entryId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  // 1) Cargar entry para prellenar
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/journal/${entryId}`, {
          cache: "no-store",
        });
        const data = (await res
          .json()
          .catch(() => null)) as JournalEntry | null;

        if (!res.ok || !data) throw new Error("No se pudo cargar la entrada");

        if (cancelled) return;

        setTitle(data.title ?? "");
        setContent(data.content ?? "");
        setMood((data.mood as Mood) ?? null);
        setTags(Array.isArray(data.tags) ? data.tags : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error cargando la entrada");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [entryId]);

  // 2) Guardar cambios (PATCH)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood || !title.trim() || !content.trim()) return;

    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`/api/journal/${entryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          mood,
          tags,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error ?? `HTTP ${res.status}`);
      }

      router.push(`/app/journal/${entryId}`);
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="text-sm text-muted-foreground">Cargando…</div>
      </div>
    );
  }

  if (error && !mood) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/app/journal/${entryId}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>

        <div className="rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href={`/app/journal/${entryId}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la entrada
        </Link>

        <h1 className="text-2xl font-bold text-foreground font-serif">
          Editar entrada
        </h1>
        <p className="mt-1 text-muted-foreground">
          Ajusta lo que necesites. Sin prisa.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6"
      >
        {/* Title */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Título
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">
            Contenido
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground leading-relaxed placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        {/* Mood */}
        <div>
          <label className="mb-3 block text-sm font-medium text-foreground">
            ¿Cómo te sientes?
          </label>
          <MoodPicker value={mood} onChange={setMood} size="sm" />
        </div>

        {/* Tags */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => {
              const selected = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    selected
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-muted"
                  }`}
                >
                  {tag}
                  {selected && <X className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!mood || !title.trim() || !content.trim() || saving}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-40"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
