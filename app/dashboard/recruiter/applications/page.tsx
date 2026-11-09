import { ClipboardList } from "lucide-react"

import { DashboardPlaceholder } from "@/app/components/dashboard-placeholder"

export default function RecruiterApplicationsPage() {
  return (
    <DashboardPlaceholder
      title="Applications"
      icon={ClipboardList}
      description="Every application submitted against your job listings will appear here. This section is under construction."
      actionHref="/dashboard/recruiter/jobs/new"
      actionLabel="Post a Job"
    />
  )
}
