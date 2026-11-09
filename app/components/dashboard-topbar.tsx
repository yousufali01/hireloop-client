"use client"

import { BellIcon, MailIcon, SearchIcon } from "lucide-react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type DashboardTopbarProps = {
  placeholder?: string
  actions?: React.ReactNode
  className?: string
}

export function DashboardTopbar({
  placeholder = "Search for opportunities...",
  actions,
  className,
}: DashboardTopbarProps) {
  return (
    <header
      className={cn(
        "flex items-center gap-3 px-2 py-3 sm:px-4",
        className
      )}
    >
      <div className="hidden md:block">
        <SidebarTrigger />
      </div>

      <div className="relative w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="h-9 rounded-lg pl-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        {actions}

        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <MailIcon className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" />
        </button>
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <BellIcon className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-emerald-500" />
        </button>
        <div className="ml-1 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          AR
        </div>
      </div>
    </header>
  )
}
