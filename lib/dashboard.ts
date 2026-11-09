/**
 * Role -> dashboard route mapping, shared by the navbar and the auth flows so
 * every signed-in user lands on the dashboard that matches their role.
 */
export const ROLE_DASHBOARD_PATH = {
  seeker: "/dashboard/seeker",
  recruiter: "/dashboard/recruiter",
  admin: "/dashboard/admin",
} as const

export type DashboardRoleKey = keyof typeof ROLE_DASHBOARD_PATH

export function getDashboardHref(role?: string | null) {
  return ROLE_DASHBOARD_PATH[(role ?? "seeker") as DashboardRoleKey] ?? ROLE_DASHBOARD_PATH.seeker
}
