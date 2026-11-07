"use client"

import React, { useState } from "react"
import Link from "next/link"

import {
  ArrowRight,
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
import { Separator } from "@/components/ui/separator"

// Form Data Type
export interface AuthFormData {
  name?: string
  email: string
  password: string
  confirmPassword?: string
  termsAccepted?: boolean
  rememberMe?: boolean
  role?: "seeker" | "recruiter"
}

// Props Type
interface AuthFormProps {
  type: "sign-up" | "sign-in"
  onSubmit?: (data: AuthFormData) => Promise<void>
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
      role: formData.get("role")?.toString() as "seeker" | "recruiter",
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

          <Link href="/" className="relative z-10 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600">
              <Sparkles size={23} />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              YourBrand<span className="text-indigo-400">.</span>
            </span>
          </Link>

          <div className="relative z-10 max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-300">
              <Sparkles size={15} />
              Welcome to our platform
            </div>

            <h1 className="text-4xl leading-tight font-bold xl:text-6xl">
              {isSignUp ? (
                <>
                  Start your journey.
                  <span className="mt-2 block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    Build something great.
                  </span>
                </>
              ) : (
                <>
                  Your workspace.
                  <span className="mt-2 block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    Welcome back.
                  </span>
                </>
              )}
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-slate-400">
              {isSignUp
                ? "Create your account and experience a smarter, simpler way to manage everything in one place."
                : "Sign in to your account and continue your journey with everything right where you left it."}
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Simple and intuitive experience",
                "Secure and reliable platform",
                "Everything in one place",
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
            © {new Date().getFullYear()} YourBrand. All rights reserved.
          </p>
        </section>

        {/* RIGHT AUTH SECTION */}
        <section className="flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
          <div className="w-full max-w-[440px]">
            {/* Mobile logo */}
            <Link
              href="/"
              className="mb-10 flex items-center justify-center gap-3 lg:hidden"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Sparkles size={21} />
              </div>
              <span className="text-xl font-bold">YourBrand.</span>
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
                  ? "Enter your information to create your account."
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
                      <Label htmlFor="role">Select your role</Label>

                      <select
                        id="role"
                        name="role"
                        defaultValue="seeker"
                        required
                        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                      >
                        <option value="seeker">Job Seeker</option>
                        <option value="recruiter">Recruiter</option>
                      </select>
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
                    <p role="alert" className="text-sm text-destructive">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full gap-2 font-semibold"
                  >
                    {isSubmitting
                      ? "Please wait..."
                      : isSignUp
                        ? "Create account"
                        : "Sign in"}

                    {!isSubmitting && <ArrowRight size={17} />}
                  </Button>
                </form>

                <div className="my-6">
                  <div className="relative">
                    <Separator />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
                      OR
                    </span>
                  </div>
                </div>

                <p className="text-center text-sm text-muted-foreground">
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
