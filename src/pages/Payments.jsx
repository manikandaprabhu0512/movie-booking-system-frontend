import React, { useMemo, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import SectionHeader from "../components/SectionHeader"
import Card from "../components/Card"
import Input from "../components/Input"
import Select from "../components/Select"
import Button from "../components/Button"
import FormRow from "../components/FormRow"
import JsonPreview from "../components/JsonPreview"
import { paymentsApi } from "../lib/api"
import { useToast } from "../hooks/useToast"

const paymentMethods = [
  { label: "Credit Card", value: "CREDIT_CARD" },
  { label: "Debit Card", value: "DEBIT_CARD" },
  { label: "PayPal", value: "PAYPAL" },
  { label: "UPI", value: "UPI" },
  { label: "UPIW", value: "UPIW" },
  { label: "Net Banking", value: "NET_BANKING" },
  { label: "Wallet", value: "WALLET" },
  { label: "Cash", value: "CASH" }
]

const Payments = () => {
  const toast = useToast()
  const initialKey = useMemo(() => crypto.randomUUID(), [])
  const [createForm, setCreateForm] = useState({
    bookingId: "",
    paymentAmount: "",
    paymentMethod: "CREDIT_CARD",
    idempotencyKey: initialKey,
    currency: "USD",
    stripeTokenId: "",
    gatewayReference: ""
  })
  const [paymentId, setPaymentId] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [bookingId, setBookingId] = useState("")
  const [refundAmount, setRefundAmount] = useState("")
  const [createResponse, setCreateResponse] = useState(null)

  const createPayment = useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: (data) => {
      setCreateResponse(data)
      toast.success("Payment created", "Payment initiated successfully.")
    },
    onError: (error) => {
      toast.error("Payment failed", error?.message || "Unable to create payment.")
    }
  })

  const paymentQuery = useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => paymentsApi.getById(paymentId),
    enabled: Boolean(paymentId)
  })

  const transactionQuery = useQuery({
    queryKey: ["payment-tx", transactionId],
    queryFn: () => paymentsApi.getByTransaction(transactionId),
    enabled: Boolean(transactionId)
  })

  const bookingPaymentQuery = useQuery({
    queryKey: ["payment-booking", bookingId],
    queryFn: () => paymentsApi.getByBooking(bookingId),
    enabled: Boolean(bookingId)
  })

  const pendingQuery = useQuery({
    queryKey: ["payment-pending"],
    queryFn: paymentsApi.getPending,
    enabled: false
  })

  const confirmPayment = useMutation({
    mutationFn: (id) => paymentsApi.confirm(id),
    onSuccess: () => {
      toast.success("Payment confirmed", "Payment marked as confirmed.")
      paymentQuery.refetch()
    },
    onError: (error) => {
      toast.error("Confirm failed", error?.message || "Unable to confirm payment.")
    }
  })

  const refundPayment = useMutation({
    mutationFn: ({ id, refundAmount: amount }) =>
      paymentsApi.refund(id, amount),
    onSuccess: () => {
      toast.success("Refund started", "Refund request submitted.")
      paymentQuery.refetch()
    },
    onError: (error) => {
      toast.error("Refund failed", error?.message || "Unable to refund payment.")
    }
  })

  const handleChange = (field) => (event) => {
    setCreateForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const submitCreate = (event) => {
    event.preventDefault()
    createPayment.mutate({
      ...createForm,
      bookingId: Number(createForm.bookingId),
      paymentAmount: Number(createForm.paymentAmount)
    })
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Payments"
        description="Create, confirm, and refund payments."
      />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card title="Create Payment" subtitle="POST /payments/create">
          <form className="space-y-4" onSubmit={submitCreate}>
            <FormRow>
              <Input
                label="Booking ID"
                type="number"
                value={createForm.bookingId}
                onChange={handleChange("bookingId")}
                required
              />
              <Input
                label="Payment Amount"
                type="number"
                value={createForm.paymentAmount}
                onChange={handleChange("paymentAmount")}
                required
              />
            </FormRow>
            <FormRow>
              <Select
                label="Payment Method"
                value={createForm.paymentMethod}
                onChange={handleChange("paymentMethod")}
                options={paymentMethods}
              />
              <Input
                label="Currency"
                value={createForm.currency}
                onChange={handleChange("currency")}
              />
            </FormRow>
            <FormRow>
              <Input
                label="Stripe Token ID"
                value={createForm.stripeTokenId}
                onChange={handleChange("stripeTokenId")}
              />
              <Input
                label="Gateway Reference"
                value={createForm.gatewayReference}
                onChange={handleChange("gatewayReference")}
              />
            </FormRow>
            <Input
              label="Idempotency Key"
              value={createForm.idempotencyKey}
              onChange={handleChange("idempotencyKey")}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={createPayment.isPending}>
                {createPayment.isPending ? "Saving..." : "Create Payment"}
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
        <Card title="Payment Lookup" subtitle="GET /payments/{id}">
          <div className="space-y-4">
            <Input
              label="Payment ID"
              type="number"
              value={paymentId}
              onChange={(event) => setPaymentId(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => paymentQuery.refetch()}
                disabled={!paymentId || paymentQuery.isFetching}
              >
                {paymentQuery.isFetching ? "Loading..." : "Fetch Payment"}
              </Button>
              <Button
                type="button"
                onClick={() => confirmPayment.mutate(paymentId)}
                disabled={!paymentId || confirmPayment.isPending}
              >
                Confirm Payment
              </Button>
            </div>
            <Input
              label="Refund Amount"
              type="number"
              value={refundAmount}
              onChange={(event) => setRefundAmount(event.target.value)}
            />
            <Button
              type="button"
              variant="danger"
              onClick={() =>
                refundPayment.mutate({
                  id: paymentId,
                  refundAmount: Number(refundAmount)
                })
              }
              disabled={!paymentId || !refundAmount || refundPayment.isPending}
            >
              Refund Payment
            </Button>
            <JsonPreview data={paymentQuery.data} title="Payment Response" />
          </div>
        </Card>

        <Card title="Find by Transaction">
          <div className="space-y-4">
            <Input
              label="Transaction ID"
              value={transactionId}
              onChange={(event) => setTransactionId(event.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => transactionQuery.refetch()}
              disabled={!transactionId || transactionQuery.isFetching}
            >
              {transactionQuery.isFetching ? "Loading..." : "Fetch Transaction"}
            </Button>
            <JsonPreview data={transactionQuery.data} title="Transaction Response" />
          </div>
        </Card>

        <Card title="Booking + Pending">
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
              onClick={() => bookingPaymentQuery.refetch()}
              disabled={!bookingId || bookingPaymentQuery.isFetching}
            >
              {bookingPaymentQuery.isFetching ? "Loading..." : "Fetch Booking"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => pendingQuery.refetch()}
            >
              Fetch Pending Payments
            </Button>
            <JsonPreview
              data={bookingPaymentQuery.data || pendingQuery.data}
              title="Lookup Response"
            />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Payments
