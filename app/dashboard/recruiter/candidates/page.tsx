import { Users } from "lucide-react"

import { DashboardPlaceholder } from "@/app/components/dashboard-placeholder"

export default function CandidatesPage() {
  return (
    <DashboardPlaceholder
      title="Candidates"
      icon={Users}
      description="Top candidates and a shortlisted pipeline will live here. This section is under construction."
      actionHref="/dashboard/recruiter/jobs/new"
      actionLabel="Post a Job"
    />
  )
}
