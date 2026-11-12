"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

const SORTS = [
  { value: "recent", label: "Most Recent" },
  { value: "salary", label: "Salary: High to Low" },
  { value: "oldest", label: "Oldest First" },
]

export function SortSelect({ value }: { value: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (next: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("page")
    if (next === "recent") {
      params.delete("sort")
    } else {
      params.set("sort", next)
    }

    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="relative">
      <select
        aria-label="Sort jobs"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        className="h-9 w-[170px] cursor-pointer appearance-none rounded-lg border border-white/[0.09] bg-[#1a1a1f] pr-8 pl-3 text-sm text-white/85 outline-none transition-colors hover:border-white/20 focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        {SORTS.map((sort) => (
          <option key={sort.value} value={sort.value}>
            {sort.label}
          </option>
        ))}
      </select>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-white/40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
