"use client"

import { cn } from "@/lib/utils"
import type { Mood } from "@/lib/types"

const moods: { value: Mood; label: string; icon: string; color: string }[] = [
  { value: "calm", label: "Calma", icon: "\u{1F33F}", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { value: "ok", label: "Bien", icon: "\u{2600}\u{FE0F}", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { value: "stressed", label: "Estres", icon: "\u{26A1}", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { value: "anxious", label: "Ansiedad", icon: "\u{1F300}", color: "bg-sky-100 text-sky-800 border-sky-300" },
  { value: "sad", label: "Tristeza", icon: "\u{1F4A7}", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "angry", label: "Enfado", icon: "\u{1F525}", color: "bg-red-100 text-red-800 border-red-300" },
]

interface MoodPickerProps {
  value: Mood | null
  onChange: (mood: Mood) => void
  size?: "sm" | "md"
}

export function MoodPicker({ value, onChange, size = "md" }: MoodPickerProps) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Selecciona tu estado de animo">
      {moods.map((mood) => (
        <button
          key={mood.value}
          type="button"
          role="radio"
          aria-checked={value === mood.value}
          onClick={() => onChange(mood.value)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border-2 font-medium transition-all",
            size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
            value === mood.value
              ? cn(mood.color, "ring-2 ring-ring ring-offset-2")
              : "border-border bg-card text-muted-foreground hover:border-primary/30"
          )}
        >
          <span aria-hidden="true">{mood.icon}</span>
          {mood.label}
        </button>
      ))}
    </div>
  )
}

export function getMoodInfo(mood: Mood) {
  return moods.find((m) => m.value === mood)!
}
