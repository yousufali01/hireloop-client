"use client"

import { ArrowRight } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { getDashboardHref } from "@/lib/dashboard"

/** Sends the user to the dashboard that matches their role. */
export function GoToDashboardButton({ className }: { className?: string }) {
  const { data: session } = authClient.useSession()
  const role = session?.user
    ? ((session.user as { role?: string }).role ?? "seeker")
    : "seeker"

  return (
    <a
      href={getDashboardHref(role)}
      className={
        "mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white text-sm font-semibold text-black transition-colors hover:bg-white/90 " +
        (className ?? "")
      }
    >
      Go to Workspace Dashboard
      <ArrowRight size={16} />
    </a>
  )
}
