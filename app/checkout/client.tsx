"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Lock, CreditCard, Link2, ShieldCheck } from "lucide-react"

import { cn } from "@/lib/utils"

const USD_PRICE = 20
const RATE = 127.6665
const BDT_PRICE = USD_PRICE * RATE

const COUNTRIES = [
  "Bangladesh",
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
]

const formatBdt = (value: number) =>
  `BDT ${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

function BdFlag() {
  return (
    <span
      aria-hidden
      className="relative inline-block h-5 w-7 shrink-0 overflow-hidden rounded-[3px] bg-[#006a4e]"
    >
      <span className="absolute top-1/2 left-[7px] size-2.5 -translate-y-1/2 rounded-full bg-[#f42a41]" />
    </span>
  )
}

function UsFlag() {
  return (
    <span
      aria-hidden
      className="relative inline-block h-5 w-7 shrink-0 overflow-hidden rounded-[3px]"
    >
      <span
        className="absolute inset-0"
        style={{
          background:
            "repeating-linear-gradient(to bottom, #b22234 0 2px, #ffffff 2px 4px)",
        }}
      />
      <span className="absolute top-0 left-0 h-2.5 w-3 bg-[#3c3b6e]" />
    </span>
  )
}

export function CheckoutClient() {
  const router = useRouter()

  const [currency, setCurrency] = React.useState<"bdt" | "usd">("bdt")
  const [email, setEmail] = React.useState("")
  const [cardNumber, setCardNumber] = React.useState("")
  const [expiry, setExpiry] = React.useState("")
  const [cvc, setCvc] = React.useState("")
  const [cardName, setCardName] = React.useState("")
  const [country, setCountry] = React.useState("Bangladesh")
  const [saveInfo, setSaveInfo] = React.useState(false)
  const [emailError, setEmailError] = React.useState("")
  const [paying, setPaying] = React.useState(false)

  const displayPrice = currency === "bdt" ? formatBdt(BDT_PRICE) : `$${USD_PRICE.toFixed(2)}`

  const handleCardNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 16)
    setCardNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "))
  }

  const handleExpiry = (raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4)
    if (digits.length <= 2) {
      setExpiry(digits)
    } else {
      setExpiry(`${digits.slice(0, 2)} / ${digits.slice(2)}`)
    }
  }

  const handlePay = (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address.")
      return
    }
    setEmailError("")
    setPaying(true)
    window.setTimeout(() => {
      router.push(
        `/checkout/success?amount=${USD_PRICE.toFixed(2)}&currency=${currency}`
      )
    }, 900)
  }

  const inputClasses =
    "h-11 w-full rounded-md border border-white/[0.12] bg-[#1a1a1e] px-3.5 text-sm text-white outline-none transition-colors placeholder:text-white/30 focus:border-[#0570de] focus:ring-2 focus:ring-[#0570de]/30"
  const labelClasses =
    "mb-1.5 block text-[11px] font-semibold tracking-[0.08em] text-white/50 uppercase"

  return (
    <main className="min-h-screen bg-[#050506] pb-10 text-white">
      <div className="mx-auto w-full max-w-[960px] px-4 pt-8 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => router.back()}
              className="flex size-9 items-center justify-center rounded-full border border-white/[0.12] text-white/60 transition-colors hover:border-white/25 hover:text-white"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="flex size-9 items-center justify-center rounded-lg border border-white/[0.12] text-white/60">
              <Lock size={14} />
            </span>
          </div>

          <span className="rounded-[4px] bg-[#232328] px-2 py-1 text-[10px] font-bold tracking-[0.08em] text-white/55">
            SANDBOX
          </span>
        </div>

        <div className="mt-10 grid gap-12 md:grid-cols-2">
          {/* Order summary */}
          <section>
            <p className="text-[11px] font-semibold tracking-[0.06em] text-white/45">
              CHOOSE A CURRENCY:
            </p>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCurrency("bdt")}
                aria-pressed={currency === "bdt"}
                className={cn(
                  "flex h-14 items-center gap-2.5 rounded-lg border px-3.5 text-sm font-semibold transition-colors",
                  currency === "bdt"
                    ? "border-white bg-[#141418] text-white"
                    : "border-white/[0.14] bg-[#101013] text-white/60 hover:border-white/30"
                )}
              >
                <BdFlag />
                {formatBdt(BDT_PRICE)}
              </button>

              <button
                type="button"
                onClick={() => setCurrency("usd")}
                aria-pressed={currency === "usd"}
                className={cn(
                  "flex h-14 items-center gap-2.5 rounded-lg border px-3.5 text-sm font-semibold transition-colors",
                  currency === "usd"
                    ? "border-white bg-[#141418] text-white"
                    : "border-white/[0.14] bg-[#101013] text-white/60 hover:border-white/30"
                )}
              >
                <UsFlag />
                ${USD_PRICE.toFixed(2)}
              </button>
            </div>

            <p className="mt-2.5 text-[11px] text-white/35">
              1 USD = {RATE} BDT
            </p>

            <hr className="my-7 border-white/[0.09]" />

            <div className="flex items-center justify-between gap-4">
              <h1 className="text-base font-semibold text-white">
                Hireloop Pro Plan
              </h1>
              <span className="text-base font-semibold text-white">
                {displayPrice}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/40">Access to all features</p>
          </section>

          {/* Payment form */}
          <section className="w-full md:max-w-[400px]">
            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#00d449] text-[15px] font-semibold text-[#04270f] transition-colors hover:bg-[#00c242]"
            >
              <Link2 size={16} />
              link
              <span className="ml-3 flex items-center gap-1 rounded bg-[#5a31f4] px-1.5 py-0.5 text-[9px] font-bold tracking-wide text-white">
                VISA
              </span>
              <span className="text-xs font-semibold">4242</span>
            </button>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/[0.09]" />
              <span className="text-[11px] font-semibold text-white/40">
                OR
              </span>
              <span className="h-px flex-1 bg-white/[0.09]" />
            </div>

            <form onSubmit={handlePay} noValidate>
              <label className={labelClasses} htmlFor="checkout-email">
                <span className="mb-1.5 block text-sm font-medium normal-case tracking-normal text-white/85">
                  Contact information
                </span>
              </label>
              <input
                id="checkout-email"
                type="email"
                autoComplete="email"
                placeholder="email@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={cn(
                  inputClasses,
                  emailError && "border-red-500/60 focus:border-red-500 focus:ring-red-500/25"
                )}
              />
              {emailError ? (
                <p className="mt-1.5 text-xs text-red-400">{emailError}</p>
              ) : null}

              <p className="mt-6 mb-2 text-sm font-medium text-white/85">
                Payment method
              </p>

              <div className="rounded-lg border border-white/[0.12]">
                <div className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-white/85">
                  <CreditCard size={15} className="text-white/50" />
                  Card
                </div>

                <div className="mx-3 mb-3 space-y-3 rounded-md bg-white/[0.03] p-3">
                  <div>
                    <label className={labelClasses} htmlFor="card-number">
                      Card Information
                    </label>
                    <div className="relative">
                      <input
                        id="card-number"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        placeholder="1234 1234 1234 1234"
                        value={cardNumber}
                        onChange={(event) => handleCardNumber(event.target.value)}
                        className={cn(inputClasses, "pr-12")}
                      />
                      <CreditCard
                        size={16}
                        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-white/35"
                      />
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2">
                      <input
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM / YY"
                        value={expiry}
                        onChange={(event) => handleExpiry(event.target.value)}
                        className={inputClasses}
                      />
                      <input
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        placeholder="CVC"
                        value={cvc}
                        onChange={(event) =>
                          setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        className={inputClasses}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses} htmlFor="card-name">
                      Cardholder Name
                    </label>
                    <input
                      id="card-name"
                      autoComplete="cc-name"
                      placeholder="Full name on card"
                      value={cardName}
                      onChange={(event) => setCardName(event.target.value)}
                      className={inputClasses}
                    />
                  </div>

                  <div>
                    <label className={labelClasses} htmlFor="country">
                      Country or Region
                    </label>
                    <div className="relative">
                      <select
                        id="country"
                        value={country}
                        onChange={(event) => setCountry(event.target.value)}
                        className={cn(inputClasses, "cursor-pointer appearance-none pr-9")}
                      >
                        {COUNTRIES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                      <svg
                        aria-hidden
                        viewBox="0 0 16 16"
                        className="pointer-events-none absolute top-1/2 right-3.5 size-3.5 -translate-y-1/2 text-white/40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          d="M4 6l4 4 4-4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-lg border border-white/[0.1] bg-white/[0.03] p-4">
                <input
                  id="save-info"
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(event) => setSaveInfo(event.target.checked)}
                  className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-[#0570de]"
                />
                <div>
                  <label
                    htmlFor="save-info"
                    className="cursor-pointer text-sm font-medium text-white/85"
                  >
                    Save my information for faster checkout
                  </label>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/40">
                    <ShieldCheck size={13} />
                    Pay securely on this site and everywhere Link is accepted.
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={paying}
                className="mt-5 h-12 w-full rounded-md bg-[#0570de] text-[15px] font-semibold text-white transition-colors hover:bg-[#0668c9] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {paying ? "Processing..." : `Pay ${displayPrice}`}
              </button>
            </form>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-28 pb-6 text-center">
          <p className="text-xs text-white/35">Powered by Stripe</p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-white/45">
            <a href="#" className="transition-colors hover:text-white/70">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-white/70">
              Privacy
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}
