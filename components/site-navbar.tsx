"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon, XIcon } from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
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

const innerHighlight =
  "shadow-[inset_0_3px_10px_rgba(255,255,255,0.2),inset_0_0_0_1px_rgba(9,10,21,0.1)]"

const getStartedClasses = cn(
  "h-9 rounded-lg bg-primary px-4 text-[17px] font-medium text-primary-foreground hover:bg-primary/90",
  innerHighlight
)

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
        "text-base tracking-[-0.0125em] whitespace-nowrap text-[#ededef] transition-colors hover:text-white",
        active ? cn("font-bold", activeClassName) : "font-normal",
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
      className={cn("inline-flex shrink-0 items-center", className)}
    >
      <Image
        src="/logo.png"
        alt="Hireloop"
        width={154}
        height={44}
        priority
        className="h-10 w-auto lg:h-11"
      />
    </Link>
  )
}

export function SiteNavbar() {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4">
        <Logo />

        {/* Desktop pill */}
        <nav
          aria-label="Main navigation"
          className="hidden h-[68px] items-center gap-6 rounded-lg border border-white/[0.07] bg-card px-6 lg:flex"
        >
          <div className="flex items-center gap-5">
            {navLinks.map((link) => (
              <NavLink key={link.label} href={link.href} label={link.label} />
            ))}
          </div>
          <Separator
            orientation="vertical"
            className="h-6 self-center bg-[#a8a8a8]/40"
          />
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              nativeButton={false}
              className="h-9 px-4 text-[17px] font-semibold text-[#645bff] hover:bg-[#645bff]/10 hover:text-[#7a71ff]"
              render={<Link href="/signin" />}
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
        </nav>

        {/* Mobile pill */}
        <div className="flex h-16 items-center gap-1 rounded-lg border border-white/[0.07] bg-card px-3 py-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-[#ededef] hover:bg-[#2a2a31] hover:text-white"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-72 gap-0 border-l border-white/[0.07] bg-[#1a1a1f] shadow-2xl sm:w-72"
          showCloseButton={false}
        >
          <SheetTitle className="sr-only">Navigation menu</SheetTitle>
          <SheetDescription className="sr-only">
            Browse Hireloop site navigation
          </SheetDescription>
          <div className="flex items-center justify-between px-4 pt-4">
            <Logo className="h-10" />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="text-[#ededef] hover:bg-[#2a2a31] hover:text-white"
              aria-label="Close menu"
            >
              <XIcon />
            </Button>
          </div>
          <nav
            aria-label="Main navigation"
            className="flex flex-col gap-1 px-3 pt-6"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                className="rounded-md px-3 py-2.5 text-[17px] font-normal hover:bg-[#2a2a31]"
                activeClassName="bg-[#232329] font-bold"
              />
            ))}
          </nav>
          <Separator className="mx-3 mt-4 bg-[#a8a8a8]/20" />
          <div className="flex flex-col gap-2 p-4">
            <Button
              variant="ghost"
              nativeButton={false}
              className="h-10 w-full justify-center text-[17px] font-semibold text-[#645bff] hover:bg-[#645bff]/10 hover:text-[#7a71ff]"
              render={<Link href="/signin" />}
            >
              Sign In
            </Button>
            <Button
              nativeButton={false}
              className={cn(getStartedClasses, "h-10 w-full justify-center")}
              render={<Link href="/get-started" />}
            >
              Get Started
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  )
}
