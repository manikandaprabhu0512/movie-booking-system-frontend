import React from "react"

const Card = ({ title, subtitle, children, className = "" }) => {
  return (
    <section className={`grid-card rounded-2xl p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

export default Card
