"use client";

import { use, useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Check, RotateCcw } from "lucide-react";
import { tools } from "@/data/mock";
import { MoodPicker } from "@/components/mood-picker";
import type { Mood } from "@/lib/types";

export default function ToolDetailPage({
  params,
}: {
  params: Promise<{ toolId: string }>;
}) {
  const { toolId } = use(params);
  const tool = tools.find((t) => t.id === toolId);

  const [currentStep, setCurrentStep] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [feedbackMood, setFeedbackMood] = useState<Mood | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = tool ? tool.durationMin * 60 : 0;

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= totalSeconds) {
            stopTimer();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, totalSeconds, stopTimer]);

  if (!tool) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link
          href="/app/tools"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a herramientas
        </Link>
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-sm font-medium text-foreground">
            Herramienta no encontrada
          </p>
        </div>
      </div>
    );
  }

  const progress = Math.min((seconds / totalSeconds) * 100, 100);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  if (finished) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3">
            <Check className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground font-serif">
            Bien hecho
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Has completado {'"'}
            {tool.title}
            {'"'}. ¿Cómo te sientes ahora?
          </p>
          <div className="mt-6">
            <MoodPicker
              value={feedbackMood}
              onChange={setFeedbackMood}
              size="sm"
            />
          </div>
          <div className="mt-6 flex gap-3">
            <Link
              href="/app/tools"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Volver a herramientas
            </Link>
            <Link
              href="/app"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/app/tools"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a herramientas
      </Link>

      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-xl font-bold text-card-foreground font-serif">
          {tool.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
          {tool.description}
        </p>

        {/* Timer */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative h-32 w-32">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="hsl(var(--muted))"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground tabular-nums">
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              {timerRunning ? (
                <>
                  <Pause className="h-4 w-4" /> Pausar
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />{" "}
                  {seconds > 0 ? "Continuar" : "Empezar"}
                </>
              )}
            </button>
            {seconds > 0 && (
              <button
                onClick={() => {
                  stopTimer();
                  setSeconds(0);
                  setCurrentStep(0);
                }}
                className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="mt-8">
          <h2 className="mb-4 text-sm font-medium text-card-foreground">
            Pasos
          </h2>
          <ol className="flex flex-col gap-3">
            {tool.steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(i)}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    i <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < currentStep ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </button>
                <p
                  className={`text-sm leading-relaxed ${
                    i === currentStep
                      ? "font-medium text-card-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>

        {/* Next / Finish */}
        <div className="mt-6 flex gap-3">
          {currentStep < tool.steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Siguiente paso
            </button>
          ) : (
            <button
              onClick={() => {
                stopTimer();
                setFinished(true);
              }}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              He terminado
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
