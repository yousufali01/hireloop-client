"use client"

import * as React from "react"
import Link from "next/link"

import {
  Eye,
  EyeOff,
  Globe,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react"
import { Toast } from "@base-ui/react/toast"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteJob, fetchJobs, JobsApiError } from "@/lib/actions/jobs"
import type { JobWithId } from "@/lib/db"

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const typeDotClasses: Record<string, string> = {
  "Full-Time": "bg-emerald-400",
  "Part-Time": "bg-sky-400",
  Contract: "bg-amber-400",
  Internship: "bg-fuchsia-400",
}

const avatarGradients = [
  "from-[#5c53fe] to-[#8b7cff]",
  "from-[#0e8a6d] to-[#34c99a]",
  "from-[#b0335f] to-[#f3629a]",
  "from-[#b45309] to-[#f59e0b]",
  "from-[#0369a1] to-[#38bdf8]",
]

function gradientFor(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 997
  }
  return avatarGradients[hash % avatarGradients.length]
}

const formatDeadline = (value: string | Date) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

const formatPosted = (value: string | Date) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  const seconds = Math.max(0, (Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "Posted just now"
  const minutes = seconds / 60
  if (minutes < 60) return `Posted ${Math.floor(minutes)}m ago`
  const hours = minutes / 60
  if (hours < 24) return `Posted ${Math.floor(hours)}h ago`
  const days = hours / 24
  if (days < 7) return `Posted ${Math.floor(days)}d ago`
  return `Posted ${Math.floor(days / 7)}w ago`
}

const formatLocation = (job: JobWithId) =>
  job.remoteAllowed
    ? job.location
      ? `Remote (${job.location})`
      : "Remote"
    : job.location || "On-site"

const formatCompensation = (job: JobWithId) => {
  const { minSalary, maxSalary, salaryFrequency } = job
  const frequency = salaryFrequency.replace("Per ", "").toLowerCase()
  if (minSalary === null && maxSalary === null) return "—"
  if (minSalary !== null && maxSalary !== null) {
    return `${minSalary.toLocaleString()} – ${maxSalary.toLocaleString()} / ${frequency}`
  }
  if (minSalary !== null) {
    return `${minSalary.toLocaleString()}+ / ${frequency}`
  }
  return `Up to ${(maxSalary ?? 0).toLocaleString()} / ${frequency}`
}

/* -------------------------------------------------------------------------- */
/*  Shared pieces                                                             */
/* -------------------------------------------------------------------------- */

function JobAvatar({ job }: { job: JobWithId }) {
  return (
    <span
      className={`flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradientFor(job._id)} text-sm font-bold text-white`}
      aria-hidden
    >
      {job.title.charAt(0).toUpperCase()}
    </span>
  )
}

function TypeBadge({ job }: { job: JobWithId }) {
  return (
    <span className="inline-flex max-w-full items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10">
      <span
        className={`size-2 shrink-0 rounded-full ${typeDotClasses[job.jobType] ?? "bg-muted-foreground"}`}
      />
      <span className="ml-1.5 truncate text-foreground">{job.jobType}</span>
    </span>
  )
}

function StatusPill({ job }: { job: JobWithId }) {
  if (job.status !== "open") {
    return <span className="text-sm text-muted-foreground">—</span>
  }
  return (
    <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
      Active
    </span>
  )
}

function RowActions({
  job,
  isExpanded,
  onToggleDetails,
  onDelete,
}: {
  job: JobWithId
  isExpanded: boolean
  onToggleDetails: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label={isExpanded ? "Hide job details" : "View job details"}
        aria-expanded={isExpanded}
        title={isExpanded ? "Hide details" : "View details"}
        onClick={onToggleDetails}
        className="flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        {isExpanded ? (
          <EyeOff className="size-4" />
        ) : (
          <Eye className="size-4" />
        )}
      </button>
      <button
        type="button"
        aria-label="Edit job (coming soon)"
        title="Edit job (coming soon)"
        disabled
        className="flex size-8 cursor-not-allowed items-center justify-center rounded-lg text-muted-foreground/40"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        aria-label={`Delete ${job.title}`}
        title="Delete job"
        onClick={onDelete}
        className="flex size-8 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition-colors hover:bg-red-500/25 hover:text-red-300"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}

function ExpandedDetails({ job }: { job: JobWithId }) {
  return (
    <div className="rounded-lg bg-secondary/20 p-4 sm:p-5">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <h4 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Key Responsibilities
          </h4>
          <p className="mt-2 text-sm leading-6 whitespace-pre-line text-foreground/90">
            {job.responsibilities ||
              "No responsibilities listed for this position."}
          </p>

          <h4 className="mt-5 text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Qualifications &amp; Requirements
          </h4>
          <p className="mt-2 text-sm leading-6 whitespace-pre-line text-foreground/90">
            {job.qualifications ||
              "No specific requirements listed for this position."}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <Detail label="Company" value={job.company} />
          <Detail
            label="Location"
            value={`${formatLocation(job)}${job.remoteAllowed ? " · Remote work allowed" : " · On-site only"}`}
            icon={job.remoteAllowed ? <Globe className="size-4" /> : undefined}
          />
          <Detail label="Compensation" value={formatCompensation(job)} />
          <Detail
            label="Application Deadline"
            value={formatDeadline(job.deadline as Date)}
          />
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10">
              {job.jobType}
            </span>
            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10">
              {job.category}
            </span>
            <span className="inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground ring-1 ring-foreground/10">
              {formatPosted(job.createdAt as Date)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-foreground/90">
        {icon}
        {value}
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="px-4 py-14 text-center">
      <h2 className="text-lg font-semibold">No job posts yet</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Create your first listing and it will appear here, live from MongoDB.
      </p>
      <Button
        nativeButton={false}
        render={<Link href="/dashboard/recruiter/jobs/new" />}
        className="mt-5 h-10 gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-[#6c63ff]"
      >
        <Plus className="size-4" />
        New Job Post
      </Button>
    </div>
  )
}

/* Grid template: 7 columns (title, company, type, comp, status, deadline,
   actions) on lg, with an Applicants column joining on xl. */
const gridRowClasses =
  "grid items-center gap-2 px-4 py-3.5 lg:[grid-template-columns:minmax(0,2fr)_minmax(0,1.5fr)_104px_minmax(0,1.5fr)_92px_minmax(0,1.2fr)_116px] xl:[grid-template-columns:minmax(0,2fr)_minmax(0,1.4fr)_96px_minmax(0,1.5fr)_minmax(0,1fr)_84px_minmax(0,1.2fr)_116px]"

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function ManageJobPostsPage() {
  const [jobs, setJobs] = React.useState<JobWithId[]>([])
  const [status, setStatus] = React.useState<"loading" | "ready" | "error">(
    "loading"
  )
  const [errorMessage, setErrorMessage] = React.useState("")
  const [reloadKey, setReloadKey] = React.useState(0)
  const [deleteTarget, setDeleteTarget] = React.useState<JobWithId | null>(null)
  const [deleting, setDeleting] = React.useState(false)
  const [expandedId, setExpandedId] = React.useState<string | null>(null)
  const { add: addToast } = Toast.useToastManager()

  React.useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const data = await fetchJobs({ mine: true })

        if (!active) return
        setJobs(data)
        setStatus("ready")
      } catch (error) {
        if (!active) return
        setErrorMessage(
          error instanceof JobsApiError
            ? error.message
            : "Something went wrong. Please try again."
        )
        setStatus("error")
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [reloadKey])

  const retry = () => {
    setStatus("loading")
    setReloadKey((key) => key + 1)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)

    try {
      await deleteJob(deleteTarget._id)
      addToast({
        title: "Job deleted",
        description: `"${deleteTarget.title}" has been removed from MongoDB.`,
        type: "success",
      })
      setJobs((prev) => prev.filter((job) => job._id !== deleteTarget._id))
      setDeleteTarget(null)
    } catch (error) {
      addToast({
        title: "Could not delete job",
        description:
          error instanceof JobsApiError
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      })
    } finally {
      setDeleting(false)
    }
  }

  const renderError = () => (
    <div className="px-4 py-12 text-center">
      <p className="text-sm text-destructive">{errorMessage}</p>
      <Button variant="outline" size="sm" onClick={retry} className="mt-3">
        Retry
      </Button>
    </div>
  )

  const renderLoading = (count: number) => (
    <div className="divide-y divide-foreground/5">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={gridRowClasses}>
          <div className="flex items-center gap-3">
            <div className="size-9 animate-pulse rounded-lg bg-secondary/60" />
            <div className="w-full space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-secondary/60" />
              <div className="h-3 w-20 animate-pulse rounded bg-secondary/60" />
            </div>
          </div>
          <div className="h-4 w-24 animate-pulse rounded bg-secondary/60" />
          <div className="h-6 w-20 animate-pulse rounded bg-secondary/60" />
          <div className="h-4 w-28 animate-pulse rounded bg-secondary/60" />
          <div className="h-4 w-14 animate-pulse rounded bg-secondary/60" />
          <div className="h-4 w-16 animate-pulse rounded bg-secondary/60" />
          <div className="h-8 w-24 animate-pulse rounded bg-secondary/60" />
        </div>
      ))}
    </div>
  )

  return (
    <div className="relative">
      <DashboardTopbar placeholder="Search your job listings..." />

      <div className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
        {/* Header */}
        <section className="flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Manage Jobs{" "}
              <span className="mx-1 text-muted-foreground/50">/</span>
              <span className="font-medium text-foreground">
                Job Listings &amp; Postings
              </span>
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Manage Job Posts
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Review live listings, monitor applicants, and update job details
              across your organization.
            </p>
          </div>

          <Button
            nativeButton={false}
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            className="h-10 shrink-0 gap-2 self-start rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(92,83,254,0.4)] transition-all duration-200 hover:bg-[#6c63ff] sm:self-auto"
          >
            <Plus className="size-4" />
            New Job Post
          </Button>
        </section>

        {/* Listings */}
        <section className="mt-6 rounded-xl bg-card ring-1 ring-foreground/10">
          {/* Desktop: fluid grid table — no horizontal scroll */}
          <div className="hidden lg:block">
            <div className={cnGrid("border-b border-foreground/10 text-left")}>
              <div className="truncate px-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Job Title &amp; Dept
              </div>
              <div className="truncate px-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Company &amp; Location
              </div>
              <div className="truncate px-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Type
              </div>
              <div className="truncate px-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Compensation
              </div>
              <div className="hidden truncate px-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase xl:block">
                Applicants
              </div>
              <div className="truncate px-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Status
              </div>
              <div className="truncate px-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Deadline
              </div>
              <div className="px-2 text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                Actions
              </div>
            </div>

            {status === "loading" ? (
              <div className="px-0">{renderLoading(3)}</div>
            ) : null}
            {status === "error" ? renderError() : null}
            {status === "ready" && jobs.length === 0 ? <EmptyState /> : null}

            {status === "ready" && jobs.length > 0 ? (
              <div className="divide-y divide-foreground/5">
                {jobs.map((job) => {
                  const isExpanded = expandedId === job._id

                  return (
                    <div key={job._id}>
                      <div
                        className={cnGrid(
                          "transition-colors hover:bg-foreground/[0.03]"
                        )}
                      >
                        {/* Title & dept */}
                        <div className="px-2">
                          <div className="flex min-w-0 items-center gap-3">
                            <JobAvatar job={job} />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold break-words text-foreground">
                                {job.title}
                              </p>
                              <p className="text-xs break-words text-muted-foreground">
                                {job.category}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Company & location */}
                        <div className="min-w-0 px-2">
                          <p className="text-sm break-words text-foreground">
                            {job.company}
                          </p>
                          <p className="text-xs break-words text-muted-foreground">
                            {formatLocation(job)}
                          </p>
                        </div>

                        {/* Type */}
                        <div className="px-2">
                          <TypeBadge job={job} />
                        </div>

                        {/* Compensation */}
                        <div className="px-2 text-sm break-words text-foreground">
                          {formatCompensation(job)}
                        </div>

                        {/* Applicants */}
                        <div className="hidden min-w-0 px-2 xl:block">
                          <span className="inline-flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                            <UserRound className="size-3.5 shrink-0" />—
                          </span>
                        </div>

                        {/* Status */}
                        <div className="px-2">
                          <StatusPill job={job} />
                        </div>

                        {/* Deadline */}
                        <div className="min-w-0 px-2">
                          <p className="truncate text-sm text-foreground">
                            {formatDeadline(job.deadline as Date)}
                          </p>
                          <p className="truncate text-xs whitespace-nowrap text-muted-foreground">
                            {formatPosted(job.createdAt as Date)}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="px-2">
                          <RowActions
                            job={job}
                            isExpanded={isExpanded}
                            onToggleDetails={() =>
                              setExpandedId(isExpanded ? null : job._id)
                            }
                            onDelete={() => setDeleteTarget(job)}
                          />
                        </div>
                      </div>

                      {isExpanded ? (
                        <div className="px-4 pt-3 pb-4">
                          <ExpandedDetails job={job} />
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Tablet & mobile: stacked cards, zero horizontal scroll */}
          <div className="divide-y divide-foreground/5 lg:hidden">
            {status === "loading" ? renderCardsLoading() : null}
            {status === "error" ? renderError() : null}
            {status === "ready" && jobs.length === 0 ? <EmptyState /> : null}

            {status === "ready"
              ? jobs.map((job) => {
                  const isExpanded = expandedId === job._id

                  return (
                    <article key={job._id} className="p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <JobAvatar job={job} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold break-words text-foreground">
                            {job.title}
                          </p>
                          <p className="text-xs break-words text-muted-foreground">
                            {job.category}
                          </p>
                        </div>
                        <RowActions
                          job={job}
                          isExpanded={isExpanded}
                          onToggleDetails={() =>
                            setExpandedId(isExpanded ? null : job._id)
                          }
                          onDelete={() => setDeleteTarget(job)}
                        />
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Company
                          </p>
                          <p className="mt-1 break-words text-foreground">
                            {job.company}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Location
                          </p>
                          <p className="mt-1 break-words text-foreground">
                            {formatLocation(job)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Type
                          </p>
                          <div className="mt-1">
                            <TypeBadge job={job} />
                          </div>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Status
                          </p>
                          <div className="mt-1">
                            <StatusPill job={job} />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Compensation
                          </p>
                          <p className="mt-1 break-words text-foreground">
                            {formatCompensation(job)}
                          </p>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                            Deadline
                          </p>
                          <p className="mt-1 text-foreground">
                            {formatDeadline(job.deadline as Date)}
                          </p>
                        </div>
                      </div>

                      {isExpanded ? (
                        <div className="mt-4">
                          <ExpandedDetails job={job} />
                        </div>
                      ) : null}
                    </article>
                  )
                })
              : null}
          </div>
        </section>
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-red-500/10 text-red-400">
              <Trash2 className="size-5" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this job post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.title}
              </span>{" "}
              from MongoDB. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Job"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )

  function renderCardsLoading() {
    return Array.from({ length: 2 }).map((_, index) => (
      <div key={index} className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className="size-9 animate-pulse rounded-lg bg-secondary/60" />
          <div className="w-full space-y-2">
            <div className="h-4 w-32 animate-pulse rounded bg-secondary/60" />
            <div className="h-3 w-24 animate-pulse rounded bg-secondary/60" />
          </div>
          <div className="h-8 w-24 animate-pulse rounded bg-secondary/60" />
        </div>
        <div className="mt-4 grid grid-cols-2 gap-y-3">
          {[0, 1, 2, 3, 4, 5].map((cell) => (
            <div key={cell} className="space-y-2">
              <div className="h-3 w-16 animate-pulse rounded bg-secondary/60" />
              <div className="h-4 w-24 animate-pulse rounded bg-secondary/60" />
            </div>
          ))}
        </div>
      </div>
    ))
  }
}

/* Tiny helper so the arbitrary grid columns read well in one place. */
function cnGrid(extra?: string) {
  return extra ? `${gridRowClasses} ${extra}` : gridRowClasses
}
