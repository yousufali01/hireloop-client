import { Filter } from "mongodb"

import { auth } from "@/lib/auth"
import { getJobsCollection, type JobDocument } from "@/lib/db"

const JOB_TYPES = ["Full-Time", "Part-Time", "Contract", "Internship"]
const SALARY_FREQUENCIES = [
  "Per Hour",
  "Per Day",
  "Per Week",
  "Per Month",
  "Per Year",
]

type SessionUser = { id?: string; role?: string } | undefined

/* ---------------------------- validation hub ----------------------------- */

class ValidationError extends Error {}

const asTrimmed = (value: unknown, field: string, max: number) => {
  if (typeof value !== "string" || value.trim() === "") {
    throw new ValidationError(`${field} is required.`)
  }
  if (value.trim().length > max) {
    throw new ValidationError(`${field} must be ${max} characters or fewer.`)
  }
  return value.trim()
}

const asOptionalTrimmed = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : ""

const asChoice = (value: unknown, allowed: string[], field: string) => {
  if (typeof value !== "string" || !allowed.includes(value)) {
    throw new ValidationError(`${field} must be one of: ${allowed.join(", ")}.`)
  }
  return value
}

const asSalary = (value: unknown, field: string) => {
  if (value === undefined || value === null || value === "") return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ValidationError(`${field} must be a positive number.`)
  }
  return parsed
}

const asDeadline = (value: unknown) => {
  if (typeof value !== "string" || value === "") return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new ValidationError("Application Deadline is not a valid date.")
  }
  return date
}

const failure = (error: string, status: number) =>
  Response.json({ error }, { status })

/* ------------------------------- handlers -------------------------------- */

export async function POST(request: Request) {
  try {
    // Only signed-in recruiters (or admins) may publish listings.
    const session = await auth.api.getSession({ headers: request.headers })
    const user = session?.user as SessionUser

    if (!session || !user?.id) {
      return failure("You must be signed in to post a job.", 401)
    }
    if (user.role !== "recruiter" && user.role !== "admin") {
      return failure("Only recruiters can post jobs.", 403)
    }

    const body: Record<string, unknown> = await request
      .json()
      .catch(() => null)

    let job: JobDocument
    try {
      if (!body) throw new ValidationError("Invalid request body.")

      const title = asTrimmed(body.title, "Job Title", 120)
      const company = asTrimmed(body.company, "Company Name", 120)
      const category = asTrimmed(body.category, "Job Category", 80)
      const jobType = asChoice(body.jobType, JOB_TYPES, "Job Type")
      const deadline = asDeadline(body.deadline)
      const salaryFrequency = asChoice(
        body.salaryFrequency,
        SALARY_FREQUENCIES,
        "Salary Frequency"
      )
      const minSalary = asSalary(body.minSalary, "Minimum Salary")
      const maxSalary = asSalary(body.maxSalary, "Maximum Salary")

      const now = new Date()
      job = {
        title,
        company,
        category,
        jobType,
        remoteAllowed: body.remoteAllowed === true,
        location: asOptionalTrimmed(body.location, 120),
        deadline,
        minSalary,
        maxSalary,
        salaryFrequency,
        responsibilities: asOptionalTrimmed(body.responsibilities, 5000),
        qualifications: asOptionalTrimmed(body.qualifications, 5000),
        postedBy: user.id,
        status: "open",
        createdAt: now,
        updatedAt: now,
      }
    } catch (error) {
      if (error instanceof ValidationError) {
        return failure(error.message, 400)
      }
      throw error
    }

    const jobs = await getJobsCollection()
    const { insertedId } = await jobs.insertOne(job)

    return Response.json(
      { data: { id: insertedId.toString(), ...job } },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/jobs]", error)
    return failure("Failed to create the job. Please try again.", 500)
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const filter: Filter<JobDocument> = {}

    if (searchParams.get("mine") === "1") {
      // Recruiters fetch only their own listings.
      const session = await auth.api.getSession({ headers: request.headers })
      const user = session?.user as { id?: string } | undefined

      if (!session || !user?.id) {
        return failure("You must be signed in to view your jobs.", 401)
      }
      filter.postedBy = user.id
    } else {
      // The public board only shows open listings.
      filter.status = "open"
    }

    const jobs = await getJobsCollection()
    const data = await jobs
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    return Response.json({
      data: data.map((job) => ({
        ...job,
        _id: job._id.toString(),
      })),
    })
  } catch (error) {
    console.error("[GET /api/jobs]", error)
    return failure("Failed to load jobs. Please try again.", 500)
  }
}
