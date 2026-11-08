"use client"

import { useRouter } from "next/navigation"
import { Toast } from "@base-ui/react/toast"

import AuthForm, { type AuthFormData } from "@/components/auth-form"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const toastManager = Toast.useToastManager()

  const handleSignUp = async (data: AuthFormData) => {
    const { error, data: response } = await authClient.signUp.email({
      name: data.name!,
      email: data.email,
      password: data.password,
      callbackURL: "/",
      fetchOptions: {
        body: {
          role: data.role || "seeker",
        },
      },
    })

    if (error) {
      toastManager.add({
        title: "Sign up failed",
        description: error.message || "Could not create your account. Please try again.",
        type: "error",
      })

      throw new Error(error.message || "Something went wrong during sign up.")
    }

    toastManager.add({
      title: "Account created!",
      description: `Welcome to Hireloop, ${response?.user?.name ?? data.name}.`,
      type: "success",
    })

    router.push("/")
  }

  return <AuthForm type="sign-up" onSubmit={handleSignUp} />
}
