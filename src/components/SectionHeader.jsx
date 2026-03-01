import React from "react"

const SectionHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

export default SectionHeader
