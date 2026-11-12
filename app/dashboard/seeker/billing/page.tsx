"use client"

import {
  Check,
  CreditCard,
  Download,
  Plus,
} from "lucide-react"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"
import { Button } from "@/components/ui/button"

/* ----------------------------- mock data ---------------------------------- */

const planFeatures = [
  "Unlimited Applications",
  "Premium Job Insights",
  "Priority Candidate Badge",
  "Direct Recruiter Messaging",
]

const invoiceHistory = [
  { date: "Sep 24, 2023", plan: "Professional Tier", amount: "$29.00", transactionId: "TRX-943182-HL" },
  { date: "Aug 24, 2023", plan: "Professional Tier", amount: "$29.00", transactionId: "TRX-773928-HL" },
  { date: "Jul 24, 2023", plan: "Professional Tier", amount: "$29.00", transactionId: "TRX-531005-HL" },
  { date: "Jun 24, 2023", plan: "Standard Tier", amount: "$12.00", transactionId: "TRX-220109-HL" },
]

/* ------------------------------ page ------------------------------------- */

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <DashboardTopbar placeholder="Search invoices or plans..." />

      <div className="mx-auto max-w-6xl space-y-8 px-2 pt-6 pb-16 sm:px-4">
        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Subscription &amp; Billing</h1>
          <p className="text-sm text-muted-foreground">
            Manage your professional tier features, recurring payments, and billing history.
          </p>
        </section>

        {/* Plan + payment method */}
        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Current plan */}
          <div className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Current Plan
              </span>
              <div className="text-right">
                <p className="text-3xl font-semibold tracking-tight">
                  $29<span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Next billing date: Oct 24, 2023
                </p>
              </div>
            </div>

            <h3 className="mt-3 text-xl font-semibold">Professional Tier</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Unlock global job insights and unlimited applications.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {planFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
                    <Check className="size-3 text-emerald-500" />
                  </span>
                  {feature}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button className="bg-primary font-semibold text-primary-foreground hover:bg-[#6c63ff]">
                Upgrade Plan
              </Button>
              <Button variant="outline" className="bg-transparent">
                Manage Plan
              </Button>
            </div>
          </div>

          {/* Payment method */}
          <div className="flex flex-col rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold">Payment Method</h3>
              <span className="rounded-full bg-secondary px-3 py-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                Secure by Stripe
              </span>
            </div>

            <div className="relative mx-auto my-6 w-full max-w-md grow overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-linear-to-br from-fuchsia-800 via-purple-950 to-neutral-950 p-5 sm:p-6">
                <div className="absolute -top-8 right-0 size-40 rounded-full bg-fuchsia-500/30 blur-3xl" />
                <div className="flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <span className="h-8 w-11 rounded-md bg-amber-400/90" />
                    <span className="text-sm font-semibold tracking-widest text-white/90">
                      VISA
                    </span>
                  </div>
                  <p className="text-lg tracking-[0.2em] text-white">
                    &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242
                  </p>
                  <div className="flex items-end justify-between text-[10px] tracking-widest text-white/70 uppercase">
                    <div>
                      <p className="text-white/50">Cardholder</p>
                      <p className="text-xs font-semibold text-white">Alexander Seeker</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/50">Expires</p>
                      <p className="text-xs font-semibold text-white">12/25</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Plus className="size-4" />
              Add New Payment Method
            </button>
          </div>
        </section>

        {/* Billing history */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Billing History</h2>
            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Download className="size-4" />
              Export PDF
            </button>
          </div>

          <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Plan</th>
                  <th className="hidden px-5 py-4 font-medium sm:table-cell">Amount</th>
                  <th className="hidden px-5 py-4 font-medium md:table-cell">Transaction ID</th>
                  <th className="px-5 py-4 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoiceHistory.map((invoice) => (
                  <tr
                    key={invoice.transactionId}
                    className="border-t border-border/50 transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-5 py-4">{invoice.date}</td>
                    <td className="px-5 py-4 text-muted-foreground">{invoice.plan}</td>
                    <td className="hidden px-5 py-4 text-muted-foreground sm:table-cell">
                      {invoice.amount}
                    </td>
                    <td className="hidden px-5 py-4 text-muted-foreground md:table-cell">
                      {invoice.transactionId}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="rounded-md bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-500">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Support */}
        <section className="flex flex-col gap-4 rounded-xl bg-card p-6 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold">Need help with your invoice?</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Our support team is available 24/7 to help you resolve any payment issues or
              clarify billing details.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="outline" className="gap-2">
              <CreditCard className="size-4 text-muted-foreground" />
              Contact Support
            </Button>
            <button
              type="button"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Refund Policy
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-col items-center justify-between gap-2 pb-2 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; 2023 HireLoop Inc. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy Policy
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
