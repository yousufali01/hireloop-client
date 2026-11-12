import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import type { Filter } from "mongodb"
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Search,
  Wifi,
  Zap,
} from "lucide-react"

import { getJobsCollection, type JobDocument, type JobWithId } from "@/lib/db"
import { cn } from "@/lib/utils"
import {
  companyInitial,
  formatSalary,
  hasEasyApply,
  isHotJob,
  logoGradient,
  prettyJobType,
} from "@/lib/job-display"
import {
  FiltersSkeleton,
  JobTypeFilter,
} from "@/components/browse-jobs/job-type-filter"
import { SortSelect } from "@/components/browse-jobs/sort-select"
import { BookmarkButton } from "@/components/browse-jobs/bookmark-button"

export const metadata: Metadata = { title: "Public / Browse Jobs" }

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"]
const PER_PAGE = 4

type SearchParams = {
  q?: string
  type?: string
  sort?: string
  page?: string
}

const SORTS: Record<string, Record<string, 1 | -1>> = {
  recent: { createdAt: -1 },
  oldest: { createdAt: 1 },
  salary: { maxSalary: -1, minSalary: -1, createdAt: -1 },
}

const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

function Pill({
  icon,
  label,
  tone = "default",
}: {
  icon: React.ReactNode
  label: string
  tone?: "default" | "green" | "amber"
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        tone === "green" &&
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
        tone === "amber" && "border-amber-500/30 bg-amber-500/10 text-amber-400",
        tone === "default" &&
          "border-white/[0.09] bg-white/[0.03] text-white/65"
      )}
    >
      {icon}
      {label}
    </span>
  )
}

function JobBadges({ job }: { job: JobWithId }) {
  const salary = formatSalary(job.minSalary, job.maxSalary)
  const hot = isHotJob(job)
  const easyApply = hasEasyApply(job)

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      {salary ? (
        <Pill icon={<Banknote size={13} />} label={salary} />
      ) : null}
      <Pill icon={<Clock size={13} />} label={prettyJobType(job.jobType)} />
      {job.remoteAllowed ? (
        <Pill icon={<Wifi size={13} />} label="Remote" />
      ) : null}
      {hot ? <Pill tone="amber" icon={<Flame size={13} />} label="Hot Job" /> : null}
      {easyApply ? (
        <Pill tone="green" icon={<Zap size={13} />} label="Easy Apply" />
      ) : null}
    </div>
  )
}

function JobCard({ job }: { job: JobWithId }) {
  const seed = job.company || job.title
  const meta = [
    job.company || "Unknown company",
    job.location,
    job.remoteAllowed ? "(Remote)" : "",
  ]
    .filter(Boolean)
    .join(" • ")

  return (
    <article className="group relative rounded-2xl border border-white/[0.06] bg-[#141318] p-6 transition-colors duration-200 hover:border-white/[0.14]">
      {/* Stretched link: the whole card opens the job details page.
          Sits above the content so every area is clickable. */}
      <Link
        href={`/browse-jobs/${job._id}`}
        aria-label={`View details for ${job.title || "this job"}`}
        className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
      />

      <div className="relative flex items-start gap-4">
        <div
          aria-hidden
          className={cn(
            "flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold text-white/90",
            logoGradient(seed)
          )}
        >
          {companyInitial(seed)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg leading-snug font-semibold text-white transition-colors group-hover:text-[#8b7cff]">
              {job.title || "Untitled Job"}
            </h2>
            <BookmarkButton className="relative z-20" />
          </div>

          <p className="mt-0.5 truncate text-sm text-white/50">{meta}</p>

          <JobBadges job={job} />
        </div>
      </div>
    </article>
  )
}

function Pagination({
  page,
  totalPages,
  buildQuery,
}: {
  page: number
  totalPages: number
  buildQuery: (overrides: Record<string, string | undefined>) => string
}) {
  if (totalPages <= 1) return null

  const wanted = new Set(
    [1, totalPages, page - 1, page, page + 1].filter(
      (value) => value >= 1 && value <= totalPages
    )
  )

  const items: (number | "gap")[] = []
  let previous = 0
  for (const value of [...wanted].sort((a, b) => a - b)) {
    if (previous && value - previous > 1) items.push("gap")
    items.push(value)
    previous = value
  }

  const arrowClasses =
    "flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-[#141318] text-white/60 transition-colors hover:border-white/20 hover:text-white"

  return (
    <nav
      aria-label="Job pages"
      className="mt-8 flex items-center justify-center gap-1.5"
    >
      {page > 1 ? (
        <Link
          href={buildQuery({ page: String(page - 1) })}
          aria-label="Previous page"
          className={arrowClasses}
        >
          <ChevronLeft size={15} />
        </Link>
      ) : (
        <span
          aria-hidden
          className={cn(arrowClasses, "pointer-events-none opacity-30")}
        >
          <ChevronLeft size={15} />
        </span>
      )}

      {items.map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className="px-1 text-xs text-white/35">
            …
          </span>
        ) : item === page ? (
          <span
            key={item}
            aria-current="page"
            className="flex size-9 items-center justify-center rounded-lg bg-white text-sm font-semibold text-black"
          >
            {item}
          </span>
        ) : (
          <Link
            key={item}
            href={buildQuery({ page: String(item) })}
            className="flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-[#141318] text-sm text-white/60 transition-colors hover:border-white/20 hover:text-white"
          >
            {item}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link
          href={buildQuery({ page: String(page + 1) })}
          aria-label="Next page"
          className={arrowClasses}
        >
          <ChevronRight size={15} />
        </Link>
      ) : (
        <span
          aria-hidden
          className={cn(arrowClasses, "pointer-events-none opacity-30")}
        >
          <ChevronRight size={15} />
        </span>
      )}
    </nav>
  )
}

const browsePage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) => {
  const filters = await searchParams

  const q = filters.q?.trim() ?? ""
  const selectedTypes = (filters.type ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter((value) => JOB_TYPES.includes(value))
  const sort =
    filters.sort === "salary" || filters.sort === "oldest"
      ? filters.sort
      : "recent"
  const page = Math.max(1, Number(filters.page) || 1)

  let jobs: JobWithId[] = []
  let total = 0
  const typeCounts: Record<string, number> = {}
  let errorMessage = ""

  try {
    const collection = await getJobsCollection()

    const filter: Filter<JobDocument> = { status: "open" }
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i")
      filter.$or = [{ title: rx }, { company: rx }, { category: rx }]
    }
    if (selectedTypes.length) {
      filter.jobType = { $in: selectedTypes }
    }

    const [rows, count, grouped] = await Promise.all([
      collection
        .find(filter)
        .sort(SORTS[sort])
        .skip((page - 1) * PER_PAGE)
        .limit(PER_PAGE)
        .toArray(),
      collection.countDocuments(filter),
      collection
        .aggregate<{ _id: string | null; count: number }>([
          { $match: { status: "open" } },
          { $group: { _id: "$jobType", count: { $sum: 1 } } },
        ])
        .toArray(),
    ])

    jobs = rows.map((row) => ({ ...row, _id: row._id.toString() }))
    total = count
    grouped.forEach((entry) => {
      if (entry._id) typeCounts[entry._id] = entry.count
    })
  } catch (error) {
    console.error("[browse-jobs]", error)
    errorMessage = "Unable to load jobs right now. Please try again."
  }

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  const buildQuery = (overrides: Record<string, string | undefined>) => {
    const merged: Record<string, string | undefined> = {
      q: q || undefined,
      type: selectedTypes.join(",") || undefined,
      sort: sort !== "recent" ? sort : undefined,
      page: String(page),
      ...overrides,
    }

    const params = new URLSearchParams()
    Object.entries(merged).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })

    const query = params.toString()
    return query ? `/browse-jobs?${query}` : "/browse-jobs"
  }

  const typeOptions = JOB_TYPES.map((value) => ({
    value,
    label: prettyJobType(value),
    count: typeCounts[value] ?? 0,
    checked: selectedTypes.includes(value),
  }))

  return (
    <main className="min-h-screen bg-[#0c0c0d] pb-16">
      <div className="mx-auto w-full max-w-[1180px] px-4 pt-6 sm:px-6">
        {/* Search bar */}
        <form
          action="/browse-jobs"
          method="GET"
          className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#141318] p-3 sm:flex-row sm:items-center sm:gap-4 sm:pl-5"
        >
          <div className="flex flex-1 items-center gap-3">
            <Search size={17} className="shrink-0 text-white/35" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by job title, keywords..."
              className="h-10 w-full min-w-0 rounded-lg bg-transparent text-[15px] text-white outline-none placeholder:text-white/35"
            />
          </div>

          {sort !== "recent" ? (
            <input type="hidden" name="sort" value={sort} />
          ) : null}
          {selectedTypes.length ? (
            <input type="hidden" name="type" value={selectedTypes.join(",")} />
          ) : null}

          <button
            type="submit"
            className="h-11 rounded-xl bg-white px-7 text-sm font-semibold text-black transition-colors hover:bg-white/90"
          >
            Search Jobs
          </button>
        </form>

        {/* Filters + results */}
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="h-fit rounded-2xl border border-white/[0.06] bg-[#141318] p-5">
            <h2 className="text-base font-semibold text-white">Filters</h2>

            <div className="mt-5">
              <p className="text-sm font-medium text-white/80">Job Type</p>
              <Suspense fallback={<FiltersSkeleton className="mt-3" />}>
                <JobTypeFilter options={typeOptions} />
              </Suspense>
            </div>
          </aside>

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-lg font-semibold text-white">
                Found {total.toLocaleString("en-US")} Professional Jobs
              </h1>

              <div className="flex items-center gap-2.5">
                <span className="text-sm text-white/45">Sort by:</span>
                <Suspense fallback={null}>
                  <SortSelect value={sort} />
                </Suspense>
              </div>
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] p-6 text-center text-sm text-red-300">
                {errorMessage}
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/[0.06] bg-[#141318] py-16 text-center">
                <h3 className="text-lg font-semibold text-white">
                  No jobs found
                </h3>
                <p className="mt-2 text-sm text-white/50">
                  Try changing your search keywords or filters.
                </p>
                <Link
                  href="/browse-jobs"
                  className="mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-[#6c63ff]"
                >
                  View All Jobs
                </Link>
              </div>
            )}

            <Pagination page={page} totalPages={totalPages} buildQuery={buildQuery} />
          </section>
        </div>
      </div>
    </main>
  )
}

export default browsePage
