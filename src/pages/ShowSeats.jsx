import React, { useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import SectionHeader from "../components/SectionHeader"
import Card from "../components/Card"
import Input from "../components/Input"
import Select from "../components/Select"
import Button from "../components/Button"
import FormRow from "../components/FormRow"
import JsonPreview from "../components/JsonPreview"
import { showSeatsApi } from "../lib/api"
import { useToast } from "../hooks/useToast"

const statusOptions = [
  { label: "Available", value: "AVAILABLE" },
  { label: "Reserved", value: "RESERVED" },
  { label: "Booked", value: "BOOKED" }
]

const ShowSeats = () => {
  const toast = useToast()
  const [addForm, setAddForm] = useState({
    showId: "",
    price: "",
    status: "AVAILABLE"
  })
  const [bulkForm, setBulkForm] = useState({
    showId: "",
    price: "",
    status: "AVAILABLE"
  })
  const [showId, setShowId] = useState("")
  const [availableShowId, setAvailableShowId] = useState("")
  const [seatId, setSeatId] = useState("")
  const [statusUpdate, setStatusUpdate] = useState("AVAILABLE")
  const [addResponse, setAddResponse] = useState(null)
  const [bulkResponse, setBulkResponse] = useState(null)

  const addSeat = useMutation({
    mutationFn: showSeatsApi.add,
    onSuccess: (data) => {
      setAddResponse(data)
      toast.success("Show seat added", "Seat added for the show.")
    },
    onError: (error) => {
      toast.error("Add failed", error?.message || "Unable to add show seat.")
    }
  })

  const addSeats = useMutation({
    mutationFn: showSeatsApi.addSeats,
    onSuccess: (data) => {
      setBulkResponse(data)
      toast.success("Show seats added", "Bulk seats added.")
    },
    onError: (error) => {
      toast.error("Bulk add failed", error?.message || "Unable to add seats.")
    }
  })

  const showSeatsQuery = useQuery({
    queryKey: ["show-seats", showId],
    queryFn: () => showSeatsApi.getByShow(showId),
    enabled: Boolean(showId)
  })

  const availableSeatsQuery = useQuery({
    queryKey: ["show-seats-available", availableShowId],
    queryFn: () => showSeatsApi.getAvailable(availableShowId),
    enabled: Boolean(availableShowId)
  })

  const seatQuery = useQuery({
    queryKey: ["show-seat", seatId],
    queryFn: () => showSeatsApi.getById(seatId),
    enabled: Boolean(seatId)
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => showSeatsApi.updateStatus(id, status),
    onSuccess: (data) => {
      toast.success("Status updated", "Seat status updated.")
      seatQuery.refetch()
      showSeatsQuery.refetch()
    },
    onError: (error) => {
      toast.error("Update failed", error?.message || "Unable to update status.")
    }
  })

  const deleteSeat = useMutation({
    mutationFn: (id) => showSeatsApi.remove(id),
    onSuccess: () => {
      toast.success("Seat removed", "Show seat deleted.")
      showSeatsQuery.refetch()
    },
    onError: (error) => {
      toast.error("Delete failed", error?.message || "Unable to delete seat.")
    }
  })

  const handleChange = (setter) => (field) => (event) => {
    setter((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const submitAdd = (event) => {
    event.preventDefault()
    addSeat.mutate({
      ...addForm,
      showId: Number(addForm.showId),
      price: Number(addForm.price)
    })
  }

  const submitBulk = (event) => {
    event.preventDefault()
    addSeats.mutate({
      ...bulkForm,
      showId: Number(bulkForm.showId),
      price: Number(bulkForm.price)
    })
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Show Seats"
        description="Attach seats and pricing to a show and manage availability."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Add Single Seat" subtitle="POST /show-seats/add">
          <form className="space-y-4" onSubmit={submitAdd}>
            <FormRow>
              <Input
                label="Show ID"
                type="number"
                value={addForm.showId}
                onChange={handleChange(setAddForm)("showId")}
                required
              />
              <Input
                label="Price"
                type="number"
                value={addForm.price}
                onChange={handleChange(setAddForm)("price")}
                required
              />
            </FormRow>
            <Select
              label="Status"
              value={addForm.status}
              onChange={handleChange(setAddForm)("status")}
              options={statusOptions}
            />
            <Button type="submit" disabled={addSeat.isPending}>
              {addSeat.isPending ? "Saving..." : "Add Show Seat"}
            </Button>
          </form>
          <div className="mt-4">
            <JsonPreview data={addResponse} title="Add Response" />
          </div>
        </Card>

        <Card title="Bulk Add Seats" subtitle="POST /show-seats/add-seats">
          <form className="space-y-4" onSubmit={submitBulk}>
            <FormRow>
              <Input
                label="Show ID"
                type="number"
                value={bulkForm.showId}
                onChange={handleChange(setBulkForm)("showId")}
                required
              />
              <Input
                label="Price"
                type="number"
                value={bulkForm.price}
                onChange={handleChange(setBulkForm)("price")}
                required
              />
            </FormRow>
            <Select
              label="Status"
              value={bulkForm.status}
              onChange={handleChange(setBulkForm)("status")}
              options={statusOptions}
            />
            <Button type="submit" disabled={addSeats.isPending}>
              {addSeats.isPending ? "Saving..." : "Add Seats"}
            </Button>
          </form>
          <div className="mt-4">
            <JsonPreview data={bulkResponse} title="Bulk Response" />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="Show Seats" subtitle="GET /show-seats/show/{showId}">
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
              onClick={() => showSeatsQuery.refetch()}
              disabled={!showId || showSeatsQuery.isFetching}
            >
              {showSeatsQuery.isFetching ? "Loading..." : "Fetch Seats"}
            </Button>
            <JsonPreview data={showSeatsQuery.data} title="Seats Response" />
          </div>
        </Card>

        <Card
          title="Available Seats"
          subtitle="GET /show-seats/show/{showId}/available"
        >
          <div className="space-y-4">
            <Input
              label="Show ID"
              type="number"
              value={availableShowId}
              onChange={(event) => setAvailableShowId(event.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => availableSeatsQuery.refetch()}
              disabled={!availableShowId || availableSeatsQuery.isFetching}
            >
              {availableSeatsQuery.isFetching ? "Loading..." : "Fetch Available"}
            </Button>
            <JsonPreview
              data={availableSeatsQuery.data}
              title="Available Response"
            />
          </div>
        </Card>

        <Card title="Seat Actions" subtitle="GET /show-seats/{id}">
          <div className="space-y-4">
            <Input
              label="Show Seat ID"
              type="number"
              value={seatId}
              onChange={(event) => setSeatId(event.target.value)}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => seatQuery.refetch()}
              disabled={!seatId || seatQuery.isFetching}
            >
              {seatQuery.isFetching ? "Loading..." : "Fetch Seat"}
            </Button>
            <Select
              label="Update Status"
              value={statusUpdate}
              onChange={(event) => setStatusUpdate(event.target.value)}
              options={statusOptions}
            />
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() =>
                  updateStatus.mutate({ id: seatId, status: statusUpdate })
                }
                disabled={!seatId || updateStatus.isPending}
              >
                Update Status
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => deleteSeat.mutate(seatId)}
                disabled={!seatId || deleteSeat.isPending}
              >
                Delete Seat
              </Button>
            </div>
            <JsonPreview data={seatQuery.data} title="Seat Response" />
          </div>
        </Card>
      </div>
    </div>
  )
}

export default ShowSeats
