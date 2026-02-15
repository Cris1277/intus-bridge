"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoodPicker } from "@/components/mood-picker";
import { saveCheckIn } from "@/lib/stubs";
import type { Mood } from "@/lib/types";
import { Check, Wind } from "lucide-react";
import Link from "next/link";

export default function CheckInPage() {
  const router = useRouter();
  const [mood, setMood] = useState<Mood | null>(null);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!mood) return;
    setLoading(true);
    await saveCheckIn({
      mood,
      stressLevel: stress,
      energyLevel: energy,
      note: note || undefined,
    });
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground font-serif">
            Gracias por registrarlo
          </h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Cada check-in es un paso hacia la claridad. ¿Quieres una herramienta
            breve ahora?
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/app/tools"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Wind className="h-4 w-4" />
              Herramienta rápida
            </Link>
            <Link
              href="/app"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground font-serif">
          ¿Como te sientes?
        </h1>
        <p className="mt-1 text-muted-foreground">
          No hay respuestas buenas ni malas. Solo tu verdad de hoy.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6"
      >
        {/* Mood */}
        <div>
          <label className="mb-3 block text-sm font-medium text-foreground">
            Estado de animo
          </label>
          <MoodPicker value={mood} onChange={setMood} />
        </div>

        {/* Stress slider */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Nivel de estres: {stress}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={stress}
            onChange={(e) => setStress(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Bajo</span>
            <span>Alto</span>
          </div>
        </div>

        {/* Energy slider */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            Nivel de energia: {energy}/10
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Bajo</span>
            <span>Alto</span>
          </div>
        </div>

        {/* Note */}
        <div>
          <label
            htmlFor="note"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Nota opcional
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="¿Algo que quieras anadir?"
            rows={3}
            className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <button
          type="submit"
          disabled={!mood || loading}
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "Guardando..." : "Registrar check-in"}
        </button>
      </form>
    </div>
  );
}
