import { MongoClient } from "mongodb"

/**
 * Shared Mongo client for app data (jobs, etc.).
 * Auth uses its own adapter instance in lib/auth.ts.
 */

const uri = process.env.BETTER_AUTH_DB_URI

if (!uri) {
  throw new Error("BETTER_AUTH_DB_URI is missing in .env")
}

const globalForMongo = globalThis as unknown as {
  mongoClientPromise?: Promise<MongoClient>
}

const clientPromise =
  globalForMongo.mongoClientPromise ??
  new MongoClient(uri, { serverSelectionTimeoutMS: 15000 }).connect()

globalForMongo.mongoClientPromise = clientPromise

export default clientPromise

export const APP_DB_NAME = "hireloop"

/* ------------------------------ data model ------------------------------- */

export type JobDocument = {
  title: string
  company: string
  category: string
  jobType: string
  remoteAllowed: boolean
  location: string
  deadline: Date | null
  minSalary: number | null
  maxSalary: number | null
  salaryFrequency: string
  responsibilities: string
  qualifications: string
  postedBy: string
  status: "open" | "closed"
  createdAt: Date
  updatedAt: Date
}

export type JobWithId = JobDocument & { _id: string }

export async function getJobsCollection() {
  const client = await clientPromise
  return client.db(APP_DB_NAME).collection<JobDocument>("jobs")
}
