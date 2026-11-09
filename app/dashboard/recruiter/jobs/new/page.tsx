"use client"

import * as React from "react"

import {
  Briefcase,
  Check,
  ChevronDown,
  ClipboardList,
  Loader2,
  MapPin,
  Rocket,
  X,
  type LucideIcon,
} from "lucide-react"
import { Toast } from "@base-ui/react/toast"

import { DashboardTopbar } from "@/app/components/dashboard-topbar"

import { createJob, JobsApiError, type JobFormData } from "@/lib/actions/jobs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/* -------------------------------------------------------------------------- */
/*  Form data                                                                 */
/* -------------------------------------------------------------------------- */

type JobFormState = {
  title: string
  company: string
  category: string
  jobType: string
  remoteAllowed: boolean
  location: string
  deadline: string
  minSalary: string
  maxSalary: string
  salaryFrequency: string
  responsibilities: string
  qualifications: string
}

const initialFormState: JobFormState = {
  title: "",
  company: "",
  category: "",
  jobType: "",
  remoteAllowed: false,
  location: "",
  deadline: "",
  minSalary: "",
  maxSalary: "",
  salaryFrequency: "",
  responsibilities: "",
  qualifications: "",
}

const jobCategories = [
  "Software Development",
  "Design & Creative",
  "Marketing",
  "Sales & Business Development",
  "Customer Support",
  "Human Resources",
  "Finance & Accounting",
  "Healthcare",
  "Education & Training",
]

const jobTypes = ["Full-Time", "Part-Time", "Contract", "Internship"]

const salaryFrequencies = [
  "Per Hour",
  "Per Day",
  "Per Week",
  "Per Month",
  "Per Year",
]

/* -------------------------------------------------------------------------- */
/*  Reusable building blocks                                                  */
/* -------------------------------------------------------------------------- */

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-xl bg-card ring-1 ring-foreground/10">
      <div className="flex items-start gap-3 p-5 pb-4 sm:p-6">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            {title}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="p-5 pt-0 sm:p-6 sm:pt-2">{children}</div>
    </section>
  )
}

const inputClasses = cn(
  "h-10 w-full rounded-lg px-3 text-sm",
  "[color-scheme:dark] placeholder:text-muted-foreground"
)

const selectClasses = cn(
  "h-10 w-full appearance-none rounded-lg border border-input bg-transparent px-3 pr-9 text-sm transition-colors outline-none",
  "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 [&>option]:bg-[#1a1a1f]"
)

const textareaClasses = cn(
  "min-h-[140px] w-full resize-y rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm transition-colors outline-none",
  "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
  "dark:bg-input/30"
)

const chevronClasses =
  "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"

const publishButtonClasses = cn(
  "h-11 gap-2 rounded-xl bg-primary px-6 text-base font-semibold text-primary-foreground shadow-[0_10px_30px_rgba(92,83,254,0.4)]",
  "transition-all duration-200 hover:bg-[#6c63ff] hover:shadow-[0_12px_36px_rgba(92,83,254,0.55)]"
)

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function PostJobPage() {
  const [form, setForm] = React.useState<JobFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const { add: addToast } = Toast.useToastManager()

  // Disallow past dates on the deadline picker. Runs in the browser via the
  // ref callback, so SSR stays untouched and hydration stays clean.
  const setDeadlineMin = (element: HTMLInputElement | null) => {
    if (element) element.min = new Date().toISOString().split("T")[0]
  }

  const updateField =
    (field: keyof Omit<JobFormState, "remoteAllowed">) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { value } = event.target
      setForm((prev) => ({ ...prev, [field]: value }))
    }

  const toggleRemote = () =>
    setForm((prev) => ({ ...prev, remoteAllowed: !prev.remoteAllowed }))

  const resetForm = () => setForm(initialFormState)

  const handlePublish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const payload: JobFormData = {
        title: form.title.trim(),
        company: form.company.trim() || "Unknown Company",
        category: form.category,
        jobType: form.jobType,
        remoteAllowed: form.remoteAllowed,
        location: form.location,
        deadline: form.deadline,
        minSalary: form.minSalary,
        maxSalary: form.maxSalary,
        salaryFrequency: form.salaryFrequency,
        responsibilities: form.responsibilities,
        qualifications: form.qualifications,
      }

      const savedJob = await createJob(payload)

      addToast({
        title: "Job published",
        description: `"${savedJob.title}" saved to MongoDB and is now live for candidates.`,
        type: "success",
      })

      setForm(initialFormState)
    } catch (error) {
      addToast({
        title: "Could not publish job",
        description:
          error instanceof JobsApiError
            ? error.message
            : "Something went wrong. Please try again.",
        type: "error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      <DashboardTopbar placeholder="Search for jobs, candidates..." />

      <div className="mx-auto max-w-6xl px-2 pb-16 sm:px-4">
        {/* Create New Listing header */}
        <section className="rounded-xl bg-card p-5 ring-1 ring-foreground/10 sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                Create New Listing
              </span>
              <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Post a New Job
              </h1>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Fill in the position specifications
              </p>
            </div>

            <Button
              type="submit"
              form="post-job-form"
              disabled={isSubmitting}
              className={publishButtonClasses}
            >
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Rocket className="size-5" />
              )}
              Publish Job
            </Button>
          </div>
        </section>

        {/* Form */}
        <form
          id="post-job-form"
          onSubmit={handlePublish}
          className="mt-6 space-y-6"
        >
          {/* 1. Basic Information */}
          <FormSection
            icon={Briefcase}
            title="Basic Information"
            description="Describe the role and where it belongs."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="job-title">
                  Job Title <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="job-title"
                  type="text"
                  required
                  placeholder="e.g. Senior Frontend Engineer"
                  value={form.title}
                  onChange={updateField("title")}
                  className={inputClasses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-name">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company-name"
                  type="text"
                  required
                  placeholder="e.g. TechFlow Solutions"
                  value={form.company}
                  onChange={updateField("company")}
                  className={inputClasses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-category">
                  Job Category <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="job-category"
                    required
                    value={form.category}
                    onChange={updateField("category")}
                    className={selectClasses}
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {jobCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={chevronClasses} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="job-type">
                  Job Type <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <select
                    id="job-type"
                    required
                    value={form.jobType}
                    onChange={updateField("jobType")}
                    className={selectClasses}
                  >
                    <option value="" disabled>
                      Select a type
                    </option>
                    {jobTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={chevronClasses} />
                </div>
              </div>
            </div>
          </FormSection>

          {/* 2. Location, Compensation & Timeline */}
          <FormSection
            icon={MapPin}
            title="Location, Compensation & Timeline"
            description="Tell candidates where the job is and what it pays."
          >
            <div className="space-y-5">
              {/* Remote work toggle */}
              <div className="space-y-2">
                <Label>Remote Work</Label>
                <div className="flex flex-wrap items-center gap-4 rounded-lg border border-input p-4 dark:bg-input/20">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.remoteAllowed}
                    aria-label="Allow remote work"
                    onClick={toggleRemote}
                    className={cn(
                      "relative flex h-7 w-[52px] shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 outline-none",
                      "focus-visible:ring-3 focus-visible:ring-ring/50",
                      form.remoteAllowed
                        ? "bg-primary"
                        : "border border-input bg-muted-foreground/20"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-5 items-center justify-center rounded-full bg-white shadow transition-transform duration-200",
                        form.remoteAllowed
                          ? "translate-x-[24px]"
                          : "translate-x-0"
                      )}
                    >
                      {form.remoteAllowed ? (
                        <Check className="size-3 text-primary" />
                      ) : (
                        <X className="size-3 text-muted-foreground" />
                      )}
                    </span>
                  </button>

                  {form.remoteAllowed ? (
                    <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                      <span className="font-medium text-emerald-400">
                        Remote work is allowed.
                      </span>{" "}
                      Candidates can apply and work from anywhere in the world.
                    </p>
                  ) : (
                    <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Remote work is not allowed.
                      </span>{" "}
                      This position will require on-site attendance.
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="job-location">Job Location</Label>
                  <Input
                    id="job-location"
                    type="text"
                    placeholder="e.g. Dhaka, Bangladesh"
                    value={form.location}
                    onChange={updateField("location")}
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="application-deadline">
                    Application Deadline <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="application-deadline"
                    type="date"
                    required
                    ref={setDeadlineMin}
                    value={form.deadline}
                    onChange={updateField("deadline")}
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="min-salary">Minimum Salary</Label>
                  <Input
                    id="min-salary"
                    type="number"
                    min={0}
                    placeholder="e.g. 35000"
                    value={form.minSalary}
                    onChange={updateField("minSalary")}
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="max-salary">Maximum Salary</Label>
                  <Input
                    id="max-salary"
                    type="number"
                    min={0}
                    placeholder="e.g. 60000"
                    value={form.maxSalary}
                    onChange={updateField("maxSalary")}
                    className={inputClasses}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="salary-frequency">
                    Salary Frequency <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <select
                      id="salary-frequency"
                      required
                      value={form.salaryFrequency}
                      onChange={updateField("salaryFrequency")}
                      className={selectClasses}
                    >
                      <option value="" disabled>
                        Select a frequency
                      </option>
                      {salaryFrequencies.map((frequency) => (
                        <option key={frequency} value={frequency}>
                          {frequency}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className={chevronClasses} />
                  </div>
                </div>
              </div>
            </div>
          </FormSection>

          {/* 3. Responsibilities & Requirements */}
          <FormSection
            icon={ClipboardList}
            title="Responsibilities & Requirements"
            description="Set clear expectations for applicants."
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="key-responsibilities">
                  Key Responsibilities
                </Label>
                <textarea
                  id="key-responsibilities"
                  placeholder="Describe the main duties and responsibilities of the position, e.g. Design, build, and maintain reusable UI components..."
                  value={form.responsibilities}
                  onChange={updateField("responsibilities")}
                  maxLength={2000}
                  className={textareaClasses}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualifications">
                  Qualifications & Requirements
                </Label>
                <textarea
                  id="qualifications"
                  placeholder="Describe the required skills, educational qualifications, experience, and other requirements, e.g. 3+ years of experience with React and TypeScript..."
                  value={form.qualifications}
                  onChange={updateField("qualifications")}
                  maxLength={2000}
                  className={textareaClasses}
                />
              </div>
            </div>
          </FormSection>

          {/* Form actions */}
          <div className="flex flex-col gap-3 pb-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              className="h-11 rounded-xl px-5 text-base font-medium"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={publishButtonClasses}
            >
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Rocket className="size-5" />
              )}
              Publish Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
