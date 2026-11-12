import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, BadgeCheck, Check } from "lucide-react"

export const metadata: Metadata = { title: "Public / Pricing" }

const FEATURES = [
  "Access to all features",
  "Unlimited job postings",
  "Advanced candidate filtering",
  "Application analytics dashboard",
  "Priority support",
]

const pricingPage = () => {
  return (
    <main className="min-h-screen bg-[#0c0c0d] pb-20">
      <div className="mx-auto w-full max-w-[560px] px-4 pt-12 sm:px-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-white">
            Upgrade to Hireloop Pro
          </h1>
          <p className="mt-2 text-sm text-white/50">
            One simple plan. Every premium recruiting module unlocked.
          </p>
        </div>

        <section className="mt-10 rounded-3xl border border-white/[0.08] bg-[#141318] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:p-10">
          <div className="flex items-center justify-between gap-3">
            <span className="rounded-md bg-[#5c53fe]/15 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-[#8b7cff] uppercase ring-1 ring-[#5c53fe]/40 ring-inset">
              Pro Plan
            </span>
            <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
              <BadgeCheck size={14} />
              7-day free support
            </span>
          </div>

          <div className="mt-6 flex items-end gap-2">
            <span className="text-5xl font-semibold tracking-tight text-white">
              $20.00
            </span>
            <span className="pb-1.5 text-sm text-white/45">/ one-time</span>
          </div>
          <p className="mt-2 text-xs text-white/35">
            1 USD = 127.6665 BDT &middot; BDT 2,553.33
          </p>

          <hr className="my-7 border-white/[0.07]" />

          <ul className="space-y-3.5">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm text-white/70">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#5c53fe]/15">
                  <Check size={12} className="text-[#8b7cff]" />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <Link
            href="/checkout"
            className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_rgba(92,83,254,0.35)] transition-all hover:bg-[#6c63ff]"
          >
            Upgrade to Pro
            <ArrowRight size={16} />
          </Link>

          <p className="mt-4 text-center text-xs text-white/35">
            Secure payment powered by Stripe &middot; Sandbox mode
          </p>
        </section>
      </div>
    </main>
  )
}

export default pricingPage
