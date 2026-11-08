"use client"

import { Toast } from "@base-ui/react/toast"
import {
  CircleCheck,
  CircleX,
  Info,
  LoaderCircle,
  XIcon,
} from "lucide-react"

import { cn } from "cn"

function ToastIcon({ type }: { type?: string }) {
  if (type === "success") {
    return (
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15">
        <CircleCheck size={17} className="text-emerald-400" />
      </span>
    )
  }

  if (type === "error") {
    return (
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-red-500/15">
        <CircleX size={17} className="text-red-400" />
      </span>
    )
  }

  if (type === "loading") {
    return (
      <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <LoaderCircle size={17} className="animate-spin text-[#8b7cff]" />
      </span>
    )
  }

  return (
    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15">
      <Info size={17} className="text-[#8b7cff]" />
    </span>
  )
}

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((toast) => (
    <Toast.Root
      key={toast.id}
      toast={toast}
      swipeDirection={["right", "down"]}
      className={cn(
        "relative flex w-full cursor-default flex-col rounded-xl border border-white/[0.1]",
        "bg-[#1a191f]/95 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl",
        "transition-all duration-300",
        "data-starting-style:translate-y-6 data-starting-style:opacity-0",
        "data-ending-style:translate-y-3 data-ending-style:opacity-0"
      )}
    >
      <Toast.Content className="flex items-start gap-3">
        <ToastIcon type={toast.type} />

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Toast.Title className="text-sm leading-5 font-semibold text-white" />
          <Toast.Description className="text-xs leading-5 text-white/60" />
        </div>

        <Toast.Close
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg text-white/40 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:outline-none"
          aria-label="Dismiss notification"
        >
          <XIcon size={15} />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ))
}

export function AppToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Toast.Provider timeout={4000} limit={4}>
      {children}

      <Toast.Portal>
        <Toast.Viewport className="fixed right-4 bottom-4 z-[70] flex w-[calc(100vw-2rem)] flex-col gap-2 sm:right-6 sm:bottom-6 sm:w-[24rem]">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}
