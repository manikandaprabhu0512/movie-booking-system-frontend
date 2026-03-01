import React from "react"

const styles = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900",
  secondary:
    "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 focus-visible:ring-slate-400",
  ghost: "bg-transparent text-slate-600 hover:bg-slate-100",
  danger:
    "bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500"
}

const Button = ({
  children,
  variant = "primary",
  className = "",
  ...props
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        styles[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
