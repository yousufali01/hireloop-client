"use client"

import AuthForm, { type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const handleSignIn = async (data: AuthFormData) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/",
    })

    if (error) {
      throw new Error(error.message || "Something went wrong during sign in.")
    }
  }

  return <AuthForm type="signin" onSubmit={handleSignIn} />
}
