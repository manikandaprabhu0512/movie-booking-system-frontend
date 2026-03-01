import React from "react"

const JsonPreview = ({ data, title = "Response" }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-400">
        {title}
      </div>
      <pre className="max-h-72 overflow-auto text-xs text-slate-700">
        {data ? JSON.stringify(data, null, 2) : "No data yet."}
      </pre>
    </div>
  )
}

export default JsonPreview
