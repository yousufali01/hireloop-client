"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  MenuIcon,
  UserRound,
  XIcon,
} from "lucide-react"
import { Menu } from "@base-ui/react/menu"
import { Toast } from "@base-ui/react/toast"

import { cn } from "cn"
import { authClient } from "@/lib/auth-client"
import { getDashboardHref } from "@/lib/dashboard"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet"

const navLinks = [
  { label: "Browse Jobs", href: "/browse" },
  { label: "Company", href: "/company" },
  { label: "Pricing", href: "/pricing" },
]

// Each role lands on its own dashboard after signing in.
// Mapping lives in lib/dashboard.ts, shared with the auth flows.

const roleMeta: Record<string, { label: string; avatar: string }> = {
  seeker: {
    label: "Job Seeker",
    avatar: "from-[#5c53fe] to-[#8b7cff]",
  },
  recruiter: {
    label: "Recruiter",
    avatar: "from-[#0e8a6d] to-[#34c99a]",
  },
  admin: {
    label: "Admin",
    avatar: "from-[#b0335f] to-[#f3629a]",
  },
}

const getStartedClasses = cn(
  "border-0 bg-primary px-5 text-[15px] font-semibold text-primary-foreground",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_rgba(92,83,254,0.35)]",
  "transition-all duration-200",
  "hover:bg-[#6c63ff] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_rgba(92,83,254,0.5)]"
)

function getInitials(name?: string | null) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "U"
}

function Avatar({
  name,
  role,
  className,
  textClassName,
}: {
  name?: string | null
  role: string
  className?: string
  textClassName?: string
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white",
        roleMeta[role]?.avatar ?? roleMeta.seeker.avatar,
        className
      )}
    >
      <span className={cn("select-none", textClassName)}>
        {getInitials(name)}
      </span>
    </span>
  )
}

function NavLink({
  href,
  label,
  className,
  activeClassName,
}: {
  href: string
  label: string
  className?: string
  activeClassName?: string
}) {
  const pathname = usePathname()
  const active = pathname === href || pathname.startsWith(href + "/")
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full px-4 py-2 text-[15px] font-medium tracking-[-0.0125em] whitespace-nowrap text-[#ededef]/70 transition-all duration-200 hover:bg-white/[0.06] hover:text-white",
        active ? cn("bg-white/[0.08] font-semibold text-white", activeClassName) : null,
        className
      )}
    >
      {label}
    </Link>
  )
}

function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Hireloop home"
      className={cn("group inline-flex shrink-0 items-center", className)}
    >
      <Image
        src="/logo.png"
        alt="Hireloop"
        width={154}
        height={44}
        priority
        className="h-6 w-auto transition-opacity duration-200 group-hover:opacity-80 sm:h-7"
      />
    </Link>
  )
}

function UserMenu({
  name,
  email,
  role,
  onSignOut,
}: {
  name: string
  email: string
  role: string
  onSignOut: () => void
}) {
  const roleLabel = roleMeta[role]?.label ?? "Member"

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Open account menu"
        className="flex items-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.04] py-[5px] pr-2.5 pl-1.5 transition-colors duration-200 outline-none hover:bg-white/[0.08] focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <Avatar name={name} role={role} className="size-9" textClassName="text-xs" />
        <span className="hidden flex-col items-start leading-tight sm:flex">
          <span className="text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase">
            {roleLabel}
          </span>
          <span className="max-w-[130px] truncate text-sm font-semibold text-white">
            {name}
          </span>
        </span>
        <ChevronDown size={15} className="shrink-0 text-white/50" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner align="end" sideOffset={10} className="z-[60]">
          <Menu.Popup className="w-72 rounded-2xl border border-white/[0.08] bg-[#17161c] p-1.5 shadow-[0_24px_70px_rgba(0,0,0,0.55)] outline-none">
            <div className="px-3 pt-2.5 pb-3">
              <p className="text-xs text-white/45">Welcome,</p>
              <p className="mt-0.5 truncate text-sm font-semibold text-white">
                {name}
              </p>
              <p className="mt-0.5 truncate text-xs text-white/40">{email}</p>
            </div>

            <Menu.Separator className="mx-2 h-px bg-white/[0.06]" />

            <Menu.LinkItem
              href={getDashboardHref(role)}
              className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#ededef]/85 outline-none transition-colors hover:bg-white/[0.07] hover:text-white data-[highlighted]:bg-white/[0.07] data-[highlighted]:text-white"
            >
              <LayoutDashboard size={16} className="shrink-0 text-white/60" />
              Dashboard
            </Menu.LinkItem>

            <Menu.LinkItem
              href="/profile"
              className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#ededef]/85 outline-none transition-colors hover:bg-white/[0.07] hover:text-white data-[highlighted]:bg-white/[0.07] data-[highlighted]:text-white"
            >
              <UserRound size={16} className="shrink-0 text-white/60" />
              My Profile
            </Menu.LinkItem>

            <Menu.Item
              onClick={onSignOut}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#ededef]/85 outline-none transition-colors hover:bg-red-500/10 hover:text-red-300 data-[highlighted]:bg-red-500/10 data-[highlighted]:text-red-300"
            >
              <LogOut size={16} className="shrink-0 text-white/60" />
              Sign Out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}

export function SiteNavbar() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const { data: session, isPending } = authClient.useSession()
  const { add: addToast } = Toast.useToastManager()

  const user = session?.user
  const role = user ? ((user as { role?: string }).role ?? "seeker") : "seeker"

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    await authClient.signOut()
    setOpen(false)
    router.push("/")
    router.refresh()

    addToast({
      title: "Signed out",
      description: "You have been signed out successfully. See you soon!",
      type: "success",
    })
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      <div
        className={cn(
          "w-full transition-[background-color,border-color,box-shadow] duration-300",
          scrolled
            ? "border-b border-white/[0.06] bg-[#0a0a0f]/80 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo />

          {/* Desktop links */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 lg:flex"
          >
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href} label={link.label} />
            ))}
            {/* Role-based Dashboard link (only shows while signed in) */}
            {user ? (
              <NavLink
                href={getDashboardHref(role)}
                label="Dashboard"
                className="ml-1"
              />
            ) : null}
          </nav>

          {/* Desktop actions */}
          {isPending ? (
            <div className="hidden items-center gap-2.5 lg:flex" aria-hidden>
              <div className="size-9 animate-pulse rounded-full bg-white/[0.07]" />
              <div className="flex flex-col gap-1.5">
                <div className="h-2 w-14 animate-pulse rounded-full bg-white/[0.07]" />
                <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/[0.07]" />
              </div>
            </div>
          ) : user ? (
            <div className="hidden lg:block">
              <UserMenu
                name={user.name}
                email={user.email}
                role={role}
                onSignOut={handleSignOut}
              />
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <Button
                variant="ghost"
                nativeButton={false}
                className="h-9 rounded-lg px-4 text-[15px] font-semibold text-[#ededef] hover:bg-white/[0.08] hover:text-white"
                render={<Link href="/sign-in" />}
              >
                Sign In
              </Button>
              <Button
                nativeButton={false}
                className={getStartedClasses}
                render={<Link href="/get-started" />}
              >
                Get Started
              </Button>
            </div>
          )}

          {/* While pending show loader on mobile too */}
          {isPending ? (
            <div className="flex items-center lg:hidden" aria-hidden>
              <div className="size-9 animate-pulse rounded-full bg-white/[0.07]" />
            </div>
          ) : null}

          {/* Tablet & mobile actions (logged out) */}
          {!isPending && !user ? (
            <div className="flex items-center gap-1.5 lg:hidden">
              <Button
                variant="ghost"
                nativeButton={false}
                className="hidden h-9 rounded-lg px-3.5 text-sm font-semibold text-[#ededef] hover:bg-white/[0.08] hover:text-white sm:inline-flex"
                render={<Link href="/sign-in" />}
              >
                Sign In
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-lg text-[#ededef] hover:bg-white/[0.08] hover:text-white"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
              >
                <MenuIcon className="size-5" />
              </Button>
            </div>
          ) : null}

          {/* Tablet & mobile user trigger (logged in) */}
          {!isPending && user ? (
            <div className="lg:hidden">
              <UserMenu
                name={user.name}
                email={user.email}
                role={role}
                onSignOut={handleSignOut}
              />
            </div>
          ) : null}
        </div>
      </div>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="w-[300px] gap-0 border-l border-white/[0.08] bg-[#131218]/95 p-0 shadow-2xl backdrop-blur-xl sm:w-[340px]"
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SheetDescription className="sr-only">
            Browse Hireloop site navigation
          </SheetDescription>

          <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="size-10 rounded-lg text-[#ededef] hover:bg-white/[0.08] hover:text-white"
              aria-label="Close menu"
            >
              <XIcon className="size-5" />
            </Button>
          </div>

          <nav
            aria-label="Mobile navigation"
            className="flex flex-col gap-1 px-3 py-4"
          >
            <span className="px-3 pb-2 text-[11px] font-semibold tracking-[0.14em] text-white/40 uppercase">
              Explore
            </span>
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                className="rounded-xl px-3 py-2.5 text-base"
                activeClassName="bg-white/[0.07]"
              />
            ))}
            {/* Role-based Dashboard link (only shows while signed in) */}
            {user ? (
              <NavLink
                href={getDashboardHref(role)}
                label="Dashboard"
                className="rounded-xl px-3 py-2.5 text-base"
                activeClassName="bg-white/[0.07]"
              />
            ) : null}
          </nav>

          {/* Account section */}
          <div className="mt-auto flex flex-col gap-2.5 border-t border-white/[0.06] p-4">
            {!isPending && user ? (
              <>
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-white/[0.04] p-3">
                  <Avatar
                    name={user.name}
                    role={role}
                    className="size-11"
                    textClassName="text-sm"
                  />
                  <div className="flex min-w-0 flex-col items-start leading-tight">
                    <span className="text-[10px] font-semibold tracking-[0.12em] text-white/45 uppercase">
                      {roleMeta[role]?.label ?? "Member"}
                    </span>
                    <span className="max-w-[170px] truncate text-sm font-semibold text-white">
                      {user.name}
                    </span>
                  </div>
                </div>

                <Button
                  nativeButton={false}
                  className="h-11 w-full justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] text-base font-semibold text-white hover:bg-white/[0.09]"
                  render={<Link href="/profile" />}
                >
                  My Profile
                </Button>
                <Button
                  nativeButton={false}
                  className="h-11 w-full justify-center rounded-xl border border-red-500/25 bg-red-500/[0.08] text-base font-semibold text-red-300 hover:bg-red-500/15"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  nativeButton={false}
                  className="h-11 w-full justify-center rounded-xl border border-white/[0.12] bg-white/[0.04] text-base font-semibold text-white hover:bg-white/[0.09]"
                  render={<Link href="/sign-in" />}
                >
                  Sign In
                </Button>
                <Button
                  nativeButton={false}
                  className={cn(
                    getStartedClasses,
                    "h-11 w-full justify-center rounded-xl text-base"
                  )}
                  render={<Link href="/get-started" />}
                >
                  Get Started
                </Button>
              </>
            )}
            <p className="pt-1 text-center text-xs text-white/35">
              Find your dream job today
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
