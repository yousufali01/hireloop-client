"use client"

import {
  Bookmark,
  CalendarCheck,
  Mail,
  Medal,
  Megaphone,
  Plus,
  RefreshCw,
  Send,
  type LucideIcon,
} from "lucide-react"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"
import { cn } from "@/lib/utils"

/* ----------------------------- mock data ---------------------------------- */

type Stat = {
  label: string
  value: number
  icon: LucideIcon
  iconClassName?: string
}

const stats: Stat[] = [
  { label: "Saved Jobs", value: 12, icon: Bookmark },
  { label: "Applications Submitted", value: 24, icon: Send },
  { label: "Interviews Scheduled", value: 3, icon: CalendarCheck, iconClassName: "text-amber-500" },
  { label: "Offers Received", value: 1, icon: Medal, iconClassName: "text-emerald-500" },
]

type Activity = {
  id: number
  icon: LucideIcon
  message: string
  highlight?: string
  highlightClassName?: string
  time: string
}

const activities: Activity[] = [
  {
    id: 1,
    icon: RefreshCw,
    message: "Application for Senior Product Designer at TechFlow updated to ",
    highlight: "'Under Review'",
    highlightClassName: "text-amber-500",
    time: "2 hours ago",
  },
  {
    id: 2,
    icon: Megaphone,
    message: "New Job Alert: Lead Frontend Engineer at FinGrid matches your profile.",
    time: "5 hours ago",
  },
  {
    id: 3,
    icon: Mail,
    message: "You have a new message from Sarah Jenkins (Hiring Manager at CloudOps).",
    time: "1 day ago",
  },
  {
    id: 4,
    icon: RefreshCw,
    message: "Application for Senior Product Designer at TechFlow updated to ",
    highlight: "'Under Review'",
    highlightClassName: "text-amber-500",
    time: "2 hours ago",
  },
  {
    id: 5,
    icon: Megaphone,
    message: "New Job Alert: Lead Frontend Engineer at FinGrid matches your profile.",
    time: "5 hours ago",
  },
  {
    id: 6,
    icon: Mail,
    message: "You have a new message from Sarah Jenkins (Hiring Manager at CloudOps).",
    time: "1 day ago",
  },
]

/* ------------------------------ page ------------------------------------- */

export default function SeekerDashboardPage() {
  return (
    <div className="relative">
      <DashboardTopbar />

      <div className="mx-auto max-w-6xl space-y-8 px-2 pb-16 sm:px-4">
        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <stat.icon
                  className={cn("size-5 shrink-0 text-foreground", stat.iconClassName)}
                />
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </section>

        {/* Recent activity */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Recent Activity</h2>
            <button
              type="button"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              View All Activity
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div
                key={activity.id}
                className={cn(
                  "flex items-center gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10",
                  index > 0 && index % 3 === 0 && "mt-8"
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground">
                  <activity.icon className="size-4" />
                </div>
                <p className="text-sm leading-5">
                  {activity.message}
                  {activity.highlight ? (
                    <span className={cn("font-medium", activity.highlightClassName)}>
                      {activity.highlight}
                    </span>
                  ) : null}
                </p>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating action button */}
      <button
        type="button"
        aria-label="Quick action"
        className="fixed right-8 bottom-8 z-10 flex size-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform hover:scale-105"
      >
        <Plus className="size-6" />
      </button>
    </div>
  )
}
