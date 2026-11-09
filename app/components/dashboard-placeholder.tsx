import { DashboardTopbar } from "@/app/components/dashboard-topbar"
import { Button } from "@/components/ui/button"
import type { LucideIcon } from "lucide-react"

type DashboardPlaceholderProps = {
  title: string
  icon: LucideIcon
  description: string
  actionHref?: string
  actionLabel?: string
}

/**
 * Shared "coming soon" screen so no sidebar link lands on a 404.
 */
export function DashboardPlaceholder({
  title,
  icon: Icon,
  description,
  actionHref,
  actionLabel,
}: DashboardPlaceholderProps) {
  return (
    <div className="relative">
      <DashboardTopbar />

      <div className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
        <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 rounded-xl bg-card p-10 text-center ring-1 ring-foreground/10 sm:p-16">
          <div className="flex size-14 items-center justify-center rounded-full bg-secondary">
            <Icon className="size-7 text-muted-foreground" />
          </div>

          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {title}
          </h1>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          {actionHref && actionLabel ? (
            <Button
              nativeButton={false}
              render={<a href={actionHref} />}
              className="mt-3 h-10 rounded-xl bg-primary px-5 font-semibold text-primary-foreground hover:bg-[#6c63ff]"
            >
              {actionLabel}
            </Button>
          ) : null}
        </section>
      </div>
    </div>
  )
}
