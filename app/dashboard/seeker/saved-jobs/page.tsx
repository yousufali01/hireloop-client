"use client"

import {
  Boxes,
  Bookmark,
  ChevronDown,
  Clock,
  Infinity as InfinityIcon,
  Triangle,
  Upload,
  MapPin,
  Settings as SettingsIcon,
  Send,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ----------------------------- mock data ---------------------------------- */

const tabs = [
  { id: "all", name: "All Saved" },
  { id: "design", name: "Design (8)" },
  { id: "engineering", name: "Engineering (12)" },
  { id: "product", name: "Product (4)" },
]

type SavedJob = {
  id: number
  title: string
  company: string
  location: string
  salary: string
  savedAt: string
  status: "open" | "closing-soon" | "draft" | "closed"
  icon: LucideIcon
}

const savedJobs: SavedJob[] = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "TechFlow",
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k - $200k + Equity",
    savedAt: "Saved 2 hours ago",
    status: "closing-soon",
    icon: SettingsIcon,
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "Vercel",
    location: "Remote, Global",
    salary: "$140k - $180k",
    savedAt: "Saved yesterday",
    status: "open",
    icon: Triangle,
  },
  {
    id: 3,
    title: "Staff UX Researcher",
    company: "Linear",
    location: "New York, NY (On-site)",
    salary: "$180k - $220k",
    savedAt: "Saved 3 days ago",
    status: "draft",
    icon: Boxes,
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "Meta",
    location: "Menlo Park, CA (Hybrid)",
    salary: "$150k - $210k + Bonus",
    savedAt: "Saved 5 days ago",
    status: "open",
    icon: InfinityIcon,
  },
  {
    id: 5,
    title: "Design Systems Lead",
    company: "Spotify",
    location: "Remote, USA",
    salary: "",
    savedAt: "Closed yesterday",
    status: "closed",
    icon: Send,
  },
]

/* ------------------------------ page ------------------------------------- */

export default function SavedJobsPage() {
  return (
    <div>
      <DashboardTopbar
        placeholder="Search jobs, companies, or skills..."
        actions={
          <Button variant="outline" size="sm" className="mr-1 h-9 gap-2">
            <span className="text-muted-foreground">
              <Upload />
            </span>
            Upload Resume
          </Button>
        }
      />

      <div className="mx-auto max-w-6xl space-y-6 px-2 pb-16 sm:px-4">
        {/* Header */}
        <section className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">Saved Jobs</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your bookmarked opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10">
              <Bookmark className="size-6" />
              <div>
                <p className="text-xs text-muted-foreground">Total Saved</p>
                <p className="text-xl font-semibold">{savedJobs.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10">
              <Clock className="size-6 text-amber-500" />
              <div>
                <p className="text-xs text-amber-500">Closing Soon</p>
                <p className="text-xl font-semibold">3</p>
              </div>
            </div>
          </div>
        </section>

        {/* Filter bar */}
        <section className="flex flex-col gap-3 rounded-xl bg-card px-4 py-3 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-1">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
                  index === 0 && "bg-secondary font-medium text-foreground"
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Sort by:
            <select
              defaultValue="recently-saved"
              className="h-9 rounded-lg border border-input bg-secondary px-2 py-1 text-sm text-foreground outline-none"
            >
              <option value="recently-saved">Recently Saved</option>
              <option value="closing-soon">Closing Soon</option>
              <option value="salary">Salary</option>
            </select>
          </label>
        </section>

        {/* Job list */}
        <section className="space-y-4">
          {savedJobs.map((job) => (
            <article
              key={job.id}
              className={cn(
                "flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 md:flex-row md:items-center",
                job.status === "closed" && "opacity-50"
              )}
            >
              {/* Company */}
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <job.icon className="size-5" />
                </div>
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-medium">{job.title}</h3>
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                      {job.company}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {job.location}
                    </span>
                    {job.salary ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        <Wallet className="size-3" />
                        {job.salary}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Meta + actions */}
              <div className="flex items-center justify-between gap-4 md:justify-end">
                <div className="text-right">
                  <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" />
                    {job.status === "closed" ? "Closed" : job.savedAt}
                  </p>
                  {job.status === "closing-soon" ? (
                    <p className="text-xs font-medium text-amber-500">Closes in 3 days</p>
                  ) : null}
                  {job.status === "closed" ? (
                    <p className="text-xs font-medium text-red-400">Closed yesterday</p>
                  ) : null}
                </div>

                {job.status === "closed" ? (
                  <Button variant="outline" size="sm" className="h-9 border-red-500/40 text-xs text-red-400 hover:text-red-400">
                    Remove from List
                  </Button>
                ) : (
                  <>
                    <button
                      type="button"
                      aria-label="Unsave this job"
                      className="flex size-9 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary"
                    >
                      <Bookmark className="size-4" />
                    </button>
                    {job.status === "draft" ? (
                      <Button variant="outline" size="sm" className="h-9 text-xs">
                        Draft Started
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="h-9 bg-white font-semibold text-black hover:bg-white/90"
                      >
                        Apply Now
                      </Button>
                    )}
                  </>
                )}
              </div>
            </article>
          ))}
        </section>

        {/* Load more */}
        <div className="flex justify-center pt-2">
          <Button variant="ghost" className="gap-1 text-muted-foreground">
            Load More
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
