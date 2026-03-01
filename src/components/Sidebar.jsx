import React from "react"
import { NavLink } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { closeSidebar } from "../store/uiSlice"

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Movies", to: "/movies" },
  { label: "Theatres", to: "/theatres" },
  { label: "Screens", to: "/screens" },
  { label: "Seats", to: "/seats" },
  { label: "Shows", to: "/shows" },
  { label: "Show Seats", to: "/show-seats" },
  { label: "Bookings", to: "/bookings" },
  { label: "Payments", to: "/payments" }
]

const Sidebar = () => {
  const dispatch = useDispatch()
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen)

  return (
    <>
      <aside
        className={`fixed left-0 top-0 z-30 h-full w-64 bg-white/90 backdrop-blur-xl border-r border-slate-200 px-6 py-8 shadow-xl transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Movie Hub
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-slate-900">
            Ticket Console
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage shows, seating, bookings, and payments in one place.
          </p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => dispatch(closeSidebar())}
              className={({ isActive }) =>
                `rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-20 bg-slate-900/30 md:hidden"
          onClick={() => dispatch(closeSidebar())}
          aria-label="Close navigation"
        />
      )}
    </>
  )
}

export default Sidebar
