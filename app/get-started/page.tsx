import { redirect } from "next/navigation"

/**
 * "Get Started" entry point — send visitors to onboarding (sign-up).
 */
export default function GetStartedPage() {
  redirect("/sign-up")
}
