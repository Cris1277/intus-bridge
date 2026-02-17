"use client";

import React from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  BookOpen,
  Wind,
  Shield,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { getMoodInfo } from "@/components/mood-picker";

type Mood = "calm" | "ok" | "stressed" | "anxious" | "sad" | "angry";

type CheckIn = {
  id: string;
  userId: string;
  mood: Mood;
  stressLevel: number;
  energyLevel: number;
  createdAt: string;
};

const quickActions = [
  {
    href: "/app/check-in",
    icon: ClipboardCheck,
    label: "Check-in rapido",
    description: "¿Cómo estás hoy?",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    href: "/app/journal/new",
    icon: BookOpen,
    label: "Escribir en el diario",
    description: "Pon en palabras lo que sientes",
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    href: "/app/tools",
    icon: Wind,
    label: "Herramienta rápida",
    description: "2 minutos de calma",
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    href: "/app/scenarios",
    icon: Shield,
    label: "Guía: bullying",
    description: "Pasos concretos para actuar",
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
];

export default function AppHomePage() {
  const [weekCheckIns, setWeekCheckIns] = React.useState<CheckIn[]>([]);
  const [loading, setLoading] = React.useState(true);

  const maxStress = 10;

  React.useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        // Traemos 14 por seguridad y luego mostramos 7 (últimos)
        const res = await fetch("/api/checkins?days=14", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: CheckIn[] = await res.json();

        // Nos quedamos con los últimos 7 por fecha (el endpoint ya viene asc)
        const last7 = data.slice(-7);

        if (!cancelled) setWeekCheckIns(last7);
      } catch (e) {
        console.error("Failed to load checkins", e);
        if (!cancelled) setWeekCheckIns([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-serif">
          ¿Cómo te encuentras hoy?
        </h1>
        <p className="mt-1 text-muted-foreground">
          No hay prisa. Elige lo que necesites ahora mismo.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md ${action.color}`}
          >
            <div className="rounded-lg bg-card/80 p-2.5">
              <action.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{action.label}</p>
              <p className="mt-0.5 text-sm opacity-80">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Weekly progress */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-foreground">
          Tu semana
        </h2>

        <div className="rounded-xl border border-border bg-card p-6">
          {loading ? (
            <div className="text-sm text-muted-foreground">
              Cargando check-ins…
            </div>
          ) : weekCheckIns.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              Aún no hay check-ins esta semana. Haz tu primer check-in 😊
            </div>
          ) : (
            <>
              <div className="flex items-end gap-3">
                {/* IMPORTANTE: NO mutar state con reverse() */}
                {[...weekCheckIns].reverse().map((ci) => {
                  const moodInfo = getMoodInfo(ci.mood);
                  const height = (ci.stressLevel / maxStress) * 100;

                  return (
                    <div
                      key={ci.id}
                      className="flex flex-1 flex-col items-center gap-2"
                    >
                      <span className="text-xs text-muted-foreground">
                        {moodInfo.icon}
                      </span>

                      <div
                        className="relative w-full overflow-hidden rounded-t-md bg-muted"
                        style={{ height: "100px" }}
                      >
                        <div
                          className="absolute bottom-0 w-full rounded-t-md bg-primary/60 transition-all"
                          style={{ height: `${height}%` }}
                        />
                      </div>

                      <span className="text-xs text-muted-foreground">
                        {new Date(ci.createdAt).toLocaleDateString("es-ES", {
                          weekday: "short",
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <TrendingDown className="h-3.5 w-3.5" /> Menos estrés
                </span>
                <span className="flex items-center gap-1">
                  Más estrés <TrendingUp className="h-3.5 w-3.5" />
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
