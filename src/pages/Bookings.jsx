import React, { useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import SectionHeader from "../components/SectionHeader"
import Card from "../components/Card"
import Input from "../components/Input"
import Select from "../components/Select"
import Button from "../components/Button"
import FormRow from "../components/FormRow"
import JsonPreview from "../components/JsonPreview"
import { bookingsApi } from "../lib/api"
import { useToast } from "../hooks/useToast"

const paymentStatusOptions = [
  { label: "Unpaid", value: "UNPAID" },
  { label: "Paid", value: "PAID" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Failed", value: "FAILED" }
]

const parseIds = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)

const Bookings = () => {
  const toast = useToast()
  const initialKey = useMemo(() => crypto.randomUUID(), [])
  const [createForm, setCreateForm] = useState({
    showId: "",
    showSeatIds: "",
    idempotencyKey: initialKey,
    customerEmail: "",
    customerPhone: ""
  })
  const [bookingId, setBookingId] = useState("")
  const [bookingRef, setBookingRef] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [showId, setShowId] = useState("")
  const [idempotencyKey, setIdempotencyKey] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("UNPAID")
  const [createResponse, setCreateResponse] = useState(null)

  const createBooking = useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: (data) => {
      setCreateResponse(data)
      toast.success("Booking created", "Booking submitted successfully.")
    },
    onError: (error) => {
      toast.error("Booking failed", error?.message || "Unable to create booking.")
    }
  })

  const bookingQuery = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingsApi.getById(bookingId),
    enabled: Boolean(bookingId)
  })

  const bookingByRefQuery = useQuery({
    queryKey: ["booking-ref", bookingRef],
    queryFn: () => bookingsApi.getByReference(bookingRef),
    enabled: Boolean(bookingRef)
  })

  const bookingByCustomerQuery = useQuery({
    queryKey: ["booking-customer", customerEmail],
    queryFn: () => bookingsApi.getByCustomer(customerEmail),
    enabled: Boolean(customerEmail)
  })

  const bookingByShowQuery = useQuery({
    queryKey: ["booking-show", showId],
    queryFn: () => bookingsApi.getByShow(showId),
    enabled: Boolean(showId)
  })

  const idempotencyQuery = useQuery({
    queryKey: ["booking-idempotency", idempotencyKey],
    queryFn: () => bookingsApi.checkIdempotency(idempotencyKey),
    enabled: Boolean(idempotencyKey)
  })

  const updatePayment = useMutation({
    mutationFn: ({ id, status }) => bookingsApi.updatePaymentStatus(id, status),
    onSuccess: (data) => {
      toast.success("Payment updated", "Booking payment status updated.")
      bookingQuery.refetch()
    },
    onError: (error) => {
      toast.error("Update failed", error?.message || "Unable to update payment.")
    }
  })

  const confirmBooking = useMutation({
    mutationFn: (id) => bookingsApi.confirm(id),
    onSuccess: () => {
      toast.success("Booking confirmed", "Booking confirmed successfully.")
      bookingQuery.refetch()
    },
    onError: (error) => {
      toast.error("Confirm failed", error?.message || "Unable to confirm booking.")
    }
  })

  const cancelBooking = useMutation({
    mutationFn: (id) => bookingsApi.cancel(id),
    onSuccess: () => {
      toast.success("Booking cancelled", "Booking cancelled successfully.")
      bookingQuery.refetch()
    },
    onError: (error) => {
      toast.error("Cancel failed", error?.message || "Unable to cancel booking.")
    }
  })

  const handleCreateChange = (field) => (event) => {
    setCreateForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const submitCreate = (event) => {
    event.preventDefault()
    createBooking.mutate({
      ...createForm,
      showId: Number(createForm.showId),
      showSeatIds: parseIds(createForm.showSeatIds)
    })
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Bookings"
        description="Create and manage bookings, confirmations, and payment status."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Create Booking" subtitle="POST /bookings/create">
          <form className="space-y-4" onSubmit={submitCreate}>
            <FormRow>
              <Input
                label="Show ID"
                type="number"
                value={createForm.showId}
                onChange={handleCreateChange("showId")}
                required
              />
              <Input
                label="Show Seat IDs"
                value={createForm.showSeatIds}
                onChange={handleCreateChange("showSeatIds")}
                hint="Comma-separated show seat IDs"
                required
              />
            </FormRow>
            <FormRow>
              <Input
                label="Customer Email"
                type="email"
                value={createForm.customerEmail}
                onChange={handleCreateChange("customerEmail")}
                required
              />
              <Input
                label="Customer Phone"
                value={createForm.customerPhone}
                onChange={handleCreateChange("customerPhone")}
                required
              />
            </FormRow>
            <Input
              label="Idempotency Key"
              value={createForm.idempotencyKey}
              onChange={handleCreateChange("idempotencyKey")}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={createBooking.isPending}>
                {createBooking.isPending ? "Saving..." : "Create Booking"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setCreateForm((prev) => ({
                    ...prev,
                    idempotencyKey: crypto.randomUUID()
                  }))
                }
              >
                Generate Key
              </Button>
            </div>
          </form>
        </Card>
        <Card title="Latest Response">
          <JsonPreview data={createResponse} />
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Get Booking" subtitle="GET /bookings/{id}">
          <div className="space-y-4">
            <Input
              label="Booking ID"
              type="number"
              value={bookingId}
              onChange={(event) => setBookingId(event.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => bookingQuery.refetch()}
              disabled={!bookingId || bookingQuery.isFetching}
            >
              {bookingQuery.isFetching ? "Loading..." : "Fetch Booking"}
            </Button>
            <Select
              label="Update Payment Status"
              value={paymentStatus}
              onChange={(event) => setPaymentStatus(event.target.value)}
              options={paymentStatusOptions}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={() =>
                  updatePayment.mutate({ id: bookingId, status: paymentStatus })
                }
                disabled={!bookingId || updatePayment.isPending}
              >
                Update Status
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => confirmBooking.mutate(bookingId)}
                disabled={!bookingId || confirmBooking.isPending}
              >
                Confirm Booking
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => cancelBooking.mutate(bookingId)}
                disabled={!bookingId || cancelBooking.isPending}
              >
                Cancel Booking
              </Button>
            </div>
            <JsonPreview data={bookingQuery.data} title="Booking Response" />
          </div>
        </Card>

        <Card title="Find Booking" subtitle="Reference & Customer">
          <div className="space-y-4">
            <Input
              label="Booking Reference"
              value={bookingRef}
              onChange={(event) => setBookingRef(event.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => bookingByRefQuery.refetch()}
              disabled={!bookingRef || bookingByRefQuery.isFetching}
            >
              {bookingByRefQuery.isFetching ? "Loading..." : "Fetch by Reference"}
            </Button>
            <Input
              label="Customer Email"
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => bookingByCustomerQuery.refetch()}
              disabled={!customerEmail || bookingByCustomerQuery.isFetching}
            >
              {bookingByCustomerQuery.isFetching ? "Loading..." : "Fetch by Email"}
            </Button>
            <JsonPreview
              data={bookingByRefQuery.data || bookingByCustomerQuery.data}
              title="Lookup Response"
            />
          </div>
        </Card>

        <Card title="Show + Idempotency">
          <div className="space-y-4">
            <Input
              label="Show ID"
              type="number"
              value={showId}
              onChange={(event) => setShowId(event.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => bookingByShowQuery.refetch()}
              disabled={!showId || bookingByShowQuery.isFetching}
            >
              {bookingByShowQuery.isFetching ? "Loading..." : "Fetch by Show"}
            </Button>
            <Input
              label="Idempotency Key"
              value={idempotencyKey}
              onChange={(event) => setIdempotencyKey(event.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => idempotencyQuery.refetch()}
              disabled={!idempotencyKey || idempotencyQuery.isFetching}
            >
              {idempotencyQuery.isFetching ? "Loading..." : "Check Key"}
            </Button>
            <JsonPreview
              data={bookingByShowQuery.data || idempotencyQuery.data}
              title="Query Response"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Bookings
