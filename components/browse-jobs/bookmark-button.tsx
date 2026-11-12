"use client"

import * as React from "react"
import { Bookmark } from "lucide-react"

import { cn } from "@/lib/utils"

/** Visual-only save toggle for job cards and the details header. */
export function BookmarkButton({ className }: { className?: string }) {
  const [saved, setSaved] = React.useState(false)

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove job from saved list" : "Save job"}
      onClick={() => setSaved((value) => !value)}
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] transition-colors hover:border-white/20 hover:bg-white/[0.06]",
        className
      )}
    >
      <Bookmark
        size={16}
        className={cn(
          "transition-colors",
          saved ? "fill-[#8b7cff] text-[#8b7cff]" : "text-white/45"
        )}
      />
    </button>
  )
}
