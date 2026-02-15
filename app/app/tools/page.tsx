"use client";

import Link from "next/link";
import {
  Wind,
  Anchor,
  RefreshCw,
  MessageSquareHeart,
  Clock,
} from "lucide-react";
import { tools } from "@/data/mock";
import type { ToolType } from "@/lib/types";

const typeConfig: Record<
  ToolType,
  { label: string; icon: typeof Wind; color: string }
> = {
  breathing: {
    label: "Respiración",
    icon: Wind,
    color: "bg-sky-50 text-sky-700 border-sky-200",
  },
  grounding: {
    label: "Grounding",
    icon: Anchor,
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  reframe: {
    label: "Reencuadre",
    icon: RefreshCw,
    color: "bg-amber-50 text-amber-700 border-amber-200",
  },
  selftalk: {
    label: "Diálogo interno",
    icon: MessageSquareHeart,
    color: "bg-rose-50 text-rose-700 border-rose-200",
  },
};

const categories: ToolType[] = [
  "breathing",
  "grounding",
  "reframe",
  "selftalk",
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground font-serif">
          Herramientas de calma
        </h1>
        <p className="mt-1 text-muted-foreground">
          Técnicas rápidas para cuando necesitas un momento de paz.
        </p>
      </div>

      {categories.map((type) => {
        const config = typeConfig[type];
        const typeTools = tools.filter((t) => t.type === type);
        if (typeTools.length === 0) return null;

        return (
          <section key={type} className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <config.icon className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">
                {config.label}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {typeTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/app/tools/${tool.id}`}
                  className={`group flex flex-col rounded-xl border p-5 transition-all hover:shadow-md ${config.color}`}
                >
                  <h3 className="font-semibold">{tool.title}</h3>
                  <p className="mt-1 text-sm opacity-80 leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium opacity-70">
                    <Clock className="h-3.5 w-3.5" />
                    {tool.durationMin} min
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
