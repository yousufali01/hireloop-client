"use client"

import { useRouter } from "next/navigation"
import { Toast } from "@base-ui/react/toast"

import { Button } from "@/components/ui/button"

/**
 * "Apply Now" button on the job details header.
 * Sends the user to sign-in with a redirect back to this job,
 * so they land on the same page after logging in.
 */
export function ApplyButton({
  jobId,
  jobTitle,
}: {
  jobId: string
  jobTitle: string
}) {
  const router = useRouter()
  const { add: addToast } = Toast.useToastManager()

  return (
    <Button
      size="lg"
      className="h-10 rounded-xl bg-white px-6 text-sm font-semibold text-black hover:bg-white/90"
      onClick={() => {
        addToast({
          title: "Sign in to apply",
          description: `Sign in to continue your application for ${jobTitle}.`,
          type: "success",
        })
        router.push(`/sign-in?redirect=/browse-jobs/${jobId}`)
      }}
    >
      Apply Now
    </Button>
  )
}
