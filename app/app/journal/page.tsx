"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, BookOpen } from "lucide-react";
import { JournalCard } from "@/components/journal-card";
import type { Mood, JournalEntry } from "@/lib/types";

const moodFilters: { value: Mood | "all"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "calm", label: "Calma" },
  { value: "ok", label: "Bien" },
  { value: "stressed", label: "Estrés" },
  { value: "anxious", label: "Ansiedad" },
  { value: "sad", label: "Tristeza" },
  { value: "angry", label: "Enfado" },
];

export default function JournalListPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState<Mood | "all">("all");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/journal", { cache: "no-store" });
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error ?? `HTTP ${res.status}`);
        }

        if (!cancelled) setEntries(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error cargando el diario");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      const matchesMood = moodFilter === "all" || entry.mood === moodFilter;

      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        entry.title.toLowerCase().includes(q) ||
        entry.content.toLowerCase().includes(q) ||
        entry.tags.some((t) => t.toLowerCase().includes(q));

      return matchesMood && matchesSearch;
    });
  }, [entries, search, moodFilter]);

  const isEmpty = !loading && !error && entries.length === 0;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-serif">
            Tu diario
          </h1>
          <p className="mt-1 text-muted-foreground">
            Un espacio privado para tus pensamientos.
          </p>
        </div>
        <Link
          href="/app/journal/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Nueva entrada
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar en tu diario..."
            className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {moodFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setMoodFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                moodFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-muted"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div className="text-sm text-muted-foreground">Cargando…</div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
          <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">
            {isEmpty ? "Tu diario esta vacío" : "No se encontraron entradas"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {isEmpty
              ? "Empieza escribiendo lo que sientes."
              : "Prueba con otros filtros o palabras."}
          </p>
          {isEmpty && (
            <Link
              href="/app/journal/new"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Primera entrada
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onDeleted={(id) =>
                setEntries((prev) => prev.filter((e) => e.id !== id))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
