import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { DashboardSidebar } from "../components/dashboardSideBar";


const DashboardLayout = ({children}: {children: React.ReactNode}) => {
     return (
    <SidebarProvider>
      <DashboardSidebar/>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;

