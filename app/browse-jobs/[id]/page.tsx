import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ObjectId } from "mongodb"
import {
  BadgeCheck,
  Banknote,
  Clock,
  Code,
  Globe,
  Laptop,
  MapPin,
  PiggyBank,
  Plane,
  Signal,
  Wifi,
} from "lucide-react"

import { getJobsCollection, type JobDocument } from "@/lib/db"
import { cn } from "@/lib/utils"
import {
  companyInitial,
  formatDeadline,
  formatSalary,
  logoGradient,
  prettyJobType,
  splitLines,
} from "@/lib/job-display"
import { BookmarkButton } from "@/components/browse-jobs/bookmark-button"
import { ApplyButton } from "./apply-button"

export const metadata: Metadata = { title: "Public / Job Details" }

type Props = { params: Promise<{ id: string }> }

const BENEFITS = [
  { icon: PiggyBank, label: "Full Health & Dental" },
  { icon: Globe, label: "Competitive 401k" },
  { icon: Laptop, label: "Latest Hardware Stipend" },
  { icon: Plane, label: "Unlimited PTO" },
] as const

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#141318] p-4">
      <Icon size={16} className="text-white/45" />
      <p className="mt-3 text-[10px] font-semibold tracking-[0.14em] text-white/40 uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold text-white">{children}</h2>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-white/60">
          <span className="mt-[9px] size-1.5 shrink-0 rounded-full bg-white/35" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

const jobDetailsPage = async ({ params }: Props) => {
  const { id } = await params

  if (!/^[0-9a-fA-F]{24}$/.test(id)) notFound()

  let job: (JobDocument & { _id: ObjectId }) | null = null
  try {
    const collection = await getJobsCollection()
    job = await collection.findOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("[job-details]", error)
  }

  if (!job) notFound()

  const seed = job.company || job.title
  const gradient = logoGradient(seed)
  const initial = companyInitial(seed)

  const salary = formatSalary(job.minSalary, job.maxSalary)
  const locationValue = job.remoteAllowed
    ? job.location
      ? `Remote (${job.location})`
      : "Remote"
    : job.location || "On-site"

  const annualSalary = job.salaryFrequency === "Per Year"
  const experienceValue =
    annualSalary && (job.maxSalary ?? 0) >= 120000 ? "5+ Years" : "3+ Years"

  const description = [
    `${job.company || "Our team"} is looking for a ${job.title} to join the ${job.category || "core"} team.`,
    "You will play a key role in shaping the product, collaborating with cross-functional partners to understand user needs and translate them into functional design requirements.",
    job.remoteAllowed
      ? "This is a remote-friendly role, so you can work from anywhere while staying closely connected with the team."
      : "You will work on-site and collaborate closely with the team every day.",
  ].join(" ")

  const responsibilities = splitLines(job.responsibilities)
  const requirements = splitLines(job.qualifications)

  const chips: { icon: React.ComponentType<{ size?: number }>; label: string }[] =
    [
      { icon: Code, label: job.category || "General" },
      { icon: Clock, label: prettyJobType(job.jobType) },
      {
        icon: Wifi,
        label: job.remoteAllowed ? "Remote Friendly" : "On-site",
      },
    ]

  const deadline = formatDeadline(job.deadline)

  return (
    <main className="min-h-screen bg-[#0c0c0d] pb-16">
      <div className="mx-auto w-full max-w-[1180px] px-4 pt-6 sm:px-6">
        {/* Header card */}
        <section className="rounded-2xl border border-white/[0.06] bg-[#141318] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-5">
              <div
                className={cn(
                  "flex size-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl font-bold text-white",
                  gradient
                )}
              >
                {initial}
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-white">
                  {job.title}
                </h1>
                <p className="mt-1.5 flex flex-wrap items-center gap-2 text-sm text-white/55">
                  <span className="font-medium text-white/70">
                    {job.company}
                  </span>
                  <span className="text-white/20">•</span>
                  <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                    <BadgeCheck size={15} />
                    Verified Employer
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookmarkButton />
              <ApplyButton jobId={job._id.toString()} jobTitle={job.title} />
            </div>
          </div>
        </section>

        {/* Quick facts */}
        <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <InfoCard
            icon={Banknote}
            label="Salary Range"
            value={salary ?? "Not disclosed"}
          />
          <InfoCard icon={MapPin} label="Location" value={locationValue} />
          <InfoCard
            icon={Clock}
            label="Job Type"
            value={prettyJobType(job.jobType)}
          />
          <InfoCard icon={Signal} label="Experience" value={experienceValue} />
        </div>

        <div className="mt-4 grid items-start gap-4 lg:grid-cols-[1fr_340px]">
          {/* Description column */}
          <section className="rounded-2xl border border-white/[0.06] bg-[#141318] p-7">
            <SectionHeading>Job Description</SectionHeading>
            <p className="mt-4 text-sm leading-7 text-white/60">{description}</p>

            {responsibilities.length > 0 ? (
              <>
                <hr className="my-7 border-white/[0.06]" />
                <SectionHeading>Responsibilities</SectionHeading>
                <BulletList items={responsibilities} />
              </>
            ) : null}

            <hr className="my-7 border-white/[0.06]" />

            <SectionHeading>Requirements</SectionHeading>

            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip.label}
                  className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/75"
                >
                  <chip.icon size={13} />
                  {chip.label}
                </span>
              ))}
              {deadline ? (
                <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.1] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-white/75">
                  <Clock size={13} />
                  Apply by {deadline}
                </span>
              ) : null}
            </div>

            {requirements.length > 0 ? (
              <BulletList items={requirements} />
            ) : null}

            <hr className="my-7 border-white/[0.06]" />

            <SectionHeading>Benefits</SectionHeading>

            <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit.label}
                  className="flex items-center gap-3 text-sm text-white/70"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                    <benefit.icon size={15} className="text-white/65" />
                  </span>
                  {benefit.label}
                </div>
              ))}
            </div>
          </section>

          {/* Company overview */}
          <aside className="rounded-2xl border border-white/[0.06] bg-[#141318] p-5">
            <h2 className="text-lg font-semibold text-white">
              Company Overview
            </h2>

            <div className="mt-4 overflow-hidden rounded-xl bg-gradient-to-br from-[#23242c] to-[#101013] p-6">
              <div className="mx-auto w-full max-w-[230px]">
                <div className="rounded-lg border border-white/10 bg-[#0c0c0e] p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
                  <div
                    className={cn(
                      "flex aspect-video items-center justify-center rounded-md bg-gradient-to-br",
                      gradient
                    )}
                  >
                    <span className="text-4xl font-black text-white/90">
                      {initial}
                    </span>
                  </div>
                </div>
                <div className="mx-auto h-3 w-14 rounded-b-md bg-[#1a1a1f]" />
                <div className="mx-auto h-1.5 w-24 rounded bg-[#16161a]" />
              </div>
            </div>

            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[10px] font-semibold tracking-[0.14em] text-white/40 uppercase">
                  Size
                </dt>
                <dd className="text-right text-white/80">
                  250 - 500 Employees
                </dd>
              </div>
              <hr className="border-white/[0.06]" />
              <div className="flex items-center justify-between gap-3">
                <dt className="text-[10px] font-semibold tracking-[0.14em] text-white/40 uppercase">
                  Industry
                </dt>
                <dd className="text-right text-white/80">
                  {job.category || "General"}
                </dd>
              </div>
            </dl>

            <button
              type="button"
              className="mt-6 w-full rounded-xl border border-white/[0.1] bg-white/[0.04] py-3 text-sm font-semibold text-white transition-colors hover:bg-white/[0.09]"
            >
              Visit Website
            </button>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default jobDetailsPage
