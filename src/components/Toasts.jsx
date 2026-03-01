import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { removeToast } from "../store/uiSlice"

const toastStyles = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-rose-200 bg-rose-50 text-rose-700",
  info: "border-sky-200 bg-sky-50 text-sky-700"
}

const Toasts = () => {
  const dispatch = useDispatch()
  const toasts = useSelector((state) => state.ui.toasts)

  useEffect(() => {
    if (!toasts.length) return

    const timers = toasts.map((toast) =>
      setTimeout(() => dispatch(removeToast(toast.id)), 4000)
    )
    return () => timers.forEach((timer) => clearTimeout(timer))
  }, [toasts, dispatch])

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`w-72 rounded-2xl border px-4 py-3 shadow-lg ${
            toastStyles[toast.type]
          }`}
        >
          <p className="text-sm font-semibold">{toast.title}</p>
          <p className="text-xs mt-1">{toast.message}</p>
        </div>
      ))}
    </div>
  )
}

export default Toasts
