"use client"

import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline"

type ToastStatus = "info" | "success" | "warning" | "error"

type Toast = {
  id?: string
  title: string
  description?: string
  status: ToastStatus
  duration?: number
}

type CreateToast = Exclude<Toast, "id">

type ToastContextInterface = {
  toasts: Toast[]
  newToast: ({ title, description, status, duration }: CreateToast) => void
}

const ToastContext = createContext({} as ToastContextInterface)

const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const newToast = ({
    title,
    description,
    status,
    duration = 5000,
  }: CreateToast) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((toasts) => [...toasts, { id, title, description, status }])

    // delete toast after {duration} ms
    const timeout = setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
    }, duration)

    return () => clearTimeout(timeout)
  }

  return (
    <ToastContext.Provider
      value={{
        newToast,
        toasts,
      }}
    >
      <ToastList toasts={toasts} />
      {children}
    </ToastContext.Provider>
  )
}

const ToastList = ({ toasts }: { toasts: Toast[] }) => (
  <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
    <AnimatePresence>
      {toasts.map((toast, index) => (
        <ToastCard key={index} toast={toast} />
      ))}
    </AnimatePresence>
  </div>
)

const ToastCard = ({ toast }: { toast: Toast }) => {
  const getStatusIcon = {
    info: <InformationCircleIcon className="h-5 w-5 text-blue-500" />,
    success: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    warning: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />,
    error: <ExclamationCircleIcon className="h-5 w-5 text-red-500" />,
  }
  return (
    <motion.div
      className="bg-white shadow-md rounded-md p-4 flex flex-row min-w-[150px]"
      initial={{ x: "130%" }}
      animate={{ x: 0 }}
      transition={{ type: "spring", bounce: 0 }}
      exit={{ x: "130%" }}
    >
      <div className="pt-0.5">{getStatusIcon[toast.status]}</div>
      <div className="pl-2 flex flex-col gap-1">
        <p className="">{toast.title}</p>
        <p className="text-sm">{toast.description}</p>
      </div>
    </motion.div>
  )
}

export const useToast = () => useContext(ToastContext)
export default ToastProvider
