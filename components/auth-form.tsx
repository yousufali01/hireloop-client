"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import {
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
  Sparkles,
  ShieldCheck,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"

// Form Data Type
export interface AuthFormData {
  name?: string
  email: string
  password: string
  confirmPassword?: string
  termsAccepted?: boolean
  rememberMe?: boolean
  role?: "seeker" | "recruiter" | "admin"
}

// Props Type
interface AuthFormProps {
  type: "sign-up" | "sign-in"
  onSubmit?: (data: AuthFormData) => Promise<void>
}

function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-xl bg-white px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.35)] ring-1 ring-black/[0.06] ${className ?? ""}`}
    >
      <Image
        src="/logo.png"
        alt="Hireloop"
        width={154}
        height={44}
        priority
        className="h-7 w-auto"
      />
    </span>
  )
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const isSignUp = type === "sign-up"

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [termsAccepted, setTermsAccepted] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    const formData = new FormData(e.currentTarget)

    const data: AuthFormData = {
      name: formData.get("name")?.toString(),
      email: formData.get("email")?.toString() || "",
      password: formData.get("password")?.toString() || "",
      confirmPassword: formData.get("confirmPassword")?.toString(),
      termsAccepted,
      rememberMe,
      role: formData.get("role")?.toString() as
        | "seeker"
        | "recruiter"
        | "admin",
    }

    // Password Validation
    if (isSignUp && data.password !== data.confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    // Terms Validation
    if (isSignUp && !termsAccepted) {
      setError("Please accept the Terms of Service and Privacy Policy.")
      return
    }

    try {
      setIsSubmitting(true)

      if (onSubmit) {
        await onSubmit(data)
      } else {
        console.log(isSignUp ? "SIGN UP DATA:" : "SIGN IN DATA:", data)
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT BRAND SECTION */}
        <section className="relative hidden overflow-hidden bg-[#090D1B] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
          <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[130px]" />
          <div className="absolute -right-20 -bottom-40 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[130px]" />

          <Link href="/" className="relative z-10 inline-flex">
            <LogoMark />
          </Link>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              <Sparkles size={15} />
              Welcome to Hireloop
            </div>

            <h1 className="text-4xl leading-tight font-bold xl:text-6xl">
              {isSignUp ? (
                <>
                  Create your account.
                  <span className="mt-2 block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    Find work or hire talent.
                  </span>
                </>
              ) : (
                <>
                  Welcome back.
                  <span className="mt-2 block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    Your next opportunity is waiting.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-slate-400">
              {isSignUp
                ? "Join Hireloop and discover a smarter way to land your dream job or build your perfect team."
                : "Sign in to your account and continue your journey with everything right where you left it."}
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Apply to 50,000+ curated jobs",
                "Hire top talent faster",
                "Secure and reliable platform",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-400">
                    <ShieldCheck size={16} />
                  </div>
                  <span className="text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="relative z-10 text-sm text-slate-500">
            © {new Date().getFullYear()} Hireloop. All rights reserved.
          </p>
        </section>

        {/* RIGHT AUTH SECTION */}
        <section className="flex items-center justify-center px-5 py-12 sm:px-8 lg:min-h-screen lg:px-12">
          <div className="w-full max-w-[480px]">
            {/* Mobile logo */}
            <Link
              href="/"
              className="mb-10 flex justify-center lg:hidden"
              aria-label="Hireloop home"
            >
              <LogoMark />
            </Link>

            {/* Heading */}
            <div className="mb-8 space-y-2">
              <p className="text-sm font-semibold tracking-widest text-primary uppercase">
                {isSignUp ? "Get started" : "Welcome back"}
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {isSignUp ? "Create an account" : "Sign in"}
              </h2>

              <p className="text-sm leading-6 text-muted-foreground">
                {isSignUp
                  ? "Tell us a bit about yourself to get set up."
                  : "Enter your credentials to access your account."}
              </p>
            </div>

            <Card className="border-border/70 shadow-xl shadow-black/[0.03]">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="name">Full name</Label>

                      <div className="relative">
                        <UserRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          autoComplete="name"
                          className="h-11 pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Role */}
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label>I am joining as</Label>

                      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        {/* Job Seeker */}
                        <label
                          htmlFor="role-seeker"
                          className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-border/70 p-4 transition-all duration-200 hover:border-ring/50 hover:bg-muted/40 has-[input:checked]:border-primary/70 has-[input:checked]:bg-primary/[0.06] has-[input:checked]:shadow-[0_0_0_3px_rgba(92,83,254,0.12)] focus-within:ring-2 focus-within:ring-ring/60"
                        >
                          <input
                            type="radio"
                            id="role-seeker"
                            name="role"
                            value="seeker"
                            defaultChecked
                            className="sr-only"
                          />

                          <span className="flex items-center justify-between">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-has-[input:checked]:bg-primary/15 group-has-[input:checked]:text-primary">
                              <UserRound size={18} />
                            </span>

                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border transition-all duration-200 group-has-[input:checked]:border-primary group-has-[input:checked]:bg-primary">
                              <Check
                                size={12}
                                strokeWidth={3}
                                className="text-primary-foreground opacity-0 transition-opacity group-has-[input:checked]:opacity-100"
                              />
                            </span>
                          </span>

                          <span className="block">
                            <span className="block text-sm font-semibold text-foreground">
                              Job Seeker
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                              Find jobs and apply with your profile
                            </span>
                          </span>
                        </label>

                        {/* Recruiter */}
                        <label
                          htmlFor="role-recruiter"
                          className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-border/70 p-4 transition-all duration-200 hover:border-ring/50 hover:bg-muted/40 has-[input:checked]:border-primary/70 has-[input:checked]:bg-primary/[0.06] has-[input:checked]:shadow-[0_0_0_3px_rgba(92,83,254,0.12)] focus-within:ring-2 focus-within:ring-ring/60"
                        >
                          <input
                            type="radio"
                            id="role-recruiter"
                            name="role"
                            value="recruiter"
                            className="sr-only"
                          />

                          <span className="flex items-center justify-between">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-has-[input:checked]:bg-primary/15 group-has-[input:checked]:text-primary">
                              <Building2 size={18} />
                            </span>

                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border transition-all duration-200 group-has-[input:checked]:border-primary group-has-[input:checked]:bg-primary">
                              <Check
                                size={12}
                                strokeWidth={3}
                                className="text-primary-foreground opacity-0 transition-opacity group-has-[input:checked]:opacity-100"
                              />
                            </span>
                          </span>

                          <span className="block">
                            <span className="block text-sm font-semibold text-foreground">
                              Recruiter
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                              Post jobs and hire great talent
                            </span>
                          </span>
                        </label>

                        {/* Admin */}
                        <label
                          htmlFor="role-admin"
                          className="group relative flex cursor-pointer flex-col gap-3 rounded-xl border border-border/70 p-4 transition-all duration-200 hover:border-ring/50 hover:bg-muted/40 has-[input:checked]:border-primary/70 has-[input:checked]:bg-primary/[0.06] has-[input:checked]:shadow-[0_0_0_3px_rgba(92,83,254,0.12)] focus-within:ring-2 focus-within:ring-ring/60"
                        >
                          <input
                            type="radio"
                            id="role-admin"
                            name="role"
                            value="admin"
                            className="sr-only"
                          />

                          <span className="flex items-center justify-between">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-has-[input:checked]:bg-primary/15 group-has-[input:checked]:text-primary">
                              <ShieldCheck size={18} />
                            </span>

                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border transition-all duration-200 group-has-[input:checked]:border-primary group-has-[input:checked]:bg-primary">
                              <Check
                                size={12}
                                strokeWidth={3}
                                className="text-primary-foreground opacity-0 transition-opacity group-has-[input:checked]:opacity-100"
                              />
                            </span>
                          </span>

                          <span className="block">
                            <span className="block text-sm font-semibold text-foreground">
                              Admin
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                              Manage platform and users
                            </span>
                          </span>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>

                    <div className="relative">
                      <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        autoComplete="email"
                        className="h-11 pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>

                    <div className="relative">
                      <LockKeyhole className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        autoComplete={
                          isSignUp ? "new-password" : "current-password"
                        }
                        className="h-11 pr-11 pl-10"
                        minLength={8}
                        required
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  {isSignUp && (
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm password</Label>

                      <div className="relative">
                        <LockKeyhole className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                          className="h-11 pr-11 pl-10"
                          minLength={8}
                          required
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label="Toggle confirm password visibility"
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={17} />
                          ) : (
                            <Eye size={17} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Remember me */}
                  {!isSignUp && (
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="rememberMe"
                          name="rememberMe"
                          checked={rememberMe}
                          onCheckedChange={(checked) =>
                            setRememberMe(checked === true)
                          }
                        />

                        <Label
                          htmlFor="rememberMe"
                          className="cursor-pointer text-sm font-normal text-muted-foreground"
                        >
                          Remember me
                        </Label>
                      </div>

                      <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  {/* Terms */}
                  {isSignUp && (
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="termsAccepted"
                        name="termsAccepted"
                        checked={termsAccepted}
                        onCheckedChange={(checked) =>
                          setTermsAccepted(checked === true)
                        }
                        className="mt-1"
                      />

                      <Label
                        htmlFor="termsAccepted"
                        className="cursor-pointer text-sm leading-6 font-normal text-muted-foreground"
                      >
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="font-medium text-primary hover:underline"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="font-medium text-primary hover:underline"
                        >
                          Privacy Policy
                        </Link>
                        .
                      </Label>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
                    >
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full gap-2 rounded-xl font-semibold"
                  >
                    {isSubmitting
                      ? "Please wait..."
                      : isSignUp
                        ? "Create account"
                        : "Sign in"}

                    {!isSubmitting && <ArrowRight size={17} />}
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  {isSignUp
                    ? "Already have an account?"
                    : "Don't have an account?"}

                  <Link
                    href={isSignUp ? "/sign-in" : "/sign-up"}
                    className="ml-2 font-semibold text-primary hover:underline"
                  >
                    {isSignUp ? "Sign in" : "Sign up"}
                  </Link>
                </p>
              </CardContent>
            </Card>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Your information is handled securely.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
