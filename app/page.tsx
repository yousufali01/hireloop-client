"use client"

import { useState, type FormEvent } from "react"
import Image from "next/image"
import {
  Search,
  MapPin,
  BriefcaseBusiness,
  Building2,
  UsersRound,
  Star,
} from "lucide-react"

import globeBg from "./images/globe.png"

const trendingPositions = [
  "Product Designer",
  "AI Engineering",
  "Dev-ops Engineer",
]

const statistics = [
  {
    icon: BriefcaseBusiness,
    value: "50K",
    label: "Active Jobs",
  },
  {
    icon: Building2,
    value: "12K",
    label: "Companies",
  },
  {
    icon: UsersRound,
    value: "2M",
    label: "Job Seekers",
  },
  {
    icon: Star,
    value: "97%",
    label: "Satisfaction Rate",
  },
]

export default function HomePage() {
  const [jobTitle, setJobTitle] = useState("")
  const [location, setLocation] = useState("")

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log({
      jobTitle,
      location,
    })
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#030304] text-white">
      {/* FULL HOME PAGE GLOBE BACKGROUND */}

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <Image
          src={globeBg}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>

      {/* HERO CONTENT */}

      <section className="relative z-10 mx-auto flex min-h-[560px] w-full max-w-7xl flex-col items-center px-4 pt-20 pb-0 text-center sm:min-h-[620px] sm:px-6 sm:pt-24 md:pt-28 lg:min-h-[680px] lg:px-8 lg:pt-[135px]">
        {/* Jobs Badge */}

        <div className="relative mb-7 flex items-center justify-center">
          <div className="absolute top-1/2 -left-12 hidden h-px w-12 bg-gradient-to-l from-white/30 to-transparent sm:block" />

          <div className="absolute top-1/2 -right-12 hidden h-px w-12 bg-gradient-to-r from-white/30 to-transparent sm:block" />

          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-[#151515]/90 px-3 py-2 shadow-[0_0_25px_rgba(255,255,255,0.10)] sm:gap-3 sm:px-4 sm:py-2.5">
            <BriefcaseBusiness size={18} className="shrink-0 text-orange-400" />

            <span className="font-mono text-xs font-bold tracking-wide text-white sm:text-sm">
              50,000+
            </span>

            <span className="font-mono text-[10px] tracking-wide text-white/55 sm:text-sm">
              NEW JOBS THIS MONTH
            </span>
          </div>
        </div>

        {/* Main Heading */}

        <h1 className="max-w-4xl text-[34px] leading-[1.15] font-semibold tracking-[-1.5px] text-white sm:text-5xl md:text-[56px] lg:text-[60px]">
          Find Your Dream Job Today
        </h1>

        {/* Description */}

        <p className="mt-4 max-w-[600px] text-sm leading-6 text-white/65 sm:text-base sm:leading-7">
          HireLoop connects top talent with world-class companies. Browse
          thousands of curated opportunities and land your next role — faster.
        </p>

        {/* SEARCH BAR */}

        <div className="mt-8 w-full max-w-[600px] sm:mt-9">
          <form
            onSubmit={handleSearch}
            className="grid w-full grid-cols-1 items-center rounded-xl border border-white/15 bg-[#111111]/95 p-1.5 shadow-[0_0_30px_rgba(0,0,0,0.4)] transition-colors focus-within:border-violet-500/50 sm:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)_auto]"
          >
            {/* Job Title */}

            <div className="flex min-w-0 items-center gap-2.5 px-3 py-1 sm:py-0">
              <Search size={19} className="shrink-0 text-white" />

              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Job title, skill or company"
                aria-label="Job title, skill or company"
                className="h-10 w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/55 sm:text-sm"
              />
            </div>

            {/* Divider */}

            <div className="hidden h-6 w-px bg-white/15 sm:block" />

            {/* Location */}

            <div className="flex min-w-0 items-center gap-2.5 border-t border-white/10 px-3 py-1 sm:border-t-0 sm:px-4 sm:py-0">
              <MapPin size={19} className="shrink-0 text-white" />

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location or Remote"
                aria-label="Location or Remote"
                className="h-10 w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-white/55 sm:text-sm"
              />
            </div>

            {/* Search Button */}

            <button
              type="submit"
              aria-label="Search jobs"
              className="flex h-10 w-full items-center justify-center rounded-lg bg-[#6255ff] text-white transition-all duration-200 hover:bg-[#796eff] hover:shadow-[0_0_15px_rgba(98,85,255,0.45)] sm:h-9 sm:w-9"
            >
              <Search size={21} />
            </button>
          </form>
        </div>

        {/* Trending Positions */}

        <div className="mt-4 flex max-w-full flex-wrap items-center justify-center gap-2">
          <span className="mr-1 text-sm text-white/55">Trending Position</span>

          {trendingPositions.map((position) => (
            <button
              key={position}
              type="button"
              onClick={() => setJobTitle(position)}
              className="rounded-full border border-white/10 bg-[#191919]/90 px-3 py-1.5 text-xs text-white/85 transition-all duration-200 hover:border-violet-500/60 hover:bg-violet-500/15 hover:text-white"
            >
              {position}
            </button>
          ))}
        </div>
      </section>

      {/* ASSISTING TEXT */}

      <section className="relative z-10 mx-auto w-full px-4 pt-8 pb-0 text-center sm:px-6 sm:pt-10 md:pt-12">
        <h2 className="mx-auto max-w-xl text-xl leading-snug font-medium tracking-tight text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] sm:text-2xl md:text-[28px]">
          Assisting over 15,000 job seekers
          <br />
          find their dream positions.
        </h2>
      </section>

      {/* STATISTICS CARDS */}

      <section className="relative z-10 mx-auto mt-14 w-full max-w-[1150px] px-4 pb-8 sm:mt-16 sm:px-6 sm:pb-10 lg:mt-20 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {statistics.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="flex min-h-[105px] flex-col justify-between rounded-xl border border-white/[0.08] bg-gradient-to-br from-[#050505]/95 via-[#101010]/95 to-[#202020]/95 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 sm:min-h-[125px] sm:p-4"
              >
                <Icon size={15} strokeWidth={1.7} className="text-white/90" />

                <div className="mt-3 text-left">
                  <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl md:text-[34px]">
                    {stat.value}
                  </h3>

                  <p className="mt-1.5 text-[10px] text-white/75 sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
