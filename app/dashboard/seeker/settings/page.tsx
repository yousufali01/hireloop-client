"use client"

import React from "react"

import { CircleX, FileText, Upload } from "lucide-react"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/* ------------------------------ helpers ----------------------------------- */

function Chip({
  skill,
  onRemove,
}: {
  skill: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-sm text-foreground ring-1 ring-foreground/10">
      {skill}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${skill}`}
        className="text-muted-foreground transition-colors hover:text-foreground"
      >
        <CircleX className="size-3.5" />
      </button>
    </span>
  )
}

/* ------------------------------ page ------------------------------------- */

export default function SettingsPage() {
  const [fullName, setFullName] = React.useState("Jane Doe")
  const [email, setEmail] = React.useState("jane.doe@example.com")
  const [headline, setHeadline] = React.useState("Senior UI/UX Designer")
  const [bio, setBio] = React.useState(
    "Passionate designer with 5+ years of experience crafting user-centric digital experiences..."
  )
  const [skills, setSkills] = React.useState(["Figma", "UI Design", "Prototyping"])
  const [skillInput, setSkillInput] = React.useState("")

  const addSkill = () => {
    const value = skillInput.trim()
    if (!value || skills.includes(value)) return
    setSkills((current) => [...current, value])
    setSkillInput("")
  }

  return (
    <div className="space-y-6">
      <DashboardTopbar />

      <div className="mx-auto max-w-6xl space-y-6 px-2 pb-16 sm:px-4">
        {/* Header */}
        <section className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account details and professional profile.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Profile information */}
            <section className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
              <h2 className="text-xl font-semibold">Profile Information</h2>

              <div className="mt-5 flex items-center gap-5">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-muted-foreground">
                  <FileText className="size-7" />
                </div>
                <div className="space-y-1.5">
                  <Button variant="outline" size="sm" className="h-8">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, GIF or PNG. Max size of 5MB.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-10 bg-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-10 bg-secondary"
                  />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 border-t border-border/50 pt-5">
                <Button
                  size="lg"
                  className="bg-primary font-semibold text-primary-foreground hover:bg-[#6c63ff]"
                >
                  Update Profile
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent">
                  Reset Password
                </Button>
              </div>
            </section>

            {/* Professional details */}
            <section className="rounded-xl bg-card p-6 ring-1 ring-foreground/10">
              <h2 className="text-xl font-semibold">Professional Details</h2>

              <div className="mt-5 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    value={headline}
                    onChange={(event) => setHeadline(event.target.value)}
                    className="h-10 bg-secondary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(event) => setBio(event.target.value)}
                    className="min-h-32 w-full resize-y rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skill-input">Skills</Label>
                  <div className="flex flex-wrap items-center gap-2 rounded-lg border border-input bg-secondary p-2">
                    {skills.map((skill) => (
                      <Chip
                        key={skill}
                        skill={skill}
                        onRemove={() =>
                          setSkills((current) => current.filter((s) => s !== skill))
                        }
                      />
                    ))}
                    <input
                      id="skill-input"
                      value={skillInput}
                      onChange={(event) => setSkillInput(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          addSkill()
                        }
                      }}
                      onBlur={addSkill}
                      placeholder="Add a skill..."
                      className="min-w-28 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-border/50 pt-5">
                <Button
                  size="lg"
                  className="bg-primary font-semibold text-primary-foreground hover:bg-[#6c63ff]"
                >
                  Save Details
                </Button>
              </div>
            </section>
          </div>

          {/* Right column: resume */}
          <section className="h-fit rounded-xl bg-card p-6 ring-1 ring-foreground/10">
            <h2 className="text-xl font-semibold">Resume</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your most recent resume to enable one-click applications.
            </p>

            <div className="mt-5 rounded-xl border border-dashed border-border bg-background/40 p-5">
              <div className="flex flex-col items-center gap-3 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Upload className="size-5" />
                </span>
                <p className="text-sm font-medium">Jane_Doe_Resume_2023.pdf</p>
                <p className="text-xs text-muted-foreground">
                  Last updated 2 days ago + 1.2 MB
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-8">
                    Replace
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn("h-8 border-red-500/30 text-red-400 hover:text-red-400")}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
