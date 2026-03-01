import React from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import Toasts from "./Toasts"

const Layout = () => {
  return (
    <div className="min-h-screen text-ink">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 min-h-screen">
          <Topbar />
          <main className="px-6 pb-16 pt-6">
            <Outlet />
          </main>
        </div>
      </div>
      <Toasts />
    </div>
  )
}

export default Layout
