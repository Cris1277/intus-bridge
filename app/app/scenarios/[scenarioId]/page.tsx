"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Users } from "lucide-react";
import { scenarios } from "@/data/mock";

export default function ScenarioDetailPage({
  params,
}: {
  params: Promise<{ scenarioId: string }>;
}) {
  const { scenarioId } = use(params);
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const [completed, setCompleted] = useState<number[]>([]);

  if (!scenario) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          href="/app/scenarios"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a guías
        </Link>
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            Guía no encontrada
          </p>
        </div>
      </div>
    );
  }

  function toggleStep(i: number) {
    setCompleted((prev) =>
      prev.includes(i) ? prev.filter((s) => s !== i) : [...prev, i],
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/app/scenarios"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a guías
      </Link>

      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-xl font-bold text-card-foreground font-serif">
          {scenario.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {scenario.description}
        </p>

        {/* Steps */}
        <div className="mt-6">
          <h2 className="mb-4 text-sm font-semibold text-card-foreground">
            Plan de acción
          </h2>
          <ol className="flex flex-col gap-3">
            {scenario.steps.map((step, i) => {
              const isDone = completed.includes(i);
              return (
                <li key={i} className="flex items-start gap-3">
                  <button
                    onClick={() => toggleStep(i)}
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      isDone
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/50"
                    }`}
                    aria-label={
                      isDone
                        ? "Marcar como pendiente"
                        : "Marcar como completado"
                    }
                  >
                    {isDone && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <p
                    className={`text-sm leading-relaxed ${
                      isDone
                        ? "text-muted-foreground line-through"
                        : "text-card-foreground"
                    }`}
                  >
                    {step}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-lg bg-primary/5 p-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-card-foreground">
              Hablar con alguien de confianza
            </p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Si necesitas apoyo, busca a una persona de confianza o consulta
            nuestros recursos de ayuda.
          </p>
          <Link
            href="/app/resources"
            className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Ver recursos
          </Link>
        </div>
      </div>
    </div>
  );
}
