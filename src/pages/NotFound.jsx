import React from "react"
import { Link } from "react-router-dom"
import Button from "../components/Button"

const NotFound = () => {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="glass-panel rounded-3xl p-10 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-slate-900">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-slate-500">
          The route you requested is not configured in this console.
        </p>
        <Link to="/dashboard">
          <Button className="mt-6">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound
