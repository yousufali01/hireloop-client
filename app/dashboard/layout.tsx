import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { DashboardSidebar } from "../components/dashboardSideBar"

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="min-h-svh">{children}</SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout
