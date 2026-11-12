"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

export type JobTypeOption = {
  value: string
  label: string
  count: number
  checked: boolean
}

/**
 * Job type checkboxes that push filter state straight into the URL,
 * so the server component can re-run the MongoDB query.
 */
export function JobTypeFilter({ options }: { options: JobTypeOption[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = (value: string, checked: boolean) => {
    const selected = options
      .filter((option) => (option.value === value ? checked : option.checked))
      .map((option) => option.value)

    const params = new URLSearchParams(searchParams.toString())
    params.delete("page")
    if (selected.length) {
      params.set("type", selected.join(","))
    } else {
      params.delete("type")
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="mt-3 space-y-0.5">
      {options.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
        >
          <input
            type="checkbox"
            checked={option.checked}
            onChange={(event) => update(option.value, event.target.checked)}
            className="size-4 shrink-0 cursor-pointer rounded-[5px] border-white/20 bg-white/[0.06] accent-[#5c53fe]"
          />
          <span className="flex-1 text-sm text-white/70">{option.label}</span>
          <span className="text-xs tabular-nums text-white/35">
            {option.count > 0 ? option.count.toLocaleString("en-US") : ""}
          </span>
        </label>
      ))}
    </div>
  )
}

export function FiltersSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse space-y-3 px-2", className)}>
      {[0, 1, 2].map((index) => (
        <div key={index} className="h-4 rounded-full bg-white/[0.07]" />
      ))}
    </div>
  )
}
