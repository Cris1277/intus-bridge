"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoodPicker } from "@/components/mood-picker";
import { createJournalEntry } from "@/lib/stubs";
import type { Mood } from "@/lib/types";
import { ArrowLeft, X } from "lucide-react";
import Link from "next/link";

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

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood || !title.trim() || !content.trim()) return;
    setLoading(true);
    const entry = await createJournalEntry({
      title: title.trim(),
      content: content.trim(),
      mood,
      tags,
    });
    router.push(`/app/journal/${entry.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/app/journal"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al diario
        </Link>
        <h1 className="text-2xl font-bold text-foreground font-serif">
          Nueva entrada
        </h1>
        <p className="mt-1 text-muted-foreground">
          Escribe lo que necesites. Sin juicios, sin prisa.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Título
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="¿Qué quieres recordar de hoy?"
            className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label
            htmlFor="content"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            ¿Qué quieres contar?
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe libremente..."
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

        <button
          type="submit"
          disabled={!mood || !title.trim() || !content.trim() || loading}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "Guardando..." : "Guardar entrada"}
        </button>
      </form>
    </div>
  );
}
