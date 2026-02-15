"use client";

import { Phone, ExternalLink, BookOpen, Printer } from "lucide-react";
import { resources } from "@/data/mock";
import { SafetyBanner } from "@/components/safety-banner";

export default function ResourcesPage() {
  const emergency = resources.filter((r) => r.type === "emergency");
  const professional = resources.filter((r) => r.type === "professional");
  const education = resources.filter((r) => r.type === "education");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground font-serif">
          Recursos y ayuda
        </h1>
        <p className="mt-1 text-muted-foreground">
          Tienes derecho a pedir ayuda. Aquí encontrarás números y recursos
          útiles.
        </p>
      </div>

      <SafetyBanner variant="resources" className="mb-8" />

      {/* Emergency */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Ayuda urgente
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {emergency.map((r) => (
            <a
              key={r.id}
              href={`tel:${r.phone}`}
              className="flex items-center gap-4 rounded-xl border-2 border-emergency/30 bg-emergency/5 p-5 transition-colors hover:border-emergency/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emergency text-emergency-foreground">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-foreground">{r.title}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
                <p className="mt-1 text-lg font-bold text-emergency">
                  {r.phone}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Professional */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Apoyo profesional
        </h2>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          Si necesitas hablar con un profesional, estos recursos pueden
          ayudarte. Recuerda: buscar ayuda es un acto de valentía.
        </p>
        <div className="flex flex-col gap-3">
          {professional.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div>
                <p className="font-semibold text-card-foreground">{r.title}</p>
                <p className="text-sm text-muted-foreground">{r.description}</p>
              </div>
              {r.phone ? (
                <a
                  href={`tel:${r.phone}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <Phone className="h-3.5 w-3.5" />
                  {r.phone}
                </a>
              ) : r.url ? (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Visitar
                </a>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Educación y límites
        </h2>
        <div className="flex flex-col gap-3">
          {education.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-start gap-3">
                <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-card-foreground">
                    {r.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {r.description}
                  </p>
                </div>
              </div>
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Leer
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={() => {
          // TODO: implement actual print / export
          window.print();
        }}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
      >
        <Printer className="h-4 w-4" />
        Imprimir / Guardar
      </button>
    </div>
  );
}
