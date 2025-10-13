"use client"

import React from "react"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id}>
          <div>
            {t.title && <p className="font-bold">{t.title}</p>}
            {t.description && <p className="text-sm">{t.description}</p>}
          </div>
        </Toast>
      ))}
    </div>
  )
}
