"use client";

import Link from "next/link";
import { Shield, GraduationCap, Briefcase, Brain, Zap } from "lucide-react";
import { scenarios } from "@/data/mock";
import type { ScenarioType } from "@/lib/types";

const typeConfig: Record<
  ScenarioType,
  { label: string; icon: typeof Shield; color: string }
> = {
  bullying_school: {
    label: "Bullying escolar",
    icon: GraduationCap,
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
  bullying_work: {
    label: "Bullying laboral",
    icon: Briefcase,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  anxiety: {
    label: "Ansiedad",
    icon: Brain,
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  stress: {
    label: "Estrés",
    icon: Zap,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

export default function ScenariosPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-serif">
          Guías y escenarios
        </h1>
        <p className="mt-1 text-muted-foreground">
          Pasos concretos para situaciones difíciles. Sin juicios, a tu ritmo.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {scenarios.map((scenario) => {
          const config = typeConfig[scenario.type];
          return (
            <Link
              key={scenario.id}
              href={`/app/scenarios/${scenario.id}`}
              className={`group flex flex-col rounded-xl border p-5 transition-all hover:shadow-md ${config.color}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <config.icon className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-wide opacity-70">
                  {config.label}
                </span>
              </div>
              <h3 className="font-semibold">{scenario.title}</h3>
              <p className="mt-1 text-sm opacity-80 leading-relaxed">
                {scenario.description}
              </p>
              <p className="mt-3 text-xs font-medium opacity-60">
                {scenario.steps.length} pasos
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
