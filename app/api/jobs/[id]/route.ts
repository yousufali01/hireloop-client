import { ObjectId } from "mongodb"

import { auth } from "@/lib/auth"
import { getJobsCollection } from "@/lib/db"

type SessionUser = { id?: string; role?: string } | undefined

const isValidObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id)

const failure = (error: string, status: number) =>
  Response.json({ error }, { status })

/* ------------------------------- handlers -------------------------------- */

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!isValidObjectId(id)) return failure("Job not found.", 404)

    const jobs = await getJobsCollection()
    const job = await jobs.findOne({ _id: new ObjectId(id) })

    if (!job) return failure("Job not found.", 404)

    return Response.json({ data: { ...job, _id: job._id.toString() } })
  } catch (error) {
    console.error("[GET /api/jobs/:id]", error)
    return failure("Failed to load the job. Please try again.", 500)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Only signed-in users may act on listings.
    const session = await auth.api.getSession({ headers: request.headers })
    const user = session?.user as SessionUser

    if (!session || !user?.id) {
      return failure("You must be signed in to delete a job.", 401)
    }

    const { id } = await params

    if (!isValidObjectId(id)) return failure("Job not found.", 404)

    const jobs = await getJobsCollection()
    const job = await jobs.findOne(
      { _id: new ObjectId(id) },
      { projection: { postedBy: 1 } }
    )

    if (!job) return failure("Job not found.", 404)

    // Recruiters may only delete their own listings; admins may delete any.
    if (user.role !== "admin" && job.postedBy !== user.id) {
      return failure("You can only delete jobs you posted.", 403)
    }

    const result = await jobs.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return failure("Job not found.", 404)
    }

    return Response.json({ data: { id, deleted: true } })
  } catch (error) {
    console.error("[DELETE /api/jobs/:id]", error)
    return failure("Failed to delete the job. Please try again.", 500)
  }
}
