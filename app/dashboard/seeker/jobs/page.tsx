"use client"

import { MapPin, Wallet, type LucideIcon } from "lucide-react"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"

type Job = {
  id: number
  title: string
  company: string
  type: string
  location: string
  salary: string
  icon: LucideIcon
}

const jobs: Job[] = [
  {
    id: 1,
    title: "Senior Product Designer",
    company: "TechFlow",
    type: "Full-time",
    location: "San Francisco, CA (Hybrid)",
    salary: "$160k - $200k",
    icon: MapPin,
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "Vercel",
    type: "Full-time",
    location: "Remote, Global",
    salary: "$140k - $180k",
    icon: Wallet,
  },
]

export default function SeekerJobsPage() {
  return (
    <div className="space-y-6">
      <DashboardTopbar placeholder="Search jobs, companies, or skills..." />

      <div className="mx-auto max-w-6xl space-y-6 px-2 pt-6 pb-16 sm:px-4">
        <section className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Browse Jobs</h1>
          <p className="text-sm text-muted-foreground">
            Discover opportunities matched to your profile.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10"
            >
              <div>
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-muted-foreground">{job.company}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-md bg-secondary px-2 py-1">{job.type}</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                  <MapPin className="size-3" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                  <Wallet className="size-3" />
                  {job.salary}
                </span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
