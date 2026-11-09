"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  BadgeCheck,
  Bookmark,
  Briefcase,
  Building2,
  ChartNoAxesGantt,
  ClipboardList,
  CreditCard,
  FileText,
  Layers,
  LogOut,
  Settings,
  UserRound,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { authClient, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type DashboardRole = "seeker" | "recruiter" | "admin"

export type MenuItem = {
  id: string
  name: string
  url: string
  icon: LucideIcon
}

/* -------------------------------------------------------------------------- */
/*  Menu items for every role                                                 */
/* -------------------------------------------------------------------------- */

export const menuItemsByRole: Record<DashboardRole, MenuItem[]> = {
  seeker: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/seeker", icon: ChartNoAxesGantt },
    { id: "jobs", name: "Jobs", url: "/dashboard/seeker/jobs", icon: Briefcase },
    { id: "saved-jobs", name: "Saved Jobs", url: "/dashboard/seeker/saved-jobs", icon: Bookmark },
    { id: "applications", name: "Applications", url: "/dashboard/seeker/applications", icon: ClipboardList },
    { id: "billing", name: "Billing", url: "/dashboard/seeker/billing", icon: CreditCard },
    { id: "settings", name: "Settings", url: "/dashboard/seeker/settings", icon: Settings },
  ],
  recruiter: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/recruiter", icon: ChartNoAxesGantt },
    { id: "jobs", name: "My Jobs", url: "/dashboard/recruiter/jobs", icon: Briefcase },
    { id: "post-job", name: "Post a Job", url: "/dashboard/recruiter/jobs/new", icon: FileText },
    { id: "candidates", name: "Candidates", url: "/dashboard/recruiter/candidates", icon: Users },
    { id: "applications", name: "Applications", url: "/dashboard/recruiter/applications", icon: ClipboardList },
    { id: "billing", name: "Billing", url: "/dashboard/recruiter/billing", icon: Wallet },
    { id: "settings", name: "Settings", url: "/dashboard/recruiter/settings", icon: Settings },
  ],
  admin: [
    { id: "dashboard", name: "Dashboard", url: "/dashboard/admin", icon: ChartNoAxesGantt },
    { id: "users", name: "Users", url: "/dashboard/admin/users", icon: Users },
    { id: "companies", name: "Companies", url: "/dashboard/admin/companies", icon: Building2 },
    { id: "jobs", name: "Jobs", url: "/dashboard/admin/jobs", icon: Briefcase },
    { id: "reports", name: "Reports", url: "/dashboard/admin/reports", icon: Layers },
    { id: "settings", name: "Settings", url: "/dashboard/admin/settings", icon: Settings },
  ],
}

const portalConfig: Record<
  DashboardRole,
  { portal: string; badge: string; cta: { name: string; icon: LucideIcon } | null }
> = {
  seeker: { portal: "Seeker Portal", badge: "Professional Tier", cta: { name: "Post Resume", icon: FileText } },
  recruiter: { portal: "Recruiter Portal", badge: "Business Tier", cta: { name: "Post a Job", icon: FileText } },
  admin: { portal: "Admin Panel", badge: "Super Admin", cta: null },
}

/* -------------------------------------------------------------------------- */
/*  Sidebar                                                                   */
/* -------------------------------------------------------------------------- */

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  // `role` is a better-auth `user.additionalField`, but it is not part of the
  // inferred client session type yet. Cast the user object defensively.
  const sessionRole = (session?.user as { role?: string } | undefined)?.role
  const role: DashboardRole = menuItemsByRole[sessionRole as DashboardRole]
    ? (sessionRole as DashboardRole)
    : "seeker"
  const items = menuItemsByRole[role]
  const portal = portalConfig[role]

  const handleLogout = () => authClient.signOut()

  return (
    <Sidebar>
      <SidebarHeader className="gap-3">
        {/* Logo */}
        <div className="flex items-center px-2 pt-2">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="HireLoop"
              width={154}
              height={44}
              priority
              className="h-7 w-auto"
            />
          </Link>
        </div>

        {/* Profile card */}
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-2.5 ring-1 ring-sidebar-ring/40">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
            <UserRound className="size-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-sidebar-foreground">
              {session?.user?.name || portal.portal}
            </p>
            <p className="truncate text-xs text-muted-foreground">{portal.badge}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive =
                  pathname === item.url || pathname.startsWith(`${item.url}/`)

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      render={<Link href={item.url} />}
                      isActive={isActive}
                    >
                      <item.icon />
                      <span>{item.name}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-2 pb-4">
        {portal.cta ? (
          <Button className="w-full bg-white font-semibold text-black hover:bg-white/90">
            <portal.cta.icon />
            {portal.cta.name}
          </Button>
        ) : (
          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <BadgeCheck className="size-4 text-emerald-500" />
            {portal.badge}
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            "flex h-9 items-center gap-2 rounded-lg px-2 text-sm text-muted-foreground transition-colors",
            "hover:bg-sidebar-accent hover:text-sidebar-foreground"
          )}
          disabled={isPending}
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
