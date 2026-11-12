/**
 * Presentation helpers shared by the public job pages (browse + details).
 * Everything here works on plain values coming out of the jobs collection.
 */

export type JobLike = {
  title?: string
  company?: string
  category?: string
  jobType?: string
  remoteAllowed?: boolean
  location?: string
  deadline?: Date | string | null
  minSalary?: number | null
  maxSalary?: number | null
  salaryFrequency?: string
  responsibilities?: string
  qualifications?: string
  createdAt?: Date | string
}

const compact = (value: number) => {
  if (value >= 1000) {
    const k = Math.round((value / 1000) * 10) / 10
    return `${Number.isInteger(k) ? k : k.toFixed(1)}k`
  }
  return `${value}`
}

/** "$140k - $180k" style salary label, or null when no salary data exists. */
export function formatSalary(min?: number | null, max?: number | null) {
  if (min == null && max == null) return null
  if (min != null && max != null && min !== max) {
    return `$${compact(min)} - $${compact(max)}`
  }
  return `$${compact((min ?? max) as number)}`
}

/** Split a multiline textarea field into clean bullet lines. */
export function splitLines(text?: string | null) {
  if (!text) return []
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean)
}

/** 1200 -> "1.2k", 432 -> "432" */
export function formatCount(value: number) {
  if (value >= 1000) return `${Math.round((value / 1000) * 10) / 10}k`
  return `${value}`
}

/** "Full-Time" -> "Full-time" */
export function prettyJobType(value?: string | null) {
  if (!value) return "Other"
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
}

const DAY = 24 * 60 * 60 * 1000

/** Posted within the last 7 days -> show the "Hot Job" badge. */
export function isHotJob(job: JobLike) {
  if (!job.createdAt) return false
  const posted = new Date(job.createdAt)
  if (Number.isNaN(posted.getTime())) return false
  return Date.now() - posted.getTime() <= 7 * DAY
}

/** Open deadline far enough away -> show the "Easy Apply" badge. */
export function hasEasyApply(job: JobLike) {
  if (isHotJob(job)) return false
  if (!job.deadline) return true
  const deadline = new Date(job.deadline)
  if (Number.isNaN(deadline.getTime())) return true
  return deadline.getTime() - Date.now() > 14 * DAY
}

export function formatDeadline(date?: Date | string | null) {
  if (!date) return null
  const value = new Date(date)
  if (Number.isNaN(value.getTime())) return null
  return value.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const GRADIENTS = [
  "from-[#5c53fe] to-[#8b7cff]",
  "from-[#0e8a6d] to-[#34c99a]",
  "from-[#b0335f] to-[#f3629a]",
  "from-[#1d4ed8] to-[#38bdf8]",
  "from-[#b45309] to-[#f59e0b]",
  "from-[#4c1d95] to-[#a78bfa]",
  "from-[#155e75] to-[#22d3ee]",
]

/** Deterministic gradient tile color for a company/brand initial. */
export function logoGradient(seed?: string | null) {
  const text = seed ?? ""
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  }
  return GRADIENTS[hash % GRADIENTS.length]
}

export function companyInitial(seed?: string | null) {
  return (seed ?? "J").trim().charAt(0).toUpperCase() || "J"
}
