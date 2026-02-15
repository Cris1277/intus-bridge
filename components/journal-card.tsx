import Link from "next/link"
import type { JournalEntry } from "@/lib/types"
import { getMoodInfo } from "@/components/mood-picker"

export function JournalCard({ entry }: { entry: JournalEntry }) {
  const moodInfo = getMoodInfo(entry.mood)

  return (
    <Link
      href={`/app/journal/${entry.id}`}
      className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
          {entry.title}
        </h3>
        <span className="shrink-0 text-lg" aria-label={moodInfo.label}>
          {moodInfo.icon}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
        {entry.content}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {entry.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        {new Date(entry.createdAt).toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </Link>
  )
}
