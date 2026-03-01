import axios from "axios"

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
})

export const moviesApi = {
  create: (payload) => api.post("/movies/add-movie", payload).then((r) => r.data),
  getAll: () => api.get("/movies").then((r) => r.data),
  getById: (id) => api.get(`/movies/${id}`).then((r) => r.data),
  update: (id, payload) => api.put(`/movies/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/movies/${id}`).then((r) => r.data)
}

export const theatresApi = {
  create: (payload) =>
    api.post("/theatre/add-theatre", payload).then((r) => r.data),
  getAll: () => api.get("/theatre").then((r) => r.data),
  getById: (id) => api.get(`/theatre/${id}`).then((r) => r.data),
  update: (id, payload) =>
    api.put(`/theatre/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/theatre/${id}`).then((r) => r.data)
}

export const screensApi = {
  create: (payload) => api.post("/api/screens", payload).then((r) => r.data),
  getById: (id) => api.get(`/api/screens/${id}`).then((r) => r.data)
}

export const seatsApi = {
  create: (payload) => api.post("/api/seats", payload).then((r) => r.data),
  getById: (id) => api.get(`/api/seats/${id}`).then((r) => r.data)
}

export const showsApi = {
  create: (payload) =>
    api.post("/theatre-shows/add-show", payload).then((r) => r.data)
}

export const showSeatsApi = {
  add: (payload) => api.post("/show-seats/add", payload).then((r) => r.data),
  addSeats: (payload) =>
    api.post("/show-seats/add-seats", payload).then((r) => r.data),
  getByShow: (showId) =>
    api.get(`/show-seats/show/${showId}`).then((r) => r.data),
  getAvailable: (showId) =>
    api.get(`/show-seats/show/${showId}/available`).then((r) => r.data),
  getById: (id) => api.get(`/show-seats/${id}`).then((r) => r.data),
  updateStatus: (id, status) =>
    api.put(`/show-seats/${id}/status`, null, { params: { status } }).then((r) => r.data),
  remove: (id) => api.delete(`/show-seats/${id}`).then((r) => r.data)
}

export const bookingsApi = {
  create: (payload) => api.post("/bookings/create", payload).then((r) => r.data),
  getById: (id) => api.get(`/bookings/${id}`).then((r) => r.data),
  getByReference: (ref) =>
    api.get(`/bookings/reference/${ref}`).then((r) => r.data),
  getByCustomer: (email) =>
    api.get(`/bookings/customer/${email}`).then((r) => r.data),
  getByShow: (showId) =>
    api.get(`/bookings/show/${showId}`).then((r) => r.data),
  updatePaymentStatus: (id, paymentStatus) =>
    api
      .put(`/bookings/${id}/payment-status`, null, { params: { paymentStatus } })
      .then((r) => r.data),
  confirm: (id) => api.put(`/bookings/${id}/confirm`).then((r) => r.data),
  cancel: (id) => api.delete(`/bookings/${id}/cancel`).then((r) => r.data),
  checkIdempotency: (key) =>
    api.get(`/bookings/check-idempotency`, { params: { idempotencyKey: key } }).then((r) => r.data)
}

export const paymentsApi = {
  create: (payload) => api.post("/payments/create", payload).then((r) => r.data),
  getById: (id) => api.get(`/payments/${id}`).then((r) => r.data),
  getByTransaction: (tx) =>
    api.get(`/payments/transaction/${tx}`).then((r) => r.data),
  getByBooking: (bookingId) =>
    api.get(`/payments/booking/${bookingId}`).then((r) => r.data),
  confirm: (id) => api.post(`/payments/${id}/confirm`).then((r) => r.data),
  refund: (id, refundAmount) =>
    api
      .post(`/payments/${id}/refund`, null, { params: { refundAmount } })
      .then((r) => r.data),
  getPending: () => api.get("/payments/pending").then((r) => r.data)
}
export const healthApi = {
  check: () => api.get("/api/public/health").then((r) => r.data)
}

