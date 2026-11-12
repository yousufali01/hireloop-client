"use client"

import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code,
  CreditCard,
  Database,
  Download,
  UserRound,
  type LucideIcon,
} from "lucide-react"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ----------------------------- mock data ---------------------------------- */

type Stat = { label: string; value: string; valueClassName?: string }

const stats: Stat[] = [
  { label: "Total Applied", value: "24" },
  { label: "Shortlisted", value: "8" },
  { label: "Interviews", value: "3", valueClassName: "text-amber-500" },
  { label: "Success Rate", value: "12%", valueClassName: "text-emerald-500" },
]

type ApplicationStatus = "Applied" | "Review" | "Shortlisted" | "Rejected" | "Offered"

const statusStyles: Record<ApplicationStatus, string> = {
  Applied: "bg-secondary text-muted-foreground",
  Review: "bg-amber-500/15 text-amber-500",
  Shortlisted: "bg-blue-500/15 text-blue-400",
  Rejected: "bg-red-500/15 text-red-400",
  Offered: "bg-emerald-500/15 text-emerald-500",
}

type Application = {
  id: number
  title: string
  type: string
  company: string
  applied: string
  status: ApplicationStatus
  icon: LucideIcon
}

const applications: Application[] = [
  {
    id: 1,
    title: "Senior Frontend Engineer",
    type: "Full-time • Remote",
    company: "Stark Industries",
    applied: "2 hours ago",
    status: "Applied",
    icon: Code,
  },
  {
    id: 2,
    title: "Product Designer",
    type: "Contract • Hybrid",
    company: "Cyberdyne Systems",
    applied: "1 day ago",
    status: "Review",
    icon: UserRound,
  },
  {
    id: 3,
    title: "Lead Data Scientist",
    type: "Full-time • On-site",
    company: "Wayne Enterprises",
    applied: "4 days ago",
    status: "Shortlisted",
    icon: Database,
  },
  {
    id: 4,
    title: "Cloud Architect",
    type: "Full-time • Remote",
    company: "Oscorp Tech",
    applied: "1 week ago",
    status: "Rejected",
    icon: CreditCard,
  },
  {
    id: 5,
    title: "AI Research Engineer",
    type: "Full-time • Hybrid",
    company: "Hoiil Corp",
    applied: "2 weeks ago",
    status: "Offered",
    icon: Briefcase,
  },
]

/* ------------------------------ page ------------------------------------- */

export default function ApplicationsPage() {
  return (
    <div>
      <DashboardTopbar placeholder="Search applications..." />

      <div className="mx-auto max-w-6xl space-y-6 px-2 pt-6 pb-16 sm:px-4">
        {/* Header */}
        <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight">My Applications</h1>
            <p className="text-sm text-muted-foreground">
              Track your job applications and interview progress in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-secondary p-1">
              <button
                type="button"
                className="rounded-md bg-secondary px-3 py-1.5 text-sm font-medium text-foreground ring-1 ring-foreground/20"
              >
                Active
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Archived
              </button>
            </div>
            <Button variant="outline" size="sm" className="h-9 gap-2 px-3">
              <Download />
              Export PDF
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p
                className={cn(
                  "mt-4 text-3xl font-semibold tracking-tight",
                  stat.valueClassName
                )}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Table */}
        <section className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="px-5 py-4 font-medium">Job Title</th>
                <th className="hidden px-5 py-4 font-medium md:table-cell">Company</th>
                <th className="hidden px-5 py-4 font-medium sm:table-cell">Applied</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr
                  key={application.id}
                  className="border-t border-border/50 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <application.icon className="size-4" />
                      </div>
                      <div>
                        <p className="font-medium">{application.title}</p>
                        <p className="text-xs text-muted-foreground">{application.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">
                    {application.company}
                  </td>
                  <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                    {application.applied}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-medium",
                        statusStyles[application.status]
                      )}
                    >
                      {application.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border/50 px-5 py-4 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              Showing 1-5 of 24 applications
            </p>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
              </button>
              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg text-sm transition-colors",
                    page === 1
                      ? "bg-primary font-medium text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  )}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
