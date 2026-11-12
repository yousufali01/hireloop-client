"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ShieldCheck } from "lucide-react"

import { GoToDashboardButton } from "./go-to-dashboard"

function SuccessContent() {
  const searchParams = useSearchParams()
  const isUsd = searchParams.get("currency") === "usd"
  const amount = isUsd
    ? `$${(Number(searchParams.get("amount")) || 20).toFixed(2)}`
    : `BDT ${(((Number(searchParams.get("amount")) || 20) * 127.6665)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const [sessionId, setSessionId] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Generated after mount so server and client markup stay identical.
    const timer = window.setTimeout(() => {
      const chars =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
      const bytes = new Uint8Array(20)
      crypto.getRandomValues(bytes)
      let out = ""
      bytes.forEach((byte) => {
        out += chars[byte % chars.length]
      })
      setSessionId(`cs_test_${out}`)
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center overflow-hidden bg-[#0c0c0d] px-4 py-16">
      <div className="relative w-full max-w-[560px]">
        {/* Glow behind the card */}
        <div
          aria-hidden
          className="absolute -top-14 left-1/2 h-32 w-72 -translate-x-1/2 rounded-full bg-[#1c3fbf]/35 blur-3xl"
        />

        <div className="relative rounded-3xl border border-white/[0.08] bg-[#131316] px-6 py-12 text-center shadow-[0_40px_90px_rgba(0,0,0,0.6)] sm:px-12">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-500/[0.16]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-8 text-emerald-400"
              aria-hidden
            >
              <path d="M4.5 12.5l5 5 10-11" />
            </svg>
          </div>

          <span className="mt-6 inline-block rounded-md bg-[#5c53fe]/15 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] text-[#8b7cff] uppercase ring-1 ring-[#5c53fe]/40 ring-inset">
            Upgrade Successful
          </span>

          <h1 className="mt-4 text-2xl font-semibold text-white">
            Welcome to Hireloop Pro
          </h1>

          <p className="mt-5 text-sm leading-6 text-white/65">
            Your payment of{" "}
            <span className="font-semibold text-white">{amount}</span> was
            received perfectly.
          </p>

          <p className="mt-4 text-sm leading-6 text-white/65">
            All advanced premium recruiting modules are unlocked on your
            account.{" "}
            <span className="font-medium text-emerald-400">
              You may need to re-authenticate to see the effect.
            </span>
          </p>

          <div className="mt-9 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5 text-left">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/[0.12] text-white/60">
              <ShieldCheck size={15} />
            </span>
            <span className="flex-1 text-sm font-medium text-white/85">
              Session ID Verified
            </span>
            <code className="max-w-[150px] truncate rounded-md border border-white/[0.08] bg-[#1a1a1f] px-2 py-1 font-mono text-[11px] text-white/50 sm:max-w-[190px]">
              {sessionId ?? "cs_test_…"}
            </code>
          </div>

          <GoToDashboardButton className="mt-6" />
        </div>
      </div>
    </main>
  )
}

const successPage = () => {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}

export default successPage
