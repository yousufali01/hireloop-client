"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Toast } from "@base-ui/react/toast"
import {
  CalendarDays,
  LockKeyhole,
  LogOut,
  MapPin,
  Phone,
  ArrowRight,
  UserRound,
  Mail,
  LoaderCircle,
} from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

const roleMeta: Record<
  string,
  { label: string; badge: string; avatar: string }
> = {
  seeker: {
    label: "Job Seeker",
    badge: "border-indigo-400/25 bg-indigo-500/10 text-indigo-300",
    avatar: "from-[#5c53fe] to-[#8b7cff]",
  },
  recruiter: {
    label: "Recruiter",
    badge: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
    avatar: "from-[#0e8a6d] to-[#34c99a]",
  },
  admin: {
    label: "Admin",
    badge: "border-rose-400/25 bg-rose-500/10 text-rose-300",
    avatar: "from-[#b0335f] to-[#f3629a]",
  },
}

function getInitials(name?: string | null) {
  if (!name) return "U"
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part.charAt(0).toUpperCase()).join("") || "U"
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const { add: addToast, update: updateToast } = Toast.useToastManager()

  const user = session?.user
  const role = user ? ((user as { role?: string }).role ?? "seeker") : "seeker"
  const roleInfo = roleMeta[role] ?? roleMeta.seeker

  const [isSaving, setIsSaving] = React.useState(false)

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    const formData = new FormData(e.currentTarget)

    const name = formData.get("name")?.toString() || ""
    const phone = formData.get("phone")?.toString() || ""
    const address = formData.get("address")?.toString() || ""

    const toastId = addToast({
      title: "Saving your changes...",
      description: "Please wait a moment.",
      type: "loading",
      timeout: 0,
    })

    try {
      const { error } = await authClient.updateUser({
        name,
        fetchOptions: {
          body: {
            phone,
            address,
          },
        },
      })

      if (error) {
        updateToast(toastId, {
          type: "error",
          title: "Could not update profile",
          description:
            error.message || "Something went wrong. Please try again.",
          timeout: 5000,
        })
        return
      }

      updateToast(toastId, {
        type: "success",
        title: "Profile updated!",
        description: "Your information has been saved successfully.",
        timeout: 4000,
      })
    } catch {
      updateToast(toastId, {
        type: "error",
        title: "Could not update profile",
        description: "Network error. Please check your connection.",
        timeout: 5000,
      })
    } finally {
      setIsSaving(false)
    }
  }

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

  // Loading state
  if (isPending) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle size={30} className="animate-spin text-[#8b7cff]" />
          <p className="text-sm text-muted-foreground">Loading your profile...</p>
        </div>
      </main>
    )
  }

  // Not signed in
  if (!user) {
    return (
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
        <Card className="w-full max-w-sm">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-primary/15">
              <LockKeyhole size={24} className="text-primary" />
            </span>

            <div className="space-y-1.5">
              <h1 className="text-xl font-semibold text-foreground">
                Sign in required
              </h1>
              <p className="text-sm text-muted-foreground">
                You need to sign in to view and edit your profile.
              </p>
            </div>

            <Button
              nativeButton={false}
              className="h-10 w-full rounded-xl font-semibold"
              render={<Link href="/sign-in" />}
            >
              Sign In
              <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const createdAt = user.createdAt ? new Date(user.createdAt) : null

  return (
    <main className="relative min-h-[calc(100vh-4rem)] px-4 py-10 sm:px-6 lg:px-8">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,rgba(92,83,254,0.12),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-5xl">
        {/* Welcome header */}
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-widest text-primary uppercase">
            My account
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-white/55">Welcome back,</span>{" "}
            <span className="bg-gradient-to-r from-[#8b7cff] to-[#c0baff] bg-clip-text text-transparent">
              {user.name.split(" ")[0]}
            </span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your personal information and keep your details up to date.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Side card */}
          <Card className="h-fit">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <span
                className={cn(
                  "flex size-20 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-[0_10px_30px_rgba(92,83,254,0.25)] ring-4 ring-white/[0.05]",
                  roleInfo.avatar
                )}
              >
                <span className="select-none text-2xl">{getInitials(user.name)}</span>
              </span>

              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </div>

              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
                  roleInfo.badge
                )}
              >
                <UserRound size={12} />
                {roleInfo.label}
              </span>

              {createdAt ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays size={14} className="shrink-0" />
                  Member since{" "}
                  {createdAt.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              ) : null}

              <Button
                nativeButton={false}
                variant="destructive"
                className="mt-2 h-10 w-full rounded-xl font-semibold"
                onClick={handleSignOut}
                disabled={isSaving}
              >
                <LogOut size={16} />
                Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Edit form */}
          <Card className="h-fit">
            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    Personal information
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Update your details below. Your email cannot be changed.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Full name */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="name">Full name</Label>
                    <div className="relative">
                      <UserRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        defaultValue={user.name ?? ""}
                        placeholder="John Doe"
                        autoComplete="name"
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email (read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <div className="relative">
                      <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        value={user.email}
                        readOnly
                        disabled
                        className="h-11 pl-10 font-normal"
                      />
                      <LockKeyhole className="absolute top-1/2 right-3 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed.
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={(user as { phone?: string }).phone ?? ""}
                        placeholder="+880 1XXX-XXXXXX"
                        autoComplete="tel"
                        className="h-11 pl-10"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                      <textarea
                        id="address"
                        name="address"
                        defaultValue={(user as { address?: string }).address ?? ""}
                        placeholder="House, street, city, country"
                        rows={3}
                        className="w-full min-h-0 rounded-lg border border-input bg-transparent px-2.5 py-3 pl-10 text-base transition-colors outline-none resize-y placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 md:text-sm dark:bg-input/30"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSaving}
                  className="h-11 w-full gap-2 rounded-xl font-semibold sm:w-auto sm:px-8"
                >
                  {isSaving ? "Saving..." : "Save changes"}
                  {!isSaving && <ArrowRight size={17} />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
