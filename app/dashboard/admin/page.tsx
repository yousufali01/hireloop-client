"use client"

import Link from "next/link"

import {
  ArrowRight,
  Briefcase,
  Building2,
  Layers,
  ShieldCheck,
  Users,
} from "lucide-react"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"

const adminLinks = [
  {
    title: "Users",
    description: "Manage job seekers, recruiters, and staff accounts.",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    title: "Companies",
    description: "Review and manage registered companies.",
    href: "/dashboard/admin/companies",
    icon: Building2,
  },
  {
    title: "Jobs",
    description: "Moderate every job listing across the platform.",
    href: "/dashboard/admin/jobs",
    icon: Briefcase,
  },
  {
    title: "Reports",
    description: "Platform analytics, growth reports, and audit logs.",
    href: "/dashboard/admin/reports",
    icon: Layers,
  },
]

export default function AdminDashboardPage() {
  return (
    <div className="relative">
      <DashboardTopbar />

      <div className="mx-auto max-w-6xl space-y-8 px-2 pt-6 pb-16 sm:px-4">
        {/* Header */}
        <section className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
          <div className="flex items-start gap-4">
            <span className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary sm:flex">
              <ShieldCheck className="size-6" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Admin Dashboard
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Full control over users, companies, and platform-wide job
                listings.
              </p>
            </div>
          </div>
        </section>

        {/* Management links */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Management
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            {adminLinks.map((link) => (
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
      </div>
    </div>
  )
}
