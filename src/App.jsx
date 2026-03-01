import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"

import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Movies from "./pages/Movies"
import Theatres from "./pages/Theatres"
import Screens from "./pages/Screens"
import Seats from "./pages/Seats"
import Shows from "./pages/Shows"
import ShowSeats from "./pages/ShowSeats"
import Bookings from "./pages/Bookings"
import Payments from "./pages/Payments"
import NotFound from "./pages/NotFound"

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/theatres" element={<Theatres />} />
        <Route path="/screens" element={<Screens />} />
        <Route path="/seats" element={<Seats />} />
        <Route path="/shows" element={<Shows />} />
        <Route path="/show-seats" element={<ShowSeats />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
