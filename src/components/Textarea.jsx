import React from "react"

const Textarea = ({ label, className = "", ...props }) => {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-600">
      <span className="font-medium text-slate-700">{label}</span>
      <textarea
        className={`min-h-[110px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900/20 ${className}`}
        {...props}
      />
    </label>
  )
}

export default Textarea
