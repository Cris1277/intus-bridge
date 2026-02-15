"use client";

import { AlertTriangle, Phone, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Variant = "onboarding" | "chat" | "resources" | "compact";

interface SafetyBannerProps {
  variant?: Variant;
  dismissable?: boolean;
  className?: string;
}

export function SafetyBanner({
  variant = "compact",
  dismissable = false,
  className,
}: SafetyBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const isExpanded = variant === "onboarding" || variant === "resources";

  return (
    <div
      className={cn(
        "relative rounded-lg border border-border bg-card p-4",
        variant === "chat" && "rounded-none border-x-0 border-t-0",
        className,
      )}
      role="alert"
    >
      {dismissable && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          aria-label="Cerrar aviso"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-foreground">
            {variant === "chat"
              ? "Respuestas generadas por IA. Usalas como apoyo, no como diagnostico."
              : "Esta app no sustituye a un profesional de la salud mental."}
          </p>
          {isExpanded && (
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              IntusBridge es una herramienta de apoyo emocional. No diagnóstica,
              no es terapia y no sustituye a un profesional. Si necesitas ayuda
              especializada, consulta con un psicólogo o psiquiatra.
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <a
              href="tel:112"
              className="inline-flex items-center gap-1.5 rounded-md bg-emergency px-3 py-1.5 text-xs font-bold text-emergency-foreground transition-colors hover:opacity-90"
            >
              <Phone className="h-3.5 w-3.5" />
              112 Emergencias
            </a>
            <a
              href="tel:024"
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground transition-colors hover:opacity-90"
            >
              <Phone className="h-3.5 w-3.5" />
              024 Atención suicida
            </a>
          </div>
          {isExpanded && (
            <p className="mt-2 text-xs text-muted-foreground">
              Si estás en peligro inmediato o piensas en hacerte daño, llama al
              112 o al 024.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
