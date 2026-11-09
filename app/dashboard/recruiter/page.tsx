"use client"

import * as React from "react"
import Link from "next/link"

import {
  ArrowRight,
  Briefcase,
  ClipboardList,
  FileText,
  Globe,
  ListChecks,
  Plus,
  Rocket,
  Users,
} from "lucide-react"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"
import { Button } from "@/components/ui/button"
import { fetchJobs, JobsApiError } from "@/lib/actions/jobs"
import type { JobWithId } from "@/lib/db"

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function RecruiterDashboardPage() {
  const [jobs, setJobs] = React.useState<JobWithId[]>([])
  const [status, setStatus] = React.useState<"loading" | "ready">("loading")

  React.useEffect(() => {
    let active = true

    fetchJobs({ mine: true })
      .then((data) => {
        if (!active) return
        setJobs(data)
        setStatus("ready")
      })
      .catch(() => {
        if (active) setStatus("ready")
      })

    return () => {
      active = false
    }
  }, [])

  const openCount = jobs.filter((job) => job.status === "open").length
  const remoteCount = jobs.filter((job) => job.remoteAllowed).length
  const recentJobs = jobs.slice(0, 3)

  const stats = [
    {
      label: "Total Job Posts",
      value: status === "loading" ? null : jobs.length,
      icon: FileText,
    },
    {
      label: "Active Listings",
      value: status === "loading" ? null : openCount,
      icon: Briefcase,
      accent: true,
    },
    {
      label: "Remote-Friendly",
      value: status === "loading" ? null : remoteCount,
      icon: Globe,
    },
    {
      label: "Total Candidates",
      value: status === "loading" ? null : 0,
      hint: "Coming soon",
      icon: Users,
    },
  ]

  const quickLinks = [
    {
      title: "Post a New Job",
      description: "Create a listing and publish it to MongoDB.",
      href: "/dashboard/recruiter/jobs/new",
      icon: Plus,
    },
    {
      title: "Manage Job Posts",
      description: "Review, inspect, and delete your listings.",
      href: "/dashboard/recruiter/jobs",
      icon: ListChecks,
    },
    {
      title: "Candidates",
      description: "Top talent matched with your openings.",
      href: "/dashboard/recruiter/candidates",
      icon: Users,
    },
    {
      title: "Applications",
      description: "Track applications across every listing.",
      href: "/dashboard/recruiter/applications",
      icon: ClipboardList,
    },
  ]

  return (
    <div className="relative">
      <DashboardTopbar />

      <div className="mx-auto max-w-6xl space-y-8 px-2 pb-16 sm:px-4">
        {/* Header */}
        <section className="flex flex-col gap-4 rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Recruiter Dashboard
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Monitor your job posts and hiring activity at a glance.
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            className="h-10 gap-2 shrink-0 self-start rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(92,83,254,0.4)] transition-all duration-200 hover:bg-[#6c63ff] sm:self-auto"
          >
            <Rocket className="size-4" />
            New Job Post
          </Button>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
                <stat.icon
                  className={`size-5 shrink-0 ${stat.accent ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>
              {stat.value === null ? (
                <div className="mt-4 h-8 w-14 animate-pulse rounded bg-secondary/60 sm:mt-5" />
              ) : (
                <div className="mt-4 flex items-baseline gap-2">
                  <p className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    {stat.value}
                  </p>
                  {stat.hint ? (
                    <span className="text-[10px] text-muted-foreground sm:text-xs">
                      {stat.hint}
                    </span>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Quick links */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="group flex items-start gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all duration-200 hover:-translate-y-0.5 hover:ring-primary/50 sm:p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground transition-colors group-hover:bg-primary/15 group-hover:text-primary">
                  <link.icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground sm:text-base">
                      {link.title}
                    </h3>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent listings */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
              Recent Job Posts
            </h2>
            <Button
              nativeButton={false}
              render={<Link href="/dashboard/recruiter/jobs" />}
              variant="ghost"
              className="h-8 text-sm text-muted-foreground hover:text-foreground"
            >
              View All
            </Button>
          </div>

          {status === "loading" ? (
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-16 animate-pulse rounded-xl bg-card ring-1 ring-foreground/10"
                />
              ))}
            </div>
          ) : recentJobs.length === 0 ? (
            <div className="rounded-xl bg-card p-8 text-center ring-1 ring-foreground/10">
              <p className="text-sm font-medium">No job posts yet</p>
              <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
                Publish your first listing to see it live from MongoDB.
              </p>
              <Button
                nativeButton={false}
                render={<Link href="/dashboard/recruiter/jobs/new" />}
                className="mt-4 h-9 gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-[#6c63ff]"
              >
                <Plus className="size-4" />
                Post a Job
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentJobs.map((job) => (
                <Link
                  key={job._id}
                  href="/dashboard/recruiter/jobs"
                  className="flex items-center gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 transition-all duration-200 hover:ring-primary/40"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold break-words text-foreground">
                      {job.title}
                    </p>
                    <p className="text-xs break-words text-muted-foreground">
                      {job.company} · {job.jobType} ·{" "}
                      {job.remoteAllowed ? "Remote" : job.location || "On-site"}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
