import { Settings } from "lucide-react"

import { DashboardPlaceholder } from "@/app/components/dashboard-placeholder"

export default function AdminSettingsPage() {
  return (
    <DashboardPlaceholder
      title="Settings"
      icon={Settings}
      description="Configure platform-wide settings, roles, and permissions here. This section is under construction."
    />
  )
}
