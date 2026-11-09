import { Settings } from "lucide-react"

import { DashboardPlaceholder } from "@/app/components/dashboard-placeholder"

export default function RecruiterSettingsPage() {
  return (
    <DashboardPlaceholder
      title="Settings"
      icon={Settings}
      description="Manage your recruiter profile, company details, and notification preferences here. This section is under construction."
      actionHref="/profile"
      actionLabel="My Profile"
    />
  )
}
