"use client"

import { useRouter } from "next/navigation"
import { Toast } from "@base-ui/react/toast"

import AuthForm, { type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"
import { getDashboardHref } from "@/lib/dashboard"

export default function SignInPage() {
  const router = useRouter()
  const toastManager = Toast.useToastManager()

  const handleSignIn = async (data: AuthFormData) => {
    const { error, data: response } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/",
    })

    if (error) {
      toastManager.add({
        title: "Sign in failed",
        description:
          error.message || "Please check your email and password, then try again.",
        type: "error",
      })

      throw new Error(error.message || "Something went wrong during sign in.")
    }

    toastManager.add({
      title: "Signed in successfully!",
      description: `Welcome back, ${response?.user?.name ?? data.email}.`,
      type: "success",
    })

    // Send each user to the dashboard that matches their role.
    const role = (response?.user as { role?: string } | undefined)?.role
    router.push(getDashboardHref(role))
    router.refresh()
  }

  return <AuthForm type="sign-in" onSubmit={handleSignIn} />
}
