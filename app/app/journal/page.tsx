"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Search, BookOpen } from "lucide-react";
import { journalEntries } from "@/data/mock";
import { JournalCard } from "@/components/journal-card";
import type { Mood } from "@/lib/types";

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
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState<Mood | "all">("all");

  const filtered = useMemo(() => {
    return journalEntries.filter((entry) => {
      const matchesMood = moodFilter === "all" || entry.mood === moodFilter;
      const matchesSearch =
        !search ||
        entry.title.toLowerCase().includes(search.toLowerCase()) ||
        entry.content.toLowerCase().includes(search.toLowerCase()) ||
        entry.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchesMood && matchesSearch;
    });
  }, [search, moodFilter]);

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

      {/* Entries */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
          <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">
            {journalEntries.length === 0
              ? "Tu diario esta vacío"
              : "No se encontraron entradas"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {journalEntries.length === 0
              ? "Empieza escribiendo lo que sientes."
              : "Prueba con otros filtros o palabras."}
          </p>
          {journalEntries.length === 0 && (
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
            <JournalCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
