import { Users } from "lucide-react"

import { DashboardPlaceholder } from "@/app/components/dashboard-placeholder"

export default function AdminUsersPage() {
  return (
    <DashboardPlaceholder
      title="Users"
      icon={Users}
      description="Manage job seekers, recruiters, and staff accounts from here. This section is under construction."
    />
  )
}
