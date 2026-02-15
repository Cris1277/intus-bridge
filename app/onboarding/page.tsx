"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { SafetyBanner } from "@/components/safety-banner";

const goals = [
  { id: "stress", label: "Reducir estres" },
  { id: "anxiety", label: "Manejar ansiedad" },
  { id: "bullying", label: "Afrontar bullying" },
  { id: "limits", label: "Mejorar limites" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 0: disclaimers
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  // Step 1: privacy
  const [localHistory, setLocalHistory] = useState(true);
  const [autoInsights, setAutoInsights] = useState(true);

  // Step 2: goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  function toggleGoal(id: string) {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  }

  function handleFinish() {
    // TODO: save preferences to backend
    router.push("/app");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <Heart className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold font-serif text-foreground">
              IntusBridge
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Paso {step + 1} de 3
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          {/* Step 0: Disclaimers */}
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-foreground">
                Antes de empezar
              </h2>
              <SafetyBanner variant="onboarding" />
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent1}
                  onChange={(e) => setConsent1(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-input accent-primary"
                />
                <span className="text-sm text-foreground leading-relaxed">
                  Entiendo que IntusBridge no sustituye a un profesional de la
                  salud mental ni proporciona diagnóstico o tratamiento.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consent2}
                  onChange={(e) => setConsent2(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-input accent-primary"
                />
                <span className="text-sm text-foreground leading-relaxed">
                  Si estoy en peligro inmediato o pienso en hacerme daño,
                  llamaré al 112 o al 024.
                </span>
              </label>
              <button
                onClick={() => setStep(1)}
                disabled={!consent1 || !consent2}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-40"
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 1: Privacy preferences */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-foreground">
                Tu privacidad importa
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Por defecto, minimizamos lo que guardamos. Tu controlas tu
                informacion.
              </p>

              <div className="flex flex-col gap-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Guardar historial
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Almacena tus entradas y check-ins
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLocalHistory(!localHistory)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      localHistory ? "bg-primary" : "bg-muted"
                    }`}
                    role="switch"
                    aria-checked={localHistory}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
                        localHistory ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Insights automaticos
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Analiza patrones en tu bienestar
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoInsights(!autoInsights)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      autoInsights ? "bg-primary" : "bg-muted"
                    }`}
                    role="switch"
                    aria-checked={autoInsights}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-transform ${
                        autoInsights ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </label>
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="flex items-center gap-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atras
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-lg font-semibold text-foreground">
                ¿En que quieres trabajar?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Selecciona los temas que te interesan. Puedes cambiar esto
                despues.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {goals.map((goal) => {
                  const selected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      className={`relative flex items-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                        selected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-card text-foreground hover:border-primary/30"
                      }`}
                    >
                      {selected && <Check className="h-4 w-4 shrink-0" />}
                      {goal.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Atras
                </button>
                <button
                  onClick={handleFinish}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
                >
                  Empezar
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
