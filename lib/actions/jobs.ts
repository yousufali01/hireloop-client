import type { JobWithId } from "@/lib/db"

/**
 * Client helpers for the jobs API (app/api/jobs).
 */

// Strip a trailing /api so both "http://host/api" and "http://host" work.
const BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
).replace(/\/api\/?$/, "")

export type JobFormData = {
  title: string
  company: string
  category: string
  jobType: string
  remoteAllowed: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  salaryFrequency: string
  responsibilities: string
  qualifications: string
}

export class JobsApiError extends Error {}

export async function createJob(form: JobFormData): Promise<JobWithId> {
  const response = await fetch(`${BASE_URL}/api/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  })

  const payload = (await response.json().catch(() => null)) as {
    data?: JobWithId
    error?: string
  } | null

  if (!response.ok || !payload?.data) {
    throw newJobsApiError(response.status, payload?.error)
  }

  return payload.data
}

export async function fetchJobs(options?: {
  mine?: boolean
}): Promise<JobWithId[]> {
  const query = options?.mine ? "?mine=1" : ""
  const response = await fetch(`${BASE_URL}/api/jobs${query}`, {
    // Avoid caching so new listings show up immediately.
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as {
    data?: JobWithId[]
    error?: string
  } | null

  if (!response.ok || !payload?.data) {
    throw newJobsApiError(response.status, payload?.error)
  }

  return payload.data
}

export async function deleteJob(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/jobs/${id}`, {
    method: "DELETE",
  })

  const payload = (await response.json().catch(() => null)) as {
    data?: { deleted?: boolean }
    error?: string
  } | null

  if (!response.ok || !payload?.data?.deleted) {
    throw newJobsApiError(response.status, payload?.error)
  }
}

function newJobsApiError(status: number, message?: string): JobsApiError {
  const fallback =
    status === 401
      ? "You must be signed in."
      : "Something went wrong. Please try again."
  return new JobsApiError(message || fallback)
}
