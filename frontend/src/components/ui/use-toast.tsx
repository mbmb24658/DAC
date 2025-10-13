"use client"

import * as React from "react"

export type ToastType = {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
}

type ToastContextType = {
  toasts: ToastType[]
  addToast: (toast: Omit<ToastType, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([])

  const addToast = (toast: Omit<ToastType, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts((prev) => [...prev, { id, ...toast }])
    setTimeout(() => removeToast(id), 5000)
  }

  const removeToast = (id: string) =>
    setToasts((prev) => prev.filter((t) => t.id !== id))

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a ToastProvider")
  return ctx
}
