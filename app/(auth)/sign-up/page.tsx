"use client"

import AuthForm, { type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const handleSignUp = async (data: AuthFormData) => {
    const { error } = await authClient.signUp.email({
      name: data.name!,
      email: data.email,
      password: data.password,
      callbackURL: "/",
    })

    if (error) {
      throw new Error(error.message || "Something went wrong during sign up.")
    }
  }

  return <AuthForm type="sign-up" onSubmit={handleSignUp} />
}
