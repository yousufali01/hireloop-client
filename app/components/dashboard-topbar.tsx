"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  BellIcon,
  ChevronDown,
  LayoutDashboardIcon,
  LogOut,
  MailIcon,
  SearchIcon,
  UserRound,
} from "lucide-react"
import { Menu } from "@base-ui/react/menu"
import { Toast } from "@base-ui/react/toast"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { authClient, useSession } from "@/lib/auth-client"
import { menuItemsByRole, type DashboardRole } from "@/app/components/dashboardSideBar"
import { getDashboardHref } from "@/lib/dashboard"
import { cn } from "@/lib/utils"

type DashboardTopbarProps = {
  placeholder?: string
  actions?: React.ReactNode
  className?: string
}

/* ------------------------------ user menu -------------------------------- */

function getInitials(name?: string | null) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "U"
}

function Avatar({ name, className, textClassName }: { name?: string | null; className?: string; textClassName?: string }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary font-semibold text-primary-foreground",
        className
      )}
      aria-hidden
    >
      <span className={cn("select-none", textClassName)}>{getInitials(name)}</span>
    </span>
  )
}

function UserMenu() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const { add: addToast } = Toast.useToastManager()
  const user = session?.user

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
    addToast({
      title: "Signed out",
      description: "You have been signed out successfully. See you soon!",
      type: "success",
    })
  }

  const portalName =
    (user as { role?: string } | undefined)?.role === "admin"
      ? "Admin Panel"
      : (user as { role?: string } | undefined)?.role === "recruiter"
        ? "Recruiter Portal"
        : "Seeker Portal"

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Open account menu"
        className="flex items-center gap-2 rounded-xl border border-border bg-card py-[5px] pr-2.5 pl-1.5 transition-colors duration-200 outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <Avatar name={user?.name} className="size-9" textClassName="text-xs" />
        <span className="hidden min-w-0 flex-col items-start leading-tight sm:flex">
          <span className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
            {isPending ? "Member" : portalName}
          </span>
          <span className="max-w-[130px] truncate text-sm font-semibold text-foreground">
            {user?.name ?? "Member"}
          </span>
        </span>
        <ChevronDown size={15} className="shrink-0 text-muted-foreground" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={10} className="z-[60]">
          <Menu.Popup className="w-72 rounded-2xl border border-border bg-popover p-1.5 shadow-2xl outline-none">
            <div className="px-3 pt-2.5 pb-3">
              <p className="text-xs text-muted-foreground">Welcome,</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-foreground">
                {user?.name ?? "Member"}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>

            <Menu.Separator className="mx-2 h-px bg-border" />

            <Menu.LinkItem
              href={getDashboardHref((user as { role?: string } | undefined)?.role)}
              className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 outline-none transition-colors hover:bg-accent hover:text-foreground data-[highlighted]:bg-accent data-[highlighted]:text-foreground"
            >
              <LayoutDashboardIcon size={16} className="shrink-0 text-muted-foreground" />
              Dashboard
            </Menu.LinkItem>

            <Menu.LinkItem
              href="/profile"
              className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 outline-none transition-colors hover:bg-accent hover:text-foreground data-[highlighted]:bg-accent data-[highlighted]:text-foreground"
            >
              <UserRound size={16} className="shrink-0 text-muted-foreground" />
              My Profile
            </Menu.LinkItem>

            <Menu.Item
              onClick={handleSignOut}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 outline-none transition-colors hover:bg-red-500/10 hover:text-red-400 data-[highlighted]:bg-red-500/10 data-[highlighted]:text-red-400"
            >
              <LogOut size={16} className="shrink-0 text-muted-foreground" />
              Sign Out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

/* -------------------------------- breadcrumb ------------------------------ */

function DashboardBreadcrumb() {
  const pathname = usePathname()
  const { data: session, isPending } = useSession()

  const sessionRole = (session?.user as { role?: string } | undefined)?.role
  const role: DashboardRole =
    sessionRole && menuItemsByRole[sessionRole as DashboardRole]
      ? (sessionRole as DashboardRole)
      : "seeker"

  const items = menuItemsByRole[role]
  const portalName = role === "admin" ? "Admin Panel" : `${role.charAt(0).toUpperCase()}${role.slice(1)} Portal`

  const current = !isPending
    ? items.find((item) => pathname === item.url || pathname.startsWith(`${item.url}/`)) ??
      items.find((item) => item.id === "dashboard")
    : null

  return (
    <nav aria-label="Dashboard navigation" className="hidden min-w-0 items-center gap-2 text-sm md:flex">
      {current ? (
        <>
          <span className="truncate text-muted-foreground">{portalName}</span>
          <span className="text-muted-foreground/50">/</span>
          <span className="truncate font-medium text-foreground">{current.name}</span>
        </>
      ) : (
        <span className="font-medium text-foreground">Dashboard</span>
      )}
    </nav>
  )
}

/* ------------------------------- topbar ----------------------------------- */

export function DashboardTopbar({
  placeholder = "Search for opportunities...",
  actions,
  className,
}: DashboardTopbarProps) {
  return (
    <header
      className={cn(
        "sticky top-16 z-40 flex items-center gap-3 border-b border-border bg-background/80 px-2 py-3 backdrop-blur-md sm:px-4",
        className
      )}
    >
      {/* Sidebar navigation — works on every screen size now */}
      <SidebarTrigger aria-label="Toggle dashboard navigation" />

      <DashboardBreadcrumb />

      <div className="relative hidden w-full max-w-sm sm:block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder={placeholder} className="h-9 rounded-lg pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-1">
        {actions}

        <button
          type="button"
          aria-label="Messages"
          className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <MailIcon className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <BellIcon className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500" />
        </button>
        <div className="ml-1">
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
